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
  handleReservationCancel: () => void;
}

const Book = ({
  author,
  availableCopies,
  publisher,
  title,
  yearOfRelease,

  handleReservationCancel,
}: Book) => {
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
      <td className="py-4 pr-6">
        {
          <button
            className="mx-2  p-1 text-start font-medium  text-red-500 hover:underline"
            onClick={handleReservationCancel}
          >
            Cofnij rezerwacje
          </button>
        }
      </td>
    </tr>
  );
};

const ReservatedBooksPage = () => {
  const session = useSession();
  const username = session.data?.user.username || "";
  const { data: reservations, isLoading } =
    api.reservations.getReservationsByUsername.useQuery({
      username: username,
    });
  const ctx = api.useContext();

  const [cancellingReservationId, setCancellingReservationId] = useState<
    number | null
  >(null);

  const { mutateAsync, isLoading: isCancelling } =
    api.reservations.removeReservation.useMutation({
      onSuccess: async () => {
        await ctx.reservations.getReservationsByUsername.invalidate({
          username,
        });
        toast.success("Wycofano rezerwacje!");
      },
      onError: handleApiError("Błąd w wycofaniu rezerwacji"),
    });

  return (
    <>
      <Head>
        <title>Zarezerwowane książki | {session.data?.user.username}</title>
        <meta
          name="description"
          content="Podstrona z zarezerwowanymi książkami"
        />
      </Head>
      <h1 className="mx-auto mt-11 w-3/4 max-w-5xl text-5xl font-bold text-slate-200">
        Zarezerwowane książki
      </h1>
      {cancellingReservationId && (
        <ConfirmModal
          handleClose={() => setCancellingReservationId(null)}
          question="Czy napewno wycofać rezerwacje?"
          isLoading={isCancelling}
          handleConfirm={async () => {
            await mutateAsync({ id: cancellingReservationId });
            setCancellingReservationId(null);
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
            "Akcje",
          ]}
        >
          {reservations?.length &&
            reservations.map((reservation) => (
              <Book
                key={reservation.id}
                {...reservation.book}
                handleReservationCancel={() =>
                  setCancellingReservationId(reservation.id)
                }
              />
            ))}
        </Table>
      </div>
    </>
  );
};

export default ReservatedBooksPage;
