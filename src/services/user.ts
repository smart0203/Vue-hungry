import {
  API_MAJOR_VERSION,
  API_BASE_URL,
  API_CLIENT_TYPE,
  API_PROVIDER,
} from "@/lib/constant";
import Restaurant from "@/models/restaurant";
import omitBy from "lodash-es/omitBy";
import isNil from "lodash-es/isNil";
import isEmpty from "lodash-es/isEmpty";
import axios, { AxiosResponse } from "axios";
import rollbar from "@/lib/rollbar";
import axiosInstance from "@/lib/myAjax";
import qs from "qs";
import humps from "humps";
import { packagePricingType } from "@/helper/PackageHelper";
import { storageGetLanguage } from "@/lib/localStorage";
import { stripHtmlTag } from "@/helper/stringHelper";
import {
  GetUserReservations,
  GetFavRestaurants,
  GetLoyaltyLevel,
} from "@/types/APIResponse";
import useHttp from "@/composable/useHttp";
import useReport from "@/composable/useReport";

async function getProfile(token: string) {
  try {
    const response = await axiosInstance({
      url: `/users.json`,
      method: "get",
      params: {
        accessToken: token,
        provider: "hungryhub",
      },
    });

    if (isEmpty(response)) {
      return {
        isSuccess: false,
        message: "",
      };
    }

    const parsedResponse = response.data;
    if (!isEmpty(parsedResponse.data) && parsedResponse.success === true) {
      return {
        isSuccess: true,
        data: parsedResponse.data,
        message: "",
      };
    }
    return {
      isSuccess: false,
      message: parsedResponse.message,
      data: parsedResponse.data,
    };
  } catch (err: any) {
    if (err.dontReport) {
      return {
        isSuccess: false,
        message: null,
        data: null,
      };
    }
    rollbar.error(err);
    return {
      isSuccess: false,
      message: err,
      data: err,
    };
  }
}

async function signUp({
  name,
  email,
  phone,
  uid,
  callingCode,
  referralCode,
  provider,
  guestBookingIds,
  lang,
  accessToken,
  subscribeMarketingEmail,
  password,
  birthDay,
}: {
  name: string;
  email: string;
  phone: string;
  callingCode: string;
  referralCode?: string;
  provider: string;
  uid?: string;
  accessToken?: string;
  guestBookingIds?: string;
  lang?: string;
  subscribeMarketingEmail?: boolean;
  password?: string;
  birthDay?: string;
}) {
  const payload = omitBy(
    {
      language: lang,
      guestBookingIds: guestBookingIds,
      name: name,
      email: email,
      phone: phone,
      callingCode: callingCode,
      rCode: referralCode,
      provider: provider,
      uid: uid,
      accessToken: accessToken,
      subscribeMarketingEmail: subscribeMarketingEmail,
      password: password,
      birthday: birthDay ? birthDay.replace("/", "-") : null,
    },
    isNil
  );
  return await useHttp({
    url: "/users.json",
    method: "POST",
    data: payload,
  });
}

async function updateProfile(token: string, updateField: any) {
  try {
    const bodyFormData = new FormData();
    bodyFormData.append("access_token", token);
    if (updateField && updateField.length > 0) {
      updateField.forEach((field: any) => {
        const formatedKey = humps.decamelize(field.key);
        bodyFormData.append(`${formatedKey}`, field.val);
      });
    }

    const url = `${process.env.VUE_APP_API_DOMAIN}${API_BASE_URL}/${API_MAJOR_VERSION}`;
    const response = await axios({
      headers: {
        "content-type": "multipart/form-data",
      },
      url: `${url}/users.json`,
      data: bodyFormData,
      method: "PUT",
      withCredentials: false,
    });

    if (isEmpty(response)) {
      return {
        isSuccess: false,
        message: "",
      };
    }

    const parsedResponse = response.data;
    if (parsedResponse.data !== null && parsedResponse.success === true) {
      return {
        isSuccess: true,
        data: humps.camelizeKeys(parsedResponse.data),
        message: parsedResponse.message,
      };
    }
    return {
      isSuccess: false,
      message: parsedResponse.message,
      data: parsedResponse.data,
    };
  } catch (err: any) {
    const errMessage =
      err.message === "Request failed with status code 401"
        ? "Please login first"
        : err.message;
    rollbar.error(err);
    return {
      isSuccess: false,
      message: errMessage,
      data: null,
    };
  }
}

