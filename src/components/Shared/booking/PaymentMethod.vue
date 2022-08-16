<template>
  <div>
    <template v-if="showPaymentOption">
      <h4
        class="py-3 font-black text-center capitalize"
        :class="!forceMobileVersion ? 'lg:py-6 lg:text-xl' : ''"
      >
        {{ title }}
      </h4>
      <!-- payment method button -->
      <div
        class="flex flex-wrap items-center justify-around px-2 pb-3 mx-auto overflow-auto"
        :class="[
          !forceMobileVersion ? ' lg:px-0 lg:w-9/12 lg:pb-5 lg:text-base' : '',
        ]"
      >
        <div v-if="showCardOption" :class="buttonClass">
          <button
            id="creditcard-payment-method-button"
            class="payment-option-button"
            :class="
              selectedPayment === PAYMENT_CREDIT_CARD
                ? 'bg-red-pink text-red-dark'
                : 'bg-white text-red-dark'
            "
            @click="changePayment(PAYMENT_CREDIT_CARD)"
          >
            {{ $t("debitCredit") }}
          </button>
        </div>

        <div v-if="showQrOption" :class="buttonClass">
          <button
            id="promptpay-payment-method-button"
            class="payment-option-button"
            :class="
              selectedPayment === PAYMENT_PROMPTPAY
                ? 'bg-red-pink text-red-dark'
                : 'bg-white text-red-dark'
            "
            @click="changePayment(PAYMENT_PROMPTPAY)"
          >
            {{ $t("qrPayment") }}
          </button>
        </div>

        <div v-if="showShopeePayOption" :class="buttonClass">
          <button
            id="promptpay-payment-method-button"
            class="payment-option-button"
            :class="
              selectedPayment === PAYMENT_SHOPEEPAY
                ? 'bg-red-pink text-red-dark'
                : 'bg-white text-red-dark'
            "
            @click="changePayment(PAYMENT_SHOPEEPAY)"
          >
            <div class="flex-shrink-0 mr-1">
              <img
                width="18"
                src="@/assets/icon-shopee.png"
                 loading="lazy"
                alt="shoppe pay logo"
              />
            </div>
            {{ $t("shopeePay") }}
          </button>
        </div>

        <div v-if="showTrueWalletOption" :class="buttonClass">
          <button
            id="true-wallet-payment-method-button"
            class="payment-option-button"
            :class="
              selectedPayment === PAYMENT_TRUEWALLET
                ? 'bg-red-pink text-red-dark'
                : 'bg-white text-red-dark'
            "
            @click="changePayment(PAYMENT_TRUEWALLET)"
          >
            <div class="flex-shrink-0">
              <img
                width="120"
                src="@/assets/logo-true-wallet.png"
                alt="true wallet logo"
                 loading="lazy"
              />
            </div>
          </button>
        </div>
      </div>
    </template>
    <div
      class="mx-auto"
      :class="
        !forceMobileVersion
          ? 'px-2 lg:px-0 lg:w-9/12 lg:pb-5 lg:text-base'
          : 'w-11/12'
      "
    >
      <!-- debit / credit card -->
      <div
        v-if="selectedPayment === PAYMENT_CREDIT_CARD"
        key="card"
        class="px-2 mt-3"
      >
        <CreditCardInput
          :is-charge-on-hold="chargeOnHold"
          :force-mobile-version="forceMobileVersion"
        />
      </div>
      <!-- Prompt pay -->
      <div v-else-if="selectedPayment === PAYMENT_PROMPTPAY" key="promptpay">
        <p
          class="px-2 text-sm leading-normal text-center"
          :class="
            !forceMobileVersion
              ? 'lg:text-base lg:px-3 lg:pt-6 lg:w-10/12 mx-auto'
              : ''
          "
        >
          {{
            $t("weWillGenerateAmountPayment", { amount: $money(totalCharge) })
          }}
          {{ $t("useYourBank") }}
        </p>
        <p
          class="mx-4 mt-4 text-sm leading-normal text-center text-red-dark"
          :class="!forceMobileVersion ? 'lg:mx-0 lg:mt-0 lg:text-base' : ''"
        >
          {{ $t("pleaseWait", { minute: qrMaxTime }) }}
        </p>
      </div>
      <!-- Shopee pay -->
      <div v-else-if="selectedPayment === PAYMENT_SHOPEEPAY" key="shopeepay">
        <p
          class="px-2 text-sm leading-normal text-center"
          :class="
            !forceMobileVersion
              ? 'lg:text-base lg:px-3 lg:pt-6 lg:w-10/12 mx-auto'
              : ''
          "
        >
          {{ $t("shopeePayPaymentText") }}
        </p>
      </div>
      <!-- True wallet -->
      <div v-else-if="selectedPayment === PAYMENT_TRUEWALLET" key="truewallet">
        <p
          class="px-2 text-sm leading-normal text-center"
          :class="
            !forceMobileVersion
              ? 'lg:text-base lg:px-3 lg:pt-6 lg:w-10/12 mx-auto'
              : ''
          "
        >
          {{ $t("trueWalletPaymentText") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import CreditCardInput from "@/components/Booking/Credit Card Input/CreditCardInput.vue";
import {
  PAYMENT_CREDIT_CARD,
  PAYMENT_PROMPTPAY,
  PAYMENT_TRUEWALLET,
  PAYMENT_SHOPEEPAY,
} from "@/lib/constant";
export default {
  name: "PaymentMethod",
  components: {
    CreditCardInput,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    showPaymentOption: {
      type: Boolean,
      default: true,
    },
    showTrueWalletOption: {
      type: Boolean,
      default: false,
    },
    showQrOption: {
      type: Boolean,
      default: true,
    },
    showCardOption: {
      type: Boolean,
      default: true,
    },
    showShopeePayOption: {
      type: Boolean,
      default: true,
    },
    selectedPayment: {
      type: String,
      required: true,
      validator(value) {
        return [
          "",
          PAYMENT_TRUEWALLET,
          PAYMENT_CREDIT_CARD,
          PAYMENT_PROMPTPAY,
          PAYMENT_SHOPEEPAY,
        ].indexOf(value) !== -1
          ? true
          : false;
      },
    },
    qrMaxTime: {
      type: [String, Number],
      required: true,
    },
    totalCharge: {
      type: [String, Number],
      required: true,
    },
    forceMobileVersion: {
      type: Boolean,
      required: true,
    },
    chargeOnHold: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      PAYMENT_TRUEWALLET,
      PAYMENT_PROMPTPAY,
      PAYMENT_CREDIT_CARD,
      PAYMENT_SHOPEEPAY,
    };
  },
  computed: {
    countPaymentOptions() {
      const options = [
        this.showTrueWalletOption,
        this.showQrOption,
        this.showCardOption,
        this.showShopeePayOption,
      ];
      return options.filter((option) => option === true).length;
    },
    buttonClass() {
      let baseStyle = "mx-2 mb-3 mx-0";
      return this.countPaymentOptions === 3
        ? `${baseStyle} w-full`
        : `${baseStyle} w-1/2`;
    },
  },
  methods: {
    changePayment(paymentOption) {
      this.$emit("on-payment-selected", paymentOption);
    },
  },
};
</script>
<style scoped>
.payment-option-button {
  @apply w-11/12 flex items-center justify-center h-12 px-4 py-2 mx-auto text-sm font-black leading-normal border rounded-full cursor-pointer whitespace-nowrap border-red-dark mr-2;
}
</style>
<i18n>
{
  "en": {
    "shopeePay": "SHOPEE PAY",
    "debitCredit": "DEBIT / CREDIT CARD",
    "qrPayment": "QR PAYMENT",
    "shopeePayPaymentText": "The system will redirect to Shopee Pay application or website",
    "trueWalletPaymentText": "The system will redirect to True Wallet payment page",
    "weWillGenerateAmountPayment": "We will generate QR code for the amount {amount} Baht.",
    "useYourBank": "Use your Bank App to scan the QR code",
    "pleaseWait": "Please make the payment within {minute} minutes. Otherwise this order will be canceled"

  },
  "th": {
    "shopeePay": "SHOPEE PAY",
    "debitCredit": "บัตรเดบิต / บัตรเครดิต",
    "qrPayment": "จ่ายด้วย QR Code",
    "shopeePayPaymentText": "ระบบจะทำการเชื่อมต่อไปที่ Shopee Pay โดยอัตโนมัติ",
    "trueWalletPaymentText": "ระบบจะทำการเชื่อมต่อไปที่ True Wallet โดยอัตโนมัติ",
    "weWillGenerateAmountPayment": "ระบบจะสร้าง QR Code สำหรับชำระเงิน {amount} บาท",
    "useYourBank": "หลังจากกดปุ่ม 'ยืนยันและชำระเงิน' โปรดใช้แอปพลิเคชั่นธนาคารของคุณแสกน QR Code เพื่อชำระเงิน",
    "pleaseWait": "โปรดชำระเงินภายใน {minute} นาที. มิฉะนั้น ออเดอร์นี้จะถูกยกเลิก"

  }
}
</i18n>
