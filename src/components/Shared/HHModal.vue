<template>
  <vue-final-modal
    v-slot="{ params }"
    v-bind="$attrs"
    attach="#modal-container"
    :styles="{ position: 'fixed' }"
    :overlay-style="{ position: 'fixed' }"
    classes="flex justify-center items-center"
    :content-class="[
      'flex flex-col bg-white border rounded z-50',
      $attrs['content-class'],
    ]"
    @click-outside="$emit('on-click-outside')"
    @closed="$emit('on-closed')"
  >
    <div class="relative w-full">
      <!-- close button -->
      <div
        v-if="isShowCloseButton"
        class="absolute cursor-pointer text-red-dark"
        style="top: 5px; right: 8px"
        @click="$emit('on-cancel')"
      >
        <img
          style="width: 15px; height: 15px"
          class="inline-block"
          src="@/assets/icon-close-red.png"
          alt="close modal"
           loading="lazy"
        />
      </div>
      <div class="pt-8 pb-2 lg:pt-2">
        <slot :params="params"></slot>
      </div>
    </div>
  </vue-final-modal>
</template>
<script>
export default {
  name: "HHModal",
  inheritAttrs: false,
  props: {
    isShowCloseButton: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
