import { useState } from "react";

interface Props {
  status: "success" | "error" | "warning";
  message: string;
}

const icons = {
  success:
    "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
  error:
    "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
  warning:
    "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
};

const colors = {
  success: "bg-green-800 text-green-200 ",
  error: "bg-red-800 text-red-200",
  warning: "bg-orange-700 text-orange-200",
};

const Toast = ({ message, status }: Props) => {
  const [isClosed, setIsClosed] = useState(false);
  return (
    <div
      id="toast-success"
      className={`${
        isClosed ? "hidden" : ""
      } fixed left-1/2 top-10 z-10 mb-4 flex w-full max-w-xs -translate-x-1/2 items-center rounded-lg bg-gray-800 p-4 text-gray-400 shadow`}
      role="alert"
    >
      <div
        className={`inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg  ${colors[status]}`}
      >
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fillRule="evenodd" d={icons[status]} clipRule="evenodd"></path>
        </svg>
        <span className="sr-only">{status} icon</span>
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
      <button
        type="button"
        className="-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 rounded-lg  bg-white p-1.5  text-gray-500  hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-gray-300"
        aria-label="Close"
        onClick={() => setIsClosed(true)}
      >
        <span className="sr-only">Close</span>
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default Toast;
