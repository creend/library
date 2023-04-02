import { Form, Formik } from "formik";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import * as Yup from "yup";
import Input from "~/components/input";
import Spinner from "~/components/spinner";
import Toast from "~/components/toast";

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
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {error && <Toast message={error} status="error" />}
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
            setError("Błędne dane logowania");
            setTimeout(() => {
              setError("");
            }, 2000);
          }
        }}
      >
        <Form
          className={`relative mx-auto mt-11 w-3/4 max-w-xl rounded-2xl p-10 ${
            isLoading ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-900"
          }}`}
          autoComplete="off"
        >
          {isLoading && <Spinner />}
          <h3 className="mb-10 text-2xl font-semibold text-slate-200">
            Logowanie
          </h3>
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
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
          >
            Zaloguj
          </button>
          <Link href="/zarejestruj">
            <p className="absolute bottom-5 right-5 font-medium text-slate-200">
              Nie masz konta? Zarejestruj się!
            </p>
          </Link>
        </Form>
      </Formik>
    </>
  );
};

export default LoginPage;
