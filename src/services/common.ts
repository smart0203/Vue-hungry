import isEmpty from "lodash-es/isEmpty";
import sortBy from "lodash-es/sortBy";
import { selectedCityId } from "@/composable/selectCity";
import useHttp from "@/composable/useHttp";
import useReport from "@/composable/useReport";
import humps from "humps";
import qs from "qs";
import { GetCitiesList } from "@/types/APIResponse";

async function getBanners() {
  const defaultErrorMessage = "failed get promotion list";
  try {
    const { data, error } = await useHttp({
      url: `/banners.json?city_id=${selectedCityId.value}`,
      method: "GET",
      headers: {},
    });
    const errorMessage = error.message || defaultErrorMessage;
    if (Array.isArray(data.data)) {
      return {
        isSuccess: true,
        data: sortBy(data.data, ["orderNumber"]),
        message: errorMessage,
      };
    } else {
      useReport({
        level: "error",
        message: errorMessage,
        object: data,
      });
      return {
        isSuccess: true,
        data: [],
        message: defaultErrorMessage,
      };
    }
  } catch (err: any) {
    useReport({
      level: "error",
      message: defaultErrorMessage,
      errorException: err,
    });
    return {
      isSuccess: false,
      data: [],
      message: "failed get promotion list",
    };
  }
}

async function getPackageType() {
  const defaultErrorMessage =
    "Oops, something went wrong, failed get cuisine list";
  try {
    const { isSuccess, message, data, error } = await useHttp({
      method: "GET",
      url: "/package_types.json",
      params: {
        cityId: selectedCityId.value,
      },
    });
    if (!isSuccess) {
      return {
        isSuccess: false,
        message: "",
        data: {},
      };
    }
    if (Array.isArray(data.data)) {
      return {
        isSuccess: true,
        message: message,
        data: data.data,
      };
    }
    return {
      isSuccess: false,
      message: error.message || defaultErrorMessage,
      data: {},
    };
  } catch (err: any) {
    if (err.dontReport) {
      return {
        isSuccess: false,
        message: defaultErrorMessage,
        data: {},
      };
    }
    useReport({
      level: "error",
      message: defaultErrorMessage,
      errorException: err,
    });
    return {
      isSuccess: false,
      message: defaultErrorMessage,
      data: {},
    };
  }
}

async function getAvailableCities() {
  const defaultErrorMessage =
    "Oops, something went wrong, failed get cities list";
  try {
    const { isSuccess, message, data, error, httpStatus } = await useHttp({
      method: "GET",
      url: "/cities.json",
    });
    if (!isSuccess) {
      const usedErrMessage = error.message || defaultErrorMessage;
      if (error.shouldReport) {
        useReport({
          level: "error",
          message: usedErrMessage,
          object: {
            httpStatus,
          },
        });
      }
      return {
        isSuccess: false,
        message: "",
        data: {},
      };
    }
    if (Array.isArray(data.data) && data.data.length) {
      return {
        isSuccess: true,
        message: message,
        data: data.data as GetCitiesList["data"],
      };
    }
    return {
      isSuccess: false,
      message: error.message || defaultErrorMessage,
      data: {},
    };
  } catch (err: any) {
    if (err.dontReport) {
      return {
        isSuccess: false,
        message: defaultErrorMessage,
        data: {},
      };
    }
    useReport({
      message: defaultErrorMessage,
      level: "error",
      errorException: err,
    });
    return {
      isSuccess: false,
      message: defaultErrorMessage,
      data: {},
    };
  }
}

async function getVoucherIntroduction() {
  const defaultErrorMessage =
    "Oops, something went wrong, failed get voucher page data";
  const { isSuccess, data, error } = await useHttp({
    url: "/vouchers/intros.json",
  });
  if (!isSuccess) {
    const message = error.message || defaultErrorMessage;
    if (error.shouldReport) {
      useReport({
        level: "error",
        message: message,
      });
    }
    return {
      isSuccess: false,
      message: message,
      data: null,
    };
  }
  return {
    isSuccess: true,
    data: data,
    message: "",
  };
}

async function getCuisineList(pageNumber = 1, pageSize = 10) {
  const defaultErrorMessage =
    "Oops, something went wrong, failed get cuisine list";
  const defaultQueryString = `?page[size]=${pageSize}&page[number]=${pageNumber}`;
  const additionalQueryString = {
    sort: "name_asc",
  };
  const parseAdditionalQueryString = qs.stringify(
    humps.decamelizeKeys(additionalQueryString),
    {
      encode: false,
    }
  );
  const finalQueryString = `${defaultQueryString}&${parseAdditionalQueryString}`;
  const finalUrl = `/cuisines.json${finalQueryString}`;
  try {
    const {
      isSuccess,
      message,
      data: responseData,
      error,
    } = await useHttp({
      method: "GET",
      url: finalUrl,
      canRetry: true,
    });
    if (isEmpty(responseData)) {
      return {
        isSuccess: false,
        message: defaultErrorMessage,
        data: {},
      };
    } else if (isSuccess) {
      return {
        isSuccess: true,
        message: message,
        data: responseData,
      };
    } else {
      return {
        isSuccess: false,
        message: error.message || defaultErrorMessage,
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
    useReport({
      level: "error",
      message: defaultErrorMessage,
      errorException: err,
    });
    return {
      isSuccess: false,
      message: defaultErrorMessage,
      data: {},
    };
  }
}

async function getLocationList(pageNumber = 1, pageSize = 10) {
  const defaultErrorMessage =
    "Oops, something went wrong, failed get location list";
  const defaultQueryString = `?page[size]=${pageSize}&page[number]=${pageNumber}`;
  const additionalQueryString = {
    sort: "name_asc",
  };
  const parseAdditionalQueryString = qs.stringify(
    humps.decamelizeKeys(additionalQueryString),
    {
      encode: false,
    }
  );
  const finalQueryString = `${defaultQueryString}&${parseAdditionalQueryString}`;
  const finalUrl = `/locations.json${finalQueryString}`;
  try {
    const {
      isSuccess,
      message,
      data: responseData,
      error,
    } = await useHttp({
      method: "GET",
      url: finalUrl,
      canRetry: true,
    });
    if (isEmpty(responseData)) {
      return {
        isSuccess: false,
        message: defaultErrorMessage,
        data: {},
      };
    } else if (isSuccess) {
      return {
        isSuccess: true,
        message: message,
        data: responseData,
      };
    } else {
      return {
        isSuccess: false,
        message: error.message || defaultErrorMessage,
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
    useReport({
      level: "error",
      message: defaultErrorMessage,
      errorException: err,
    });
    return {
      isSuccess: false,
      message: defaultErrorMessage,
      data: {},
    };
  }
}

export {
  getBanners,
  getPackageType,
  getAvailableCities,
  getVoucherIntroduction,
  getCuisineList,
  getLocationList,
};
