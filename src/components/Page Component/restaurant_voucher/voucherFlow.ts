import { computed, ref } from "@vue/composition-api";
import {
  totalQuantityCustomVouchers,
  totalAmountCustomVouchers,
} from "@/components/Page Component/restaurant_voucher/customVouchers";
import {
  totalAmountRestaurantVouchers,
  totalQuantityRestaurantVouchers,
} from "@/components/Page Component/restaurant_voucher/restaurantVouchers";
import { getVoucherIntroduction } from "@/services/common";
import store from "@/store/index";

export const isLoadingGetIntroData = ref(true);
export const introDescription = ref("");
export const introductionItems = ref([]);
export const customVoucherTermCondition = ref("");
export const customVoucherDetail = ref("");

const anyRestaurantData = computed(() => {
  // @ts-ignore
  return store.state.restaurant?.restaurantName.length ? true : false;
});

export async function getVoucherIntroData() {
  isLoadingGetIntroData.value = true;
  const { isSuccess, data, message } = await getVoucherIntroduction();
  if (isSuccess && data) {
    // @ts-ignore
    introDescription.value = data.introDescription;
    // @ts-ignore
    customVoucherDetail.value = anyRestaurantData.value
      ? // @ts-ignore
        data.restaurantCustomVoucherDetail
      : // @ts-ignore
        data.hhCustomVoucherDetail;
    // @ts-ignore
    customVoucherTermCondition.value = anyRestaurantData.value
      ? // @ts-ignore
        data.restaurantCustomVoucherTnc
      : // @ts-ignore
        data.hhCustomVoucherTnc;
    // @ts-ignore
    introductionItems.value = Array.isArray(data.data) ? data.data : [];
    isLoadingGetIntroData.value = false;
  }
}

export const grandTotalQuantity = computed(() => {
  return (
    totalQuantityRestaurantVouchers.value + totalQuantityCustomVouchers.value
  );
});

export const grandTotalAmount = computed(() => {
  return totalAmountRestaurantVouchers.value + totalAmountCustomVouchers.value;
});
