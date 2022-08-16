<template>
  <div v-if="isShow">
    <div
      v-observe-visibility="{
        callback: visibilityChanged,
        throttle: 300,
      }"
    >
      <HomeSliderView
        :key="viewId"
        :is-loading="isLoading"
        :restaurants="sectionRestaurants"
        @on-restaurant-clicked="trackRestaurantClicked"
      >
        <div class="relative">
          <div class="w-full lg:text-center">
            {{ section.title }}
          </div>
          <div
            class="absolute top-0 right-0 flex flex-col items-center justify-center h-full px-2 text-sm font-normal capitalize hover:underline"
          >
            <router-link
              v-if="section.showSeeAllButton"
              :to="seeAllLink"
              :class="isLoading ? ' text-gray-300' : 'text-red-dark'"
              >{{ $t("seeAll") }}</router-link
            >
          </div>
        </div>
      </HomeSliderView>
    </div>
  </div>
</template>

<script>
import { initDummyRestaurant } from "@/services/restaurant";
import getSectionData from "@/services/getSectionData";
import HomeSliderView from "./HomeSliderView";
import { nanoid } from "nanoid";
import { selectedCityId } from "@/composable/selectCity";
import debounce from "lodash-es/debounce";
import { ROUTE_SEARCH_PAGE } from "@/lib/constant";

export default {
  components: {
    HomeSliderView,
  },
  props: {
    homeSectionOrder: {
      type: Number,
      required: true,
    },
    apiOrder: {
      type: Number,
      required: true,
    },
    allowDoRequest: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    return {
      selectedCityId,
    };
  },
  data() {
    return {
      ROUTE_SEARCH_PAGE,
      isShow: true,
      isLoading: true,
      isVisible: false,
      isDataLoaded: false,
      viewId: nanoid(3),
      section: {
        title: "",
        clevertapEventName: "",
        dummyRestaurants: [],
        realRestaurants: [],
        showSeeAllButton: false,
      },
    };
  },
  computed: {
    lang() {
      return this.$store.state.lang;
    },
    sectionRestaurants() {
      if (this.section.realRestaurants.length && this.isLoading === false) {
        return this.section.realRestaurants;
      }
      return this.section.dummyRestaurants;
    },
    seeAllLink() {
      const searchPage = this.$router.resolve({
        name: ROUTE_SEARCH_PAGE,
      }).href;
      return `${searchPage}?section=section_${this.apiOrder}`;
    },
  },
  watch: {
    selectedCityId() {
      this.debounceOnCityChange();
    },
    isVisible: {
      handler(newVal) {
        if (newVal === true && this.isDataLoaded === false) {
          this.getRealRestaurant();
        }
      },
    },
  },
  created() {
    this.initDummyRestaurant();
    this.debounceOnCityChange = debounce(this.onCityIdChange, 500);
  },
  methods: {
    visibilityChanged(visibility) {
      this.isVisible = visibility;
    },
    initDummyRestaurant() {
      const dummyCount = this.isDesktop || this.isTablet ? 5 : 2;
      let dummys = [];
      for (let i = 0; i < dummyCount; i++) {
        const dummy = initDummyRestaurant();
        dummys.push(dummy);
      }
      this.section.dummyRestaurants = Object.freeze(dummys);
    },
    async getRealRestaurant() {
      if (this.isDataLoaded === true || this.allowDoRequest === false) {
        return;
      }
      try {
        this.$emit("on-section-start-request", this.viewId);
        this.isLoading = true;
        const result = await getSectionData({ order: this.apiOrder });
        this.$emit("on-section-finish-request", this.viewId);
        if (result.isSuccess) {
          if (result.data && result.data.length) {
            this.section.title = result.title;
            this.section.clevertapEventName = result.clevertapEventName;
            this.section.realRestaurants = Object.freeze(result.data);
            this.section.showSeeAllButton = false;
            this.isDataLoaded = true;

            this.isLoading = false;
            this.isShow = true;
            if (
              this.section.realRestaurants &&
              this.section.realRestaurants.length <= 2
            ) {
              this.isShow = false;
            }
            return;
          }
          this.isShow = false;
        } else {
          if (result.message) {
            this.$alert.error(result.message);
          }
          this.isShow = false;
        }
      } catch (err) {
        this.$emit("on-section-finish-request", this.viewId);
        if (err.message) {
          this.$alert.error(err.message);
        }
        this.isShow = false;
      }
    },
    trackRestaurantClicked(param) {
      if (param.index !== undefined && param.restaurant) {
        const listingIndex = param.index + 1;
        const id = param.restaurant.id || param.restaurant.branchId;
        const url = `${window.location.origin}${param.restaurant.link.value}`;
        const isAds = param.restaurant.isAds;
        if (isAds) {
          this.$track("ADS_CLICKED", {
            restaurantId: id.toString(),
            restaurantLink: param.restaurant.link.value,
            restaurantBranchId: param.restaurant.branchId,
            restaurantBranchLink: param.restaurant.branchLink,
            restaurantName: param.restaurant.name,
            homeSectionName: this.section.clevertapEventName,
            homeSectionListingOrder: listingIndex,
          });
        }
        this.$track(
          "HOME_SECTION_TAPPED",
          {
            homeSectionID: id.toString(),
            homeSectionType: param.restaurant.type,
            homeSectionName: this.section.clevertapEventName,
            homeSectionOrder: this.homeSectionOrder,
            homeSectionListingName: param.restaurant.name,
            homeSectionListingOrder: listingIndex,
            homeSectionURL: url,
          },
          true
        );
      }
    },
    onCityIdChange() {
      this.viewId = nanoid(3);
      this.isDataLoaded = false;
      this.isLoading = true;
      this.section.realRestaurants = [];
      if (this.isVisible) {
        this.getRealRestaurant();
      }
    },
  },
};
</script>
