/* eslint-disable @typescript-eslint/unbound-method */
import Head from "next/head";
import { useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmModal from "~/components/ui/modal";
import Spinner from "~/components/ui/spinner";
import Table from "~/components/ui/table";
import { handleApiError } from "~/helpers/api-error-handler";
import { api } from "~/utils/api";
import { type Book as BookType } from "@prisma/client";
import { type Reader } from "../czytelnicy";
import Book from "~/components/book";
import { getServerAuthSession } from "../api/auth/[...nextauth]";
import { GetServerSideProps } from "next";

const Reservation = ({
  book,
  user,
  createdAt,
  handleConfirm,
  handleReject,
}: {
  book: BookType;
  user: Reader;
  createdAt: Date;
  handleReject: () => void;
  handleConfirm: () => void;
}) => {
  const { title, author, publisher, yearOfRelease, availableCopies, id } = book;
  const { firstName, lastName } = user;
  return (
    <Book
      author={author}
      availableCopies={availableCopies}
      id={id}
      publisher={publisher}
      title={title}
      yearOfRelease={yearOfRelease}
      renderMoreCols={() => (
        <>
          <td className="px-6 py-4">
            {firstName} {lastName}
          </td>
          <td className="px-6 py-4">
            {new Intl.DateTimeFormat("en-US").format(createdAt)}
          </td>
          <td className="py-4 pr-6">
            {
              <div className="flex justify-start">
                <button
                  onClick={handleConfirm}
                  className="mx-2  p-1 text-start font-medium  text-green-500 hover:underline"
                >
                  Zatwierdź
                </button>
                <button
                  onClick={handleReject}
                  className="mx-2  p-1 text-start font-medium  text-red-500 hover:underline"
                >
                  Odrzuć
                </button>
              </div>
            }
          </td>
        </>
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

const ReservationsPage = () => {
  const [rejectingReservationId, setRejectingReservationId] = useState<
    null | number
  >(null);

  const [confirmingReservationId, setConfirmingReservationId] = useState<
    null | number
  >(null);

  const ctx = api.useContext();
  const { data: reservations, isLoading } =
    api.reservations.getAllReservations.useQuery();

  const { mutate: createBorrowmentMutation, isLoading: isConfirming } =
    api.borrowments.createBorrowment.useMutation({
      onSuccess: async () => {
        await ctx.reservations.getAllReservations.invalidate();
        setConfirmingReservationId(null);
        toast.success("Zatwierdzono rezerwacje!");
      },
      onError: (e) => {
        setConfirmingReservationId(null);
        handleApiError(e, "Błąd w zatwierdzaniu rezerwacji");
      },
    });

  const { mutate: removeReservationMutation, isLoading: isRejecting } =
    api.reservations.removeReservation.useMutation({
      onSuccess: async () => {
        await ctx.reservations.getAllReservations.invalidate();
        setRejectingReservationId(null);
        toast.success("Odrzucono rezerwacje!");
      },
      onError: (e) => {
        setRejectingReservationId(null);
        handleApiError(e, "Błąd w odrzucaniu rezerwacji");
      },
    });

  return (
    <>
      <Head>
        <title>Zarezerwowane rezerwacje</title>
        <meta
          name="description"
          content="Podstrona z zarezerwowanymi książkami"
        />
      </Head>
      <h1 className="mx-auto mt-11 w-3/4 max-w-5xl text-5xl font-bold text-slate-200">
        Zarezerwowane książki
      </h1>
      {rejectingReservationId && (
        <ConfirmModal
          handleClose={() => setRejectingReservationId(null)}
          question="Czy napewno odrzucić rezerwacje"
          isLoading={isRejecting}
          handleConfirm={() => {
            removeReservationMutation({ id: rejectingReservationId });
          }}
        />
      )}
      {confirmingReservationId && (
        <ConfirmModal
          handleClose={() => setConfirmingReservationId(null)}
          question="Czy napewno zaakceptować rezerwacje"
          variant="neutral"
          isLoading={isConfirming}
          handleConfirm={() => {
            createBorrowmentMutation({
              reservationId: confirmingReservationId,
            });
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
            "Rezerwujący",
            "Data rezerwacji",
            "Akcje",
          ]}
        >
          {!!reservations?.length &&
            reservations.map((reservation) => (
              <Reservation
                key={reservation.id}
                {...reservation}
                handleConfirm={() => {
                  setConfirmingReservationId(reservation.id);
                }}
                handleReject={() => {
                  setRejectingReservationId(reservation.id);
                }}
              />
            ))}
        </Table>
      </div>
    </>
  );
};

export default ReservationsPage;
