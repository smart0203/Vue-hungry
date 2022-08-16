import axios from "../lib/myAjax";
import { API_MINOR_VERSION } from "../constants/api";
import rollbar from "@/lib/rollbar";

async function getConfig() {
  const defaultErrorMessage = "Oops, something went wrong, failed get config";
  try {
    const result = await axios({
      method: "GET",
      url: "/config.json",
      params: {
        apiMinorVersion: API_MINOR_VERSION,
      },
    });
    if (!result) {
      return {
        isSuccess: false,
        message: "",
        data: {},
      };
    }
    if (result.data.success) {
      return {
        isSuccess: true,
        message: result.data.message,
        data: result.data.data,
      };
    } else {
      return {
        isSuccess: false,
        message: result.data.message || defaultErrorMessage,
        data: {},
      };
    }
  } catch (err: any) {
    if (err.dontReport) {
      return {
        isSuccess: false,
        message: defaultErrorMessage,
        data: {},
      };
    }
    rollbar.error({
      message: defaultErrorMessage,
      data: err,
    });
    return {
      isSuccess: false,
      message: defaultErrorMessage,
      data: {},
    };
  }
}

export default getConfig;
