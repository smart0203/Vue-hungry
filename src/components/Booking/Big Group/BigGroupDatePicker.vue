<template>
  <ValidationProvider v-slot="{ errors }" rules="required">
    <div
      class="relative flex pb-2 border-b border-gray-700 input-with-icon have-icon-left"
    >
      <div class="flex-shrink-0">
        <img
          class="mr-2 icon icon-left"
          src="@/assets/icon-date-red.png"
          alt="icon calendar"
          width="20px"
          loading="lazy"
          height="20px"
        />
      </div>
      <Datepicker
        v-if="isDesktop"
        v-model="selectedDate"
        :placeholder="capitalize($t('date'))"
        calendar-class="big-group-calendar"
        :disabled-dates="disabledDates"
        class="input"
      />
      <template v-else>
        <div class="ml-8" @click="openDatePickerModal">
          <span v-if="selectedDate != ''">
            {{ $dayjs(selectedDate).format("DD MMM YYYY") }}
          </span>
          <span v-else class="capitalize">
            {{ $t("date") }}
          </span>
        </div>
      </template>
    </div>
    <div class="mt-1 text-xs text-red-dark">
      {{ errors[0] }}
    </div>
    <modal name="date-picker-modal" width="80%" height="auto">
      <Datepicker
        v-model="selectedDate"
        placeholder="Date"
        calendar-class="big-group-calendar"
        :disabled-dates="disabledDates"
        :inline="true"
        maximum-view="month"
        :monday-first="true"
        @selected="closeDatePickerModal"
      />
    </modal>
  </ValidationProvider>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import { mapFields } from "vuex-map-fields";
import { provider } from "@/lib/veeValidate";
import capitalize from "lodash-es/capitalize";
export default {
  components: {
    Datepicker,
    ValidationProvider: provider,
  },
  computed: {
    ...mapFields("booking", ["selectedDate"]),
    disabledDates() {
      return {
        to: this.$dayjs().subtract("1", "day").toDate(),
      };
    },
  },
  methods: {
    capitalize,
    openDatePickerModal() {
      this.$modal.show("date-picker-modal");
    },
    closeDatePickerModal() {
      this.$modal.hide("date-picker-modal");
    },
  },
};
</script>

<style lang="scss">
.big-group-calendar {
  margin-left: auto;
  margin-right: auto;

  .cell:not(.blank):not(.disabled).day:hover,
  .cell:not(.blank):not(.disabled).month:hover,
  .cell:not(.blank):not(.disabled).year:hover:hover {
    border: 1px solid#df252a;
  }

  .cell.selected {
    background-color: #df252a;
    color: white;
  }

  .cell.selected:hover {
    background-color: #df252a;
  }
  // mobile
  @media (max-width: 639px) {
    width: 90%;

    header span {
      font-size: 20px;
      margin: 10px 0;
    }

    .cell.day-header {
      font-size: 16px;
    }

    .cell.day {
      font-size: 16px;
    }
  }
  // desktop
  @media (min-width: 640px) {
    width: 260px;

    header span {
      font-size: 14px;
      margin: 10px 0;
    }

    .cell.day-header {
      font-size: 12px;
    }

    .cell.day {
      font-size: 10px;
    }
  }
}
</style>
