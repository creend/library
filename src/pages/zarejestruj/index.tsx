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
      <Form className="mx-auto mt-11 w-3/4 max-w-3xl">
        <div className="group relative z-0 mb-6 w-full">
          <Field
            name="username"
            id="username"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 border-gray-600 bg-transparent px-0 py-2.5 text-sm text-gray-900 text-white focus:border-blue-500 focus:border-blue-600 focus:outline-none focus:ring-0"
            placeholder=" "
            required
          />
          <label
            htmlFor="username"
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-400 text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-500 peer-focus:text-blue-600"
          >
            Nazwa użytkownika
          </label>
        </div>
        <div className="group relative z-0 mb-6 w-full">
          <Field
            type="password"
            name="password"
            id="password"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 border-gray-600 bg-transparent px-0 py-2.5 text-sm text-gray-900 text-white focus:border-blue-500 focus:border-blue-600 focus:outline-none focus:ring-0"
            placeholder=" "
            required
          />
          <label
            htmlFor="password"
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-400 text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-500 peer-focus:text-blue-600"
          >
            Hasło
          </label>
        </div>
        <div className="group relative z-0 mb-6 w-full">
          <Field
            type="password"
            name="repeat_password"
            id="repeat_password"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 border-gray-600 bg-transparent px-0 py-2.5 text-sm text-gray-900 text-white focus:border-blue-500 focus:border-blue-600 focus:outline-none focus:ring-0"
            placeholder=" "
            required
          />
          <label
            htmlFor="repeat_password"
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-400 text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-500 peer-focus:text-blue-600"
          >
            Powtórz hasło
          </label>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="group relative z-0 mb-6 w-full">
            <Field
              type="text"
              name="firstName"
              id="firstName"
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 border-gray-600 bg-transparent px-0 py-2.5 text-sm text-gray-900 text-white focus:border-blue-500 focus:border-blue-600 focus:outline-none focus:ring-0"
              placeholder=" "
              required
            />
            <label
              htmlFor="firstName"
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-400 text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-500 peer-focus:text-blue-600"
            >
              Imie
            </label>
          </div>
          <div className="group relative z-0 mb-6 w-full">
            <Field
              type="text"
              name="lastName"
              id="lastName"
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 border-gray-600 bg-transparent px-0 py-2.5 text-sm text-gray-900 text-white focus:border-blue-500 focus:border-blue-600 focus:outline-none focus:ring-0"
              placeholder=" "
              required
            />
            <label
              htmlFor="lastName"
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-400 text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-500 peer-focus:text-blue-600"
            >
              Nazwisko
            </label>
          </div>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="group relative z-0 mb-6 w-full">
            <Field
              name="idDocumentNumber"
              id="idDocumentNumber"
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 border-gray-600 bg-transparent px-0 py-2.5 text-sm text-gray-900 text-white focus:border-blue-500 focus:border-blue-600 focus:outline-none focus:ring-0"
              placeholder=" "
              required
            />
            <label
              htmlFor="idDocumentNumber"
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-400 text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-500 peer-focus:text-blue-600"
            >
              Numer dokumentu tożsamości
            </label>
          </div>
          <div className="group relative z-0 mb-6 w-full">
            <Field
              type="text"
              name="address"
              id="address"
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 border-gray-600 bg-transparent px-0 py-2.5 text-sm text-gray-900 text-white focus:border-blue-500 focus:border-blue-600 focus:outline-none focus:ring-0"
              placeholder=" "
              required
            />
            <label
              htmlFor="address"
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-400 text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-500 peer-focus:text-blue-600"
            >
              Adres
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-blue-800 sm:w-auto"
        >
          Submit
        </button>
      </Form>
    </Formik>
  );
};

export default RegisterPage;
