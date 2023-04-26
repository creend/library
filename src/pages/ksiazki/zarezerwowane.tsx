import { api } from "~/utils/api";
import Head from "next/head";
import Table from "~/components/ui/table";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import Spinner from "~/components/ui/spinner";
import { useState } from "react";
import ConfirmModal from "~/components/ui/modal";
import { handleApiError } from "~/helpers/api-error-handler";
import Link from "next/link";
import { type Book as BookType } from "@prisma/client";
import Book from "~/components/book";
import { getServerAuthSession } from "../api/auth/[...nextauth]";
import { type GetServerSideProps } from "next";

const Reservation = ({
  author,
  availableCopies,
  publisher,
  title,
  yearOfRelease,
  id,
  handleReservationCancel,
}: BookType & { handleReservationCancel: () => void }) => {
  return (
    <Book
      author={author}
      availableCopies={availableCopies}
      id={id}
      publisher={publisher}
      title={title}
      yearOfRelease={yearOfRelease}
      renderMoreCols={() => (
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
      )}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: { session },
  };
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

  const { mutate, isLoading: isCancelling } =
    api.reservations.removeReservation.useMutation({
      onSuccess: async () => {
        await ctx.reservations.getReservationsByUsername.invalidate({
          username,
        });
        setCancellingReservationId(null);
        toast.success("Wycofano rezerwacje!");
      },
      onError: (e) => {
        setCancellingReservationId(null);
        handleApiError(e, "Błąd w wycofaniu rezerwacji");
      },
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
          handleConfirm={() => {
            mutate({ id: cancellingReservationId });
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
          {!!reservations?.length
            ? reservations.map((reservation) => (
                <Reservation
                  key={reservation.id}
                  {...reservation.book}
                  handleReservationCancel={() =>
                    setCancellingReservationId(reservation.id)
                  }
                />
              ))
            : null}
        </Table>
        {!isLoading && !reservations?.length && (
          <Link href="/ksiazki" className="block w-full">
            <p className="p-6 text-center text-blue-500">
              Nie masz żadnych rezerwacji, przejdź do listy książek
            </p>
          </Link>
        )}
      </div>
    </>
  );
};

export default ReservatedBooksPage;
