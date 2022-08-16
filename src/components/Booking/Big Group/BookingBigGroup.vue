<template>
  <div>
    <ValidationObserser v-slot="{ invalid }">
      <!-- header -->
      <div
        v-if="isDesktop"
        class="flex items-center py-2 lg:ml-4 lg:mr-2 lg:text-sm"
      >
        <div class="mx-2">
          <div class="relative cart">
            <img
              src="@/assets/icon-order-red.png"
              width="40px"
              loading="lazy"
              alt="cart icon"
            />
            <span class="text-sm font-black counter"> 1 </span>
          </div>
        </div>
        <h4 class="flex-auto m-0 ml-1 text-xl font-black capitalize">
          {{ isDineIn ? $t("youAreBooking") : $t("youAreOrdering") }}
        </h4>
      </div>

      <div v-else class="py-2 text-base font-black text-center border-b">
        {{ restaurantName }}
      </div>
      <div class="ml-4 mr-2 text-sm">
        <p
          class="mx-6 mt-4 mb-6 text-lg font-black text-center"
          v-html="$t('bigGroupTitle')"
        ></p>
        <!-- name -->
        <ValidationProvider
          v-slot="{ errors }"
          rules="required"
          tag="div"
          class="mb-4"
        >
          <div
            class="flex items-center pb-2 border-b border-gray-700 input-with-icon have-icon-left"
          >
            <div>
              <img
                class="mr-2 icon icon-left"
                src="@/assets/icon-user-red.png"
                alt="icon user"
                width="20px"
                loading="lazy"
                height="20px"
              />
            </div>
            <input
              v-model="name"
              name="Name"
              class="flex flex-auto text-sm border-none input"
              style="border-top: 0; border-right: 0; border-left: 0"
              :placeholder="capitalize($t('name'))"
              :disabled="isUserSignedIn"
              type="text"
            />
          </div>
          <div class="mt-1 text-xs text-red-dark lg:text-sm">
            {{ errors[0] }}
          </div>
        </ValidationProvider>
        <!-- phone -->
        <ValidationProvider
          v-slot="{ errors }"
          rules="required"
          tag="div"
          class="mb-4"
        >
          <div class="w-full mb-4">
            <div
              class="flex pb-2 border-b border-gray-700 input-with-icon have-icon-left"
            >
              <div>
                <img
                  class="mr-2 icon icon-left"
                  src="@/assets/icon-phone-red.png"
                  alt="icon phone"
                  width="20px"
                  loading="lazy"
                  height="20px"
                />
              </div>
              <input
                v-if="isUserSignedIn"
                name="Phone"
                class="flex flex-auto w-full text-sm border-none input phone-input"
                style="border-top: 0; border-right: 0; border-left: 0"
                :placeholder="capitalize($t('phone'))"
                type="text"
                :value="`${phoneCode} ${phone}`"
                :disabled="isUserSignedIn"
              />
              <div v-else class="ml-6">
                <input
                  v-model="phone"
                  name="Phone"
                  class="flex flex-auto w-full text-sm border-none input phone-input"
                  style="border-top: 0; border-right: 0; border-left: 0"
                  :placeholder="$t('phone')"
                  type="text"
                />
              </div>
            </div>
            <div class="mt-1 text-xs text-red-dark">
              {{ errors[0] }}
            </div>
          </div>
        </ValidationProvider>
        <!-- email -->
        <ValidationProvider
          v-slot="{ errors }"
          rules="required"
          tag="div"
          class="mb-4"
        >
          <div class="w-full mb-4">
            <div
              class="flex pb-2 border-b border-gray-700 input-with-icon have-icon-left"
            >
              <div>
                <img
                  class="mr-2 icon icon-left"
                  src="@/assets/icon-email-red.png"
                  alt="icon email"
                  width="20px"
                  height="20px"
                  loading="lazy"
                />
              </div>
              <input
                v-model="email"
                name="Email"
                class="flex flex-auto text-sm border-none input"
                style="border-top: 0; border-right: 0; border-left: 0"
                :placeholder="capitalize($t('email'))"
                type="text"
                :disabled="isUserSignedIn"
              />
            </div>
            <div class="mt-1 text-xs text-red-dark">
              {{ errors[0] }}
            </div>
          </div>
        </ValidationProvider>
        <!-- date -->
        <div class="flex">
          <div class="inline-block w-7/12 mb-4">
            <div class="w-10/12">
              <BigGroupDatePicker />
            </div>
          </div>
          <!-- time -->
          <div class="inline-block w-5/12 mb-4">
            <BigGroupTimePicker />
          </div>
        </div>
        <!-- pax -->
        <ValidationProvider
          v-slot="{ errors }"
          :rules="`required|min_value:${minPax}`"
          tag="div"
          class="mb-4"
        >
          <div
            class="flex items-center pb-2 border-b border-gray-700 input-with-icon have-icon-left"
          >
            <div>
              <img
                class="mr-2 icon icon-left"
                src="@/assets/icon-people-group-red.png"
                alt="icon user"
                width="20px"
                height="20px"
                loading="lazy"
              />
            </div>
            <input
              v-model.number="adult"
              name="Number of People"
              class="flex flex-auto text-sm capitalize border-none input"
              style="border-top: 0; border-right: 0; border-left: 0"
              :placeholder="$t('numberOfPeople')"
              min="1"
              type="number"
            />
          </div>
          <div class="mt-1 text-xs text-red-dark lg:text-sm">
            {{ errors[0] }}
          </div>
        </ValidationProvider>
        <!-- choose package -->
        <ValidationProvider
          v-slot="{ errors }"
          rules="required"
          tag="div"
          class="mb-4"
        >
          <div
            class="flex items-center pb-2 border-b border-gray-700 input-with-icon have-icon-left"
          >
            <div class="flex-shrink-0">
              <img
                class="mr-2 icon icon-left"
                src="@/assets/icon-menu-red.png"
                alt="icon menu"
                width="20px"
                height="20px"
                loading="lazy"
              />
            </div>
            <select
              name="Package"
              :disabled="!isAbleSelectPackage"
              :value="selectedPackageId"
              class="flex flex-auto text-sm capitalize border-none input"
              style="border-top: 0; border-right: 0; border-left: 0"
              @change="selectPackage"
            >
              <option class="capitalize" value="" selected disabled>
                {{ $t("packages") }}
              </option>
              <option
                v-for="packages in sortedBigGroupPackages"
                :key="packages.id"
                class="capitalize"
                :value="packages.id"
              >
                {{ packages.name }}
              </option>
            </select>
          </div>
          <div class="mt-1 text-xs text-red-dark lg:text-sm">
            {{ errors[0] }}
          </div>
        </ValidationProvider>
        <!-- booking occassion -->
        <BookingOccasion />
        <!-- charge summary -->
        <BigGroupChargedSummary v-if="showChargedSummary" />
        <!-- charge summary -->
        <BookingChargePolicy
          v-if="getSelectedPackageChargePolicy"
          :charge-policy="getSelectedPackageChargePolicy"
          class="w-5/6 mx-auto mt-8 mb-4 text-xs text-left"
        />
        <!-- credit card input -->
        <CreditCardInput
          v-if="isPackageRequireCC"
          force-mobile-version
          :is-charge-on-hold="isChargeOnHold"
          class="mt-4"
        />
        <HHAcceptTerm
          v-model="acceptTerm"
          large
          class="my-4 text-xs lg:mx-4"
          :label="$t('agreement', { link: termConditionBigGroup })"
        />
        <!-- booking summary -->
        <div
          v-if="bookingSummary"
          class="mt-4 mb-3 text-sm text-center capitalize"
        >
          <div class="mx-3" v-html="bookingSummaryText"></div>
        </div>
        <!-- warning text -->
        <p
          class="my-2 text-center text-red-dark"
          v-html="$t('bigGroupWarning')"
        ></p>
      </div>
      <!-- book button -->
      <div class="flex py-4 border-t">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="currentColor"
          class="inline mx-4 cursor-pointer icon-chevron-left text-red-dark hover:text-red-light"
          viewBox="0 0 16 16"
          @click="exitBigGroup"
        >
          <path
            fill-rule="evenodd"
            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
          />
        </svg>

        <button
          id="create-big-group-booking-button"
          class="w-3/4 py-2 text-base font-black text-white rounded-full"
          :class="
            disableSendRequest(invalid)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-dark hover:bg-red-light cursor-pointer'
          "
          :disabled="disableSendRequest(invalid)"
          @click="createBigGroupBooking"
        >
          {{ $t("sendYourRequest") }}
        </button>
      </div>
    </ValidationObserser>
    <ProcessingBookingModal
      :is-show="isShowProcessingBookingModal"
      @on-async-reservation-success="bookingSuccessCallback"
      @on-async-reservation-error="setLoading(false)"
    />
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import { mapGetters, mapState } from "vuex";
import { provider, observer } from "@/lib/veeValidate";
import intlTelInputLib from "@/lib/intlTelInput";
import { storageGetUserProfile } from "@/lib/localStorage";
import capitalize from "lodash-es/capitalize";
import { sortPackageByType } from "@/helper/PackageHelper";
import {
  ROUTE_BOOKING_LANDING_PAGE,
  PAYMENT_CREDIT_CARD,
} from "@/lib/constant";
import useLazyImport from "@/composable/useLazyImport";

