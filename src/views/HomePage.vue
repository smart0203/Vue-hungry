<template>
  <div class="home-page">
    <HomeBanner />
    <div>
      <div class="max-width">
        <div class="mx-3 lg:mx-12">
          <PackageType :home-section-order="1" />
        </div>
      </div>
      <div class="max-width">
        <HomeSlider
          class="mx-3 lg:mx-12"
          :api-order="3"
          :home-section-order="2"
          :allow-do-request="allowDoRequest"
          @on-section-start-request="addRequestPool"
          @on-section-finish-request="clearRequestPool"
        />
      </div>
      <div class="bg-red-pink">
        <Promotion :home-section-order="3" class="max-width lg:mx-12" />
      </div>
      <PendingBooking />
      <div class="max-width">
        <div class="mx-3 lg:mx-12">
          <HomeSlider
            class="home-slider-height"
            :api-order="1"
            :home-section-order="4"
            :allow-do-request="allowDoRequest"
            @on-section-start-request="addRequestPool"
            @on-section-finish-request="clearRequestPool"
          />
          <NearMeRestaurant
            v-if="geoLocationPermition === 'granted'"
            key="delivery-just-for-you"
            type="delivery-just-for-you"
            :home-section-order="5"
            :lat="lat"
            :lng="lng"
            :place-name="placeName"
            :detail="detail"
          />
          <PopularBrand
            :api-order="5"
            :home-section-order="6"
            :allow-do-request="allowDoRequest"
            @on-section-start-request="addRequestPool"
            @on-section-finish-request="clearRequestPool"
          />
          <NearMeRestaurant
            key="near-me"
            class="nearme-slider-height"
            type="near-me"
            :home-section-order="7"
            :lat="lat"
            :lng="lng"
            :place-name="placeName"
            :detail="detail"
            @on-request-geo-permission="requestGeoPermission"
            @on-location-picked="setLocation"
          />
          <TopCategories
            :api-order="7"
            :allow-do-request="allowDoRequest"
            :home-section-order="8"
            @on-section-start-request="addRequestPool"
            @on-section-finish-request="clearRequestPool"
          />
          <HomeSlider
            class="home-slider-height"
            :api-order="8"
            :home-section-order="9"
            :allow-do-request="allowDoRequest"
            @on-section-start-request="addRequestPool"
            @on-section-finish-request="clearRequestPool"
          />
          <HomeSlider
            class="home-slider-height"
            :api-order="6"
            :home-section-order="10"
            :allow-do-request="allowDoRequest"
            @on-section-start-request="addRequestPool"
            @on-section-finish-request="clearRequestPool"
          />
          <div v-if="!isValidCorporateBooking && voucherFeataureIsEnable">
            <div class="section-title">Hungry Hub Gift Card</div>
            <router-link class="block mb-8" :to="{ name: ROUTE_VOUCHER_PAGE }">
              <HhImage
                :mobile-width="'full-screen'"
                :img="voucherBanner"
                :desktop-height="250"
                class="mx-auto"
              />
            </router-link>
          </div>
          <HomeSlider
            class="home-slider-height"
            :api-order="9"
            :home-section-order="11"
            :allow-do-request="allowDoRequest"
            @on-section-start-request="addRequestPool"
            @on-section-finish-request="clearRequestPool"
          />
          <HomeSlider
            class="home-slider-height"
            :api-order="11"
            :home-section-order="12"
            :allow-do-request="allowDoRequest"
            @on-section-start-request="addRequestPool"
            @on-section-finish-request="clearRequestPool"
          />
          <AllRestaurant
            :allow-do-request="allowDoRequest"
            :api-order="13"
            :home-section-order="13"
            @on-section-start-request="addRequestPool"
            @on-section-finish-request="clearRequestPool"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "./HomePageCritical.scss";
