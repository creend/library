import * as Yup from "yup";
import Title from "../title";
import { Form, Formik } from "formik";
import Spinner from "../spinner";
import Input from "../input";
import Button from "../button";

const ChangePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .min(2, "Hasło musi posiadać minimum 2 znaki")
    .max(50, "Hasło może posiadać maksymalnie 50 znaków")
    .required("Hasło jest wymagane"),
  newPassword: Yup.string()
    .min(2, "Hasło musi posiadać minimum 2 znaki")
    .max(50, "Hasło może posiadać maksymalnie 50 znaków")
    .required("Hasło jest wymagane"),
  retypedNewPassword: Yup.string()
    .min(2, "Powtórzone hasło musi posiadać minimum 2 znaki")
    .max(50, "Powtórzone hasło może posiadać maksymalnie 50 znaków")
    .required("Powtórzone hasło jest wymagane")
    .oneOf([Yup.ref("newPassword")], "Hasła muszą być takie same"),
});

const ChangePasswordForm = () => {
  const isLoading = false;
  return (
    <Formik
      initialValues={{
        oldPassword: "",
        newPassword: "",
        retypedNewPassword: "",
      }}
      validationSchema={ChangePasswordSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      <Form
        className={`relative w-full   p-10 ${
          isLoading ? "bg-gray-800 hover:bg-gray-700" : ""
        }`}
        autoComplete="off"
      >
        {isLoading && <Spinner />}

        <Input
          input={{ name: "oldPassword", id: "oldPassword", type: "password" }}
          label="Stare hasło"
          variant="rounded"
        />
        <Input
          input={{ name: "newPassword", id: "newPassword", type: "password" }}
          label="Nowe hasło"
          variant="rounded"
        />
        <Input
          input={{
            name: "retypedNewPassword",
            id: "retypedNewPassword",
            type: "password",
          }}
          label="Powtórz nowe hasło"
          variant="rounded"
        />
        <Button type="submit">Zmień hasło</Button>
      </Form>
    </Formik>
  );
};

export default ChangePasswordForm;
