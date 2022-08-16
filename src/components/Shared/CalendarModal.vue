<template>
  <modal
    name="date-picker-modal"
    width="90%"
    height="auto"
    @opened="initDatePicker"
  >
    <div class="date-picker"></div>
  </modal>
</template>

<script>
import isArray from "lodash-es/isArray";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Thai } from "flatpickr/dist/l10n/th";

export default {
  props: {
    maxSelectableDate: {
      type: String,
      default: "",
    },
    minSelectableDate: {
      type: String,
      default: "",
    },
    enableDates: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  updated() {
    this.$nextTick(() => {
      this.redrawCalendar();
    });
  },
  methods: {
    initDatePicker() {
      const minSelectableDate = this.minSelectableDate;
      const maxSelectableDate = this.maxSelectableDate;
      const lang = this.$store.state.lang === "th" ? Thai : "en";

      this.calendar = flatpickr(".date-picker", {
        locale: { ...lang, firstDayOfWeek: 0 },
        inline: true,
        monthSelectorType: "static",
        minDate: minSelectableDate,
        maxDate: maxSelectableDate,
        enable: this.enableDates,
        onChange: (selectedDates) => {
          if (selectedDates && isArray(selectedDates)) {
            this.$emit("on-date-selected", selectedDates[0]);
          }
        },
      });
    },
    redrawCalendar() {
      if (this.calendar.length !== 0) {
        this.calendar.set("enable", this.enableDates);
        this.calendar.redraw();
      }
    },
  },
};
</script>
