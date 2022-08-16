<template>
  <div ref="restaurantSearch" class="restaurant-search-wrapper">
    <slot
      name="input-view"
      :handler="{
        submitHandler,
        inputHandler,
        toggleHiddenSuggestion,
        focusHandler,
      }"
      :meta="{ isLoading, isSuccess, isAnyResult }"
    ></slot>
    <div>
      <slot
        name="suggestion-view"
        :keyword="keyword"
        :suggestions="{
          restaurantsSuggestions,
          locationsSuggestions,
          cuisinesSuggestions,
        }"
        :handler="{ toggleHiddenResult }"
        :meta="{ isLoading, isSuccess, isAnyResult, isShowSuggestion }"
      ></slot>
    </div>
  </div>
</template>

<script>
import throttle from "lodash-es/throttle";
import {
  getSearchSuggestion,
  getAdsSearchSuggestion,
} from "@/services/getSearchSuggestion";
import { selectedCityId } from "@/composable/selectCity";
import { onClickOutside } from "@vueuse/core";
import { ref } from "@vue/composition-api";
import adsMapper from "@/helper/adsMapper";
const THROTTLE_IN_SECOND = 1500;
const MIN_KEYWORD = 3;

export default {
  setup() {
    const restaurantSearch = ref(null);
    const isShowSuggestion = ref(false);
    return {
      onClickOutside,
      restaurantSearch,
      selectedCityId,
      isShowSuggestion,
    };
  },
  data() {
    return {
      keyword: "",
      isLoading: false,
      isSuccess: false,
      isAnyResult: false,
      suggestions: {
        restaurants: {
          isShowAll: false,
          data: [],
        },
        locations: {
          isShowAll: false,
          data: [],
        },
        cuisines: {
          isShowAll: false,
          data: [],
        },
      },
      adsSugestions: [],
    };
  },
  computed: {
    allowSearchByCity() {
      return this.$store.state.webConfig.allowSearchByCity;
    },
    restaurantsSuggestions() {
      return this.suggestions.restaurants;
    },
    locationsSuggestions() {
      return this.suggestions.locations;
    },
    cuisinesSuggestions() {
      return this.suggestions.cuisines;
    },
  },
  watch: {
    keyword(val) {
      if (val.length >= MIN_KEYWORD) {
        this.isLoading = true;
        this.isShowSuggestion = true;
        this.getSuggestion(val);
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.onClickOutside(this.restaurantSearch, () => {
        this.isShowSuggestion = false;
        if (this.keyword.length === 0) {
          this.resetSearchResult();
        }
      });
    });
  },
  methods: {
    inputHandler: throttle(
      function (event) {
        this.keyword = event.target.value.trim();
      },
      THROTTLE_IN_SECOND,
      { leading: false }
    ),
    submitHandler() {
      if (this.keyword.length === 0) {
        return;
      }
      this.getSuggestion(this.keyword);
    },
    getSuggestion: throttle(
      async function (keyword) {
        try {
          this.isLoading = true;
          this.toggleHiddenResult("restaurant");
          this.toggleHiddenResult("cuisine");
          this.toggleHiddenResult("location");
          const resp = await getSearchSuggestion(
            keyword,
            this.allowSearchByCity ? this.selectedCityId : null
          );
          if (resp.isSuccess) {
            this.isSuccess = true;
            const { restaurants, locations, cuisines } = resp.data;
            if (this.adsSugestions && Array.isArray(this.adsSugestions)) {
              this.adsSugestions.forEach((currentAds) => {
                adsMapper(currentAds, restaurants);
              });
            }
            if (
              restaurants.length > 0 ||
              locations.length > 0 ||
              cuisines.length > 0
            ) {
              this.isAnyResult = true;
            } else {
              this.isAnyResult = false;
            }
            // restaurant result
            this.suggestions.restaurants.isShowAll = false;
            this.suggestions.restaurants.data = restaurants;
            // location result
            this.suggestions.locations.isShowAll = false;
            this.suggestions.locations.data = locations.map((location) => {
              return {
                id: location.id,
                type: location.type,
                ...location.attributes,
              };
            });
            //cuisine result
            this.suggestions.cuisines.isShowAll = false;
            this.suggestions.cuisines.data = cuisines.map((cuisine) => {
              return {
                id: cuisine.id,
                type: cuisine.type,
                ...cuisine.attributes,
              };
            });

            this.toggleHiddenSuggestion(true);
          } else {
            this.isSuccess = false;
          }
          this.isLoading = false;
        } catch (err) {
          if (!err.dontReport) {
            this.isSuccess = false;
          }
        }
      },
      THROTTLE_IN_SECOND,
      { leading: false }
    ),
    async getSuggestionAds() {
      const { isSuccess, data } = await getAdsSearchSuggestion();
      if (isSuccess) {
        const adsData = data.map((ad) => {
          return {
            ...ad,
            isAds: true,
          };
        });
        this.adsSugestions = adsData;
        this.suggestions.restaurants.data = adsData;
      }
      return isSuccess;
    },
    async focusHandler() {
      if (this.keyword.length === 0) {
        if (this.adsSugestions.length === 0) {
          const isSuccess = await this.getSuggestionAds();
          if (isSuccess && this.adsSugestions.length) {
            this.isShowSuggestion = true;
            this.isAnyResult = true;
          }
          return;
        }
        if (this.adsSugestions.length) {
          this.suggestions.restaurants.data = this.adsSugestions;
          this.isShowSuggestion = true;
          this.isAnyResult = true;
          return;
        }
        return;
      }
      if (this.isAnyResult) {
        this.isShowSuggestion = true;
        return;
      }
      if (!this.isAnyResult && this.keyword.length >= MIN_KEYWORD) {
        this.getSuggestion(this.keyword);
      }
    },
    toggleHiddenResult(param) {
      if (param === "restaurant") {
        this.suggestions.restaurants.isShowAll =
          !this.suggestions.restaurants.isShowAll;
      } else if (param === "cuisine") {
        this.suggestions.cuisines.isShowAll =
          !this.suggestions.cuisines.isShowAll;
      } else if (param === "location") {
        this.suggestions.locations.isShowAll =
          !this.suggestions.locations.isShowAll;
      }
    },
    toggleHiddenSuggestion(param) {
      if (param) {
        this.isShowSuggestion = param;
      } else {
        this.isShowSuggestion = !this.isShowSuggestion;
      }
    },
    resetSearchResult() {
      this.suggestions.restaurants.data = [];
      this.suggestions.restaurants.locations = [];
      this.suggestions.restaurants.cuisines = [];
      this.isAnyResult = false;
      this.isLoading = false;
    },
  },
};
</script>
