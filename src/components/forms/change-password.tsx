/* eslint-disable @typescript-eslint/unbound-method */
import * as Yup from "yup";
import { Form, Formik } from "formik";
import Spinner from "../spinner";
import Input from "../input";
import Button from "../button";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

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
  const { push } = useRouter();

  const session = useSession();

  const { mutate, isLoading } = api.readers.changePassword.useMutation({
    onSuccess: () => {
      toast.success("Zmieniono hasło! Nastąpi wylogowanie");
      void signOut({ callbackUrl: "/zaloguj" });
    },
    onError: (e) => {
      let errorMessage = "Błąd w zmianie hasła";
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
        oldPassword: "",
        newPassword: "",
        retypedNewPassword: "",
      }}
      validationSchema={ChangePasswordSchema}
      onSubmit={(values) => {
        mutate({ ...values, username: session.data?.user.username || "" });
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