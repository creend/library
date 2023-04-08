import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { prisma } from "~/server/db";
import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import { api } from "~/utils/api";
import Head from "next/head";
import Table from "~/components/table";
import { useSession } from "next-auth/react";

const Book = ({
  author,
  availableCopies,
  publisher,
  title,
  yearOfRelease,
  role,
}: {
  id: number;
  title: string;
  author: string;
  publisher: string;
  yearOfRelease: number;
  availableCopies: number;
  role?: string;
}) => {
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
      {role && (
        <td className="py-4 pr-6">
          {
            <div className="flex justify-start">
              {role === "admin" ? (
                <>
                  <button className="mx-2 p-1 font-medium  text-blue-500 hover:underline">
                    Edytuj
                  </button>
                  <button className="mx-2 p-1 font-medium  text-red-500 hover:underline">
                    Usuń
                  </button>
                </>
              ) : (
                <>
                  <button className="mx-2 p-1 font-medium  text-blue-500 hover:underline">
                    Zarezerwuj
                  </button>
                </>
              )}
            </div>
          }
        </td>
      )}
    </tr>
  );
};

const BooksPage = () => {
  const { data: books } = api.books.getBooks.useQuery();
  const session = useSession();
  const role = session.data?.user.role;
  const canEdit = role === "admin";

  return (
    <>
      <Head>
        <title>Książki</title>
        <meta name="description" content="Podstrona do dodawania książek" />
      </Head>
      <h1 className="mx-auto mt-11 w-3/4 max-w-5xl text-5xl font-bold text-slate-200">
        Lista książek
      </h1>
      {books?.length && (
        <div className="relative mx-auto mt-11 w-3/4 max-w-5xl overflow-x-auto shadow-md sm:rounded-lg">
          <Table
            colNames={[
              "Tytuł",
              "Autor",
              "Wydawnictwo",
              "Rok wydania",
              "Dostępne egzemplarze",
              ...(role ? ["Akcje"] : []),
            ]}
          >
            {books.map((book) => (
              <Book key={book.id} {...book} role={role} />
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
  await ssg.books.getBooks.prefetch();
  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
}

export default BooksPage;
