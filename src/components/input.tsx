import { Field } from "formik";

const Input = ({
  input,
  label,
}: {
  input: React.InputHTMLAttributes<HTMLInputElement>;
  label: string;
}) => {
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
    </div>
  );
};

export default Input;
