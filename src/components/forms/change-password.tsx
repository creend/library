import * as Yup from "yup";
import { Formik } from "formik";
import Input from "../ui/input";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { signOut, useSession } from "next-auth/react";
import FormWrapper from "./form";
import { handleApiError } from "~/helpers/api-error-handler";

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
  const session = useSession();
  const user = session.data?.user;

  const { mutate, isLoading } = api.readers.changePassword.useMutation({
    onSuccess: () => {
      toast.success("Zmieniono hasło! Nastąpi wylogowanie");
      void signOut({ callbackUrl: "/zaloguj" });
    },
    onError: (e) => handleApiError(e, "Bład w zmianie hasła"),
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
        if (user) {
          mutate({
            ...values,
            username: user.username,
          });
        }
      }}
    >
      <FormWrapper buttonText="Zmień hasło" isLoading={isLoading}>
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
      </FormWrapper>
    </Formik>
  );
};

export default ChangePasswordForm;
