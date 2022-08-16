<template>
  <div :class="pendingBookings && pendingBookings.length ? 'my-4 py-2' : null">
    <component
      :is="selectedComponent"
      v-for="pending in pendingBookings"
      :key="pending.id"
      v-bind="buildProps(pending)"
      class="mb-4"
      @on-book-now-clicked="continuePendingBooking"
    />
  </div>
</template>

<script>
import {
  getPendingBookingList,
  continuePendingBooking,
  pendingBookings,
  isLodingGetRestaurantData,
} from "@/composable/pendingBooking";
import { mapState, mapGetters } from "vuex";

export default {
  setup() {
    return {
      getPendingBookingList,
      continuePendingBooking,
      pendingBookings,
      isLodingGetRestaurantData,
    };
  },
  data() {
    return {
      selectedComponent: "",
    };
  },
  computed: {
    ...mapState("user", ["accessToken"]),
    ...mapGetters("user", ["isUserSignedIn"]),
  },
  watch: {
    isUserSignedIn: {
      handler() {
        getPendingBookingList(this.accessToken || "");
      },
      immediate: true,
    },
  },
  mounted() {
    this.isLodingGetRestaurantData = false;
    this.getComponent();
  },
  methods: {
    async getComponent() {
      let moduleRequest;
      try {
        if (this.isMobile) {
          moduleRequest = await this.$useLazyImport(() =>
            import(
              /* webpackChunkName: "PendingBookingViewMobile" */ "./PendingBookingViewMobile"
            )
          );
          this.selectedComponent = moduleRequest.default;
        } else {
          moduleRequest = await this.$useLazyImport(() =>
            import(
              /* webpackChunkName: "PendingBookingViewDesktop" */ "./PendingBookingViewDesktop"
            )
          );
          this.selectedComponent = moduleRequest.default;
        }
      } catch (err) {
        this.$rollbar.error(err);
        // if chunkg load error happen
        this.$alert.error("Oops, error when loading the page, please refresh");
      }
    },
    buildProps(pendingBooking) {
      const {
        anyDeliveryPackage,
        anyDineInPackage,
        anyXperiencePackage,
        primaryCuisine,
        primaryLocation,
        lastBookingWasMade,
        name,
        logo,
        totalLocations,
        imageCoverUrl,
        reviewsCount,
        reviewsScore,
        totalCovers,
      } = pendingBooking.restaurantData;
      const { date, startTime, adult, kids, packageData, serviceType } =
        pendingBooking;
      return {
        id: pendingBooking.id,
        cuisine: primaryCuisine.name,
        location: primaryLocation.name,
        totalLocations: totalLocations,
        anyDineInPackage: anyDineInPackage,
        anyDeliveryPackage: anyDeliveryPackage,
        anyXperiencePackage: anyXperiencePackage,
        lastOrder: lastBookingWasMade,
        restaurantCover: imageCoverUrl.original,
        restaurantName: name,
        restaurantIcon: logo,
        selectedDate: date,
        selectedTime: startTime,
        adult: adult,
        kids: kids,
        packages: packageData,
        isDelivery: serviceType === "dine-in" ? false : true,
        reviewsScore: reviewsScore,
        reviewsCount: reviewsCount,
        isLoadingGetRestaurantData: this.isLodingGetRestaurantData,
        totalCovers: totalCovers,
      };
    },
  },
};
</script>
