import { Form, Formik } from "formik";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import * as Yup from "yup";
import Button from "~/components/button";
import Input from "~/components/input";
import Spinner from "~/components/spinner";
import Title from "~/components/title";

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
              toast.success("Zalogowano!");
              push("/");
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
