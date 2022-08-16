import axios from "./myAjax";
import backgroundFetch from "./backgroundFetch.worker";
import { storageGetLanguage } from "./localStorage";
import * as alert from "@/lib/alert";
import addURLQuery from "@/helper/addURLQueryHelper";
import { isOpen as isServerBusyModalOpen } from "@/components/Common/ServerBusy/serverBusy";

const workerFetch = async function ({ method = "get", url, headers }) {
  const finalUrl = addURLQuery(url);
  try {
    const defaultHeaders = {
      "Content-Type": "application/json",
      "X-HH-Language": storageGetLanguage(),
    };
    const result = await backgroundFetch({
      headers: { ...defaultHeaders, headers },
      method,
      url: finalUrl,
    });
    return JSON.parse(result);
  } catch (error) {
    const errorMessage = error.message.toLowerCase().trim();
    if (errorMessage === "failed to fetch") {
      alert.error("Network Error, Please check your internet connection");
      error.dontReport = true;
      return Promise.reject(error);
    }
    if (errorMessage === "service unavailable") {
      isServerBusyModalOpen.value = true;
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
};

export { axios, workerFetch };
