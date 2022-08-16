import axios from "axios";
import axiosRetry from "axios-retry";
import { storageGetLanguage } from "@/lib/localStorage";
import humps from "humps";
import {
  API_MAJOR_VERSION,
  API_BASE_URL,
  API_MINOR_VERSION,
  ERROR_EXPIRED_TOKEN,
} from "@/lib/constant";
import queryString from "qs";
import "nprogress/nprogress.css";
import NProgress from "nprogress";
import useReport from "./useReport";

type HttpConfig = {
  url: string;
  method?: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
  headers?: any;
  data?: any;
  params?: any;
  canRetry?: boolean;
  canCancel?: boolean;
  withCredentials?: boolean;
};

type ResponseData = {
  data: any;
  included?: any;
  meta?: any;
  links?: any;
  success?: boolean;
  message?: string;
};

type AxiosConfig = HttpConfig & {
  cancelToken?: any;
};

function createAxios({ canRetry = false, cancelToken = undefined }) {
  const BASE_URL = `${process.env.VUE_APP_API_DOMAIN}${API_BASE_URL}/${API_MAJOR_VERSION}`;

  const DEFAULT_HEADERS = {
    "Content-Type": "application/json",
    "X-HH-Language": storageGetLanguage(),
  };

  const DEFAULT_PARAMS = {
    client_type: "web",
    minor_version: API_MINOR_VERSION,
  };

  const axiosConfig = {
    baseURL: BASE_URL,
    headers: {
      ...DEFAULT_HEADERS,
    },
    params: {
      ...DEFAULT_PARAMS,
    },
    cancelToken: cancelToken,
    paramsSerializer: (params: Record<string, unknown>) => {
      return queryString.stringify(humps.decamelizeKeys(params));
    },
    transformRequest: [
      function (data: Record<string, unknown>) {
        return JSON.stringify(humps.decamelizeKeys(data));
      },
    ],
    transformResponse: [
      function (data: string) {
        try {
          return humps.camelizeKeys(JSON.parse(data));
        } catch (err) {
          return {};
        }
      },
    ],
    validateStatus: (status: number) => {
      return status < 500;
    },
  };

  const axiosInstance = axios.create(axiosConfig);

  if (canRetry) {
    axiosRetry(axiosInstance, { retries: 3 });
  }
  return axiosInstance;
}

function createHtpp(config: AxiosConfig) {
  const { canRetry } = config;
  const axiosInstance = createAxios({ canRetry });
  return axiosInstance.request(config);
}

export default async function useHttp(httpConfig: HttpConfig) {
  const state = {
    isSuccess: false,
    httpStatus: 0,
    message: "",
    error: {
      message: "",
      shouldReport: false,
      detail: undefined as unknown,
    },
    data: {
      data: undefined as any,
    } as ResponseData,
    cancel: () => {
      return;
    },
  };

  const createConfig = (httpConfig: HttpConfig): AxiosConfig | HttpConfig => {
    const config: AxiosConfig = { ...httpConfig };
    if (config.canCancel) {
      const axiosCancelToken = axios.CancelToken;
      const source = axiosCancelToken.source();
      config.cancelToken = source.token;
      state.cancel = source.cancel;
    }
    return config;
  };

  let response;
  try {
    NProgress.start();
    response = await createHtpp(createConfig(httpConfig));
    const { status, data } = response;
    state.httpStatus = status;

    if (
      typeof data === "string" ||
      typeof data === "number" ||
      typeof data === "boolean" ||
      Array.isArray(data)
    ) {
      state.data.data = data;
    } else {
      Object.keys(data).forEach((attribute) => {
        if (attribute === "data") {
          state.data.data = data.data;
        } else {
          Object.defineProperty(state.data, attribute, {
            value: data[attribute],
            writable: false,
          });
        }
      });
    }
    state.message = typeof data.message === "string" ? data.message : "";
    state.isSuccess = data.success === true ? true : false;
    if (!state.isSuccess) {
      state.error.message = state.message;
    }

    NProgress.done();
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        const { status, data } = err.response;
        state.httpStatus = status;
        state.error.message =
          status === 401 ? ERROR_EXPIRED_TOKEN : data?.message || "";
        state.data.data = data;
        state.error.shouldReport = true;
      } else {
        state.error.detail = err;
        state.error.shouldReport = true;
        state.error.message = "";
      }
    } else {
      state.error.detail = err;
      state.error.message = "Something went wrong when setup http call";
      state.error.shouldReport = true;
      useReport({
        level: "error",
        message: state.error.message,
        errorException: state.error.detail,
      });
    }
    state.isSuccess = false;
    NProgress.done();
  }
  return state;
}
