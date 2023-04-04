import { Form, Formik } from "formik";
import * as Yup from "yup";
import Input from "~/components/input";
import Spinner from "~/components/spinner";

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
  availableCopies: Yup.number().required("Ilość egzemplarzy jest wymagana"),
});

const initialValues = {
  author: "",
  title: "",
  publisher: "",
  yearOfRelease: 2023,
  availableCopies: 0,
};

const AddBookPage = () => {
  const isLoading = false;
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={AddBookSchema}
      onSubmit={(values) => {
        console.log(values);
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
            }}
            label="Dostępne egzemplarze"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4  focus:ring-blue-800 sm:w-auto"
        >
          Dodaj
        </button>
      </Form>
    </Formik>
  );
};

export default AddBookPage;
