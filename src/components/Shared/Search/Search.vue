<template>
  <div class="relative py-4 mx-6">
    <RestaurantSearch>
      <template #input-view="{ handler, meta }">
        <form
          id="search-input"
          class="mx-auto"
          action=""
          @submit="handler.submitHandler"
        >
          <div class="flex justify-center">
            <div
              class="flex flex-grow bg-white rounded-full text-red-dark search-form"
            >
              <div class="flex items-center ml-2">
                <div>
                  <img
                    src="@/assets/icon-search-red.png"
                    width="24"
                    loading="lazy"
                    height="24"
                    alt="search icon"
                  />
                </div>
              </div>
              <input
                id="homepage-banner-search"
                type="search"
                autocomplete="off"
                placeholder="Restaurant Name, Cuisine, Location"
                class="flex-grow mx-2"
                @input="handler.inputHandler"
              />
              <button
                class="px-6 py-2 font-black text-white capitalize rounded-full"
                type="button"
                :class="meta.isLoading ? 'bg-red-light' : 'bg-red-dark'"
                :disabled="meta.isLoading === true"
                @click="handler.submitHandler"
              >
                {{ isDesktop ? $t("findARestaurant") : "Search" }}
              </button>
            </div>
          </div>
        </form>
      </template>
      <template #suggestion-view="{ suggestions, handler, meta, keyword }">
        <!-- search suggestion loading -->
        <template v-if="keyword.length >= 3">
          <div
            id="search-loading"
            class="items-center search-body"
            :class="meta.isLoading ? ' flex' : ' hidden'"
          >
            <div class="mr-2 loader small"></div>
            <span>Loading</span>
          </div>
          <!-- search suggestion result -->
          <div v-if="!meta.isLoading">
            <div v-if="!meta.isSuccess" class="search-body">
              Oops, something went wrong
            </div>

            <div v-if="meta.isSuccess && !meta.isAnyResult" class="search-body">
              No result found
            </div>

            <div
              v-if="meta.isSuccess && meta.isAnyResult"
              id="search-suggestion"
            >
              <div class="sections">
                <!-- location result -->
                <div
                  v-if="suggestions.locationsSuggestions.data.length"
                  class="section location-section"
                >
                  <div class="section-heading">
                    <img
                      loading="lazy"
                      src="@/assets/icon-location-red.png"
                      alt="icon location"
                    />
                    <p>Location</p>
                  </div>

                  <div class="section-body">
                    <div
                      v-for="(location, index) in suggestions
                        .locationsSuggestions.data"
                      :key="location.id"
                    >
                      <template v-if="index <= 3">
                        <a
                          :href="locationLink(location.id)"
                          class="section-item hover:bg-gray-100"
                        >
                          {{ location.name }}
                        </a>
                      </template>
                      <template v-else>
                        <button
                          v-if="
                            index === 4 &&
                            !suggestions.locationsSuggestions.isShowAll
                          "
                          class="view-more-btn hover:bg-gray-100"
                          @click="handler.toggleHiddenResult('location')"
                        >
                          View More
                        </button>
                        <a
                          :href="locationLink(location.id)"
                          class="section-item hover:bg-gray-100"
                          :class="
                            !suggestions.locationsSuggestions.isShowAll
                              ? 'hidden'
                              : 'flex'
                          "
                        >
                          {{ location.name }}
                        </a>
                      </template>
                    </div>
                  </div>
                </div>

                <!-- cuisine section -->
                <div
                  v-if="suggestions.cuisinesSuggestions.data.length"
                  class="section cuisine-section"
                >
                  <div class="section-heading">
                    <img
                      src="@/assets/icon-course-red.png"
                      loading="lazy"
                      alt="icon course"
                    />
                    <p>Cuisine</p>
                  </div>
                  <div class="section-body">
                    <div
                      v-for="(cuisine, index) in suggestions.cuisinesSuggestions
                        .data"
                      :key="cuisine.id"
                    >
                      <template v-if="index <= 3">
                        <a
                          :href="cuisineLink(cuisine.id)"
                          class="section-item hover:bg-gray-100"
                        >
                          {{ cuisine.name }}
                        </a>
                      </template>
                      <template v-else>
                        <button
                          v-if="
                            index === 4 &&
                            !suggestions.cuisinesSuggestions.isShowAll
                          "
                          class="view-more-btn hover:bg-gray-100"
                          @click="handler.toggleHiddenResult('cuisine')"
                        >
                          View More
                        </button>
                        <a
                          :href="cuisineLink(cuisine.id)"
                          class="section-item hover:bg-gray-100"
                          :class="
                            !suggestions.cuisinesSuggestions.isShowAll
                              ? 'hidden'
                              : 'flex'
                          "
                        >
                          {{ cuisine.name }}
                        </a>
                      </template>
                    </div>
                  </div>
                </div>

                <!-- restaurant result -->
                <div
                  v-if="suggestions.restaurantsSuggestions.data.length"
                  class="section restaurant-section"
                >
                  <div class="section-heading">
                    <img
                      loading="lazy"
                      src="@/assets/icon-home-red.png"
                      alt="icon restaurant"
                    />
                    <p>Restaurant</p>
                  </div>
                  <div class="section-body">
                    <div
                      v-for="(restaurant, index) in suggestions
                        .restaurantsSuggestions.data"
                      :key="restaurant.id"
                    >
                      <template v-if="index <= 3">
                        <a
                          :href="restaurantLink(restaurant.slug)"
                          class="flex section-item hover:bg-gray-100"
                        >
                          <HhImage :img="restaurant.coverImage" />
                          <div>
                            <div>{{ restaurant.name }}</div>
                            <div class="mt-1">{{ restaurant.location }}</div>
                          </div>
                        </a>
                      </template>
                      <template v-else>
                        <button
                          v-if="
                            index === 4 &&
                            !suggestions.restaurantsSuggestions.isShowAll
                          "
                          class="view-more-btn hover:bg-gray-100"
                          @click="handler.toggleHiddenResult('restaurant')"
                        >
                          View More
                        </button>
                        <a
                          :href="restaurantLink(restaurant.slug)"
                          class="flex section-item hover:bg-gray-100"
                          :class="
                            !suggestions.restaurantsSuggestions.isShowAll
                              ? 'hidden'
                              : 'flex'
                          "
                        >
                          <HhImage :img="restaurant.coverImage" />
                          <div>
                            <div>{{ restaurant.name }}</div>
                            <div class="mt-1">{{ restaurant.location }}</div>
                          </div>
                        </a>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </RestaurantSearch>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import useLazyImport from "@/composable/useLazyImport";
