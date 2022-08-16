<template>
  <div class="relative h-full edit-profile-form">
    <div class="text-center">
      <label class="relative inline-block">
        <img
          :src="previewAvatar"
          loading="lazy"
          alt="icon user"
          class="rounded-full user-avatar"
        />
        <input
          type="file"
          accept="image/*"
          class="hidden"
          @change="previewImage"
        />
        <div class="absolute bottom-0 right-0">
          <div class="p-2 bg-gray-200 rounded-full">
            <img
              src="@/assets/icon-camera-black.png"
              loading="lazy"
              alt="icon camera"
            />
          </div>
        </div>
      </label>
    </div>

    <ValidationObserver v-slot="{ invalid }">
      <form
        action=""
        class="w-9/12 mx-auto mt-4"
        @submit.prevent="updateProfile"
      >
        <div class="mb-6">
          <ValidationProvider
            v-slot="{ errors }"
            rules="required|alpha_spaces"
            slim
          >
            <div
              class="flex items-center w-full py-2 mb-1 border-b border-gray-500 input-with-icon have-icon-left"
            >
              <span class="flex items-center mr-2 text-lg icon icon-left">
                <div>
                  <img
                    src="@/assets/icon-user-red.png"
                    width="18"
                    loading="lazy"
                    height="18"
                    alt="user icon"
                  />
                </div>
              </span>
              <input
                v-model="name"
                name="name"
                autocomplete="name"
                class="flex flex-auto text-sm border-none input lg:text-base"
                style="border-top: 0; border-right: 0; border-left: 0"
                :placeholder="capitalize($t('name'))"
                type="text"
              />
            </div>
            <div class="text-sm text-red-dark">{{ errors[0] }}</div>
          </ValidationProvider>
        </div>

        <div class="mb-6">
          <div
            class="flex items-center w-full py-2 mb-1 border-b border-gray-500 input-with-icon have-icon-left"
          >
            <span class="flex items-center mr-2 text-lg icon icon-left">
              <div>
                <img
                  src="@/assets/icon-cake-red.png"
                  width="18"
                  loading="lazy"
                  height="18"
                  alt="cake icon"
                />
              </div>
            </span>
            <imask-input
              v-if="showMaskedInput"
              v-model="birthDay"
              name="birth day"
              class="w-full my-1 text-sm border-none input"
              mask="DD/MM"
              :blocks="birthDayMaskedInput"
              :lazy="false"
              :overwrite="true"
            />
          </div>
        </div>

        <div class="mb-6">
          <ValidationProvider v-slot="{ errors }" rules="required" slim>
            <div
              class="flex items-center w-full py-2 mb-1 border-b border-gray-500 input-with-icon have-icon-left"
            >
              <span class="flex items-center mr-2 text-lg icon icon-left">
                <div>
                  <img
                    src="@/assets/icon-phone-red.png"
                    width="18"
                    height="18"
                    loading="lazy"
                    alt="user icon"
                  />
                </div>
              </span>
              <input
                id="edit-profile-phone-input"
                ref="edit-profile-phone-input"
                v-model="phone"
                name="phone"
                autocomplete="tel-local"
                class="flex flex-auto w-full text-sm border-none input lg:text-base"
                style="border-top: 0; border-right: 0; border-left: 0"
                :placeholder="capitalize($t('phone'))"
                type="text"
              />
            </div>
            <div class="text-sm text-red-dark">{{ errors[0] }}</div>
          </ValidationProvider>
        </div>

        <div class="mb-6">
          <ValidationProvider v-slot="{ errors }" rules="required|email" slim>
            <div
              class="flex items-center w-full py-2 mb-1 border-b border-gray-500 input-with-icon have-icon-left"
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
                :placeholder="capitalize($t('email'))"
                type="email"
              />
            </div>
            <div class="text-sm text-red-dark">{{ errors[0] }}</div>
          </ValidationProvider>
        </div>

        <button
          id="change-password-button"
          type="button"
          class="block px-2 py-2 mx-auto mt-4 text-xs font-black capitalize bg-white border-none rounded-full cursor-pointer font-blac text-red-dark lg:w-2/3 lg:mt-8"
          @click="$emit('on-change-password')"
        >
          {{ $t("changePassword") }}
        </button>

        <button
          id="submit-signup-button"
          type="submit"
          class="block px-2 py-2 mx-auto mt-2 text-xs font-black text-white uppercase border-none rounded-full cursor-pointer lg:w-2/3 lg:mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="invalid ? 'bg-gray-light' : 'bg-red-dark hover:bg-red-light'"
          :disabled="invalid || isLoading"
        >
          <div class="flex items-center justify-center capitalize">
            <div v-if="isLoading" class="mr-1 loader small white"></div>
            <span>{{ isLoading ? $t("pleaseWait") : $t("saveChanges") }}</span>
          </div>
        </button>
      </form>
    </ValidationObserver>

    <button
      id="delete-account-button"
      type="button"
      class="delete-account-button"
      @click="$emit('on-delete-account')"
    >
      <div class="flex items-center justify-center capitalize">
        <span>{{ "Delete Account" }}</span>
      </div>
    </button>
  </div>
