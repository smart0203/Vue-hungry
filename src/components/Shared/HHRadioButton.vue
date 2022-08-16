<template>
  <div class="flex items-center">
    <div
      class="mr-2 pretty p-switch p-fill"
      :class="{ 'p-bigger': large || '' }"
    >
      <input :checked="value" type="checkbox" @change="updateValue($event)" />
      <div class="state p-danger">
        <label v-html="label"></label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      required: true,
      type: Boolean,
    },
    large: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default() {
        return "";
      },
    },
  },
  methods: {
    updateValue: function (event) {
      this.$emit("input", event.target.checked);
    },
  },
};
</script>
<style lang="scss">
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
.flatpickr-day.today:hover,
.flatpickr-day:hover,
.flatpickr-day.selected:hover {
  @apply text-white;
  @apply bg-red-dark;
  @apply border-red-dark;
}
</style>
