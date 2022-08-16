<template>
  <div class="flex items-center justify-center" style="background: #f8f8f9">
    <div v-if="!isShow" class="flex items-center justify-center mt-24 lg:mt-0">
      <div id="landing-loader" class="loader"></div>
      <div class="ml-4 text-xl font-bold capitalize">
        {{ $t("pleaseWait") }}
      </div>
    </div>
    <iframe v-else class="w-full h-screen" :src="decodedURL"></iframe>
  </div>
</template>
<script>
import { ROUTE_HOME_PAGE, ROUTE_RESTAURANT_PAGE } from "@/lib/constant";
const PAYMENT_OTP_MODAL_TIMEOUT = 300000;
export default {
  name: "PaymentOTPPage",
  props: {
    restaurantName: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isShow: false,
      decodedURL: "",
    };
  },
  mounted() {
    this.onMounted();
  },
  methods: {
    onMounted() {
      if (!this.url && !this.validateURL()) {
        this.$router.replace({ name: ROUTE_HOME_PAGE });
        return;
      }
      this.decodedURL = decodeURIComponent(this.url);
      this.isShow = true;
      this.startTimeout();
    },
    validateURL() {
      return this.url.includes("https");
    },
    startTimeout() {
      setTimeout(() => {
        this.redirectToRestaurantPage();
      }, PAYMENT_OTP_MODAL_TIMEOUT);
    },
    redirectToRestaurantPage() {
      this.$router.replace({
        name: ROUTE_RESTAURANT_PAGE,
      });
    },
  },
};
</script>
