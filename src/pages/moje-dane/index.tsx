/* eslint-disable @typescript-eslint/unbound-method */
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "~/utils/api";
import { getServerAuthSession } from "../api/auth/[...nextauth]";
import { type GetServerSideProps } from "next";
import Spinner from "~/components/spinner";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: { session },
  };
};

const MyDataPage = () => {
  const { push } = useRouter();
  const { data: sessionData, status } = useSession();
  console.log(status);
  const hasPermissions = status !== "unauthenticated";
  const { data: reader, isLoading } = api.readers.getReaderByUsername.useQuery({
    username: sessionData?.user.username || "",
  });

  useEffect(() => {
    if (!hasPermissions) {
      push("/");
    }
  }, [hasPermissions, push]);

  if (!hasPermissions) return null;

  return (
    <>
      <Head>
        <title>Moje dane | {sessionData?.user.username}</title>
        <meta name="description" content="Podstrona do logowania" />
      </Head>

      <div className="relative mx-auto mt-11 w-3/4 max-w-5xl ">
        <h1 className="my-11 text-5xl font-bold text-slate-200">Moje dane</h1>
        <div
          className={`relative w-full rounded-lg border border-gray-700 bg-gray-900 shadow ${
            isLoading ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-900"
          }`}
        >
          {isLoading && <Spinner />}
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">
              Select tab
            </label>
            <select
              id="tabs"
              className="block w-full rounded-t-lg border-0 border-b  border-gray-600 bg-gray-700   p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:ring-blue-500"
            >
              <option>Statistics</option>
              <option>Services</option>
              <option>FAQ</option>
            </select>
          </div>
          <ul
            className="hidden divide-x  divide-gray-600 rounded-lg text-center text-sm  font-medium text-gray-400 sm:flex"
            id="fullWidthTab"
            data-tabs-toggle="#fullWidthTabContent"
            role="tablist"
          >
            <li className="w-full">
              <button
                id="stats-tab"
                data-tabs-target="#stats"
                type="button"
                role="tab"
                aria-controls="stats"
                aria-selected="true"
                className="inline-block w-full rounded-tl-lg  bg-gray-700 p-4 hover:bg-gray-600 focus:outline-none"
              >
                Twoje dane
              </button>
            </li>
            <li className="w-full">
              <button
                id="about-tab"
                data-tabs-target="#about"
                type="button"
                role="tab"
                aria-controls="about"
                aria-selected="false"
                className="inline-block w-full bg-gray-700 p-4 hover:bg-gray-600 focus:outline-none"
              >
                Zmień dane
              </button>
            </li>
            <li className="w-full">
              <button
                id="faq-tab"
                data-tabs-target="#faq"
                type="button"
                role="tab"
                aria-controls="faq"
                aria-selected="false"
                className="inline-block w-full rounded-tr-lg bg-gray-700  p-4 hover:bg-gray-600 focus:outline-none"
              >
                Zmień hasło
              </button>
            </li>
          </ul>
          {reader && (
            <>
              <div
                id="fullWidthTabContent"
                className="border-t  border-gray-600"
              >
                <div
                  className=" rounded-lg  bg-gray-800 md:p-8"
                  id="stats"
                  role="tabpanel"
                  aria-labelledby="stats-tab"
                >
                  <dl className="mx-auto flex flex-wrap justify-around gap-8 p-4 text-white sm:grid-cols-3 sm:p-8 xl:grid-cols-6">
                    <div className="flex flex-col items-center justify-center">
                      <dt className="mb-2 text-3xl font-extrabold">Imie</dt>
                      <dd className="text-gray-400">{reader.firstName}</dd>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <dt className="mb-2 text-3xl font-extrabold">Nazwisko</dt>
                      <dd className="text-gray-400">{reader.lastName}</dd>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <dt className="mb-2 text-3xl font-extrabold">
                        {reader.idDocumentNumber}
                      </dt>
                      <dd className="text-gray-400">
                        Numer dokumentu tożsamości
                      </dd>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <dt className="mb-2 text-3xl font-extrabold">
                        {reader.address}
                      </dt>
                      <dd className="text-gray-400">Adres</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MyDataPage;
