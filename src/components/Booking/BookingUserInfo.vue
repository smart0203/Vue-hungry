<template>
  <div
    class="mx-auto"
    :class="!forceMobileVersion ? 'px-2 lg:px-0 lg:w-9/12' : 'w-11/12'"
  >
    <div>
      <!-- for Guest  -->
      <template v-if="isUserSignedIn === false">
        <div class="flex flex-wrap px-2">
          <div
            class="w-full mb-4 text-center"
            :class="
              !forceMobileVersion ? 'lg:w-1/2 lg:pr-10 lg:text-base' : 'text-xs'
            "
          >
            <button
              id="show-sign-modal-button"
              class="w-full py-3 leading-normal text-white border-none rounded-full cursor-pointer lg:py-2 bg-red-dark hover:bg-red-light"
              @click="showSignInModal"
            >
              <span class="mr-2 font-black">{{ $t("signInSignUp") }}</span>
              <span class="text-xs text-gray-100">{{
                $t("toCollectYourPoint")
              }}</span>
            </button>
          </div>
          <!-- name -->
          <ValidationProvider v-slot="{ errors }" rules="required" slim>
            <div
              class="w-full mb-4"
              :class="!forceMobileVersion ? 'lg:w-1/2 lg:mb-4' : ''"
            >
              <div class="flex items-center pb-2 border-b border-gray-700">
                <div>
                  <img
                    class="mr-2 icon icon-left"
                    src="@/assets/icon-user-red.png"
                    alt="icon user"
                    width="20px"
                    height="20px"
                    loading="lazy"
                  />
                </div>
                <input
                  id="name"
                  v-model="input.name"
                  name="Name"
                  class="flex flex-auto text-sm border-none input lg:text-base"
                  style="border-top: 0; border-right: 0; border-left: 0"
                  :placeholder="$t('name')"
                  type="text"
                  @change="applyInputToStore('name', input.name)"
                />
              </div>
              <div class="mt-1 text-xs text-red-dark lg:text-sm">
                {{ errors[0] }}
              </div>
            </div>
          </ValidationProvider>
          <!-- phone -->
          <ValidationProvider
            v-slot="{ errors }"
            rules="required|leadingZeroPhone"
            slim
          >
            <div
              class="w-full mb-4"
              :class="!forceMobileVersion ? 'lg:w-1/2 lg:pr-10 lg:mb-4' : ''"
            >
              <div class="flex pb-2 border-b border-gray-700">
                <div>
                  <img
                    loading="lazy"
                    class="mr-2 icon icon-left"
                    src="@/assets/icon-phone-red.png"
                    alt="icon phone"
                    width="20px"
                    height="20px"
                  />
                </div>
                <input
                  id="phone"
                  v-model.trim="input.phone"
                  name="Phone"
                  class="flex flex-auto w-full text-sm border-none input phone-input"
                  :class="!forceMobileVersion ? 'lg:text-base' : ''"
                  style="border-top: 0; border-right: 0; border-left: 0"
                  :placeholder="$t('phone')"
                  type="tel"
                  @change="applyInputToStore('phone', input.phone)"
                />
              </div>
              <div
                class="mt-1 text-xs text-red-dark"
                :class="!forceMobileVersion ? 'lg:text-sm' : ''"
              >
                {{ errors[0] }}
              </div>
            </div>
          </ValidationProvider>
          <!-- email -->
          <ValidationProvider v-slot="{ errors }" rules="required|email" slim>
            <div
              class="w-full mb-4"
              :class="!forceMobileVersion ? 'lg:w-1/2 lg:mb-4' : ''"
            >
              <div class="flex pb-2 border-b border-gray-700">
                <div>
                  <img
                    loading="lazy"
                    class="mr-2 icon icon-left"
                    src="@/assets/icon-email-red.png"
                    alt="icon email"
                    width="20px"
                    height="20px"
                  />
                </div>
                <input
                  id="email"
                  v-model.trim="input.email"
                  name="Email"
                  class="flex flex-auto text-sm border-none input"
                  :class="!forceMobileVersion ? 'lg:text-base' : ''"
                  style="border-top: 0; border-right: 0; border-left: 0"
                  :placeholder="$t('email')"
                  type="email"
                  @change="applyInputToStore('email', input.email)"
                />
              </div>
              <div
                class="mt-1 text-xs text-red-dark"
                :class="!forceMobileVersion ? 'lg:text-sm' : ''"
              >
                {{ errors[0] }}
              </div>
            </div>
          </ValidationProvider>
          <!-- message -->
          <div
            v-if="isShowSpecialRequest"
            class="flex w-full pb-2 mb-3 border-b border-gray-700"
          >
            <div>
              <img
                class="mr-2 icon icon-left"
                src="@/assets/icon-message-red.png"
                alt="icon message"
                loading="lazy"
                width="20px"
                height="20px"
              />
            </div>
            <textarea
              id="specialRequest"
              v-model="specialRequest"
              name="special request"
              class="flex flex-auto text-sm border-none input special-request-input"
              :class="!forceMobileVersion ? 'lg:text-base' : ''"
              :placeholder="$t('specialRequest')"
              @input="autoGrow"
              @focus="isInputSpecialRequestHasFocus = true"
              @blur="isInputSpecialRequestHasFocus = false"
            ></textarea>
          </div>

          <p
            v-if="isShowSpecialRequestWarning"
            class="mb-2 text-xs lg:text-sm text-red-dark"
          >
            {{ `*${$t("specialRequest")}` }}
          </p>
        </div>
      </template>
      <!-- for member -->
      <template v-else>
        <div
          class="flex flex-col px-2"
          :class="!forceMobileVersion ? 'lg:flex-row' : ''"
        >
          <div>
            <HhImage
              v-if="!forceMobileVersion"
              :img="avatarThumb"
              alt="user avatar"
              :desktop-height="120"
              :desktop-width="120"
              :mobile-height="120"
              :mobile-width="120"
              class="mx-auto rounded-full user-avatar"
            />
          </div>
          <div
            class="w-full mx-auto my-3"
            :class="!forceMobileVersion ? 'lg:w-8/12 lg:my-0' : ''"
          >
            <div class="flex items-start mb-3">
              <div
                class="flex items-center w-2/5"
                :class="!forceMobileVersion ? 'lg:w-4/12' : ''"
              >
                <div>
                  <img
                    class="mr-2 icon icon-left"
                    src="@/assets/icon-user-red.png"
                    alt="icon user"
                    loading="lazy"
                    width="20px"
                    height="20px"
                  />
                </div>
                <span class="text-red-dark">{{ $t("name") }}</span>
              </div>
              <div class="w-3/5 text-gray-700 break-words">
                {{ name }}
              </div>
            </div>
            <div class="flex items-start mb-3">
              <div
                class="flex items-center w-2/5"
                :class="!forceMobileVersion ? 'lg:w-4/12' : ''"
              >
                <div>
                  <img
                    class="mr-2 icon icon-left"
                    src="@/assets/icon-email-red.png"
                    alt="icon email"
                    width="20px"
                    loading="lazy"
                    height="20px"
                  />
                </div>
                <span class="text-red-dark">{{ $t("email") }}</span>
              </div>
              <div class="w-3/5 text-gray-700 break-words">
                {{ email }}
              </div>
            </div>
            <div class="flex items-start mb-3">
              <div
                class="flex items-center w-2/5"
                :class="!forceMobileVersion ? 'lg:w-4/12' : ''"
              >
                <div>
                  <img
                    class="mr-2 icon icon-left"
                    src="@/assets/icon-phone-red.png"
                    alt="icon email"
                    width="20px"
                    loading="lazy"
                    height="20px"
                  />
                </div>
                <span class="text-red-dark">{{ $t("phone") }}</span>
              </div>
              <div class="w-3/5 text-gray-700">
                <!-- user has phone -->
                <template v-if="isUserHavePhone">
                  <div class="break-words">
                    {{ `${phoneCodeWithMark}${phone}` }}
                  </div>
                </template>

                <template v-else>
                  <div
                    class="py-2 pl-2 text-sm bg-gray-200 border-l-2 border-red-dark"
                  >
                    To continue booking, please add your
                    <a
                      class="font-black cursor-pointer text-red-dark hover:underline"
                      @click="showAskPhoneNumberModal"
                      >phone number
                    </a>
                  </div>
                </template>
              </div>
            </div>
            <div
              v-if="isShowSpecialRequest"
              class="flex w-full pb-2 mb-3 border-b border-gray-700"
              :class="!forceMobileVersion ? 'lg:mb-4' : ''"
            >
              <div>
                <img
                  class="mr-2 icon icon-left"
                  src="@/assets/icon-message-red.png"
                  alt="icon message"
                  width="20px"
                  loading="lazy"
                  height="20px"
                />
              </div>
              <textarea
                v-model="specialRequest"
                name="special request"
                class="flex flex-auto text-sm border-none input special-request-input"
                :class="!forceMobileVersion ? 'lg:text-base' : ''"
                :placeholder="$t('specialRequest')"
                @input="autoGrow"
                @focus="isInputSpecialRequestHasFocus = true"
                @blur="isInputSpecialRequestHasFocus = false"
              ></textarea>
            </div>

            <p
              v-if="isShowSpecialRequestWarning"
              class="mb-2 text-xs lg:text-sm text-red-dark"
            >
              {{ `*${$t("specialRequest")}` }}
            </p>
          </div>
        </div>
      </template>

      <!-- modal to add phone number (if signed user dont have) -->
      <component
        :is="addPhoneNumberComponent"
        v-if="!isUserHavePhone"
        :is-shown="isShowAskPhoneModal"
        @on-closed="isShowAskPhoneModal = false"
      ></component>
    </div>
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import intlTelInputLib from "@/lib/intlTelInput";
import { provider } from "@/lib/veeValidate";
import { storageGetUserProfile } from "@/lib/localStorage";
import { isLeadingZero } from "@/helper/phoneNumber";
import throttle from "lodash-es/throttle";
import { mapGetters, mapState } from "vuex";
import useLazyImport from "@/composable/useLazyImport";
let specialRequestInput;
export default {
  components: {
    ValidationProvider: provider,
  },
  props: {
    forceMobileVersion: {
      type: Boolean,
      default: false,
    },
    isShowSpecialRequest: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      input: {
        name: "",
        email: "",
        phone: "",
        phoneCode: "",
        phoneCodeCountry: "",
      },
      addPhoneNumberComponent: "",
      isShowAskPhoneModal: false,
      isInputSpecialRequestHasFocus: false,
    };
  },
  computed: {
    ...mapGetters(["baseUrlWithLang"]),
    ...mapGetters("user", ["isUserHavePhone", "isUserSignedIn"]),
    ...mapFields("booking", ["specialRequest"]),
    ...mapState("user", [
      "name",
      "phone",
      "phoneCode",
      "email",
      "phoneCodeCountry",
      "avatarThumb",
    ]),
    phoneCodeWithMark() {
      if (this.phoneCode) {
        if (this.phoneCode.includes("+") === true) {
          return this.phoneCode;
        }
        return `+${this.phoneCode}`;
      }
      return "";
    },
    isShowSpecialRequestWarning() {
      return (
        this.isInputSpecialRequestHasFocus || this.specialRequest.length > 0
      );
    },
  },
  watch: {
    isUserSignedIn: {
      handler(newVal, oldval) {
        if (
          newVal === true &&
          oldval === false &&
          this.isUserHavePhone === false
        ) {
          this.isShowAskPhoneModal = true;
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.getLocalProfile();
    this.$nextTick(() => {
      this.initInputTelephone();
      specialRequestInput = document.getElementsByClassName(
        "special-request-input"
      )[0];
    });
    this.loadAddPhoneNumberComponent();
  },
  beforeDestroy() {
    this.onBeforeDestroy();
  },
  methods: {
    applyInputToStore(state, val) {
      if (typeof state === "string" && (val !== undefined || val !== null)) {
        this.$store.commit("user/setState", {
          state,
          val,
        });
      }
    },
    async initInputTelephone() {
      if (this.isUserSignedIn) {
        return;
      }
      try {
        const intlTelInput = await intlTelInputLib();
        const el = document.getElementsByClassName("phone-input")[0];
        if (el) {
          const advInputTel = intlTelInput(el, {
            initialCountry: this.phoneCodeCountry || "th",
            separateDialCode: false,
          });
          el.style.cssText = "padding-left: 45px";
          el.addEventListener("countrychange", () => {
            const countryData = advInputTel.getSelectedCountryData();
            const phoneCodeCountry = countryData.iso2;
            const phoneCode = `+${countryData.dialCode}`;
            this.input.phoneCode = phoneCode;
            this.input.phoneCodeCountry = phoneCodeCountry;
            this.applyInputToStore("phoneCode", phoneCode);
            this.applyInputToStore("phoneCodeCountry", phoneCodeCountry);
          });
        }
      } catch (err) {
        this.$rollbar.error(err);
      }
    },
    showSignInModal() {
      this.$modal.show("login-modal");
    },
    getLocalProfile() {
      if (this.isUserSignedIn) {
        return;
      }
      const profile = storageGetUserProfile();
      if (profile) {
        const { name, email, phoneCode, phone } = profile;
        // only apply when current input field is empty and data from local storage is correct
        this.input.name =
          typeof name === "string" && this.input.name.length === 0
            ? name
            : this.input.name;
        this.input.email =
          typeof email === "string" && this.input.email.length === 0
            ? email
            : this.input.email;
        this.input.phoneCode =
          typeof phoneCode === "string" && this.input.phoneCode.length === 0
            ? phoneCode
            : this.input.phoneCode;

        this.applyInputToStore("name", this.input.name);
        this.applyInputToStore("email", this.input.email);
        this.applyInputToStore("phoneCode", this.input.phoneCode);

        if (typeof phone === "string" && phone.length) {
          try {
            this.input.phone = isLeadingZero(phone) ? phone : `0${phone}`;
            this.applyInputToStore("phone", this.input.phone);
          } catch (err) {
            this.$rollbar.error(err, { phone: profile.phone });
          }
        }
      }
    },
    autoGrow: throttle(() => {
      specialRequestInput.style.height =
        specialRequestInput.scrollHeight + "px";
    }, 1000),
    async showAskPhoneNumberModal() {
      await this.loadAddPhoneNumberComponent();
      if (this.addPhoneNumberComponent) {
        this.isShowAskPhoneModal = true;
      }
    },
    async loadAddPhoneNumberComponent() {
      if (this.isUserHavePhone) {
        return;
      }
      try {
        const moduleResult = await useLazyImport(() =>
          import(
            /* webpackChunkName: "AskPhoneNumberModal" */ "@/components/Common/AskPhoneNumberModal"
          )
        );
        this.addPhoneNumberComponent = moduleResult.default;
      } catch (err) {
        this.$rollbar.error(
          "Oops, something went wrong, failed to open add phone number modal",
          err
        );
        this.$alert.error(
          "Oops, something went wrong, failed to open add phone number modal"
        );
      }
      return "";
    },
    onBeforeDestroy() {
      if (this.isUserSignedIn) {
        return;
      }
      this.$modal.hide("login-modal");
    },
  },
};
</script>
<style lang="scss" scoped>
.user-avatar {
  width: 120px;
  height: 120px;
}

.special-request-input {
  height: 25px;
  resize: none;
  overflow: hidden;
}
</style>
<i18n>
{
  "en": {
    "signInSignUp": "SIGN IN / SIGN UP",
    "toCollectYourPoint": "TO COLLECT YOUR POINTS!",
    "name": "Name",
    "email": "Email",
    "phone": "Phone",
    "specialRequest": "Special Request is not guaranteed"
  },
  "th": {
    "signInSignUp": "เข้าสู่ระบบ / ลงทะเบียน",
    "toCollectYourPoint": "เพื่อสะสมแต้ม!",
    "name": "ชื่อ",
    "email": "อีเมล",
    "phone": "เบอร์โทร",
    "specialRequest": "คำขอพิเศษ (ไม่การันตีคำขอพิเศษ)"
  }
}
</i18n>
