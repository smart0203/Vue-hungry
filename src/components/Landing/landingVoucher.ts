import useReport from "@/composable/useReport";
import { getVoucherTransaction as fetchVoucherTransaction } from "@/services/voucherTransaction";
import { ref } from "@vue/composition-api";
import * as alert from "@/lib/alert";
import {
  storageSetVoucherPurchased,
  storageGetVoucherPurchased,
} from "@/lib/localStorage";
import useQueryString from "@/composable/useQueryString";
import track from "@/services/userTracking";
const { parsedQueryString } = useQueryString();

type VouchersSummary = {
  name: string;
  quantity: number;
  amount: number;
};

export interface VouchersDetail {
  id: string;
  type: string;
  name: string;
  voucherCode: string;
  usageType: string;
  maxUsage: number;
  maxUsageUser: number;
  expiryDate: string;
  voucherType: string;
  paymentType: null;
  prefixNumber: null;
  voucherCategory: string;
  isUsed: boolean;
  amount: string;
  amountV2: {
    format: string;
    amount: number;
    currency: string;
  };
  minTotalPriceV2: {
    format: string;
    amount: number;
    currency: string;
  };
  restaurantCity: null;
  minTotalPrice: string;
  deductibleBalance: number;
}

const id = ref("");
const isLoading = ref(true);
const name = ref("");
const email = ref("");
const phone = ref("");
const totalCharge = ref(0);
const vouchersSummary = ref<VouchersSummary[]>([]);
const vouchersDetail = ref<VouchersDetail[]>([]);

async function getVoucherTransaction(encrytedId: string | number) {
  try {
    isLoading.value = true;
    const { isSuccess, data } = await fetchVoucherTransaction(encrytedId);

    if (isSuccess && data) {
      id.value = data.data.id;
      if (data.data.attributes) {
        const {
          name: userName,
          email: userEmail,
          phone: userPhone,
          vouchers,
          totalPrice,
        } = data.data.attributes;
        name.value = userName;
        email.value = userEmail;
        phone.value = userPhone;
        totalCharge.value = totalPrice;

        if (vouchersSummary.value.length === 0) {
          vouchersSummary.value = Array.isArray(vouchers.customAmount)
            ? [...vouchersSummary.value, ...vouchers.customAmount]
            : [...vouchersSummary.value];

          vouchersSummary.value = Array.isArray(vouchers.packages)
            ? [...vouchersSummary.value, ...vouchers.packages]
            : [...vouchersSummary.value];
        }
      }

      if (data?.included && Array.isArray(data.included)) {
        vouchersDetail.value = data.included.map((voucher) => {
          return {
            id: voucher.id,
            type: voucher.type,
            ...voucher.attributes,
          };
        });
      }

      isLoading.value = false;
      trackChargedReservation();
    }
  } catch (err) {
    const message =
      "Something went wrong, failed get voucher transaction detail";
    useReport({
      level: "error",
      message,
      errorException: err,
    });
    alert.error(message);
  }
}

function trackChargedReservation() {
  const isTracked = parsedQueryString.tracked;
  if (!isTracked && storageGetVoucherPurchased() != id.value) {
    track("GIFT_CARD_PURCHASED", {
      bookingRevenue: totalCharge.value,
      bookingCurrency: "THB",
    });
    storageSetVoucherPurchased(id.value);
    const { getStringifyQueryString, addQueryString } = useQueryString();
    addQueryString("tracked", true);
    window.location.search = getStringifyQueryString();
    // add ?tracked=true to url so if user open in antoher browser, it dont send track event
  }
}

function resetState() {
  id.value = "";
  isLoading.value = true;
  name.value = "";
  email.value = "";
  phone.value = "";
  totalCharge.value = 0;
  vouchersSummary.value = [];
  vouchersDetail.value = [];
}

export {
  id,
  isLoading,
  name,
  email,
  phone,
  totalCharge,
  vouchersDetail,
  vouchersSummary,
  getVoucherTransaction,
  resetState,
};
