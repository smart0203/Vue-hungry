<template>
  <div :key="keyId" class="relative w-full lg:w-auto lg:mx-0">
    <RestaurantSearch>
      <template #input-view="{ handler, meta }">
        <slot :handler="handler" :meta="meta"></slot>
      </template>
      <template #suggestion-view="{ suggestions, handler, meta }">
        <!-- search suggestion loading -->
        <template v-if="meta.isShowSuggestion">
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
                  <div class="capitalize section-heading">
                    <img
                      src="@/assets/icon-location-red.png"
                      alt="icon location"
                      loading="lazy"
                    />
                    <p>{{ $t("location") }}</p>
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
                          class="block section-item hover:bg-gray-100"
                          @click.prevent="
                            goToSearchPage('locations', location.id)
                          "
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
                          class="block section-item hover:bg-gray-100"
                          :class="
                            !suggestions.locationsSuggestions.isShowAll
                              ? 'hidden'
                              : 'block'
                          "
                          @click.prevent="
                            goToSearchPage('location', location.id)
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
                  <div class="capitalize section-heading">
                    <img
                      src="@/assets/icon-course-red.png"
                      loading="lazy"
                      alt="icon course"
                    />
                    <p>{{ $t("cuisine") }}</p>
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
                          class="block section-item hover:bg-gray-100"
                          @click.prevent="
                            goToSearchPage('cuisines', cuisine.id)
                          "
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
                              : 'block'
                          "
                          @click.prevent="
                            goToSearchPage('cuisines', cuisine.id)
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
                      src="@/assets/icon-home-red.png"
                      loading="lazy"
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
                          @click.prevent="goToRestaurantPage(restaurant.slug)"
                        >
                          <HhImage
                            :img="restaurant.coverImage"
                            :mobile-width="55"
                            :mobile-height="55"
                            :desktop-width="55"
                            :desktop-height="55"
                            class="bg-gray-300"
                          />
                          <div>
                            <div class="flex items-center">
                              <template v-if="restaurant.isAds">
                                <div class="flex-shrink-0 mr-1 text-red-dark">
                                  Ad
                                </div>
                                <div
                                  class="w-2 h-2 mr-1 rounded-full bg-red-dark"
                                ></div>
                                <div>{{ restaurant.name }}</div>
                              </template>
                              <template v-else>
                                {{ restaurant.name }}
                              </template>
                            </div>
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
                              : 'block'
                          "
                          @click.prevent="goToRestaurantPage(restaurant.slug)"
                        >
                          <HhImage
                            :img="restaurant.coverImage"
                            :mobile-width="55"
                            :mobile-height="55"
                            :desktop-width="55"
                            :desktop-height="55"
                            class="bg-gray-300"
                          />
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
import { nanoid } from "nanoid";
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
  data() {
    return {
      keyId: nanoid(3),
    };
  },
  computed: {
    ...mapGetters(["baseUrlWithLang"]),
  },
  methods: {
    restaurantLink(slug) {
      return `/restaurants/${slug}`;
    },
    goToRestaurantPage(slug) {
      const newRestaurant = this.$router.resolve({
        name: "RestaurantPage",
        params: { restaurantName: slug },
      });
      window.location = newRestaurant.href;
      this.onResulClicked();
    },
    cuisineLink(id) {
      return `/restaurants/search?cuisines[]=${id}`;
    },
    locationLink(id) {
      return `/restaurants/search?locations[]=${id}`;
    },
    goToSearchPage(type, id) {
      const path = `/restaurants/search?${type}[]=${id}`;
      const newRoute = this.$router.resolve({
        path,
      });
      this.$routerPushGuard(newRoute);
      this.onResulClicked();
    },
    onResulClicked() {
      this.$emit("on-result-clicked");
      this.reRender();
    },
    reRender() {
      this.keyId = nanoid(3);
    },
  },
};
</script>

<style lang="scss">
.search-body {
  border: none;
  background: transparent;

  @apply absolute z-10 w-full bg-white text-red-dark py-2 px-4 text-left;

  border-radius: 10px;
  box-shadow: -1px 2px 25px rgba(0, 0, 0, 0.16);
}

#search-suggestion {
  max-height: 100vh;
  overflow-y: scroll;
  box-shadow: -1px 2px 25px rgba(0, 0, 0, 0.16);
  border-radius: 10px;

  @apply bg-white  border text-left px-3 py-6 absolute w-full z-10;

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
}
</style>
