import { ref, reactive, computed } from "@vue/composition-api";
import { nanoid } from "nanoid";
import rollbar from "@/lib/rollbar";
import * as alert from "@/lib/alert";
// @ts-ignore
import store from "@/store/index";
import {
  toggleDetailModal,
  toggleRemoveVoucherModal,
  onCloseRemoveVoucherModal,
  onConfirmRemoveVoucherModal,
} from "./modal";
import { CustomVoucher } from "@/types/RestaurantVoucher";
import { i18n } from "@/lib/i18n/i18n";

const restaurantName = computed(() => {
  // @ts-ignore
  return store.state.restaurant?.restaurantName;
});

const customVouchersName = computed(() => {
  return "Hungry Hub Gift Card";
});

const customVouchers = ref<CustomVoucher[]>([
  reactive({
    name: customVouchersName,
    id: nanoid(3),
    amount: ref(""),
    quantity: ref(0),
    tnc: "",
    desc: "",
  }),
]);

const selectedCustomVouchers = computed(() => {
  return customVouchers.value.filter(
    (customVoucher) => customVoucher.quantity > 0 && customVoucher.amount
  );
});

const totalQuantityCustomVouchers = computed(() => {
  return selectedCustomVouchers.value
    .map((customVoucher) => customVoucher.quantity)
    .reduce((a, b) => a + b, 0);
});

const totalAmountCustomVouchers = computed(() => {
  let total = 0;
  selectedCustomVouchers.value.forEach((customVoucher) => {
    total = total + parseInt(customVoucher.amount) * customVoucher.quantity;
  });
  return total;
});

function generateCustomVoucher() {
  return reactive({
    name: customVouchersName,
    id: nanoid(3),
    amount: ref(""),
    quantity: ref(0),
    tnc: "",
    desc: "",
  });
}

function addCustomVoucher() {
  customVouchers.value.push(generateCustomVoucher());
}

function removeCustomVoucher(customVoucherId: string) {
  const searchIndex = customVouchers.value.findIndex(
    (customVoucher) => customVoucher.id === customVoucherId
  );

  if (searchIndex === -1) {
    rollbar.error("Custom voucher not found", {
      allCustomVouchers: customVouchers,
      indexToRemove: customVoucherId,
    });
    alert.error("Oops, something went wrong, failed remove voucher");
    return;
  }
  if (searchIndex === 0) {
    if (customVouchers.value.length > 1) {
      customVouchers.value.shift();
    } else {
      customVouchers.value[0].amount = "";
      customVouchers.value[0].quantity = 0;
    }
  } else if (searchIndex === customVouchers.value.length) {
    customVouchers.value.pop();
  } else {
    customVouchers.value.splice(searchIndex, 1);
  }
}

function customVoucherIncreaseQuantity(index: number) {
  const customVoucher = customVouchers.value[index];
  if (customVoucher.amount.length === 0) {
    alert.error(i18n.t("pleaseInsertSelectAmount"));
    return;
  }
  customVoucher.quantity += 1;
}

function customVoucherDecreaseQuantity(index: number) {
  const customVoucher = customVouchers.value[index];
  const currentQuantity = customVoucher.quantity;
  const customVoucherId = customVoucher.id;
  const newQuantity = customVoucher.quantity - 1;

  if (currentQuantity === 1 && newQuantity === 0) {
    // implement method for confirm modal
    onConfirmRemoveVoucherModal.value = function () {
      toggleRemoveVoucherModal();
      removeCustomVoucher(customVoucherId);
    };
    onCloseRemoveVoucherModal.value = function () {
      toggleRemoveVoucherModal();
    };
    toggleRemoveVoucherModal();
  } else if (currentQuantity === 0) {
    removeCustomVoucher(customVoucherId);
  } else {
    customVoucher.quantity = newQuantity;
  }
}

function amountChangeHandler(index: number, amount: string) {
  if (parseInt(amount) < 50) {
    alert.error("Minimum voucher amount 50 baht");
    return;
  }
  const customVoucher = customVouchers.value[index];
  customVoucher.amount = amount;
  // auto increase voucher quantity if current quantity still 0
  if (customVoucher.amount.length > 0 && customVoucher.quantity === 0) {
    customVoucher.quantity = 1;
  }
}

function quantityChangeHandler(index: number, quantity: number) {
  const customVoucher = customVouchers.value[index];

  if (quantity === 0) {
    // implement method for confirm modal
    onConfirmRemoveVoucherModal.value = function () {
      const customVoucherId = customVoucher.id;
      toggleRemoveVoucherModal();
      removeCustomVoucher(customVoucherId);
    };
    onCloseRemoveVoucherModal.value = function () {
      toggleRemoveVoucherModal();
      customVoucher.quantity = 1;
    };

    toggleRemoveVoucherModal();
  } else {
    customVoucher.quantity = quantity;
  }
}

function applyAmount(index: number, amount: string) {
  const customVoucher = customVouchers.value[index];
  customVoucher.amount = amount;
  if (customVoucher.quantity === 0) {
    customVoucher.quantity = 1;
  }
}

function resetCustomVouchers() {
  customVouchers.value = [
    reactive({
      name: customVouchersName,
      id: nanoid(3),
      amount: ref(""),
      quantity: ref(0),
      tnc: "",
      desc: "",
    }),
  ];
}

export {
  restaurantName,
  applyAmount,
  quantityChangeHandler,
  amountChangeHandler,
  customVoucherDecreaseQuantity,
  customVoucherIncreaseQuantity,
  addCustomVoucher,
  generateCustomVoucher,
  totalAmountCustomVouchers,
  totalQuantityCustomVouchers,
  selectedCustomVouchers,
  customVouchers,
  resetCustomVouchers,
};
