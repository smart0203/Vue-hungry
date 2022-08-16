<template>
  <div class="flex items-center justify-center h-screen">
    <div
      v-if="isLoading"
      class="flex items-center justify-center mt-24 lg:mt-0"
    >
      <div id="landing-loader" class="loader"></div>
      <div class="ml-4 text-xl font-bold capitalize">
        {{ $t("pleaseWait") }}
      </div>
    </div>

    <div v-else class="text-center">
      <img
        src="@/assets/icon-check-red-extra-big.png"
        alt="icon check"
        loading="lazy"
        class="mx-auto mb-4"
      />
      <div>
        <h1 class="text-xl font-bold">Payment Confirmed</h1>
        <p>You have succesfully completed</p>
        <p>your payment procedure</p>
        <hr class="my-4" />
        <div class="flex items-center justify-center mb-2">
          <span>Transaction ID</span>
          <span class="mx-1">:</span>
          <span class="font-bold text-red-dark">{{
            originalReservationId
          }}</span>
        </div>
        <div class="flex items-center justify-center">
          <span>Amount</span>
          <span class="mx-1">:</span>
          <span class="font-bold text-red-dark">{{
            $money(totalChargePrice)
          }}</span>
        </div>

        <button class="mt-8 text-blue-500" @click="reload">
          Click here to redirect manually
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { getDetailReservation } from "@/services/reservation";
import {
  ROUTE_NOT_FOUND,
  RESERVATION_PENDING_ARRIVAL,
  ROUTE_BOOKING_LANDING_PAGE,
  ROUTE_VOUCHER_LANDING_PAGE,
  RESERVATION_PAID,
} from "@/lib/constant";
import isEmpty from "lodash-es/isEmpty";
import { convertToNumber } from "@/helper/stringHelper";
import {
  reservationRealtimeDB,
  initReservationRealtimeDB,
} from "@/composable/watchReservationStatus";
import useQueryString from "@/composable/useQueryString";
import { getVoucherTransaction } from "@/services/voucherTransaction";

const defaultErrorMessage =
  "Oops, something went wrong, failed get your payment detail";
export default {
  name: "PaymentSuccessPage",
  props: {
    encryptedReservationId: {
      type: String,
      required: true,
    },
  },
  setup() {
    const { parsedQueryString } = useQueryString();
    const { type } = parsedQueryString;
    return {
      reservationRealtimeDB,
      type,
    };
  },
  data() {
    return {
      isLoading: false,
      reservationIdLandingPage: "",
      totalChargePrice: 0,
      originalReservationId: "",
    };
  },
  computed: {
    isVoucher() {
      return typeof this.type === "string" && this.type === "voucher";
    },
  },
  watch: {
    reservationRealtimeDB(newVal) {
      if (newVal) {
        const { status } = newVal;
        if ([RESERVATION_PENDING_ARRIVAL, RESERVATION_PAID].includes(status)) {
          this.redirectToLandingPage(this.encryptedReservationId);
        }
      }
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      if (this.isVoucher) {
        this.getVoucher();
        return;
      }
      this.getReservation();
    },
    async getVoucher() {
      this.isLoading = true;
      const { isSuccess, message, data, error } = await getVoucherTransaction(
        this.encryptedReservationId
      );

      if (!isSuccess || isEmpty(data)) {
        const errorMessage = message || error.message || defaultErrorMessage;
        this.$alert.error(message || error.message || defaultErrorMessage);
        if (error.shouldReport) {
          this.$rollbar.error(errorMessage, { data, message });
        }
        this.$router.replace({ name: ROUTE_NOT_FOUND });
        return;
      }

      const { attributes, id: originalReservationId } = data.data;
      const { statusAsSymbol, encryptedId, totalPrice } = attributes;
      this.originalReservationId = originalReservationId;
      this.totalChargePrice = convertToNumber(totalPrice);
      this.isLoading = false;
      initReservationRealtimeDB(this.originalReservationId);
      if (statusAsSymbol === RESERVATION_PENDING_ARRIVAL) {
        this.reservationIdLandingPage = this.$store.getters[
          "user/isUserSignedIn"
        ]
          ? originalReservationId
          : encryptedId;
        this.redirectToLandingPage(this.reservationIdLandingPage);
      }
    },
    async getReservation() {
      try {
        this.isLoading = true;
        const { isSuccess, message, data, error } = await getDetailReservation(
          this.encryptedReservationId
        );
        if (!isSuccess || isEmpty(data)) {
          const errorMessage = message || error.message || defaultErrorMessage;
          this.$alert.error(message || error.message || defaultErrorMessage);
          if (error.shouldReport) {
            this.$rollbar.error(errorMessage, { data, message });
          }
          this.$router.replace({ name: ROUTE_NOT_FOUND });
          return;
        }
        const { attributes, id: originalReservationId } = data.data;
        const { statusAsSymbol, deliveryFee, encryptedId, chargePrice } =
          attributes;
        this.originalReservationId = originalReservationId;
        this.totalChargePrice =
          convertToNumber(deliveryFee.amount) + convertToNumber(chargePrice);
        this.isLoading = false;
        initReservationRealtimeDB(this.originalReservationId);
        if (statusAsSymbol === RESERVATION_PENDING_ARRIVAL) {
          this.reservationIdLandingPage = this.$store.getters[
            "user/isUserSignedIn"
          ]
            ? originalReservationId
            : encryptedId;
          this.redirectToLandingPage(this.reservationIdLandingPage);
        }
      } catch (err) {
        this.$rollbar.error(defaultErrorMessage, err, {
          reservationId: this.encryptedReservationId,
        });
      }
    },
    redirectToLandingPage(reservationId) {
      const routeName = this.isVoucher
        ? ROUTE_VOUCHER_LANDING_PAGE
        : ROUTE_BOOKING_LANDING_PAGE;
      this.$router.push({
        name: routeName,
        params: {
          encryptedId: reservationId,
        },
        query: {
          locale: this.$store.state.lang,
        },
      });
    },
    reload() {
      window.location.reload();
    },
  },
};
</script>
