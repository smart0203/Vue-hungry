<template>
  <portal :to="PORTAL_FOR_MODAL_SELECTOR">
    <ValidationObserver ref="address-phone-confirm-form" tag="div">
      <modal
        name="check-phone-modal"
        :width="modalWidth"
        :height="modalHeight"
        @opened="modalOpened"
      >
        <div class="h-full wrapper">
          <div class="relative h-full p-8">
            <div class="w-full mx-auto lg:mt-8 lg:w-4/5">
              <h1
                class="mb-2 text-lg font-black text-center lg:text-lg lg:mb-4"
              >
                {{ $t("confirmDetail") }}
              </h1>

              <div class="flex items-center mb-3 ml-6 capitalize">
                <span>
                  <img
                    src="@/assets/icon-phone-red.png"
                    :width="isMobile ? 18 : 16"
                    :height="isMobile ? 18 : 16"
                    alt="phone icon"
                    class="mr-2"
                    loading="lazy"
                /></span>
                {{ $t("phone") }}
              </div>

              <ValidationProvider
                v-slot="{ errors }"
                rules="required|leadingZeroPhone"
                slim
              >
                <div
                  class="p-3 border border-black rounded-full input-with-icon have-icon-right lg:text-base"
                >
                  <div class="w-full">
                    <input
                      id="confirm-phone"
                      v-model.trim="phoneInput"
                      type="number"
                      class="w-full text-sm bg-transparent input"
                    />
                    <span
                      class="text-sm capitalize icon icon-right text-red-dark"
                      >{{ $t("edit") }}</span
                    >
                  </div>
                </div>
                <div class="mt-1 ml-2 text-xs text-red-dark">
                  {{ errors[0] }}
                </div>
              </ValidationProvider>

              <div v-if="showConfirmAddress">
                <div class="flex items-center mt-6 mb-3 ml-6 capitalize">
                  <span
                    ><img
                      src="@/assets/icon-location-red.png"
                      :width="isMobile ? 18 : 16"
                      :height="isMobile ? 18 : 16"
                      alt="address icon"
                      loading="lazy"
                      class="mr-2"
                  /></span>
                  {{ $t("deliveryAddress") }}
                </div>
                <PickLocation
                  :location="location"
                  show-additional-address
                  @on-location-pick="setUserLocation"
                >
                  <template #default="{ openPickLocationModal }">
                    <div
                      class="flex cursor-pointer input-with-icon delivery-input-location have-icon-right"
                      @click="
                        closeModal();
                        openPickLocationModal();
                      "
                    >
                      <div
                        class="flex items-center flex-auto border border-black rounded-full input"
                      >
                        <div
                          class="py-1 ml-4 text-xs capitalize input-location lg:text-sm"
                        >
                          {{
                            isUserPickedLocation
                              ? pickedLocationName
                              : $t("location")
                          }}
                        </div>
                      </div>

                      <span
                        class="text-sm capitalize icon icon-right text-red-dark"
                        >{{ $t("edit") }}</span
                      >
                    </div>
                  </template>
                </PickLocation>
                <div
                  v-if="!isUserPickedLocation"
                  class="mt-1 ml-2 text-xs text-red-dark"
                >
                  {{ $t("selectLocation") }}
                </div>
              </div>

              <button
                id="confirmPhone"
                type="button"
                :disabled="isLoading"
                class="block w-full py-2 mt-10 text-sm font-black text-white uppercase capitalize border-none rounded-full cursor-pointer lg:mt-8 bg-red-dark hover:bg-red-light lg:text-base disabled:bg-gray-300"
                @click="confirmPhone"
              >
                {{ isLoading ? $t("pleaseWait") : $t("confirm") }}
              </button>
            </div>
            <!-- close icon -->
            <div
              class="absolute cursor-pointer"
              style="left: 15px; top: 15px; width: 20px; height: 20px"
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
        </div>
      </modal>
    </ValidationObserver>
  </portal>
</template>

