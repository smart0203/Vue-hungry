<template>
  <div class="">
    <div v-if="showRestaurantExpiryDate" class="mb-4 text-xs text-center">
      <span class="mr-1">{{ $t("promotionExpDate") }}</span>
      <span class="mr-1">:</span>
      <span>{{ restaurantExpiryDate }}</span>
    </div>
    <!-- calendar panel -->
    <div class="my-8 lg:mt-4 lg:mb-4">
      <div class="">
        <!-- loading get dates loading -->
        <div
          v-if="isLoadingGetDates"
          class="flex items-center justify-center mb-4"
        >
          <div class="mr-2 loader small"></div>
          <span class="text-sm text-gray-700"
            >Checking {{ currentMonthName }} Available Dates</span
          >
        </div>

        <div class="relative lg:ml-4">
          <div class="date-picker"></div>
          <div
            v-if="isShowBookedWarning"
            class="mt-4 text-lg text-center capitalize text-red-dark"
          >
            {{ $t("fullyBooked") }}
          </div>
          <div
            v-if="showSummary"
            class="mt-4 text-sm font-semibold text-center capitalize"
          >
            {{ summary }}
          </div>
          <div
            v-if="showPackageExpired"
            class="mt-2 text-xs text-center capitalize"
          >
            {{ `${$t("packageExpired")}: ${packageExpired}` }}
          </div>

          <!-- no available date found message -->
          <div
            v-if="!isLoadingGetDates && !isCurrentMonthAvailable"
            class="absolute flex items-center justify-center w-full"
            style="top: 30%"
          >
            <div
              class="w-9/12 pb-3 text-xs text-center rounded-lg text-red-dark bg-red-pink"
            >
              <div class="py-3 font-bold" v-html="$t('noAvailableDate')"></div>
              <button
                class="inline-block rounded-full bg-red-dark"
                @click="noAvailableDateHandler"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="currentColor"
                  stroke="currentColor"
                  class="inline m-2 text-white icon-chevron-right"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    stroke-width="2"
                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Thai } from "flatpickr/dist/l10n/th.js";
import { ORDER_NOW, ORDER_LATER, ROUTE_SEARCH_PAGE } from "@/lib/constant";
import isEmpty from "lodash-es/isEmpty";

