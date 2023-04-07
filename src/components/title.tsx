import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className: string;
}

const Title = ({ children, className: classNames }: Props) => {
  return (
    <h1
      className={`my-11 text-5xl font-bold text-slate-200 ${
        classNames ? classNames : ""
      }`}
    >
      {children}
    </h1>
  );
};

export default Title;
