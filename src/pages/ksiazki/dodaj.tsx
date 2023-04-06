/* eslint-disable @typescript-eslint/unbound-method */
import { Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import * as Yup from "yup";
import Button from "~/components/button";
import Input from "~/components/input";
import Spinner from "~/components/spinner";
import { api } from "~/utils/api";
import { getServerAuthSession } from "../api/auth/[...nextauth]";
import { type GetServerSideProps } from "next";

const AddBookSchema = Yup.object().shape({
  author: Yup.string()
    .min(2, "Imie i nazwisko autora musi posiadać minimum 2 znaki")
    .max(50, "Imie i nazwisko autora może posiadać maksymalnie 50 znaków")
    .required("Imie i nazwisko autora jest wymagane"),
  title: Yup.string()
    .min(2, "Tytuł musi posiadać minimum 2 znaki")
    .max(50, "Tytuł może posiadać maksymalnie 50 znaków")
    .required("Tytuł jest wymagany"),
  publisher: Yup.string()
    .min(2, "Wydawnictwo musi posiadać minimum 2 znaki")
    .max(50, "Wydawnictwo może posiadać maksymalnie 50 znaków")
    .required("Wydawnictwo jest wymagane"),
  yearOfRelease: Yup.number()
    .min(1900, "Rok wydania musi być większy niż 1900")
    .max(2023, "Rok wydania nie może być większy niż 2023")
    .required("Rok wydania jest wymagany"),
  availableCopies: Yup.number()
    .min(0, "Ilość książek musi być większa od zera")
    .required("Ilość egzemplarzy jest wymagana"),
});

const initialValues = {
  author: "",
  title: "",
  publisher: "",
  yearOfRelease: 2023,
  availableCopies: 0,
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: { session },
  };
};

const AddBookPage = () => {
  const { data: sessionData } = useSession();
  const role = sessionData?.user.role;
  const hasPermissions = role === "admin";

  const { push } = useRouter();

  useEffect(() => {
    if (!hasPermissions) {
      push("/");
    }
  }, [hasPermissions, push]);

  const { mutate, isLoading } = api.books.addBook.useMutation({
    onSuccess: () => {
      toast.success("Dodano książke !");
      push("/ksiazki");
    },
    onError: (e) => {
      let errorMessage = "Błąd w dodawaniu książki";
      if (e?.message) {
        errorMessage = e.message;
      } else {
        const errorMessages = e.data?.zodError?.fieldErrors.content;
        if (errorMessages && errorMessages[0]) {
          errorMessage = errorMessages[0];
        }
      }
      toast.error(errorMessage);
    },
  });
  if (!hasPermissions) return null;

  return (
    <>
      <Head>
        <title>Książki | Dodawanie</title>
        <meta name="description" content="Podstrona do dodawania książek" />
      </Head>
      {hasPermissions && (
        <Formik
          initialValues={initialValues}
          validationSchema={AddBookSchema}
          onSubmit={(values) => {
            mutate(values);
          }}
        >
          <Form
            className={`relative mx-auto mt-11 w-3/4 max-w-xl rounded-2xl  p-10 
          ${isLoading ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-900"}`}
            autoComplete="off"
          >
            {isLoading && <Spinner />}

            <h3 className="mb-10 text-2xl font-semibold text-slate-200">
              Dodawanie książki
            </h3>
            <Input input={{ name: "author", id: "author" }} label="Autor" />
            <Input input={{ name: "title", id: "title" }} label="Tytuł" />
            <Input
              input={{
                name: "publisher",
                id: "publisher",
              }}
              label="Wydawnictwo"
            />
            <div className="grid md:grid-cols-2 md:gap-6">
              <Input
                input={{
                  name: "yearOfRelease",
                  id: "yearOfRelease",
                  type: "number",
                }}
                label="Rok wydania"
              />
              <Input
                input={{
                  name: "availableCopies",
                  id: "availableCopies",
                  type: "number",
                  min: 0,
                }}
                label="Dostępne egzemplarze"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              Dodaj
            </Button>
          </Form>
        </Formik>
      )}
    </>
  );
};

export default AddBookPage;
