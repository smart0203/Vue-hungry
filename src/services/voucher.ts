import { axios } from "@/lib/fetcher";
import { AxiosResponse } from "axios";
import rollbar from "@/lib/rollbar";
import qs from "qs";
import humps from "humps";
import { string, number, assert, array, union } from "superstruct";
import omitBy from "lodash-es/omitBy";
import isNil from "lodash-es/isNil";
import isEmpty from "lodash-es/isEmpty";
import useHttp from "@/composable/useHttp";
import {
  UserVoucher,
  ValidateVoucher as ValidateVoucherAPIResponse,
  VoucherData,
} from "@/types/APIResponse";

async function validateVoucher({
  restaurantId,
  userId = null,
  voucherCode,
  deliveryFee,
  distanceToRestaurant,
  adult,
  kids,
  packages,
  ccNumber,
  reservationDate,
  phone = null,
  email = null,
  serviceType,
}: {
  restaurantId: string | number;
  userId?: string | null | undefined;
  voucherCode: string | string[];
  deliveryFee: string | number;
  distanceToRestaurant: string | number;
  adult: number;
  kids: number;
  packages: any;
  ccNumber: string;
  reservationDate: string;
  phone?: string | null | undefined;
  email?: string | null | undefined;
  serviceType: string;
}) {
  const defaultErrorMessage =
    "Oops, something went wrong when applying voucher";
  try {
    assert(restaurantId, string());
    assert(voucherCode, union([string(), array()]));
    const payload = omitBy(
      {
        restaurantId,
        userId,
        voucherCode,
        deliveryFee,
        distanceToRestaurant,
        adult,
        kids,
        packages,
        ccNumber,
        reservationDate,
        phone,
        email,
        serviceType,
      },
      isNil
    );
    payload.serviceType = payload.serviceType
      ? payload.serviceType.replace(" ", "_")
      : "";

    const { isSuccess, message, data } = await useHttp({
      url: "/vouchers/validate",
      method: "POST",
      data: payload,
    });

    let voucherData: VoucherData[] = [];
    const responseData: ValidateVoucherAPIResponse = data;
    const responseDataVouchers = responseData.data;
    const usedVouchers = responseData.meta?.calculate?.usedVouchers || [];

    if (isEmpty(responseData)) {
      const message = "Response was empty";
      rollbar.error(message, { data });
      return {
        isSuccess: false,
        message: defaultErrorMessage,
        data: null,
        meta: null,
      };
    }

    if (isSuccess === false || isEmpty(responseData.data)) {
      return {
        isSuccess: false,
        message: message || defaultErrorMessage,
        data: null,
        meta: null,
      };
    }

    if (isSuccess && Array.isArray(usedVouchers) && usedVouchers.length === 0) {
      const message = "used vouchers attribute is empty";
      rollbar.error(message, { data: responseData });
      return {
        isSuccess: false,
        message: defaultErrorMessage,
        data: null,
        meta: null,
      };
    }

    if (responseDataVouchers === null) {
      const message = "vouchers attribute is empty";
      rollbar.error(message, { data: responseData });
      return {
        isSuccess: false,
        message: defaultErrorMessage,
        data: null,
        meta: null,
      };
    }

    voucherData = Array.isArray(responseDataVouchers)
      ? responseDataVouchers
      : [{ ...responseDataVouchers }];

    const voucher = voucherData.map((voucher) => {
      let amountUsed = 0;

      const filterUsedVouchers = usedVouchers.filter((usedVoucher) => {
        return usedVoucher.id == voucher.id;
      });

      if (filterUsedVouchers.length) {
        amountUsed = filterUsedVouchers[0].amount;
      }

      return {
        id: voucher.id,
        type: voucher.type,
        ...voucher.attributes,
        amountUsed,
        isDeductible: voucher.attributes?.usageType === "deductible",
      };
    });
    return {
      isSuccess: responseData.success,
      message: responseData.message,
      data: voucher,
      meta: responseData.meta,
    };
  } catch (err) {
    // @ts-ignore
    if (err.dontReport === false) {
      // @ts-ignore
      rollbar.error(defaultErrorMessage, err);
    }
    return {
      isSuccess: false,
      message: defaultErrorMessage,
      data: null,
      meta: null,
    };
  }
}

async function getVouchers(
  token: string,
  sectionType = "active",
  paramPageNumber = 1,
  paramPageSize = 10
) {
  const defaultErrorMessage =
    "Oops, something went wrong, failed get voucher list";
  try {
    assert(token, string());
    assert(sectionType, string());
    assert(paramPageNumber, number());
    assert(paramPageSize, number());
    const queryString = {
      accessToken: token,
      provider: "hungryhub",
      page: {
        number: paramPageNumber,
        size: paramPageSize,
      },
      sectionType: sectionType,
    };

    const stringifyQueryString = qs.stringify(
      humps.decamelizeKeys(queryString),
      {
        encode: false,
      }
    );
    const response: AxiosResponse<UserVoucher> = await axios({
      url: `/users/vouchers.json?${stringifyQueryString}`,
      method: "get",
    });

    const responseData = response.data;
    if (isEmpty(responseData)) {
      rollbar.error(defaultErrorMessage, {
        queryString: stringifyQueryString,
      });
      return {
        isSuccess: false,
        message: defaultErrorMessage,
        data: [],
        meta: null,
      };
    }
    const vouchers = responseData.data.map((voucher) => {
      return {
        id: voucher.id,
        type: voucher.type,
        ...voucher.attributes,
        isDeductible: voucher.attributes?.usageType === "deductible",
      };
    });
    return {
      isSuccess: responseData.success || false,
      data: vouchers || [],
      message: responseData.message,
      meta: {
        links: responseData.links,
        total: responseData.meta?.total,
      },
    };
  } catch (err) {
    // @ts-ignore
    rollbar.error(defaultErrorMessage, err);
    return {
      isSuccess: false,
      data: [],
      message: defaultErrorMessage,
      meta: null,
    };
  }
}

async function redeemVoucher(token: string, amount: number) {
  const defaultErrorMessage =
    "Oops, something went wrong, failed redeem point to voucher";
  try {
    assert(token, string());
    assert(amount, number());

    const response = await axios({
      url: `/users.json`,
      method: "post",
      data: {
        accessToken: token,
        redeemAmount: amount,
      },
    });

    const responseData = response.data;
    if (isEmpty(responseData)) {
      rollbar.error(defaultErrorMessage, { amount: amount });
      return {
        isSuccess: false,
        message: defaultErrorMessage,
        data: null,
      };
    }

    return {
      isSuccess: responseData.success || false,
      message: responseData.message,
      data: null,
    };
  } catch (err) {
    // @ts-ignore
    rollbar.error(err);
    return {
      isSuccess: false,
      message: defaultErrorMessage,
      data: null,
    };
  }
}

export { validateVoucher, getVouchers, redeemVoucher };