export default {
  props: {
    isLoadingGetDates: {
      type: Boolean,
      default: false,
    },
    isDineIn: {
      type: Boolean,
      required: true,
      default: false,
    },
    showSummary: {
      type: Boolean,
      default: false,
    },
    summary: {
      type: String,
    },
    showRestaurantExpiryDate: {
      type: Boolean,
      default: false,
    },
    restaurantExpiryDate: {
      type: String,
      default: "",
    },
    showPackageExpired: {
      type: Boolean,
      default: false,
    },
    packageExpired: {
      type: String,
      default: "",
    },
    enableDates: {
      type: Array,
      required: true,
    },
    bookedDates: {
      type: Array,
      required: true,
    },
    currentMonth: {
      type: Number,
      required: true,
    },
    checkedMonths: {
      type: Array,
      required: true,
    },
    minSelectableDate: {
      type: String,
      required: true,
    },
    maxSelectableDate: {
      type: String,
      required: true,
    },
    selectBookingDate: {
      type: Function,
      default() {
        return;
      },
    },
    isCurrentMonthAvailable: {
      type: Boolean,
      required: true,
    },
    isShowBookedWarning: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ORDER_NOW,
      ORDER_LATER,
      calendar: null,
    };
  },
  computed: {
    currentMonthName() {
      if (this.currentMonth) {
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        return monthNames[this.currentMonth];
      }
      return "";
    },
    selectableDates() {
      return [...this.bookedDates, ...this.enableDates];
    },
    isLastMonthForRestaurant() {
      const restaurantExpiryDate = this.restaurantExpiryDate.length
        ? this.$dayjs(this.restaurantExpiryDate, "DD-MM-YYYY")
        : false;
      if (!restaurantExpiryDate) {
        return false;
      }
      const restaurantExpiryDateMonth = restaurantExpiryDate.format("M");
      return this.currentMonth === parseInt(restaurantExpiryDateMonth) - 1
        ? true
        : false;
    },
    noAvailableDatesAlert() {
      const restaurantExpiryDate = this.restaurantExpiryDate.length
        ? this.$dayjs(this.restaurantExpiryDate, "DD-MM-YYYY")
        : false;
      if (!restaurantExpiryDate) {
        return this.$t("noAvailableDate");
      }
      return this.isLastMonthForRestaurant
        ? this.$t("noAvailableDateAndExpired")
        : this.$t("noAvailableDate");
    },
  },
  watch: {
    selectableDates(val) {
      if (val.length) {
        this.redrawCalendar();
      }
    },
  },
  mounted() {
    this.inintCalendar();
  },
  methods: {
    inintCalendar() {
      // reset active month to false
      this.$emit("on-month-changed", -1);
      this.destroyCalendar();
      this.$nextTick(() => {
        const minSelectableDate = this.minSelectableDate;
        const maxSelectableDate = this.maxSelectableDate;
        const lang = this.$store.state.lang === "th" ? Thai : "en";
        let renderedDates = [];
        let count = 0;
        this.calendar = flatpickr(".date-picker", {
          locale: { ...lang, firstDayOfWeek: 0 },
          inline: true,
          monthSelectorType: "static",
          minDate: minSelectableDate,
          maxDate: maxSelectableDate,
          enable: [
            (date) => {
              const formatedDate = this.$dayjs(date).format("YYYY-MM-DD");
              return this.selectableDates.includes(formatedDate) ? true : false;
            },
          ],
          onChange: (selectedDates) => {
            if (!this.isLoadingGetDates) {
              this.selectBookingDate(selectedDates[0]);
            }
          },
          onMonthChange: (_, __, flatpickrInstance) => {
            this.$emit("on-month-changed", flatpickrInstance.currentMonth);
          },
          onDayCreate: (dObj, dStr, flatpickrInstance, dayElem) => {
            // set to array in 'count' index
            const currentDate = this.$dayjs(dayElem.dateObj).format(
              "YYYY-MM-DD"
            );
            const isDateBooked = this.bookedDates.includes(currentDate);
            const isAvailableDate = this.enableDates.includes(currentDate);

            if (isDateBooked) {
              dayElem.classList.add("fully-booked");
              dayElem.innerHTML += "<span class='event fully-booked'></span>";
            } else if (isAvailableDate) {
              dayElem.classList.add("available");
              dayElem.innerHTML += "<span class='event available'></span>";
            }
            renderedDates[count] = dayElem.dateObj;
            count += 1;
            // if count reach max of rendered date then emit 'on-day-rendered-event' then do fech
            if (count === 42) {
              // set count to 0 again to reset counter after month change
              count = 0;
              // emit event only if  month is different (prevent infinite loop)
              if (
                this.checkedMonths.includes(flatpickrInstance.currentMonth) ===
                  false &&
                flatpickrInstance.currentMonth != this.currentMonth
              ) {
                this.$emit("on-days-rendered", {
                  renderedDates: renderedDates,
                  renderedMonth: flatpickrInstance.currentMonth,
                });
              }
            }
          },
        });
      });
    },
    destroyCalendar() {
      if (this.calendar && this.calendar.destroy) {
        this.calendar.destroy();
      }
    },
    calendarGoToNextMonth() {
      if (isEmpty(this.calendar)) {
        return;
      }
      this.calendar.changeMonth(1);
    },
    redrawCalendar() {
      if (this.calendar.length !== 0) {
        this.calendar.set("enable", this.selectableDates);
      }
    },
    noAvailableDateHandler() {
      return this.isLastMonthForRestaurant
        ? this.$router.push({ name: ROUTE_SEARCH_PAGE })
        : this.calendarGoToNextMonth();
    },
  },
  i18n: {
    messages: {
      en: {
        fullyBooked: "Fully Booked",
        promotionExpDate: "Promotion Expiry Date",
      },
      th: {
        fullyBooked: "ที่นั่งเต็มแล้ว",
        promotionExpDate: "โปรโมชั่นหมดอายุวันที่",
      },
    },
  },
};
</script>
<style lang="scss">
// flatpickr override
.flatpickr-calendar {
  box-shadow: none;
}

