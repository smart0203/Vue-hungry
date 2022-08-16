import { ref, computed } from "@vue/composition-api";
import store from "@/store/index";
import { i18n } from "@/lib/i18n/i18n";
import dayjs from "@/lib/dayjs";
import { validateVoucher as fetchValidateVoucher } from "@/services/voucher";
import rollbar from "@/lib/rollbar";
import * as alert from "@/lib/alert";
import { removeLeadingZero } from "@/helper/phoneNumber";
import isEmpty from "lodash-es/isEmpty";
import uniq from "lodash-es/uniq";
import {
  ERROR_INVALID_DATE,
  VOUCHER_CATEGORY_GIFT,
  VOUCHER_CATEGORY_REDEMPTION,
  SUPPORTED_PAYMENT_PROMPT_PAY,
  SUPPORTED_PAYMENT_CREDIT_CARD,
  SUPPORTED_PAYMENT_TRUE_WALLET,
  SUPPORTED_PAYMENT_SHOPEE_PAY,
} from "@/lib/constant";
import { Voucher, Voucher as VoucherType } from "@/types/Voucher";

type VoucherApplied = VoucherType & {
  isValid?: boolean;
  isSuccess?: boolean;
  validationMessage?: string;
};

const voucherCode = ref("");
const voucherValidationIsSuccess = ref<null | boolean>(null);
const voucherApplied = ref<VoucherApplied[]>([]);
const voucherCheckLoading = ref(false);

const isAnyGiftVoucherApplied = computed(() => {
  const giftVoucher = voucherApplied.value.filter(
    (voucher) => voucher.voucherCategory === VOUCHER_CATEGORY_GIFT
  );
  return giftVoucher.length > 0 ? true : false;
});

const isAnyRedemptionVoucherApplied = computed(() => {
  const redemptionVoucher = voucherApplied.value.filter(
    (voucher) => voucher.voucherCategory === VOUCHER_CATEGORY_REDEMPTION
  );
  return redemptionVoucher.length > 0 ? true : false;
});

const validVoucherApplied = computed(() => {
  return voucherApplied.value.filter((voucher) => voucher.isValid);
});

const anyValidVoucherApplied = computed(() => {
  return validVoucherApplied.value.length > 0 ? true : false;
});

const voucherPaymentType = computed(() => {
  let ccPayment = false;
  let qrPayment = false;
  let trueWalletPayment = false;
  let shopeePayPayment = false;
  voucherApplied.value.forEach((voucher) => {
    if (voucher.paymentTypes.includes(SUPPORTED_PAYMENT_PROMPT_PAY)) {
      qrPayment = true;
    }
    if (voucher.paymentTypes.includes(SUPPORTED_PAYMENT_CREDIT_CARD)) {
      ccPayment = true;
    }
    if (voucher.paymentTypes.includes(SUPPORTED_PAYMENT_SHOPEE_PAY)) {
      shopeePayPayment = true;
    }
    if (voucher.paymentTypes.includes(SUPPORTED_PAYMENT_TRUE_WALLET)) {
      trueWalletPayment = true;
    }
  });

  return {
    ccPayment,
    qrPayment,
    trueWalletPayment,
    shopeePayPayment,
  };
});

const isVoucherNeedPayment = computed(() => {
  const { ccPayment, qrPayment, trueWalletPayment, shopeePayPayment } =
    voucherPaymentType.value;
  return ccPayment || qrPayment || trueWalletPayment || shopeePayPayment;
});

const parsedVoucherValidationMessage = computed(() => {
  if (
    voucherPaymentType.value.ccPayment &&
    // @ts-ignore
    store.state.booking.creditCard.number.length === 0
  ) {
    return i18n.t("voucherNeedPrePayment");
  }
  return uniq(
    voucherApplied.value.map((voucher) => voucher.validationMessage)
  )[0];
});

