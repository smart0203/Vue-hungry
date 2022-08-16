<template>
  <ValidationObserver ref="bookingForm" tag="div">
    <BookingTimeOutWarning
      v-if="countDown"
      :expiry-date="countDown"
      :style="`position: sticky; top: ${isMobile ? '43px' : 0}; z-index: 10`"
      :is-loading="isLoadingLockingSystem"
      @on-time-out="onBookingTimeOut"
      @on-extend-click="onExtendBookingTimeOut"
    />
    <div>
      <h4
        class="mt-2 mb-4 text-base font-black text-center"
        :class="!forceMobileVersion ? 'lg:mb-6 lg:text-xl' : ''"
      >
        {{
          forceMobileVersion
            ? `${sectionsNumberOrder.userInfoOrder}. ${$t("personalDetails")}`
            : `${sectionsNumberOrder.userInfoOrder}. ${$t("personalDetails")}`
        }}
      </h4>
    </div>
    <BookingUserInfo :force-mobile-version="forceMobileVersion" />
    <div v-if="!forceMobileVersion" class="block my-6 separator"></div>
    <BookingRecordGuest
      v-if="isNeedRecordGuest"
      :class="forceMobileVersion ? 'w-11/12 mx-auto' : 'px-4'"
      :order="sectionsNumberOrder.recordGuestOrder"
    />
    <BookingDeliveryMethod
      v-if="isDineIn === false"
      :key="deliveryMethodKeyId"
      :order="sectionsNumberOrder.deliveryMethodOrder"
      :force-mobile-version="forceMobileVersion"
      :class="!forceMobileVersion ? 'lg:w-9/12' : 'w-11/12'"
    />
    <BookingOccasion v-else />
    <!-- <div class="block my-6 separator"></div> -->
    <BookingSummaryCharge
      v-if="isMobile || forceMobileVersion"
      :force-mobile-version="forceMobileVersion"
    />
    <BookingChargePolicy
      v-if="
        getSelectedPackageChargePolicyImage || getSelectedPackageChargePolicy
      "
      :charge-policy="
        getSelectedPackageChargePolicyImage || getSelectedPackageChargePolicy
      "
      :is-image="getSelectedPackageChargePolicyImage.length > 0"
      class="w-5/6 mx-auto mt-8 mb-4 text-xs text-left"
    />
    <BookingPaymentMethod
      v-if="isShowPaymentForm"
      :order="sectionsNumberOrder.paymentMethodOrder"
      :force-mobile-version="forceMobileVersion"
    />
    <!-- accept t&c checkbox -->
    <div
      class="flex items-center justify-center mb-3 text-xs text-gray-700"
      :class="[
        !forceMobileVersion ? 'lg:text-sm lg:mx-0 mx-4' : '',
        !isSelectedPackageAcceptTravelTogether ? 'mt-6' : null,
      ]"
    >
      <div class="flex mr-2 leading-none lg:leading-none" style="width: 90%">
        <input
          v-model="acceptTC"
          type="checkbox"
          class="rounded-full red-checkbox round-checkbox big-checkbox"
        />
        <div class="ml-1">
          <div
            v-html="$t('bookingAgreement', { link: getSelectedPackageTnC })"
          ></div>
          <div v-if="!isDineIn">
            {{ $t("agreementNonFedundable") }}
          </div>
        </div>
      </div>
    </div>
    <!-- accept travel together checkbox -->
    <div
      v-if="isSelectedPackageAcceptTravelTogether"
      class="flex flex-col items-center mx-auto mt-3 mb-3 text-xs text-gray-700"
      :class="!forceMobileVersion ? 'lg:text-sm lg:mx-0 mx-4' : ''"
    >
      <div
        class="flex items-start mr-2 leading-none lg:leading-none"
        style="width: 90%"
      >
        <input
          v-model="acceptWeTravelTogether"
          type="checkbox"
          class="rounded-full red-checkbox round-checkbox big-checkbox"
        />
        <div class="ml-1">
          <div class="flex items-center">
            <div
              v-html="
                $t('travelTogetherAgreement', {
                  link: travelTogetherConfig.link,
                })
              "
            ></div>
            <HhImage
              class="ml-1"
              :img="travelTogetherConfig.icon"
              :mobile-width="50"
              :desktop-width="50"
              style="width: 20px; height: 100%"
            />
          </div>
          <div v-if="acceptWeTravelTogether" class="text-xs">
            <span v-html="$t('travelTogetherDesc')"></span>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="bookingSummary && isDineIn"
      class="mt-4 mb-3 text-sm text-center"
    >
      <div class="mx-3 font-black">
        {{ summaryText }}
      </div>
      <div>
        {{
          `${bookingSummary.date} ${
            bookingSummary.time ? $t("at") + " " + bookingSummary.time : ""
          }`
        }}
      </div>
    </div>
    <template v-if="isDineIn === false">
      <!-- <div v-if="false" class="flex justify-between my-3">
        <span class="font-black">{{ $t("voucher") }}</span>
        <span class="font-black text-red-dark">
          {{ $money(vocherAmount) }}</span
        >
      </div> -->
      <!-- <div v-if="isPackageRequireCC && isDesktop" class="flex justify-between">
        <span class="font-black text-red-dark">Total Charge Amount</span>
        <span class="font-black text-red-dark">{{ $money(totalCharge) }}</span>
      </div> -->
    </template>
    <!-- book button -->
    <div
      class="flex items-center pt-4 bg-white border-t border-gray-400 create-booking-wrapper"
    >
      <svg
        v-if="isMobile || forceMobileVersion"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        class="inline ml-4 cursor-pointer icon-chevron-left text-red-dark"
        viewBox="0 0 16 16"
        @click="back"
      >
        <path
          fill-rule="evenodd"
          d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
        />
      </svg>
      <button
        id="create-booking-button"
        class="block w-full py-2 mx-4 mx-auto font-black leading-normal text-white uppercase border-none rounded-full"
        :class="bookNowButtonStyle"
        :disabled="enableCreateBooking === false"
        @click="createBooking"
      >
        {{ bookNowButtonText }}
      </button>
    </div>
    <div
      v-if="bookButtonHelperText"
      class="mt-1 mb-2 ml-10 text-sm italic font-semibold text-center text-red-dark"
    >
      {{ bookButtonHelperText }}
    </div>
    <CheckPhoneNumberModal
      @on-phone-confirmed="onPhoneConfirmed"
      @on-user-change-location="reRenderDeliveryMethod"
    />
    <ProcessingBookingModal
      :is-true-wallet-payment="isUsingTrueWalletPayment"
      :is-show="isShowProcessingBookingModal"
      @on-async-reservation-success="onAsyncReservationSuccess"
      @on-async-true-wallet-success="showTrueWalletModal"
      @on-async-reservation-error="setLoading(false)"
      @on-cancel-clicked="setLoading(false)"
    />
    <TrueWalletPaymentModal
      :url="trueWalletURL"
      :reservation-id="originalId"
      @on-closed="setLoading(false)"
    />
  </ValidationObserver>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { mapFields } from "vuex-map-fields";