async function getReservation(
  token: string,
  type: "past" | "upcoming" | "pending",
  parmaPageNumber: number,
  paramPageSize: number
) {
  const defaultErrorMessage =
    "Oops, someting went wrong, failed get your reservation list";
  try {
    const pageNumber = parmaPageNumber || 1;
    const pageSize = paramPageSize || 10;
    if (!token) {
      return {
        isSuccess: false,
        message: "Please provide access token",
        data: null,
        meta: {},
      };
    }
    if (
      typeof type !== "string" ||
      ["past", "upcoming", "pending"].includes(type) === false
    ) {
      return {
        isSuccess: false,
        message: "Invalid type, should be 'past' or 'upcoming' 'pending'",
        data: null,
        meta: {},
      };
    }
    const param = {
      accessToken: token,
      provider: "hungryhub",
      includeRestaurant: true,
      orderBy: "created_at desc",
      sectionType: type,
      page: {
        number: pageNumber,
        size: pageSize,
      },
    };
    const paramString = qs.stringify(humps.decamelizeKeys(param), {
      encode: false,
      arrayFormat: "brackets",
    });
    const response: AxiosResponse<GetUserReservations> = await axiosInstance({
      url: `/reservations.json?${paramString}`,
      method: "get",
    });

    if (isEmpty(response)) {
      return {
        isSuccess: false,
        data: null,
        message: "",
        meta: {},
      };
    }

    const parsedResponse = response.data;

    if (parsedResponse.data && parsedResponse.success === true) {
      const included = parsedResponse.included;
      const data = parsedResponse.data.map((data) => {
        let review = {};
        let restaurant = {};
        const relationship = data.relationships;
        const reviewId =
          relationship.review.data !== null &&
          !Array.isArray(relationship.review?.data)
            ? relationship.review.data.id
            : "";
        const restaurantId =
          relationship.restaurant.data !== null &&
          !Array.isArray(relationship.restaurant.data)
            ? relationship.restaurant.data.id
            : "";
        if (reviewId) {
          const filterIncludedReview = included.filter(
            (inc) => inc.id === reviewId
          );

          if (filterIncludedReview && filterIncludedReview.length) {
            review = {
              id: filterIncludedReview[0].id,
              ...filterIncludedReview[0].attributes,
            };
          }
        }
        if (restaurantId) {
          const filterIncludedRestaurant = included.filter(
            (inc) => inc.id === restaurantId
          );

          if (filterIncludedRestaurant && filterIncludedRestaurant.length) {
            restaurant = {
              id: filterIncludedRestaurant[0].id,
              ...filterIncludedRestaurant[0].attributes,
            };
          }
        }
        return {
          id: data.id,
          reviewData: review,
          restaurantData: restaurant,
          ...data.attributes,
        };
      });
      return {
        isSuccess: true,
        data: data,
        message: parsedResponse.message,
        meta: {
          link: parsedResponse.links,
        },
      };
    }
    return {
      isSuccess: false,
      message: parsedResponse.message || defaultErrorMessage,
      data: null,
      meta: {},
    };
  } catch (err: any) {
    rollbar.error(err);
    return {
      isSuccess: false,
      message: defaultErrorMessage,
      data: null,
      meta: {},
    };
  }
}

async function cancelReservation(
  reservationId: string | number,
  token: string
) {
  const defaultErrorMessage =
    "Oops, someting went wrong, failed to cancel your booking";
  try {
    if (!reservationId) {
      throw new Error("reservation id is missing");
    }
    if (!token) {
      throw new Error("access token is missing");
    }

    const response = await axiosInstance({
      url: `/reservations/${reservationId}.json`,
      method: "patch",
      data: {
        accessToken: token,
        provider: API_PROVIDER,
        source: API_CLIENT_TYPE,
        reservation: {
          active: false,
        },
      },
    });

    if (isEmpty(response)) {
      return {
        isSuccess: false,
        data: null,
        message: defaultErrorMessage,
      };
    }
    return {
      isSuccess: true,
      data: "",
      message: response.data.message || "",
    };
  } catch (err: any) {
    rollbar.error(err);
    return {
      isSuccess: false,
      message: defaultErrorMessage,
      data: err,
    };
  }
}

