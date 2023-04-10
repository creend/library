/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { toast } from "react-hot-toast";

export const handleApiError = (defaultErrorMessage: string) => (e: any) => {
  let errorMessage = defaultErrorMessage;
  if (e?.message) {
    errorMessage = e.message;
  } else {
    const errorMessages = e.data?.zodError?.fieldErrors.content;
    if (errorMessages && errorMessages[0]) {
      errorMessage = errorMessages[0];
    }
  }
  toast.error(errorMessage);
};
