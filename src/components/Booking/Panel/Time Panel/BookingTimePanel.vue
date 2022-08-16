<template>
  <div
    class="relative flex justify-center flex-1 time-panel-container"
    :class="isLoading ? 'items-center' : 'items-start'"
  >
    <div v-if="isLoading" class="flex items-center justify-center mx-auto">
      <div class="loader"></div>
      <span class="ml-2 text-sm capitalize">{{ $t("pleaseWait") }}</span>
    </div>
    <BookingTimePanelView
      v-else
      v-bind="propsBind"
      @on-date-clicked="toggleCalendarModal(true)"
    />
  </div>
</template>

<script>
import cloneDeep from "lodash-es/cloneDeep";
import PanelMixin from "../PanelMixin";
import { mapState, mapGetters } from "vuex";
import { mapFields } from "vuex-map-fields";
import useLazyImport from "@/composable/useLazyImport";
export default {
  components: {
    BookingTimePanelView: () =>
      useLazyImport(() => import("./BookingTimePanelView")),
  },
  mixins: [PanelMixin],
  data() {
    return {
      isLoading: true,
      restaurantId: "",
      restaurantName: "",
      restaurantCanonicalLink: "",
      expiryDate: "",
      isDineIn: false,
    };
  },
  computed: {
    ...mapFields("booking", ["selectedDate", "selectedTime"]),
    ...mapState("bookingDateTime", ["availableTime"]),
    ...mapGetters("bookingPackage", ["getSelectedPackage"]),
    anyAvailableTime() {
      return this.availableTime.length > 0 ? true : false;
    },
    maxSelectableDate() {
      return this.$dayjs(this.expiryDate).format("DD-MM-YYYY");
    },
    summary() {
      const adult = `${this.adult} ${this.$tc("adult", this.adult)}`;
      const kids =
        this.kids > 0 ? `${this.kids} ${this.$tc("kids", this.kids)}` : "";
      return `${adult} ${kids}`;
    },
    sortedPackagesExpiredDate() {
      const sorted = this.getSelectedPackage
        .map((pack) => pack.endDate)
        .sort(
          (date1, date2) =>
            this.$dayjs(date1, "YYYY-MM-DD").valueOf() -
            this.$dayjs(date2, "YYYY-MM-DD").valueOf()
        );
      return sorted.length > 0
        ? this.$dayjs(sorted[0], "YYYY-MM-DD").format("DD-MM-YYYY")
        : "";
    },
    propsBind() {
      const sortedAvailableTime = [...this.availableTime].sort();
      return {
        anyAvailableTime: this.anyAvailableTime,
        availableTime: sortedAvailableTime,
        selectedTime: this.selectedTime,
        selectedDate: this.$dayjs(this.selectedDate).format("ddd, D MMM"),
        showExpiryDate: this.sortedPackagesExpiredDate.length === 0,
        expiryDate: this.maxSelectableDate,
        showPackageExpired: this.sortedPackagesExpiredDate.length !== 0,
        packageExpired: this.sortedPackagesExpiredDate,
        selectTimeCallback: this.selectTime,
        isDineIn: this.isDineIn,
        backCallback: this.back,
        summary: this.summary,
        showSummary: true,
      };
    },
  },
  created() {
    this.setData();
  },
  mounted() {
    this.fetchAvailableTimes();
  },
  methods: {
    setData() {
      const bookingState = cloneDeep(this.$store.state.booking);
      const {
        restaurantData,
        restaurantId,
        restaurantName,
        restaurantCanonicalLink,
      } = this.$store.state.restaurant;
      this.restaurantName = restaurantName;
      this.restaurantId = restaurantId;
      this.restaurantCanonicalLink = restaurantCanonicalLink;
      this.expiryDate = restaurantData.expiryDate;
      this.adult = bookingState.adult;
      this.kids = bookingState.kids;
      this.isDineIn = this.$store.getters["booking/isDineIn"];
    },
    async selectTime(time) {
      this.selectedTime = time;
      await this.createBookingLocking();
      this.$emit("on-time-selected");
      // scroll to top if in mobile
      this.mobileScrollToTop();
      this.track();
    },
    async selectDate(date) {
      if (!this.$dayjs(date).isValid()) {
        this.$alert.error("Oops, something went wrong, failed to select date");
        this.$rollbar.error("User select invalid date", { date });
        return;
      }
      try {
        this.selectedDate = date;
        await this.fetchAvailableTimes();
        this.toggleCalendarModal();
      } catch (err) {
        this.$alert.error(err);
      }
    },
    back() {
      this.$emit("on-back-clicked");
      this.$store.commit("bookingDateTime/setState", {
        state: "availableTime",
        val: [],
      });
    },
    toggleCalendarModal(isOpen) {
      if (this.isMobile) {
        if (isOpen) {
          this.$modal.show("date-picker-modal");
        } else {
          this.$modal.hide("date-picker-modal");
        }
      }
    },
    track() {
      this.$track("BOOKING_STEP_TIME_SELECTED", {
        userID: this.$store.state.user.id,
        bookingAdult: this.adult,
        bookingKids: this.kids,
        bookingDate: this.$dayjs(this.selectedDate).format("YYYY-MM-DD"),
        bookingTime: this.selectedTime,
        restaurantId: this.restaurantId,
        restaurantName: this.$store.getters["restaurant/restaurantNameEn"],
        restaurantCanonicalLink: this.restaurantCanonicalLink,
      });
    },
    async fetchAvailableTimes() {
      try {
        this.isLoading = true;
        await this.$store.dispatch("bookingDateTime/fetchAvailableTimes");
      } catch (err) {
        if (err) {
          this.$alert.error(err);
        }
      } finally {
        this.isLoading = false;
      }
    },
    async createBookingLocking() {
      this.isLoading = true;
      await this.$store.dispatch("booking/createBookingLocking");
      this.isLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.time-panel-container {
  min-height: 250px;
  margin-bottom: 20px;
  @screen xl {
    min-height: 400px;
  }
}
</style>