import { observer } from "@/lib/veeValidate";
import {
  isPhoneConfirmed,
  setCompareData,
  checkIsConfirmed,
  saveConfirmPhone,
} from "@/composable/confirmPhone";
import {
  state as voucherState,
  computeds as voucherComputeds,
  methods as voucherMethods,
} from "@/composable/voucher";
// import {
//   createPendingBooking,
//   deleteLocalPendingBooking,
//   toggleIsPendingBooking,
// } from "@/composable/pendingBooking";
import { isLeadingZero } from "@/helper/phoneNumber";
import {
  DELIVERY,
  PICK_UP,
  PAYMENT_TRUEWALLET,
  PAYMENT_CREDIT_CARD,
  PAYMENT_PROMPTPAY,
  PACKAGE_PREFERENCE_XPERIENCE,
  ROUTE_BOOKING_LANDING_PAGE,
  ROUTE_RESTAURANT_PAGE,
  RESERVATION_PENDING_ARRIVAL,
  RESERVATION_WAITING_FOR_PAYMENT,
  ERROR_EXPIRED_TOKEN,
} from "@/lib/constant";
import { nanoid } from "nanoid";
import { isValid as isValidCorporateEvent } from "@/composable/corporateEvent";
import { calculateCharge } from "@/composable/calculateCharge";
import {
  getFromUserStorage,
  removeFromUserStorage,
} from "@/helper/userStorage";
import {
  reservationOTPPaymentURL,
  reservationRealtimeDB,
  reservationTrueWalletUrl,
} from "@/composable/watchReservationStatus";
import useLazyImport from "@/composable/useLazyImport";
import humps from "humps";
let bookingMethodChangeCallback;
export default {
  components: {
    ValidationObserver: observer,
    BookingUserInfo: () =>
      useLazyImport(() => import("@/components/Booking/BookingUserInfo")),
    BookingDeliveryMethod: () =>
      useLazyImport(() => import("@/components/Booking/BookingDeliveryMethod")),
    BookingSummaryCharge: () =>
      useLazyImport(() => import("@/components/Booking/BookingSummaryCharge")),
    BookingPaymentMethod: () =>
      useLazyImport(() => import("@/components/Booking/BookingPaymentMethod")),
    BookingOccasion: () =>
      useLazyImport(() => import("@/components/Booking/BookingOccasion")),
    BookingRecordGuest: () =>
      useLazyImport(() => import("@/components/Booking/BookingRecordGuest")),
    BookingChargePolicy: () =>
      useLazyImport(() => import("@/components/Booking/BookingChargePolicy")),
    CheckPhoneNumberModal: () =>
      useLazyImport(() => import("@/components/Common/CheckPhoneNumberModal")),
    ProcessingBookingModal: () =>
      useLazyImport(() => import("@/components/Common/ProcessingBookingModal")),
    TrueWalletPaymentModal: () =>
      useLazyImport(() =>
        import("@/components/true_wallet/TrueWalletPaymentModal")
      ),
    BookingTimeOutWarning: () =>
      useLazyImport(() =>
        import("@/components/Booking/BookingTimeOutWarning.vue")
      ),
  },
  props: {
    forceMobileVersion: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { voucherApplied } = voucherState;
    const { anyValidVoucherApplied, voucherPaymentType, isVoucherNeedPayment } =
      voucherComputeds;
    const { useVoucher, resetVoucherState } = voucherMethods;

    return {
      isPhoneConfirmed,
      anyValidVoucherApplied,
      voucherApplied,
      useVoucher,
      resetVoucherState,
      voucherPaymentType,
      isVoucherNeedPayment,
      reservationOTPPaymentURL,
      reservationTrueWalletUrl,
      reservationRealtimeDB,
    };
  },
  data() {
    return {
      deliveryMethodKeyId: nanoid(3),
      acceptTC: true,
      isLoading: false,
      isLoadingLockingSystem: false,
      isShowProcessingBookingModal: false,
      reservation: "",
      encryptedId: "",
      originalId: "",
      trueWalletURL: "",
    };
  },
  computed: {
    ...mapGetters("webConfig", ["isUsingAsyncBooking"]),
    ...mapState("restaurant", [
      "restaurantId",
      "restaurantName",
      "restaurantCanonicalLink",
    ]),
    ...mapState("user", [
      "name",
      "email",
      "phone",
      "phoneCode",
      "id",
      "accessToken",
    ]),
    ...mapState("booking", [
      "adult",
      "kids",
      "selectedDate",
      "selectedTime",
      "bookingMethod",
      "paymentMethod",
      "distanceToRestaurant",
      "packagePreference",
      "bookingExpiryDate",
      "specialRequest",
    ]),
    ...mapState("bookingCharge", ["isPartialChargeSuccess"]),
    ...mapGetters("bookingCharge", ["isChargeFree"]),
    ...mapGetters("user", ["isUserHavePhone", "isUserSignedIn"]),
    ...mapGetters("booking", [
      "bookingSummary",
      "isDineIn",
      "canSkipSelectTime",
      "pickedLocationName",
      "isFlowSelectDateFirst",
    ]),
    ...mapGetters("bookingPackage", [
      "getSelectedPackage",
      "isPackageRequireCC",
      "getSelectedPackageTnC",
      "getSelectedPackageChargePolicy",
      "getSelectedPackageChargePolicyImage",
      "anySelectedPackages",
      "isSelectedPackageAcceptTravelTogether",
    ]),
    ...mapGetters("restaurant", ["restaurantRecordGuest"]),
    ...mapFields("booking", ["acceptWeTravelTogether"]),
    travelTogetherConfig() {
      return {
        icon: this.$store.state.webConfig.config.weTravelTogetherIconUrl || "",
        link: this.$store.state.webConfig.config.wttLinkUrl || "",
      };
    },
    bookNowButtonText() {
      if (this.isLoading) {
        return this.isDineIn
          ? `${this.$t("processYourBooking")}`
          : `${this.$t("processingYourOrder")}`;
      }
      if (
        this.isPackageRequireCC &&
        isValidCorporateEvent.value === false &&
        this.isChargeFree === false
      ) {
        return `${this.$t("payNow")}`;
      }
      if (this.isDineIn) {
        return `${this.$t("booknow")}`;
      }
      return this.$t("orderNow");
    },
    bookButtonHelperText() {
      if (isValidCorporateEvent.value) {
        return "";
      }
      if (this.isPackageRequireCC) {
        return this.$t("readTermAndCondition");
      }
      if (this.packagePreference.includes(PACKAGE_PREFERENCE_XPERIENCE)) {
        return this.$t("payAtHotelFreeCancelation");
      }
      return "";
    },
    bookNowButtonStyle() {
      const style = [];
      if (!this.forceMobileVersion) {
        style.push("lg:w-6/12 lg:my-6 lg:h-12");
      }
      this.enableCreateBooking === false
        ? style.push("bg-gray-light cursor-not-allowed")
        : style.push("bg-red-dark cursor-pointer");
      return style;
    },
    isNeedRecordGuest() {
      if (this.restaurantRecordGuest && this.isDineIn) {
        return true;
      }
      return false;
    },
    isShowPaymentForm() {
      if (isValidCorporateEvent.value) {
        return false;
      }
      if (this.isChargeFree) {
        return false;
      }
      if (this.isPackageRequireCC || this.isVoucherNeedPayment) {
        return true;
      }
      return false;
    },
    isUsingTrueWalletPayment() {
      return this.paymentMethod === PAYMENT_TRUEWALLET;
    },
    summaryText() {
      const adult = `${this.$tc("numberOfAdult", this.bookingSummary.adult, {
        adult: this.bookingSummary.adult,
      })}`;
      const kids = `${
        this.bookingSummary.kids > 0
          ? ` ${this.$tc("numberOfKids", this.bookingSummary.kids, {
              kids: this.bookingSummary.kids,
            })}`
          : ""
      }
          `;
      const packageName = `${
        this.bookingSummary.packageName
          ? " | " + this.bookingSummary.packageName
          : ""
      }`;
      return ` ${adult} ${kids} ${packageName}`;
    },
    enableCreateBooking() {
      const userValidation = () => {
        const name = this.name.length > 0 ? true : false;
        const email = this.email.length > 0 ? true : false;
        if (name && email && this.isUserHavePhone) {
          return true;
        }
        return false;
      };
      const bookingMethodValidation = () => {
        if (
          this.isDineIn === false &&
          this.bookingMethod != DELIVERY &&
          this.bookingMethod != PICK_UP
        ) {
          return false;
        }
        return true;
      };
      const paymentValidation = () => {
        if (isValidCorporateEvent.value || this.isChargeFree) {
          return true;
        }

        if (this.isPackageRequireCC || this.voucherPaymentType.ccPayment) {
          if (this.paymentMethod.length > 0) {
            if (this.paymentMethod === PAYMENT_CREDIT_CARD) {
              const creditCard = this.$store.state.booking.creditCard;
              const name = creditCard.name.length > 0 ? true : false;
              const number = creditCard.number.length > 0 ? true : false;
              const exp =
                !creditCard.expMonthYear.includes("M") ||
                !creditCard.expMonthYear.includes("Y")
                  ? true
                  : false;
              const cvv = creditCard.securityCode.length > 0 ? true : false;
              if (name && number && exp && cvv) {
                return true;
              }
              return false;
            }
            return true;
          }
          return false;
        }
        return true;
      };
      const acceptTerm = this.acceptTC;
      if (
        userValidation() &&
        bookingMethodValidation() &&
        paymentValidation() &&
        this.isLoading === false &&
        this.anySelectedPackages === true &&
        acceptTerm
      ) {
        return true;
      }
      return false;
    },
    sectionsNumberOrder() {
      let recordGuestOrder;
      let deliveryMethodOrder;
      let paymentMethodOrder;
      if (this.isNeedRecordGuest) {
        recordGuestOrder = 2;
        if (this.isDineIn) {
          deliveryMethodOrder = 0;
          paymentMethodOrder = 3;
        } else {
          deliveryMethodOrder = 3;
          paymentMethodOrder = 4;
        }
      } else {
        recordGuestOrder = 0;
        if (this.isDineIn) {
          deliveryMethodOrder = 0;
          paymentMethodOrder = 2;
        } else {
          deliveryMethodOrder = 2;
          paymentMethodOrder = 3;
        }
      }
      return {
        userInfoOrder: 1,
        recordGuestOrder: recordGuestOrder,
        deliveryMethodOrder: deliveryMethodOrder,
        paymentMethodOrder: paymentMethodOrder,
      };
    },
    countDown() {
      if (this.bookingExpiryDate) {
        return this.$dayjs(this.bookingExpiryDate).utc().toISOString();
      }
      return false;
    },
  },
  watch: {
    bookingMethod: {
      handler() {
        bookingMethodChangeCallback = setTimeout(() => {
          this.chargeBooking();
        }, 500);
      },
      immediate: true,
    },
    reservationRealtimeDB: {
      handler(val) {
        if (val) {
          const { authorizationUrl, status, reservationId, trueWalletUrl } =
            humps.camelizeKeys(val);
          if (reservationId) {
            this.originalId = reservationId;
          }
          if (trueWalletUrl) {
            this.trueWalletURL = trueWalletUrl;
          }
          if (
            typeof authorizationUrl === "string" &&
            authorizationUrl.length &&
            status === RESERVATION_WAITING_FOR_PAYMENT
          ) {
            this.redirectToPaymentOTP(this.reservationOTPPaymentURL);
            return;
          }
          if (
            status === RESERVATION_WAITING_FOR_PAYMENT &&
            this.isUsingTrueWalletPayment
          ) {
            this.showTrueWalletModal();
            return;
          }
          if (
            status === RESERVATION_PENDING_ARRIVAL ||
            status === RESERVATION_WAITING_FOR_PAYMENT
          ) {
            this.bookingSuccessCallback(
              this.isUserSignedIn ? this.originalId : this.encryptedId
            );
          }
        }
      },
    },
  },
  beforeDestroy() {
    window.clearTimeout(bookingMethodChangeCallback);
    this.resetVoucherState();
  },
  mounted() {
    this.checkIsBackFromQrPayment();
    this.chargeBooking();
    if (isValidCorporateEvent.value === false) {
      // disable peniding booking
      // createPendingBooking();
    }
    if (this.isSelectedPackageAcceptTravelTogether) {
      this.acceptWeTravelTogether = false;
    }
    this.trackBeginCheckout();
  },
  methods: {
    onPhoneConfirmed() {
      saveConfirmPhone(this.id, this.phone, this.pickedLocationName);
      setTimeout(() => {
        this.createBooking();
      }, 300);
    },
    onPhoneUpdated() {
      saveConfirmPhone(this.id, this.phone, this.pickedLocationName);
    },
    async bookingValidation() {
      this.phoneConfirmValidation();
      const formValidationSuccess = await this.$refs.bookingForm.validate();

      if (!formValidationSuccess) {
        this.$alert.error(this.$t("pleaseFillAllRequired"));
        return false;
      } else if (!isLeadingZero(this.phone) && !this.isUserSignedIn) {
        this.$alert.error(this.$t("leadingZeroPhone"));
        return false;
      } else if (
        !this.isDineIn &&
        this.bookingMethod === DELIVERY &&
        !this.isPhoneConfirmed
      ) {
        this.$modal.show("check-phone-modal");
        return false;
      } else if (
        this.isDineIn === false &&
        this.bookingMethod === DELIVERY &&
        this.distanceToRestaurant?.success == false
      ) {
        this.$alert.error(this.$t("pleaseEnterDeliveryAddress"));
        return false;
      } else if (
        this.selectedDate == false ||
        this.$dayjs(this.selectedDate).isValid() == false
      ) {
        this.$alert.error(this.$t("pleaseChooseAnotherDate"));
        return false;
      }

      if (this.acceptWeTravelTogether) {
        const trimmedSpecialRequest = this.specialRequest.trim();
        if (trimmedSpecialRequest.length < 13) {
          this.$alert.error(this.$t("specialRequestRequired"));
          return false;
        }
      }

      return true;
    },
    async createBooking() {
      try {
        const validationResult = await this.bookingValidation();
        if (validationResult) {
          this.setLoading(true);
          const result = await this.$store.dispatch("booking/doBooking");
          if (result.isSuccess === false) {
            this.setLoading(false);
            let errorMessage = result.message;
            if (result.status === 401) {
              this.$store.dispatch("user/doSignOut");
              errorMessage = ERROR_EXPIRED_TOKEN;
            }
            setTimeout(() => {
              this.$alert.error(errorMessage);
            }, 500);
            return;
          }
          if (this.isUsingAsyncBooking) {
            return;
          }
          this.encryptedId = result.data.attributes.encryptedId;
          this.originalId = result.data.id;
          this.reservation = result.data;
          this.trueWalletURL = this.reservation?.attributes?.trueWalletUrl;
        }
      } catch (err) {
        this.setLoading(false);
        const error = {
          message: "Oops, Something Went Wrong, Failed To Create Booking",
          cause: err,
          data: err,
        };
        this.$rollbar.error(error.message, err, error);
      }
    },
    bookingSuccessCallback(encryptedId) {
      if (!encryptedId) {
        throw new Error("Invalid encryptedId", {
          reservation: this.reservation,
        });
      }
      // deleteLocalPendingBooking();
      // toggleIsPendingBooking(false);
      // track event
      this.track();
      this.keepStoredState();
      if (this.paymentMethod !== PAYMENT_PROMPTPAY) {
        const messageSuccess = this.$t("bookingConfirmed");
        this.$alert.success(messageSuccess);
      }
      this.setLoading(false);
      setTimeout(() => {
        this.redirectToLandingPage(encryptedId);
      }, 200);
    },
    chargeBooking() {
      calculateCharge();
    },
    showTrueWalletModal() {
      this.isShowProcessingBookingModal = false;
      this.$modal.show("true-wallet-payment-modal");
    },
    phoneConfirmValidation() {
      setCompareData(
        this.isUserSignedIn,
        this.id,
        this.phone,
        this.pickedLocationName
      );
      checkIsConfirmed();
    },
    reRenderDeliveryMethod() {
      this.deliveryMethodKeyId = nanoid(3);
    },
    track() {
      this.$track("BOOKING_STEP_PACKAGE_QUANTITY", {
        restaurantId: this.restaurantId,
        restaurantName: this.$store.getters["restaurant/restaurantNameEn"],
        restaurantCanonicalLink: this.restaurantCanonicalLink,
        bookingAdult: this.adult,
        bookingKids: this.kids,
        bookingDate: this.$dayjs(this.selectedDate).format("YYYY-MM-DD"),
        bookingTime: this.selectedTime,
        packageId: this.getSelectedPackage
          .map((packages) => packages.id)
          .join(","),
        packageQuantity: this.getSelectedPackage
          .map((packages) => packages.quantity)
          .join(","),
      });
    },
    trackBeginCheckout() {
      let packageQuantity = [];
      let packageID = [];
      let packageType = [];
      let packageName = [];
      let packagePrice = [];
      this.getSelectedPackage.forEach((pack) => {
        packageName.push(pack.name);
        packageQuantity.push(pack.quantity);
        packageID.push(pack.id);
        packageType.push(pack.typeCode);
        packagePrice.push(pack.selectedPrice);
      });
      const voucherName = this.voucherApplied
        .map((voucher) => voucher.name)
        .join(",");
      const payload = {
        bookingVoucher: voucherName,
        packageId: packageID.join(","),
        packageQuantity: packageQuantity.join(","),
        packageName: packageName.join(","),
        packagePrice: packagePrice.join(","),
        packageType: packageType.join(","),
        restaurantId: this.restaurantId,
        restaurantName: this.$store.getters["restaurant/restaurantNameEn"],
        restaurantCanonicalLink: this.restaurantCanonicalLink,
      };
      this.$track("BOOKING_STEP_BEGIN_CHECKOUT", payload);
    },
    back() {
      if (isValidCorporateEvent.value) {
        this.$store.dispatch("booking/changeStep", 1);
      } else if (this.canSkipSelectTime) {
        this.$store.dispatch("booking/changeStep", 2);
      } else if (this.isFlowSelectDateFirst === false) {
        this.$store.dispatch("booking/changeStep", 3);
      } else {
        this.$store.dispatch("booking/changeStep", "back");
      }
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
          encryptedId: encryptedId,
        },
        query: {
          locale: this.$store.state.lang,
        },
      });
    },
    keepStoredState() {
      if (this.paymentMethod === PAYMENT_PROMPTPAY) {
        if (this.$store.hasModule("booking")) {
          this.$store.commit("booking/setState", {
            state: "keepState",
            val: true,
          });
        }
        if (this.$store.hasModule("bookingPackage")) {
          this.$store.commit("bookingPackage/setState", {
            state: "keepState",
            val: true,
          });
        }
        if (this.$store.hasModule("restaurant")) {
          this.$store.commit("restaurant/setState", {
            state: "keepState",
            val: true,
          });
        }
        if (this.$store.hasModule("restaurantReview")) {
          this.$store.commit("restaurantReview/setState", {
            state: "keepState",
            val: true,
          });
        }
        if (this.$store.hasModule("bookingDateTime")) {
          this.$store.commit("bookingDateTime/setState", {
            state: "keepState",
            val: true,
          });
        }
      }
    },
    setLoading(isLoading = false) {
      this.isLoading = isLoading;
      if (this.isUsingAsyncBooking) {
        this.isShowProcessingBookingModal = isLoading;
        return;
      }
    },
    onBookingTimeOut() {
      if (this.isMobile) {
        this.$router.push({
          name: ROUTE_RESTAURANT_PAGE,
        });
        return;
      }
      window.location.reload();
    },
    async onExtendBookingTimeOut() {
      this.isLoadingLockingSystem = true;
      await this.$store.dispatch("booking/createBookingLocking");
      this.isLoadingLockingSystem = false;
    },
    checkIsBackFromQrPayment() {
      const key = "is_cancel_qr_payment";
      const isBackFromQrLanding = getFromUserStorage(key);
      if (isBackFromQrLanding) {
        this.$store.dispatch("booking/createBookingLocking", true);
        removeFromUserStorage(key);
      }
    },
    redirectToPaymentOTP(url = "") {
      if (typeof url == "string" && url.length > 0) {
        window.location.href = url;
        return;
      }
      this.$rollbar.error("Failed redirect to OTP page", { url });
      this.$alert.error("Oops, something went wrong, failed open OTP page");
    },
    onAsyncReservationSuccess({ originalId, encryptedId }) {
      this.originalId = originalId;
      this.encryptedId = encryptedId;
      this.isShowProcessingBookingModal = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.create-booking-wrapper {
  @apply sticky bottom-0;
  z-index: 11;
}
@screen lg {
  .create-booking-wrapper {
    @apply static bottom-auto;
  }
}
.separator {
  height: 1px;
  background: #ceced2;
}
</style>
<i18n>
{
  "en": {
    "personalDetails": "Personal Details",
    "agreementNonFedundable": "I agree that my order is non-refundable and not changeable.",
    "booknow": "Book Now",
    "bookingConfirmed": "Your Booking Confirmed",
    "orderConfirmed": "Your Order Confirmed",
    "pleaseFillAllRequired": "Please specify your ID card number and mobile phone number",
    "pleaseEnterDeliveryAddress": "Please enter delivery address to calculate the delivery fee",
    "pleaseChooseAnotherDate": "Date unavailable, please choose another date",
    "travelTogetherAgreement": "We would like to use <a href={link} target='_blank' class='underline text-red-dark'>We Travel Together</a>",
    "travelTogetherDesc": "<span class='text-red-dark'>Please specify your ID card number and mobile phone number</span> used to register We Travel Together into the <span class='font-bold'>Special Request</span> field",
    "specialRequestRequired" : "Please specify your ID card number and mobile phone number"
  },
  "th": {
    "personalDetails": "ข้อมูลส่วนตัว",
    "agreementNonFedundable": "ฉันยอมรับว่าคำสั่งซื้อของฉันไม่สามารถคืนเงินได้และไม่สามารถเปลี่ยนแปลงได้",
    "booknow": "จองตอนนี้",
    "bookingConfirmed": "การจองของคุณสำเร็จแล้ว",
    "orderConfirmed": "คำสั่งซื้อของคุณสำเร็จแล้ว",
    "pleaseFillAllRequired": "โปรดระบุเลขบัตรประชาชน และเบอร์มือถือ",
    "pleaseEnterDeliveryAddress": "กรุณากรอกที่อยู่จัดส่งเพื่อคำนวณค่าจัดส่ง",
    "pleaseChooseAnotherDate": "วันที่คุณเลือกไม่พร้อมใช้งาน โปรดเลือกวันอื่น",
    "travelTogetherAgreement": "ต้องการใช้ <a href={link} target='_blank' class='underline text-red-dark'>เราเที่ยวด้วยกัน</a>",
    "travelTogetherDesc": "<span class='text-red-dark'>โปรดระบุเลขบัตรประชาชน และเบอร์มือถือ</span> ที่ใช้ลงทะเบียนโครงการฯ ของผู้ใช้สิทธิ์ลงในช่อง <span class='font-bold'>คำขอพิเศษ (Special Request)</span>",
    "specialRequestRequired" : "โปรดระบุเลขบัตรประชาชน และเบอร์มือถือ"
  }
}
</i18n>
