<template>
  <div id="jsonld-container">
    <div
      v-if="!isDontAllowTracking"
      class="flex flex-col mx-auto mb-6 restaurant-page lg:px-4"
    >
      <!-- breadcrumb -->
      <div v-if="breadcrumbs && !isLoading" class="w-full">
        <ul
          class="flex px-2 my-4 overflow-x-scroll lg:my-2 md:text-base lg:text-sm lg:overflow-x-auto lg:overflow-y-hidden lg:mb-3 breadcrumbs"
        >
          <li
            v-for="(breadcrumb, index) in breadcrumbs"
            :key="breadcrumb.title"
          >
            <a
              class="whitespace-nowrap text-red-dark hover:text-red-light hover:underline"
              :href="breadcrumb.link"
              :class="index === breadcrumbs.length - 1 ? ' font-bold' : null"
              >{{ breadcrumb.title }}
            </a>
          </li>
        </ul>
      </div>
      <div class="flex w-full">
        <div
          class="w-full min-w-0 restaurant-data lg:mr-4"
          :class="isRestaurantExpired ? 'expired' : ''"
        >
          <template v-if="isLoading">
            <div v-if="isDesktop">
              <div class="ph-item">
                <div class="ph-col-2">
                  <div class="ph-avatar"></div>
                </div>
                <div>
                  <div class="ph-row">
                    <div class="ph-col-10 big"></div>
                    <div class="ph-col-2 empty"></div>
                    <div class="ph-col-4 big"></div>
                    <div class="ph-col-2 empty"></div>
                    <div class="ph-col-4 big"></div>
                    <div class="ph-col-2 empty"></div>
                    <div class="ph-col-4 big"></div>
                    <div class="ph-col-2 empty"></div>
                    <div class="ph-col-4 big"></div>
                    <div class="ph-col-2 empty"></div>
                    <div class="ph-col-10 big"></div>
                    <div class="ph-col-2 empty"></div>
                    <div class="ph-col-10 big"></div>
                    <div class="ph-col-2 empty"></div>
                    <div class="ph-col-10 big"></div>
                    <div class="ph-col-2 empty"></div>
                  </div>
                </div>
                <div>
                  <div class="col-2">
                    <div class="ph-picture cover"></div>
                  </div>
                </div>
              </div>
              <div>
                <div class="ph-col-12">
                  <div class="ph-row">
                    <div class="ph-col-6"></div>
                    <div class="ph-col-2 empty"></div>
                  </div>
                </div>
              </div>
              <div class="ph-item">
                <div class="ph-col-12">
                  <div class="ph-row">
                    <div class="ph-col-2"></div>
                    <div class="ph-col-2 empty"></div>
                    <div class="ph-col-2"></div>
                    <div class="ph-col-2 empty"></div>
                    <div class="ph-col-2"></div>
                  </div>
                </div>
                <div class="ph-col-12">
                  <div class="ph-row">
                    <div class="ph-col-12"></div>
                  </div>
                </div>
              </div>
              <div class="ph-item">
                <div class="ph-col-12">
                  <div class="ph-row">
                    <div class="ph-col-2"></div>
                    <div class="ph-col-2 empty"></div>
                    <div class="ph-col-2"></div>
                    <div class="ph-col-2 empty"></div>
                    <div class="ph-col-2"></div>
                  </div>
                </div>
                <div class="ph-col-12">
                  <div class="ph-row">
                    <div class="ph-col-12"></div>
                  </div>
                </div>
              </div>
              <div class="ph-item">
                <div class="ph-col-12">
                  <div class="ph-row">
                    <div class="ph-col-2"></div>
                    <div class="ph-col-2 empty"></div>
                    <div class="ph-col-2"></div>
                    <div class="ph-col-2 empty"></div>
                    <div class="ph-col-2"></div>
                  </div>
                </div>
                <div class="ph-col-12">
                  <div class="ph-row">
                    <div class="ph-col-12"></div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div>
                <div class="ph-row">
                  <div class="ph-col-12 big empty"></div>
                </div>
              </div>
              <div class="ph-item">
                <div class="ph-col-2">
                  <div class="ph-avatar"></div>
                </div>
                <div>
                  <div class="ph-row">
                    <div class="ph-col-12 big"></div>
                    <div class="ph-col-12 big"></div>
                    <div class="ph-col-12 big"></div>
                    <div class="ph-col-12 big"></div>
                    <div class="ph-col-12 big"></div>
                    <div class="ph-col-12 big"></div>
                  </div>
                </div>
              </div>
              <div class="ph-item">
                <div class="ph-col-12">
                  <div class="ph-row">
                    <div class="ph-col-12"></div>
                    <div class="ph-col-12 big"></div>
                  </div>
                </div>
              </div>
              <div class="ph-item">
                <div class="ph-col-12">
                  <div class="ph-row">
                    <div class="ph-col-12"></div>
                    <div class="ph-col-12 big"></div>
                  </div>
                </div>
              </div>
              <div class="ph-item">
                <div class="ph-col-12">
                  <div class="ph-row">
                    <div class="ph-col-12"></div>
                    <div class="ph-col-12 big"></div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <template v-if="isRestaurantExpired">
              <RestaurantExpired />
            </template>
            <template v-else>
              <RestaurantHeader />
              <RestaurantBanner />
              <RestaurantBody />
            </template>
          </template>
        </div>
        <div
          v-if="!isRestaurantExpired"
          class="hidden min-w-0 restaurant-booking-form lg:block"
        >
          <template v-if="isLoading">
            <div class="ph-item">
              <div class="ph-col-12">
                <div class="ph-picture"></div>
              </div>
            </div>
          </template>
          <div v-else id="sticky-booking-form" class="relative hh-soft-shadow">
            <div>
              <RestaurantVoucherFlow
                v-if="isVoucherFlow"
                :title="voucherFlowTitle"
                @on-back-clicked="backToRestaurantPage"
              />
              <Booking v-else />
              <RestaurantCovidRating
                v-if="showCovidRating"
                :staff-protection="covidRating.staffProtection"
                :social-distancing="covidRating.socialDistancing"
                :overall-cleanliness="covidRating.overallCleanliness"
                class="mt-8"
              />
            </div>
            <RestaurantSideMenu />
          </div>
        </div>
      </div>
      <!-- restaurant similar -->
      <div
        v-observe-visibility="
          !restaurantSimilar.component && !isLoading
            ? {
                callback: restaurantSimilarVisibilityChanged,
                throttle: 500,
              }
            : false
        "
        class="pl-4 mt-4 restaurant-similar-wrapper lg:pl-0"
      >
        <component :is="restaurantSimilar.component"></component>
      </div>
      <!-- restaurant around -->
      <div
        v-observe-visibility="
          !restaurantAround.component && !isLoading
            ? {
                callback: restaurantAroundVisibilityChanged,
                throttle: 500,
              }
            : false
        "
        class="pl-4 mt-4 restaurant-similar-wrapper lg:pl-0"
      >
        <component :is="restaurantAround.component"></component>
      </div>

      <!-- bottom sheet of add package menu -->
      <component :is="addPackageMenuComponent"></component>
    </div>
  </div>
