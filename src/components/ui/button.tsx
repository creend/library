import { type ButtonHTMLAttributes } from "react";

const Button = ({
  children,
  className: classNames,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={`w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4  focus:ring-blue-800 sm:w-auto ${
        classNames ? classNames : ""
      }`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
