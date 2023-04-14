/* eslint-disable @typescript-eslint/unbound-method */
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmModal from "~/components/ui/modal";
import Spinner from "~/components/ui/spinner";
import Table from "~/components/ui/table";
import { handleApiError } from "~/helpers/api-error-handler";
import { api } from "~/utils/api";

interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  yearOfRelease: number;
  availableCopies: number;
}

interface Reader {
  username: string;
  firstName: string;
  lastName: string;
  idDocumentNumber: string;
  address: string;
}

const Reservation = ({
  book,
  user,
  createdAt,
  handleAccept,
  handleReject,
}: {
  book: Book;
  user: Reader;
  createdAt: Date;
  handleReject: () => void;
  handleAccept: () => void;
}) => {
  const { title, author, publisher, yearOfRelease, availableCopies } = book;
  const { firstName, lastName } = user;
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
      <td className="px-6 py-4">
        {firstName} {lastName}
      </td>
      <td className="px-6 py-4">
        {new Intl.DateTimeFormat("en-US").format(createdAt)}
      </td>
      <td className="py-4 pr-6">
        {
          <div className="flex justify-start">
            <button className="mx-2  p-1 text-start font-medium  text-green-500 hover:underline">
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
    </tr>
  );
};

const ReservationsPage = () => {
  const { data: sessionData } = useSession();
  const role = sessionData?.user.role;
  const hasPermissions = role === "admin";

  const [rejectingReservationId, setRejectingReservationId] = useState<
    null | number
  >(null);

  const [confirmingReservationId, setConfirmingReservationId] = useState<
    null | number
  >(null);

  const { push } = useRouter();

  useEffect(() => {
    if (!hasPermissions) {
      push("/");
    }
  }, [hasPermissions, push]);

  const ctx = api.useContext();
  const { data: reservations, isLoading } =
    api.reservations.getAllReservations.useQuery();

  const { mutate: rejectReservation, isLoading: isRejecting } =
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
            rejectReservation({ id: rejectingReservationId });
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
          {reservations?.length &&
            reservations.map((reservation) => (
              <Reservation
                key={reservation.id}
                {...reservation}
                handleAccept={() => {}}
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
