/* eslint-disable @typescript-eslint/unbound-method */
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmModal from "~/components/ui/modal";
import Spinner from "~/components/ui/spinner";
import Table from "~/components/ui/table";
import { handleApiError } from "~/helpers/api-error-handler";
import { api } from "~/utils/api";

interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  yearOfRelease: number;
  availableCopies: number;
}

interface Reader {
  username: string;
  firstName: string;
  lastName: string;
  idDocumentNumber: string;
  address: string;
}

const Borrowment = ({ book, createdAt }: { book: Book; createdAt: Date }) => {
  const { title, author, publisher, yearOfRelease } = book;
  return (
    <tr className="border-b border-gray-700 bg-gray-800 hover:bg-gray-600">
      <th
        scope="row"
        className="whitespace-nowrap px-6 py-4 font-medium text-white"
      >
        {title}
      </th>
      <td className="px-6 py-4">{author}</td>
      <td className="px-6 py-4">{publisher}</td>
      <td className="px-6 py-4">{yearOfRelease}</td>
      <td className="px-6 py-4">
        {new Intl.DateTimeFormat("en-US").format(createdAt)}
      </td>
    </tr>
  );
};

const MyBorrowmentsPage = () => {
  const { data: sessionData, status } = useSession();
  const role = sessionData?.user.role;
  const hasPermissions = status === "authenticated" && role !== "admin";
  const username = sessionData?.user.username;

  const { push } = useRouter();

  useEffect(() => {
    if (!hasPermissions) {
      push("/");
    }
  }, [hasPermissions, push]);

  const ctx = api.useContext();
  const { data: borrowments, isLoading } =
    api.borrowments.getBorrowmentsByUsername.useQuery({
      username: username ?? "",
    });

  return (
    <>
      <Head>
        <title>Wypożyczone książki | {username}</title>
        <meta
          name="description"
          content="Podstrona z wypożyczonymi książkami"
        />
      </Head>
      <h1 className="mx-auto mt-11 w-3/4 max-w-5xl text-5xl font-bold text-slate-200">
        Wypożyczone książki
      </h1>
      <div className="relative mx-auto mt-11 w-3/4 max-w-5xl overflow-x-auto shadow-md sm:rounded-lg">
        {isLoading && <Spinner />}
        <Table
          colNames={[
            "Tytuł",
            "Autor",
            "Wydawnictwo",
            "Rok wydania",
            "Data wypożyczenia",
          ]}
        >
          {borrowments?.length &&
            borrowments.map((borrowment) => (
              <Borrowment key={borrowment.id} {...borrowment} />
            ))}
        </Table>
      </div>
    </>
  );
};

export default MyBorrowmentsPage;
