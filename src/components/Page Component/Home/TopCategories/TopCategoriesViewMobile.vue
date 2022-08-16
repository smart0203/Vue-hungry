<template>
  <div class="top-categories-section">
    <div
      class="section-title"
      :class="
        isLoading
          ? 'bg-gray-300  h-4 lg:h-6  w-5/12 lg:w-1/5 lg:mx-auto mr-auto text-gray-300'
          : null
      "
    >
      {{ !isLoading ? title : "" }}
    </div>
    <div class="relative">
      <div class="">
        <div class="flex mb-8 overflow-x-scroll">
          <div
            v-for="(topCategory, index) in item"
            :key="topCategory.id"
            class="flex-shrink-0 mr-4"
          >
            <a
              :href="buildLink(topCategory.id)"
              class="block top-categories-item"
              @click.prevent="goToLink(index, topCategory)"
            >
              <div class="rounded-lg cover" :class="isLoading ? ' ' : null">
                <hh-image
                  v-if="!isLoading"
                  :desktop-width="150"
                  :mobile-width="110"
                  :desktop-height="180"
                  :mobile-height="133"
                  :img="topCategory.cover.url"
                  :alt="topCategory.title"
                  class="w-full h-full rounded-lg"
                  :is-lazy="true"
                />
              </div>
              <div class="text-xs label lg:text-sm">
                <div
                  class="font-black truncate"
                  :class="
                    isLoading
                      ? ' bg-gray-300 text-gray-300  w-8 h-4 mb-2'
                      : null
                  "
                >
                  {{ topCategory.title }}
                </div>
                <div class="flex items-center text-xs">
                  <div v-if="!isLoading" class="mr-1 lg:mr-2">
                    <img
                      src="@/assets/icon-home-black.png"
                      alt="icon home"
                      width="10"
                      height="10"
                      loading="lazy"
                    />
                  </div>
                  <span
                    class="text-2xs lg:text-sm"
                    :class="
                      isLoading ? ' bg-gray-300  text-gray-300 h-6' : null
                    "
                  >
                    {{
                      `${topCategory.totalRestaurants} ${$tc(
                        "restaurant",
                        $formatThousand(topCategory.totalRestaurants)
                      )}`
                    }}
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { selectedCityId } from "@/composable/selectCity";
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Array,
      required: true,
    },
  },
  setup() {
    return {
      selectedCityId,
    };
  },
  data() {
    return {};
  },
  methods: {
    buildLink(id) {
      return `restaurants/search?city_id=${this.selectedCityId}&cuisines[]=${id}`;
    },
    goToLink(index, topCategory) {
      const link = this.buildLink(topCategory.id);
      this.$emit("on-category-clicked", { index, topCategory, link });
      window.location = link;
    },
  },
};
</script>
