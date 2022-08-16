<template>
  <modal name="restaurant-hour-modal" height="auto" width="90%">
    <div class="relative mx-4">
      <!-- close button -->
      <div
        class="absolute text-red-dark"
        :style="modalPosition"
        @click="$modal.hide('restaurant-hour-modal')"
      >
        <img
          src="@/assets/icon-close-black.png"
          width="15"
          height="15"
           loading="lazy"
          alt="close icon"
        />
      </div>
      <div class="w-11/12 py-16 mx-auto lg:py-5">
        <div class="pb-4 text-lg font-black text-left">
          {{ $t("restaurantHours") }}
        </div>
        <div class="flex">
          <div class="flex flex-col justify-start flex-auto text-gray-700">
            <span
              v-for="(opening, index) in openingHours"
              :key="opening.name"
              class="mb-3"
              :class="index === boldDay ? 'font-bold' : ''"
              >{{ opening.name }}</span
            >
          </div>
          <div class="flex flex-col justify-start flex-auto">
            <span
              v-for="(opening, index) in openingHours"
              :key="opening.val + index"
              class="mb-3"
              :class="index === boldDay ? 'font-bold' : ''"
              >{{ opening.val }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
export default {
  props: {
    openingHours: {
      type: Array,
      required: true,
    },
  },
  computed: {
    modalPosition() {
      if (this.isDesktop) {
        return "top:-2px;left: -35px;";
      }
      return "top:5px;right: -10px;";
    },
    boldDay() {
      const today = this.$dayjs().format("dddd");
      return this.openingHours.findIndex((opening) => opening.name === today);
    },
  },
};
</script>
<i18n>
{
  "en": {
    "restaurantHours": "Hours:"

  },
  "th": {
    "restaurantHours": "เวลาเปิดทำการ"

  }
}
</i18n>
