/* eslint-disable @typescript-eslint/unbound-method */
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { getServerAuthSession } from "../api/auth/[...nextauth]";
import { type GetServerSideProps } from "next";
import Spinner from "~/components/spinner";
import Title from "~/components/title";
import ChangePasswordForm from "~/components/forms/change-password";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: { session },
  };
};

const MyDataPage = () => {
  const { push } = useRouter();

  const { data: sessionData, status } = useSession();
  const hasPermissions = status !== "unauthenticated";

  const userRole = sessionData?.user.role;
  const { data: reader, isLoading } = api.readers.getReaderByUsername.useQuery({
    username: sessionData?.user.username || "",
  });

  const [currentTab, setCurrentTab] = useState<
    "myData" | "changeData" | "changePassword" | "changeLogin"
  >("myData");

  let headerText = "Moje dane";
  if (currentTab === "changeData") {
    headerText = "Zmiana danych";
  } else if (currentTab === "changePassword") {
    headerText = "Zmiana hasła";
  } else if (currentTab === "changeLogin") {
    headerText = "Zmiana loginu";
  }

  useEffect(() => {
    if (!hasPermissions) {
      push("/");
    }
  }, [hasPermissions, push]);

  if (!hasPermissions) return null;

  return (
    <>
      <Head>
        <title>
          {headerText} | {sessionData?.user.username}
        </title>
        <meta name="description" content="Podstrona do logowania" />
      </Head>

      <div className="relative mx-auto mt-11 w-3/4 max-w-5xl ">
        <Title>{headerText}</Title>
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
              <option onClick={() => setCurrentTab("myData")}>Moje dane</option>
              {userRole !== "admin" && (
                <option onClick={() => setCurrentTab("changeData")}>
                  Zmień dane
                </option>
              )}

              <option onClick={() => setCurrentTab("changePassword")}>
                Zmień hasło
              </option>

              <option onClick={() => setCurrentTab("changeLogin")}>
                Zmień login
              </option>
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
                onClick={() => setCurrentTab("myData")}
                aria-selected="true"
                className={`${
                  currentTab === "myData" ? "text-blue-500" : ""
                } inline-block w-full rounded-tl bg-gray-700  p-4 hover:bg-gray-600 focus:outline-none`}
              >
                Moje dane
              </button>
            </li>
            {userRole !== "admin" && (
              <li className="w-full">
                <button
                  id="about-tab"
                  data-tabs-target="#about"
                  type="button"
                  role="tab"
                  onClick={() => setCurrentTab("changeData")}
                  aria-controls="about"
                  aria-selected="false"
                  className={`${
                    currentTab === "changeData" ? "text-blue-500" : ""
                  } inline-block w-full bg-gray-700  p-4 hover:bg-gray-600 focus:outline-none`}
                >
                  Zmień dane
                </button>
              </li>
            )}

            <li className="w-full">
              <button
                id="faq-tab"
                data-tabs-target="#faq"
                type="button"
                role="tab"
                aria-controls="faq"
                onClick={() => setCurrentTab("changePassword")}
                aria-selected="false"
                className={`${
                  currentTab === "changePassword" ? "text-blue-500" : ""
                } inline-block w-full  bg-gray-700  p-4 hover:bg-gray-600 focus:outline-none`}
              >
                Zmień hasło
              </button>
            </li>
            <li className="w-full">
              <button
                id="faq-tab"
                data-tabs-target="#faq"
                type="button"
                role="tab"
                aria-controls="faq"
                onClick={() => setCurrentTab("changeLogin")}
                aria-selected="false"
                className={`${
                  currentTab === "changeLogin" ? "text-blue-500" : ""
                } inline-block w-full rounded-tr-lg bg-gray-700  p-4 hover:bg-gray-600 focus:outline-none`}
              >
                Zmień login
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
                  className={`rounded-lg bg-gray-900 md:p-8 ${
                    currentTab === "myData" ? "block" : "hidden"
                  }`}
                  id="stats"
                  role="tabpanel"
                  aria-labelledby="data-tab"
                >
                  <dl className="mx-auto flex flex-wrap justify-between gap-8 p-4 text-white sm:grid-cols-3 sm:p-8 xl:grid-cols-6">
                    <div className="flex flex-col items-center justify-center">
                      <dt className="mb-2 text-3xl font-extrabold">
                        {reader.username}
                      </dt>
                      <dd className="text-gray-400">
                        Nazwa użytkownika (login)
                      </dd>
                    </div>
                    {userRole !== "admin" && (
                      <>
                        <div className="flex flex-col items-center justify-center">
                          <dt className="mb-2 text-3xl font-extrabold">
                            {reader.firstName}
                          </dt>
                          <dd className="text-gray-400">Imie</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <dt className="mb-2 text-3xl font-extrabold">
                            {reader.lastName}
                          </dt>
                          <dd className="text-gray-400">Nazwisko</dd>
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
                      </>
                    )}
                    <div className="flex flex-col items-center justify-center">
                      <dt className="mb-2 text-3xl font-extrabold">
                        {userRole === "admin" ? "Admin" : "Czytelnik"}
                      </dt>
                      <dd className="text-gray-400">Rola</dd>
                    </div>
                  </dl>
                </div>
                <div
                  role="tabpanel"
                  aria-labelledby="change-data-tab"
                  className={`${
                    currentTab === "changeData" ? "block" : "hidden"
                  }`}
                >
                  <p>zmiana danych</p>
                </div>
                <div
                  role="tabpanel"
                  aria-labelledby="change-password-tab"
                  className={`rounded-lg bg-gray-900  ${
                    currentTab === "changePassword" ? "block" : "hidden"
                  }`}
                >
                  <ChangePasswordForm />
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
