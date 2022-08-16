<template>
  <div>
    <div v-if="favourites.length" class="">
      <div class="flex flex-wrap items-center">
        <div
          v-for="(restaurant, index) in favourites"
          :key="restaurant.id"
          class="w-full lg:w-1/4"
        >
          <component
            :is="restaurantCardComponent"
            v-bind="buildCardComponentProps(restaurant)"
            class="mb-4"
            @on-link-clicked="restaurant.goToLink"
            @on-favourite-clicked="toggleFavourite(restaurant)"
            @mouseenter.native="isDesktop ? onHover(restaurant, index) : null"
          ></component>
        </div>
      </div>
      <div
        v-if="anyNextPage"
        class="flex items-center justify-center my-4 text-sm lg:my-2 lg:text-base"
      >
        <button
          class="flex items-center px-2 py-1 text-white capitalize rounded-lg bg-red-dark disabled:opacity-50"
          :disabled="isLoadingLoadMore"
          @click="loadMoreFavouriteRestaurant"
        >
          <div v-if="isLoadingLoadMore" class="mr-1 loader small white"></div>
          {{ $t("showMore") }}
        </button>
      </div>
    </div>
    <div v-else>
      <ProfileEmptyState :title="$t('noFavourites')" />
    </div>
  </div>
</template>

<script>
import module from "@/lib/tooltip";
import {
  state as favouriteState,
  methods as favouriteMethods,
} from "@/composable/favouriteRestaurant";
import { initDummyRestaurant } from "@/services/restaurant";
import useLazyImport from "@/composable/useLazyImport";
let timeOutInstance;

export default {
  components: {
    ProfileEmptyState: () =>
      useLazyImport(() =>
        import("@/components/Page Component/Profile/ProfileEmptyState")
      ),
  },
  setup() {
    let dummyFavorites = [];
    const {
      pageNumber,
      favoriteRestaurants,
      isLoading,
      isLoadingLoadMore,
      anyNextPage,
    } = favouriteState;
    const {
      toggleFavouriteRestaurant,
      checkIsFavouriteRestaurant,
      getFavoriteRestaurants,
      loadMoreFavouriteRestaurant,
    } = favouriteMethods;
    return {
      isLoadingLoadMore,
      isLoading,
      dummyFavorites,
      favoriteRestaurants,
      toggleFavouriteRestaurant,
      checkIsFavouriteRestaurant,
      getFavoriteRestaurants,
      loadMoreFavouriteRestaurant,
      anyNextPage,
      pageNumber,
    };
  },
  data() {
    return {
      restaurantCardComponent: null,
      tooltipInstance: null,
    };
  },
  computed: {
    favourites() {
      return this.isLoading ? this.dummyFavorites : this.favoriteRestaurants;
    },
  },
  watch: {
    isLoading(_, newVal) {
      if (newVal === false) {
        this.initFavTooltip();
      }
    },
    isLoadingLoadMore(_, newVal) {
      if (newVal === false) {
        this.initFavTooltip();
      }
    },
  },
  created() {
    this.setupDummyRestaurant();
    this.getCardComponent();
  },
  beforeDestroy() {
    clearTimeout(timeOutInstance);
    this.pageNumber = 1;
    this.favoriteRestaurants = [];
    this.getFavoriteRestaurants();
  },
  methods: {
    async toggleFavourite(restaurant) {
      // temporary toggle fav state in UI so user can toggle it again
      restaurant.isFavourited = !restaurant.isFavourited;
      // send update toggle fav to backend
      await this.toggleFavouriteRestaurant(restaurant.id);
    },
    async getCardComponent() {
      let moduleRequest;
      try {
        if (this.isMobile) {
          moduleRequest = await useLazyImport(() =>
            import(
              /* webpackChunkName: "RestaurantCardFullDetail" */ "@/components/Shared/RestaurantCardFullDetail"
            )
          );
          this.restaurantCardComponent = moduleRequest.default;
        } else {
          moduleRequest = await useLazyImport(() =>
            import(
              /* webpackChunkName: "RestaurantCard" */ "@/components/Shared/RestaurantCard/RestaurantCard"
            )
          );
          this.restaurantCardComponent = moduleRequest.default;
        }
      } catch (err) {
        this.$rollbar.error(err);
        // if chunkg load error happen
        this.$alert.error("Oops, error when loading the page, please refresh");
      }
    },
    initFavTooltip() {
      if (this.isMobile) {
        return;
      }
      this.$nextTick(() => {
        timeOutInstance = setTimeout(() => {
          const el = document.querySelectorAll(".restaurant-card-fav-button");
          const config = {
            trigger: "mouseenter",
          };
          if (el && el.length) {
            this.tooltipInstance = module.tooltip(
              el,
              "toggle",
              "yellow",
              config
            );
          }
        }, 500);
      });
    },
    buildCardComponentProps(restaurant) {
      if (!this.isLoading) {
        restaurant.isFavourited = true;
      } else {
        restaurant.isFavourited = false;
      }
      return {
        isLoading: this.isLoading,
        isShowFavouriteButton: true,
        restaurant,
      };
    },
    onHover(restaurant, index) {
      try {
        if (this.tooltipInstance) {
          const selectedTooptipInstance = this.tooltipInstance[index];
          const text = restaurant.isFavourited
            ? "Remove from Favourite"
            : "Add to Favourite";
          if (selectedTooptipInstance) {
            selectedTooptipInstance.setContent(text);
          }
        }
      } catch (err) {
        this.$rollbar.error(err);
      }
    },
    setupDummyRestaurant() {
      for (let index = 0; index < 4; index++) {
        this.dummyFavorites.push(initDummyRestaurant());
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.restaurant-card {
  @apply w-full;
}
</style>
