import { API_MAJOR_VERSION, API_BASE_URL } from "./constant";
import { storageGetLanguage } from "./localStorage";
import humps from "humps";
import "nprogress/nprogress.css";
import NProgress from "nprogress/nprogress.js";
import axiosRetry from "axios-retry";
import * as alert from "@/lib/alert";
import { isOpen as isServerBusyModalOpen } from "@/components/Common/ServerBusy/serverBusy";

const axios = require("axios").default;
const queryString = require("query-string");
const url = `${process.env.VUE_APP_API_DOMAIN}${API_BASE_URL}/${API_MAJOR_VERSION}`;

function axiosCancelFactory() {
  const cancelToken = axios.CancelToken;
  const source = cancelToken.source();
  return source;
}

function axiosFactory(paramConfig) {
  let canRetry =
    paramConfig.canRetry === undefined ? true : paramConfig.canRetry;

  let defaultConfig = {
    baseURL: url,
    headers: {
      "Content-Type": "application/json",
      "X-HH-Language": storageGetLanguage(),
    },
    params: {
      client_type: "web",
    },
    paramsSerializer: (params) => {
      return queryString.stringify(humps.decamelizeKeys(params));
    },
    transformRequest: [
      function (data) {
        return JSON.stringify(humps.decamelizeKeys(data));
      },
    ],
    transformResponse: [
      function (data) {
        try {
          // Do whatever you want to transform the data
          return humps.camelizeKeys(JSON.parse(data));
        } catch (err) {
          console.error(err, data);
          return {};
        }
      },
    ],
    validateStatus: (status) => {
      return status < 500;
    },
  };

  if (paramConfig.cancelToken && paramConfig.cancelToken.length) {
    defaultConfig.cancelToken = paramConfig.cancelToken;
  }
  // create axios instance
  const instance = axios.create(defaultConfig);
  // register request & response interceptor
  instance.interceptors.request.use(
    function (config) {
      config.headers["X-HH-Language"] = storageGetLanguage();
      NProgress.start();
      // Do something before request is sent
      return config;
    },
    function (error) {
      NProgress.done();
      // Do something with request error
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    function (response) {
      NProgress.done();
      // Any status code that lie within the range of 2xx cause this function to trigger
      return response;
    },
    function (error) {
      NProgress.done();
      // Any status codes that falls outside the range of 2xx cause this function to trigger

      const errorMessage = error.message.toLowerCase().trim();
      const errorAborted = "request aborted";
      const error503 = "request failed with status code 503";
      const errorNetwork = "network error";

      if (errorMessage === errorNetwork) {
        alert.error("Network Error, Please check your internet connection");
        error.dontReport = true;
        return Promise.reject(error);
      }
      if (errorMessage === error503) {
        error.dontReport = true;
        isServerBusyModalOpen.value = true;
        return Promise.reject(error);
      }
      if (errorMessage === errorAborted) {
        error.dontReport = true;
        return Promise.reject(error);
      }
      return Promise.reject(error);
    }
  );

  // if canRetry true, then add axiosRetry plugin
  if (canRetry) {
    // retry if request fail 3 times
    axiosRetry(instance, { retries: 3 });
    return instance.request(paramConfig);
  }
  return instance.request(paramConfig);
}
export default axiosFactory;
export { axiosFactory as axios, axiosCancelFactory as axiosCancel };
