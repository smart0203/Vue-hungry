<template>
  <div class="w-full lg:mb-16">
    <div class="relative my-3 mt-2 font-bold text-center capitalize">
      <a
        v-if="isDesktop"
        href=""
        class="absolute"
        style="top: 4px; left: 20px"
        @click.prevent="backCallback"
      >
        <img
          src="@/assets/icon-arrow-left-red.png"
          alt="back button"
          loading="lazy"
          style="width: 15px; height: 15px"
        />
      </a>
      {{ isDineIn ? $t("selectDineInTime") : $t("selectDeliveryTime") }}
    </div>
    <div v-if="showExpiryDate" class="mb-8 text-xs text-center">
      <span class="mr-1">{{ $t("promotionExpDate") }}</span>
      <span class="mr-1">:</span>
      <span>{{ expiryDate }}</span>
    </div>
    <div class="my-4 text-center">
      {{ selectedDate }}
    </div>
    <div class="flex flex-wrap text-gray-700">
      <template v-if="anyAvailableTime">
        <button
          v-for="time in availableTime"
          :id="`time-selection-${time.startTime.replace(':', '-')}`"
          :key="time.startTime"
          class="flex flex-col items-center justify-center w-1/5 mb-2 border-none time-slot"
          :class="[
            !time.availability
              ? ' text-gray-400  cursor-not-allowed'
              : 'cursor-pointer',
          ]"
          :disabled="!time.availability"
          @click="selectTimeCallback(time.startTime)"
        >
          <span
            class="p-1 rounded"
            :class="[
              time.availability ? ' hover:bg-green hover:text-white' : null,
              selectedTime === time.startTime ? 'bg-green text-white' : null,
            ]"
            >{{ time.startTime }}</span
          >
          <div class="flex items-center justify-center mt-1">
            <div :class="time.availability ? 'indicator' : null"></div>
          </div>
        </button>
        <div
          v-if="showSummary"
          class="absolute bottom-0 left-0 w-full my-4 text-sm font-black text-center capitalize"
        >
          {{ summary }}
        </div>
        <div
          v-if="showPackageExpired"
          class="absolute bottom-0 left-0 w-full mt-2 text-xs text-center capitalize"
        >
          {{ `${$t("packageExpired")}: ${packageExpired}` }}
        </div>
      </template>
      <p v-else class="w-full my-8 text-center">
        No available time in selected date
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    anyAvailableTime: {
      type: Boolean,
      required: true,
    },
    availableTime: {
      type: Array,
      required: true,
    },
    selectedTime: {
      type: String,
      required: true,
    },
    selectedDate: {
      type: String,
      required: true,
    },
    selectTimeCallback: {
      type: Function,
      required: true,
    },
    backCallback: {
      type: Function,
      required: true,
    },
    isDineIn: {
      type: Boolean,
      required: true,
    },
    showSummary: {
      type: Boolean,
      default: false,
    },
    expiryDate: {
      type: String,
      default: "",
    },
    showExpiryDate: {
      type: Boolean,
      default: true,
    },
    showPackageExpired: {
      type: Boolean,
      default: true,
    },
    packageExpired: {
      type: String,
      default: "",
    },
    summary: {
      type: String,
    },
  },
};
</script>
<style lang="scss" scoped>
.indicator {
  width: 6px;
  height: 6px;
  border-radius: 150px;
  content: " ";
  display: block;
  @apply bg-green;
}
</style>
<i18n>
{
  "en": {
    "promotionExpDate": "Promotion Expiry Date"
  },
  "th": {
    "promotionExpDate": "โปรโมชั่นหมดอายุวันที่"
  }
}
</i18n>
