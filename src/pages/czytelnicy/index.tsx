/* eslint-disable @typescript-eslint/unbound-method */
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Spinner from "~/components/spinner";
import Table from "~/components/table";
import { api } from "~/utils/api";

const Reader = ({
  address,
  idDocumentNumber,
  lastName,
  firstName,
  username,
}: {
  username: string;
  firstName: string;
  lastName: string;
  idDocumentNumber: string;
  address: string;
}) => {
  return (
    <tr className="border-b border-gray-700 bg-gray-800 hover:bg-gray-600">
      <th
        scope="row"
        className="whitespace-nowrap px-6 py-4 font-medium text-white"
      >
        {username}
      </th>
      <td className="px-6 py-4">
        {firstName} {lastName}
      </td>
      <td className="px-6 py-4">{idDocumentNumber}</td>
      <td className="px-6 py-4">{address}</td>
    </tr>
  );
};

const ReadersPage = () => {
  const { data: readers, isLoading } = api.readers.getReaders.useQuery();

  const { data: sessionData, status } = useSession();
  const role = sessionData?.user.role;
  const hasPermissions = role === "admin";

  const { push } = useRouter();

  useEffect(() => {
    if (status !== "loading") {
      if (!hasPermissions) {
        push("/");
      }
    }
  }, [hasPermissions, push, status]);

  return (
    <>
      <Head>
        <title>Czytelnicy</title>
        <meta name="description" content="Podstrona do dodawania książek" />
      </Head>
      <h1 className="mx-auto mt-11 w-3/4 max-w-5xl text-5xl font-bold text-slate-200">
        Lista czytelników
      </h1>
      {hasPermissions && (
        <div className="relative mx-auto mt-11 w-3/4 max-w-5xl overflow-x-auto shadow-md sm:rounded-lg">
          {isLoading && <Spinner />}
          <Table
            colNames={[
              "Nazwa użytkownika",
              "Imie i nazwisko",
              "Numer dokumentu tożsamości",
              "Adres",
            ]}
          >
            {readers?.length &&
              readers.map((reader) => <Reader key={reader.id} {...reader} />)}
          </Table>
        </div>
      )}
    </>
  );
};

export default ReadersPage;
