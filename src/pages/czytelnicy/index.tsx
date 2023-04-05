import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import Head from "next/head";
import superjson from "superjson";
import Table from "~/components/table";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
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
  const { data: readers } = api.readers.getReaders.useQuery();
  console.log(readers);
  return (
    <>
      <Head>
        <title>Czytelnicy</title>
        <meta name="description" content="Podstrona do dodawania książek" />
      </Head>
      <h1 className="mx-auto mt-11 w-3/4 max-w-5xl text-2xl font-semibold text-slate-200">
        Lista czytelników
      </h1>
      {readers?.length && (
        <div className="relative mx-auto mt-11 w-3/4 max-w-5xl overflow-x-auto shadow-md sm:rounded-lg">
          <Table
            colNames={[
              "Nazwa użytkownika",
              "Imie i nazwisko",
              "Numer dokumentu tożsamości",
              "Adres",
            ]}
          >
            {readers.map((reader) => (
              <Reader key={reader.id} {...reader} />
            ))}
          </Table>
        </div>
      )}
    </>
  );
};

export async function getStaticProps() {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, session: null },
    transformer: superjson,
  });
  await ssg.readers.getReaders.prefetch();
  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
}

export default ReadersPage;
