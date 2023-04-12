/* eslint-disable @typescript-eslint/unbound-method */
import { Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import Button from "~/components/ui/button";
import Input from "~/components/ui/input";
import Spinner from "~/components/ui/spinner";
import { api } from "~/utils/api";
import Title from "~/components/ui/title";
import { AddBookSchema as EditBookSchema } from "~/pages/ksiazki/dodaj";
import { handleApiError } from "~/helpers/api-error-handler";

const EditBookForm = ({
  id,
  handleFormClose,
}: {
  id: number;
  handleFormClose: () => void;
}) => {
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
      handleFormClose();
      toast.success("Edytowano książke !");
    },
    onError: (e) => {
      handleFormClose();
      handleApiError(e, "Błąd w edycji książki");
    },
  });
  if (!hasPermissions) return null;

  return (
    <>
      <Head>
        <title>Książki | Edytowanie</title>
        <meta name="description" content="Podstrona do dodawania książek" />
      </Head>
      <div className="fixed left-0 right-0 top-0 z-50 h-[calc(100%-1rem)]  overflow-y-auto overflow-x-hidden bg-black/40 p-4 md:inset-0 md:h-full">
        <Formik
          initialValues={{
            author: book?.author,
            title: book?.title,
            publisher: book?.publisher,
            yearOfRelease: book?.yearOfRelease,
            availableCopies: book?.availableCopies,
          }}
          enableReinitialize
          validationSchema={EditBookSchema}
          onSubmit={(values) => {
            mutate({ ...values, id });
          }}
        >
          <Form
            className={`relative mx-auto mt-28 w-full max-w-xl rounded-2xl  p-10 
          ${isLoading ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-900"}`}
            autoComplete="off"
          >
            {(isLoading || isEditting) && <Spinner />}
            <button
              type="button"
              className="absolute right-2.5 top-3 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
              data-modal-hide="popup-modal"
              onClick={handleFormClose}
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
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
              Edytuj
            </Button>
          </Form>
        </Formik>
      </div>
    </>
  );
};

export default EditBookForm;
