<template>
  <component :is="validationObserver" v-slot="{ invalid }">
    <div class="">
      <!-- line 1 -->
      <component
        :is="validationProvider"
        v-slot="{ errors }"
        rules="required"
        slim
      >
        <div class="mt-8">
          <label
            for="currentPassword"
            class="mb-2 text-xs font-black capitalize"
            >{{ $t("currentPassword") }}</label
          >
          <div
            class="flex items-center w-full py-2 mb-1 border-b border-gray-500 input-with-icon have-icon-left"
          >
            <span class="flex items-center mr-2 text-lg icon icon-left">
              <div>
                <img
                  src="@/assets/icon-lock-red.png"
                  width="18"
                  height="18"
                  loading="lazy"
                  alt="lock icon"
                />
              </div>
            </span>
            <input
              v-model="currentPassword"
              name="currentPassword"
              class="flex flex-auto text-sm border-none input lg:text-base"
              style="border-top: 0; border-right: 0; border-left: 0"
              :placeholder="capitalize($t('password'))"
              :type="showCurrentPassword ? 'text' : 'password'"
              autocomplete="current-password"
            />
            <button
              class="flex items-center mr-2 text-lg icon icon-right text-red-dark show-password-button"
              @click="showCurrentPassword = !showCurrentPassword"
            >
              <svg
                v-if="showCurrentPassword"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
                v-if="!showCurrentPassword"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                class="icon-eye-slash"
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

          <div class="text-sm text-red-dark">{{ errors[0] }}</div>
        </div>
      </component>

      <!-- line 2 -->
      <component
        :is="validationProvider"
        v-slot="{ errors }"
        rules="required|confirmed:newPasswordConfirm|min:5"
        slim
        vid="newPassword"
      >
        <div class="mt-2">
          <label for="newPassword" class="mb-2 text-xs font-black capitalize">{{
            $t("newPassword")
          }}</label>
          <div
            class="flex items-center w-full py-2 mb-1 border-b border-gray-500 input-with-icon have-icon-left"
          >
            <span class="flex items-center mr-2 text-lg icon icon-left">
              <div>
                <img
                  src="@/assets/icon-lock-red.png"
                  width="18"
                  height="18"
                  loading="lazy"
                  alt="lock icon"
                />
              </div>
            </span>
            <input
              v-model="newPassword"
              name="newPassword"
              class="flex flex-auto text-sm border-none input lg:text-base"
              style="border-top: 0; border-right: 0; border-left: 0"
              :placeholder="capitalize($t('newPassword'))"
              :type="showNewPassword ? 'text' : 'password'"
              autocomplete="new-password"
            />
            <button
              class="flex items-center mr-2 text-lg icon icon-right text-red-dark show-password-button"
              @click="showNewPassword = !showNewPassword"
            >
              <svg
                v-if="showNewPassword"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
                v-if="!showNewPassword"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                class="icon-eye-slash"
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
        </div>

        <div class="text-sm text-red-dark">{{ errors[0] }}</div>
      </component>

      <!-- line 3 -->
      <component
        :is="validationProvider"
        v-slot="{ errors }"
        rules="required|confirmed:newPassword|min:5"
        slim
        vid="newPasswordConfirm"
      >
        <div class="mt-2">
          <label
            for="newPasswordConfirm"
            class="mb-2 text-xs font-black capitalize"
            >{{ $t("confirmNewPassword") }}</label
          >
          <div
            class="flex items-center w-full py-2 mb-1 border-b border-gray-500 input-with-icon have-icon-left"
          >
            <span class="flex items-center mr-2 text-lg icon icon-left">
              <div>
                <img
                  src="@/assets/icon-lock-red.png"
                  width="18"
                  height="18"
                  loading="lazy"
                  alt="lock icon"
                />
              </div>
            </span>
            <input
              v-model="newPasswordConfirm"
              name="newPasswordConfirm"
              class="flex flex-auto text-sm border-none input lg:text-base"
              style="border-top: 0; border-right: 0; border-left: 0"
              :placeholder="capitalize($t('confirmNewPassword'))"
              :type="showNewPasswordConfirm ? 'text' : 'password'"
              autocomplete="new-password"
            />
            <button
              id="show-password-button"
              class="flex items-center mr-2 text-lg icon icon-right text-red-dark"
              @click="showNewPasswordConfirm = !showNewPasswordConfirm"
            >
              <svg
                v-if="showNewPasswordConfirm"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
                v-if="!showNewPasswordConfirm"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                class="icon-eye-slash"
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
        </div>

        <div class="text-sm text-red-dark">{{ errors[0] }}</div>
      </component>

      <div class="mt-6 text-center">
        <button
          class="flex items-center px-2 py-1 mx-auto text-white capitalize border rounded-full disabled:opacity-50"
          type="button"
          :class="
            invalid
              ? ' bg-gray-400 border-gray-400'
              : 'bg-red-dark border-red-dark'
          "
          :disabled="invalid || isLoading"
          @click="updatePassword"
        >
          <div v-if="isLoading" class="mr-2 loader small white"></div>
          {{ $t("saveChanges") }}
        </button>
      </div>
    </div>
  </component>
</template>

<script>
import capitalize from "lodash-es/capitalize";
import isEmpty from "lodash-es/isEmpty";

export default {
  name: "ProfileEditPassword",
  data() {
    return {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
      showCurrentPassword: false,
      showNewPassword: false,
      showNewPasswordConfirm: false,
      validationProvider: null,
      validationObserver: null,
      isLoading: false,
    };
  },
  mounted() {
    this.loadValidationLib();
  },
  methods: {
    capitalize,
    async loadValidationLib() {
      const module = await this.$useLazyImport(() =>
        import(/* webpackChunkName: "ProfileMobileChunk" */ "@/lib/veeValidate")
      );
      if (!isEmpty(module)) {
        this.validationProvider = module.provider;
        this.validationObserver = module.observer;
      }
    },
    async updatePassword() {
      this.isLoading = true;
      const checkLogin = await this.doLogin();
      if (checkLogin.isSuccess === false) {
        this.$alert.error(checkLogin.message);
        this.isLoading = false;
        return;
      }
      const result = await this.$store.dispatch("user/updateProfile", {
        password: this.newPassword,
      });
      if (result.isSuccess) {
        this.isLoading = false;
        this.$emit("on-update-password");
        this.$alert.success(result.message);
        return;
      }
      this.isLoading = false;
      this.$alert.error(result.message);
    },
    async doLogin() {
      const result = await this.$store.dispatch("user/doSignIn", {
        email: this.$store.state.user.email,
        password: this.currentPassword,
      });
      return result;
    },
  },
};
</script>
