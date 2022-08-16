<template>
  <HHModal
    v-model="isModalShow"
    :is-show-close-button="false"
    :content-class="'w-11/12 lg:w-4/12 p-4 bg-white'"
    @on-cancel="$emit('on-closed')"
    @on-click-outside="$emit('on-closed')"
  >
    <div class="mb-5 text-center">
      {{ $t("title") }}
    </div>
    <div class="flex items-center justify-center">
      <button class="mr-2 button" @click="$emit('on-closed')">No</button>
      <button class="button" @click="$emit('on-confirmed')">Yes</button>
    </div>
  </HHModal>
</template>

<script>
import HHModal from "@/components/Shared/HHModal.vue";
export default {
  components: {
    HHModal,
  },
  props: {
    isShow: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isModalShow: false,
    };
  },
  watch: {
    isShow(val) {
      this.isModalShow = val;
    },
  },
  i18n: {
    messages: {
      en: {
        title: "Do you want to remove this voucher ?",
      },
      th: {
        title: "คุณต้องการลบ Voucher นี้ใช่หรือไม่ ?",
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.button {
  @apply border border-red-dark text-red-dark w-full rounded-full py-1;
  &.active {
    @apply bg-red-dark text-white;
  }
}
</style>
