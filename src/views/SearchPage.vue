<template>
  <div class="flex mt-5 max-width">
    <section
      class="flex-grow-0 w-full mb-4 lg:mb-6 lg:mt-8 search-main-section"
    >
      <div class="lg:mr-10">
        <RestaurantSearchSuggestion>
          <template #default="{ handler, meta }">
            <form
              class="relative flex items-center mx-4 rounded-full"
              style="box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16)"
              @submit.prevent="freshSearch"
            >
              <div
                v-if="!isConfigLoading"
                class="flex-shrink-0 pr-4 custom-dropdown"
              >
                <select
                  :value="selectedCityId"
                  class="h-full rounded-full"
                  @change="
                    selectCity($event);
                    handler.submitHandler();
                  "
                >
                  <option
                    v-for="cities in availableCities"
                    :key="cities.id"
                    :value="cities.id"
                    class="capitalize"
                  >
                    {{ cities.name }}
                  </option>
                </select>
              </div>
              <div
                v-if="allowSearchByCity"
                class="h-6 searchbox-separator"
              ></div>
              <div v-if="isDesktop" class="flex-shrink-0 h-full ml-2">
                <img
                  src="@/assets/icon-search-red.png"
                  width="22"
                  height="22"
                  loading="lazy"
                  alt="search icon"
                />
              </div>
              <input
                v-model="tempKeyword"
                type="search"
                :placeholder="$t('searchRestaurantPlaceHolder')"
                name="search"
                class="w-full px-2 py-2 truncate rounded-full"
                autocomplete="off"
                @input="handler.inputHandler"
                @focus="isDesktop ? handler.focusHandler() : showSearchModal()"
              />
              <button
                class="px-4 py-2 font-black text-white capitalize border rounded-full bg-red-dark lg:whitespace-nowrap border-red-dark disabled:opacity-50"
                :class="meta.isLoading ? 'bg-red-light' : 'bg-red-dark'"
                :disabled="meta.isLoading === true || isLoading"
                @click="
                  handler.toggleHiddenSuggestion(false);
                  freshSearch;
                "
              >
                {{ isMobile ? $t("search") : $t("findARestaurant") }}
              </button>
            </form>
          </template>
        </RestaurantSearchSuggestion>

        <!-- sort by -->
        <div class="flex items-center mx-4 my-4">
          <h2 class="font-black capitalize">{{ $t("filter") }}</h2>
          <HHAcceptTerm
            v-model="isDineIn"
            :disabled="!isDelivery || isLoading"
            :label="capitalize($t('dineIn'))"
            class="px-2 text-sm"
          />
          <HHAcceptTerm
            v-model="isDelivery"
            :label="capitalize($t('delivery'))"
            class="px-2 text-sm"
            :disabled="!isDineIn || isLoading"
          />
          <div class="flex-auto"></div>
          <button
            v-if="isDesktop"
            :disabled="isLoading"
            class="px-1 py-2 text-sm font-black capitalize text-red-dark hover:underline disabled:opacity-50"
            @click="clearFilter('all')"
          >
            {{ $t("resetFilter") }}
          </button>
          <div
            v-else
            id="map-view-trigger"
            class="flex items-center px-2 text-sm rounded-full shadow"
          >
            <img
              class="flex-shrink-0 inline mr-1"
              src="@/assets/icon-map-black.png"
              width="13"
              height="13"
              loading="lazy"
              alt="map icon"
            />
            <button
              class="capitalize bg-white"
              @click="$modal.show('map-modal')"
            >
              {{ $t("mapView") }}
            </button>
          </div>
        </div>

        <!-- filter bar -->
        <div
          class="relative flex pb-2 mx-4 my-4 overflow-x-scroll lg:overflow-visible"
        >
          <!-- cuisine -->
          <button
            class="flex flex-1 px-2 py-2 mr-2 text-sm text-left rounded-full lg:px-3 lg:mr-2 lg:mr-4 cuisine-tab-filter whitespace-nowrap"
            :class="isFilterByCuisines ? 'active-filter' : null"
            style="box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16)"
            :disabled="isLoading"
            @click="showFilterModal('cuisine')"
          >
            <span class="flex-auto capitalize">
              {{ $t("cuisines") }}
              <span v-if="isFilterByCuisines && isDesktop"
                >{{ `(${selectedCuisines.length})` }}
              </span>
            </span>
            <div>
              <span
                v-if="isDesktop && isFilterByCuisines"
                class="flex items-center justify-center bg-white rounded-full"
                style="width: 20px; height: 20px"
                @click="clearFilter('cuisine')"
              >
                <img
                  class="inline-block"
                  src="@/assets/icon-close-red.png"
                  loading="lazy"
                  style="width: 10px; height: 10px"
                  alt=""
                />
              </span>
            </div>
          </button>
          <!-- price -->
          <button
            class="flex flex-1 px-2 py-2 mr-2 text-sm text-left rounded-full lg:px-3 lg:mr-2 lg:mr-4 price-tab-filter whitespace-nowrap"
            style="box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16)"
            :class="isFilterByPrice ? 'active-filter' : null"
            @click="showFilterModal('price')"
          >
            <span class="flex-auto capitalize"
              >{{ $t("price") }}
              <span v-if="isFilterByPrice && isDesktop" class="text-xs">
                ({{ $money(startPrice) }} - {{ $money(endPrice) }})
              </span>
            </span>
            <div>
              <span
                v-if="isDesktop && isFilterByPrice"
                class="flex items-center justify-center bg-white rounded-full"
                style="width: 20px; height: 20px"
                @click="clearFilter('price')"
              >
                <img
                  class="inline-block"
                  src="@/assets/icon-close-red.png"
                  loading="lazy"
                  style="width: 10px; height: 10px"
                  alt=""
                />
              </span>
            </div>
          </button>
          <!-- promotion -->
          <!-- <button
            v-if="false"
            class="flex flex-1 px-2 py-2 mr-2 text-sm text-left rounded-full lg:px-3 lg:mr-2 lg:mr-4 promotion-tab-filter whitespace-nowrap"
            :class="isFilterByPromotions ? 'active-fiter' : null"
            style="box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16)"
            @click="showFilterModal('promotion')"
          >
            <span class="flex-auto capitalize"
              >{{ $t("promotion") }}
              <span v-if="isFilterByPromotions && isDesktop" class="text-xs">
                ({{ selectedPromotions.length }})
              </span>
            </span>
            <div>
              <span
                v-if="isDesktop && isFilterByPromotions"
                class="flex items-center justify-center bg-white rounded-full"
                style="width: 20px; height: 20px"
                @click="clearFilter('promotion')"
              >
                <img
                  class="inline-block"
                  src="@/assets/icon-close-red.png"
                  style="width: 10px; height: 10px"
                  loading="lazy"
                  alt=""
                />
              </span>
            </div>
          </button> -->
          <!-- packageType -->
          <button
            class="flex flex-1 px-2 py-2 mr-2 text-sm text-left rounded-full lg:px-3 lg:mr-2 lg:mr-4 packageType-tab-filter whitespace-nowrap"
            :class="isFilterByPackageType ? 'active-filter' : null"
            style="box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16)"
            @click="showFilterModal('packageType')"
          >
            <span class="flex-auto capitalize"
              >{{ $t("packageType") }}
              <span v-if="isFilterByPackageType && isDesktop" class="text-xs">
                ({{ selectedPackageType.length }})
              </span>
            </span>
            <div>
              <span
                v-if="isDesktop && isFilterByPackageType"
                class="flex items-center justify-center bg-white rounded-full"
                style="width: 20px; height: 20px"
                @click="clearFilter('packageType')"
              >
                <img
                  class="inline-block"
                  src="@/assets/icon-close-red.png"
                  loading="lazy"
                  style="width: 10px; height: 10px"
                  alt=""
                />
              </span>
            </div>
          </button>
          <!-- location -->
          <button
            class="flex flex-1 px-2 py-2 mr-2 text-sm text-left rounded-full lg:px-3 lg:mr-2 lg:mr-4 location-tab-filter whitespace-nowrap"
            :class="isFilterByLocations ? 'active-filter' : ''"
            style="box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16)"
            @click="showFilterModal('location')"
          >
            <span class="flex-auto capitalize">
              {{ $t("location") }}
              <span v-if="isFilterByLocations && isDesktop" class="text-xs">
                ({{ selectedLocations.length }})
              </span>
            </span>
            <div>
              <span
                v-if="isDesktop && isFilterByLocations"
                class="flex items-center justify-center bg-white rounded-full"
                style="width: 20px; height: 20px"
                @click="clearFilter('location')"
              >
                <img
                  class="inline-block"
                  src="@/assets/icon-close-red.png"
                  loading="lazy"
                  style="width: 10px; height: 10px"
                  alt=""
                />
              </span>
            </div>
          </button>
          <!-- more -->
          <!-- <button
            v-if="false"
            class="flex px-3 py-2 mr-2 text-sm text-left capitalize rounded-full lg:mr-4 more-tab-filter whitespace-nowrap"
            style="box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16)"
            :class="isFilterByDates || isFilterByTimes ? 'active-filter' : ''"
            @click="showFilterModal('date')"
          >
            <span class="flex-auto px-2">{{ $t("more") }} </span>
            <div>
              <span
                v-if="isDesktop && isFilterByDates"
                class="flex items-center justify-center bg-white rounded-full"
                style="width: 20px; height: 20px"
                @click="clearFilter('date')"
              >
                <img
                  class="inline-block"
                  src="@/assets/icon-close-red.png"
                  loading="lazy"
                  style="width: 10px; height: 10px"
                  alt=""
                />
              </span>
            </div>
          </button> -->

          <component
            :is="desktopComponent.inlinePopup"
            v-if="isDesktop && isShowInlinePopUp"
            :style="inlinePopUpPosition"
            :is-loading="isLoading"
            @on-close-clicked="closeHandler"
            @on-filter-applied="filterApplied"
            @on-filter-cleard="clearHandler"
          >
          </component>
        </div>

        <!-- result section -->
        <section class="lg:min-h-screen">
          <p
            v-if="!isInitialLoading && results.length"
            class="mx-4 my-3 lg:mb-6 lg:text-xl"
          >
            {{ $t("hereAreYourSearchResult") }}
          </p>
          <div v-if="results.length" class="mb-2">
            <RestaurantCardFullDetail
              v-for="(restaurant, index) in results"
              :key="generateLoopKey(restaurant, index)"
              :is-loading="isInitialLoading"
              :restaurant="restaurant"
              @on-link-clicked="goToLink(restaurant)"
            />
          </div>
          <div v-else>
            <NoResult />
          </div>
          <div
            v-if="anyNextPage"
            v-observe-visibility="{ callback: loadMoreVisible, throttle: 500 }"
            class="flex items-center justify-center py-4 text-sm capitalize rounded-lg shadow-lg text-red-dark"
          >
            <div class="mr-2 loader small"></div>
            <span>{{ $t("pleaseWait") }}</span>
          </div>
        </section>
      </div>
    </section>

    <section
      v-if="isDesktop"
      class="sticky top-0 flex-shrink-0 h-screen search-map-section"
      style="width: 390px"
    >
      <component :is="desktopComponent.map" :restaurants="results"></component>
    </section>
    <component
      :is="mobileComponent.filterModal"
      :is-loading="isLoading"
      @on-filter-applied="filterApplied"
      @on-filter-cleard="clearHandler"
      @on-reset-filter="clearFilter('all')"
    ></component>
    <component :is="mobileComponent.searchModal" @on-submit="freshSearch">
    </component>
    <component
      :is="mobileComponent.mapModal"
      :restaurants="results"
    ></component>
  </div>
