<template>
  <div class="w-full h-screen">
    <div
      id="hh-map"
      class="flex items-center justify-center w-full h-screen bg-gray-100"
    >
      <div class="mr-2 loader"></div>
      <div class="text-sm capitalize">{{ $t("pleaseWait") }}</div>
    </div>
    <!-- this component used for google info window pop up -->
    <div class="hidden">
      <HHMapInfoWindow
        id="restaurant-gmaps-info-window"
        class="mb-2"
        :is-lazy-load="false"
        :logo="restaurant.logo"
        :link="restaurant.link.value"
        :image="restaurant.imageCoverUrl.original"
        :name="restaurant.name"
        :cuisine="restaurant.primaryCuisine.name"
        :location="restaurant.primaryLocation.name"
        :reviews-score="restaurant.reviewsScore"
        :reviews-count="restaurant.reviewsCount"
        :total-locations="restaurant.totalLocations"
        :any-dine-in-package="restaurant.anyDineInPackage"
        :any-delivery-package="restaurant.anyDeliveryPackage"
        :tags="restaurant.tags"
        :is-loading="isLoading"
        :is-staycation="restaurant.isStaycation"
        :is-new-restaurant="restaurant.isNewRestaurant"
        :last-booking="restaurant.lastBookingWasMadeCTA"
        :package-price="restaurant.price.amount"
        :package-pricing-type="restaurant.pricingType"
        :expiry-date="restaurant.expiryDate"
        :opening-hours-short="restaurant.openingHoursShort"
      />
    </div>
  </div>
</template>

<script>
import HHMapInfoWindow from "./HHMapInfoWindow";
import { initDummyRestaurant } from "@/services/restaurant";
import isEmpty from "lodash-es/isEmpty";
import { mapState } from "vuex";
import retryableGetElement from "@/helper/retryableGetElementHelper";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
let mapsInfoWindow;
const MAP_DEFAULT_ZOOM_LEVEL = 9;
import { selectedCityId } from "@/composable/selectCity";

export default {
  components: {
    HHMapInfoWindow,
  },
  props: {
    restaurants: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  setup() {
    return {
      selectedCityId,
    };
  },
  data() {
    return {
      isLoading: true,
      mapInstance: null,
      restaurant: initDummyRestaurant(),
      arrayOfMarker: [],
      mapBound: null,
      markerImage: {},
    };
  },
  computed: {
    ...mapState(["isGoogleMapsScriptLoaded"]),
  },
  watch: {
    restaurants: {
      handler() {
        this.generateMarker();
        this.setMapToFitBound();
      },
    },
    selectedCityId: {
      handler() {
        window.scrollTo(0, 0);
        this.initMap();
      },
    },
    isGoogleMapsScriptLoaded: {
      async handler(newVal) {
        if (newVal) {
          this.initMap();
        }
      },
      immediate: true,
    },
  },
  methods: {
    async initMap() {
      try {
        const HHLogo = await require("@/assets/logo-new-transparent.png");
        this.markerImage = {
          url: HHLogo,
          scaledSize: new window.google.maps.Size(40, 40),
        };
        await this.drawMap();
        this.isLoading = false;
        this.generateMarker();
        this.setMapToFitBound();
      } catch (err) {
        this.$alert.error("Oops, something went wrong when initialize map");
        this.$rollbar.error(err);
      }
    },
    async drawMap() {
      const map = await retryableGetElement("#hh-map");
      const mapOptions = {
        zoom: MAP_DEFAULT_ZOOM_LEVEL,
        center: new window.google.maps.LatLng(13.742332, 100.512171),
        mapTypeId: window.google.maps.MapTypeId.TERRAIN,
        mapTypeControl: false,
        streetViewControl: false,
      };
      if (map) {
        this.mapInstance = new window.google.maps.Map(map, mapOptions);
        this.mapBound = new window.google.maps.LatLngBounds();
      }
    },
    generateMarker() {
      if (!this.isGoogleMapsScriptLoaded || this.isLoading) {
        return;
      }
      this.removePreviousMarker();
      this.restaurants.forEach((restaurant) => {
        if (restaurant.lat && restaurant.lng) {
          const position = new window.google.maps.LatLng(
            restaurant.lat,
            restaurant.lng
          );
          let marker = new window.google.maps.Marker({
            position,
            map: this.mapInstance,
            title: restaurant.name,
            icon: this.markerImage,
          });
          if (!isEmpty(this.mapBound)) {
            this.mapBound.extend(position);
          }

          // show & hide listener for info window
          marker.addListener("mouseover", () => {
            this.generateInfoWindow(restaurant);
            this.$nextTick(() => {
              this.openInfoWindow(marker);
            });
          });
          marker.addListener("mouseout", () => {
            this.closeInfoWindow();
          });
          marker.addListener("click", () => {
            if (this.isDesktop) {
              window.open(restaurant.link.value, "_blank");
              return;
            }
            this.closeInfoWindow();
            this.generateInfoWindow(restaurant);
            this.$nextTick(() => {
              this.openInfoWindow(marker);
            });
          });
          this.arrayOfMarker.push(marker);
        }
      });
      new MarkerClusterer({
        markers: this.arrayOfMarker,
        map: this.mapInstance,
      });
    },
    removePreviousMarker() {
      if (this.arrayOfMarker && this.arrayOfMarker.length) {
        // remove previous marker from map
        this.arrayOfMarker.forEach((marker) => {
          marker.setMap(null);
        });
        // empty the marker array
        this.arrayOfMarker = [];
      }
    },
    openInfoWindow(marker) {
      mapsInfoWindow.open(this.mapInstance, marker);
    },
    closeInfoWindow() {
      if (mapsInfoWindow) {
        mapsInfoWindow.close();
      }
    },
    generateInfoWindow(restaurant) {
      this.restaurant = restaurant;
      this.$nextTick(() => {
        const content = document.getElementById(
          "restaurant-gmaps-info-window"
        ).innerHTML;
        mapsInfoWindow = new window.google.maps.InfoWindow({
          content: content,
        });
      });
    },
    setMapToFitBound() {
      if (
        !isEmpty(this.mapBound) &&
        this.isGoogleMapsScriptLoaded &&
        !this.isLoading
      ) {
        this.mapInstance.setZoom(MAP_DEFAULT_ZOOM_LEVEL);
        this.mapInstance.fitBounds(this.mapBound);
      }
    },
  },
};
</script>

<style>
.gm-style-iw {
  max-width: 350px !important;
}

.gm-style img.main-image {
  max-width: 100%;
  height: 100%;
}
</style>
