<template>
  <PaymentMethod
    :selected-payment="paymentMethod"
    :force-mobile-version="true"
    :title="title"
    :show-true-wallet-option="showTrueWalletPayment"
    :show-shopee-pay-option="showShopeePayOption"
    :show-payment-option="showPaymentOptionButton"
    :show-qr-option="showQrButton"
    :show-card-option="showCreditCardButton"
    :qr-max-time="qrCountdown"
    :total-charge="totalCharge"
    :charge-on-hold="false"
    @on-payment-selected="changePayment"
  />
</template>

<script>
import PaymentMethod from "@/components/Shared/booking/PaymentMethod.vue";
import { grandTotalAmount } from "./voucherFlow";

export default {
  components: {
    PaymentMethod,
  },
  setup() {
    return {
      grandTotalAmount,
    };
  },
  computed: {
    title() {
      return this.$t("selectPayment");
    },
    paymentMethod() {
      return this.$store.state.booking.paymentMethod;
    },
    totalCharge() {
      return this.grandTotalAmount;
    },
    qrCountdown() {
      return this.$store.getters["webConfig/qrPaymentCountDown"];
    },
    showShopeePayOption() {
      // temporary force to hide (waiting marketing team)
      return false;
    },
    showTrueWalletPayment() {
      // temporary force to hide (waiting marketing team)
      return false;
      // return this.$store.state.showTrueWalletPayment;
    },
    showPaymentOptionButton() {
      return (
        (this.showCreditCardButton && this.showQrButton) ||
        this.showTrueWalletPayment
      );
    },
    showQrButton() {
      return true;
    },
    showCreditCardButton() {
      return true;
    },
  },
  methods: {
    changePayment(param) {
      this.$store.commit("booking/setState", {
        state: "paymentMethod",
        val: param,
      });
    },
  },
};
</script>
