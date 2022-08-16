<template>
  <div>
    <slot
      :removeVoucherHandler="removeVoucherHandler"
      :useVoucherHandler="useVoucherHandler"
      :inputVoucherHandler="inputVoucher"
      :listAppliedVoucher="voucherApplied"
      :voucherCheckLoading="voucherCheckLoading"
    >
    </slot>
  </div>
</template>

<script>
import { ERROR_INVALID_DATE } from "@/lib/constant";
import {
  state as voucherState,
  methods as voucherMethods,
} from "@/composable/voucher";
export default {
  setup() {
    return {
      ...voucherState,
      ...voucherMethods,
    };
  },
  methods: {
    inputVoucher(event) {
      this.voucherCode = event.target.value.replace(/ /g, "").toUpperCase();
    },
    async useVoucherHandler() {
      if (this.voucherCode && this.voucherCode.length > 0) {
        const { isSuccess, message } = await this.useVoucher();
        if (!isSuccess && message === ERROR_INVALID_DATE) {
          this.$store.dispatch("booking/changeStep", 2);
          return;
        }
      }
    },
    removeVoucherHandler(voucherCode) {
      this.removeVoucher(voucherCode);
      this.clearCCAttribute();
    },
    clearCCAttribute() {
      this.$store.commit("booking/setState", {
        state: "paymentMethod",
        val: "",
      });
      this.$store.commit("booking/setStateAttribute", {
        name: "creditCard",
        attribute: "name",
        val: "",
      });
      this.$store.commit("booking/setStateAttribute", {
        name: "creditCard",
        attribute: "number",
        val: "",
      });
      this.$store.commit("booking/setStateAttribute", {
        name: "creditCard",
        attribute: "expMonthYear",
        val: "",
      });
      this.$store.commit("booking/setStateAttribute", {
        name: "creditCard",
        attribute: "securityCode",
        val: "",
      });
      this.$store.commit("booking/setStateAttribute", {
        name: "creditCard",
        attribute: "logo",
        val: "",
      });
    },
  },
};
</script>
