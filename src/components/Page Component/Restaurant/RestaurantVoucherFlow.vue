<template>
  <div class="">
    <template v-if="isDesktop">
      <div class="flex items-center pt-6 pb-4">
        <div class="mx-2">
          <div class="relative cart">
            <img
              :src="whiteOrderIcon"
              width="40px"
              loading="lazy"
              class="ml-4 mr-2"
              alt="cart icon"
            />
          </div>
        </div>
        <h4 class="flex-auto m-0 ml-1 text-xl font-black capitalize">
          {{ $t("buyGiftCard") }}
        </h4>
      </div>
    </template>
    <div v-if="title" class="py-3 font-black text-center border-b border-3">
      {{ title }}
    </div>
    <StepperHeader :steps="steps"> </StepperHeader>
    <div class="flex flex-col justify-between mt-5 stepper-body tiny-scroll">
      <div v-if="activeStep === 1" class="px-4">
        <CustomVoucherSection
          :default-voucher-tnc="customVoucherTermCondition"
          :detault-voucher-detail="customVoucherDetail"
          :pre-select-custom-vouchers="preSelectCustomVouchers"
          @on-voucher-removed="onCustomVoucherRemoved"
        />

        <RestaurantVoucherModal
          :is-show="detailVoucherModal.isShow"
          :name="detailVoucherModal.data.name"
          :description="detailVoucherModal.data.desc"
          :price="detailVoucherModal.data.price"
          :tnc="detailVoucherModal.data.tnc"
          @on-closed="detailVoucherModal.isShow = false"
        />
        <RemoveVoucherModal
          :is-show="isShowRemoveVoucherModal"
          @on-confirmed="onConfirmRemoveVoucherModal"
          @on-closed="onCloseRemoveVoucherModal"
        />
      </div>

      <template v-else-if="activeStep === 2">
        <div class="">
          <BookingUserInfo
            :is-show-special-request="false"
            class="mb-4"
            :force-mobile-version="true"
          />
          <SummaryCharge class="mb-4" />
          <PaymentMethod class="mb-4" />
          <div class="mb-3 text-xs text-gray-700">
            <div
              class="mb-3 text-red-dark"
              style="margin-left: 47px; margin-right: 30px"
              v-html="$t('voucherRequestTax')"
            ></div>
            <div
              class="flex items-center w-10/12 mx-auto leading-none lg:leading-none"
            >
              <input
                v-model="acceptTC"
                type="checkbox"
                class="rounded-full red-checkbox round-checkbox big-checkbox"
              />
              <div class="ml-1">
                <div v-html="$t('bookingAgreement', { link: '' })"></div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div class="sticky bottom-0 py-2 mt-4 bg-white border-t">
        <!-- total amount -->
        <div v-if="isShowTotal">
          <div class="flex items-center justify-center mx-2 my-3">
            <span
              class="flex items-center justify-center w-5 h-5 mr-2 text-xs capitalize border rounded border-red-dark text-red-dark"
              >{{ grandTotalQuantity }}</span
            >
            <span class="capitalize">{{ $t("totalAmount") }}:</span>
            <span
              class="flex-grow text-lg font-bold text-right text-red-dark"
              >{{ $money(grandTotalAmount) }}</span
            >
          </div>
        </div>
        <div class="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="currentColor"
            class="mx-4 cursor-pointer icon-chevron-left text-red-dark hover:text-red-light"
            viewBox="0 0 16 16"
            @click="$emit('on-back-clicked')"
          >
            <path
              fill-rule="evenodd"
              d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
            />
          </svg>
          <button
            class="w-3/4 py-2 text-base font-black text-white capitalize rounded-full"
            :class="
              !enableConfirmButton
                ? 'bg-gray-light cursor-not-allowed'
                : 'bg-red-dark hover:bg-red-light cursor-pointer active:bg-red-light'
            "
            :disabled="!enableConfirmButton"
            @click="confirmButtonClickHandler"
          >
            {{ confirmButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  totalQuantityCustomVouchers,
  totalAmountCustomVouchers,
  selectedCustomVouchers,
  resetCustomVouchers,
} from "@/components/Page Component/restaurant_voucher/customVouchers";
import {
  totalAmountRestaurantVouchers,
  totalQuantityRestaurantVouchers,
  selectedRestaurantVouchers,
  setupRestaurantVouchers,
  resetRestaurantVouchers,
} from "@/components/Page Component/restaurant_voucher/restaurantVouchers";
import {
  grandTotalAmount,
  grandTotalQuantity,
} from "@/components/Page Component/restaurant_voucher/voucherFlow";
import {
  onCloseRemoveVoucherModal,
  onConfirmRemoveVoucherModal,
  toggleDetailModal,
  toggleRemoveVoucherModal,
  isShowRemoveVoucherModal,
  detailVoucherModal,
} from "@/components/Page Component/restaurant_voucher/modal";
import iconTicketRed from "@/assets/icon-ticket-red.png";
import iconPaymentBlack from "@/assets/icon-payment-black.png";
import iconPaymentRed from "@/assets/icon-payment-red.png";
import whiteOrderIcon from "@/assets/icon-order-white.png";
import { ref, computed, reactive } from "@vue/composition-api";
import { buyVoucher } from "@/services/voucherTransaction";
import { removeLeadingZero } from "@/helper/phoneNumber";
import {
  BOOKING_PAYMENT_METHOD_CREDIT_CARD,
  ROUTE_VOUCHER_LANDING_PAGE,
  ROUTE_VOUCHER_QR_PAYMENT_LANDING_PAGE,
  PAYMENT_CREDIT_CARD,
  HUNGRY_HUB_VOUCHER,
  PAYMENT_PROVIDER_OMISE,
  RESERVATION_PENDING_ARRIVAL,
  RESERVATION_WAITING_FOR_PAYMENT,
} from "@/lib/constant";
import createOmiseToken from "@/lib/booking/omise";
import createGbPrimePayToken from "@/lib/booking/gbPrimePay";
import {
  isLoadingGetIntroData,
  customVoucherTermCondition,
  customVoucherDetail,
  getVoucherIntroData,
} from "@/components/Page Component/restaurant_voucher/voucherFlow";
import isNil from "lodash-es/isNil";
import omitBy from "lodash-es/omitBy";
import { i18n } from "@/lib/i18n/i18n";
import realtimeReservation from "@/composable/realtimeReservation";
import useLazyImport from "@/composable/useLazyImport";

const {
  reservationRealtimeDB,
  initReservationRealtimeDB,
  deleteReservationRealtimeDBListener,
} = realtimeReservation("watch-voucher");
let self;
export default {
  name: "RestaurantVoucherFlow",
  components: {
    CustomVoucherSection: () =>
      useLazyImport(() =>
        import(
          "@/components/Page Component/restaurant_voucher/CustomVoucherSection.vue"
        )
      ),
    StepperHeader: () =>
      useLazyImport(() =>
        import("@/components/Shared/stepper/StepperHeader.vue")
      ),
    RestaurantVoucherModal: () =>
      useLazyImport(() =>
        import("@/components/Shared/voucher_flow/RestaurantVoucherModal.vue")
      ),
    RemoveVoucherModal: () =>
      useLazyImport(() =>
        import("@/components/Shared/voucher_flow/RemoveVoucherModal.vue")
      ),
    BookingUserInfo: () =>
      useLazyImport(() => import("@/components/Booking/BookingUserInfo.vue")),
    PaymentMethod: () =>
      useLazyImport(() =>
        import(
          "@/components/Page Component/restaurant_voucher/PaymentMethod.vue"
        )
      ),
    SummaryCharge: () =>
      useLazyImport(() =>
        import(
          "@/components/Page Component/restaurant_voucher/SummaryCharge.vue"
        )
      ),
  },
  props: {
    preSelectCustomVouchers: {
      type: Array,
      default() {
        return [];
      },
      required: false,
    },
    preSelectRestaurantVouchers: {
      type: Array,
      default() {
        return [];
      },
      required: false,
    },
    title: {
      type: String,
      default: "",
    },
    isShowRestaurantPackage: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    // --- common ---
    const activeStep = ref(1);
    const acceptTC = ref(false);
    const steps = reactive([
      reactive({
        name: i18n.t("giftCard"),
        icon: iconTicketRed,
        iconActive: iconTicketRed,
        isActive: computed(() => {
          return activeStep.value === 1;
        }),
        isPassed: computed(() => {
          return activeStep.value >= 1;
        }),
        onIconClick: () => {
          activeStep.value = 1;
        },
      }),
      reactive({
        name: i18n.t("payment"),
        icon: iconPaymentBlack,
        iconActive: iconPaymentRed,
        isActive: computed(() => {
          return activeStep.value === 2;
        }),
        isPassed: computed(() => {
          return activeStep.value >= 2;
        }),
        onIconClick: () => {
          if (anySelectedVouchers.value === true) {
            activeStep.value = 2;
          }
        },
      }),
    ]);
    const isShowTotal = computed(() => {
      if (
        grandTotalAmount.value > 0 &&
        grandTotalQuantity.value > 0 &&
        activeStep.value === 1
      ) {
        return true;
      }
      return false;
    });
    const anySelectedVouchers = computed(() => {
      return (
        selectedCustomVouchers.value.length > 0 ||
        selectedRestaurantVouchers.value.length > 0
      );
    });
    const isLoadingConfirmButton = ref(false);
    const enableConfirmButton = computed(() => {
      const store = self.$store;
      if (!anySelectedVouchers.value) {
        return false;
      }
      if (activeStep.value === 2) {
        const userValidation = () => {
          const name = store.state.user.name.length > 0 ? true : false;
          const email = store.state.user.email.length > 0 ? true : false;
          const isUserHavePhone = store.getters["user/isUserHavePhone"];
          if (name && email && isUserHavePhone) {
            return true;
          }
          return false;
        };
        const paymentValidation = () => {
          const paymentMethod = store.state.booking.paymentMethod;
          if (paymentMethod.length > 0) {
            if (paymentMethod === PAYMENT_CREDIT_CARD) {
              const creditCard = store.state.booking.creditCard;
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
        };
        if (
          userValidation() &&
          paymentValidation() &&
          acceptTC.value &&
          !isLoadingConfirmButton.value
        ) {
          return true;
        }
        return false;
      }
      return true;
    });
    const originalId = ref("");
    const encryptedId = ref("");
    const restaurantName = ref("");
    const bookingTextStatus = ref("");
    return {
      // common
      setupRestaurantVouchers,
      acceptTC,
      steps,
      activeStep,
      enableConfirmButton,
      isLoadingConfirmButton,
      grandTotalAmount,
      grandTotalQuantity,
      isShowTotal,
      anySelectedVouchers,
      totalQuantityCustomVouchers,
      totalQuantityRestaurantVouchers,
      totalAmountCustomVouchers,
      totalAmountRestaurantVouchers,
      selectedRestaurantVouchers,
      selectedCustomVouchers,
      isLoadingGetIntroData,
      customVoucherTermCondition,
      customVoucherDetail,
      reservationRealtimeDB,
      initReservationRealtimeDB,
      deleteReservationRealtimeDBListener,
      originalId,
      encryptedId,
      restaurantName,
      bookingTextStatus,
      // -- detail modal ---
      detailVoucherModal,
      toggleDetailModal,
      // --- remove voucher modal ---
      isShowRemoveVoucherModal,
      onConfirmRemoveVoucherModal,
      onCloseRemoveVoucherModal,
      toggleRemoveVoucherModal,
    };
  },
  data() {
    return {
      whiteOrderIcon,
    };
  },
  computed: {
    confirmButtonText() {
      if (this.activeStep === 1) {
        return this.$t("next");
      }
      if (this.isLoadingConfirmButton) {
        return this.$t("pleaseWait");
      }
      return this.$t("confirmAndPay");
    },
  },
  watch: {
    reservationRealtimeDB: {
      handler(val) {
        if (val) {
          const { authorization_url, status } = val;
          if (
            typeof authorization_url === "string" &&
            authorization_url.length &&
            status === RESERVATION_WAITING_FOR_PAYMENT
          ) {
            this.redirectToPaymentOTP(authorization_url);
            return;
          }
          if (
            status === RESERVATION_PENDING_ARRIVAL ||
            status === RESERVATION_WAITING_FOR_PAYMENT
          ) {
            this.$alert.success(this.bookingTextStatus);
            setTimeout(() => {
              this.redirectToLandingPage(this.restaurantName, this.encryptedId);
            }, 200);
            this.deleteReservationRealtimeDBListener();
            this.isLoadingConfirmButton = false;
          }
        }
      },
    },
  },
  created() {
    self = this;
  },
  mounted() {
    this.resetBookingStore();
    setupRestaurantVouchers();
    getVoucherIntroData();
  },
  beforeDestroy() {
    resetCustomVouchers();
    resetRestaurantVouchers();
  },
  methods: {
    onCustomVoucherRemoved() {
      this.$emit("on-custom-voucher-removed");
    },
    confirmButtonClickHandler() {
      if (this.activeStep === 1) {
        this.$emit("on-confirm-clicked");
        this.activeStep = 2;
      } else {
        this.submitBuyVoucher();
      }
    },
    composeCreditCard() {
      const bookingState = this.$store.state.booking;
      const splitExpMonthYear = bookingState.creditCard.expMonthYear.split("/");
      const card = {
        name: bookingState.creditCard.name,
        number: bookingState.creditCard.number,
        expirationMonth: splitExpMonthYear[0],
        expirationYear: splitExpMonthYear[1],
        securityCode: bookingState.creditCard.securityCode,
      };
      return card;
    },
    async generateOmiseToken() {
      try {
        const card = this.composeCreditCard();
        const token = await createOmiseToken(card);
        return token;
      } catch (err) {
        const errorMessage =
          err?.message ||
          "Oops, something went wrong while checking your credit card ";
        this.$rollbar.error(errorMessage, err);
        this.$alert.error(errorMessage);
        return false;
      }
    },
    async generateGbPrimePayCard() {
      try {
        const gbPrimePayAuthKey =
          this.$store.state.restaurant?.restaurantData?.gbPrimepayPublicKey ||
          this.$store.state.webConfig.config.gbPrimepayPublicKey;
        const card = this.composeCreditCard();
        const response = await createGbPrimePayToken(
          {
            name: card.name,
            number: card.number,
            expirationMonth: card.expirationMonth,
            expirationYear: card.expirationYear,
            securityCode: card.securityCode,
          },
          gbPrimePayAuthKey
        );
        if (response.isSuccess) {
          const creditCard = response.card;
          return creditCard;
        }
        const message =
          response.message ||
          "Oops, something went wrong while checking your credit card ";
        this.$alert.error(message);
        this.$rollbar.error(message, response.data);
        return false;
      } catch (err) {
        const errorMessage =
          err?.message ||
          "Oops, something went wrong while checking your credit card ";
        this.$rollbar.error(errorMessage, err);
        this.$alert.error(errorMessage);
        return false;
      }
    },
    async submitBuyVoucher() {
      const defaultErrorMessage =
        "Oops, something went wrong while processing voucher transaction";
      try {
        this.isLoadingConfirmButton = true;
        let omiseToken = null;
        let gbPrimePayCard = null;
        const creditCardProvider =
          this.$store.getters["webConfig/paymentProvider"];
        const userState = this.$store.state.user;
        const bookingState = this.$store.state.booking;
        const phone = removeLeadingZero(userState.phone);
        const phoneCode = userState.phoneCode;
        let accessToken = this.$store.getters["user/isUserSignedIn"]
          ? this.$store.getters["user/getAccessToken"]
          : null;
        let guestUser = !this.$store.getters["user/isUserSignedIn"]
          ? {
              name: userState.name,
              email: userState.email,
              phone: `${phoneCode}${phone}`,
            }
          : null;
        let getPaymentType = () => {
          const selectedPaymentType = bookingState.paymentMethod;
          if (selectedPaymentType === PAYMENT_CREDIT_CARD) {
            return BOOKING_PAYMENT_METHOD_CREDIT_CARD;
          }
          return selectedPaymentType;
        };
        if (getPaymentType() === BOOKING_PAYMENT_METHOD_CREDIT_CARD) {
          if (creditCardProvider === PAYMENT_PROVIDER_OMISE) {
            const createToken = await this.generateOmiseToken();
            if (createToken !== false) {
              omiseToken = createToken;
            } else {
              this.isLoadingConfirmButton = false;
              return;
            }
          } else {
            const createCard = await this.generateGbPrimePayCard();
            if (createCard !== false) {
              const { number, expirationMonth, expirationYear, token } =
                createCard;
              gbPrimePayCard = {
                name: this.$store.state.booking.creditCard.name,
                number: number,
                expirationMonth: expirationMonth,
                expirationYear: expirationYear,
                token: token,
              };
            } else {
              this.isLoadingConfirmButton = false;
              return;
            }
          }
        }
        let customVouchers = this.selectedCustomVouchers.map((voucher) => {
          return { amount: voucher.amount, quantity: voucher.quantity };
        });
        let restaurantVouchers = this.selectedRestaurantVouchers.map(
          (voucher) => {
            return { amount: voucher.amount, quantity: voucher.quantity };
          }
        );
        const is3DPayment =
          this.$store.state.booking.paymentMethod === PAYMENT_CREDIT_CARD;
        let finalPayload = omitBy(
          {
            accessToken,
            guestUser,
            customVouchers,
            restaurantVouchers,
            paymentType: getPaymentType(),
            omiseToken,
            creditCard: gbPrimePayCard,
            is3DPayment,
          },
          isNil
        );
        const {
          isSuccess,
          message,
          data: responseData,
        } = await buyVoucher(finalPayload);
        if (isSuccess) {
          this.restaurantName = null;
          this.encryptedId = responseData?.data?.attributes?.encryptedId || "";
          this.originalId = responseData?.data.id;
          this.bookingTextStatus = message;
          this.initReservationRealtimeDB(this.originalId, false);
          return;
        }
        this.$alert.error(message);
        this.isLoadingConfirmButton = false;
      } catch (err) {
        this.$alert.error(defaultErrorMessage);
        this.$rollbar.error(defaultErrorMessage, err);
      }
    },
    redirectToLandingPage(restaurantName, encryptedId) {
      if (!encryptedId) {
        this.$rollbar.error(
          "failed redirect to landing page, encryptedId is missing"
        );
        this.$alert.error(
          "Oops, someting went wrong, failed redirect to landing page"
        );
        return;
      }
      const parsedRestaurantName = restaurantName || HUNGRY_HUB_VOUCHER;
      const routeName =
        this.$store.state.booking.paymentMethod === PAYMENT_CREDIT_CARD
          ? ROUTE_VOUCHER_LANDING_PAGE
          : ROUTE_VOUCHER_QR_PAYMENT_LANDING_PAGE;
      this.$router.push({
        name: routeName,
        params: {
          restaurantName: parsedRestaurantName,
          encryptedId: encryptedId,
        },
        query: {
          locale: this.$store.state.lang,
        },
      });
    },
    redirectToPaymentOTP(url = "") {
      if (typeof url == "string" && url.length > 0) {
        window.location.href = url;
        return;
      }
      this.$rollbar.error("Failed redirect to OTP page", { url });
      this.$alert.error("Oops, something went wrong, failed open OTP page");
    },
    resetBookingStore() {
      if (this.$store.hasModule("booking")) {
        this.$store.commit("booking/resetAllState");
      }
      if (this.$store.hasModule("bookingDateTime")) {
        this.$store.commit("bookingDateTime/resetAllState");
      }
      if (this.$store.hasModule("bookingCharge")) {
        this.$store.commit("bookingCharge/resetState");
      }
    },
  },
  i18n: {
    messages: {
      en: {
        totalAmount: "total amount",
      },
      th: {
        totalAmount: "สรุปยอดเงินทั้งหมด",
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.stepper-body {
  min-height: calc(100vh - 150px);
  @screen lg {
    min-height: auto;
    max-height: calc(100vh - 250px);
    overflow-y: scroll;
  }
}
</style>
