import * as Yup from "yup";
import { Form, Formik } from "formik";
import Spinner from "../spinner";
import Input from "../input";
import Button from "../button";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { signOut, useSession } from "next-auth/react";

const ChangeLoginSchema = Yup.object().shape({
  newLogin: Yup.string()
    .min(2, "Login musi posiadać minimum 2 znaki")
    .max(50, "Login może posiadać maksymalnie 50 znaków")
    .required("Login jest wymagany"),
  password: Yup.string()
    .min(2, "Hasło musi posiadać minimum 2 znaki")
    .max(50, "Hasło może posiadać maksymalnie 50 znaków")
    .required("Hasło jest wymagane"),
});

const ChangeLoginForm = () => {
  const session = useSession();
  const user = session.data?.user;

  const { mutate, isLoading } = api.readers.changeUserData.useMutation({
    onSuccess: () => {
      toast.success("Zmieniono login! Nastąpi wylogowanie");
      void signOut({ callbackUrl: "/zaloguj" });
    },
    onError: (e) => {
      let errorMessage = "Błąd w zmianie loginu";
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
  return (
    <Formik
      initialValues={{
        newLogin: "",
        password: "",
      }}
      validationSchema={ChangeLoginSchema}
      onSubmit={(values) => {
        const { newLogin, password } = values;
        if (user) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { createdAt, updatedAt, role, roleId, id, ...userData } = user;
          mutate({ ...userData, password, newUsername: newLogin });
        }
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
          input={{
            name: "currentLogin",
            id: "currentLogin",
            disabled: true,
            value: user?.username,
            readOnly: true,
          }}
          label="Aktualny login"
          variant="rounded"
        />
        <Input
          input={{ name: "newLogin", id: "newLogin" }}
          label="Nowy login"
          variant="rounded"
        />
        <Input
          input={{
            name: "password",
            id: "password",
            type: "password",
          }}
          label="Potwierdź hasłem"
          variant="rounded"
        />
        <Button type="submit">Zmień login</Button>
      </Form>
    </Formik>
  );
};

export default ChangeLoginForm;
