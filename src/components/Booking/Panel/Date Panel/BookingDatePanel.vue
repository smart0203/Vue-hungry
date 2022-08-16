<template>
  <div class="w-full date-panel-container">
    <div v-if="initialLoading">
      <div
        class="flex items-center justify-center mx-auto no-dates-found-container"
      >
        <div class="loader"></div>
        <span class="ml-2 text-sm capitalize">{{ $t("pleaseWait") }}</span>
      </div>
    </div>
    <template v-else>
      <h4 class="my-3 font-bold text-center capitalize lg:my-6 lg:mt-2 lg:mb-3">
        {{ selectDateTimeTitle }}
      </h4>
      <BookingSelectPreferedTime
        v-if="canChooosePreferedTime"
        @on-prefered-time-selected="selectPreferedOrderTime"
      />
      <BookingDatePanelView
        v-if="showCalendar"
        v-bind="propsBind"
        @on-days-rendered="onRendered"
        @on-month-changed="monthChanged"
      />
    </template>
  </div>
</template>

<script>
import BookingSelectPreferedTime from "./BookingSelectPreferedTime";
import BookingDatePanelView from "./BookingDatePanelView";
import { mapFields } from "vuex-map-fields";
import { mapGetters, mapState } from "vuex";
import PanelMixin from "../PanelMixin";
import chunk from "lodash-es/chunk";
import cloneDeep from "lodash-es/cloneDeep";
import { ORDER_LATER, ORDER_NOW } from "@/lib/constant";
export default {
  name: "BookingDatePanel",
  components: {
    BookingDatePanelView,
    BookingSelectPreferedTime,
  },
  mixins: [PanelMixin],
  data() {
    return {
      isLoadingGetDates: false,
      isLoadingGetTimes: false,
      initialLoading: false,
      isShowBookedWarning: false,
      expiryDate: "",
      restaurantId: "",
      restaurantName: "",
      restaurantCanonicalLink: "",
      adult: 0,
      kids: 0,
      preferedDate: "",
      latestAvailableDate: "",
    };
  },
  computed: {
    ...mapFields("booking", ["selectedDate", "selectedTime"]),
    ...mapGetters("booking", [
      "isDineIn",
      "canSkipSelectTime",
      "bookingSummaryText",
      "isFlowSelectDateFirst",
    ]),
    ...mapGetters("bookingPackage", ["getSelectedPackage"]),
    ...mapFields("bookingDateTime", [
      "enableDates",
      "bookedDates",
      "checkedMonths",
      "currentMonth",
      "preferedOrderTime",
    ]),
    ...mapState("bookingDateTime", [
      "isTodayAvailableForBooking",
      "todayFastestBookingTime",
    ]),
    ...mapGetters("bookingDateTime", ["anyAvailableDates"]),
    canChooosePreferedTime() {
      if (this.isTodayAvailableForBooking && this.isDineIn === false) {
        if (this.isMobile) {
          if (this.preferedOrderTime === "") {
            return true;
          }
          return false;
        } else {
          return true;
        }
      }
      return false;
    },
    showCalendar() {
      if (this.isDineIn) {
        return true;
      } else {
        if (this.preferedOrderTime === ORDER_LATER) {
          return true;
        }
        return false;
      }
    },
    isCurrentMonthAvailable() {
      if (this.currentMonth === -1) {
        return true;
      }
      const filterCurrentMonth = this.enableDates.filter((date) => {
        return this.$dayjs(date, "YYYY-MM-DD").month() === this.currentMonth;
      });
      return filterCurrentMonth.length > 0 ? true : false;
    },
    minSelectableDate() {
      return this.$dayjs().format("YYYY-MM-DD");
    },
    maxSelectableDate() {
      return this.$dayjs(this.expiryDate).format("YYYY-MM-DD");
    },
    selectDateTimeTitle() {
      if (this.isDesktop) {
        return this.isDineIn
          ? this.$t("selectDineInTime")
          : this.$t("selectDeliveryTime");
      } else {
        if (this.isTodayAvailableForBooking && this.preferedOrderTime === "") {
          return this.$t("selectOrderTime");
        }
        return this.isDineIn
          ? this.$t("selectDineInTime")
          : this.$t("selectDeliveryTime");
      }
    },
    selectedPackagesName() {
      return this.getSelectedPackage.map((pack) => pack.name).join(",");
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
      return {
        isDineIn: this.isDineIn,
        selectBookingDate: this.selectBookingDate,
        enableDates: this.enableDates,
        bookedDates: this.bookedDates,
        isShowBookedWarning: this.isShowBookedWarning,
        minSelectableDate: this.minSelectableDate,
        maxSelectableDate: this.maxSelectableDate,
        restaurantExpiryDate: this.latestAvailableDate,
        showRestaurantExpiryDate: this.sortedPackagesExpiredDate.length === 0,
        showPackageExpired: this.sortedPackagesExpiredDate.length > 0,
        packageExpired: this.sortedPackagesExpiredDate,
        summary: this.bookingSummaryText,
        showSummary: true,
        isLoadingGetDates: this.isLoadingGetDates,
        currentMonth: this.currentMonth,
        isCurrentMonthAvailable: this.isCurrentMonthAvailable,
        checkedMonths: this.checkedMonths,
      };
    },
  },
  watch: {
    currentMonth(newVal) {
      if (newVal + 1 == this.preferedDate.month) {
        this.isShowBookedWarning = true;
        return;
      }
      this.isShowBookedWarning = false;
    },
    selectedPackagesName() {
      if (this.isDineIn && this.isFlowSelectDateFirst) {
        this.initialLoading = true;
        this.$store.commit("bookingDateTime/resetAllState");
        this.$nextTick(() => {
          setTimeout(() => {
            this.initialLoading = false;
          }, 250);
        });
        return;
      }
      this.$store.commit("bookingDateTime/resetAllState");
      this.$store.dispatch("booking/changeStep", 1);
    },
  },
  created() {
    this.setData();
  },
  async mounted() {
    await this.initialFetch();
    this.parseLatestAvailableDate();
  },
  methods: {
    setData() {
      const bookingState = cloneDeep(this.$store.state.booking);
      const restaurantState = cloneDeep(this.$store.state.restaurant);
      this.expiryDate = restaurantState.restaurantData.expiryDate;
      this.restaurantId = restaurantState.restaurantId;
      this.restaurantName = restaurantState.restaurantName;
      this.restaurantCanonicalLink = restaurantState.restaurantCanonicalLink;
      this.adult = bookingState.adult;
      this.kids = bookingState.kids;
    },
    async initialFetch() {
      if (this.isDineIn) {
        this.initialLoading = true;
        this.initialLoading = false;
      } else {
        try {
          this.initialLoading = true;
          await this.checkRestaurantOrderNowSupport();
          await this.fetchTodayAvailableDateTimes();
          this.checkIfOrderNowIsAvailable();
          this.initialLoading = false;
        } catch (err) {
          this.$rollbar.error(err);
        }
      }
    },
    onRendered(rendered) {
      this.setCheckedMonth(rendered.renderedMonth);
      this.fetchAvailableDatesPerMonth(rendered.renderedDates);
    },
    async fetchAvailableDatesPerMonth(rendredDates) {
      // start loading
      this.isLoadingGetDates = true;
      let activeDates = [];
      const dateRequestChunks = [];
      // get active date ( which is not before today)
      activeDates = rendredDates.filter((day) => {
        const dayInstance = this.$dayjs(day);
        const today = this.$dayjs();
        const isNotBeforeToday = !dayInstance.isBefore(today, "day");
        return isNotBeforeToday;
      });
      // split all active days to chunk with 7 days max per chunk
      const chunks = chunk(activeDates, 7);
      // if last index of chunk contain date less than 4 then merge it with previous chunk
      const lastIndex = chunks.length - 1;
      const lastChunk = chunks[lastIndex];
      if (chunks.length > 1 && lastChunk.length <= 4) {
        chunks[lastIndex - 1] = chunks[lastIndex - 1].concat(lastChunk);
        chunks.pop();
      }
      chunks.forEach((chunk) => {
        // create date request per chunk
        // start date is first date in chunk, end date is last date in chunk
        const startDate = this.$dayjs(chunk[0]).format("YYYY-MM-DD");
        const endDate = this.$dayjs(chunk[chunk.length - 1]).format(
          "YYYY-MM-DD"
        );
        dateRequestChunks.push({
          startDate,
          endDate,
        });
      });
      await this.$store.dispatch(
        "bookingDateTime/fetchAvailableDatesPerMonth",
        dateRequestChunks
      );
      this.isLoadingGetDates = false;
    },
    async checkRestaurantOrderNowSupport() {
      try {
        const request = await this.$store.dispatch(
          "restaurant/checkRestaurantOrderNowSupport"
        );
        if (!request.isSuccess) {
          this.$alert.error(request.message);
        }
      } catch (err) {
        this.$rollbar.error(err);
      }
    },
    async fetchTodayAvailableDateTimes() {
      try {
        await this.$store.dispatch(
          "bookingDateTime/fetchTodayAvailableDateTimes"
        );
      } catch (err) {
        this.$alert.error(err);
      }
    },
    async selectBookingDate(newSelectedDate) {
      try {
        let newStep = 3;
        const newSelectedDateDayJs = this.$dayjs(newSelectedDate);
        const formatedNewSelectedDate =
          newSelectedDateDayJs.format("YYYY-MM-DD");
        if (!newSelectedDateDayJs.isValid()) {
          this.$alert.error(
            "Oops, something went wrong, failed to select date"
          );
          this.$rollbar.error("User select invalid date", { newSelectedDate });
          return;
        }
        if (this.bookedDates.includes(formatedNewSelectedDate)) {
          this.preferedDate = {
            day: newSelectedDateDayJs.format("DD"),
            month: newSelectedDateDayJs.format("M"),
            year: newSelectedDateDayJs.format("YYYY"),
          };
          this.isShowBookedWarning = true;
          return;
        }
        this.selectedDate = newSelectedDate;
        if (this.canSkipSelectTime && this.getSelectedPackage.length) {
          newStep = this.isFlowSelectDateFirst ? 4 : 5;
          const packageDefaultStartTime =
            this.getSelectedPackage[0].defaultStartTime;
          this.selectedTime = packageDefaultStartTime;
          await this.$store.dispatch("booking/createBookingLocking");
        }
        this.$store.dispatch("booking/changeStep", newStep);
        // scroll to top if in mobile
        this.mobileScrollToTop();
        this.track();
      } catch (err) {
        this.$rollbar.error(
          "Oops, something went wrong, cannot select date",
          err
        );
      }
    },
    parseLatestAvailableDate() {
      const exp = this.expiryDate;
      if (exp.length) {
        const expDate = this.$dayjs(exp, "YYYY-MM-DD");
        if (expDate.isValid()) {
          this.latestAvailableDate = expDate.format("DD-MM-YYYY");
        } else {
          this.$rollbar.error("Invalid restaurant Exp Date", {
            restaurantId: this.restaurantId,
          });
        }
      } else {
        this.$rollbar.error("Invalid restaurant Exp Date", {
          restaurantId: this.restaurantId,
        });
      }
    },
    track() {
      this.$track("BOOKING_STEP_DATE_SELECTED", {
        userID: this.$store.state.user.id,
        bookingAdult: this.adult,
        bookingKids: this.kids,
        bookingDate: this.$dayjs(this.selectedDate).format("YYYY-MM-DD"),
        restaurantId: this.restaurantId,
        restaurantName: this.$store.getters["restaurant/restaurantNameEn"],
        restaurantCanonicalLink: this.restaurantCanonicalLink,
      });
    },
    checkIfOrderNowIsAvailable() {
      if (this.isTodayAvailableForBooking == false) {
        this.selectPreferedOrderTime(ORDER_LATER);
      } else {
        this.preferedOrderTime = "";
      }
    },
    async selectPreferedOrderTime(val) {
      if (this.preferedOrderTime != val) {
        this.preferedOrderTime = val;
        if (val === ORDER_NOW) {
          this.selectedDate = this.$dayjs().toDate();
          this.selectedTime = this.todayFastestBookingTime;
          await this.$store.dispatch("booking/createBookingLocking");
          setTimeout(() => {
            this.$store.dispatch("booking/changeStep", 5);
          }, 200);
        }
      }
    },
    monthChanged(month) {
      this.currentMonth = month;
    },
    setCheckedMonth(month) {
      this.currentMonth = month;
      if (this.checkedMonths.includes(month) === false) {
        this.checkedMonths.push(month);
      }
    },
  },
};
</script>
<style scoped>
.no-dates-found-container {
  height: 250px;
}
.date-panel-container {
  min-height: 300px;
}
@screen lg {
  .date-panel-container {
    min-height: auto;
  }
}
</style>