</template>

<script>
import "@/components/Shared/RestaurantCardSlider.scss";
import "swiper/swiper-bundle.min.css";
import RestaurantHeader from "@/components/Page Component/Restaurant/Restaurant Header/RestaurantHeader";
import RestaurantBody from "@/components/Page Component/Restaurant/RestaurantBody.vue";
import RestaurantBanner from "@/components/Page Component/Restaurant/RestaurantBanner.vue";
import RestaurantCovidRating from "@/components/Page Component/Restaurant/RestaurantCovidRating.vue";
import RestaurantVoucherFlow from "@/components/Page Component/Restaurant/RestaurantVoucherFlow.vue";
import Booking from "@/components/Booking/Booking.vue";
import { mapState, mapGetters } from "vuex";
import pageMixin from "./pageMixin";
import { isCurrentBookingPending } from "@/composable/pendingBooking";
import { methods as voucherMethods } from "@/composable/voucher";
import isEmpty from "lodash-es/isEmpty";
import stickybits from "stickybits";
import {
  ROUTE_RESTAURANT_PAGE,
  ROUTE_BUY_RESTAURANT_VOUCHER_SIDEBAR,
} from "@/lib/constant";
import { isOpen as toggleRestaurantSideMenu } from "@/components/Page Component/Restaurant/Restaurant-Side-Menu/restaurantSideMenu";
import { clearSelectMenuFlow } from "@/components/Package/Package-Select-Menu/packageSelectMenu";
import { convertToNumber } from "@/helper/stringHelper";
import { getPricingTier } from "@/services/getDeliveryPricingTier";
import sortBy from "lodash-es/sortBy";
import qs from "qs";
import humps from "humps";
import {
  setEventForRestaurant,
  setEventId,
  validateEvent,
  resetState as resetCorporateEventState,
} from "@/composable/corporateEvent";
import useLazyImport from "@/composable/useLazyImport";

