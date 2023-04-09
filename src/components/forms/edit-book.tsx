/* eslint-disable @typescript-eslint/unbound-method */
import { Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import Button from "~/components/button";
import Input from "~/components/input";
import Spinner from "~/components/spinner";
import { api } from "~/utils/api";
import Title from "~/components/title";
import { AddBookSchema as EditBookSchema } from "~/pages/ksiazki/dodaj";

const EditBookForm = ({ id }: { id: number }) => {
  const { data: sessionData } = useSession();
  const role = sessionData?.user.role;
  const hasPermissions = role === "admin";

  const { push } = useRouter();

  useEffect(() => {
    if (!hasPermissions) {
      push("/");
    }
  }, [hasPermissions, push]);

  const { data: book, isLoading } = api.books.getBook.useQuery({ id });

  const ctx = api.useContext();
  const { mutate, isLoading: isEditting } = api.books.editBook.useMutation({
    onSuccess: async () => {
      await ctx.books.getBooks.invalidate();
      toast.success("Edytowano książke !");
    },
    onError: (e) => {
      let errorMessage = "Błąd w edycji książki";
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
        <title>Książki | Edytowanie</title>
        <meta name="description" content="Podstrona do dodawania książek" />
      </Head>
      <div className="mx-auto mt-11 w-3/4 max-w-xl">
        <Title>Dodawanie książki</Title>
        <Formik
          initialValues={{
            author: book?.author,
            title: book?.title,
            publisher: book?.publisher,
            yearOfRelease: book?.yearOfRelease,
            availableCopies: book?.availableCopies,
          }}
          validationSchema={EditBookSchema}
          onSubmit={(values) => {
            mutate({ ...values, id });
          }}
        >
          <Form
            className={`relative mx-auto mt-11 w-full max-w-xl rounded-2xl  p-10 
          ${isLoading ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-900"}`}
            autoComplete="off"
          >
            {(isLoading || isEditting) && <Spinner />}

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
      </div>
    </>
  );
};

export default EditBookForm;
