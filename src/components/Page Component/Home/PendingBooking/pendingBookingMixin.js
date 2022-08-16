import { lastReservationText } from "@/helper/restaurantHelper";
import { packagePricingType } from "@/helper/PackageHelper";

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    cuisine: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default() {
        return "";
      },
    },
    totalLocations: {
      type: Number,
      default() {
        return 0;
      },
    },
    anyDineInPackage: {
      type: Boolean,
      required: true,
    },
    anyDeliveryPackage: {
      type: Boolean,
      required: true,
    },
    anyXperiencePackage: {
      type: Boolean,
      required: true,
    },
    lastOrder: {
      type: String,
    },
    restaurantCover: {
      type: String,
      required: true,
    },
    restaurantIcon: {
      type: String,
      required: true,
    },
    restaurantName: {
      type: String,
      required: true,
    },
    selectedDate: {
      type: String,
      required: true,
    },
    selectedTime: {
      type: String,
      required: true,
    },
    adult: {
      type: Number,
      required: true,
    },
    kids: {
      type: Number,
      required: true,
    },
    packages: {
      type: Array,
      required: true,
    },
    isLoadingGetRestaurantData: {
      type: Boolean,
      required: true,
    },
    isDelivery: {
      type: Boolean,
      required: true,
    },
    reviewsScore: {
      required: true,
    },
    reviewsCount: {
      required: true,
    },
    totalCovers: {
      required: true,
    },
  },
  data() {
    return {
      lastOrderCTA: "",
    };
  },
  computed: {
    packageTypeSummary() {
      if (this.packages.length) {
        return this.packages[0].typeName;
      }
    },
    lang() {
      return this.$store.state.lang;
    },
  },
  mounted() {
    this.setLastOrderCTA();
  },
  methods: {
    packagePricingType,
    async setLastOrderCTA() {
      this.lastOrderCTA = await lastReservationText(
        this.lastOrder,
        this.reviewsCount,
        this.totalCovers
      );
    },
  },
};
