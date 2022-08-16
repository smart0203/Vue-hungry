<template>
  <modal name="search-modal" height="100%" scrollable adaptive>
    <div class="flex items-center justify-between mx-2 mt-2">
      <p class="font-black">{{ $t("findARestaurant") }}</p>
      <img
        class="flex-shrink-0 cursor-pointer"
        src="@/assets/icon-close-black.png"
        alt="close icon"
         loading="lazy"
        style="width: 15px; height: 15px"
        @click="$modal.hide('search-modal')"
      />
    </div>
    <RestaurantSearchSuggestion class="mt-4">
      <template #default="{ handler, meta }">
        <form
          class="relative flex items-center mx-4 rounded-full"
          style="box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16)"
          @submit.prevent="
            $emit('on-submit');
            $modal.hide('search-modal');
            handler.toggleHiddenSuggestion(false);
          "
        >
          <svg
            v-if="isDesktop"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="inline py-2 ml-2 icon-search text-red-dark"
            viewBox="0 0 16 16"
          >
            <path
              d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
            />
          </svg>

          <input
            v-model="keyword"
            type="search"
            :placeholder="$t('searchRestaurantPlaceHolder')"
            name="search"
            class="w-full px-2 py-2 truncate rounded-full"
            autocomplete="off"
            @input="handler.inputHandler"
            @focus="handler.focusHandler"
          />
          <button
            class="px-4 py-2 font-black text-white capitalize border rounded-full bg-red-dark lg:whitespace-nowrap border-red-dark"
            type="submit"
            :class="meta.isLoading ? 'bg-red-light' : 'bg-red-dark'"
            :disabled="meta.isLoading === true"
          >
            {{ isMobile ? $t("search") : $t("findARestaurant") }}
          </button>
        </form>
      </template>
    </RestaurantSearchSuggestion>
  </modal>
</template>

<script>
import RestaurantSearchSuggestion from "@/components/Shared/RestaurantSearchSuggestion";
import { mapFields } from "vuex-map-fields";
export default {
  components: {
    RestaurantSearchSuggestion,
  },
  computed: {
    ...mapFields("search", ["keyword"]),
  },
};
</script>
