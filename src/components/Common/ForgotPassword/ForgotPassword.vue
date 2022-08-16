<template>
  <div class="relative">
    <div class="w-full mx-auto lg:w-4/5 lg:py-10">
      <h1 class="mt-8 mb-4 text-xl font-black text-center lg:mb-4">
        {{ $t("login") }}
      </h1>
      <p class="mt-8 mb-4 text-xl text-center capitalize lg:mb-4">
        {{ isResetPassword ? "reset password" : $t("forgotYourPassword") }}
      </p>

      <form class="mx-4 mb-12" action="" @submit.prevent="doForgotPasword">
        <div
          class="flex items-center w-full py-2 mb-3 border-b border-gray-500 input-with-icon lg:mb-3 have-icon-left"
        >
          <span class="flex items-center mr-2 text-lg icon icon-left">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="icon-envelope text-red-dark"
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
            type="text"
          />
        </div>
        <div class="my-3 text-sm text-center text-red-dark">
          {{ pleaseTickRecaptchaMessage }}
        </div>
        <recaptcha
          v-if="isLoadRecaptchaScript === false"
          ref="recaptcha"
          @verify="verifyCaptcha"
        ></recaptcha>
        <button
          id="submit-reset-password-button"
          type="submit"
          class="w-full py-2 mt-5 font-black text-white uppercase border-none rounded-full cursor-pointer bg-red-dark hover:bg-red-light lg:mt-4"
          :disabled="isLoading"
        >
          {{ isLoading ? $t("loading") : $t("resetPassword") }}
        </button>
      </form>
    </div>
    <!-- close icon -->
    <span
      class="absolute flex items-center justify-center mx-auto text-lg font-black cursor-pointer text-red-dark"
      style="right: 5px; top: 5px; width: 20px; height: 20px"
      @click="closeModal"
    >
      X
    </span>
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import Recaptcha from "./Recaptcha";
import loadScript from "@/lib/loadExternalScript";
const recaptchaScript = "https://www.google.com/recaptcha/api.js";
import queryString from "qs";
let timeOutInstance;

export default {
  components: {
    Recaptcha,
  },
  data() {
    return {
      isLoadRecaptchaScript: true,
      isLoading: false,
      isVerified: false,
      pleaseTickRecaptchaMessage: "",
    };
  },
  computed: {
    ...mapFields("user", ["email"]),
    modalWidth() {
      return this.isDesktop ? "530" : "90%";
    },
    isResetPassword() {
      const urlSearchStringify = queryString.parse(window.location.search, {
        ignoreQueryPrefix: true,
      });
      return urlSearchStringify.forgotpassword ? true : false;
    },
  },
  mounted() {
    this.loadGoogleRecaptchaAsync();
  },
  beforeDestroy() {
    clearTimeout(timeOutInstance);
  },
  methods: {
    loadGoogleRecaptchaAsync() {
      this.isLoadRecaptchaScript = true;
      loadScript(recaptchaScript, "google-recaptcha")
        .then(() => {
          timeOutInstance = setTimeout(() => {
            this.isLoadRecaptchaScript = false;
          }, 1000);
        })
        .catch((err) => {
          this.$rollbar.error(err);
          this.$alert.error("Oops, failed get google recaptcha script");
        });
    },
    verifyCaptcha() {
      this.isVerified = true;
      this.pleaseTickRecaptchaMessage = "";
    },
    closeModal() {
      this.$modal.hide("forgot-password-modal");
    },
    async doForgotPasword() {
      if (!this.isVerified) {
        this.pleaseTickRecaptchaMessage = this.$t("tickRecaptcha");
        return true; // prevent form from submitting
      }
      try {
        this.isLoading = true;
        const response = await this.$store.dispatch("user/doForgotPasword");
        if (response.isSuccess === false) {
          if (response.message) {
            this.$alert.error(response.message);
          }
          this.$refs.recaptcha.reset();
        } else {
          this.$alert.success(response.message);
          this.$modal.hide("forgot-password-modal");
        }
        this.isVerified = false;
      } catch (err) {
        this.$alert.error(err);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
<i18n>
{
  "en": {
    "login": "Login",
    "forgotYourPassword": "Forgot Yout Password?",
    "loading": "Please wait ...",
    "resetPassword": "RESET PASSWORD",
    "email": "email",
    "tickRecaptcha": "Please tick recaptcha"
  },
  "th": {
    "login": "เข้าสู่ระบบ",
    "forgotYourPassword": "ลืมรหัสผ่าน?",
    "loading": "โปรดรอสักครู่ ...",
    "resetPassword": "ตั้งรหัสผ่านใหม่",
    "email": "อีเมล",
    "tickRecaptcha": "กรุณาทำเครื่องหมายที่ recaptcha"
  }
}
</i18n>
