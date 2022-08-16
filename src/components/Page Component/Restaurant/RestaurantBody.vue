<template>
  <div class="mx-0 lg:mx-0">
    <div>
      <!-- restaurant packages section-->
      <RestaurantPackageList />
      <!-- restaurant voucher -->
      <template v-if="showVoucherBanner">
        <div
          class="flex items-center justify-between mx-2 mb-4 font-bold lg:text-lg"
        >
          <p>Gift Card</p>
          <router-link
            class="capitalize text-red-dark hover:underline"
            :to="goToVoucherPage"
          >
            {{ $t("showMore") }}
          </router-link>
        </div>
        <router-link class="block mx-2" :to="goToVoucherPage">
          <HhImage
            :mobile-width="'full-screen'"
            :desktop-wdith="840"
            :img="voucherBanner"
            class="rounded-lg"
          />
        </router-link>
      </template>
      <!-- about,review section -->
      <div
        id="restaurant-information-tab"
        class="mt-6 bg-white section-wrapper lg:mt-6"
      >
        <div v-if="!isFreeReservationSystem" class="flex pt-3 pb-4">
          <button
            v-if="reviewTotalCount > 0"
            id="show-reviews-restaurant-button"
            class="flex-auto text-base bg-white border-none outline-none cursor-pointer text-red-dark lg:text-xl"
            :class="restaurantActiveTab == 'reviews' ? 'font-black' : ''"
            @click="toggleSection('reviews')"
          >
            {{ reviewsTabText }}
          </button>
          <button
            id="show-about-restaurant-button"
            class="flex-auto text-base bg-white border-none outline-none cursor-pointer text-red-dark lg:text-xl"
            :class="restaurantActiveTab == 'about' ? 'font-black' : ''"
            @click="toggleSection('about')"
          >
            {{ $t("about") }}
          </button>
          <button
            id="show-how-restaurant-button"
            class="flex-auto text-base bg-white border-none outline-none cursor-pointer text-red-dark lg:text-xl"
            :class="restaurantActiveTab == 'how' ? 'font-black' : ''"
            @click="toggleSection('how')"
          >
            {{ $t("howToUse") }}
          </button>
        </div>
        <div>
          <transition name="fade">
            <RestaurantAbout
              v-if="restaurantActiveTab === 'about'"
              key="about"
              :about="restaurantAbout"
              :direction="restaurantDirection"
              :address="restaurantAddress"
              :corkage-charge="restaurantData.corkageCharge"
              :parking="restaurantData.parking"
            />
            <RestaurantReviews
              v-else-if="restaurantActiveTab === 'reviews'"
              key="reviews"
              :reviews-total-score="reviewTotalScore"
              :reviews-total-count="reviewTotalCount"
              :stars-count="reviewStarsCount"
            />
            <RestaurantHowToUse
              v-else-if="restaurantActiveTab === 'how'"
              key="how-to-use"
              :content="restaurantHowToUse"
            />
          </transition>
        </div>
      </div>

      <!-- Order/Book Now section (only visible in mobile) -->
      <div
        v-if="isMobile"
        id="book-button"
        class="flex items-center justify-center px-4 py-2 bg-white border-t border-gray-400 z-48"
      >
        <button
          v-if="anyDeliveryPackage"
          id="mobile-go-order-button"
          class="w-8/12 py-2 ml-3 font-black text-white uppercase border-none rounded-full bg-red-dark"
          @click="goToBooking(false)"
        >
          {{ orderButtonText }}
        </button>
        <button
          v-if="anyDineInPackage"
          id="desktop-go-booking-button"
          class="w-8/12 py-2 ml-3 font-black text-white uppercase border-none rounded-full bg-red-dark"
          @click="goToBooking(true)"
        >
          {{ bookButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { mapFields } from "vuex-map-fields";
import {
  PACKAGE_PREFERENCE_DINE_IN,
  PACKAGE_PREFERENCE_DELIVERY_PICK_UP,
  PACKAGE_PREFERENCE_XPERIENCE,
  ROUTE_BUY_RESTAURANT_VOUCHER_PAGE,
  ROUTE_BUY_RESTAURANT_VOUCHER_SIDEBAR,
} from "@/lib/constant";
import RestaurantPackageList from "./RestaurantPackageList.vue";
import { isCurrentBookingPending } from "@/composable/pendingBooking";
import { isValid as isValidCorporateBooking } from "@/composable/corporateEvent";
import useLazyImport from "@/composable/useLazyImport";

export default {
  components: {
    RestaurantPackageList,
    RestaurantAbout: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "RestaurantPageChunk" */ "./RestaurantAbout.vue"
        )
      ),
    RestaurantReviews: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "RestaurantPageChunk" */ "./RestaurantReviews.vue"
        )
      ),
    RestaurantHowToUse: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "RestaurantPageChunk" */ "./RestaurantHowToUse.vue"
        )
      ),
  },
  setup() {
    return {
      isCurrentBookingPending,
      isValidCorporateBooking,
    };
  },
  data() {
    return {
      PACKAGE_PREFERENCE_DINE_IN,
      PACKAGE_PREFERENCE_DELIVERY_PICK_UP,
      PACKAGE_PREFERENCE_XPERIENCE,
    };
  },
  computed: {
    ...mapFields("booking", ["packagePreference"]),
    ...mapFields("restaurant", ["restaurantActiveTab"]),
    ...mapState("restaurantReview", ["reviewTotalCount"]),
    ...mapGetters("restaurant", [
      "isFreeReservationSystem",
      "isNewRestaurant",
      "isRestaurantAcceptVoucher",
    ]),
    ...mapGetters("bookingPackage", [
      "anyDeliveryPackage",
      "anyDineInPackage",
      "getPackageByType",
    ]),
    lang() {
      return this.$store.getters["getState"]("lang");
    },
    reviewsTabText() {
      let text = this.$t("reviews");
      if (this.reviewTotalCount > 0) {
        text += ` (${this.$formatThousand(this.reviewTotalCount)})`;
      }
      return text;
    },
    bookButtonText() {
      if (this.anyDineInPackage && this.anyDeliveryPackage) {
        return this.$t("book");
      }
      return this.$t("bookNow");
    },
    orderButtonText() {
      if (this.anyDineInPackage && this.anyDeliveryPackage) {
        return this.$t("order");
      }
      return this.$t("orderNow");
    },
    restaurantData() {
      return this.$store.state.restaurant.restaurantData;
    },
    restaurantAbout() {
      if (this.restaurantData) {
        return this.restaurantData.description;
      }
      return "";
    },
    restaurantHowToUse() {
      if (this.restaurantData) {
        return this.restaurantData.customSectionContent;
      }
      return "";
    },
    reviewTotalScore() {
      return this.$store.state.restaurantReview.reviewTotalScore;
    },
    reviewStarsCount() {
      return this.$store.state.restaurantReview.reviewStarsCount;
    },
    restaurantDirection() {
      if (this.restaurantData.lat && this.restaurantData.lng) {
        return `http://www.google.com/maps?q=${this.restaurantData.lat},${this.restaurantData.lng}`;
      }
      return "";
    },
    restaurantAddress() {
      return this.restaurantData.address || "";
    },
    goToVoucherPage() {
      let routeName = this.isDesktop
        ? ROUTE_BUY_RESTAURANT_VOUCHER_SIDEBAR
        : ROUTE_BUY_RESTAURANT_VOUCHER_PAGE;
      return {
        name: routeName,
      };
    },
    voucherBanner() {
      return this.$store.getters["webConfig/voucherBanner"];
    },
    voucherFeataureIsEnable() {
      return this.$store.getters["webConfig/voucherFeataureIsEnable"];
    },
    showVoucherBanner() {
      return (
        this.isValidCorporateBooking === false &&
        this.isRestaurantAcceptVoucher &&
        this.voucherBanner &&
        this.voucherFeataureIsEnable
      );
    },
  },
  mounted() {
    this.onMounted();
  },
  methods: {
    async onMounted() {
      try {
        this.setInitialActiveTab();
      } catch (err) {
        this.$rollbar.error(err);
      }
    },
    setInitialActiveTab() {
      if (this.reviewTotalCount > 0) {
        this.restaurantActiveTab = "reviews";
      } else {
        this.restaurantActiveTab = "about";
      }
    },
    toggleSection(sectionName) {
      if (sectionName != this.restaurantActiveTab) {
        this.restaurantActiveTab = sectionName;
      }
    },
    goToBooking(isDineIn) {
      if (isDineIn) {
        this.packagePreference = `${PACKAGE_PREFERENCE_XPERIENCE}/${PACKAGE_PREFERENCE_DINE_IN}`;
      } else {
        this.packagePreference = PACKAGE_PREFERENCE_DELIVERY_PICK_UP;
      }
      this.$store.dispatch("booking/initBookingFlow", this.isMobile);
    },
  },
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.flex-1 {
  flex: 0 0 auto;
}

#book-button {
  position: sticky;
  bottom: 0;
}
</style>
<i18n>
{
  "en": {
    "packages": "Packages",
    "about": "About",
    "reviews": "Reviews",
    "howToUse": "How to use"
  },
  "th": {
    "packages": "แพ็กเกจ",
    "about": "เกี่ยวกับร้านอาหาร",
    "reviews": "รีวิว",
    "howToUse": "วิธีใช้"
  }
}
</i18n>
