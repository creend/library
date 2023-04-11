import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { prisma } from "~/server/db";
import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import { api } from "~/utils/api";
import Head from "next/head";
import Table from "~/components/table";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import Spinner from "~/components/spinner";
import EditBookForm from "~/components/forms/edit-book";
import { useState } from "react";
import ConfirmModal from "~/components/modal";
import { handleApiError } from "~/helpers/api-error-handler";

interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  yearOfRelease: number;
  availableCopies: number;
}

type AdminBookProps = {
  role: "admin";
  handleDelete: () => void;
  handleEdit: () => void;
} & Book;

type UserBookProps = {
  role: "user";
  handleReservation: () => void;
} & Book;

type GuestBookProps = {
  role: "guest";
} & Book;

const Book = ({
  author,
  availableCopies,
  publisher,
  title,
  yearOfRelease,
  role,
  id,
  ...handlers
}: AdminBookProps | UserBookProps | GuestBookProps) => {
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
      {role !== "guest" && (
        <td className="py-4 pr-6">
          {
            <div className="flex justify-start">
              {role === "admin" && "handleEdit" in handlers ? (
                <>
                  <button
                    className="mx-2 p-1 font-medium  text-blue-500 hover:underline"
                    onClick={handlers.handleEdit}
                  >
                    Edytuj
                  </button>
                  <button
                    className="mx-2 p-1 font-medium  text-red-500 hover:underline"
                    onClick={handlers.handleDelete}
                  >
                    Usuń
                  </button>
                </>
              ) : (
                <>
                  {"handleReservation" in handlers && (
                    <button
                      onClick={handlers.handleReservation}
                      className="mx-2 p-1 font-medium  text-blue-500 hover:underline"
                    >
                      Zarezerwuj
                    </button>
                  )}
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
  const [edittingBookId, setEdittingBookId] = useState<number | null>(null);
  const [removingBookId, setRemovingBookId] = useState<number | null>(null);
  const [reservatingBookId, setReservatingBookId] = useState<number | null>(
    null
  );

  const { data: books } = api.books.getBooks.useQuery();
  const session = useSession();
  const role = session.data?.user.role;

  const ctx = api.useContext();

  const { mutateAsync, isLoading: isRemoving } =
    api.books.removeBook.useMutation({
      onSuccess: async () => {
        await ctx.books.getBooks.invalidate();
        toast.success("Usunięto książke!");
      },
      onError: handleApiError("Błąd w usuwaniu książki"),
    });
  const { mutate: reservate, isLoading: isReservating } =
    api.reservations.createReservation.useMutation({
      onSuccess: async () => {
        await ctx.books.getBooks.invalidate();
        toast.success("Utworzono rezerwacje !");
        setReservatingBookId(null);
      },
      onError: handleApiError("Błąd w tworzeniu rezerwacji"),
    });
  return (
    <>
      <Head>
        <title>Książki</title>
        <meta name="description" content="Podstrona do dodawania książek" />
      </Head>
      <h1 className="mx-auto mt-11 w-3/4 max-w-5xl text-5xl font-bold text-slate-200">
        Lista książek
      </h1>
      {edittingBookId && (
        <EditBookForm
          id={edittingBookId}
          handleFormClose={() => setEdittingBookId(null)}
        />
      )}

      {removingBookId && (
        <ConfirmModal
          handleClose={() => setRemovingBookId(null)}
          question="Czy napewno usunąć książke"
          isLoading={isRemoving}
          handleConfirm={async () => {
            await mutateAsync({ id: removingBookId });
            setRemovingBookId(null);
          }}
        />
      )}

      {reservatingBookId && (
        <ConfirmModal
          handleClose={() => setReservatingBookId(null)}
          question="Czy napewno zarezerwować książke"
          variant="neutral"
          isLoading={isReservating}
          handleConfirm={async () => {
            if (session.data?.user) {
              reservate({
                bookId: reservatingBookId,
                username: session.data.user.username,
              });
            }
          }}
        />
      )}

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
            {role === "admin" &&
              books.map((book) => (
                <Book
                  key={book.id}
                  {...book}
                  role="admin"
                  handleDelete={() => {
                    setRemovingBookId(book.id);
                  }}
                  handleEdit={() => {
                    setEdittingBookId(book.id);
                  }}
                />
              ))}
            {role === "normal" &&
              books.map((book) => (
                <Book
                  key={book.id}
                  {...book}
                  role="user"
                  handleReservation={() => {
                    setReservatingBookId(book.id);
                  }}
                />
              ))}
            {!role &&
              books.map((book) => (
                <Book key={book.id} {...book} role="guest" />
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
