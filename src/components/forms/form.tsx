import { Form } from "formik";
import Spinner from "../ui/spinner";
import { type ReactNode } from "react";
import Button from "../ui/button";

interface Props {
  isLoading: boolean;
  buttonText: string;
  children: ReactNode;
}

//Name is FormWrapper beacouse Formik's form component name is Form :(
const FormWrapper = ({ isLoading, buttonText, children }: Props) => {
  return (
    <Form
      className={`relative w-full   p-10 ${
        isLoading ? "bg-gray-800 hover:bg-gray-700" : ""
      }`}
      autoComplete="off"
    >
      {isLoading && <Spinner />}
      {children}
      <Button type="submit">{buttonText}</Button>
    </Form>
  );
};

export default FormWrapper;
