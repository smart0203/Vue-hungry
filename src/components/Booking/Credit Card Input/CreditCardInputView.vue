<template>
  <div>
    <!-- charge on hold warning text -->
    <div
      v-if="isChargeOnHold"
      :class="!forceMobileVersion ? 'lg:text-sm lg:mb-6' : ''"
      class="text-xs text-center"
    >
      <span class="text-red-dark">Note:</span>
      {{ $t("chargedOnHoldHeader") }}
    </div>
    <div
      class="flex flex-col mt-2"
      :class="!forceMobileVersion ? 'lg:flex-row' : ''"
    >
      <div
        class="w-full"
        :class="!forceMobileVersion ? 'lg:order-last lg:ml-6 lg:text-sm' : ''"
      >
        <div class="mb-2 text-xs text-gray-700">{{ $t("cardNumber") }}</div>
        <ValidationProvider
          v-slot="{ errors }"
          name="card number"
          rules="required"
          tag="div"
        >
          <div class="flex border-b border-black">
            <imask-input
              v-if="showMaskedInput"
              id="cardNumber"
              v-model="cardNumber"
              name="card number"
              class="w-full my-1 text-sm border-none"
              :class="!forceMobileVersion ? 'lg:text-base' : ''"
              type="text"
              mask="0000 0000 0000 0000"
              :lazy="false"
              :unmask="false"
              placeholder-char="X"
              @keyup="$emit('update:number', cardNumber)"
            />
            <input
              v-else
              id="cardNumber"
              v-model="cardNumber"
              type="text"
              class="w-full my-1 text-sm border-none"
              @keyup="$emit('update:number', cardNumber)"
            />
            <div>
              <img
                v-if="logo"
                :src="logo"
                alt=""
                style="width: 35px"
                loading="lazy"
              />
            </div>
          </div>
          <div class="mt-2 text-xs text-red-dark">
            {{ errors[0] }}
          </div>
        </ValidationProvider>
      </div>
      <div
        class="w-full mr-2"
        :class="!forceMobileVersion ? 'lg:text-sm lg:mr-6' : 'mt-4'"
      >
        <ValidationProvider v-slot="{ errors }" rules="required" slim>
          <div>
            <div class="mb-2 text-xs text-gray-700">{{ $t("nameOnCard") }}</div>
            <div class="border-b border-black">
              <input
                id="cardName"
                v-model="cardName"
                name="card name"
                class="w-full my-1 text-sm border-none"
                :class="!forceMobileVersion ? 'lg:text-base' : ''"
                type="text"
                placeholder=""
                @input="$emit('update:name', cardName)"
              />
            </div>
            <div class="mt-2 text-xs text-red-dark">
              {{ errors[0] }}
            </div>
          </div>
        </ValidationProvider>
      </div>
    </div>
    <div class="flex mt-4">
      <div
        class="w-full"
        :class="!forceMobileVersion ? 'lg:mr-6 lg:text-sm' : ''"
      >
        <div class="mb-2 text-xs text-gray-700">{{ $t("expiredDate") }}</div>
        <ValidationProvider
          id="cardExp"
          ref="cardExp"
          v-slot="{ errors }"
          name="card exp"
          rules="validCardExp"
          tag="div"
        >
          <div class="border-b border-black">
            <imask-input
              v-if="showMaskedInput"
              v-model="cardExpMonthYear"
              name="card exp"
              class="w-full my-1 text-sm border-none"
              :class="!forceMobileVersion ? 'lg:text-base' : ''"
              mask="MM/YY"
              :blocks="cardExpMonthYearMaskedInput"
              :lazy="false"
              :overwrite="true"
            />
            <input
              v-else
              id="cardExpired"
              v-model="cardExpMonthYear"
              type="text"
              class="w-full my-1 text-sm border-none"
            />
          </div>
          <div class="mt-2 text-xs text-red-dark">
            {{ errors[0] }}
          </div>
        </ValidationProvider>
      </div>
      <div class="w-16"></div>
      <div class="w-full" :class="!forceMobileVersion ? 'lg:text-sm' : ''">
        <ValidationProvider
          v-slot="{ errors }"
          name="security code"
          rules="required|length:3"
          tag="div"
        >
          <div class="mb-2 text-xs text-gray-700">
            {{ $t("securityCvv") }}
            <i
              id="cvv-icon"
              class="ml-1 text-white bg-gray-300 rounded-full cursor-pointer icon-help"
            ></i>
          </div>
          <div class="relative border-b border-black">
            <imask-input
              v-if="showMaskedInput"
              id="securityCode"
              v-model="cardSecurityCode"
              name="security code"
              class="w-full my-1 text-sm border-none"
              :class="!forceMobileVersion ? 'lg:text-base' : ''"
              :type="showCardSecurityCode ? 'text' : 'password'"
              mask="000"
              :lazy="false"
              :unmask="true"
            />
            <input
              v-else
              id="securityCode"
              v-model="cardSecurityCode"
              type="text"
              class="w-full my-1 text-sm border-none"
            />
            <button
              id="show-password-butto"
              class="absolute right-0 text-base"
              @click="showCardSecurityCode = !showCardSecurityCode"
            >
              <svg
                v-if="showCardSecurityCode"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="icon-eye"
                viewBox="0 0 16 16"
              >
                <path
                  d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"
                />
                <path
                  d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"
                />
              </svg>

              <svg
                v-if="!showCardSecurityCode"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-eye-slash"
                viewBox="0 0 16 16"
              >
                <path
                  d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"
                />
                <path
                  d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299l.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"
                />
                <path
                  d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884l-12-12 .708-.708 12 12-.708.708z"
                />
              </svg>
            </button>
          </div>
          <div class="mt-2 text-xs text-red-dark">
            {{ errors[0] }}
          </div>
        </ValidationProvider>
      </div>
    </div>

    <p
      class="w-full mt-4 text-xs text-center"
      v-html="additionalPaymentProviderText"
    ></p>
  </div>
