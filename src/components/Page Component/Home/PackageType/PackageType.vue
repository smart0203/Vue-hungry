<template>
  <div
    v-if="isShow"
    v-observe-visibility="{
      callback: visibilityChanged,
      once: true,
      throttle: 300,
    }"
    style="min-height: 200px"
  >
    <component
      :is="selectedComponent"
      :key="viewId"
      :package-type="usedPackageType"
      :is-loading="isLoading"
      :is-visible="isVisible"
      :build-link="buildLink"
      :go-to-link="goToLink"
      :text-label="textLabel"
      @on-package-type-clicked="trackClicked"
    ></component>
  </div>
</template>

<script>
import { getPackageType } from "@/services/common";
import { nanoid } from "nanoid";
import { selectedCityId } from "@/composable/selectCity";
import debounce from "lodash-es/debounce";
export default {
  props: {
    homeSectionOrder: {
      type: Number,
      required: true,
    },
  },
  setup() {
    return {
      selectedCityId,
    };
  },
  data() {
    return {
      dummyPackageType: [],
      isShow: true,
      isLoading: true,
      isVisible: false,
      viewId: nanoid(3),
      selectedComponent: "",
      textLabel: {
        packageTypeSectionTitle: this.$t("packageTypeSectionTitle"),
        packageTypeSectionSubTitle: this.$t("packageTypeSectionSubTitle"),
      },
    };
  },
  computed: {
    usedPackageType() {
      return this.isLoading === false &&
        this.packageTypeList &&
        this.packageTypeList.length > 0
        ? this.packageTypeList
        : this.dummyPackageType;
    },
  },
  watch: {
    selectedCityId() {
      this.debounceOnCityChange();
    },
    isVisible: {
      handler(newVal) {
        if (newVal) {
          this.getList();
        }
      },
    },
  },
  created() {
    this.generatedummyPackageType();
    this.getPackageTypeView();
  },
  mounted() {
    this.debounceOnCityChange = debounce(this.onCityIdChange, 500);
  },
  methods: {
    buildLink(id) {
      return `/restaurants/search?city_id=${this.selectedCityId}&package_type[]=${id}`;
    },
    goToLink(index, packageType) {
      const link = `/restaurants/search?city_id=${this.selectedCityId}&package_type[]=${packageType.packageTypeCode}`;
      this.$emit("on-package-type-clicked", { index, packageType });
      window.location = link;
    },
    async getPackageTypeView() {
      let moduleRequest;
      try {
        if (this.isMobile) {
          moduleRequest = await this.$useLazyImport(() =>
            import(
              /* webpackChunkName: "PackageTypeViewMobileChunk" */ "./PackageTypeViewMobile.vue"
            )
          );
          this.selectedComponent = moduleRequest.default;
        } else {
          moduleRequest = await this.$useLazyImport(() =>
            import(
              /* webpackChunkName: "PackageTypeViewChunk" */ "./PackageTypeView.vue"
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
    generatedummyPackageType() {
      const dummyCount = this.isDesktop ? 4 : 3;
      for (let index = 0; index < dummyCount; index++) {
        this.dummyPackageType.push({
          id: index,
          name: "",
          color: "",
        });
      }
    },
    async getList() {
      this.isLoading = true;
      const result = await getPackageType();
      if (result.isSuccess) {
        const data = result.data;
        if (data && data.length <= 2) {
          this.isShow = false;
          this.$rollbar.debug("Package type now is hidden", {
            packageTypeResult: JSON.stringify(data),
          });
          return;
        }
        this.packageTypeList = data.map((packageTypeList) => {
          const { id, type } = packageTypeList;
          const { coverImg } = packageTypeList.attributes;
          return {
            ...packageTypeList.attributes,
            id,
            type,
            coverImg: coverImg.url,
          };
        });
        this.isLoading = false;
        return;
      }
      this.$alert.error(result.message);
    },
    visibilityChanged(isVisible) {
      this.isVisible = isVisible;
    },
    onCityIdChange() {
      this.viewId = nanoid(3);
      this.isShow = true;
      this.isLoading = true;
      this.packageTypeList = [];
      if (this.isVisible) {
        this.getList();
      }
    },
    trackClicked({ index, packageType }) {
      const listingIndex = index + 1;
      const url = `${window.location.origin}${this.buildLink(packageType)}`;
      this.$track(
        "HOME_SECTION_TAPPED",
        {
          homeSectionID: packageType.id.toString(),
          homeSectionType: packageType.type,
          homeSectionName: "Package Type",
          homeSectionhomeSectionOrder: this.homeSectionOrder,
          homeSectionListingName: packageType.title,
          homeSectionListinghomeSectionOrder: listingIndex,
          homeSectionURL: url,
        },
        true
      );
    },
  },
};
</script>
<i18n>
{
  "en": {
    "packageTypeSectionTitle": "Feast Like Never Before",
    "packageTypeSectionSubTitle": "Learn more about our revolutionary packages"
  },
  "th": {
    "packageTypeSectionTitle": "ดีลร้านอาหารดีๆ แบบไม่เคยมีที่ไหนมาก่อน",
    "packageTypeSectionSubTitle": "เรียนรู้เพิ่มเติมเกี่ยวกับแพ็คเก็จที่ดีที่สุดของเรา"
  }
}
</i18n>
