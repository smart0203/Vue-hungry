<template>
  <modal
    class="relative"
    name="server-busy-modal"
    :width="modalWidth"
    height="auto"
    scrollable
    adaptive
    @closed="onClosed"
  >
    <div class="flex flex-col items-center justify-center wrapper">
      <img
        :width="imageWidth"
        src="@/assets/not-found-hero-image.png"
        class="my-4"
         loading="lazy"
        alt=""
      />
      <div class="mx-4 mb-4 text-sm text-center lg:mx-4 lg:mb-4 lg:text-base">
        {{ $t("serverBusyMessage") }}
      </div>
    </div>

    <!-- close icon -->
    <span
      class="absolute flex items-center justify-center mx-auto text-lg font-black cursor-pointer text-red-dark"
      style="right: 5px; top: 5px; width: 20px; height: 20px"
      @click="closeModal"
    >
      X
    </span>
  </modal>
</template>

<script>
import { isOpen } from "./serverBusy";
export default {
  setup() {
    return {
      isOpen,
    };
  },
  i18n: {
    messages: {
      en: {
        serverBusyMessage:
          "We are sorry, our server still busy, please try again within few minutes",
      },
      th: {
        serverBusyMessage:
          "ขออภัย ขณะนี้เรากำลังแก้ไขระบบอยู่ กรุณาลองใหม่อีกครั้งภายในไม่กี่นาที",
      },
    },
  },
  computed: {
    imageWidth() {
      return 150;
    },
    modalWidth() {
      if (this.isDesktop || this.isTablet) {
        return "300";
      }
      return "90%";
    },
  },
  watch: {
    isOpen: {
      immediate: true,
      handler(val) {
        if (val) {
          this.$modal.show("server-busy-modal");
        } else {
          this.$modal.hide("server-busy-modal");
        }
      },
    },
  },
  methods: {
    closeModal() {
      this.$modal.hide("server-busy-modal");
    },
    onClosed() {
      this.isOpen = false;
    },
  },
};
</script>
