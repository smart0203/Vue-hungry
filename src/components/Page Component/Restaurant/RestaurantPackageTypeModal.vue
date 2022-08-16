<template>
  <div class="relative mx-4">
    <!-- close button -->
    <div
      class="absolute text-red-dark"
      :style="modalPosition"
      @click="closeModal"
    >
      <img
        src="@/assets/icon-close-black.png"
        width="15"
        height="15"
         loading="lazy"
        alt="close icon"
      />
    </div>
    <div class="w-11/12 py-5 mx-auto">
      <div class="pb-4 text-lg font-black text-left capitalize">
        {{ $t("packageDescription") }}
      </div>
      <div class="w-full">
        <div
          v-for="type in packageTypes"
          :key="type.shortName"
          class="flex items-start w-full mb-4"
        >
          <span
            class="flex-shrink-0 package-badge"
            :class="type.shortName"
          ></span>
          <div class="px-2 text-base text-gray-700">
            <div class="mb-2 leading-4">
              {{ type.fullName }}
            </div>
            <div class="text-sm">
              {{ type.tagLine }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    packageTypes: {
      type: Array,
      required: true,
    },
  },
  computed: {
    modalPosition() {
      if (this.isDesktop) {
        return "top:0px;right: -35px;";
      }
      return "top:5px;right: -10px;";
    },
  },
  methods: {
    closeModal() {
      this.$modal.hide("PackageTypeModal");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/components/Package/PackageBadge.scss";
</style>