export default {
  components: {
    ValidationProvider: provider,
    ValidationObserser: observer,
    CreditCardInput: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "BigGroupChunk" */ "@/components/Booking/Credit Card Input/CreditCardInput"
        )
      ),
    BigGroupDatePicker: () =>
      useLazyImport(() =>
        import(/* webpackChunkName: "BigGroupChunk" */ "./BigGroupDatePicker")
      ),
    BigGroupTimePicker: () =>
      useLazyImport(() =>
        import(/* webpackChunkName: "BigGroupChunk" */ "./BigGroupTimePicker")
      ),
    BookingOccasion: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "BigGroupChunk" */ "@/components/Booking/BookingOccasion"
        )
      ),
    BookingChargePolicy: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "BigGroupChunk" */ "@/components/Booking/BookingChargePolicy"
        )
      ),
    BigGroupChargedSummary: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "BigGroupChunk" */ "./BigGroupChargedSummary"
        )
      ),
    ProcessingBookingModal: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "BigGroupChunk" */ "@/components/Common/ProcessingBookingModal"
        )
      ),
  },
  props: {
    isDineIn: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      acceptTerm: true,
      isLoading: false,
      advInputTel: "",
      isShowProcessingBookingModal: false,
    };
  },

  computed: {
    ...mapState("restaurant", [
      "restaurantName",
      "restaurantId",
      "restaurantCanonicalLink",
    ]),
    ...mapFields("user", ["name", "phone", "phoneCode", "email"]),
    ...mapFields("booking", [
      "adult",
      "isBigGroup",
      "paymentMethod",
      "bigGroupMinSize",
    ]),
    ...mapGetters("user", ["isUserSignedIn"]),
    ...mapGetters("booking", ["bookingSummary", "isAllCcFieldValid"]),
    ...mapGetters("webConfig", ["isUsingAsyncBooking"]),
    ...mapGetters("bookingPackage", [
      "packagesBigGroup",
      "isPackageRequireCC",
      "getSelectedPackage",
      "getSelectedPackageChargePolicy",
      "isSelectedPackageNeedPrepaid",
    ]),
    sortedBigGroupPackages() {
      return sortPackageByType(this.packagesBigGroup, "typeCode");
    },
    selectedPackageId() {
      if (this.getSelectedPackage.length > 0) {
        return this.getSelectedPackage[0].id;
      }
      return null;
    },
    termConditionBigGroup() {
      const { config } = this.$store.state.webConfig;
      return config.termConditionBigGroup;
    },
    minPax() {
      const { config } = this.$store.state.webConfig;
      return config.minGroupBookingPartySize;
    },
    isAbleSelectPackage() {
      const nameValidation = this.name.length > 0 ? true : false;
      const phoneValidation =
        this.phone && this.phone.length > 0 ? true : false;
      const emailValidation = this.email.length > 0 ? true : false;
      const adultValidation = this.adult > 0 ? true : false;
      if (
        nameValidation &&
        phoneValidation &&
        emailValidation &&
        adultValidation
      ) {
        return true;
      }
      return false;
    },
    showChargedSummary() {
      return this.isSelectedPackageNeedPrepaid && this.isAbleSelectPackage
        ? true
        : false;
    },
    bookingSummaryText() {
      const adult = `${this.bookingSummary.adult} ${this.$tc(
        "adult",
        this.bookingSummary.adult
      )}`;
      const kids =
        this.bookingSummary.kids > 0
          ? this.bookingSummary.kids +
            this.$tc("kids", this.bookingSummary.kids)
          : "";
      const packageName = this.bookingSummary.packageName
        ? `| ${this.bookingSummary.packageName}`
        : "";
      const date = this.bookingSummary.date;
      const time = this.bookingSummary.time
        ? `at ${this.bookingSummary.time}`
        : "";
      return `<span class="font-black">${adult} ${kids} ${packageName}</span>  <br> ${date} ${time}`;
    },
    isChargeOnHold() {
      if (this.getSelectedPackage.length) {
        this.getSelectedPackage[0].chargeType === "on_hold" ? true : false;
      }
      return false;
    },
  },
  watch: {
    isUserSignedIn: {
      handler: function (val) {
        if (val) {
          this.destroyInputTelephone();
          this.getSignedInProfile();
        } else {
          this.getLocalProfile();
          this.initInputTelephone();
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.removePreviousSelectedPackages();
    this.track();
    this.adult = this.bigGroupMinSize;
  },
  beforeDestroy() {
    this.resetState();
  },

  methods: {
    sortPackageByType,
    capitalize,
    selectPackage(event) {
      const packageId = event.target.value;
      this.$store.dispatch("bookingPackage/removeAllSelectedPackage");
      this.$store.dispatch("bookingPackage/selectPackage", packageId);
      this.setPaymentMethod();
    },
    resetState() {
      this.$store.dispatch("booking/resetAllState");
      this.$store.commit("booking/setState", {
        state: "packagePreference",
        val: "",
      });
      this.removePreviousSelectedPackages();
      this.paymentMethod = "";
    },
    destroyInputTelephone() {
      if (this.advInputTel) {
        this.advInputTel.destroy();
        const el = document.getElementsByClassName("phone-input")[0];
        el.style.cssText = "padding-left: 0";
      }
    },
    async initInputTelephone() {
      if (!this.isUserSignedIn) {
        try {
          const intlTelInput = await intlTelInputLib();
          const el = document.getElementsByClassName("phone-input")[0];
          this.advInputTel = intlTelInput(el, {
            initialCountry: "th",
            separateDialCode: false,
          });
          el.style.cssText = "padding-left: 45px";

          el.addEventListener("countrychange", () => {
            this.phoneCode = `+${
              this.advInputTel.getSelectedCountryData().dialCode
            }`;
          });
        } catch (err) {
          this.$rollbar.error(err);
        }
      }
    },
    async createBigGroupBooking() {
      this.setLoading(true);
      const result = await this.$store.dispatch("booking/doBooking");
      if (result.isSuccess === false) {
        this.setLoading(false);
        this.$alert.error(result.message);
        return;
      }
      if (this.isUsingAsyncBooking) {
        return;
      }
      this.bookingSuccessCallback(result.data.attributes.encryptedId);
    },
    exitBigGroup() {
      this.isBigGroup = false;
    },
    removePreviousSelectedPackages() {
      this.$store.dispatch("bookingPackage/removeAllSelectedPackage");
    },
    setPaymentMethod() {
      if (this.isPackageRequireCC) {
        this.paymentMethod = PAYMENT_CREDIT_CARD;
      }
    },
    getSignedInProfile() {
      const { name, phone, phoneCode, email, avatarThumb } =
        this.$store.state.user;
      this.name = name;
      this.phone = phone;
      this.phoneCode = phoneCode;
      this.email = email;
      this.avatarThumb = avatarThumb;
    },
    getLocalProfile() {
      const profile = storageGetUserProfile();
      if (profile) {
        this.name = profile.name;
        this.phone = profile.phone;
        this.email = profile.email;
        this.phoneCode = profile.phoneCode;
        this.avatarThumb = profile.avatarThumb;
      }
    },
    disableSendRequest(formInvalid) {
      const ccValid = () => {
        if (this.isPackageRequireCC === false) {
          return true;
        } else if (this.isPackageRequireCC && this.isAllCcFieldValid) {
          return true;
        }
        return false;
      };
      if (
        formInvalid ||
        this.acceptTerm === false ||
        this.getSelectedPackage.length === 0 ||
        ccValid === false ||
        this.isLoading === true
      ) {
        return true;
      }
      return false;
    },
    redirectToLandingPage(encryptedId) {
      if (!encryptedId) {
        this.$rollbar.error(
          "failed redirect to landing page, encryptedId is missing"
        );
        this.$alert.error(
          "Oops, someting went wrong, failed redirect to landing page"
        );
        return;
      }
      this.$router.push({
        name: ROUTE_BOOKING_LANDING_PAGE,
        params: {
          encryptedId,
        },
        query: {
          locale: this.$store.state.lang,
        },
      });
    },
    bookingSuccessCallback(encryptedId) {
      this.setLoading(false);
      setTimeout(() => {
        this.redirectToLandingPage(encryptedId);
      }, 200);
    },
    setLoading(isLoading = false) {
      this.isLoading = isLoading;
      if (this.isUsingAsyncBooking) {
        this.isShowProcessingBookingModal = isLoading;
      }
    },
    track() {
      this.$track("BOOKING_STEP_BIG_GROUP", {
        restaurantId: this.restaurantId,
        restaurantName: this.$store.getters["restaurant/restaurantNameEn"],
        restaurantCanonicalLink: this.restaurantCanonicalLink,
      });
    },
  },
};
</script>

<style scoped>
.counter {
  position: absolute;
  left: 40%;
  top: 20%;
  color: white;
}
</style>
<i18n>
{
  "en": {
    "bigGroupTitle": "Please fill up form of <br> Big Group dining requests",
    "bigGroupWarning": "Please wait for our reply, <br> we will get back to you as soon as possible.",
    "agreement": "By completing this order, I agree to all <a target='_blank' class='font-bold text-red-dark hover:underline' href={link}>Terms & Conditions.</a>",
    "numberOfpeople": "Number of People",
    "sendYourRequest": "SEND YOUR REQUEST"
  },
  "th": {
    "bigGroupTitle": "กรุณากรอกแบบฟอร์มสำหรับ กลุ่มใหญ่",
    "bigGroupWarning": "โปรดรอการตอบกลับจากเรา เราจะติดต่อคุณกลับโดยเร็วที่สุด",
    "agreement": "<a target='_blank' class='font-bold text-red-dark hover:underline' href={link}>ฉันได้อ่านและยอมรับ</a>ในเงื่อนไขการจอง",
    "numberOfpeople": "จำนวนคน",
    "sendYourRequest": " ส่งคำขอพิเศษ"
  }
}
</i18n>
