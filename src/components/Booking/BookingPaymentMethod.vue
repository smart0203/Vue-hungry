<template>
  <div>
    <PaymentMethod
      :selected-payment="paymentMethod"
      :force-mobile-version="forceMobileVersion"
      :title="paymentFormTitle"
      :show-true-wallet-option="showTrueWalletOptionButton"
      :show-payment-option="showPaymentOptionButton"
      :show-qr-option="showQrButton"
      :show-shopee-pay-option="showShopeePayButton"
      :show-card-option="showCreditCardButton"
      :qr-max-time="qrCountdown"
      :total-charge="totalCharge"
      :charge-on-hold="isChargeOnHold"
      @on-payment-selected="changePayment"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { computeds as voucherComputeds } from "@/composable/voucher";
import {
  PAYMENT_CREDIT_CARD,
  PAYMENT_PROMPTPAY,
  PAYMENT_TRUEWALLET,
  PAYMENT_SHOPEEPAY,
  SUPPORTED_PAYMENT_PROMPT_PAY,
  SUPPORTED_PAYMENT_CREDIT_CARD,
  SUPPORTED_PAYMENT_TRUE_WALLET,
  SUPPORTED_PAYMENT_SHOPEE_PAY,
} from "@/lib/constant";
import PaymentMethod from "@/components/Shared/booking/PaymentMethod.vue";
export default {
  components: {
    PaymentMethod,
  },
  props: {
    forceMobileVersion: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const { voucherPaymentType, anyValidVoucherApplied } = voucherComputeds;
    return {
      voucherPaymentType,
      anyValidVoucherApplied,
    };
  },
  data() {
    return {
      PAYMENT_CREDIT_CARD,
      PAYMENT_PROMPTPAY,
      PAYMENT_TRUEWALLET,
      acceptTC: false,
    };
  },
  computed: {
    ...mapGetters("bookingCharge", ["totalCharge"]),
    ...mapGetters("bookingPackage", [
      "getSelectedPackage",
      "isPackageRequireCC",
      "getSelectedPackagePayment",
    ]),
    paymentFormTitle() {
      return `${this.order}. ${this.$t("selectPayment")}`;
    },
    paymentMethod() {
      return this.$store.state.booking.paymentMethod;
    },
    showPaymentOptionButton() {
      return this.showedPaymentOptionButton.length > 1;
    },
    showedPaymentOptionButton() {
      const paymentMethod = [
        {
          name: PAYMENT_TRUEWALLET,
          val: this.showTrueWalletOptionButton,
        },
        {
          name: PAYMENT_PROMPTPAY,
          val: this.showQrButton,
        },
        {
          name: PAYMENT_CREDIT_CARD,
          val: this.showCreditCardButton,
        },
        {
          name: PAYMENT_SHOPEEPAY,
          val: this.showShopeePayButton,
        },
      ];
      const filter = paymentMethod.filter((method) => method.val === true);
      return filter;
    },
    showCreditCardButton() {
      if (this.anyValidVoucherApplied) {
        return this.voucherPaymentType.ccPayment;
      }
      if (this.$store.state.booking.showTrueWalletPayment) {
        return false;
      }
      if (this.isPackageRequireCC) {
        if (this.getSelectedPackagePayment.has(SUPPORTED_PAYMENT_CREDIT_CARD)) {
          return true;
        }
        return false;
      }
      return false;
    },
    showQrButton() {
      if (this.anyValidVoucherApplied) {
        return this.voucherPaymentType.qrPayment;
      }
      if (this.$store.state.booking.showTrueWalletPayment) {
        return false;
      }
      if (this.isPackageRequireCC) {
        if (this.getSelectedPackagePayment.has(SUPPORTED_PAYMENT_PROMPT_PAY)) {
          return true;
        }
        return false;
      }
      return false;
    },
    showShopeePayButton() {
      if (this.anyValidVoucherApplied) {
        return this.voucherPaymentType.shopeePayPayment;
      }
      if (this.$store.state.booking.showTrueWalletPayment) {
        return false;
      }
      return this.getSelectedPackagePayment.has(SUPPORTED_PAYMENT_SHOPEE_PAY);
    },
    showTrueWalletOptionButton() {
      if (this.anyValidVoucherApplied) {
        return this.voucherPaymentType.trueWalletPayment;
      }
      return (
        this.getSelectedPackagePayment.has(SUPPORTED_PAYMENT_TRUE_WALLET) ||
        this.$store.state.booking.showTrueWalletPayment
      );
    },
    qrCountdown() {
      return this.$store.getters["webConfig/qrPaymentCountDown"];
    },
    isChargeOnHold() {
      if (this.getSelectedPackage.length) {
        this.getSelectedPackage[0].chargeType === "on_hold" ? true : false;
      }
      return false;
    },
  },
  watch: {
    showedPaymentOptionButton: {
      handler: "preselectPaymentMethod",
      immediate: true,
    },
  },
  methods: {
    changePayment(param) {
      this.$store.commit("booking/setState", {
        state: "paymentMethod",
        val: param,
      });
    },
    preselectPaymentMethod() {
      if (this.showedPaymentOptionButton.length === 1) {
        this.changePayment(this.showedPaymentOptionButton[0].name);
      }
    },
  },
};
</script>
