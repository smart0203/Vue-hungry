<template>
  <div class="my-2 wrapper">
    <div
      class="py-3 text-sm font-black text-center lg:font-black lg:text-center lg:text-xl text-red-dark"
    >
      {{ $t("featuredRestaurants") }}
    </div>
    <div
      v-observe-visibility="{
        callback: registerVisibilityObserver,
        once: true,
        throttle: 300,
      }"
    >
      <component
        :is="selectedComponent"
        :key="viewId"
        v-bind="componentProps"
      ></component>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import {
  getFeaturedRestaurant,
  initDummyRestaurant,
} from "@/services/restaurant";
import { nanoid } from "nanoid";
import { selectedCityId } from "@/composable/selectCity";
import debounce from "lodash-es/debounce";

export default {
  setup() {
    return {
      selectedCityId,
    };
  },
  data() {
    return {
      selectedComponent: "",
      dummyFeaturedRestaurants: [],
      realFeaturedRestaurants: [],
      isLoading: true,
      isVisible: false,
      viewId: nanoid(3),
    };
  },
  computed: {
    ...mapState(["lang"]),
    ...mapGetters(["baseUrlWithLang"]),
    featuredRestaurants() {
      if (!this.isLoading && this.isVisible) {
        return this.realFeaturedRestaurants;
      }
      return this.dummyFeaturedRestaurants;
    },
    componentProps() {
      return {
        isLoading: this.isLoading,
        restaurantFeatured: this.featuredRestaurants,
      };
    },
  },
  watch: {
    selectedCityId() {
      this.debounceOnCityChange();
    },
  },
  created() {
    this.initDummyRestaurant();
    this.getComponent();
    this.getFeaturedRestaurant();
    this.debounceOnCityChange = debounce(this.onCityIdChange, 500);
  },
  methods: {
    registerVisibilityObserver(isVisible) {
      if (isVisible === true) {
        this.isVisible = true;
      }
    },
    initDummyRestaurant() {
      let dummys = [];
      for (let index = 1; index <= 3; index++) {
        const dummy = initDummyRestaurant();
        dummys.push(dummy);
      }
      this.dummyFeaturedRestaurants = Object.freeze(dummys);
    },
    async getComponent() {
      let moduleRequest;
      try {
        if (this.isMobile) {
          moduleRequest = await this.$useLazyImport(() =>
            import(
              /* webpackChunkName: "MetaFeaturedViewMobile" */ "./MetaFeaturedViewMobile"
            )
          );
          this.selectedComponent = moduleRequest.default;
        } else {
          moduleRequest = await this.$useLazyImport(() =>
            import(
              /* webpackChunkName: "MetaFeaturedViewDesktop" */ "./MetaFeaturedViewDesktop"
            )
          );
          this.selectedComponent = moduleRequest.default;
        }
      } catch (err) {
        this.$rollbar.error(err);
        // if chunkg load error happen
        this.$alert.error("Oops, error when loading the page, please refresh");
      }
    },
    async getFeaturedRestaurant() {
      try {
        this.isLoading = true;
        const result = await getFeaturedRestaurant({
          cityId: this.selectedCityId,
        });
        if (result.isSuccess && result.data) {
          if (result.data && result.data.length) {
            const featured = result.data.map((restaurant) => {
              return {
                ...restaurant,
                url: this.baseUrlWithLang + restaurant.url,
              };
            });
            this.realFeaturedRestaurants = Object.freeze(featured);
          }
          this.isLoading = false;
        } else {
          this.$alert.error(result.message);
        }
      } catch (err) {
        if (err.message) {
          this.$alert.error(err.message);
        }
      }
    },
    async onCityIdChange() {
      this.viewId = nanoid(3);
      this.isLoading = true;
      // save current restaurant array to temp for later use
      const restaurantTemp = [...this.realFeaturedRestaurants];
      // set realFeaturedRestaurants to empty to restaurant computed using dummyRestaurant
      this.realFeaturedRestaurants = [];
      await this.getFeaturedRestaurant();
      if (this.realFeaturedRestaurants.length === 0) {
        // if after fetch API again and restaurant still empty then set to temp
        this.realFeaturedRestaurants = Object.freeze(restaurantTemp);
      }
    },
  },
};
</script>
<style scoped>
.wrapper {
  background: #fcdede;
}
</style>
