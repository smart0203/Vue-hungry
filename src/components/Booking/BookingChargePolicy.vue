<template>
  <div v-if="chargePolicy">
    <template v-if="isImage">
      <img
        :src="chargePolicy"
        class="cursor-pointer"
        alt="charge policy img"
        loading="lazy"
        @click="showPopUpGallery"
      />
      <div id="charge-policy-img-modal"></div>
    </template>
    <div v-else v-html="formatHtmlChargePolicy(chargePolicy)"></div>
  </div>
</template>

<script>
import popUpGallery from "@/components/Shared/PopupGallery";
export default {
  props: {
    chargePolicy: {
      type: String,
      required: true,
    },
    isImage: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { showGallery } = popUpGallery();
    return {
      showGallery,
    };
  },
  methods: {
    showPopUpGallery() {
      const items = [
        {
          asset: this.chargePolicy,
        },
      ];
      this.showGallery("#charge-policy-img-modal", items);
    },
    formatHtmlChargePolicy(policy) {
      return policy.replace(/(?:\r\n|\r|\n)/g, "<br>");
    },
  },
};
</script>
