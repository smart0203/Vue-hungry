<template>
  <CreditCardInputView
    :force-mobile-version="forceMobileVersion"
    :name.sync="name"
    :number.sync="number"
    :logo="logo"
    :exp-month-year.sync="expMonthYear"
    :security-code.sync="securityCode"
    :is-charge-on-hold="isChargeOnHold"
    :additional-payment-provider-text="additionalPaymentProviderText"
    :show-masked-input="isIntegrationTesting == false"
  />
</template>

<script>
import {
  computeds as voucherComputeds,
  methods as voucherMethods,
} from "@/composable/voucher";
import visaLogo from "@/assets/credit-card-visa.svg";
import masterCardLogo from "@/assets/credit-card-master-card.svg";
import jcbLogo from "@/assets/credit-card-jcb.svg";
import creditCardType from "credit-card-type";
import debounce from "lodash-es/debounce";
import { mapFields } from "vuex-map-fields";
import CreditCardInputView from "./CreditCardInputView";
import { mapGetters, mapState } from "vuex";
export default {
  components: {
    CreditCardInputView,
  },
  props: {
    forceMobileVersion: {
      type: Boolean,
      default: false,
    },
    isChargeOnHold: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const { voucherPaymentType } = voucherComputeds;
    const { useVoucher } = voucherMethods;
    return {
      voucherPaymentType,
      useVoucher,
    };
  },
  computed: {
    ...mapState(["lang", "isIntegrationTesting"]),
    ...mapFields("booking", [
      "creditCard.name",
      "creditCard.number",
      "creditCard.logo",
      "creditCard.expMonthYear",
      "creditCard.securityCode",
    ]),
    ...mapGetters("webConfig", ["paymentProvider"]),
    additionalPaymentProviderText() {
      const omise = {
        en: `Your credit card details will be stored in OMISE (an online payment system). Read more about OMISE security <a target='_blank' href='https://www.omise.co/security' class='text-red-dark hover:underline'>by clicking here. </a>`,
        th: `รายละเอียดเกี่ยวกับบัตรเครดิต/เดบิต ของคุณจะถูกเก็บรักษาโดย OMISE (ระบบชำระเงินออนไลน์) อ่านเพิ่มเติมเกี่ยวกับการรักษาความปลอดภัยบนเว็บไซต์ของ OMISE <a target='_blank' href=''https://www.omise.co/security' class='text-red-dark hover:underline'>คลิกที่นี่</a>`,
      };
      const gbPrimepay = {
        en: `Your credit card detail is <a class="text-red-dark hover:underline" href="https://www.gbprimepay.com/en/privacy" target="_blank">safe</a> and <a class="text-red-dark hover:underline" href="https://www.gbprimepay.com/en/secure" target="_blank">secure</a> by GB PrimePay.`,
        th: `บัตรเครดิตของคุณ ได้รับการคุ้มครองความปลอดภัยโดย  <a href="https://www.gbprimepay.com/en/safe" target="_blank">GB PrimePay</a>`,
      };
      return this.paymentProvider === "omise "
        ? omise[this.lang]
        : gbPrimepay[this.lang];
    },
  },
  watch: {
    number() {
      this.checkCreditCardType();
      if (this.voucherPaymentType.ccPayment) {
        this.checkVoucher();
      }
    },
  },
  methods: {
    checkCreditCardType: debounce(function () {
      const posibleCreditCardType = creditCardType(this.number);
      if (posibleCreditCardType.length > 0) {
        const firstIndex = posibleCreditCardType[0];
        // we only check these 3 brand logo (based on omise supported card)
        if (firstIndex.type === "visa") {
          this.logo = visaLogo;
        } else if (firstIndex.type === "mastercard") {
          this.logo = masterCardLogo;
        } else if (firstIndex.type === "jcb") {
          this.logo = jcbLogo;
        } else {
          this.logo = "";
        }
      } else {
        this.logo = "";
      }
    }, 1000),
    checkVoucher: debounce(function () {
      this.useVoucher();
    }, 1000),
  },
};
</script>
