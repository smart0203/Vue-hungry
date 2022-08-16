<template>
  <ValidationProvider v-slot="{ errors }" rules="required">
    <div class="flex w-full pb-2 border-b border-gray-700 input-with-icon">
      <div class="flex-shrink-0">
        <img
          class="mr-2 icon icon-left"
          src="@/assets/icon-time-red.png"
          alt="icon email"
          loading="lazy"
          width="20px"
          height="20px"
        />
      </div>
      <select v-model="selectedTime" name="Time" class="w-full ml-8">
        <option class="capitalize" value="" selected disabled>
          {{ capitalize($t("time")) }}
        </option>
        <option v-for="time in timeOption" :key="time" :value="time">
          {{ time }}
        </option>
      </select>
    </div>
    <div class="mt-1 text-xs text-red-dark">
      {{ errors[0] }}
    </div>
  </ValidationProvider>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import { provider } from "@/lib/veeValidate";
import capitalize from "lodash-es/capitalize";

export default {
  components: {
    ValidationProvider: provider,
  },
  data() {
    return {
      timeOption: "",
    };
  },
  computed: {
    ...mapFields("booking", ["selectedTime"]),
  },
  mounted() {
    this.generateAvailableTime();
  },
  methods: {
    capitalize,
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
  },
};
</script>
