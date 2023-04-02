import { ErrorMessage, Field } from "formik";

interface Props {
  input: React.InputHTMLAttributes<HTMLInputElement>;
  label: string;
}

const Input = ({ input, label }: Props) => {
  return (
    <div className="group relative z-0 mb-6 w-full">
      <Field
        className="peer block w-full appearance-none border-0 border-b-2 border-gray-600 bg-transparent px-0 py-2.5 text-sm text-white focus:border-blue-600 focus:outline-none focus:ring-0"
        placeholder=" "
        {...input}
      />
      <label
        htmlFor={input.id}
        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600"
      >
        {label}
      </label>
      <ErrorMessage
        className="mt-2 text-sm text-red-500"
        component="p"
        name={input.name ?? ""}
      />
    </div>
  );
};

export const RoundedInput = ({ input, label }: Props) => {
  return (
    <div className="mb-6">
      <label
        htmlFor={input.id}
        className="mb-2 block text-sm font-medium text-white"
      >
        {label}
      </label>
      <Field
        {...input}
        className="block w-full rounded-lg border  border-gray-600 bg-gray-700 p-2.5 text-sm  text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
  );
};

export default Input;
