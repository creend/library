/* eslint-disable @typescript-eslint/unbound-method */
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "~/components/spinner";
import Table from "~/components/table";
import { api } from "~/utils/api";
import { getServerAuthSession } from "../api/auth/[...nextauth]";
import { type GetServerSideProps } from "next";
import { toast } from "react-hot-toast";
import ConfirmModal from "~/components/modal";

const Reader = ({
  address,
  idDocumentNumber,
  lastName,
  firstName,
  username,
  handleDelete,
}: {
  username: string;
  firstName: string;
  lastName: string;
  idDocumentNumber: string;
  address: string;
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
  const { data: readers, isLoading } = api.readers.getReaders.useQuery();
  const [removingReaderUsername, setRemovingReaderUsername] = useState<
    null | string
  >(null);

  const { data: sessionData } = useSession();
  const role = sessionData?.user.role;
  const hasPermissions = role === "admin";

  const { push } = useRouter();

  useEffect(() => {
    if (!hasPermissions) {
      push("/");
    }
  }, [hasPermissions, push]);

  const ctx = api.useContext();

  const { mutateAsync, isLoading: isRemoving } =
    api.readers.removeReader.useMutation({
      onSuccess: async () => {
        await ctx.readers.getReaders.invalidate();
        toast.success("Usunięto czytelnika!");
      },
      onError: (e) => {
        let errorMessage = "Błąd w usuwaniu czytelnika";
        if (e?.message) {
          errorMessage = e.message;
        } else {
          const errorMessages = e.data?.zodError?.fieldErrors.content;
          if (errorMessages && errorMessages[0]) {
            errorMessage = errorMessages[0];
          }
        }
        toast.error(errorMessage);
      },
    });

  if (!hasPermissions) return null;

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
          handleConfirm={async () => {
            await mutateAsync({ username: removingReaderUsername });
            setRemovingReaderUsername(null);
          }}
        />
      )}
      {hasPermissions && (
        <div className="relative mx-auto mt-11 w-3/4 max-w-5xl overflow-x-auto shadow-md sm:rounded-lg">
          {(isLoading || isRemoving) && <Spinner />}
          <Table
            colNames={[
              "Nazwa użytkownika",
              "Imie i nazwisko",
              "Numer dokumentu tożsamości",
              "Adres",
              "",
            ]}
          >
            {readers?.length &&
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
      )}
    </>
  );
};

export default ReadersPage;
