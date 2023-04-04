import * as Yup from "yup";

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
  return (
    <div>
      <p>e</p>
    </div>
  );
};

export default AddBookPage;
