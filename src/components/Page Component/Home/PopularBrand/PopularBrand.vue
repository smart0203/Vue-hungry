<template>
  <div v-if="isShow">
    <div
      v-observe-visibility="{
        callback: visibilityChanged,
        throttle: 300,
      }"
    >
      <component
        :is="selectedComponent"
        :key="viewId"
        :title="sectionTitle"
        :popular-brand="popularBrand"
        :is-loading="isLoading"
        @on-brand-clicked="trackClicked"
      ></component>
    </div>
  </div>
</template>

<script>
import { nanoid } from "nanoid";
import getSectionData from "@/services/getSectionData";
import { selectedCityId } from "@/composable/selectCity";
import debounce from "lodash-es/debounce";
import useLazyImport from "@/composable/useLazyImport";

export default {
  components: {
    PopularBrandView: () => useLazyImport(() => import("./PopularBrandView")),
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
      selectedComponent: "",
      isVisible: false,
      isLoading: true,
      isDataLoaded: false,
      popularBrandList: [],
      dummyPopular: [],
      sectionTitle: "",
      clevertapEventName: "",
      isShow: true,
      viewId: nanoid(3),
    };
  },
  computed: {
    popularBrand() {
      return this.isLoading === false &&
        this.popularBrandList &&
        this.popularBrandList.length > 0
        ? this.popularBrandList
        : this.dummyPopular;
    },
  },
  watch: {
    isVisible: {
      handler(newVal) {
        if (newVal && this.isDataLoaded === false) {
          this.getPopularList();
        }
      },
    },
    selectedCityId() {
      this.debounceOnCityChange();
    },
  },
  mounted() {
    this.setupDummy();
  },
  created() {
    this.getTopCategoriesView();
    this.debounceOnCityChange = debounce(this.onCityIdChange, 500);
  },
  methods: {
    async getTopCategoriesView() {
      let moduleRequest;
      try {
        if (this.isMobile) {
          moduleRequest = await useLazyImport(() =>
            import(
              /* webpackChunkName: "PopularBrandViewMobileChunk" */ "./PopularBrandViewMobile.vue"
            )
          );
          this.selectedComponent = moduleRequest.default;
        } else {
          moduleRequest = await useLazyImport(() =>
            import(
              /* webpackChunkName: "PopularBrandViewChunk" */ "./PopularBrandView.vue"
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
    visibilityChanged(visibility) {
      this.isVisible = visibility;
    },
    setupDummy() {
      let count = 4;
      if (this.isDesktop) {
        count = 7;
      }
      for (let index = 0; index < count; index++) {
        this.dummyPopular.push({
          id: index,
          title: "",
          totalRestaurants: 0,
          desktopPhotos: [],
          mobilePhotos: [],
        });
      }
    },
    trackClicked({ index, brand, link }) {
      const listingIndex = index + 1;
      const url = `${window.location.origin}${link}`;

      const isAds = brand.isAds;
      if (isAds) {
        this.$track("ADS_CLICKED", {
          restaurantId: brand.id,
          restaurantBranchLink: `/restaurants/search?branch_id=${brand.id}`,
          restaurantName: brand.name,
          homeSectionName: this.section.clevertapEventName,
          homeSectionListingOrder: listingIndex,
        });
      }
      this.$track(
        "HOME_SECTION_TAPPED",
        {
          homeSectionID: brand.id.toString(),
          homeSectionType: brand.type,
          homeSectionName: this.clevertapEventName,
          homeSectionOrder: this.homeSectionOrder,
          homeSectionListingName: brand.name,
          homeSectionListingOrder: listingIndex,
          homeSectionURL: url,
        },
        true
      );
    },
    async getPopularList() {
      if (this.isDataLoaded === true || this.allowDoRequest === false) {
        return;
      }
      this.isLoading = true;
      this.$emit("on-section-start-request", this.viewId);
      const result = await getSectionData({ order: this.apiOrder });

      this.$emit("on-section-finish-request", this.viewId);

      if (result.isSuccess) {
        if (result.data && result.data.length) {
          this.sectionTitle = result.title;
          this.clevertapEventName = result.clevertapEventName;
          this.popularBrandList = Object.freeze(result.data);
          this.isDataLoaded = true;
          if (this.popularBrandList && this.popularBrandList.length <= 2) {
            this.isShow = false;
          }
          this.isLoading = false;
          return;
        }
        this.isLoading = false;
        this.isShow = false;
      } else {
        this.$alert.error(result.message);
      }
    },
    onCityIdChange() {
      this.viewId = nanoid(3);
      this.isLoading = true;
      this.isDataLoaded = false;
      this.popularBrandList = [];
      if (this.isVisible) {
        this.getPopularList();
      }
    },
  },
};
</script>
