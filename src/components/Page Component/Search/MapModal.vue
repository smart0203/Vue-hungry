<template>
  <modal name="map-modal" height="100%" scrollable adaptive>
    <div class="flex items-center justify-end mx-2 my-2">
      <img
        class="flex-shrink-0 cursor-pointer"
        src="@/assets/icon-close-black.png"
        alt="close icon"
         loading="lazy"
        style="width: 15px; height: 15px"
        @click="$modal.hide('map-modal')"
      />
    </div>
    <HHMap :restaurants="restaurants" />
  </modal>
</template>

<script>
import HHMap from "@/components/Shared/HHMap.vue";
export default {
  components: {
    HHMap,
  },
  props: {
    restaurants: {
      type: Array,
      required: true,
    },
  },
};
</script>
