import { type NextPage, type GetStaticPropsContext } from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { prisma } from "~/server/db";
import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import { api } from "~/utils/api";
import Link from "next/link";
import Spinner from "~/components/spinner";
import Head from "next/head";

const Book = ({
  author,
  availableCopies,
  publisher,
  title,
  yearOfRelease,
  id,
}: {
  id: number;
  title: string;
  author: string;
  publisher: string;
  yearOfRelease: number;
  availableCopies: number;
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
    </tr>
  );
};

const BooksPage = () => {
  const { data: books, isLoading } = api.books.getBooks.useQuery();

  return (
    <>
      <Head>
        <title>Książki</title>
        <meta name="description" content="Podstrona do dodawania książek" />
      </Head>
      {books?.length && (
        <div className="relative mx-auto mt-11 w-3/4 max-w-5xl overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className=" bg-gray-700 text-xs  uppercase text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Tytuł
                </th>
                <th scope="col" className="px-6 py-3">
                  Autor
                </th>
                <th scope="col" className="px-6 py-3">
                  Wydawnictwo
                </th>
                <th scope="col" className="px-6 py-3">
                  Rok wydania
                </th>
                <th scope="col" className="px-6 py-3">
                  Dostępne egzemplarze
                </th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <Book key={book.id} {...book} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export async function getStaticProps(context: GetStaticPropsContext) {
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
