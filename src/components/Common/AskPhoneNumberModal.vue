<template>
  <portal :to="PORTAL_FOR_MODAL_SELECTOR">
    <HHModal
      v-model="isModalShowing"
      :content-class="'w-10/12 lg:w-6/12 p-4 bg-white'"
      :is-show-close-button="false"
      @on-click-outside="$emit('on-closed')"
    >
      <div class="h-full wrapper">
        <ValidationObserver v-slot="{ invalid }">
          <div class="relative h-full p-8">
            <div class="w-full px-6 mx-auto mt-8 lg:w-4/5 lg:py-4">
              <img
                src="@/assets/icon-message-red.png"
                width="40"
                class="mx-auto"
                loading="lazy"
                alt="icon message"
              />
              <h1
                class="mt-5 mb-8 text-sm font-bold text-center text-gray-700 lg:text-lg lg:mb-4"
              >
                {{ $t("pleaseCheckYourNumber") }}
              </h1>
              <form action="" @submit.prevent="">
                <div class="mb-3">
                  <ValidationProvider
                    v-slot="{ errors }"
                    rules="required|leadingZeroPhone"
                    slim
                  >
                    <div
                      class="flex items-center w-full py-2 mb-1 border-b border-gray-500 input-with-icon have-icon-left"
                    >
                      <span
                        class="flex items-center mr-2 text-lg icon icon-left"
                      >
                        <div>
                          <img
                            src="@/assets/icon-phone-red.png"
                            width="18"
                            height="18"
                            loading="lazy"
                            alt="phone icon"
                          />
                        </div>
                      </span>
                      <div class="flex-grow ml-6">
                        <input
                          id="ask-phone-input"
                          v-model="phoneInput"
                          name="phone"
                          autocomplete="tel-local"
                          class="flex flex-auto w-full text-sm bg-transparent border-none input lg:text-base"
                          style="border-top: 0; border-right: 0; border-left: 0"
                          :placeholder="capitalize($t('phone'))"
                          type="text"
                        />
                      </div>
                    </div>
                    <div class="text-sm text-red-dark">{{ errors[0] }}</div>
                  </ValidationProvider>
                </div>

                <button
                  id="submit-phone-update"
                  type="submit"
                  class="block w-full py-2 mx-auto mt-10 font-black text-white uppercase border-none rounded-full cursor-pointer lg:w-2/3 lg:mt-8"
                  :class="
                    invalid || isLoading
                      ? 'bg-gray-light'
                      : 'bg-red-dark hover:bg-red-light'
                  "
                  :disabled="invalid || isLoading"
                  @click="doUpdatePhone"
                >
                  {{ isLoading ? $t("pleaseWait") : $t("submit") }}
                </button>
              </form>
            </div>
          </div>
        </ValidationObserver>
      </div>
    </HHModal>
  </portal>
</template>

<script>
import intlTelInputLib from "@/lib/intlTelInput";
import { provider, observer } from "@/lib/veeValidate";
import { mapGetters } from "vuex";
import { PORTAL_FOR_MODAL_SELECTOR } from "@/lib/constant";
import { isLeadingZero, removeLeadingZero } from "@/helper/phoneNumber";
import capitalize from "lodash-es/capitalize";
import HHModal from "@/components/Shared/HHModal.vue";
let timeOutInstance;

export default {
  components: {
    ValidationProvider: provider,
    ValidationObserver: observer,
    HHModal,
  },
  props: {
    isShown: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      PORTAL_FOR_MODAL_SELECTOR,
      phoneCodeInput: "",
      phoneInput: "",
      isLoading: false,
      isModalShowing: false,
      advPhoneInput: "",
    };
  },
  computed: {
    ...mapGetters("user", ["isUserSignedIn", "isUserHavePhone"]),
    modalWidth() {
      return this.isDesktop ? "500px" : "90%";
    },
    modalHeight() {
      return this.isDesktop ? "350px" : "auto";
    },
  },
  watch: {
    isShown(val) {
      this.isModalShowing = val;
    },
  },
  beforeDestroy() {
    clearTimeout(timeOutInstance);
  },
  mounted() {
    this.onModalOpened();
  },
  methods: {
    capitalize,
    closeModal() {
      this.clearData();
      this.$emit("on-closed");
    },
    onModalOpened() {
      this.$nextTick(() => {
        timeOutInstance = setTimeout(() => {
          this.initInputTelephone();
        }, 500);
      });
    },
    async doUpdatePhone() {
      if (!isLeadingZero(this.phoneInput)) {
        this.$alert.error(this.$t("leadingZeroPhone"));
        return;
      }
      if (this.isUserSignedIn) {
        this.isLoading = true;
        const result = await this.$store.dispatch("user/updateProfile", {
          callingCode: `+${
            this.advPhoneInput.getSelectedCountryData().dialCode
          }`,
          phone: removeLeadingZero(this.phoneInput),
        });
        if (result.isSuccess) {
          this.$alert.success("Phone number added");
          const getProfileResult = await this.$store.dispatch(
            "user/getProfile"
          );
          if (getProfileResult.isSuccess) {
            this.$emit("on-phone-updated");
            this.isLoading = false;
            this.closeModal();
            return;
          }
          this.$alert.error(result.message);
        } else {
          this.$alert.error(result.message);
        }
        this.isLoading = false;
        return;
      }
    },
    async initInputTelephone() {
      try {
        const inputTel = await intlTelInputLib();
        const el = document.getElementById("ask-phone-input");
        if (!el) {
          return;
        }
        this.advPhoneInput = inputTel(el, {
          initialCountry: "th",
          separateDialCode: false,
        });
        el.style.cssText = "padding-left: 45px";

        el.addEventListener("countrychange", () => {
          this.phoneCodeInput = `+${
            this.advPhoneInput.getSelectedCountryData().dialCode
          }`;
        });
      } catch (err) {
        this.$rollbar.error(err);
      }
    },
    clearData() {
      this.phoneInput = "";
      this.phoneCodeInput = "";
    },
  },
};
</script>
<style scoped>
.wrapper {
  transition: all ease-in 0.5;
}
</style>
