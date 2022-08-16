<template>
  <div>
    <div class="flex items-center justify-between mb-1">
      <p class="font-bold">{{ $t("createYourAmount") }}</p>
      <button class="text-xs capitalize text-red-dark" @click="showModal">
        {{ $t("detail") }}
      </button>
    </div>
    <p class="mb-2 text-sm text-gray-600">
      {{ $t("createSettingVoucher") }}
    </p>
    <CustomVoucherCard
      v-for="(customVoucher, index) in customVouchers"
      :key="customVoucher.id"
      :amount="customVoucher.amount"
      :quantity="customVoucher.quantity"
      class="mb-3"
      @on-amount-option-clicked="(amount) => applyAmount(index, amount)"
      @on-amount-change="(amount) => amountChangeHandler(index, amount)"
      @on-quantity-change="(quantity) => quantityChangeHandler(index, quantity)"
      @on-quantity-increased="customVoucherIncreaseQuantity(index)"
      @on-quantity-decreased="customVoucherDecreaseQuantity(index)"
    />
    <button
      class="flex items-center justify-center mx-auto mb-3 text-xl rounded-full w-7 h-7 bg-red-pink text-red-dark"
      @click="addCustomVoucher"
    >
      +
    </button>
  </div>
</template>

<script>
import CustomVoucherCard from "@/components/Shared/voucher_flow/CustomVoucherCard.vue";
import {
  customVouchers,
  selectedCustomVouchers,
  applyAmount,
  amountChangeHandler,
  quantityChangeHandler,
  customVoucherDecreaseQuantity,
  customVoucherIncreaseQuantity,
  addCustomVoucher,
} from "./customVouchers";
import { toggleDetailModal } from "./modal";
let self;

export default {
  components: {
    CustomVoucherCard,
  },
  props: {
    preSelectCustomVouchers: {
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
    function showModal() {
      const restaurantName = self.$store.state.restaurant?.restaurantName;
      const modalTitle = restaurantName
        ? `${restaurantName} Gift Card`
        : "Hungry Hub Gift Card";
      toggleDetailModal({
        name: modalTitle,
        amount: 0,
        quantity: 0,
        desc: props.detaultVoucherDetail,
        tnc: props.defaultVoucherTnc,
      });
    }
    return {
      addCustomVoucher,
      customVouchers,
      selectedCustomVouchers,
      applyAmount,
      amountChangeHandler,
      quantityChangeHandler,
      customVoucherDecreaseQuantity,
      customVoucherIncreaseQuantity,
      showModal,
    };
  },
  watch: {
    preSelectCustomVouchers: {
      handler() {
        this.applyPreselectCustomVoucher();
      },
      immediate: true,
    },
    selectedCustomVouchers: {
      handler(val, oldVal) {
        const countSelectedVoucher = val.length;
        const countOldSelectedVoucher = oldVal.length;
        if (countSelectedVoucher > countOldSelectedVoucher) {
          this.$emit("on-voucher-removed");
        }
      },
    },
  },
  created() {
    self = this;
  },
  methods: {
    applyPreselectCustomVoucher() {
      this.preSelectCustomVouchers.forEach((voucher, index) => {
        const customVoucher = this.customVouchers[index];
        if (customVoucher) {
          customVoucher.amount =
            typeof voucher === "number" ? `${voucher}` : voucher;
          customVoucher.quantity = 1;
        }
      });
    },
  },
  i18n: {
    messages: {
      en: {
        createYourAmount: "Create Your Own Amount",
        createSettingVoucher:
          "Create by setting gift card value and number of gift card",
      },
      th: {
        createYourAmount: "ใส่ยอดเงินที่ต้องการ",
        createSettingVoucher: "โปรดระบุยอดเงินและจำนวนที่ต้องการ.",
      },
    },
  },
};
</script>
