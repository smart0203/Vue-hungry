<template>
  <HHPopup
    name="booking-loading"
    :is-tooltip-desktop="false"
    :modal-width="isDesktop ? 500 : '90%'"
    :is-show="isShow"
    :show-close-button="false"
    :close-on-bg-click="false"
    @on-closed="onClosed"
  >
    <div class="flex flex-col items-center justify-center py-4">
      <img src="@/assets/mr-hungry-bg-yellow.png" alt="loading image"  loading="lazy" />
      <div class="relative flex items-center justify-center">
        <h1 class="mr-1 text-2xl font-black capitalize text-red-dark">
          {{ loadingText }}
        </h1>
        <div class="absolute bottom-0" style="right: -55px">
          <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
          </div>
        </div>
      </div>

      <div v-if="subLoadingText" class="mx-4 mt-2 text-sm text-center">
        <span class="text-red-dark">*</span>
        {{ subLoadingText }}
      </div>

      <button
        v-if="isShowCancelButton"
        id="cancel-qr-payment-button"
        class="block px-4 mx-auto mt-2 text-sm font-black leading-normal uppercase border rounded-full cursor-pointer lg:mt-4 whitespace-nowrap border-red-dark text-red-dark"
        @click="$emit('on-cancel-clicked')"
      >
        {{ $t("cancel") }}
      </button>
    </div>
  </HHPopup>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import {
  initReservationRealtimeDB,
  reservationRealtimeDB,
  deleteReservationRealtimeDBListener,
} from "@/composable/watchReservationStatus";
import { PAYMENT_CREDIT_CARD, PAYMENT_PROMPTPAY } from "@/lib/constant";
import { ref } from "@vue/composition-api";
import useLazyImport from "@/composable/useLazyImport";
export default {
  components: {
    HHPopup: () => useLazyImport(() => import("@/components/Shared/HHPopup")),
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    isTrueWalletPayment: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const originalId = ref("");
    const encryptedId = ref("");
    return {
      originalId,
      encryptedId,
      reservationRealtimeDB,
      deleteReservationRealtimeDBListener,
    };
  },
  computed: {
    ...mapState("booking", ["paymentMethod", "isBigGroup"]),
    ...mapGetters("user", ["isUserSignedIn"]),
    loadingText() {
      if (this.isBigGroup) {
        return this.$i18n.t("processing");
      }
      if (this.paymentMethod === PAYMENT_CREDIT_CARD) {
        return this.$i18n.t("processingYourPayment");
      }
      if (this.paymentMethod === PAYMENT_PROMPTPAY) {
        return this.$i18n.t("processingYourQr");
      }
      return this.$i18n.t("processing");
    },
    isShowCancelButton() {
      return this.paymentMethod === PAYMENT_PROMPTPAY;
    },
    subLoadingText() {
      if (this.paymentMethod === PAYMENT_CREDIT_CARD) {
        return this.$i18n.t("highLoadWarning");
      }
      return "";
    },
  },
  watch: {
    reservationRealtimeDB: {
      handler() {
        this.onTrackingAsyncReservationChange();
      },
    },
  },
  methods: {
    onClosed() {
      this.$emit("on-closed");
    },
    async onTrackingAsyncReservationChange() {
      const { status, message, encrypted_id, reservation_id } =
        this.reservationRealtimeDB;
      if (status === "error") {
        this.$alert.error(message);
        this.$emit("on-async-reservation-error");
      } else if (status === "success") {
        if (this.isTrueWalletPayment) {
          this.$emit("on-async-true-wallet-success");
          return;
        }
        if (this.originalId.length === 0 || this.encryptedId.length === 0) {
          this.encryptedId = encrypted_id;
          this.originalId = reservation_id;
          this.deleteReservationRealtimeDBListener();
          await initReservationRealtimeDB(this.originalId);
          this.$emit("on-async-reservation-success", {
            encryptedId: this.encryptedId,
            originalId: this.originalId,
          });
          return;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.spinner {
  width: 70px;
  text-align: center;
}

.spinner > div {
  width: 8px;
  height: 8px;
  border-radius: 100%;
  display: inline-block;
  -webkit-animation: sk-bouncedelay 1.2s infinite ease-in-out both;
  animation: sk-bouncedelay 1.2s infinite ease-in-out both;

  @apply bg-red-dark mr-1;
}

.spinner .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes sk-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
  }

  40% {
    -webkit-transform: scale(1);
  }
}

@keyframes sk-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }

  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
</style>
<i18n>
{
  "en": {
    "processing": "Processing your booking",
    "processingYourPayment": "Processing your payment",
    "processingYourQr": "Processing your QR Payment"
  },
  "th": {
    "processing": "ระบบกำลังดำเนินการจอง",
    "processingYourPayment": "กำลังดำเนินการชำระเงิน",
    "processingYourQr": "กำลังชำระเงินด้วย QR Code"
  }
}
</i18n>