.flatpickr-current-month .numInputWrapper {
  display: none;
}

.flatpickr-day {
  margin-top: 5px;
}
// overide next & prev day of month color in current monnth
.flatpickr-day.nextMonthDay:not([class="flatpickr-disabled"]),
.flatpickr-day.prevMonthDay:not([class="flatpickr-disabled"]) {
  color: black;
}

// overide next & prev day of month color in current monnth (hover)
.flatpickr-day.fully-booked.nextMonthDay:not([class="flatpickr-disabled"]):hover,
.flatpickr-day.fully-booked.prevMonthDay:not([class="flatpickr-disabled"]):hover {
  @apply text-white;
  @apply bg-red-dark;
  @apply border-red-dark;
}

.flatpickr-day.available.nextMonthDay:not([class="flatpickr-disabled"]):hover,
.flatpickr-day.available.prevMonthDay:not([class="flatpickr-disabled"]):hover {
  @apply text-white;
  @apply bg-green;
  @apply border-green;
}

// default next & prev day of month color in current monnth
.flatpickr-day.nextMonthDay.flatpickr-disabled,
.flatpickr-day.prevMonthDay.flatpickr-disabled {
  color: rgba(57, 57, 57, 0.1);
}

.flatpickr-day.nextMonthDay.flatpickr-disabled:hover,
.flatpickr-day.prevMonthDay.flatpickr-disabled:hover {
  color: rgba(57, 57, 57, 0.1);
  background: white;
  border-color: transparent;
}

.flatpickr-day.today:focus,
.flatpickr-day.today {
  border-color: transparent;
}

.flatpickr-day.fully-booked.selected,
.flatpickr-day.fully-booked.selected.nextMonthDay,
.flatpickr-day.fully-booked.selected.prevMonthDay,
.flatpickr-day.fully-booked.today:hover,
.flatpickr-day.fully-booked:hover,
.flatpickr-day.fully-booked.selected:hover {
  @apply text-white;
  @apply bg-red-dark;
  @apply border-red-dark;
}

.flatpickr-day.selected.available,
.flatpickr-day.selected.available.nextMonthDay,
.flatpickr-day.selected.available.prevMonthDay,
.flatpickr-day.available.today:hover,
.flatpickr-day.available:hover,
.flatpickr-day.selected.available:hover {
  @apply text-white;
  @apply bg-green;
  @apply border-green;
}

.flatpickr-calendar.inline {
  @apply mx-auto;
}

// to hide next month day in current month
.flatpickr-day.nextMonthDay {
  visibility: hidden;
}

.event {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 150px;
  bottom: 0px;
  left: calc(50% - 1.5px);
  content: " ";
  display: block;
  @apply bg-green;
}

.event.fully-booked {
  @apply bg-red-dark;
}
</style>
<i18n>
{
  "en": {
    "noAvailableDate": "Sorry, <br> we’re fully booked this month. <br> Please Click to see next month.",
    "noAvailableDateAndExpired": "Sorry, <br> we’re fully booked this month. <br> Click to see other restaurant."
  },
  "th": {
    "noAvailableDate": "ขออภัย <br> ที่นั่งเดือนนี้ถูกจองเต็มหมดแล้ว <br> กรุณากดปุ่มเพื่อเช็คเดือนถัดไป",
    "noAvailableDateAndExpired": "ขออภัย <br> ที่นั่งเดือนนี้ถูกจองเต็มหมดแล้ว <br> กรุณากดปุ่มเพื่อดูร้านอื่น"
  }
}
</i18n>
