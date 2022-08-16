<template>
  <div class="flex flex-wrap">
    <a
      v-for="tag in tagGroups"
      :key="tag.id"
      class="relative mb-10 tag-group-item"
      :href="tag.link"
    >
      <HhImage
        v-if="!isLoading"
        class="main-image"
        mobile-width="full-screen"
        :desktop-width="270"
        :alt="tag.name || 'restaurant-tag-group-image'"
        :img="$url(tag.photoUrl, 'asset')"
        width="270"
        height="165"
      />
      <div v-else class="w-11/12 h-40 bg-gray-300"></div>
      <div v-if="!isLoading" class="flex items-center mt-2 text-xs">
        <div class="mr-2">
          <img
            src="@/assets/icon-home-black.png"
            alt="icon home"
            loading="lazy"
            width="10"
            height="10"
          />
        </div>
        {{
          `${tag.restaurantIds.length} ${$tc(
            "restaurant",
            $formatThousand(tag.restaurantIds.length)
          )}`
        }}
      </div>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    tagGroups: {
      type: Array,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
