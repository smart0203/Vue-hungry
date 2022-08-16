<template>
  <div
    v-observe-visibility="{
      callback: visibilityChanged,
      once: true,
      throttle: 300,
    }"
    :class="
      !realRestaurants.length && !isLoading
        ? 'flex items-center justify-center'
        : null
    "
  >
    <div v-if="isShowDefaultUI" class="flex items-center justify-center">
      <img
        src="@/assets/mr-hungry-bg-yellow.png"
        alt="restaurant near me icon"
        width="115"
        height="115"
        loading="lazy"
        class="mr-2 lg:mr-4"
      />
      <div>
        <p class="text-sm font-black lg:text-base">
          {{
            isAllowedGeoPermission && !realRestaurants.length
              ? $t("noRestaurantNearMeTitle")
              : $t("offerRestaurantNearMeServiceTitle")
          }}
        </p>
        <p class="text-sm lg:text-base">
          {{
            isAllowedGeoPermission && !realRestaurants.length
              ? $t("noRestaurantNearMeSubTitle")
              : $t("offerRestaurantNearMeServiceSubTitle")
          }}
        </p>
        <button
          v-if="isPromptGeoPermission"
          class="px-3 mt-2 text-sm text-white capitalize border rounded-full bg-red-dark border-red-dark hover:underline"
          @click="requestGeoPermission"
        >
          {{ $t("allow") }}
        </button>
        <component
          :is="pickLocationComponent"
          v-else
          :location="userLocation"
          :title="modalTitle"
          @on-location-pick="locationPicked"
        >
          <template #default="{ openPickLocationModal }">
            <button
              class="px-3 mt-2 text-sm text-white capitalize border rounded-full bg-red-dark border-red-dark hover:underline"
              @click="openPickLocationModal"
            >
              {{ $t("changeLocation") }}
            </button>
          </template>
        </component>
      </div>
    </div>
    <HomeSliderView
      v-if="
        isLoading === true || (realRestaurants.length && !isPromptGeoPermission)
      "
      :is-loading="isLoading"
      :restaurants="restaurants"
      @on-restaurant-clicked="trackRestaurantClicked"
    >
      <div class="flex items-center lg:justify-center">
        {{ sectionTitle }}
        <div v-if="!isLoading">
          <button
            v-if="isAllowedGeoPermission"
            class="px-2 ml-1 text-xs text-white capitalize border rounded-full bg-red-dark lg:text-sm border-red-dark lg:ml-2"
            @click="getNearMeRestaurant"
          >
            {{ $t("refresh") }}
          </button>
          <component
            :is="pickLocationComponent"
            v-else
            :location="userLocation"
            :title="modalTitle"
            @on-location-pick="locationPicked"
          >
            <template #default="{ openPickLocationModal }">
              <button
                class="px-2 ml-1 text-xs text-white capitalize border rounded-full bg-red-dark lg:text-sm border-red-dark lg:ml-2"
                @click="openPickLocationModal"
              >
                {{ $t("changeLocation") }}
              </button>
            </template>
          </component>
        </div>
      </div>
      <div
        v-if="selectedAddressName.length && !isLoading"
        class="flex items-center text-xs font-normal lg:justify-center lg:text-sm"
      >
        {{ selectedAddressName }}
      </div>
    </HomeSliderView>
  </div>
</template>

<script>
import { searchRestaurant, initDummyRestaurant } from "@/services/restaurant";
import getSectionData from "@/services/getSectionData";
import HomeSliderView from "@/components/Page Component/Home/HomeSlider/HomeSliderView";
import { usePermission } from "@vueuse/core";
import generateRestaurantDeliveryFee from "@/composable/restaurantDeliveryFee";

