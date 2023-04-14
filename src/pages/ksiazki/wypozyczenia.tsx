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

const Borrowment = ({
  book,
  user,
  createdAt,
  handleEndBorrowment,
}: {
  book: Book;
  user: Reader;
  createdAt: Date;
  handleEndBorrowment: () => void;
}) => {
  const { title, author, publisher, yearOfRelease, availableCopies } = book;
  const { firstName, lastName } = user;
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
      <td className="px-6 py-4">{availableCopies}</td>
      <td className="px-6 py-4">
        {firstName} {lastName}
      </td>
      <td className="px-6 py-4">
        {new Intl.DateTimeFormat("en-US").format(createdAt)}
      </td>
      <td className="py-4 pr-6">
        <button
          onClick={handleEndBorrowment}
          className="mx-2  p-1 text-start font-medium  text-blue-500 hover:underline"
        >
          Zakończ wypożyczenie
        </button>
      </td>
    </tr>
  );
};

const BorrowmentsPage = () => {
  const { data: sessionData } = useSession();
  const role = sessionData?.user.role;
  const hasPermissions = role === "admin";

  const { push } = useRouter();

  const [endingBorrowmentId, setEndingBorrowmentId] = useState<null | number>(
    null
  );

  useEffect(() => {
    if (!hasPermissions) {
      push("/");
    }
  }, [hasPermissions, push]);

  const ctx = api.useContext();
  const { data: borrowments, isLoading } =
    api.borrowments.getAllBorrowments.useQuery();

  const { mutate: endBorrowment, isLoading: isEnding } =
    api.borrowments.endBorrowment.useMutation({
      onSuccess: async () => {
        await ctx.borrowments.getAllBorrowments.invalidate();
        setEndingBorrowmentId(null);
        toast.success("Zakończono wypożyczenie!");
      },
      onError: (e) => {
        setEndingBorrowmentId(null);
        handleApiError(e, "Błąd w zakończaniu wypożyczenia");
      },
    });

  return (
    <>
      <Head>
        <title>Wypożyczone książki</title>
        <meta
          name="description"
          content="Podstrona z wypożyczonymi książkami"
        />
      </Head>
      <h1 className="mx-auto mt-11 w-3/4 max-w-5xl text-5xl font-bold text-slate-200">
        Wypożyczone książki
      </h1>
      {endingBorrowmentId && (
        <ConfirmModal
          handleClose={() => setEndingBorrowmentId(null)}
          question="Czy napewno zakończyć wypożyczenie"
          isLoading={isEnding}
          handleConfirm={() => {
            endBorrowment({ id: endingBorrowmentId });
          }}
        />
      )}
      <div className="relative mx-auto mt-11 w-3/4 max-w-5xl overflow-x-auto shadow-md sm:rounded-lg">
        {isLoading && <Spinner />}
        <Table
          colNames={[
            "Tytuł",
            "Autor",
            "Wydawnictwo",
            "Rok wydania",
            "Dostępne egzemplarze",
            "Wypożyczający",
            "Data wypożyczenia",
            "Akcje",
          ]}
        >
          {borrowments?.length &&
            borrowments.map((borrowment) => (
              <Borrowment
                key={borrowment.id}
                {...borrowment}
                handleEndBorrowment={() => setEndingBorrowmentId(borrowment.id)}
              />
            ))}
        </Table>
      </div>
    </>
  );
};

export default BorrowmentsPage;
