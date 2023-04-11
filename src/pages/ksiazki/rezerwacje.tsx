/* eslint-disable @typescript-eslint/unbound-method */
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Spinner from "~/components/spinner";
import Table from "~/components/table";
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
}: {
  book: Book;
  user: Reader;
  createdAt: Date;
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
            <button className="mx-2  p-1 text-start font-medium  text-red-500 hover:underline">
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

  const { push } = useRouter();

  useEffect(() => {
    if (!hasPermissions) {
      push("/");
    }
  }, [hasPermissions, push]);

  const ctx = api.useContext();
  const { data: reservations, isLoading } =
    api.reservations.getAllReservations.useQuery();

  return (
    <>
      <Head>
        <title>Oczekujące rezerwacje</title>
        <meta
          name="description"
          content="Podstrona z zarezerwowanymi książkami"
        />
      </Head>
      <h1 className="mx-auto mt-11 w-3/4 max-w-5xl text-5xl font-bold text-slate-200">
        Zarezerwowane książki
      </h1>
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
              <Reservation key={reservation.id} {...reservation} />
            ))}
        </Table>
      </div>
    </>
  );
};

export default ReservationsPage;