</template>

<script>
import capitalize from "lodash-es/capitalize";
import throttle from "lodash-es/throttle";
import { mapFields } from "vuex-map-fields";
import { mapGetters } from "vuex";
import qs from "qs";
import humps from "humps";
import RestaurantSearchSuggestion from "@/components/Shared/RestaurantSearchSuggestion";
import HHAcceptTerm from "@/components/Shared/HHAcceptTerm";
import { initDummyRestaurant } from "@/services/restaurant";
import RestaurantCardFullDetail from "@/components/Shared/RestaurantCardFullDetail";
import NoResult from "@/components/Page Component/Search/NoResult";
import { nanoid } from "nanoid";
import {
  availableCities,
  isLoading as isConfigLoading,
} from "@/composable/selectCity";
import generateRestaurantDeliveryFee from "@/composable/restaurantDeliveryFee";
import useLazyImport from "@/composable/useLazyImport";

export default {
  components: {
    RestaurantSearchSuggestion,
    HHAcceptTerm,
    RestaurantCardFullDetail,
    NoResult,
  },
  setup() {
    return {
      isConfigLoading,
      availableCities,
    };
  },
  data() {
    return {
      dummyRestaurants: [],
      isInitialLoading: false,
      isLoadingLoadMore: false,
      isLoadMoreVisible: false,
      isShowInlinePopUp: false,
      desktopComponent: {
        map: null,
        inlinePopup: null,
      },
      mobileComponent: {
        filterModal: null,
        searchModal: null,
        mapModal: null,
      },
      tempKeyword: "",
    };
  },
  computed: {
    ...mapFields("search", [
      "activeFilterTab",
      "searchResult",
      "anyNextPage",
      "pageNumber",
      "startPrice",
      "endPrice",
      "keyword",
      "cuisines",
      "branchId",
      "hashtags",
      "selectedCuisines",
      "selectedPromotions",
      "selectedPackageType",
      "selectedLocations",
      "selectedDates",
      "selectedTime",
      "isDineIn",
      "isDelivery",
      "sortBy",
      "isFilterByPrice",
      "section",
      "selectedCityId",
    ]),
    ...mapGetters("search", [
      "isFilterByLocations",
      "isFilterByPromotions",
      "isFilterByCuisines",
      "isFilterByDates",
      "isFilterByTimes",
      "isFilterByPackageType",
      "searchQuery",
      "serviceType",
    ]),
    allowSearchByCity() {
      return this.$store.state.webConfig.allowSearchByCity;
    },
    results() {
      return this.isInitialLoading ? this.dummyRestaurants : this.searchResult;
    },
    isLoading() {
      return this.isInitialLoading === true || this.isLoadingLoadMore === true;
    },
    inlinePopUpPosition() {
      let style;
      if (this.activeFilterTab === "cuisine") {
        style = `left: ${0}px; width: 100%`;
      } else if (this.activeFilterTab === "price") {
        style = `left: ${300}px; width: 380px`;
      } else if (this.activeFilterTab === "promotion") {
        style = `left: ${0}px; width: 100%`;
      } else if (this.activeFilterTab === "packageType") {
        style = `left: ${0}px; width: 100%`;
      } else if (this.activeFilterTab === "location") {
        style = `left: ${0}px; width: 100%`;
      } else if (this.activeFilterTab === "date") {
        style = `left: ${300}px; width: 380px`;
      }
      return style;
    },
  },
  watch: {
    searchQuery(val) {
      window.history.replaceState(null, null, `?${val}`);
    },
    selectedCityId: {
      handler(oldVal, newVal) {
        if (oldVal == newVal) {
          return;
        }
        this.freshSearch();
      },
    },
  },
  created() {
    this.parseQueryFromURL();
    if (this.isDesktop) {
      this.getRequiredDesktopComponent();
    } else {
      this.getRequiredMobileComponent();
    }
  },
  mounted() {
    this.initDummyRestaurant();
    this.freshSearch();
    this.$watch("serviceType", () => {
      this.freshSearch();
    });
  },
  methods: {
    capitalize,
    goToLink(restaurant) {
      restaurant.goToLink();
    },
    selectCity(event) {
      this.selectedCityId = event.target.value;
    },
    async getRequiredDesktopComponent() {
      try {
        let map;
        let inlineFilter;
        map = await useLazyImport(() =>
          import(
            /* webpackChunkName: "HHMap" */ "@/components/Shared/HHMap.vue"
          )
        );
        inlineFilter = await useLazyImport(() =>
          import(
            /* webpackChunkName: "FilterPopUpInline" */ "@/components/Page Component/Search/FilterPopUpInline.vue"
          )
        );
        this.desktopComponent.inlinePopup = inlineFilter.default;
        this.desktopComponent.map = map.default;
      } catch (err) {
        this.$rollbar.error(err);
        // if chunkg load error happen
        this.$alert.error("Oops, error when loading the page, please refresh");
      }
    },
    async getRequiredMobileComponent() {
      try {
        let searchModal;
        let filterModal;
        let mapModal;
        searchModal = await useLazyImport(() =>
          import(
            /* webpackChunkName: "SearchModal" */ "@/components/Page Component/Search/SearchModal.vue"
          )
        );
        filterModal = await useLazyImport(() =>
          import(
            /* webpackChunkName: "FilterModal" */ "@/components/Page Component/Search/FilterModal.vue"
          )
        );
        mapModal = await useLazyImport(() =>
          import(
            /* webpackChunkName: "mapModal" */ "@/components/Page Component/Search/MapModal.vue"
          )
        );
        this.mobileComponent.searchModal = searchModal.default;
        this.mobileComponent.filterModal = filterModal.default;
        this.mobileComponent.mapModal = mapModal.default;
      } catch (err) {
        this.$rollbar.error(err);
        // if chunkg load error happen
        this.$alert.error("Oops, error when loading the page, please refresh");
      }
    },
    showSearchModal() {
      this.$modal.show("search-modal");
    },
    freshSearch: throttle(async function () {
      this.keyword = this.tempKeyword;
      this.searchResult = [];
      this.pageNumber = 1;
      this.isInitialLoading = true;
      const result = await this.$store.dispatch("search/doSearch", {
        ignoreCity: false,
      });
      if (result.isSuccess) {
        this.isInitialLoading = false;
        generateRestaurantDeliveryFee(result.data);
      } else {
        this.$alert.error(result.message);
      }
    }, 1000),
    async loadMoreResult() {
      this.isLoadingLoadMore = true;
      const result = await this.$store.dispatch("search/doSearch", {
        ignoreCity: false,
      });
      if (result.isSuccess) {
        this.isLoadingLoadMore = false;
        generateRestaurantDeliveryFee(result.data);
      } else {
        this.$alert.error(result.message);
      }
    },
    initDummyRestaurant() {
      for (let index = 0; index < 4; index++) {
        const dummyRestaurant = initDummyRestaurant();
        this.dummyRestaurants.push(dummyRestaurant);
      }
    },
    filterApplied() {
      // hide all popup
      this.$modal.hide("filter-modal");
      this.isShowInlinePopUp = false;
      // set selected
      this.$store.dispatch("search/applyFilter", this.activeFilterTab);
      this.freshSearch();
    },
    showFilterModal(type) {
      this.activeFilterTab = type;
      if (this.isDesktop) {
        this.isShowInlinePopUp = true;
      } else {
        this.$modal.show("filter-modal");
      }
    },
    clearFilter(type) {
      if (type === "all") {
        this.$store.dispatch("search/resetSelectedCuisine");
        this.$store.dispatch("search/resetSeviceType");
        this.$store.dispatch("search/resetSelectedLocations");
        this.$store.dispatch("search/resetPrice");
        this.$store.dispatch("search/resetSelectedDates");
        this.$store.dispatch("search/resetSelectedTime");
        this.$store.dispatch("search/resetSelectedPackageType");
        this.isFilterByPrice = false;
        this.$store.dispatch("search/resetSelectedPromotions");
      } else if (type === "cuisine") {
        this.$store.dispatch("search/resetSelectedCuisine");
      } else if (type === "location") {
        this.$store.dispatch("search/resetSelectedLocations");
      } else if (type === "price") {
        this.isFilterByPrice = false;
        this.$store.dispatch("search/resetPrice");
      } else if (type === "promotion") {
        this.$store.dispatch("search/resetSelectedPromotions");
      } else if (type === "packageType") {
        this.$store.dispatch("search/resetSelectedPackageType");
      } else if (type === "date") {
        this.$store.dispatch("search/resetSelectedDates");
        this.$store.dispatch("search/resetSelectedTime");
      }
      this.activeFilterTab = "";
      // hide all popup
      this.$modal.hide("filter-modal");
      this.isShowInlinePopUp = false;
      this.freshSearch();
    },
    closeHandler() {
      this.activeFilterTab = "";
      this.isShowInlinePopUp = false;
    },
    clearHandler() {
      this.clearFilter(this.activeFilterTab);
    },
    loadMoreVisible(visible) {
      this.isLoadMoreVisible = visible;
      if (
        this.isLoadMoreVisible &&
        !this.isLoadingLoadMore &&
        this.anyNextPage &&
        this.searchResult.length > 0
      ) {
        this.pageNumber += 1;
        this.loadMoreResult();
      }
    },
    parseQueryFromURL() {
      let query = qs.parse(window.location.search, {
        ignoreQueryPrefix: true,
      });
      const camelizeQuery = humps.camelizeKeys(query);
      const {
        section,
        cuisines,
        locations,
        groupTags,
        price,
        sort,
        nameLike,
        hashtags,
        branchId,
        dineIn,
        delivery,
        date,
        startTime,
        cityId,
        packageType,
      } = camelizeQuery;
      if (nameLike) {
        this.tempKeyword = nameLike;
      }
      if (branchId) {
        this.branchId = branchId;
      }
      if (dineIn) {
        this.isDelivery = false;
      }
      if (delivery) {
        this.isDineIn = false;
      }
      if (hashtags && hashtags.length) {
        this.hashtags = hashtags;
      }
      if (cuisines && cuisines.length) {
        this.selectedCuisines = cuisines;
      }
      if (locations && locations.length) {
        this.selectedLocations = locations;
      }
      if (groupTags && groupTags.length) {
        this.selectedPromotions = groupTags;
      }
      if (packageType && packageType.length) {
        this.selectedPackageType = packageType;
      }
      if (price) {
        const parsePrice = price.split(" ");
        if (
          parsePrice &&
          parsePrice.length === 4 &&
          parsePrice[0] === "BETWEEN" &&
          parsePrice[2] === "AND"
        ) {
          this.startPrice = parseInt(parsePrice[1]) || 0;
          this.endPrice = parseInt(parsePrice[3]) || 20000;
        }
      }
      if (date) {
        this.selectedDates = [date];
      }
      if (startTime) {
        this.selectedTime = startTime;
      }
      if (sort) {
        this.sortBy = sort;
      }
      if (cityId) {
        this.selectedCityId = cityId;
      }
      if (section) {
        this.section = section;
      }
    },
    generateLoopKey(restaurant, index) {
      const restaurantId = restaurant.id || nanoid(3);
      return `${restaurantId}-${restaurant.name}-${index}`;
    },
  },
};
</script>
<style lang="scss" scoped>
.active-filter {
  @apply bg-red-pink text-black;
}
</style>
