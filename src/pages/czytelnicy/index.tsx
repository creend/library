/* eslint-disable @typescript-eslint/unbound-method */
import Head from "next/head";
import { useState } from "react";
import Spinner from "~/components/ui/spinner";
import Table from "~/components/ui/table";
import { api } from "~/utils/api";
import { getServerAuthSession } from "../api/auth/[...nextauth]";
import { type GetServerSideProps } from "next";
import { toast } from "react-hot-toast";
import ConfirmModal from "~/components/ui/modal";
import { handleApiError } from "~/helpers/api-error-handler";
import { type User } from "@prisma/client";

export type Reader = Omit<
  User,
  "passwordHash" | "roleId" | "createdAt" | "updatedAt" | "passwordHash"
>;

const Reader = ({
  address,
  idDocumentNumber,
  lastName,
  firstName,
  username,
  handleDelete,
}: Reader & {
  handleDelete: () => void;
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
      <td className="px-6 py-4">
        <button
          className="p-1 font-medium  text-red-500 hover:underline"
          onClick={handleDelete}
        >
          Usuń
        </button>{" "}
      </td>
    </tr>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: { session },
  };
};

const ReadersPage = () => {
  const { data: readers, isLoading: isFetching } =
    api.readers.getReaders.useQuery();
  const [removingReaderUsername, setRemovingReaderUsername] = useState<
    null | string
  >(null);

  const ctx = api.useContext();

  const { mutate, isLoading: isRemoving } =
    api.readers.removeReader.useMutation({
      onSuccess: async () => {
        await ctx.readers.getReaders.invalidate();
        setRemovingReaderUsername(null);
        toast.success("Usunięto czytelnika!");
      },
      onError: (e) => {
        setRemovingReaderUsername(null);
        handleApiError(e, "Błąd w usuwaniu czytelnika");
      },
    });

  const isLoading = isFetching || isRemoving;

  return (
    <>
      <Head>
        <title>Czytelnicy</title>
        <meta name="description" content="Podstrona do dodawania książek" />
      </Head>
      <h1 className="mx-auto mt-11 w-3/4 max-w-5xl text-5xl font-bold text-slate-200">
        Lista czytelników
      </h1>
      {removingReaderUsername && (
        <ConfirmModal
          handleClose={() => setRemovingReaderUsername(null)}
          question="Czy napewno usunąć czytelnika"
          isLoading={isRemoving}
          handleConfirm={() => {
            mutate({ username: removingReaderUsername });
          }}
        />
      )}
      <div className="relative mx-auto mt-11 w-3/4 max-w-5xl overflow-x-auto shadow-md sm:rounded-lg">
        {isLoading && <Spinner />}
        <Table
          colNames={[
            "Nazwa użytkownika",
            "Imie i nazwisko",
            "Numer dokumentu tożsamości",
            "Adres",
            "",
          ]}
        >
          {!!readers?.length &&
            readers.map((reader) => (
              <Reader
                handleDelete={() => {
                  setRemovingReaderUsername(reader.username);
                }}
                key={reader.id}
                {...reader}
              />
            ))}
        </Table>
      </div>
    </>
  );
};

export default ReadersPage;
