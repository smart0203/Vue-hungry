import { ref, reactive, computed, watch } from "@vue/composition-api";
import store from "@/store/index";
import {
  toggleRemoveVoucherModal,
  onCloseRemoveVoucherModal,
  onConfirmRemoveVoucherModal,
} from "./modal";
import { PackClassInterface } from "@/types/PackInterface";
import { RestaurantVoucher } from "@/types/RestaurantVoucher";
import { convertToNumber } from "@/helper/stringHelper";

const loadingRestaurantVouchers = computed(() => {
  // @ts-ignore
  return store.state.restaurantPackages?.isLoading || false;
});

watch(loadingRestaurantVouchers, (val, oldval) => {
  if (val === false) {
    setupRestaurantVouchers();
  }
});

const restaurantVouchers = ref<RestaurantVoucher[]>([]);

const selectedRestaurantVouchers = computed(() => {
  return restaurantVouchers.value.filter(
    (restVoucher) => restVoucher.isSelected
  );
});

const totalQuantityRestaurantVouchers = computed(() => {
  return selectedRestaurantVouchers.value
    .map((restVoucher) => restVoucher.quantity)
    .reduce((a, b) => a + b, 0);
});

const totalAmountRestaurantVouchers = computed(() => {
  let total = 0;
  selectedRestaurantVouchers.value.forEach((resVoucher) => {
    total = total + resVoucher.amount * resVoucher.quantity;
  });
  return total;
});

function setupRestaurantVouchers() {
  if (!store.hasModule("bookingPackage")) {
    return;
  }
  const restaurantPackages: PackClassInterface[] = store.getters[
    "bookingPackage/getPackageByType"
  ]([]);
  if (Array.isArray(restaurantPackages)) {
    if (restaurantVouchers.value.length) {
      return;
    }

    restaurantPackages.forEach((pack) => {
      const selectedPricingRule = pack.getLowestPricingRule();
      const price = convertToNumber(selectedPricingRule.price);
      if (!pack.isAlaCarte) {
        restaurantVouchers.value.push(
          reactive({
            id: pack.id,
            name: pack.name,
            packageDesc: pack.description,
            desc: pack.restaurantPackageVoucherDetail,
            amount: ref(price),
            isSelected: ref(false),
            quantity: ref(0),
            tnc: pack.restaurantPackageVoucherTnc,
          })
        );
      }
    });
  }
}

function restaurantVoucherIncreaseQuantity(index: number) {
  const restaurantVoucher = restaurantVouchers.value[index];
  restaurantVoucher.quantity += 1;
  if (restaurantVoucher.isSelected === false) {
    restaurantVoucher.isSelected = true;
  }
}

function restaurantVoucherDecreaseQuantity(index: number) {
  const restaurantVoucher = restaurantVouchers.value[index];
  if (restaurantVoucher.quantity === 0) {
    return;
  }
  const newQuantity = restaurantVoucher.quantity - 1;

  if (newQuantity === 0) {
    // implement method for confirm modal
    onConfirmRemoveVoucherModal.value = function () {
      toggleRemoveVoucherModal();
      restaurantVoucher.quantity = 0;
      restaurantVoucher.isSelected = false;
    };
    onCloseRemoveVoucherModal.value = function () {
      toggleRemoveVoucherModal();
    };
    // toggle modal
    toggleRemoveVoucherModal();
  } else {
    restaurantVoucher.quantity = newQuantity;
  }
}

function restaurantVoucherChangeQuantity(index: number, newQuantity: number) {
  const restaurantVoucher = restaurantVouchers.value[index];
  if (newQuantity === 0) {
    // implement method for confirm modal
    onConfirmRemoveVoucherModal.value = function () {
      toggleRemoveVoucherModal();
      restaurantVoucher.quantity = 0;
      restaurantVoucher.isSelected = false;
    };
    onCloseRemoveVoucherModal.value = function () {
      toggleRemoveVoucherModal();
    };
    // toggle modal
    toggleRemoveVoucherModal();
  } else {
    restaurantVoucher.quantity = newQuantity;
    restaurantVoucher.isSelected = true;
  }
}

function restaurantVoucherCheckboxChanged(isSelected: any, index: number) {
  const restaurantVoucher = restaurantVouchers.value[index];
  if (isSelected === false) {
    restaurantVoucher.isSelected = false;
  } else {
    restaurantVoucher.quantity = 1;
    restaurantVoucher.isSelected = true;
  }
}

function resetRestaurantVouchers() {
  restaurantVouchers.value = [];
}

export {
  loadingRestaurantVouchers,
  restaurantVoucherChangeQuantity,
  restaurantVoucherCheckboxChanged,
  restaurantVoucherDecreaseQuantity,
  restaurantVoucherIncreaseQuantity,
  setupRestaurantVouchers,
  totalAmountRestaurantVouchers,
  totalQuantityRestaurantVouchers,
  selectedRestaurantVouchers,
  restaurantVouchers,
  resetRestaurantVouchers,
};
