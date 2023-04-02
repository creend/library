import { Formik, Field, Form } from "formik";
import Input from "~/components/input";
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
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          console.log(values);
          // mutate(values);
        }}
      >
        <Form className="mx-auto mt-11 w-3/4 max-w-3xl">
          <Input
            input={{ name: "username", id: "username" }}
            label="Nazwa użytkownika"
          />
          <Input
            input={{ name: "password", id: "password", type: "password" }}
            label="Hasło"
          />
          <Input
            input={{
              name: "retypedPassword",
              id: "retypedPassword",
              type: "password",
            }}
            label="Powtórz hasło"
          />
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
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4  focus:ring-blue-800 sm:w-auto"
          >
            Submit
          </button>
        </Form>
      </Formik>
    </>
  );
};

export default RegisterPage;