import "swiper/swiper-bundle.min.css";
import mixin from "./pageMixin";
import { ref } from "@vue/composition-api";
import HomeBanner from "@/components/Page Component/Home/Banner/HomeBanner.vue";
import Promotion from "@/components/Page Component/Home/Promotion/Promotion.vue";
import HomeSlider from "@/components/Page Component/Home/HomeSlider/HomeSlider.vue";
import PendingBooking from "@/components/Page Component/Home/PendingBooking/PendingBooking.vue";
import PopularBrand from "@/components/Page Component/Home/PopularBrand/PopularBrand.vue";
import PackageType from "@/components/Page Component/Home/PackageType/PackageType.vue";
import TopCategories from "@/components/Page Component/Home/TopCategories/TopCategories.vue";
import AllRestaurant from "@/components/Page Component/Home/AllRestaurant/AllRestaurant";
import NearMeRestaurant from "@/components/Page Component/Home/NearMeRestaurant/NearMeRestaurant.vue";
import { methods as voucherMethods } from "@/composable/voucher";
import { pendingBookings } from "@/composable/pendingBooking";
import askUseCurrentLocation from "@/helper/userLocationHelper";
import { usePermission } from "@vueuse/core";
import { fetchBanners } from "@/composable/banners";
import { ROUTE_VOUCHER_PAGE } from "@/lib/constant";
import { isValid as isValidCorporateBooking } from "@/composable/corporateEvent";

const MAX_REQUEST = 3;

export default {
  components: {
    HomeBanner,
    Promotion,
    HomeSlider,
    PendingBooking,
    PopularBrand,
    PackageType,
    TopCategories,
    AllRestaurant,
    NearMeRestaurant,
  },
  mixins: [mixin],
  setup() {
    const lat = ref(0);
    const lng = ref(0);
    const placeName = ref("");
    const detail = ref("");
    const sectionRequestPool = ref([]);
    const { resetVoucherState } = voucherMethods;
    const geoLocationPermition = usePermission("geolocation");
    return {
      placeName,
      detail,
      lat,
      lng,
      sectionRequestPool,
      resetVoucherState,
      pendingBookings,
      geoLocationPermition,
      isValidCorporateBooking,
      ROUTE_VOUCHER_PAGE,
    };
  },
  computed: {
    allowDoRequest() {
      return this.sectionRequestPool.length < MAX_REQUEST;
    },
    voucherBanner() {
      return this.$store.getters["webConfig/voucherBanner"];
    },
    voucherFeataureIsEnable() {
      return this.$store.getters["webConfig/voucherFeataureIsEnable"];
    },
  },
  mounted() {
    this.pageViewed();
    this.resetState();
    fetchBanners();
  },
  methods: {
    resetState() {
      if (this.$store.hasModule("bookingPackage")) {
        this.$store.commit("bookingPackage/resetAllState");
      }
      if (this.$store.hasModule("bookingDateTime")) {
        this.$store.commit("bookingDateTime/resetAllState");
      }
      if (this.$store.hasModule("restaurantReview")) {
        this.$store.commit("restaurantReview/resetAllState");
      }
      if (this.$store.hasModule("booking")) {
        this.$store.commit("booking/resetAllState");
      }
      if (this.$store.hasModule("restaurant")) {
        this.$store.commit("restaurant/resetAllState");
      }
      if (this.$store.hasModule("restaurantPackages")) {
        this.$store.commit("restaurantPackages/resetAllState");
      }
      if (this.$store.hasModule("bookingCharge")) {
        this.$store.commit("bookingCharge/resetState");
      }
      this.resetVoucherState();
      // manually reset packagePreference (because packagePreference not reset by this.$store.commit("booking/resetAllState")
      this.$store.commit("booking/setState", {
        state: "packagePreference",
        val: "",
      });
    },
    setLocation(location) {
      const { lat, lng, placeName, detail } = location;
      this.lat = lat;
      this.lng = lng;
      this.placeName = placeName;
      this.detail = detail;
    },
    async requestGeoPermission() {
      try {
        const { lat, lng } = await askUseCurrentLocation({
          enableHighAccuracy: true,
        });
        this.setLocation({ lat: lat, lng: lng });
      } catch (err) {
        this.$alert.error(err.message);
      }
    },
    addRequestPool(sectionId) {
      if (!this.allowDoRequest) {
        return;
      }
      if (this.sectionRequestPool.length) {
        const findIndex = this.sectionRequestPool.indexOf(sectionId);
        if (findIndex === -1) {
          this.sectionRequestPool.push(sectionId);
        }
        return;
      }
      this.sectionRequestPool.push(sectionId);
    },
    clearRequestPool(sectionId) {
      if (this.sectionRequestPool.length) {
        const findIndex = this.sectionRequestPool.indexOf(sectionId);
        if (findIndex === 0) {
          this.sectionRequestPool.shift();
        } else if (findIndex >= 1) {
          this.sectionRequestPool.splice(findIndex, 1);
        }
      }
    },
  },
};
</script>

<style lang="scss">
.home-page {
  min-height: 100vh;
}
</style>
