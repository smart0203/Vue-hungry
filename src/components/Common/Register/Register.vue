<template>
  <ValidationObserver v-slot="{ invalid }">
    <div class="relative p-8">
      <div class="w-full mx-auto lg:w-4/5 lg:py-4">
        <img
          src="@/assets/logo-new-full-alternate.png"
          width="80"
          loading="lazy"
          alt="Hungry hub Logo"
          class="pt-10 mx-auto"
        />
        <h1 class="mt-8 mb-4 text-xl font-black text-center capitalize lg:mb-4">
          {{ $t("register") }}
        </h1>
        <form action="" @submit.prevent="">
          <div class="mb-3">
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
                  v-model="registerName"
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

          <div class="mb-3">
            <ValidationProvider
              v-slot="{ errors }"
              rules="required|leadingZeroPhone"
              slim
            >
              <div
                class="flex items-center w-full py-2 mb-1 border-b border-gray-500 input-with-icon have-icon-left"
              >
                <span class="flex items-center mr-2 text-lg icon icon-left">
                  <div>
                    <img
                      src="@/assets/icon-phone-red.png"
                      width="18"
                      height="18"
                      alt="phone icon"
                      loading="lazy"
                    />
                  </div>
                </span>
                <div class="flex-grow ml-6">
                  <input
                    id="phone-input"
                    v-model="registerPhone"
                    name="phone"
                    autocomplete="tel-local"
                    class="flex flex-auto w-full text-sm border-none input lg:text-base"
                    style="border-top: 0; border-right: 0; border-left: 0"
                    :placeholder="capitalize($t('phone'))"
                    type="text"
                  />
                </div>
              </div>
              <div class="text-sm text-red-dark">{{ errors[0] }}</div>
            </ValidationProvider>
          </div>

          <div class="mb-3">
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
                  v-model="registerEmail"
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

          <div class="mb-3">
            <ValidationProvider v-slot="{ errors }" rules="required" slim>
              <div
                class="flex items-center w-full py-2 mb-1 border-b border-gray-500 input-with-icon have-icon-left"
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
                  v-model="registerPassword"
                  name="password"
                  class="flex flex-auto text-sm border-none input lg:text-base"
                  style="border-top: 0; border-right: 0; border-left: 0"
                  :placeholder="capitalize($t('password'))"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                />
                <button
                  id="show-password-button"
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
              <div class="text-sm text-red-dark">{{ errors[0] }}</div>
            </ValidationProvider>
          </div>

          <div v-if="showReferralInput" class="mb-3">
            <div
              class="flex items-center w-full py-2 mb-1 border-b border-gray-500 input-with-icon have-icon-left"
            >
              <span class="flex items-center mr-2 text-lg icon icon-left">
                <div>
                  <img
                    src="@/assets/icon-redeem-red.png"
                    width="18"
                    loading="lazy"
                    height="18"
                    alt="lock icon"
                  />
                </div>
              </span>
              <input
                v-model="registerReferralCode"
                name="referral code"
                class="flex flex-auto text-sm border-none input lg:text-base"
                style="border-top: 0; border-right: 0; border-left: 0"
                :placeholder="capitalize($t('promotionCode'))"
                type="text"
              />
            </div>
          </div>

          <div class="flex">
            <input
              v-model="isPreferSubscribe"
              type="checkbox"
              class="mt-1 mr-2 red-checkbox"
            />
            <div
              class="text-sm"
              v-html="$t('subscribeNewsLetter', { amount: subscribeReward })"
            ></div>
          </div>

          <button
            id="submit-signup-button"
            type="submit"
            class="block w-full py-2 mx-auto mt-6 font-black text-white uppercase border-none rounded-full cursor-pointer lg:w-2/3 lg:mt-8"
            :class="
              invalid ? 'bg-gray-light' : 'bg-red-dark hover:bg-red-light'
            "
            :disabled="invalid"
            @click="doSignUp"
          >
            {{ isLoading ? $t("pleaseWait") : $t("submit") }}
          </button>
          <div
            v-if="guestBookingIds.length === 0"
            class="mt-2 text-sm text-center"
          >
            {{ $t("alreadyMember") }} ?
            <a
              class="font-black capitalize text-red-dark"
              href=""
              @click.prevent="openSignInModal"
              >{{ $t("signIn") }}
            </a>
          </div>

          <div
            class="mt-6 text-sm text-center"
            v-html="
              $t('registerTermCondition', {
                tncLink: tncLink,
                privacyPolicyLink: privacyPolicyLink,
              })
            "
          ></div>
        </form>
      </div>
      <!-- close icon -->
      <div
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
      </div>
    </div>
  </ValidationObserver>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import intlTelInputLib from "@/lib/intlTelInput";