<script>
import { PORTAL_FOR_MODAL_SELECTOR, DELIVERY } from "@/lib/constant";
import { mapGetters, mapState } from "vuex";
import { storageSetUserLocation } from "@/lib/localStorage";
import intlTelInputLib from "@/lib/intlTelInput";
import { mapFields } from "vuex-map-fields";
import { observer, provider } from "@/lib/veeValidate";
import { isLeadingZero } from "@/helper/phoneNumber";
import useLazyImport from "@/composable/useLazyImport";

export default {
  components: {
    PickLocation: () =>
      useLazyImport(() =>
        import("@/components/Shared/Pick Location/PickLocation")
      ),
    ValidationObserver: observer,
    ValidationProvider: provider,
  },
  data() {
    return {
      PORTAL_FOR_MODAL_SELECTOR,
      isLoading: false,
      phoneInput: "",
    };
  },
  computed: {
    ...mapFields("user", ["phone"]),
    ...mapState("user", ["phoneCodeCountry", "phoneCode"]),
    ...mapGetters("user", ["isUserSignedIn"]),
    ...mapGetters("booking", ["pickedLocationName", "isUserPickedLocation"]),
    ...mapState("booking", ["location", "bookingMethod"]),
    modalWidth() {
      return this.isDesktop ? "500px" : "90%";
    },
    modalHeight() {
      return this.isDesktop ? "auto" : "auto";
    },
    showConfirmAddress() {
      return this.bookingMethod === DELIVERY;
    },
  },
  methods: {
    closeModal() {
      this.$modal.hide("check-phone-modal");
    },
    modalOpened() {
      this.phoneInput = isLeadingZero(this.phone)
        ? this.phone
        : `0${this.phone}`;
      this.addressInput = this.location;
      this.$nextTick(() => {
        this.initInputTelephone();
      });
    },
    async initInputTelephone() {
      try {
        const intlTelInput = await intlTelInputLib();
        const el = document.getElementById("confirm-phone");
        if (el) {
          intlTelInput(el, {
            initialCountry: this.phoneCodeCountry || "th",
            separateDialCode: false,
          });
          el.style.cssText = "padding-left: 45px";
        }
      } catch (err) {
        this.$rollbar.error(err);
      }
    },
    setUserLocation(location) {
      this.$store.dispatch("booking/setUserLocation", location);
      storageSetUserLocation(location);
      this.closeModal();
      this.$emit("on-user-change-location");
    },
    async validate() {
      const form = this.$refs["address-phone-confirm-form"];
      const formValidationSuccess = await form.validate();
      if (formValidationSuccess && this.pickedLocationName.length > 0) {
        return true;
      }
      return false;
    },
    async updatePhone() {
      if (!this.isUserSignedIn) {
        this.phone = this.phoneInput;
        return;
      }
      this.isLoading = true;
      let payload = {
        phone: this.phoneInput,
      };
      const result = await this.$store.dispatch("user/updateProfile", payload);
      if (result.isSuccess) {
        await this.$store.dispatch("user/getProfile");
        this.isLoading = false;
        this.$alert.success(result.message);
        return;
      }
      this.isLoading = false;
      this.$alert.error(result.message);
    },
    async confirmPhone() {
      const validateResult = await this.validate();
      if (validateResult) {
        if (this.phoneInput !== this.phone) {
          await this.updatePhone();
        }
        this.$emit("on-phone-confirmed");
        this.closeModal();
        return;
      }
      this.$alert.error(this.$t("correctErrorAlert"));
    },
  },
};
</script>
<style scoped>
.wrapper {
  transition: all ease-in 0.5;
}
</style>
<i18n>
{
  "en": {
    "checkYourNumber": "Check Your Number",
    "confirmDetail": "Confirm Details",
    "correctErrorAlert": "Please correct all error",
    "selectLocation": "Please enter the address"
  },
  "th": {
    "checkYourNumber": "โปรดตรวจสอบหมายเลขโทรศัพท์ของคุณ",
    "confirmDetail": "ยืนยันรายละเอียด",
    "correctErrorAlert": "โปรดแก้ไขข้อผิดพลาดทั้งหมด",
    "selectLocation": "กรุณากรอกที่อยู่"
  }
}
</i18n>