async function validateVoucher(isRedemption = false) {
  try {
    const payload: {
      email?: string;
      phone?: string;
      userId?: string;
      restaurantId: string | number;
      voucherCode: string | string[];
      deliveryFee: string | number;
      distanceToRestaurant: number;
      adult: number;
      kids: number;
      packages: any;
      ccNumber: string;
      reservationDate: string;
      serviceType: string;
    } = {
      restaurantId: 0,
      voucherCode: "",
      deliveryFee: 0,
      distanceToRestaurant: 0,
      adult: 0,
      kids: 0,
      packages: "",
      ccNumber: "",
      reservationDate: "",
      serviceType: "",
    };
    if (voucherCode.value && voucherCode.value.length === 0) {
      return {
        isSuccess: false,
        data: null,
        message: "Please enter voucher code",
        meta: null,
      };
    }
    const isUserSignedIn = store.getters["user/isUserSignedIn"];
    // @ts-ignore
    const { id: userId, phone, phoneCode, email } = store.state.user;
    if (!isUserSignedIn) {
      if (!phone || (phone && phone.length === 0)) {
        return {
          isSuccess: false,
          data: null,
          message: i18n.t("pleaseEnterPhone"),
          meta: null,
        };
      } else if (!email || (email && email.length === 0)) {
        return {
          isSuccess: false,
          data: null,
          message: i18n.t("pleaseEnterEmail"),
          meta: null,
        };
      }

      payload.email = email;
      payload.phone = `${phoneCode}${removeLeadingZero(phone)}`;
    } else {
      payload.userId = userId;
    }
    voucherCheckLoading.value = true;
    const selectedPackages = await store.dispatch(
      "bookingPackage/buildPackagePayload"
    );
    // @ts-ignore
    const { restaurantId } = store.state.restaurant;
    // @ts-ignore
    const { deliveryFee } = store.state.bookingCharge;
    const {
      creditCard,
      bookingMethod,
      distanceToRestaurant,
      adult,
      kids,
      selectedDate,
      // @ts-ignore
    } = store.state.booking;
    const selectedDateDayJsInstance = dayjs(selectedDate);
    if (selectedDateDayJsInstance.isValid() === false) {
      return {
        isSuccess: false,
        data: null,
        message: ERROR_INVALID_DATE,
        meta: null,
      };
    }
    let voucherCodes: string | string[] = "";
    const formatedCcNumber = () => {
      if (creditCard.number) {
        return creditCard.number.replace(/\s/g, "").substring(0, 11) + "XXXX";
      }
      return "";
    };

    const appliedVoucher = voucherApplied.value.map(
      (voucher) => voucher.voucherCode
    );

    if (appliedVoucher.length) {
      if (isRedemption && voucherCode.value) {
        voucherCodes = voucherCode.value;
      } else if (voucherCode.value && voucherCode.value.length > 0) {
        voucherCodes = [...appliedVoucher, voucherCode.value];
      } else {
        voucherCodes = [...appliedVoucher];
      }
    } else {
      voucherCodes = voucherCode.value;
    }

    payload.restaurantId = restaurantId;
    payload.voucherCode = voucherCodes;
    payload.deliveryFee = deliveryFee;
    payload.distanceToRestaurant =
      bookingMethod !== "delivery" ? 0 : distanceToRestaurant.value;
    payload.adult = adult;
    payload.kids = kids;
    payload.packages = selectedPackages;
    payload.ccNumber = formatedCcNumber();
    payload.reservationDate = selectedDateDayJsInstance.format("YYYY-MM-DD");
    payload.serviceType = bookingMethod;
    const result = await fetchValidateVoucher(payload);
    voucherCheckLoading.value = false;
    return result;
  } catch (err) {
    // @ts-ignore
    rollbar.error(err);
    return {
      isSuccess: false,
      data: null,
      message: "",
      meta: null,
    };
  }
}

