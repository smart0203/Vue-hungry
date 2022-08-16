<template>
  <div>
    <div
      v-if="isLoading"
      class="w-full min-h-screen px-5 mx-auto lg:h-auto lg:w-9/12"
    >
      <div class="flex items-center justify-center mt-24 loading-wrapper">
        <div id="landing-loader" class="loader"></div>
        <div class="ml-4 text-xl font-bold capitalize">
          {{ $t("pleaseWait") }}
        </div>
      </div>
    </div>
    <template v-else>
      <VoucherTransactionQRPayment
        :id="id"
        :restaurant-name="parsedRestaurantName"
        :title="title"
        :charge-amount="chargeAmount"
        :qr-code-url="qrCodeUrl"
        :qr-count-down="QRCodeCountDown"
        :restaurant-vouchers="restaurantVouchers"
        :custom-vouchers="customVouchers"
        @on-timer-ended="back"
        @on-cancel="back"
      />
    </template>
  </div>
</template>

<script>
import { getVoucherTransaction as fetchVoucherTransaction } from "@/services/voucherTransaction";
import { ref, onMounted, computed, watch } from "@vue/composition-api";
import realtimeReservation from "@/composable/realtimeReservation";
import {
  ROUTE_VOUCHER_LANDING_PAGE,
  ROUTE_VOUCHER_PAGE,
  ROUTE_BUY_RESTAURANT_VOUCHER_SIDEBAR,
  ROUTE_BUY_RESTAURANT_VOUCHER_PAGE,
  HUNGRY_HUB_VOUCHER,
  RESERVATION_WAITING_FOR_PAYMENT,
  RESERVATION_PAID,
} from "@/lib/constant";
import { rebuildUrl } from "@/helper/urlHelper";
import useLazyImport from "@/composable/useLazyImport";

let self;
export default {
  name: "VoucherQRPaymentPage",
  components: {
    VoucherTransactionQRPayment: () =>
      useLazyImport(() =>
        import("@/components/qr_payment/VoucherTransactionQRPayment.vue")
      ),
  },
  props: {
    encryptedId: {
      type: String,
      required: true,
    },
    restaurantName: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const isLoading = ref(true);
    const title = ref("Transaction ID");
    const id = ref("");
    const chargeAmount = ref("");
    const qrCodeUrl = ref("");
    const expiredAt = ref("");
    const customVouchers = ref([]);
    const restaurantVouchers = ref([]);
    const parsedRestaurantName = computed(() => {
      return typeof props.restaurantName === "string"
        ? props.restaurantName.replace(/-/g, " ")
        : "";
    });

    const QRCodeCountDown = computed(() => {
      if (self.$dayjs(expiredAt.value).isValid()) {
        const now = self.$dayjs().utc();
        const different = expiredAt.value.diff(now, "seconds");
        return different > 0 ? different * 1000 : 0;
      }
      return 0;
    });

    const {
      reservationStatus,
      initReservationRealtimeDB,
      deleteReservationRealtimeDBListener,
    } = realtimeReservation("watch-voucher");

    function onPaid() {
      deleteReservationRealtimeDBListener();
      self.$router.push({
        name: ROUTE_VOUCHER_LANDING_PAGE,
        params: {
          restaurantName: props.restaurantName,
          encryptedId: props.encryptedId,
        },
      });
    }

    async function getVoucherData() {
      isLoading.value = true;
      const { isSuccess, data } = await fetchVoucherTransaction(
        props.encryptedId
      );
      if (isSuccess) {
        isLoading.value = false;
        const { attributes, id: realId } = data.data;
        if (attributes && realId) {
          id.value = realId;
          chargeAmount.value = attributes.totalPrice;
          qrCodeUrl.value = rebuildUrl(attributes.qrCodeForPayment, "asset");
          expiredAt.value = self
            .$dayjs(attributes.qrCodeForPaymentExpiredAt)
            .utc();

          restaurantVouchers.value = Array.isArray(attributes.vouchers.packages)
            ? attributes.vouchers.packages
            : [];
          customVouchers.value = Array.isArray(attributes.vouchers.customAmount)
            ? attributes.vouchers.customAmount
            : [];

          initReservationRealtimeDB(id.value, false);
          return;
        }
        self.$rollbar.error("Failed get voucher data");
      }
    }

    function back() {
      if (props.restaurantName === HUNGRY_HUB_VOUCHER) {
        self.$router.push({ name: ROUTE_VOUCHER_PAGE });
      } else if (self.isDesktop) {
        self.$router.push({
          name: ROUTE_BUY_RESTAURANT_VOUCHER_SIDEBAR,
          params: { restaurantName: props.restaurantName },
        });
      } else {
        self.$router.push({
          name: ROUTE_BUY_RESTAURANT_VOUCHER_PAGE,
          params: { restaurantName: props.restaurantName },
        });
      }
    }

    onMounted(() => {
      getVoucherData();
    });

    watch(
      () => reservationStatus.value,
      (newVal, oldVal) => {
        if (
          newVal === RESERVATION_PAID &&
          oldVal === RESERVATION_WAITING_FOR_PAYMENT
        ) {
          onPaid();
        }
      }
    );

    return {
      parsedRestaurantName,
      isLoading,
      title,
      id,
      chargeAmount,
      qrCodeUrl,
      QRCodeCountDown,
      restaurantVouchers,
      customVouchers,
      expiredAt,
      back,
    };
  },
  created() {
    self = this;
  },
};
</script>
