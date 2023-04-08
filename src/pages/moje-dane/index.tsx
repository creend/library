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
import ChangeLoginForm from "~/components/forms/change-login";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: { session },
  };
};

const UserProperty = ({ label, value }: { label: string; value: string }) => {
  return (
    <tr className="border-b  border-gray-700 ">
      <th
        scope="row"
        className="whitespace-nowrap px-6 py-4 font-semibold text-white"
      >
        {label}
      </th>
      <td className="py-4 pr-6">{value}</td>
    </tr>
  );
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
                  className={`rounded-lg bg-gray-900 ${
                    currentTab === "myData" ? "block" : "hidden"
                  }`}
                  id="stats"
                  role="tabpanel"
                  aria-labelledby="data-tab"
                >
                  <table className="w-full text-left text-sm text-gray-400">
                    <tbody>
                      <UserProperty
                        label="Nazwa użytkownika (login)"
                        value={reader.username}
                      />
                      {userRole !== "admin" && (
                        <>
                          <UserProperty label="Imie" value={reader.firstName} />
                          <UserProperty
                            label="Nazwisko"
                            value={reader.lastName}
                          />
                          <UserProperty
                            label="Numer dokumentu tożsamości"
                            value={reader.idDocumentNumber}
                          />
                          <UserProperty label="Adres" value={reader.address} />
                        </>
                      )}

                      <UserProperty
                        label="Rola"
                        value={userRole === "admin" ? "Admin" : "Czytelnik"}
                      />
                    </tbody>
                  </table>
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
                <div
                  role="tabpanel"
                  aria-labelledby="change-login-tab"
                  className={`rounded-lg bg-gray-900  ${
                    currentTab === "changeLogin" ? "block" : "hidden"
                  }`}
                >
                  <ChangeLoginForm />
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