const parsedQueryString = humps.camelizeKeys(
  qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })
);
export default {
  metaInfo() {
    return {
      title: this.seo.title,
      meta: this.seo.meta,
      link: this.seo.link,
    };
  },
  components: {
    RestaurantHeader,
    RestaurantBody,
    RestaurantBanner,
    Booking,
    RestaurantCovidRating,
    RestaurantVoucherFlow,
    RestaurantExpired: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "RestaurantExpired" */ "@/components/Page Component/Restaurant/RestaurantExpired.vue"
        )
      ),
    RestaurantSimilar: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "RestaurantSimilarChunk" */ "@/components/Page Component/Restaurant/RestaurantSimilar.vue"
        )
      ),
    RestaurantSideMenu: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "RestaurantSideMenuChunk" */ "@/components/Page Component/Restaurant/Restaurant-Side-Menu/RestaurantSideMenu.vue"
        )
      ),
  },
  mixins: [pageMixin],
  props: {
    restaurantName: {
      type: String,
      required: true,
    },
  },
  setup() {
    const { resetVoucherState } = voucherMethods;
    return {
      resetVoucherState,
      isCurrentBookingPending,
    };
  },
  data() {
    return {
      isSelected: false,
      isLoading: true,
      seo: { meta: [], link: [] },
      restaurantSimilar: {
        component: "",
        isVisible: false,
      },
      restaurantAround: {
        component: "",
        isVisible: false,
      },
      addPackageMenuComponent: "",
    };
  },
  computed: {
    ...mapState("restaurant", [
      "restaurantId",
      "restaurantData",
      "restaurantSeo",
    ]),
    ...mapGetters("restaurant", [
      "isRestaurantExpired",
      "isActiveRestaurant",
      "isRestaurantHaveEnoughtCovidRating",
    ]),
    ...mapGetters(["baseUrlWithLang", "isDontAllowTracking"]),
    ...mapGetters("booking", ["isDineIn"]),
    ...mapGetters("bookingPackage", ["anyDeliveryPackage"]),
    routeRestaurantName() {
      return this.$route.params?.restaurantName || "";
    },
    pageTitle() {
      return this.restaurantSeo.title;
    },
    breadcrumbs() {
      return this.restaurantData.breadcrumbs;
    },
    covidRating() {
      return this.restaurantData.covid19Rating;
    },
    showCovidRating() {
      const routeName = this.$route.name;
      if (
        routeName === ROUTE_RESTAURANT_PAGE &&
        this.covidRating &&
        this.isRestaurantHaveEnoughtCovidRating
      ) {
        return true;
      }
      return false;
    },
    isLoadingGetRestaurantPackages() {
      return this.$store.state.restaurantPackages.isLoading;
    },
    isVoucherFlow() {
      return this.$route.name === ROUTE_BUY_RESTAURANT_VOUCHER_SIDEBAR;
    },
    voucherFlowTitle() {
      return this.isMobile ? this.$store.state.restaurant.restaurantName : null;
    },
  },
  watch: {
    routeRestaurantName: {
      handler() {
        this.resetBookingState();
        this.getRestaurantData();
      },
      immediate: true,
    },
    isLoading: {
      handler(newVal) {
        if (newVal === false) {
          this.setBookingFlowSticky();
        }
      },
      immediate: true,
    },
    isLoadingGetRestaurantPackages: {
      handler(newVal, oldVal) {
        if (oldVal === true && newVal === false) {
          this.loadAddPackageMenuComponent();
        }
      },
    },
  },
  beforeDestroy() {
    this.$store.dispatch("restaurant/cancelGetRestaurantData");
    if (this.isDesktop) {
      this.clearStore();
    }
  },
  methods: {
    backToRestaurantPage() {
      this.$router.push({
        name: ROUTE_RESTAURANT_PAGE,
      });
    },
    async getRestaurantData() {
      if (this.restaurantName === this.restaurantData.restaurantSlug) {
        this.isLoading = false;
        return;
      }

      this.isLoading = true;
      toggleRestaurantSideMenu.value = false;
      clearSelectMenuFlow();
      this.clearStore();
      this.clearBookingPackagePreference();
      const result = await this.$store.dispatch(
        "restaurant/getRestaurantData",
        this.restaurantName
      );
      await this.checkIsCorporateBooking();

      if (result.isSuccess === false) {
        if (result.message) {
          this.$alert.error(result.message);
        }
        window.location = `/restaurants/search`;
        return;
      }

      this.isLoading = false;
      this.onRestaurantMounted();
    },
    async getRestaurantDeliveryPricingTier() {
      if (!this.restaurantData.hasDeliveryPricingTier) {
        return;
      }
      try {
        const result = await getPricingTier(this.restaurantId);
        if (result.isSuccess) {
          this.restaurantData.deliveryPricingTier = sortBy(result.data, [
            "freeDeliveryRadiusInKm",
          ]);
        } else {
          this.$alert.error(result.message);
        }
      } catch (err) {
        this.$rollbar.error(
          "Failed get restaurant delivery pricing tier",
          err,
          { restaurantId: this.restaurantId }
        );
      }
    },
    async getRestaurantPackages() {
      const restaurantId = this.$store.state.restaurant.restaurantId;
      await this.$store.dispatch(
        "restaurantPackages/getRestaurantPackages",
        restaurantId
      );
    },
    async getInventorySummaries() {
      const restaurantId = this.$store.state.restaurant.restaurantId;
      await this.$store.dispatch(
        "inventorySummary/setupInventorySummaries",
        restaurantId
      );
    },
    async loadAddPackageMenuComponent() {
      if (!this.anyDeliveryPackage || this.addPackageMenuComponent) {
        return;
      }
      try {
        const { component, isSuccess, errorMessage } =
          await this.$loadComponentAsync("Package/Package-Select-Menu", {
            enableVariant: true,
            isDesktop: this.isDesktop,
          });
        if (!isSuccess.value) {
          this.$rollbar.error(errorMessage.value);
          return;
        }
        this.addPackageMenuComponent = component.value;
      } catch (err) {
        this.$rollbar.error("Failed load add package menu component", err);
      }
    },
    clearStore() {
      this.$store.commit("restaurant/resetAllState");
      this.$store.commit("restaurantReview/resetAllState");
      this.$store.commit("bookingPackage/resetAllState");
    },
    clearBookingPackagePreference() {
      // only clear package preference if current booking flow not mark as isContinuePendingBooking
      if (this.isCurrentBookingPending === false) {
        this.$store.commit("booking/setState", {
          state: "packagePreference",
          val: "",
        });
      }
    },
    async getRestaurantJsonLd() {
      try {
        const result = await this.$store.dispatch(
          "restaurant/getRestaurantJsonLd"
        );
        if (result.isSuccess === false && result.message) {
          this.$alert.error(result.message);
        } else {
          this.$nextTick(() => {
            const jsonldContainer = document.getElementById("jsonld-container");
            if (jsonldContainer) {
              jsonldContainer.insertAdjacentHTML("BeforeEnd", result.data);
            }
          });
        }
      } catch (err) {
        this.$rollbar.error(err);
      }
    },
    track() {
      let restaurantLowestPrice = [];
      const id = this.restaurantId;
      const {
        cuisine,
        cuisines,
        availablePackageTypes,
        location,
        locations,
        reviewsScore,
        reviewsCount,
        videos,
        branchId,
      } = this.restaurantData;
      if (availablePackageTypes && availablePackageTypes.length) {
        availablePackageTypes.forEach((type) => {
          const capitalizedPackageType =
            type.charAt(0).toUpperCase() + type.slice(1);
          restaurantLowestPrice.push(
            convertToNumber(
              this.restaurantData[`lowest${capitalizedPackageType}Price`]
            )
          );
        });
      }
      const trackPayload = {
        restaurantId: id,
        restaurantName: this.$store.getters["restaurant/restaurantNameEn"],
        restaurantLocation: location,
        restaurantLocations: locations
          ? locations.map((location) => location.title).join(",")
          : "",
        restaurantPackageType: availablePackageTypes.join(","),
        restaurantIsActive: this.isActiveRestaurant,
        restaurantCuisine: cuisine,
        restaurantCuisines: cuisines
          ? cuisines.map((cuisine) => cuisine.title).join(",")
          : "",
        restaurantRatingAverage: reviewsScore,
        restaurantRatingTotal: reviewsCount,
        restaurantVideo:
          videos.filter((video) => video.link).length > 0 ? true : false,
        restaurantBranchId: branchId,
        restaurantLowestPrice: restaurantLowestPrice.sort((a, b) => a - b)[0],
        restaurantURL: `${window.location.origin}${window.location.pathname}`,
      };
      this.$track("RESTAURANT_VIEWED", trackPayload);
    },
    resetBookingState() {
      if (
        this.isDesktop &&
        (this.isDineIn == false || this.isCurrentBookingPending)
      ) {
        return;
      }
      if (!this.$store.state.bookingPackage.keepState) {
        this.$store.dispatch("bookingPackage/removeAllSelectedPackage");
      }
      this.$store.commit("booking/resetAllState");
      this.$store.commit("bookingDateTime/resetAllState");
      this.resetVoucherState();
    },
    onRestaurantMounted() {
      if (isEmpty(this.restaurantData)) {
        return;
      }
      if (!this.isRestaurantExpired) {
        this.getRestaurantPackages();
        this.getRestaurantDeliveryPricingTier();
        this.getInventorySummaries();
      }
      this.track();
      this.getRestaurantJsonLd();
      this.pageViewed();
      this.$set(this.$data, "seo", this.restaurantSeo);
    },
    setBookingFlowSticky() {
      if (this.isDesktop) {
        this.$nextTick(() => {
          window.bookingSticky = stickybits("#sticky-booking-form", {
            stickyBitStickyOffset: 45,
          });
        });
      }
    },
    restaurantSimilarVisibilityChanged(visibility) {
      if (visibility) {
        this.restaurantSimilar.isVisible = visibility;
        this.getRestaurantSimilarComponent();
      }
    },
    restaurantAroundVisibilityChanged(visibility) {
      if (visibility) {
        this.restaurantAround.isVisible = visibility;
        this.getRestaurantAround();
      }
    },
    async getRestaurantSimilarComponent() {
      try {
        const importResult = await useLazyImport(() =>
          import(
            /* webpackChunkName: "RestaurantSimilarChunk" */ "@/components/Page Component/Restaurant/RestaurantSimilar.vue"
          )
        );
        if (importResult && importResult.default) {
          this.restaurantSimilar.component = importResult.default;
        }
      } catch (err) {
        this.$rollbar.error("Failed to load similar restaurant component", err);
      }
    },
    async getRestaurantAround() {
      try {
        const importResult = await useLazyImport(() =>
          import(
            /* webpackChunkName: "RestaurantAroundChunk" */ "@/components/Page Component/Restaurant/RestaurantAround.vue"
          )
        );
        if (importResult && importResult.default) {
          this.restaurantAround.component = importResult.default;
        }
      } catch (err) {
        this.$rollbar.error("Failed to load similar restaurant component", err);
      }
    },
    async checkIsCorporateBooking() {
      const { cvid } = parsedQueryString;
      if (cvid) {
        setEventId(cvid);
        setEventForRestaurant(this.restaurantId);
        await validateEvent();
        return;
      }
      resetCorporateEventState();
    },
  },
};
</script>

<style scoped>
.restaurant-page {
  min-height: 100vh;
}

@screen md {
  .restaurant-page {
    max-width: 700px;
  }
}

@screen lg {
  .restaurant-page {
    max-width: 1280px;
    margin-top: 25px;
    margin-bottom: 25px;
  }

  .restaurant-data {
    width: 75%;
  }

  .restaurant-data.expired {
    width: 100%;
  }

  .restaurant-booking-form {
    width: 28%;
  }
}

.cover {
  height: 220px;
}

.breadcrumbs li + li::before {
  padding: 2px;

  @apply text-red-dark mx-1 font-black;

  content: "\203A";
}
</style>
