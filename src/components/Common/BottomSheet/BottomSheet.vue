<template>
  <div class="">
    <aside
      class="fixed bottom-0 right-0 w-full overflow-y-hidden rounded-top bottom-sheet-wrapper"
      :class="wrapperClass"
    >
      <div
        class="overflow-auto transition-all duration-300 ease-in-out transform bg-white bottom-sheet-content"
        :class="isOpen ? 'translate-y-0' : 'translate-y-full'"
      >
        <portal-target name="bottom-sheet"></portal-target>
      </div>
    </aside>
    <div
      v-if="isOpen"
      class="fixed top-0 left-0 w-full h-full z-49 bottom-sheet-bg"
      @click="isOpen = false"
    ></div>
  </div>
</template>

<script>
import {
  isOpen,
  isCloseTransitionFinish,
  isOpenTransitionFinish,
  addBottomSheetMarkToURL,
  removeBottomSheetMarkFromURL,
} from "./bottomSheet";
let timeOutInstance;

export default {
  name: "BottomSheet",
  setup() {
    return {
      isOpen,
      isCloseTransitionFinish,
      isOpenTransitionFinish,
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
          clearTimeout(timeOutInstance);
          removeBottomSheetMarkFromURL();
          timeOutInstance = setTimeout(() => {
            this.wrapperClass = this.updateWrapperClass();
          }, 300);
        } else {
          this.wrapperClass = this.updateWrapperClass();
          this.registerPopStateHandler();
          addBottomSheetMarkToURL();
        }
      },
      immediate: true,
    },
  },
  beforeDestroy() {
    window.onpopstate = () => {};
    clearTimeout(timeOutInstance);
  },
  methods: {
    updateWrapperClass() {
      if (this.isOpen) {
        return "z-50";
      }
      return "-z-1";
    },
    registerPopStateHandler() {
      window.onpopstate = () => {
        removeBottomSheetMarkFromURL();
        this.isOpen = false;
      };
    },
  },
};
</script>
<style scoped>
.bottom-sheet-bg {
  background: rgba(0, 0, 0, 0.38);
}

.rounded-top {
  border-radius: 20px 20px 0 0;
}
</style>
