import { PRODUCTION_URL } from "@/lib/constant";
import * as alert from "@/lib/alert";
import useReport from "./useReport";

export const isSupport = typeof navigator.share === "function" ? true : false;
export default function useNavigatorShare({
  title = "Hungryhub",
  url = PRODUCTION_URL,
  message = "",
  erroMessage = "",
}: {
  title: string;
  url: string;
  message: any;
  erroMessage: string;
}) {
  const defaultErrorMessage =
    "Oops, something went wrong, share action cannot be performed";
  const parsedErrorMessage = erroMessage || defaultErrorMessage;
  if (navigator.share) {
    navigator
      .share({
        title: title,
        text: message,
        url: url,
      })
      .catch((error) => {
        const errorMessage = error.message.trim().toLowerCase();
        if (
          errorMessage.includes("share canceled") ||
          errorMessage.includes("abort due to cancellation of share")
        ) {
          return;
        }
        alert.error(parsedErrorMessage);
        useReport({
          level: "error",
          message: parsedErrorMessage,
          errorException: error,
          object: {
            title,
            message,
          },
        });
      });
  }
}