</template>

<script>
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import { IMaskComponent } from "vue-imask";
import { provider } from "@/lib/veeValidate";

import IMask from "imask";

export default {
  components: {
    "imask-input": IMaskComponent,
    ValidationProvider: provider,
  },
  props: {
    forceMobileVersion: {
      type: Boolean,
      default: false,
    },
    isChargeOnHold: {
      type: Boolean,
      default: false,
    },
    number: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    expMonthYear: {
      type: String,
      required: true,
    },
    securityCode: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    additionalPaymentProviderText: {
      type: String,
      required: true,
    },
    showMaskedInput: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      cardName: this.name,
      cardNumber: this.number,
      cardExpMonthYear: this.expMonthYear,
      cardSecurityCode: this.securityCode,
      maskedExp: "",
      cardExpMonthYearMaskedInput: {
        MM: {
          mask: IMask.MaskedRange,
          placeholderChar: "M",
          from: 1,
          to: 12,
          maxLength: 2,
        },
        YY: {
          mask: IMask.MaskedRange,
          placeholderChar: "Y",
          from: 0,
          to: 99,
          maxLength: 2,
        },
      },
      showCardSecurityCode: true,
    };
  },
  watch: {
    cardExpMonthYear: function (newVal) {
      this.$emit("update:expMonthYear", newVal);
    },
    cardSecurityCode: function (newVal) {
      if (newVal.length === 3) {
        setTimeout(() => {
          this.showCardSecurityCode = false;
        }, 200);
      } else {
        this.showCardSecurityCode = true;
      }
      this.$emit("update:securityCode", this.cardSecurityCode);
    },
  },
  mounted() {
    this.initPopOver();
  },
  methods: {
    initPopOver() {
      const el = document.getElementById("cvv-icon");
      const text = this.$t("cvvHelper");
      tippy(el, {
        content: text,
        placement: "bottom",
        trigger: "mouseenter click",
      });
    },
  },
};
</script>
<i18n>
{
  "en": {
    "chargedOnHoldHeader": "We are NOT charging your credit card yet, it is only for authorization",
    "cvvHelper": "3 digit number on the back of your card",
    "cardNumber": "Card Number",
    "expiredDate": "Expiration Date",
    "nameOnCard": "Name on card",
    "securityCvv": "Security Code (CVV)"
  },
  "th": {
    "chargedOnHoldHeader": "เรายังไม่ได้เรียกเก็บเงินจากบัตรเครดิตของคุณ นี่เป็นเพียงการอนุมัติ",
    "cvvHelper": "รหัส 3 ตัวด้านหลังบัตร",
    "cardNumber": "หมายเลขบัตร",
    "expiredDate": "วันหมดอายุของบัตร",
    "nameOnCard": "ชื่อผู้ถือบัตร",
    "securityCvv": "รหัสหลังบัตร (CVV)"
  }
}
</i18n>