</template>

<script>
import { provider, observer } from "@/lib/veeValidate";
import capitalize from "lodash-es/capitalize";
import { IMaskComponent } from "vue-imask";
import IMask from "imask";
import intlTelInputLib from "@/lib/intlTelInput";
import imageMutator from "@/services/imageMutator";
let timeOutInstance;

export default {
  name: "ProfileEditMain",
  components: {
    ValidationProvider: provider,
    ValidationObserver: observer,
    ImaskInput: IMaskComponent,
  },
  data() {
    return {
      name: "",
      phone: "",
      phoneCode: "",
      phoneCodeCountry: "",
      birthDay: "",
      email: "",
      avatar: "",
      newAvatar: "",
      newAvatarPreview: "",
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
    showMaskedInput() {
      return true;
    },
    previewAvatar() {
      return this.newAvatarPreview || this.avatar;
    },
  },
  mounted() {
    this.parseProfileData();
    this.$nextTick(() => {
      timeOutInstance = setTimeout(() => {
        this.initInputTelephone();
      }, 500);
    });
  },
  beforeDestroy() {
    clearTimeout(timeOutInstance);
  },
  methods: {
    capitalize,
    parseProfileData() {
      const {
        name,
        email,
        phone,
        phoneCode,
        phoneCodeCountry,
        birthDay,
        avatarThumb,
      } = this.$store.state.user;
      this.name = name;
      this.email = email;
      this.phone = phone;
      this.phoneCode = phoneCode;
      this.phoneCodeCountry = phoneCodeCountry;
      this.birthDay = birthDay;
      this.avatar = imageMutator({
        image: avatarThumb,
        desktopWidth: 118,
        desktopHeight: 118,
        mobileWidth: 118,
        mobileHeight: 118,
        isRetina: true,
        isWebp: true,
      });
    },
    async initInputTelephone() {
      try {
        const inputTel = await intlTelInputLib();
        const el = this.$refs["edit-profile-phone-input"];
        if (el) {
          const advInputTel = inputTel(el, {
            initialCountry: this.phoneCodeCountry || "th",
            separateDialCode: true,
          });
          el.style.cssText = "padding-left: 77px";

          el.addEventListener("countrychange", () => {
            this.phoneCode = `+${
              advInputTel.getSelectedCountryData().dialCode
            }`;
          });
        }
      } catch (err) {
        this.$rollbar.error(err);
      }
    },
    previewImage(event) {
      var input = event.target;
      if (input.files && input.files[0]) {
        this.newAvatar = input.files[0];
        var reader = new FileReader();
        reader.onload = (e) => {
          this.newAvatarPreview = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
      }
    },
    async updateProfile() {
      this.isLoading = true;

      let payload = {
        avatar: this.newAvatar,
        name: this.name,
        email: this.email,
        callingCode: this.phoneCode,
        phone: this.phone,
      };
      if (this.birthDay) {
        const splitBirthDay = this.birthDay.split("/");
        const formatedBirthDay = splitBirthDay[1] + "-" + splitBirthDay[0];
        if (
          Number.isNaN(splitBirthDay[1]) == false &&
          Number.isNaN(splitBirthDay[0]) == false
        ) {
          payload.birthDay = formatedBirthDay;
        }
      }
      const result = await this.$store.dispatch("user/updateProfile", payload);
      if (result.isSuccess) {
        await this.$store.dispatch("user/getProfile");
        this.isLoading = false;
        this.$alert.success(result.message);
        this.$emit("on-profile-edit");
        return;
      }
      this.isLoading = false;
      this.$alert.error(result.message);
    },
  },
};
</script>

<style lang="scss">
.edit-profile-form {
  .user-avatar {
    width: 118px;
    height: 118px;
  }

  .iti__selected-flag {
    padding: 0 6px 0 3px;
  }
}

.delete-account-button {
  left: 35%;
  @apply block px-3 py-2 mx-auto mt-2 text-xs font-black text-gray-500 uppercase border border-none rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed;
  @apply absolute bottom-0;
  @screen lg {
    @apply static text-sm w-2/3 mt-8;
    left: auto;
  }
}
</style>