export default {
  components: {
    RestaurantSearch: () =>
      useLazyImport(() =>
        import(
          "@/components/Shared/Renderless/RestaurantSearch/RestaurantSearch"
        )
      ),
  },
  computed: {
    ...mapGetters(["baseUrlWithLang"]),
  },
  methods: {
    restaurantLink(slug) {
      return `/restaurant/${slug}`;
    },
    cuisineLink(id) {
      return `/restaurants/search?cuisines[]=${id}`;
    },
    locationLink(id) {
      return `/restaurants/search?locations[]=${id}`;
    },
  },
};
</script>

<style lang="scss">
.search-body {
  border: none;
  background: transparent;

  @apply absolute z-10 w-full bg-white text-red-dark py-2 px-4 text-left;

  top: 52px;
  border-radius: 10px;
  box-shadow: -1px 2px 25px rgba(0, 0, 0, 0.16);
}

#search-suggestion {
  box-shadow: -1px 2px 25px rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  top: 52px;

  @apply bg-white  border text-left px-3 py-6 absolute w-full z-10;

  // &.is-loading {
  //   display: none;
  //   border: none;
  //   background: transparent;
  //   padding: 0 !important;
  //   z-index: -9999;
  //   color: transparent;
  // }
  .view-more-btn {
    @apply w-full py-2 text-left font-black  text-red-dark;
  }

  .sections {
    @apply mx-4;
  }

  .section-heading {
    @apply flex text-black;

    img {
      width: 18px;
      height: 18px;

      @apply mr-2;
    }
  }

  .section-body {
    @apply text-sm text-gray-700 py-2 overflow-hidden;

    div {
      @apply truncate;
    }

    img {
      width: 55px;
      height: 55px;

      @apply mr-2;
    }

    .section-item {
      @apply py-1 cursor-pointer w-full;
    }
  }

  .section.cuisine-section .section-body,
  .section.location-section .section-body {
    margin-left: 26px;
  }

  .section.cuisine-section .section-body .section-item,
  .section.location-section .section-body .section-item {
    display: block;
  }
}
</style>
