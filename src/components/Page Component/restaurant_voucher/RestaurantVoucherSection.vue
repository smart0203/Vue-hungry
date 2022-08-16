<template>
  <div>
    <div
      v-if="loadingRestaurantVouchers"
      class="flex items-center justify-center w-full capitalize"
    >
      <div class="mr-2 loader small red"></div>
      <div>{{ $t("pleaseWait") }}</div>
    </div>
    <template
      v-else-if="
        loadingRestaurantVouchers === false && restaurantVouchers.length
      "
    >
      <p class="mb-4 font-bold">Package Voucher</p>
      <RestaurantVoucher
        v-for="(voucher, index) in restaurantVouchers"
        :key="voucher.id"
        :description="voucher.packageDesc"
        :is-selected="voucher.isSelected"
        :is-show-check-box="true"
        :name="voucher.name"
        :price="$money(voucher.amount)"
        class="mb-3"
        :quantity="voucher.quantity"
        :card-style="isDesktop ? 'max-width: 280px' : null"
        @on-detail-clicked="doToggleDetailModal(voucher)"
        @on-quantity-increased="restaurantVoucherIncreaseQuantity(index)"
        @on-quantity-decreased="restaurantVoucherDecreaseQuantity(index)"
        @on-quantity-changed="
          (quantity) => restaurantVoucherChangeQuantity(index, quantity)
        "
        @on-checkbox-changed="
          (event) => restaurantVoucherCheckboxChanged(event, index)
        "
      />
    </template>
  </div>
</template>

<script>
import RestaurantVoucher from "@/components/Shared/voucher_flow/RestaurantVoucher.vue";

import {
  restaurantVouchers,
  restaurantVoucherIncreaseQuantity,
  restaurantVoucherDecreaseQuantity,
  restaurantVoucherChangeQuantity,
  restaurantVoucherCheckboxChanged,
  setupRestaurantVouchers,
  loadingRestaurantVouchers,
  selectedRestaurantVouchers,
} from "./restaurantVouchers";
import { toggleDetailModal } from "./modal";
export default {
  components: {
    RestaurantVoucher,
  },
  props: {
    preSelectRestaurantVouchers: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    defaultVoucherTnc: {
      type: String,
      default: "",
    },
    detaultVoucherDetail: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    function doToggleDetailModal(voucher) {
      voucher.desc = voucher.desc || props.detaultVoucherDetail;
      voucher.tnc = voucher.tnc || props.defaultVoucherTnc;
      toggleDetailModal(voucher);
    }

    return {
      loadingRestaurantVouchers,
      restaurantVouchers,
      restaurantVoucherIncreaseQuantity,
      doToggleDetailModal,
      restaurantVoucherDecreaseQuantity,
      restaurantVoucherChangeQuantity,
      restaurantVoucherCheckboxChanged,
      setupRestaurantVouchers,
      selectedRestaurantVouchers,
    };
  },
};
</script>
