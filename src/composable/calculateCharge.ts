import { ref } from "@vue/composition-api";
import {
  computeds as voucherComputeds,
  methods as voucherMethods,
} from "@/composable/voucher";
import { ERROR_INVALID_DATE } from "@/lib/constant";
import useReport from "./useReport";
import store from "@/store";

export const isLoading = ref(false);
export async function calculateCharge(noPackages: boolean = false) {
  try {
    if (isLoading.value === true) {
      return;
    }
    isLoading.value = true;
    if (voucherComputeds.anyValidVoucherApplied.value) {
      const { isSuccess, message } = await voucherMethods.useVoucher();
      if (!isSuccess && message === ERROR_INVALID_DATE) {
        store.dispatch("booking/changeStep", 2);
        return;
      }
    } else {
      await store.dispatch("bookingCharge/calculatePartialCharge", {
        guess: noPackages,
      });
    }
    isLoading.value = false;
  } catch (err) {
    useReport({
      level: "error",
      message: "Failed call calculatePartialCharge",
      errorException: err,
    });
    isLoading.value = false;
  }
}
