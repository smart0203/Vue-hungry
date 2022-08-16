<template>
  <div class="flex flex-grow">
    <div
      v-if="isLoading"
      class="flex items-center justify-center flex-grow height-loading"
    >
      <div class="loader"></div>
      <span class="ml-2 text-sm capitalize">{{ $t("pleaseWait") }}</span>
    </div>
    <BookingSelectPackagePanel
      v-else
      :next-step="5"
      :available-packages="availablePackages"
      @on-back-clicked="onBackClickedHandler"
      @on-confirm-clicked="createBookingLocking"
    />
  </div>
</template>

<script>
import useLazyImport from "@/composable/useLazyImport";
import { splitPackagesByType } from "@/helper/PackageHelper";
import getAvailablePackages from "@/services/getAvailablePackages";
import { mapGetters, mapState } from "vuex";

export default {
  components: {
    BookingSelectPackagePanel: () =>
      useLazyImport(() =>
        import("@/components/Booking/Panel/Package Panel/BookingPackagePanel")
      ),
  },
  data() {
    return {
      isLoading: true,
      availablePackages: {},
    };
  },
  computed: {
    ...mapState("webConfig", ["config"]),
    ...mapState("restaurant", ["restaurantId"]),
    ...mapState("booking", ["adult", "kids", "selectedDate", "selectedTime"]),
    ...mapGetters("booking", ["isDineIn", "canSkipSelectTime"]),
    ...mapGetters("bookingPackage", ["getDineInPackage", "getSelectedPackage"]),
    ...mapGetters("inventorySummary", [
      "getInventorySummaries",
      "getSortPackages",
    ]),
  },
  mounted() {
    this.getPackages();
  },
  beforeDestroy() {
    this.toggleAllDineInPackage(true);
  },
  methods: {
    async getPackages() {
      this.isLoading = true;
      try {
        let selectedTime = null;
        if (this.canSkipSelectTime) {
          selectedTime = this.getSelectedPackage[0].defaultStartTime;
        } else {
          selectedTime = this.selectedTime;
        }
        let packageResult = await getAvailablePackages(
          this.$dayjs(this.selectedDate).format("YYYY-MM-DD"),
          selectedTime,
          this.adult,
          this.kids,
          false,
          true,
          this.restaurantId
        );

        this.$store.dispatch(
          "inventorySummary/comparePackagesWithInvSummaries",
          {
            packages: packageResult,
            limitedSeats: this.config.limitedSeatsShowing,
          }
        );
        if (this.getSortPackages.length) {
          packageResult = this.getSortPackages;
        }

        this.availablePackages = this.togglePackageBookable(packageResult);
        this.availablePackages = splitPackagesByType(this.availablePackages);
      } catch (err) {
        if (err) {
          this.$alert.error(err.message);
          this.$rollbar.error(err.message, { cause: err.cause });
        }
      } finally {
        this.isLoading = false;
      }
    },
    // disable package in vuex if that package id not match with package that come from user preference
    togglePackageBookable(packageResult) {
      if (packageResult.length > 0) {
        const packageBookableIds = packageResult.map(
          (availablePackage) => availablePackage.id
        );
        let bookablePackages = [];
        this.getDineInPackage.forEach((pack) => {
          if (
            packageBookableIds.includes(pack.id) === false ||
            (this.canSkipSelectTime && pack.typeCode !== "xp")
          ) {
            pack.isBookable = false;
            this.$store.commit("bookingPackage/removeSelectedPackage", pack.id);
          } else {
            bookablePackages.push(pack);
            pack.isBookable = true;
          }
        });
        return bookablePackages;
      } else {
        return this.toggleAllDineInPackage(false);
      }
    },
    toggleAllDineInPackage(isBookable) {
      let bookablePackages = [];
      this.getDineInPackage.forEach((pack) => {
        if (isBookable) {
          bookablePackages.push(pack);
        }
        pack.isBookable = isBookable;
      });
      return bookablePackages;
    },
    onBackClickedHandler() {
      if (this.canSkipSelectTime) {
        this.$store.dispatch("booking/changeStep", 2);
      } else {
        this.$store.dispatch("booking/changeStep", "back");
      }
    },
    createBookingLocking() {
      this.$store.dispatch("booking/createBookingLocking");
    },
  },
};
</script>
<style scoped>
.height-loading {
  height: 250px;
}
</style>
