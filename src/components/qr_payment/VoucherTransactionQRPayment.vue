<template>
  <QRPayment
    :id="id"
    :restaurant-name="restaurantName"
    :title="title"
    :charge-amount="chargeAmount"
    :qr-code-url="qrCodeUrl"
    :qr-count-down="qrCountDown"
    @on-timer-ended="$emit('on-timer-ended')"
    @on-cancel="$emit('on-cancel')"
  >
    <div>
      <div class="flex items-center mb-4">
        <span
          class="flex items-center justify-center w-8 h-8 text-lg text-white rounded-full bg-red-dark lg:h-10 lg:w-10 lg:text-2xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="inline icon-check-circle-fill"
            viewBox="0 0 16 16"
          >
            <path
              d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
            />
          </svg>
        </span>
        <span class="ml-2 text-lg font-extrabold capitalize lg:text-2xl">
          {{ $t("chargeSummary") }}
        </span>
      </div>

      <!-- selected package list -->
      <div
        v-for="(voucher, key) in allVouchers"
        :key="`Voucher-${key}`"
        class="flex mb-2"
      >
        <div class="flex flex-col flex-auto">
          <!-- adult price -->
          <div class="flex items-center adult-package-price">
            <div class="flex-auto text-gray-700">
              <span> {{ `${voucher.name} (x${voucher.quantity})` }} </span>
            </div>
            <div class="text-base font-black text-red-dark">
              {{ $money(voucher.amount) }}
            </div>
          </div>
        </div>
      </div>

      <div class="flex mb-3">
        <div class="flex-auto font-black capitalize">
          {{ $t("totalPrepaidAmound") }}
        </div>
        <div class="font-black text-red-dark">
          {{ $money(chargeAmount) }}
        </div>
      </div>
    </div>
  </QRPayment>
</template>

<script>
import { methods as realtimeQRMethods } from "@/composable/realtimeQRPaymentChecking";
import useLazyImport from "@/composable/useLazyImport";
export default {
  name: "VoucherTransactionQRPayment",
  components: {
    QRPayment: () =>
      useLazyImport(() => import("@/components/qr_payment/QRPayment.vue")),
  },
  props: {
    restaurantName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    id: {
      type: [String, Number],
      required: true,
    },
    chargeAmount: {
      type: [String, Number],
      required: true,
    },
    qrCodeUrl: {
      type: String,
      required: true,
    },
    qrCountDown: {
      type: Number,
      required: true,
    },
    restaurantVouchers: {
      type: Array,
      default() {
        return [];
      },
    },
    customVouchers: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  setup() {
    const {
      saveReservationId,
      saveReservationLandingURL,
      startReservationTimeOutChecker,
      startWatchQRPaymentStatus,
      saveReservationExpiredAt,
    } = realtimeQRMethods;
    return {
      saveReservationId,
      saveReservationLandingURL,
      startReservationTimeOutChecker,
      startWatchQRPaymentStatus,
      saveReservationExpiredAt,
    };
  },
  computed: {
    allVouchers() {
      return [...this.restaurantVouchers, ...this.customVouchers];
    },
  },
};
</script>
<i18n>
{
  "en": {
    "chargeSummary": "Charge summary",
    "totalPrepaidAmound": "Total Prepaid Amount"
  },
  "th": {
    "chargeSummary": "สรุปยอดเงิน",
    "totalPrepaidAmound": "จำนวนเงินที่ชำระล่วงหน้า"
  }
}
</i18n>
