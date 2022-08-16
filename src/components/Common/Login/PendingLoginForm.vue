<template>
  <div>
    <ValidationObserser ref="form" v-slot="{ invalid: formInvalid }" tag="div">
      <ValidationProvider
        v-if="needInputEmail"
        v-slot="{ errors }"
        rules="required|email"
        tag="div"
      >
        <div
          class="flex items-center w-full py-2 mb-3 border-b border-gray-500 input-with-icon lg:mb-3 have-icon-left"
        >
          <span class="flex items-center mr-2 text-lg icon icon-left">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="inline icon-envelope text-red-dark"
              viewBox="0 0 16 16"
            >
              <path
                d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383l-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z"
              />
            </svg>
          </span>
          <input
            v-model="email"
            name="email"
            autocomplete="email"
            class="flex flex-auto text-sm border-none input lg:text-base"
            style="border-top: 0; border-right: 0; border-left: 0"
            :placeholder="$t('email')"
            type="email"
          />
        </div>
        <div class="my-1 text-xs text-red-dark">{{ errors[0] }}</div>
      </ValidationProvider>

      <InputPhone
        @on-phone-change="setPhone"
        @on-phone-code-change="setPhoneCode"
      />

      <div
        class="flex items-center w-full py-2 mb-1 border-b border-gray-500 input-with-icon have-icon-left"
      >
        <span class="flex items-center mr-2 text-lg icon icon-left">
          <div>
            <img
              src="@/assets/icon-cake-red.png"
              width="18"
              height="18"
               loading="lazy"
              alt="cake icon"
            />
          </div>
        </span>
        <imask-input
          v-model="birthDay"
          name="birth day"
          class="w-full my-1 text-sm border-none input"
          mask="MM-DD"
          :blocks="birthDayMaskedInput"
          :lazy="false"
          :overwrite="true"
        />
      </div>
      <div class="flex mt-4">
        <input
          v-model="subscribeMarketingEmail"
          type="checkbox"
          class="mt-1 mr-2 red-checkbox"
        />
        <div
          class="text-sm"
          v-html="$t('subscribeNewsLetter', { amount: subscribeReward })"
        ></div>
      </div>

      <button
        class="w-full py-2 mt-4 text-white capitalize rounded-full bg-red-dark disabled:bg-gray-400"
        :disabled="isDisable || formInvalid"
        @click="submit"
      >
        {{ isLoading ? $t("pleaseWait") : $t("submit") }}
      </button>
    </ValidationObserser>
  </div>
</template>

<script>
import { IMaskComponent } from "vue-imask";
import IMask from "imask";
import InputPhone from "@/components/Shared/InputPhone.vue";
import { provider, observer } from "@/lib/veeValidate";
import {
  name,
  email,
  token,
  uid,
  phone,
  birthDay,
  subscribeMarketingEmail,
  callingCode,
  needInputEmail,
  signupSocialMedia,
  resetState,
} from "@/composable/socialMediaLogin";
export default {
  name: "PendingLoginForm",
  components: {
    InputPhone,
    ImaskInput: IMaskComponent,
    ValidationProvider: provider,
    ValidationObserser: observer,
  },
  setup() {
    return {
      uid,
      name,
      email,
      token,
      phone,
      callingCode,
      birthDay,
      needInputEmail,
      subscribeMarketingEmail,
    };
  },
  data() {
    return {
      isValidEmail: false,
      isLoading: false,
      birthDayMaskedInput: {
        DD: {
          mask: IMask.MaskedRange,
          placeholderChar: "D",
          from: 1,
          to: 31,
          maxLength: 2,
        },
        MM: {
          mask: IMask.MaskedRange,
          placeholderChar: "M",
          from: 1,
          to: 12,
          maxLength: 2,
        },
      },
    };
  },
  computed: {
    subscribeReward() {
      return this.$store.state.webConfig.subscribeMarketingReward;
    },
    isDisable() {
      return (
        this.callingCode.length === 0 ||
        this.phone.length === 0 ||
        this.isValidBirthDay === false ||
        this.isLoading === true
      );
    },
    isValidBirthDay() {
      return this.birthDay.includes("D") ||
        this.birthDay.includes("M") ||
        this.birthDay.length === 0
        ? false
        : true;
    },
  },
  beforeDestroy() {
    resetState();
  },
  methods: {
    setPhone(input) {
      this.phone = input;
    },
    setPhoneCode(input) {
      this.callingCode = input;
    },
    async submit() {
      this.isLoading = true;
      try {
        const { isSuccess, message } = await signupSocialMedia();
        if (!isSuccess && message) {
          this.$alert.error(message);
        } else if (isSuccess) {
          this.$store.dispatch("webConfig/toggleLoginModal", false);
          this.$modal.hide("login-modal");
          this.$alert.success(`Welcome back ${this.name}`);
        }
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
      }
    },
  },
};
</script>