async function getFavourite(
  token: string,
  parmaPageNumber: number,
  paramPageSize: number,
  allowPagination = true
) {
  type GetFavouritePayload = {
    accessToken: string;
    provider: "hungryhub";
    includePackages: boolean;
    includePictures: boolean;
    previewMode: boolean;
    page?: {
      number: number;
      size: number;
    };
  };
  const defaultErrorMessage =
    "Oops, someting went wrong, failed get your favourite restaurants list";
  try {
    const pageNumber = parmaPageNumber || 1;
    const pageSize = paramPageSize || 10;
    if (!token) {
      throw new Error("Please provide access token");
    }
    const param: GetFavouritePayload = {
      accessToken: token,
      provider: "hungryhub",
      includePackages: false,
      includePictures: false,
      previewMode: false,
    };
    if (allowPagination) {
      param.page = {
        number: pageNumber,
        size: pageSize,
      };
    }
    const paramString = qs.stringify(humps.decamelizeKeys(param), {
      encode: false,
      arrayFormat: "brackets",
    });
    const response: AxiosResponse<GetFavRestaurants> = await axiosInstance({
      url: `/users/favorite_restaurants.json?${paramString}`,
      method: "get",
    });

    if (isEmpty(response)) {
      return {
        isSuccess: false,
        data: null,
        message: defaultErrorMessage,
      };
    }

    const parsedResponse = response.data;

    if (parsedResponse.data && parsedResponse.success === true) {
      const metaLink = parsedResponse.links;
      const favRestaurants = parsedResponse.data;
      if (Array.isArray(favRestaurants) === false) {
        rollbar.error("Fav restaurant response is not array", {
          response: favRestaurants,
        });
        return {
          isSuccess: false,
          message: defaultErrorMessage,
          data: null,
        };
      }
      const remapFavRestaurants = favRestaurants.map((data) => {
        const attributes = data.attributes;
        const restaurant = new Restaurant({
          type: data.type,
          logo: attributes.logoUrl.medium,
          lat: attributes.lat,
          lng: attributes.lng,
          slug: attributes.slug,
          isCatalog: true,
          id: data.id,
          name: attributes.name,
          reviewsCount: attributes.reviewsCount,
          reviewsScore: attributes.reviewsScore,
          branchId: attributes.branchId,
          expiryDate: attributes.expiryDate,
          primaryCuisine: {
            id: attributes.primaryCuisine.id,
            name: attributes.primaryCuisine.name || "",
          },
          primaryLocation: {
            id: attributes.primaryLocation.id,
            name: attributes.primaryLocation.name || "",
          },
          imageCoverUrl: {
            thumb: null,
            original: attributes.imageCoverUrl.large,
          },
          lastBookingWasMade: attributes.lastBookingWasMade,
          totalCovers: attributes.totalCovers,
          availablePackageTypes: attributes.availablePackageTypes,
          price: {
            amount: attributes.priceAndPricingType.amount,
            currency: attributes.priceAndPricingType.currency,
            symbol: attributes.priceAndPricingType.symbol,
            format: attributes.priceAndPricingType.format,
          },
          pricingType: packagePricingType("per_person", storageGetLanguage()),
          totalLocations: attributes.locations?.length || 0,
          description: stripHtmlTag(attributes.description),
          tags: attributes.hashtags,
          openingHoursShort: attributes.openingHoursShort,
        });
        return restaurant;
      });
      return {
        isSuccess: true,
        data: remapFavRestaurants,
        meta: {
          link: metaLink,
        },
        message: parsedResponse.message,
      };
    }
    return {
      isSuccess: false,
      message: parsedResponse.message || defaultErrorMessage,
      data: parsedResponse.data,
    };
  } catch (err: any) {
    rollbar.error(err);
    return {
      isSuccess: false,
      message: defaultErrorMessage,
      data: err,
    };
  }
}

async function toggleFavouriteRestaurant(
  accessToken: string,
  restaurantId: number | string
) {
  const defaultErrorMessage =
    "Oops, something went wrong, failed modify favourite restaurant";
  try {
    if (accessToken && accessToken.length === 0) {
      return {
        isSuccess: false,
        data: null,
        message: "No token provided",
      };
    }
    if (!restaurantId) {
      return {
        isSuccess: false,
        data: null,
        message: "please select restaurant first",
      };
    }
    const response = await axiosInstance({
      url: "/users/favorite_restaurants/toggle.json",
      method: "patch",
      data: {
        accessToken,
        restaurantId,
        previewMode: false,
      },
    });

    if (isEmpty(response)) {
      return {
        isSuccess: false,
        data: null,
        message: defaultErrorMessage,
      };
    }

    const responseData = response.data;

    if (!isEmpty(responseData) && responseData.success) {
      return {
        isSuccess: true,
        data: responseData.data,
        message: responseData.message,
      };
    }
    return {
      isSuccess: false,
      data: null,
      message: responseData.message || defaultErrorMessage,
    };
  } catch (err) {
    const error = {
      message: defaultErrorMessage,
      cause: err,
      data: err,
    };
    rollbar.error(error);
    return {
      isSuccess: true,
      data: null,
      message: defaultErrorMessage,
    };
  }
}

