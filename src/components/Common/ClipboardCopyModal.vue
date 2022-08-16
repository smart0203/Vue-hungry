<template>
  <HHModal
    v-model="isModalShow"
    :content-class="'w-6/12 lg:w-2/12 p-4 bg-white'"
    :is-show-close-button="false"
    @on-click-outside="$emit('on-closed')"
  >
    <div class="text-center">
      <img
        src="@/assets/icon-check-red-big.png"
        width="40"
        alt="icon check"
         loading="lazy"
        class="pt-4 mx-auto"
      />
      <div class="pt-4 font-semibold text-gray-700 capitalize lg:text-lg">
        {{ showedText }}
      </div>
    </div>
  </HHModal>
</template>

<script>
import HHModal from "@/components/Shared/HHModal.vue";
export default {
  name: "ClipboardCopyModal",
  components: {
    HHModal,
  },
  props: {
    isShow: {
      type: Boolean,
      required: true,
    },
    text: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isModalShow: false,
    };
  },
  computed: {
    showedText() {
      return this.text && this.text.length ? this.text : this.$t("copied");
    },
  },
  watch: {
    isShow(val) {
      this.isModalShow = val;
    },
  },
};
</script>
