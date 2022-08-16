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
        :item="item"
        :is-loading="isLoading"
        :title="sectionTitle"
        @on-category-clicked="trackClicked"
      ></component>
    </div>
  </div>
</template>

<script>
import { selectedCityId } from "@/composable/selectCity";
import useLazyImport from "@/composable/useLazyImport";
import getSectionData from "@/services/getSectionData";
import debounce from "lodash-es/debounce";
import { nanoid } from "nanoid";

export default {
  components: {
    TopCategoriesView: () => useLazyImport(() => import("./TopCategoriesView")),
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
      dummyItem: [],
      itemList: [],
      isLoading: true,
      isDataLoaded: false,
      pageNumber: 1,
      isVisible: false,
      isShow: true,
      viewId: nanoid(3),
      sectionTitle: "",
      clevertapEventName: "",
      selectedComponent: "",
    };
  },
  computed: {
    item() {
      return this.isLoading === false &&
        this.itemList &&
        this.itemList.length > 0
        ? this.itemList
        : this.dummyItem;
    },
  },
  watch: {
    isVisible: {
      handler(newVal) {
        if (newVal === true && this.isDataLoaded === false) {
          this.getList();
        }
      },
    },
    selectedCityId() {
      this.debounceOnCityChange();
    },
  },
  mounted() {
    this.generateDummyItem();
  },
  created() {
    this.getTopCategoriesView();
    this.debounceOnCityChange = debounce(this.onCityIdChange, 500);
  },
  methods: {
    visibilityChanged(visibility) {
      this.isVisible = visibility;
    },
    async getTopCategoriesView() {
      let moduleRequest;
      try {
        if (this.isMobile && !this.isTablet) {
          moduleRequest = await useLazyImport(() =>
            import(
              /* webpackChunkName: "TopCategoriesViewMobileChunk" */ "./TopCategoriesViewMobile.vue"
            )
          );
          this.selectedComponent = moduleRequest.default;
        } else {
          moduleRequest = await useLazyImport(() =>
            import(
              /* webpackChunkName: "TopCategoriesViewDesktopChunk" */ "./TopCategoriesView.vue"
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
    generateDummyItem() {
      const dummyCount = this.isDesktop ? 7 : 4;
      for (let index = 0; index < dummyCount; index++) {
        this.dummyItem.push({
          id: index,
          title: "",
          totalRestaurants: 0,
          cover: {
            url: "",
          },
        });
      }
    },
    async getList() {
      if (this.isDataLoaded === true || this.allowDoRequest === false) {
        return;
      }
      this.$emit("on-section-start-request", this.viewId);
      this.isLoading = true;
      const result = await getSectionData({ order: this.apiOrder });

      this.$emit("on-section-finish-request", this.viewId);
      if (result.isSuccess) {
        this.isDataLoaded = true;
        this.sectionTitle = result.title;
        this.clevertapEventName = result.clevertapEventName;
        this.itemList = Object.freeze(result.data);
        if (this.itemList && this.itemList.length <= 2) {
          this.isShow = false;
        } else {
          this.isShow = true;
        }
        this.isLoading = false;
        return;
      }
      this.$alert.error(result.message);
    },
    trackClicked({ index, topCategory, link }) {
      const listingIndex = index + 1;
      const url = `${window.location.origin}${link}`;
      this.$track(
        "HOME_SECTION_TAPPED",
        {
          homeSectionID: topCategory.id.toString(),
          homeSectionType: topCategory.type,
          homeSectionName: this.clevertapEventName,
          homeSectionOrder: this.homeSectionOrder,
          homeSectionListingName: topCategory.name,
          homeSectionListingOrder: listingIndex,
          homeSectionURL: url,
        },
        true
      );
    },
    onCityIdChange() {
      this.viewId = nanoid(3);
      this.isDataLoaded = false;
      this.isLoading = true;
      this.itemList = [];
      if (this.isVisible) {
        this.getList();
      }
    },
  },
};
</script>
