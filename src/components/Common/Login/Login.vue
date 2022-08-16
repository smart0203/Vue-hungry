<template>
  <div class="relative">
    <div class="w-full mx-auto lg:w-4/5 lg:py-10">
      <img
        src="@/assets/logo-new-full-alternate.png"
        width="80"
        loading="lazy"
        alt="Hungry hub Logo"
        class="pt-10 mx-auto"
      />
      <h1 class="mt-8 mb-4 text-xl font-black text-center capitalize lg:mb-4">
        {{ loginTitle }}
      </h1>

      <template v-if="normalLoginForm">
        <button
          id="login-fb-button"
          class="flex w-8/12 py-2 mx-auto mb-4 text-sm text-white uppercase rounded-full disabled:opacity-50 lg:w-64 hover:opacity-75 whitespace-nowrap"
          :disabled="isLoadingFBLogin || isLoginDisabled"
          style="background: #1877f2"
          @click="loginSocialMedia('facebook')"
        >
          <span class="flex items-center w-full mx-4">
            <div v-if="isLoadingFBLogin" class="ml-3 loader small white"></div>

            <img
              v-else
              src="@/assets/icon-facebook.svg"
              width="23"
              height="23"
              loading="lazy"
              alt=""
            />
            <span class="w-full ml-3">
              {{ $t("signinWIthFb") }}
            </span>
          </span>
        </button>
        <button
          id="login-google-button"
          class="flex w-8/12 py-2 mx-auto text-sm uppercase bg-white rounded-full shadow disabled:opacity-50 lg:w-64 hover:opacity-75 whitespace-nowrap"
          :disabled="isLoadingGoogleLogin || isLoginDisabled"
          @click="loginSocialMedia('google')"
        >
          <span class="flex items-center w-full mx-4">
            <div v-if="isLoadingGoogleLogin" class="ml-3 loader small"></div>
            <img
              v-else
              src="@/assets/icon-google.svg"
              width="23"
              height="23"
              loading="lazy"
              alt=""
            />
            <span class="w-full ml-3">
              {{ $t("signinWithGoogle") }}
            </span>
          </span>
        </button>
        <div class="py-8 text-sm text-center text-gray-500">{{ $t("or") }}</div>
      </template>

      <form
        v-if="normalLoginForm"
        class="mx-4 mb-12"
        action=""
        @submit.prevent="submitForm"
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
            v-model="loginEmail"
            name="email"
            autocomplete="email"
            class="flex flex-auto text-sm border-none input lg:text-base"
            style="border-top: 0; border-right: 0; border-left: 0"
            :placeholder="$t('email')"
            type="text"
            :disabled="isLoginDisabled"
          />
        </div>
        <div
          class="flex items-center w-full py-2 mb-2 border-b border-gray-500 input-with-icon lg:mb-3 have-icon-left"
        >
          <span class="flex items-center mr-2 text-lg icon icon-left">
            <div>
              <img
                src="@/assets/icon-lock-red.png"
                width="18"
                loading="lazy"
                height="18"
                alt="lock icon"
              />
            </div>
          </span>

          <input
            v-model="loginPassword"
            name="passowrd"
            autocomplete="current-password"
            class="flex flex-auto text-sm border-none input lg:text-base"
            style="border-top: 0; border-right: 0; border-left: 0"
            :placeholder="$t('password')"
            :type="showPassword ? 'text' : 'password'"
            :disabled="isLoginDisabled"
          />

          <button
            id="show-password-button"
            type="button"
            class="flex items-center mr-2 text-lg icon icon-right"
            @click="showPassword = !showPassword"
          >
            <svg
              v-if="showPassword"
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
              v-if="!showPassword"
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
        <button
          id="login-submit-button"
          type="submit"
          class="flex items-center justify-center w-full py-2 mt-5 font-black text-white uppercase border-none rounded-full cursor-pointer bg-red-dark hover:bg-red-light lg:mt-4 disabled:opacity-50"
          :disabled="isLoading || isLoginDisabled"
        >
          <div v-if="isLoading" class="mx-3 loader small white"></div>
          <span>
            {{ isLoading ? $t("loading") : $t("signIn") }}
          </span>
        </button>
        <div class="my-3 text-sm text-center">
          {{ $t("notAmember") }}
          <a
            class="font-black text-red-dark"
            href=""
            @click.prevent="showRegisterModal"
            >{{ $t("register") }}
          </a>
        </div>
        <div class="text-sm text-center">
          <a
            class="font-black text-red-dark"
            href=""
            @click.prevent="forgotPasswordClicked"
            >{{ $t("forgotPassword") }}
          </a>
        </div>
      </form>
      <template v-if="!normalLoginForm">
        <PendingLoginForm class="px-6 py-8" />
      </template>
    </div>
    <!-- close icon -->
    <span
      class="absolute cursor-pointer"
      style="right: 5px; top: 5px; width: 20px; height: 20px"
      @click="closeModal"
    >
      <img
        src="@/assets/icon-close-black.png"
        width="15"
        height="15"
        loading="lazy"
        alt="close icon"
      />
    </span>
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import { methods as favouriteMethods } from "@/composable/favouriteRestaurant";
import {
  isAllowLocalStorage,
  isAllowCookie,
} from "@/helper/storagePermissionHelper";
import PendingLoginForm from "./PendingLoginForm.vue";
import {
  loginWithVendor,
  needInputEmail,
  needInputPhone,
} from "@/composable/socialMediaLogin";

