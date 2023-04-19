/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type User } from "@prisma/client";
import { Form, Formik } from "formik";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import * as Yup from "yup";
import Button from "~/components/ui/button";
import Input from "~/components/ui/input";
import Spinner from "~/components/ui/spinner";
import Title from "~/components/ui/title";
import { getServerAuthSession } from "../api/auth/[...nextauth]";
import type { GetServerSideProps } from "next";

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "Nazwa użytkownika musi posiadać minimum 2 znaki")
    .max(50, "Nazwa użytkownika może posiadać maksymalnie 50 znaków")
    .required("Nazwa użytkownika jest wymagana"),
  password: Yup.string()
    .min(2, "Hasło musi posiadać minimum 2 znaki")
    .max(50, "Hasło może posiadać maksymalnie 50 znaków")
    .required("Hasło jest wymagane"),
});

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: { session },
  };
};

const LoginPage = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  useEffect(() => {
    if (isLoggedIn) {
      push("/");
    }
  }, [push, isLoggedIn]);

  return (
    <>
      <Head>
        <title>Logowanie</title>
        <meta name="description" content="Podstrona do logowania" />
      </Head>
      <div className="mx-auto mt-11 w-3/4 max-w-xl">
        <Title>Logowanie</Title>
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={async (values) => {
            setIsLoading(true);
            const res = await signIn("credentials", {
              ...values,
              redirect: false,
            });
            setIsLoading(false);
            if (res?.ok) {
              try {
                const data = await fetch(`api/user/${values.username}`).then(
                  (res) => res.json()
                );
                const user = data.data as Omit<User, "passwordHash">;

                if (user.needPasswordChange) {
                  toast.success("Zmień hasło po pierwszym zalogowaniu");
                  push("/moje-dane");
                } else {
                  toast.success("Zalogowano!");
                  push("/");
                }
              } catch (err) {
                toast.error("Błędne dane logowania!");
              }
            } else {
              toast.error("Błędne dane logowania!");
            }
          }}
        >
          <Form
            className={`relative mx-auto mt-11 w-full max-w-xl rounded-2xl p-10 ${
              isLoading ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-900"
            }}`}
            autoComplete="off"
          >
            {isLoading && <Spinner />}

            <Input
              input={{ name: "username", id: "username" }}
              label="Nazwa użytkownika"
              variant="rounded"
            />
            <Input
              input={{ name: "password", id: "password", type: "password" }}
              label="Hasło"
              variant="rounded"
            />
            <Button type="submit">Zaloguj</Button>
          </Form>
        </Formik>
      </div>
    </>
  );
};

export default LoginPage;
