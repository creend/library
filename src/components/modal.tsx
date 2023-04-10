import Spinner from "./spinner";
import { AiOutlineQuestionCircle } from "react-icons/ai";
interface Props {
  handleClose: () => void;
  handleConfirm: () => void | Promise<void>;
  question: string;
  isLoading?: boolean;
  variant?: "removing" | "neutral";
}

const ConfirmModal = ({
  handleClose,
  handleConfirm,
  question,
  isLoading,
  variant = "removing",
}: Props) => {
  return (
    <div
      id="popup-modal"
      tabIndex={-1}
      className="fixed left-0 right-0 top-0 z-50 h-[calc(100%-1rem)] overflow-y-auto overflow-x-hidden bg-black/40 p-4 md:inset-0 md:h-full"
    >
      <div className="relative mx-auto mt-28 h-full w-full max-w-md md:h-auto">
        <div
          className={`relative rounded-lg shadow ${
            isLoading ? "bg-gray-800 hover:bg-gray-700 " : " bg-gray-700"
          }`}
        >
          {isLoading && <Spinner />}

          <button
            type="button"
            className="absolute right-2.5 top-3 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
            data-modal-hide="popup-modal"
            onClick={handleClose}
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-6 text-center">
            <AiOutlineQuestionCircle className="mx-auto mb-4 h-14 w-14 text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-400">
              {question}
            </h3>
            <button
              data-modal-hide="popup-modal"
              type="button"
              onClick={() => void handleConfirm()}
              className={`${
                variant === "removing"
                  ? "bg-red-600 hover:bg-red-800 focus:ring-red-800"
                  : "bg-blue-700 hover:bg-blue-800 focus:ring-blue-800"
              } mr-2 inline-flex items-center rounded-lg  px-5 py-2.5 text-center text-sm font-medium text-white  focus:outline-none focus:ring-4 `}
            >
              Tak
            </button>
            <button
              data-modal-hide="popup-modal"
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-gray-500 bg-gray-700 px-5 py-2.5  text-sm font-medium text-gray-300 hover:bg-gray-600 hover:text-white focus:ring-gray-600"
            >
              Nie, anuluj
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
