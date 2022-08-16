<template>
  <BookingPackageCard
    :show-version="version"
    :packages="packages"
    :book-button-text="bookButtonText"
    :prefer-show-voucher-icon="isAllPackAcceptVoucher"
    :auto-show-package-body="isAutoShowPackageBody"
    @on-package-selected="initBookingFlow"
    @on-package-decreased="packageDecreased"
  />
</template>

<script>
import { mapFields } from "vuex-map-fields";
import { mapGetters, mapState } from "vuex";
import { isDineInPackage } from "@/helper/PackageHelper";
import {
  PACKAGE_CODE_HAH,
  ROUTE_BUY_RESTAURANT_VOUCHER_SIDEBAR,
} from "@/lib/constant";
import useLazyImport from "@/composable/useLazyImport";
import { packageBookButton } from "@/helper/PackageHelper";

export default {
  components: {
    BookingPackageCard: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "BookingPackageCardChunk" */ "@/components/Booking/BookingPackageCard"
        )
      ),
  },
  props: {
    packages: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isAutoShowPackageBody: false,
    };
  },
  computed: {
    ...mapState("webConfig", ["config"]),
    ...mapGetters("bookingPackage", ["anySelectedPackages"]),
    ...mapGetters("restaurantPackages", ["isAllAcceptVoucher"]),
    ...mapGetters("inventorySummary", ["getInventorySummaries"]),
    ...mapFields("booking", [
      "selectedDate",
      "selectedTime",
      "packagePreference",
    ]),
    bookButtonText() {
      const { id, typeCode } = this.packages;
      return packageBookButton({
        inventorySummaries: this.getInventorySummaries,
        packageId: parseInt(id),
        packageType: typeCode,
        limitedSeatsShowing: this.config.limitedSeatsShowing,
      });
    },
    version() {
      return this.isDesktop ? "desktop" : "mobile";
    },
    isAllPackAcceptVoucher() {
      return this.isAllAcceptVoucher;
    },
  },
  created() {
    this.checkAutoShowPackageBody();
  },
  methods: {
    initBookingFlow() {
      if (
        this.isMobile ||
        this.$route.name === ROUTE_BUY_RESTAURANT_VOUCHER_SIDEBAR
      ) {
        try {
          this.$store.dispatch("booking/initBookingFlow", this.isMobile);
        } catch (err) {
          this.$rollbar.error(err);
        }
      }
    },
    packageDecreased() {
      try {
        if (
          this.packages.quantity === 0 &&
          this.packages.typeCode === PACKAGE_CODE_HAH &&
          this.anySelectedPackages === false
        ) {
          this.packagePreference = "";
        }
      } catch (err) {
        this.$rollbar.error(err);
      }
    },
    checkAutoShowPackageBody() {
      if (this.packages.isAlaCarte) {
        this.isAutoShowPackageBody = true;
        return;
      }
      this.isAutoShowPackageBody =
        this.isDesktop && isDineInPackage(this.packages.typeCode) === false;
    },
  },
};
</script>
<i18n>
{
  "en": {
    "packageNotAvailable": "This package not available for "
  },
  "th": {
    "packageNotAvailable": "แพ็คเกจนี้ในรอบที่จอง เต็มแล้วครับ"
  }
}
</i18n>