export default {
  components: {
    HomeSliderView,
  },
  props: {
    homeSectionOrder: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator: function (value) {
        return ["near-me", "delivery-just-for-you"].indexOf(value) !== -1;
      },
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    placeName: {
      type: String,
      default: "",
    },
    detail: {
      type: String,
      default: "",
    },
  },
  setup() {
    const geoLocationPermition = usePermission("geolocation");
    return {
      geoLocationPermition,
    };
  },
  data() {
    return {
      isLoading: false,
      dummyRestaurants: [],
      realRestaurants: [],
      isVisible: false,
      pickLocationComponent: null,
      modalTitle: this.$t("changeLocation"),
    };
  },
  computed: {
    lang() {
      return this.$store.state.lang;
    },
    userLocation() {
      return {
        address: "",
        detail: this.detail,
        lat: this.lat,
        lng: this.lng,
        name: "default",
        placeName: this.placeName,
      };
    },
    isShowDefaultUI() {
      if (!this.isNearMeSection) {
        return false;
      }
      return (
        (!this.isLoading && !this.realRestaurants.length) ||
        this.isPromptGeoPermission
      );
    },
    isNearMeSection() {
      return this.type === "near-me" ? true : false;
    },
    sectionTitle() {
      if (this.isNearMeSection) {
        return this.$t("nearMeRestaurant");
      }
      return this.$t("freeDeliveryJustForYou");
    },
    clevertapEventName() {
      if (this.isNearMeSection) {
        return this.$t("nearMeRestaurant", "en");
      }
      return this.$t("freeDeliveryJustForYou", "en");
    },
    restaurants() {
      if (this.realRestaurants.length && this.isLoading === false) {
        return this.realRestaurants;
      }
      return this.dummyRestaurants;
    },
    isPromptGeoPermission() {
      return this.geoLocationPermition === "prompt";
    },
    isDeniedGeoPermission() {
      return this.geoLocationPermition === "denied";
    },
    isAllowedGeoPermission() {
      return this.geoLocationPermition === "granted";
    },
    selectedAddressName() {
      try {
        const { placeName, detail } = this.userLocation;
        if (placeName && placeName.length) {
          return placeName;
        } else if (detail && detail.length) {
          const split = detail.split(",");
          return split[0];
        }
        return "";
      } catch (err) {
        return "";
      }
    },
  },
  watch: {
    isVisible: {
      handler(newVal) {
        if (newVal === true && this.isAllowedGeoPermission) {
          this.requestGeoPermission();
        }
      },
    },
    lat: {
      handler() {
        this.getNearMeRestaurant();
      },
    },
  },
  mounted() {
    this.initDummyRestaurant();
    this.loadPickLocation();
  },
  methods: {
    requestGeoPermission() {
      this.$emit("on-request-geo-permission");
    },
    initDummyRestaurant() {
      const dummyCount = this.isDesktop ? 5 : 2;
      let dummys = [];
      for (let i = 0; i < dummyCount; i++) {
        const dummy = initDummyRestaurant();
        dummys.push(dummy);
      }
      this.dummyRestaurants = Object.freeze(dummys);
    },
    visibilityChanged(visibility) {
      if (visibility === true) {
        this.isVisible = true;
      }
    },
    async getNearMeRestaurant() {
      try {
        this.realRestaurants = [];
        this.getRealRestaurant(this.lat, this.lng);
      } catch (err) {
        this.$alert.info(err.message);
      }
    },
    locationPicked(location) {
      try {
        const { placeName, detail, lat, lng } = location;
        if (!location || location.isBrowserLocation) {
          return;
        }
        this.$emit("on-location-picked", { lat, lng, placeName, detail });
      } catch (err) {
        this.$alert.info(err.message);
      }
    },
    async getRealRestaurant(lat, lng) {
      try {
        if (!lat && !lng) {
          return;
        }
        this.isLoading = true;
        let result;
        if (this.isNearMeSection) {
          result = await searchRestaurant({
            location: { lat, lng },
            pageSize: 20,
          });
        } else {
          result = await getSectionData({ order: 14, lat: lat, lng: lng });
        }
        if (result.isSuccess) {
          this.isLoading = false;
          if (result.data && result.data.length) {
            this.realRestaurants = result.data;
            this.realRestaurants.forEach((restaurant) => {
              // add custom property to restaurant object
              if (this.isNearMeSection) {
                restaurant.isNearMe = true;
              }
            });
            generateRestaurantDeliveryFee(this.realRestaurants, { lat, lng });
          }
        } else {
          if (result.message) {
            this.$alert.error(result.message);
          }
        }
      } catch (err) {
        if (err.message) {
          this.$alert.error(err.message);
        }
      }
    },
    trackRestaurantClicked(param) {
      if (param.index !== undefined && param.restaurant) {
        const listingIndex = param.index + 1;
        const id = param.restaurant.id || param.restaurant.branchId;
        const url = `${window.location.origin}${param.restaurant.link.value}`;
        this.$track(
          "HOME_SECTION_TAPPED",
          {
            homeSectionID: id.toString(),
            homeSectionType: param.restaurant.type,
            homeSectionName: this.clevertapEventName,
            homeSectionOrder: this.homeSectionOrder,
            homeSectionListingName: param.restaurant.name,
            homeSectionListingOrder: listingIndex,
            homeSectionURL: url,
          },
          true
        );
      }
    },
    async loadPickLocation() {
      let moduleRequest;
      try {
        moduleRequest = await this.$useLazyImport(() =>
          import(
            /* webpackChunkName: "PickLocationChunk" */ "@/components/Shared/Pick Location/PickLocation"
          )
        );
        this.pickLocationComponent = moduleRequest.default;
      } catch (err) {
        this.$rollbar.error(err);
        // if chunkg load error happen
        this.$alert.error(
          "Oops, error when loading near me restaurant section, please refresh"
        );
      }
    },
  },
  i18n: {
    messages: {
      en: {
        allow: "allow",
        noRestaurantNearMeTitle: "There are no restaurants near you",
        noRestaurantNearMeSubTitle:
          "You can use our search bar to find your favourite restaurants!",
        offerRestaurantNearMeServiceTitle: "We can offer a restaurant near you",
        offerRestaurantNearMeServiceSubTitle:
          "Please allow access to your location.",
        changeLocation: "change location",
      },
      th: {
        allow: "อนุญาต",
        noRestaurantNearMeTitle: "ไม่มีร้านอาหารใกล้คุณ",
        noRestaurantNearMeSubTitle:
          "คุณสามารถใช้แถบค้นหาของเรา เพื่อค้นหาร้านอาหารที่คุณชื่นชอบ",
        offerRestaurantNearMeServiceTitle: "เราสามารถเสนอร้านอาหารใกล้คุณ",
        offerRestaurantNearMeServiceSubTitle:
          "โปรดอนุญาตให้เข้าถึงตำแหน่งของคุณ",
        changeLocation: "เปลี่ยนตำแหน่ง",
      },
    },
  },
};
</script>
