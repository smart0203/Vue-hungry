<template>
  <div>
    <aside
      class="absolute top-0 right-0 w-full overflow-x-hidden"
      :class="wrapperClass"
    >
      <div
        class="overflow-auto transition-all duration-300 ease-in-out transform bg-white"
        style="max-height: calc(100vh - 45px)"
        :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
      >
        <button class="px-2 py-2">
          <img
            width="14"
            loading="lazy"
            height="14"
            src="@/assets/icon-close-red.png"
            alt="icon close"
            @click="isOpen = !isOpen"
          />
        </button>
        <portal-target name="restaurant-side-menu"></portal-target>
      </div>
    </aside>
    <div
      v-if="isOpen"
      class="fixed top-0 left-0 w-full h-full"
      style="background: rgba(0, 0, 0, 0.38)"
    ></div>
  </div>
</template>

<script>
import { isOpen } from "./restaurantSideMenu";
let timeOutInstance;

export default {
  setup() {
    return {
      isOpen,
    };
  },
  data() {
    return {
      wrapperClass: "",
    };
  },
  watch: {
    isOpen: {
      handler() {
        if (!this.isOpen) {
          timeOutInstance = setTimeout(() => {
            this.wrapperClass = this.updateWrapperClass();
          }, 300);
        } else {
          this.wrapperClass = this.updateWrapperClass();
        }
      },
      immediate: true,
    },
  },
  beforeDestroy() {
    clearTimeout(timeOutInstance);
  },
  methods: {
    updateWrapperClass() {
      if (this.isOpen) {
        return "hh-soft-shadow z-30";
      }
      return "-z-1";
    },
  },
};
</script>
