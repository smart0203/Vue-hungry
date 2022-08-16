<template>
  <div class="flex flex-wrap min-h-screen lg:flex-nowrap">
    <div class="w-full lg:w-8/12">
      <div class="text-center shadow lg:rounded-lg lg:mx-2 lg:py-4">
        <div class="py-4 font-black border-b border-gray-400">
          {{ restaurantName }}
        </div>
        <div class="flex items-center justify-center mt-8 mb-4 font-bold">
          <div class="mr-4 lg:mr-10 lg:text-base">
            <span class="text-red-dark">Booking ID:</span>
            <span class="ml-1">{{ bookingId }}</span>
          </div>
          <div class="lg:text-lg">{{ $money(amount) }}</div>
        </div>

        <img
          v-if="qrCodeUrl"
          :src="qrCodeUrl"
          class="mx-auto"
           loading="lazy"
          alt="QR Payment"
        />

        <div class="mb-2 text-sm lg:mt-4 lg:text-base text-red-dark">
          *{{ $t("qrExpiredWithin") }}
        </div>
        <div class="p-2 mb-4 lg:my-10">
          <countdown
            :time="QRCodeCountDown"
            :transform="countDownTransform"
            emit-events
            @end="timerEnded"
          >
            <template slot-scope="props">
              <span
                class="px-2 py-2 text-xl font-extrabold rounded-full text-red-dark lg:text-2xl"
                style="background: #fcdede"
                >{{ `${props.minutes}:${props.seconds}` }}</span
              >
            </template>
          </countdown>
        </div>

        <a
          class="flex items-center justify-center w-9/12 py-3 mx-auto mb-2 font-black text-white rounded-lg lg:w-4/12"
          :style="`background-color: ${SHOPEE_PAY_COLOR}`"
          :href="shopeePayUrl"
          :disabled="!shopeePayUrl"
          :target="isDesktop ? '_blank' : null"
          rel="noopener noreferrer"
        >
          <img
            src="@/assets/icon-shopee-white.png"
            width="16"
            class="mr-1"
             loading="lazy"
            alt="icon shopee"
          />
          Pay with ShopeePay
        </a>
        <button
          class="flex items-center justify-center w-9/12 py-3 mx-auto mb-2 font-black border rounded-lg lg:w-4/12"
          :style="`color: ${SHOPEE_PAY_COLOR}; border-color: ${SHOPEE_PAY_COLOR}`"
          @click="back"
        >
          Cancel
        </button>

        <ol
          v-if="!isDesktop"
          class="w-9/12 pl-4 mx-auto my-8 text-xs text-left text-gray-600 list-decimal"
        >
          <li class="mb-2" v-html="$t('instruction1')"></li>
          <li class="mb-2" v-html="$t('instruction2')"></li>
          <li class="mb-2" v-html="$t('instruction3')"></li>
        </ol>

        <div class="mb-4 text-sm lg:mt-12">{{ "Already Paid?" }}</div>
        <button
          class="flex items-center justify-center w-9/12 py-3 mx-auto mb-4 font-black text-white rounded-lg lg:w-4/12"
          :style="`background-color: ${SHOPEE_PAY_COLOR}`"
          @click="chekcPaymentStatus"
        >
          Check Payment Status
        </button>
      </div>
    </div>

    <div v-if="isDesktop" class="w-full lg:mx-2 lg:w-4/12">
      <LandingChargedSummary class="mt-3 lg:mt-0" :expandable-menu="false" />
      <div class="px-4 py-3 mt-3 rounded-lg shadow lg:px-8">
        <div class="mt-3 text-xl font-black">How to pay</div>
        <ol class="mt-3 ml-4 text-sm list-decimal lg:text-base">
          <li class="mb-2" v-html="$t('instruction1')"></li>
          <li class="mb-2" v-html="$t('instruction2')"></li>
          <li class="mb-2" v-html="$t('instruction3')"></li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
const SHOPEE_PAY_COLOR = "#ee4d2d";
export default {
  name: "ShoppePayLandingPage",
  components: {
    countdown: () => import("@chenfengyuan/vue-countdown"),
    LandingChargedSummary: () =>
      import("@/components/Landing/LandingChargedSummary.vue"),
  },
  props: {
    restaurantName: {
      type: String,
      required: true,
    },
    bookingId: {
      type: [Number, String],
      required: true,
    },
    expiredAt: {
      type: String,
      required: true,
    },
    qrCodeUrl: {
      type: String,
      default: "",
    },
    amount: {
      type: [Number, String],
      required: true,
    },
    shopeePayUrl: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {
      SHOPEE_PAY_COLOR,
    };
  },
  computed: {
    QRCodeCountDown() {
      const now = this.$dayjs().utc();
      const different = this.$dayjs(this.expiredAt).diff(now, "seconds");
      return different > 0 ? different * 1000 : 0;
    },
  },
  methods: {
    back() {
      this.$router.back();
    },
    timerEnded() {
      this.back();
    },
    countDownTransform(props) {
      Object.entries(props).forEach(([key, value]) => {
        // Adds leading zero
        const digits = value < 10 ? `0${value}` : value;
        props[key] = `${digits}`;
      });

      return props;
    },
    chekcPaymentStatus() {
      window.location.reload();
    },
  },
  i18n: {
    messages: {
      en: {
        instruction1: "Click Pay with Shopee Pay for payment.",
        instruction2: "Shopee/Shopee Pay App will open.",
        instruction3:
          "Shopee/Shopee Pay App will open Check and confirm your payment details. <br> Input your shopee pay PIN to complete your payment.",
        qrExpiredWithin: "Your payment will be expired within",
      },
      th: {
        instruction1: "Click Pay with Shopee Pay for payment.",
        instruction2: "Shopee/Shopee Pay App will open.",
        instruction3:
          "Shopee/Shopee Pay App will open Check and confirm your payment details. <br> Input your shopee pay PIN to complete your payment.",
        qrExpiredWithin: "Your payment will be expired within",
      },
    },
  },
};
</script>
<style scoped>
.shadow {
  box-shadow: 0 0 21px 4px rgba(217, 217, 217, 1);
}
</style>
