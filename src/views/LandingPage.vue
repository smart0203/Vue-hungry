<template>
  <div class="landing-page">
    <div
      v-if="isLoading"
      class="w-full h-screen px-5 mx-auto lg:h-auto lg:w-9/12"
    >
      <div
        class="flex items-center justify-center mt-24 loading-wrapper lg:mt-0"
      >
        <div id="landing-loader" class="loader"></div>
        <div class="ml-4 text-xl font-bold capitalize">
          {{ $t("pleaseWait") }}
        </div>
      </div>
    </div>
    <template v-else-if="!isLoading && isSuccess">
      <component :is="landingComponent" v-bind="landingProps"></component>
    </template>
  </div>
</template>

<script>
import { ref, watch, computed } from "@vue/composition-api";
import { state, computeds, methods } from "@/components/Landing/landing";
import { methods as realtimeQRMethods } from "@/composable/realtimeQRPaymentChecking";
import pageMixin from "./pageMixin";
import useQueryString from "@/composable/useQueryString";
import dayjs from "@/lib/dayjs";
import store from "@/store/index";
import useLazyImport from "@/composable/useLazyImport";
const { parsedQueryString } = useQueryString();
const isTrueWalletLanding = parsedQueryString.trueWallet || false;

export default {
  name: "LandingPage",
  metaInfo() {
    return {
      title: this.pageTitle,
    };
  },
  components: {
    Landing: () =>
      useLazyImport(() => import("@/components/Landing/Landing.vue")),
    QRPaymentLanding: () =>
      useLazyImport(() => import("@/components/Landing/QRPaymentLanding")),
    TrueWalletLandingPage: () =>
      useLazyImport(() =>
        import("@/components/true_wallet/TrueWalletLandingPage")
      ),
  },
  mixins: [pageMixin],
  props: {
    encryptedId: {
      type: [String, Number],
      required: true,
    },
  },
  setup(props) {
    let landingProps = ref({});
    const encryptedId = props.encryptedId;
    const isUserSignedIn = computed(() => {
      return store.getters["user/isUserSignedIn"];
    });
    const {
      restaurantName,
      isLoading,
      isSuccess,
      originalId,
      isRestaurantPromotedOnly,
      qrPayment,
      shopeePayUrl,
    } = state;

    const { getReservationData } = methods;
    const landingComponent = ref("");
    async function setupComponent() {
      let importComponent;

      if (isTrueWalletLanding) {
        if (computeds.isCanceled.value) {
          importComponent = await import("@/views/PaymentFailedPage");
          landingComponent.value = importComponent.default;
          return;
        }
        landingProps.value = {
          bookingId: originalId,
          amount: computeds.totalCharge,
        };
        importComponent = await import(
          "@/components/true_wallet/TrueWalletLandingPage.vue"
        );
        landingComponent.value = importComponent.default;
        return;
      } else if (computeds.isShopeePay.value || computeds.isQRPayment.value) {
        // start to watch firebase status change
        const {
          saveReservationId,
          saveReservationLandingURL,
          startWatchQRPaymentStatus,
          saveReservationExpiredAt,
        } = realtimeQRMethods;
        saveReservationId(originalId.value);
        saveReservationLandingURL(window.location.href);
        saveReservationExpiredAt(
          dayjs(qrPayment.qrCodeForPaymentExpiredAt).utc().toISOString()
        );
        startWatchQRPaymentStatus();

        if (computeds.isShopeePay.value) {
          landingProps.value = {
            restaurantName: restaurantName,
            bookingId: originalId,
            expiredAt: qrPayment.qrCodeForPaymentExpiredAt,
            amount: computeds.totalCharge,
            shopeePayUrl: shopeePayUrl,
          };
          importComponent = await import(
            "@/components/shopee_pay/ShopeePayLandingPage.vue"
          );
        } else {
          importComponent = await import(
            "@/components/Landing/QRPaymentLanding.vue"
          );
        }
        // register component
        landingComponent.value = importComponent.default;
        return;
      }

      landingProps.value = {
        isSignedin: isUserSignedIn.value,
      };
      importComponent = await import("@/components/Landing/Landing.vue");
      landingComponent.value = importComponent.default;
    }

    getReservationData(encryptedId);

    watch(
      () => isLoading.value,
      async (newVal) => {
        if (newVal === false) {
          setupComponent();
        }
      }
    );

    return {
      ...computeds,
      isUserSignedIn,
      landingComponent,
      restaurantName,
      isLoading,
      isSuccess,
      originalId,
      isRestaurantPromotedOnly,
      isTrueWalletLanding,
      qrPayment,
      getReservationData,
      landingProps,
    };
  },
  computed: {
    lang() {
      return this.$store.state.lang;
    },
  },
};
</script>
<style scoped>
#landing-loader {
  width: 40px;
  height: 40px;
  border-radius: 40px;
}

@screen lg {
  .landing-page {
    max-width: 1280px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 25px;
    margin-bottom: 25px;
  }

  .loading-wrapper {
    min-height: 600px;
  }
}
</style>
