<template>
  <div class="rounded-lg hh-shadow">
    <div class="p-3">
      <div class="mb-3 font-black text-center">{{ $t("chargedSummary") }}</div>
      <div v-if="showChargeTime" class="mb-3 text-red-dark">
        {{ chargeTime }}
      </div>
      <ul class="list-none">
        <li
          v-for="voucher in selectedCustomVouchers"
          :key="voucher.id"
          class="flex justify-between mb-3"
        >
          <span class="mr-2 text-sm">{{
            `${voucher.name} (x${voucher.quantity})`
          }}</span>
          <span class="font-black text-red-dark">{{
            $money(voucher.amount)
          }}</span>
        </li>
        <li
          v-for="voucher in selectedRestaurantVouchers"
          :key="voucher.id"
          class="flex justify-between mb-3"
        >
          <span class="mr-2 text-sm">{{
            `${voucher.name} (x${voucher.quantity})`
          }}</span>
          <span class="font-black text-red-dark">{{
            $money(voucher.amount)
          }}</span>
        </li>
        <li class="flex justify-between mb-3">
          <span class="text-sm font-black text-red-dark">{{
            `${$t("totalChargeAmount")}:`
          }}</span>
          <span class="font-black text-red-dark">{{
            $money(grandTotalAmount)
          }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {
  totalAmountCustomVouchers,
  selectedCustomVouchers,
} from "@/components/Page Component/restaurant_voucher/customVouchers";
import {
  totalAmountRestaurantVouchers,
  selectedRestaurantVouchers,
} from "@/components/Page Component/restaurant_voucher/restaurantVouchers";
import { computed, ref } from "@vue/composition-api";
let self;
export default {
  setup() {
    const customVocuherName = "Hungryhub Gift Card";
    const grandTotalAmount = computed(() => {
      return (
        totalAmountRestaurantVouchers.value + totalAmountCustomVouchers.value
      );
    });
    const showChargeTime = ref(false);
    const chargeTime = computed(() => {
      const now = self.$dayjs();
      const time = now.format("HH:ss");
      const date = now.format("dddd DD/MM/YYYY");
      return `${date} at ${time}`;
    });
    return {
      showChargeTime,
      customVocuherName,
      chargeTime,
      grandTotalAmount,
      selectedCustomVouchers,
      selectedRestaurantVouchers,
    };
  },
  created() {
    self = this;
  },
};
</script>