export default {
  components: {
    PendingLoginForm,
  },
  setup() {
    const { getFavoriteRestaurants } = favouriteMethods;
    return {
      getFavoriteRestaurants,
      needInputEmail,
      needInputPhone,
    };
  },
  data() {
    return {
      isLoading: false,
      isLoadingFBLogin: false,
      isLoadingGoogleLogin: false,
      loginEmail: "",
      loginPassword: "",
      showPassword: false,
      isLoginDisabled: false,
    };
  },
  computed: {
    ...mapFields("user", ["name", "cleverTapObj"]),
    modalWidth() {
      return this.isDesktop ? "530" : "90%";
    },
    loginTitle() {
      if (this.needInputEmail) {
        return this.$t("pleaseEnterEmail");
      }
      if (this.needInputPhone) {
        return "What's your phone number ?";
      }
      return this.$t("signIn");
    },
    normalLoginForm() {
      return this.needInputEmail === false && this.needInputPhone === false;
    },
  },
  mounted() {
    this.checkIsCookiesEnabled();
  },
  methods: {
    closeModal() {
      this.$modal.hide("login-modal");
    },
    showRegisterModal() {
      this.$modal.show("register-modal");
      this.closeModal();
    },
    async loginSocialMedia(vendor = "") {
      const toggleLoading = (vendor, isLoading) => {
        if (vendor === "google") {
          this.isLoadingGoogleLogin = isLoading;
        } else if (vendor === "facebook") {
          this.isLoadingFBLogin = isLoading;
        }
      };
      try {
        toggleLoading(vendor, true);
        this.isLoading = true;
        const usingPopUpLogin = this.isDesktop ? true : false;
        const { isSuccess, message } = await loginWithVendor(
          vendor,
          usingPopUpLogin
        );
        if (isSuccess) {
          this.loginSuccessCallback();
        } else {
          if (message) {
            this.$alert.error(message);
          }
        }
        this.isLoading = false;
        toggleLoading(vendor, false);
      } catch (err) {
        const error = {
          message: `Oops, something went wrong, failed initiate login with ${vendor}`,
          cause: err,
        };
        this.$alert.error(error.message);
        this.$rollbar.error(error.message, error.cause);
        toggleLoading(vendor, false);
      }
    },
    async doSignIn() {
      try {
        this.isLoading = true;
        const response = await this.$store.dispatch("user/doSignIn", {
          email: this.loginEmail,
          password: this.loginPassword,
        });
        if (response.isSuccess === false) {
          if (response.message) {
            this.$alert.error(response.message);
          }
        } else {
          await this.getFavoriteRestaurants();
          this.loginSuccessCallback();
        }
      } catch (err) {
        this.$alert.error(err);
      } finally {
        this.isLoading = false;
      }
    },
    loginSuccessCallback() {
      this.$alert.success(`Welcome back ${this.name}`);
      this.$modal.hide("login-modal");
      this.$store.dispatch("user/sendClevertapObject", "USER_SIGNED_IN");
    },
    forgotPasswordClicked() {
      this.$modal.show("forgot-password-modal");
      this.closeModal();
    },
    checkIsCookiesEnabled() {
      if (isAllowLocalStorage() === false || isAllowCookie() === false) {
        this.isLoginDisabled = true;
        return;
      }
      this.isLoginDisabled = false;
    },
    submitForm() {
      this.doSignIn();
    },
  },
};
</script>
<i18n>
{
  "en": {
    "signinWIthFb": "Sign In With Facebook",
    "signinWithGoogle": "Sign In With Google",
    "or": "OR",
    "loading": "Please wait ...",
    "notAmember": "Not a member ?",
    "register": "Register",
    "forgotPassword": "Forgot password?",
    "email": "Email",
    "password": "Password"
  },
  "th": {
    "signinWIthFb": "เข้าสู่ระบบด้วยเฟซบุ๊ก",
    "signinWithGoogle": "เข้าสู่ระบบด้วย Google",
    "or": "หรือ",
    "loading": "โปรดรอสักครู่ ...",
    "notAmember": " ผู้ใช้ใหม่?",
    "register": "ลงทะเบียน",
    "forgotPassword": "ลืมรหัสผ่าน?",
    "email": "อีเมล",
    "password": "พาสเวิร์ด"
  }
}
</i18n>
