<template>
  <div class="popular-brand-section">
    <div
      class="mt-2 mb-4 text-sm capitalize lg:font-black lg:text-center lg:text-xl lg:my-4"
      :class="
        isLoading
          ? 'bg-gray-300  h-3 lg:h-6 w-4/12 lg:w-1/12 lg:mx-auto mr-auto text-gray-300'
          : null
      "
    >
      {{ !isLoading ? title : "" }}
    </div>
    <div class="relative">
      <div class="">
        <div class="flex w-full mb-10 overflow-x-auto">
          <a
            v-for="(brand, index) in popularBrand"
            :key="brand.id"
            class="flex-shrink-0 w-1/3"
            :href="buildLink(index, brand)"
            @click.prevent="goToLink(index, brand)"
          >
            <div class="pr-4 brand-item">
              <div
                class="relative circle"
                :class="isLoading ? '  bg-gray-400' : null"
              >
                <hh-image
                  v-if="!isLoading && brand.logo && brand.logo.length"
                  :desktop-width="120"
                  :desktop-height="120"
                  :mobile-width="88"
                  :mobile-height="88"
                  :is-lazy="true"
                  class="w-full h-full bg-gray-300 rounded-full"
                  :img="brand.logo"
                />

                <!-- ads label -->
                <div
                  v-if="brand.isAds"
                  class="absolute left-0 right-0 text-xs text-gray-500 rounded-lg ads"
                >
                  Ad
                </div>
              </div>
              <div
                :class="
                  isLoading ? ' text-gray-300 bg-gray-300  w-20' : 'w-full'
                "
                class="truncate label"
              >
                <span>{{ brand.name }}</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { belongToGroupLanding } from "@/composable/groupLanding";
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    popularBrand: {
      type: Array,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    buildLink(index, brand) {
      let link = `/restaurants/search?branch_id=${brand.id}`;
      const isBelongToGroupLanding = belongToGroupLanding(brand.id);
      if (isBelongToGroupLanding && isBelongToGroupLanding.length) {
        link = `/${isBelongToGroupLanding[0].slug}`;
      }
      return link;
    },
    goToLink(index, brand) {
      const link = this.buildLink(index, brand);
      this.$emit("on-brand-clicked", { index, brand, link });
      window.location = link;
    },
  },
};
</script>
