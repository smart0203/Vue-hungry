<template>
  <div>
    <div
      v-if="isDesktop"
      class="flex items-center justify-start py-4 pl-5 pr-3 border-b border-gray-400"
    >
      <div class="relative">
        <img
          class="mr-3 empty-booking-icon"
          src="@/assets/icon-order-white.png"
          width="40"
           loading="lazy"
          alt="order icon"
        />
      </div>
      <span class="text-lg font-black text-red-dark">{{
        $t("univesalExp")
      }}</span>
    </div>
    <div class="flex items-center justify-between w-10/12 py-2 mx-auto">
      <div v-if="isMobile" class="mr-6">
        <img
          src="@/assets/icon-arrow-left-red.png"
          class="flex-shrink-0"
           loading="lazy"
          style="width: 23px"
          @click="onBackButtonClick"
        />
      </div>
      <button
        class="w-full py-2 font-black leading-normal text-white uppercase border-none rounded-full cursor-pointer bg-red-dark"
        @click="onButtonClick"
      >
        {{ buttonLabel }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  computed: {
    buttonLabel() {
      return this.isDesktop ? this.$t("buyGiftCard") : this.$t("next");
    },
  },
  methods: {
    onButtonClick() {
      this.$emit("on-button-clicked");
    },
    onBackButtonClick() {
      this.$emit("on-back-button-click");
    },
  },
  i18n: {
    messages: {
      en: {
        univesalExp: "Click to get universal experience!",
      },
      th: {
        univesalExp: "มื้อพิเศษกำลังรอคุณอยู่!",
      },
    },
  },
};
</script>
