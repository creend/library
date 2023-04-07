/* eslint-disable @typescript-eslint/unbound-method */
import { Formik, Form } from "formik";
import Input from "~/components/input";
import { api } from "~/utils/api";
import { useRouter } from "next/navigation";

import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import Toast from "~/components/toast";
import Spinner from "~/components/spinner";
import Head from "next/head";
import { useSession } from "next-auth/react";
import Button from "~/components/button";
import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "../api/auth/[...nextauth]";
import Title from "~/components/title";

export const AddReaderSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "Nazwa użytkownika musi posiadać minimum 2 znaki")
    .max(50, "Nazwa użytkownika może posiadać maksymalnie 50 znaków")
    .required("Nazwa użytkownika jest wymagana"),
  password: Yup.string()
    .min(2, "Hasło musi posiadać minimum 2 znaki")
    .max(50, "Hasło może posiadać maksymalnie 50 znaków")
    .required("Hasło jest wymagane"),
  retypedPassword: Yup.string()
    .min(2, "Hasło musi posiadać minimum 2 znaki")
    .max(50, "Hasło może posiadać maksymalnie 50 znaków")
    .required("Powtórzone hasło jest wymagane")
    .oneOf([Yup.ref("password")], "Hasła muszą być takie same"),
  firstName: Yup.string()
    .min(2, "Imie musi posiadać minimum 2 znaki")
    .max(50, "Imie może posiadać maksymalnie 50 znaków")
    .required("Imie jest wymagane"),
  lastName: Yup.string()
    .min(2, "Nazwisko musi posiadać minimum 2 znaki")
    .max(50, "Nazwisko może posiadać maksymalnie 50 znaków")
    .required("Nazwisko jest wymagane"),
  idDocumentNumber: Yup.string()
    .min(2, "Numer dokumentu tożsamości musi posiadać minimum 2 znaki")
    .max(50, "Numer dokumentu tożsamości może posiadać maksymalnie 50 znaków")
    .required("Numer dokumentu tożsamości jest wymagany"),
  address: Yup.string()
    .min(4, "Adres musi posiadać minimum 2 znaki")
    .required("Adres jest wymagany"),
});

const initialValues = {
  username: "",
  password: "",
  retypedPassword: "",
  firstName: "",
  lastName: "",
  idDocumentNumber: "",
  address: "",
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: { session },
  };
};

const AddUserPage = () => {
  const { data: sessionData } = useSession();
  const role = sessionData?.user.role;
  const hasPermissions = role === "admin";

  const { push } = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hasPermissions) {
      push("/");
    }
  }, [hasPermissions, push]);

  const { mutate, isLoading } = api.readers.addReader.useMutation({
    onSuccess: () => {
      toast.success("Zarejestrowano !");
      push("/zaloguj");
    },
    onError: (e) => {
      let errorMessage = "Błąd w rejestracji";
      if (e?.message) {
        errorMessage = e.message;
      } else {
        const errorMessages = e.data?.zodError?.fieldErrors.content;
        if (errorMessages && errorMessages[0]) {
          errorMessage = errorMessages[0];
        }
      }
      setError(errorMessage);
      setTimeout(() => {
        setError("");
      }, 3000);
    },
  });
  if (!hasPermissions) return null;
  return (
    <>
      <Head>
        <title>Czytelnicy | Dodawanie</title>
        <meta name="description" content="Podstrona do dodawania czytelnikow" />
      </Head>
      {error && <Toast message={error} status="error" />}
      <div className="mx-auto mt-11 w-3/4 max-w-xl">
        <Title>Dodawanie czytelnika</Title>
        <Formik
          initialValues={initialValues}
          validationSchema={AddReaderSchema}
          onSubmit={(values) => {
            mutate(values);
          }}
        >
          <Form
            className={`relative mx-auto mt-11 w-full max-w-xl rounded-2xl  p-10 
          ${isLoading ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-900"}`}
            autoComplete="off"
          >
            {isLoading && <Spinner />}

            <Input
              input={{ name: "username", id: "username" }}
              label="Nazwa użytkownika"
            />
            <Input
              input={{ name: "password", id: "password", type: "password" }}
              label="Hasło"
            />
            <Input
              input={{
                name: "retypedPassword",
                id: "retypedPassword",
                type: "password",
              }}
              label="Powtórz hasło"
            />
            <div className="grid md:grid-cols-2 md:gap-6">
              <Input
                input={{
                  name: "firstName",
                  id: "firstName",
                }}
                label="Imie"
              />
              <Input
                input={{
                  name: "lastName",
                  id: "lastName",
                }}
                label="Nazwisko"
              />
            </div>
            <div className="grid md:grid-cols-2 md:gap-6">
              <Input
                input={{
                  name: "idDocumentNumber",
                  id: "idDocumentNumber",
                }}
                label="Numer dokumentu tożsamości"
              />
              <Input
                input={{
                  name: "address",
                  id: "address",
                  role: "presentation",
                }}
                label="Adres"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              Dodaj
            </Button>
          </Form>
        </Formik>
      </div>
    </>
  );
};

export default AddUserPage;
