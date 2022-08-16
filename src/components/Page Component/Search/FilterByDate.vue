<template>
  <div class="w-full mx-5 mb-6 lg:w-auto">
    <div class="flex flex-col mb-5">
      <div class="flex items-center justify-between capitalize">
        <span>{{ $t("today") }}</span>
        <HHRadioButton v-model="todaySelected" class="text-sm" />
      </div>
    </div>
    <div class="flex flex-col mb-5">
      <div class="flex items-center justify-between capitalize">
        <span>{{ $t("tomorrow") }}</span>
        <HHRadioButton v-model="tomorrowSelected" class="text-sm" />
      </div>
    </div>
    <div class="flex flex-col mb-5">
      <div class="flex items-center justify-between capitalize">
        <span class="">{{ $t("spcificDate") }}</span>
        <button
          class="px-2 text-sm leading-6 capitalize border rounded-lg shadow-lg"
          @click="isDatePickerVisible = !isDatePickerVisible"
        >
          {{ formatedSelectedDate || $t("pickDate") }}
        </button>
      </div>
    </div>
    <div v-if="isDatePickerVisible" class="mb-5">
      <div class="date-picker"></div>
    </div>
    <div class="flex flex-col mb-5">
      <div class="flex items-center justify-between">
        <span class="capitalize">{{ $t("specificTime") }}</span>
        <select
          v-model="selectedTime"
          name="time"
          class="px-2 text-sm leading-6 capitalize border rounded-lg shadow-lg"
        >
          <option class="capitalize" value="" selected>
            {{ $t("selectTime") }}
          </option>
          <option v-for="time in timeOption" :key="time" :value="time">
            {{ time }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import HHRadioButton from "@/components/Shared/HHRadioButton";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Thai } from "flatpickr/dist/l10n/th.js";
import { mapFields } from "vuex-map-fields";

export default {
  components: {
    HHRadioButton,
  },
  data() {
    return {
      todaySelected: false,
      tomorrowSelected: false,
      preferedDate: "",
      isDatePickerVisible: false,
      calendarPicker: "",
      timeOption: [],
    };
  },
  computed: {
    ...mapFields("search", ["locations", "selectedDates", "selectedTime"]),
    formatedSelectedDate() {
      if (this.preferedDate && this.preferedDate.length) {
        return this.$dayjs(this.preferedDate).format("DD MMM YYYY");
      }
      return "";
    },
  },
  watch: {
    todaySelected(newVal) {
      if (newVal) {
        this.tomorrowSelected = false;
        this.preferedDate = "";
        this.isDatePickerVisible = false;
        this.selectedDates = [this.$dayjs().format("YYYY-MM-DD")];
      } else {
        this.todaySelected = false;
        this.$store.dispatch("search/resetSelectedDates");
      }
    },
    tomorrowSelected(newVal) {
      if (newVal) {
        this.todaySelected = false;
        this.preferedDate = "";
        this.isDatePickerVisible = false;
        this.selectedDates = [
          this.$dayjs().add(1, "days").format("YYYY-MM-DD"),
        ];
      } else {
        this.tomorrowSelected = false;
        this.$store.dispatch("search/resetSelectedDates");
      }
    },
    preferedDate(newVal) {
      if (newVal && newVal.length) {
        this.tomorrowSelected = false;
        this.todaySelected = false;
        this.isDatePickerVisible = false;
        this.selectedDates = [
          this.$dayjs(newVal, "YYYY-MM-DD").format("YYYY-MM-DD"),
        ];
      } else {
        this.$store.dispatch("search/resetSelectedDates");
      }
    },
  },
  mounted() {
    this.initDatePicker();
    this.generateAvailableTime();
    this.compareSelectedDate();
  },
  methods: {
    initDatePicker() {
      const lang = this.$store.state.lang === "th" ? Thai : "en";
      this.calendarPicker = flatpickr(".date-picker", {
        locale: { ...lang, firstDayOfWeek: 0 },
        inline: true,
        monthSelectorType: "static",
        minDate: "today",
        onChange: (selectedDates) => {
          this.preferedDate = this.$dayjs(selectedDates[0]).format(
            "YYYY-MM-DD"
          );
        },
      });
    },
    generateAvailableTime() {
      const openingTime = "00:00";
      const closingTime = "23:45";
      const originalStartTime = this.$dayjs(openingTime, "HH:mm");
      const endTime = this.$dayjs(closingTime, "HH:mm");
      const options = [];

      for (
        let startTime = originalStartTime;
        startTime.isSameOrBefore(endTime);
        startTime = startTime.add(15, "minute")
      ) {
        options.push(startTime.format("HH:mm"));
      }
      this.timeOption = options;
    },
    compareSelectedDate() {
      if (this.selectedDates && this.selectedDates.length) {
        const selectedDate = this.selectedDates[0];
        if (selectedDate === this.$dayjs().format("YYYY-MM-DD")) {
          this.todaySelected = true;
        } else if (
          selectedDate === this.$dayjs().add(1, "days").format("YYYY-MM-DD")
        ) {
          this.tomorrowSelected = true;
        } else {
          const parsedAsJsDatae = this.$dayjs(
            selectedDate,
            "YYYY-MM-DD"
          ).toDate();
          if (this.calendarPicker) {
            this.calendarPicker.setDate(parsedAsJsDatae, true);
          }
        }
      }
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

// overide next & prev day of month color in current monnth
.flatpickr-day.nextMonthDay:not([class="flatpickr-disabled"]),
.flatpickr-day.prevMonthDay:not([class="flatpickr-disabled"]) {
  color: black;
}

// overide next & prev day of month color in current monnth (hover)
.flatpickr-day.nextMonthDay:not([class="flatpickr-disabled"]):hover,
.flatpickr-day.prevMonthDay:not([class="flatpickr-disabled"]):hover {
  @apply text-white;
  @apply bg-red-dark;
  @apply border-red-dark;
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

.flatpickr-day.selected,
.flatpickr-day.selected.nextMonthDay,
.flatpickr-day.selected.prevMonthDay,
.flatpickr-day.today:hover,
.flatpickr-day:hover,
.flatpickr-day.selected:hover {
  @apply text-white;
  @apply bg-red-dark;
  @apply border-red-dark;
}

.flatpickr-calendar.inline {
  @apply mx-auto;
}

// to hide next month day in current month
.flatpickr-day.nextMonthDay {
  visibility: hidden;
}
</style>
