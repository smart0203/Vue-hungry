<template>
  <HHPopup
    name="profile-modal"
    :modal-title="title"
    :is-tooltip-desktop="false"
    :modal-width="modalWidth"
    :is-show="isShow"
    :show-close-button="true"
    :close-on-bg-click="true"
    adaptive
    scrollable
    height="auto"
    @on-closed="onClosed"
  >
    <template v-if="isMobile" #close-button>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="17"
        height="17"
        fill="currentColor"
        class="inline icon-chevron-left text-red-dark"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
          stroke-width="2"
        />
      </svg>
    </template>
    <div class="max-height-desktop">
      <slot></slot>
    </div>
  </HHPopup>
</template>

<script>
import useLazyImport from "@/composable/useLazyImport";
export default {
  components: {
    HHPopup: () => useLazyImport(() => import("@/components/Shared/HHPopup")),
  },
  props: {
    width: {
      type: Number,
    },
    isShow: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: "",
    },
  },
  computed: {
    modalWidth() {
      if (!this.width) {
        return this.isDesktop ? 500 : "100%";
      }
      return this.width;
    },
  },
  methods: {
    onClosed() {
      this.$emit("on-closed");
    },
  },
};
</script>
<style lang="scss" scoped>
@screen lg {
  .max-height-desktop {
    max-height: 700px;
    overflow-y: scroll;
  }
}
</style>
