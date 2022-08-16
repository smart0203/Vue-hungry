<template>
  <div
    v-observe-visibility="
      !isInitialDataLoaded
        ? {
            callback: visibilityChanged,
            throttle: 500,
          }
        : false
    "
  >
    <AllRestaurantView
      :key="viewId"
      :is-loading="isInitialLoading"
      :restaurants="restaurants"
      @on-restaurant-clicked="trackClicked"
    >
      {{ !isLoading ? sectionTitle : "" }}
    </AllRestaurantView>

    <div class="my-4 text-center">
      <button
        v-if="isShowLoadMore"
        v-observe-visibility="
          isShowLoadMore
            ? {
                callback: loadMoreVisible,
                throttle: 5000,
              }
            : false
        "
        class="flex items-center justify-center px-2 py-1 mx-auto text-sm text-white capitalize rounded-lg lg:text-sm bg-red-dark disabled:opacity-50 hover:opacity-75 all-restaurant-load-more-button"
        :disabled="isLoading"
        @click="loadMore"
      >
        {{ isLoading ? $t("pleaseWait") : $t("showMore") }}
      </button>
    </div>
  </div>
</template>

<script>
import { initDummyRestaurant } from "@/services/restaurant";
import getSectionData from "@/services/getSectionData";
import AllRestaurantView from "./AllRestaurantView.vue";
import { nanoid } from "nanoid";
import { selectedCityId } from "@/composable/selectCity";
import debounce from "lodash-es/debounce";

export default {
  components: {
    AllRestaurantView,
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
      isInitialLoading: true,
      isInitialDataLoaded: false,
      isLoading: true,
      isVisible: false,
      isShowLoadMore: true,
      dummyRestaurants: [],
      realRestaurants: [],
      viewId: nanoid(3),
      pageNumber: 1,
      sectionTitle: "",
      clevertapEventName: "",
    };
  },
  computed: {
    restaurants() {
      if (this.realRestaurants.length) {
        return this.realRestaurants;
      }
      return this.dummyRestaurants;
    },
    pageSize() {
      return this.isDesktop ? 10 : 10;
    },
  },
  watch: {
    selectedCityId() {
      this.debounceOnCityChange();
    },
    isVisible: {
      handler(newVal) {
        if (newVal === true) {
          this.getRealRestaurant();
        }
      },
    },
  },
  created() {
    this.debounceOnCityChange = debounce(this.onCityIdChange, 500);
  },
  mounted() {
    this.initDummyRestaurant();
  },
  methods: {
    visibilityChanged(visibility) {
      this.isVisible = visibility;
    },
    loadMoreVisible(visibility) {
      if (visibility && !this.isLoading && !this.isInitialLoading) {
        this.loadMore();
      }
    },
    initDummyRestaurant() {
      const dummyCount = this.isDesktop ? 10 : 3;
      let dummys = [];
      for (let i = 0; i < dummyCount; i++) {
        const dummy = initDummyRestaurant();
        dummys.push(dummy);
      }
      this.dummyRestaurants = Object.freeze(dummys);
    },
    loadMore() {
      this.pageNumber += 1;
      this.getRealRestaurant(true);
    },
    async getRealRestaurant(isLoadMore = false) {
      if (
        this.allowDoRequest === false ||
        (isLoadMore && this.isInitialDataLoaded === false)
      ) {
        return;
      }
      try {
        this.$emit("on-section-start-request", this.viewId);
        this.isLoading = true;
        const result = await getSectionData({
          order: this.apiOrder,
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
        });
        this.$emit("on-section-finish-request", this.viewId);
        if (result.isSuccess) {
          if (result.data && result.data.length) {
            const restaurantData = Object.freeze(result.data);
            this.sectionTitle = result.title;
            this.clevertapEventName = result.clevertapEventName;
            this.realRestaurants.push(...restaurantData);
            if (!isLoadMore) {
              this.isInitialDataLoaded = true;
            }
          }
          if (!result.links?.next) {
            this.isShowLoadMore = false;
          }
          this.isLoading = false;
          this.isInitialLoading = false;
          return;
        }
        this.$alert.error(result.message);
      } catch (err) {
        if (err.message) {
          this.$alert.error(err.message);
        }
      }
    },
    onCityIdChange() {
      this.pageNumber = 1;
      this.viewId = nanoid(3);
      this.isShowLoadMore = true;
      this.isInitialDataLoaded = false;
      this.isLoading = true;
      this.isInitialLoading = true;
      this.realRestaurants = [];
      if (this.isVisible) {
        this.getRealRestaurant();
      }
    },
    trackClicked({ index, restaurant }) {
      const listingIndex = index + 1;
      const id = restaurant.id || restaurant.branchId;
      const url = `${window.location.origin}${restaurant.link.value}`;
      this.$track(
        "HOME_SECTION_TAPPED",
        {
          homeSectionID: id.toString(),
          homeSectionType: restaurant.type,
          homeSectionName: this.clevertapEventName,
          homeSectionOrder: this.homeSectionOrder,
          homeSectionListingName: restaurant.name,
          homeSectionListingOrder: listingIndex,
          homeSectionURL: url,
        },
        true
      );
    },
  },
};
</script>
