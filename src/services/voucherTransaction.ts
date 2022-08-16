import useHttp from "@/composable/useHttp";
import useReport from "@/composable/useReport";
import omitBy from "lodash-es/omitBy";
import isNil from "lodash-es/isNil";
import { CustomVoucher, RestaurantVoucher } from "@/types/RestaurantVoucher";
import {
  BOOKING_PAYMENT_METHOD_CREDIT_CARD,
  BOOKING_PAYMENT_METHOD_PROMPT_PAY,
  BOOKING_PAYMENT_METHOD_TRUE_WALLET,
  API_PROVIDER,
  API_CLIENT_TYPE,
} from "@/lib/constant";

export async function getVoucherTransaction(id: string | number) {
  const defaultErrorMessage =
    "Oops, someting went wrong, failed get voucher transaction detail";
  let message = "";
  if (typeof id !== "string" && typeof id !== "number") {
    message = "Invalid voucher transaction id";
    useReport({
      level: "error",
      message: message,
      object: {
        id,
      },
    });
    return {
      isSuccess: false,
      message: message,
      data: null,
    };
  }
  const {
    isSuccess,
    message: responseMessage,
    data: responseData,
    error,
    httpStatus,
  } = await useHttp({
    url: `/voucher_transactions/${id}`,
    canRetry: true,
  });

  if (!isSuccess) {
    if (error.shouldReport) {
      useReport({
        level: "error",
        message: error.message || defaultErrorMessage,
        object: {
          responseData: responseData,
          httpStatus,
        },
      });
    }
    return {
      isSuccess: false,
      message: error.message || defaultErrorMessage,
    };
  }

  const { included } = responseData;
  if (Array.isArray(included) === false) {
    useReport({
      level: "error",
      message: "Included attributes is not array",
    });
  }
  return {
    isSuccess: true,
    message: responseMessage,
    data: responseData,
  };
}

export async function buyVoucher({
  accessToken,
  guestUser,
  customVouchers,
  restaurantVouchers,
  restaurantId,
  paymentType,
  omiseToken,
  creditCard,
  is3DPayment = false,
}: {
  accessToken: string;
  guestUser: { name: string; email: string; phone: string };
  customVouchers: CustomVoucher[];
  restaurantVouchers: RestaurantVoucher[];
  restaurantId?: string | number;
  paymentType: string;
  omiseToken?: string;
  creditCard?: {
    name: string;
    number: string;
    expirationMonth: string;
    expirationYear: string;
    token: string;
  };
  is3DPayment: boolean;
}) {
  const isValidGuestAttribute =
    !guestUser ||
    typeof guestUser.name !== "string" ||
    typeof guestUser.email !== "string" ||
    typeof guestUser.phone !== "string"
      ? false
      : true;
  const isValidAccessToken =
    (typeof accessToken === "string" && accessToken.length === 0) ||
    typeof accessToken !== "string"
      ? false
      : true;

  const defaultErrorMessage =
    "Oops, something went wrong, failed booking your voucher";
  let message, data;

  // validating restaurant vouchers and restaurant id
  if (
    typeof restaurantId !== "string" &&
    typeof restaurantId !== "number" &&
    Array.isArray(restaurantVouchers) &&
    restaurantVouchers.length > 0
  ) {
    message = "Invalid or missing restaurantId";
    data = restaurantId;
    useReport({
      level: "error",
      message: message,
      object: { data },
    });
    return {
      isSuccess: false,
      message,
      data,
    };
  }

  if (!Array.isArray(customVouchers)) {
    message = "Custom vouchers must be an array";
    useReport({
      level: "error",
      message: message,
      object: { data },
    });
    return {
      isSuccess: false,
      message,
      data,
    };
  }

  if (
    paymentType !== BOOKING_PAYMENT_METHOD_CREDIT_CARD &&
    paymentType !== BOOKING_PAYMENT_METHOD_PROMPT_PAY &&
    paymentType !== BOOKING_PAYMENT_METHOD_TRUE_WALLET
  ) {
    message = "Invalid payment type";
    useReport({
      level: "error",
      message: message,
      object: { data },
    });
    return {
      isSuccess: false,
      message,
      data: paymentType,
    };
  }

  if (isValidGuestAttribute === false && isValidAccessToken === false) {
    if (!isValidGuestAttribute) {
      message = "Guest attribute is not valid";
      data = guestUser;
    } else {
      message = "Access token is not valid";
      data = accessToken;
    }
    useReport({
      level: "error",
      message: message,
      object: { data },
    });
    return {
      isSuccess: false,
      message,
      data,
    };
  }

  if (customVouchers.length === 0 && restaurantVouchers.length === 0) {
    message =
      customVouchers.length === 0
        ? "Custom vouchers is empty"
        : "Restaurant vouchers is empty";
    useReport({
      level: "error",
      message: message,
      object: { data },
    });
    return {
      isSuccess: false,
      message,
      data: "",
    };
  }

  if (paymentType === BOOKING_PAYMENT_METHOD_CREDIT_CARD) {
    if (typeof creditCard === "undefined") {
      message = "Missing card object";
      useReport({
        level: "error",
        message: message,
        object: { data },
      });
      return {
        isSuccess: false,
        message,
        data,
      };
    }
    const { name, number, expirationMonth, expirationYear, token } = creditCard;
    const validCCName = typeof name === "string" && name.length > 0;
    const validCCNumber = typeof number === "string" && number.length > 0;

    const validCCMonth =
      typeof expirationMonth === "string" && expirationMonth.length > 0;
    const validCCYear =
      typeof expirationYear === "string" && expirationYear.length > 0;
    const validToken = typeof token === "string" && token.length > 0;
    if (
      !validCCName ||
      !validCCNumber ||
      !validCCMonth ||
      !validCCYear ||
      !validToken
    ) {
      message = "Invalid card attribute";
      useReport({
        level: "error",
        message: message,
        object: { data },
      });
      return {
        isSuccess: false,
        message,
        data: creditCard,
      };
    }
  }

  const payload = {
    accessToken: isValidAccessToken ? accessToken : null,
    guestUser: isValidGuestAttribute ? guestUser : null,
    provider: API_PROVIDER,
    source: API_CLIENT_TYPE,
    vouchers: {
      customAmount: [...restaurantVouchers, ...customVouchers],
      packages: [],
    },
    restaurantId,
    paymentType,
    omiseToken,
    gbPrimepayCard: creditCard,
    use_3d_secure: is3DPayment,
  };

  const finalPayload = omitBy(payload, isNil);

  const {
    isSuccess,
    message: responseMessage,
    error,
    data: responseData,
  } = await useHttp({
    url: "/voucher_transactions",
    method: "POST",
    data: finalPayload,
  });
  if (isSuccess) {
    return {
      isSuccess: true,
      message: responseMessage,
      data: responseData,
    };
  }
  message = error.message || defaultErrorMessage;
  if (error.shouldReport) {
    useReport({
      level: "error",
      message: message,
      object: { data },
      errorException: error.detail,
    });
  }
  return {
    isSuccess: false,
    data: null,
    message: message,
  };
}
