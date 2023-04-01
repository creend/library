import { Formik, Field, Form } from "formik";
import { api } from "~/utils/api";

const RegisterPage = () => {
  const initialValues = {
    username: "",
    password: "",
    retypedPassword: "",
    firstName: "",
    lastName: "",
    idDocumentNumber: "",
    address: "",
  };
  const { mutate, isLoading } = api.auth.signUp.useMutation({
    onSuccess: () => {
      console.log("HURRRAA");
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        console.log(errorMessage[0]);
      } else {
        console.log("Failed to post! Please try again later.");
      }
    },
  });
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        console.log(values);
        mutate(values);
      }}
    >
      <Form>
        <Field type="text" name="username" placeholder="Nazwa uzytkownika" />
        <Field type="password" name="password" placeholder="Haslo" />
        <Field
          type="password"
          name="retypedPassword"
          placeholder="Powtorz haslo"
        />
        <Field type="text" name="firstName" placeholder="Imie" />
        <Field type="text" name="lastName" placeholder="Nazwisko" />
        <Field
          type="text"
          name="idDocumentNumber"
          placeholder="Number dokumentu"
        />
        <Field type="text" name="address" placeholder="Adres" />
        <button type="submit">Zarejestruj</button>
      </Form>
    </Formik>
  );
};

export default RegisterPage;
