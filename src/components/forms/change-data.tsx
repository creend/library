import * as Yup from "yup";
import { Formik } from "formik";
import Input from "../input";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { signOut, useSession } from "next-auth/react";
import FormWrapper from "./form";
import { handleApiError } from "~/helpers/api-error-handler";

const ChangeDataSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Imie musi posiadać minimum 2 znaki")
    .max(50, "Imie może posiadać maksymalnie 50 znaków")
    .required("Imie jest wymagane"),
  lastName: Yup.string()
    .min(2, "Nazwisko musi posiadać minimum 2 znaki")
    .max(50, "Nazwisko może posiadać maksymalnie 50 znaków")
    .required("Nazwisko jest wymagane"),
  idDocumentNumber: Yup.string()
    .min(2, "Numer dokumentu tożsamości musi posiadać minimum 2 znaki")
    .max(50, "Numer dokumentu tożsamości może posiadać maksymalnie 50 znaków")
    .required("Numer dokumentu tożsamości jest wymagany"),
  address: Yup.string()
    .min(4, "Adres musi posiadać minimum 2 znaki")
    .required("Adres jest wymagany"),
  password: Yup.string()
    .min(2, "Hasło musi posiadać minimum 2 znaki")
    .max(50, "Hasło może posiadać maksymalnie 50 znaków")
    .required("Hasło jest wymagane"),
});

const ChangeDataForm = () => {
  const session = useSession();
  const user = session.data?.user;

  const { mutate, isLoading } = api.readers.changeUserData.useMutation({
    onSuccess: () => {
      toast.success("Zmieniono dane! Nastąpi wylogowanie");
      void signOut({ callbackUrl: "/zaloguj" });
    },
    onError: (e) => handleApiError(e, "Błąd w zmianie danych"),
  });
  return (
    <Formik
      initialValues={{
        firstName: user?.firstName,
        lastName: user?.lastName,
        idDocumentNumber: user?.idDocumentNumber,
        address: user?.address,
        password: "",
      }}
      validationSchema={ChangeDataSchema}
      onSubmit={(values) => {
        if (user) {
          mutate({ ...values, username: user.username });
        }
      }}
    >
      <FormWrapper buttonText="Zmień dane" isLoading={isLoading}>
        <div className="grid md:grid-cols-2 md:gap-6">
          <Input
            input={{
              name: "firstName",
              id: "firstName",
            }}
            label="Imie"
          />
          <Input
            input={{
              name: "lastName",
              id: "lastName",
            }}
            label="Nazwisko"
          />
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <Input
            input={{
              name: "idDocumentNumber",
              id: "idDocumentNumber",
            }}
            label="Numer dokumentu tożsamości"
          />
          <Input
            input={{
              name: "address",
              id: "address",
            }}
            label="Adres"
          />
        </div>

        <Input
          input={{
            name: "password",
            id: "password",
            type: "password",
          }}
          label="Hasło"
        />
      </FormWrapper>
    </Formik>
  );
};

export default ChangeDataForm;
