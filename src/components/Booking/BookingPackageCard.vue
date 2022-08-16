<template>
  <PackageCard
    :is-button-show="isButtonShow"
    :is-accept-many-quantity="packages.isAcceptManyQuantity"
    :is-accept-voucher="packages.isAcceptVoucher"
    :show-package-body="isShowPackageBody"
    :auto-show-package-body="autoShowPackageBody"
    :show-version="showVersion"
    :packages="packages"
    :is-selected-package="isSelectedPackage"
    :package-quantity="packages.quantity"
    :show-view-menu-button="showViewMenuButton"
    :book-button-text="bookButtonText"
    :adult="adult"
    :price="price"
    :free-delivery-radius="freeDeliveryRadius"
    :allow-show-price="allowShowPrice"
    :prefer-show-voucher-icon="preferShowVoucherIcon"
    @on-package-increased="increasePackageQuantity"
    @on-package-decreased="decreasePackageQuantity"
    @on-package-selected="selectPackage"
    @on-package-body-toggled="packageBodyToggled"
  />
</template>

<script>
import { convertToNumber } from "@/helper/stringHelper";
import { packagePricingRule as determinePackageRule } from "@/helper/PackageHelper";
import sortBy from "lodash-es/sortBy";
import { PACKAGE_CODE_HAH } from "@/lib/constant";
import { isValid as isValidCorporateBooking } from "@/composable/corporateEvent";
import useLazyImport from "@/composable/useLazyImport";
export default {
  components: {
    PackageCard: () =>
      useLazyImport(() =>
        import("@/components/Package/Package-Card/PackageCard.vue")
      ),
  },
  props: {
    packages: {
      type: Object,
      required: true,
    },
    showVersion: {
      type: String,
      required: true,
      validator(value) {
        return ["desktop", "mobile"].indexOf(value) !== -1;
      },
    },
    isButtonShow: {
      type: Boolean,
      default: true,
    },
    bookButtonText: {
      type: Object,
      default: null,
    },
    selectPackageGuard: {
      type: Function,
      default: () => {
        return true;
      },
    },
    adult: {
      type: Number,
      default: 0,
    },
    autoShowPackageBody: {
      type: Boolean,
      default: true,
    },
    preferShowVoucherIcon: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      price: "",
      showViewMenuButton: true,
      freeDeliveryRadius: 0,
    };
  },
  computed: {
    isSelectedPackage() {
      return this.packages.quantity > 0 ? true : false;
    },
    isShowPackageBody() {
      if (this.isSelectedPackage && this.packages.isHaveMenu) {
        return true;
      }
      return false;
    },
    allowShowPrice() {
      return !isValidCorporateBooking.value;
    },
  },
  created() {
    this.$set(this.packages, "selectedPrice", this.determinePackageRule());
    this.determineFreeDeliveryRadius();
  },
  methods: {
    determinePackageRule() {
      if (this.packages.rules.length) {
        // return low to high price if adult not set
        if (!this.adult || this.adult === 0) {
          const sorted = sortBy(this.packages.rules, (rule) => {
            return convertToNumber(rule.price);
          });
          return sorted[0].price;
        }
        const rule = determinePackageRule(
          { adult: this.adult },
          this.packages.rules
        );
        return rule.price;
      }
      return 0;
    },
    determineFreeDeliveryRadius() {
      if (this.packages.typeCode !== PACKAGE_CODE_HAH) {
        return;
      }
      const { deliveryPricingTier } =
        this.$store.state.restaurant.restaurantData;
      let packagePrice = 0;
      if (this.packages.rules.length) {
        packagePrice = convertToNumber(
          this.packages.rules[this.packages.rules.length - 1].price
        );
      }

      if (Array.isArray(deliveryPricingTier)) {
        deliveryPricingTier.forEach((tier) => {
          if (packagePrice >= convertToNumber(tier.startRatePrice)) {
            this.freeDeliveryRadius = tier.freeDeliveryRadiusInKm;
            return;
          }
        });
      }
    },
    packageBodyToggled(isShow) {
      try {
        if (isShow) {
          const payload = {
            packageId: this.packages.id,
            packageName: this.packages.name,
            packageType: this.packages.typeName,
            packageDescription: this.packages.description,
            packageStartDate: this.packages.startDate,
            packageRestaurantId: this.$store.state.restaurant.restaurantId,
            packageEndDate: this.packages.endDate,
            packagePrice: this.price,
          };
          this.$track("VIEWED_RESTAURANT_PACKAGE", payload);
        }
      } catch (err) {
        this.$rollbar.error("Error when track event to rollbar", {
          eventName: "VIEWED_RESTAURANT_PACKAGE",
        });
      }
    },
    increasePackageQuantity() {
      this.$store.dispatch("bookingPackage/increasePackageQuantity", {
        packageId: this.packages.id,
      });
      this.$emit("on-package-increased");
    },
    decreasePackageQuantity() {
      this.$store.dispatch(
        "bookingPackage/decreasePackageQuantity",
        this.packages.id
      );
      this.$emit("on-package-decreased");
    },
    async selectPackage() {
      const defaultGuard = await this.$store.dispatch(
        "bookingPackage/selectPackageGuard",
        this.packages.id
      );
      const customGuard = await this.selectPackageGuard();
      const { isSuccess, meta } = defaultGuard;
      if (
        typeof meta.newPackagePreference === "string" &&
        meta.newPackagePreference.length
      ) {
        this.$store.commit("booking/setState", {
          state: "packagePreference",
          val: meta.newPackagePreference,
        });
      }
      if (meta.resetPackage) {
        this.$store.dispatch("bookingPackage/removeAllSelectedPackage");
      }
      if (meta.resetBookingFlow) {
        this.$store.dispatch("booking/initBookingFlow", this.isMobile);
      }
      if (customGuard === true && isSuccess === true) {
        this.$store.dispatch("bookingPackage/selectPackage", this.packages.id);
        this.$store.dispatch("booking/decideBookingMethod");
        this.$emit("on-package-selected");
        this.track();
      }
    },
    track() {
      const restaurantId = this.$store.state.restaurant.restaurantId;
      const restaurantName = this.$store.getters["restaurant/restaurantNameEn"];
      const restaurantCanonicalLink =
        this.$store.state.restaurant.restaurantCanonicalLink;
      const restaurantCuisine =
        this.$store.state.restaurant.restaurantData.cuisine;
      this.$track("BOOKING_STEP_PACKAGE_SELECTED", {
        restaurantId: restaurantId,
        restaurantName: restaurantName,
        restaurantCanonicalLink: restaurantCanonicalLink,
        restaurantCuisine: restaurantCuisine,
        packageId: this.packages.id,
        packageName: this.packages.name,
        packageType: this.packages.typeName,
        packagePrice: this.packages.selectedPrice,
        packageQuantity: this.packages.quantity || 0,
      });
    },
  },
};
</script>