import { provider, observer } from "@/lib/veeValidate";
import capitalize from "lodash-es/capitalize";
import { isLeadingZero, removeLeadingZero } from "@/helper/phoneNumber";
let timeOutInstance;

export default {
  components: {
    ValidationProvider: provider,
    ValidationObserver: observer,
  },
  data() {
    return {
      isLoading: false,
      showPassword: false,
      showReferralInput: false,
      isPreferSubscribe: false,
      registerName: "",
      registerEmail: "",
      registerPhone: "",
      registerPassword: "",
      registerReferralCode: "",
      registerPhoneCode: "+66",
      tncLink:
        "https://hungryhub.zendesk.com/hc/en-us/articles/360009040134-General-T-C-%E0%B8%82-%E0%B8%AD%E0%B8%81%E0%B8%B3%E0%B8%AB%E0%B8%99%E0%B8%94%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B9%80%E0%B8%87%E0%B8%B7-%E0%B8%AD%E0%B8%99%E0%B9%84%E0%B8%82",
      privacyPolicyLink:
        "https://hungryhub.zendesk.com/hc/en-us/articles/360009040074",
    };
  },
  computed: {
    ...mapFields("user", ["name", "cleverTapObj", "guestBookingIds"]),
    subscribeReward() {
      return this.$store.state.webConfig.subscribeMarketingReward;
    },
  },
  mounted() {
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
    closeModal() {
      this.$modal.hide("register-modal");
    },
    openSignInModal() {
      this.closeModal();
      this.$modal.show("login-modal");
    },
    async initInputTelephone() {
      try {
        const inputTel = await intlTelInputLib();
        const el = document.getElementById("phone-input");
        const advInputTel = inputTel(el, {
          initialCountry: "th",
          separateDialCode: false,
        });
        el.style.cssText = "padding-left: 45px";

        el.addEventListener("countrychange", () => {
          this.registerPhoneCode = `+${
            advInputTel.getSelectedCountryData().dialCode
          }`;
        });
      } catch (err) {
        this.$rollbar.error(err);
      }
    },
    async doSignUp() {
      try {
        if (!isLeadingZero(this.registerPhone)) {
          this.$alert.error("leadingZeroPhone");
          return;
        }
        this.isLoading = true;
        const phone = removeLeadingZero(this.registerPhone);
        const request = await this.$store.dispatch("user/doSignUp", {
          name: this.registerName,
          email: this.registerEmail,
          password: this.registerPassword,
          phone: phone,
          referralCode: this.registerReferralCode,
          phoneCode: this.registerPhoneCode,
          subscribePromotion: this.isPreferSubscribe,
        });
        if (!request.isSuccess && request.message) {
          this.$alert.error(request.message);
        } else {
          const login = await this.$store.dispatch("user/doSignIn", {
            email: this.registerEmail,
            password: this.registerPassword,
          });
          if (login.isSuccess == false) {
            if (login.message) {
              this.$alert.error(login.message);
            }
          } else {
            this.$alert.success(`Welcome ${this.name}`);
            this.$store.dispatch("user/sendClevertapObject", "USER_SIGNED_UP");
            this.closeModal();
          }
        }
      } catch (err) {
        this.$alert.error(err.message);
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
    "alreadyMember": "Already Member",
    "registerTermCondition": "By signing in or creating an account, you agree with our <a class='text-blue-500 hover:underline' href='{tncLink}' target='_blank'>General Terms & Conditions</a>  and <a class='text-blue-500 hover:underline' href='{privacyPolicyLink}' target='_blank'>Privacy Policy</a>"
  },
  "th": {
    "alreadyMember": "สมาชิกของเราเข้าระบบที่นี่",
    "registerTermCondition": "การลงชื่อเข้าใช้หรือสร้างบัญชีสมาชิก หมายถึงคุณยอมรับ <a class='text-blue-500 hover:underline' href='{tncLink}' target='_blank'>ข้อกำหนดและเงื่อนไขในการใช้งาน</a> และ <a class='text-blue-500 hover:underline' href='{privacyPolicyLink}' target='_blank'>นโยบายความเป็นส่วนตัว</a>"
  }
}
</i18n>
