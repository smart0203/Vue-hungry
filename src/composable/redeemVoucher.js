import { ref, computed } from "@vue/composition-api";

import { redeemPointAsVoucher } from "@/services/point";
import { state as pointState } from "./pointHistory";
import store from "@/store/index";
import { i18n } from "@/lib/i18n/i18n";

let message = ref("");
let isLoading = ref(false);
let isError = ref(false);

const accessToken = computed(() => store.state.user.accessToken);

async function redeemVoucher(point) {
  const totalPoint = pointState.totalPoint.value;
  if (totalPoint < point) {
    isError.value = true;
    message.value = i18n.t("insufficientPoints");
    return;
  }
  isLoading.value = true;
  const result = await redeemPointAsVoucher(accessToken.value, point);
  message.value = result.message;
  isError.value = !result.isSuccess;
  isLoading.value = false;
}

const state = {
  isLoading,
  isError,
  message,
};

const methods = {
  redeemVoucher,
};

export { state, methods };