async function useVoucher(isRedemption = false) {
  type VoucherObj = Voucher & {
    isValid?: boolean;
    isSuccess?: boolean;
    validationMessage?: any;
  };

  const isExist = voucherApplied.value.filter(
    (applied) => applied.voucherCode === voucherCode.value
  );

  if (isExist && isExist.length === 0) {
    const validateResult = await validateVoucher(isRedemption);
    const vouchers: VoucherObj[] = Array.isArray(validateResult.data)
      ? validateResult.data
      : [];
    const meta = validateResult.meta;
    if (validateResult.isSuccess && Array.isArray(vouchers)) {
      voucherValidationIsSuccess.value = true;
      alert.success("Voucher applied");
      vouchers.forEach((voucher) => {
        voucher.isValid = true;
        voucher.isSuccess = true;
        voucher.validationMessage = validateResult.message;
        if (
          isAnyRedemptionVoucherApplied.value === true ||
          voucher.voucherCategory === VOUCHER_CATEGORY_REDEMPTION ||
          isRedemption
        ) {
          voucherApplied.value = [voucher];
        } else {
          const isApplied = checkIfApplied(voucher.voucherCode);
          const canCombine = combineVoucher(voucher.voucherCategory);
          if (isApplied === false && canCombine === true) {
            voucherApplied.value.push(voucher);
          }
        }
      });
      voucherCode.value = "";
    } else {
      voucherValidationIsSuccess.value = false;
      alert.error(validateResult.message);
      if (vouchers && vouchers.length > 0) {
        vouchers.forEach((voucher) => {
          voucher.isValid = true;
          voucher.isSuccess = false;
          voucher.validationMessage = validateResult.message;
          if (
            isAnyRedemptionVoucherApplied.value === true ||
            voucher.voucherCategory === VOUCHER_CATEGORY_REDEMPTION ||
            isRedemption
          ) {
            voucherApplied.value = [voucher];
          } else {
            const isApplied = checkIfApplied(voucher.voucherCode);
            const canCombine = combineVoucher(voucher.voucherCategory);
            if (isApplied === false && canCombine === true) {
              voucherApplied.value.push(voucher);
            }
          }
        });
        voucherCode.value = "";
      }
    }

    if (meta?.calculate) {
      applyChargeData(meta.calculate);
    }

    return validateResult;
  }
  return {
    isSuccess: false,
    message: "Voucher already inserted",
    data: null,
    meta: null,
  };
}

function applyChargeData(charge: any) {
  if (isEmpty(charge)) {
    return;
  }
  store.dispatch("bookingCharge/applyChargeData", charge);
}

function combineVoucher(voucherCategory: string) {
  if (voucherApplied.value.length === 0) {
    return true;
  }
  if (
    isAnyGiftVoucherApplied.value === true &&
    voucherCategory === VOUCHER_CATEGORY_GIFT
  ) {
    return true;
  }
  return false;
}

function checkIfApplied(voucherCode: string) {
  if (voucherCode) {
    const check = voucherApplied.value.findIndex(
      (voucher) => voucher.voucherCode === voucherCode
    );
    return check === -1 ? false : true;
  }
}

function clearVoucherValidation() {
  voucherValidationIsSuccess.value = null;
}

function resetVoucherState() {
  voucherCode.value = "";
  voucherValidationIsSuccess.value = null;
  voucherApplied.value = [];
}

function removeVoucher(paramVoucherCode: string) {
  const indexToRemove = voucherApplied.value.findIndex(
    (voucher) => voucher.voucherCode === paramVoucherCode
  );

  if (indexToRemove === 0) {
    voucherApplied.value.shift();
  } else {
    voucherApplied.value.splice(indexToRemove, 1);
  }
}

const state = {
  voucherCode,
  voucherValidationIsSuccess,
  voucherApplied,
  voucherCheckLoading,
};

const computeds = {
  validVoucherApplied,
  anyValidVoucherApplied,
  voucherPaymentType,
  isVoucherNeedPayment,
  parsedVoucherValidationMessage,
  isAnyGiftVoucherApplied,
};

const methods = {
  useVoucher,
  validateVoucher,
  clearVoucherValidation,
  removeVoucher,
  resetVoucherState,
};

export { state, computeds, methods };