async function refreshToken(refreshToken: string) {
  try {
    if (!refreshToken) {
      return {
        isSuccess: false,
        data: null,
        message: "Missing refresh token",
      };
    }

    const url = `${process.env.VUE_APP_API_DOMAIN}`;
    const response = await axiosInstance({
      url: `${url}/oauth/token.json`,
      data: {
        grantType: "refresh_token",
        refreshToken: refreshToken,
      },
      method: "POST",
    });

    if (!response) {
      return {
        isSuccess: false,
        message: "",
        data: null,
      };
    }

    const parsedResponse = response.data;
    if (parsedResponse.data !== null && parsedResponse.success === true) {
      return {
        isSuccess: true,
        data: parsedResponse.data,
        message: parsedResponse.message,
      };
    }
    return {
      isSuccess: false,
      message: parsedResponse.message,
      data: parsedResponse.data,
    };
  } catch (err: any) {
    rollbar.error(err);
    return {
      isSuccess: false,
      message: err,
      data: null,
    };
  }
}

async function getLoyaltyLevel() {
  const defaultErrorMessage =
    "Oops, someting went wrong, failed get privilege data";
  try {
    const url = "/loyalty_levels.json";
    const response: AxiosResponse<GetLoyaltyLevel> = await axiosInstance({
      url: `${url}`,
      method: "GET",
    });
    if (isEmpty(response.data)) {
      rollbar.error(defaultErrorMessage, { response });
      return {
        isSuccess: false,
        data: [],
        message: defaultErrorMessage,
      };
    }
    const parsedData = response.data.data.map((privilege) => {
      return {
        id: privilege.id,
        ...privilege.attributes,
      };
    });
    return {
      isSuccess: true,
      message: response.data.message,
      data: parsedData,
    };
  } catch (err: any) {
    rollbar.error(defaultErrorMessage, err);
    return {
      isSuccess: false,
      message: defaultErrorMessage,
      data: [],
    };
  }
}

async function deleteAccount(token: string, reason: string) {
  const defaultErrorMessage =
    "Oops, Something went wrong, failed process delete account request";
  const defaultSuccessMessage = "Account deleted";
  const response = {
    message: "",
    isSuccess: false,
  };
  if (
    typeof token !== "string" ||
    (typeof token == "string" && token.length === 0)
  ) {
    response.isSuccess = false;
    response.message = "Invalid access token";
    useReport({
      level: "error",
      message: response.message,
      object: {
        token,
      },
    });
    return response;
  }
  if (
    typeof reason !== "string" ||
    (typeof reason == "string" && reason.length === 0)
  ) {
    response.isSuccess = false;
    response.message = "Invalid delete account reason";
    useReport({
      level: "error",
      message: response.message,
      object: {
        token,
      },
    });
    return response;
  }
  try {
    const payload = {
      accessToken: token,
      reason: reason,
    };
    const { isSuccess, message, error } = await useHttp({
      url: "/users/delete_account",
      method: "POST",
      data: payload,
    });

    response.isSuccess = isSuccess;
    response.message = isSuccess
      ? message || defaultSuccessMessage
      : error.message;
    return response;
  } catch (err: unknown) {
    useReport({
      level: "error",
      message: defaultErrorMessage,
      errorException: err,
    });
    response.isSuccess = false;
    response.message = defaultErrorMessage;
    return response;
  }
}

async function getDeleteReason(): Promise<{
  isSuccess: boolean;
  message: string;
  data: string[];
}> {
  const { isSuccess, message, error, data } = await useHttp({
    url: "/users/deletion_reasons",
    method: "GET",
  });

  if (isSuccess) {
    return {
      isSuccess: true,
      message: message || "",
      data: data.data,
    };
  }

  return {
    isSuccess: false,
    message: error.message,
    data: [],
  };
}

async function checkHasPhoneNumber(uid: string, provider: string) {
  const defaultErrorMessage =
    "Oops, something went wrong, failed check user phone number";
  const response = {
    isSuccess: false,
    message: "",
    hasNumber: false,
  };
  if (
    typeof uid !== "string" ||
    (typeof uid === "string" && uid.length === 0)
  ) {
    response.message = "Invalid uid";
    return response;
  }
  if (
    typeof provider !== "string" ||
    (typeof provider === "string" && provider.length === 0)
  ) {
    response.message = "Invalid provider";
    return response;
  }
  const payload = {
    uid,
    provider,
  };
  const { isSuccess, error, data } = await useHttp({
    url: "/users/check_phone_number",
    method: "GET",
    params: payload,
  });

  if (isSuccess) {
    response.isSuccess = true;
    // @ts-ignore
    response.hasNumber = data.hasNumber || false;
    return response;
  }
  response.message = error.message || defaultErrorMessage;
  return response;
}

export {
  getProfile,
  updateProfile,
  getReservation,
  getFavourite,
  cancelReservation,
  toggleFavouriteRestaurant,
  refreshToken,
  getLoyaltyLevel,
  deleteAccount,
  getDeleteReason,
  checkHasPhoneNumber,
  signUp,
};
