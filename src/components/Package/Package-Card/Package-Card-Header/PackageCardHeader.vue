<template>
  <component
    :is="packageCardHeaderComponent"
    v-bind="$props"
    ref="custom-custom-labels"
    :click-handler="clickHandler"
    :text-label="textLabel"
  >
    <template #addon-label>
      <div
        ref="addon-popup"
        class="flex items-center cursor-pointer text-red-dark"
      >
        <img
          src="@/assets/icon-addon-red.png"
          loading="lazy"
          style="width: 20px"
          alt=""
        />
        <span class="ml-2 text-xs lg:whitespace-nowrap">{{
          textLabel.addonSet
        }}</span>
      </div>
    </template>
    <template #custom-labels>
      <span class="ml-1">
        <span
          v-for="(customLabel, key) in customLabels"
          :key="`${name}-custom-label-${key}`"
          class="flex-shrink-0"
        >
          <HhImage
            ref="custom-labels"
            :img="customLabel.iconUrl"
            class="inline package-custom-label"
            :data-text="customLabel.name"
            alt="custom label"
            :mobile-width="50"
            :desktop-width="50"
          ></HhImage>
        </span>
      </span>
    </template>
    <template #pricing-list>
      <PackagePricingList
        v-if="isMobile"
        :pricing-type="pricingType"
        :pricing-list="pricingList"
        :adult="adult"
        :original-price="originalPrice"
        :show-version="'desktop'"
        :simple-mode="!adult && !isDesktop ? true : false"
        :allow-show-price="allowShowPrice"
        :disabled-booking="textLabel.parsedBookButtonText.disabled"
      />
      <PackagePricingList
        v-if="!isMobile"
        :pricing-type="pricingType"
        :pricing-list="pricingList"
        :adult="adult"
        :original-price="originalPrice"
        :show-version="'desktop'"
        :simple-mode="!isPackageBodyShow && !adult"
        :allow-show-price="allowShowPrice"
        :disabled-booking="textLabel.parsedBookButtonText.disabled"
      />
    </template>
  </component>
</template>

<script>
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import kebabCase from "lodash-es/kebabCase";
import isEmpty from "lodash-es/isEmpty";
import { mapGetters, mapState } from "vuex";
import {
  showTooltip,
  initAddonToolip,
} from "@/components/Package/packageTooltip";
import useLazyImport from "@/composable/useLazyImport";
import props from "./PackageCardHeaderProps";
import { packageBookButton } from "@/helper/PackageHelper";
export default {
  name: "PackageCardHeader",
  components: {
    PackagePricingList: () =>
      useLazyImport(() =>
        import("@/components/Package/PackagePricingList.vue")
      ),
  },
  props,
  data() {
    return {
      addonPopUpRef: "",
      isAddonPopupEverShowed: false,
      customLabelsTooltip: [],
      packageCardHeaderComponent: "",
      isHahPackage: this.typeCode == "hah" ? true : false,
      isMultiplePrice: this.pricingList.length > 1,
      clickHandler: {
        viewMenuHandler: this.viewMenuHandler,
        packageSelectedHandler: this.packageSelectedHandler,
        packageDecreasedHandler: this.packageDecreasedHandler,
        packageIncreasedHandler: this.packageIncreasedHandler,
      },
      textLabel: {
        preBook: this.$t("preBooking", { date: this.date }),
        validUntil: `${this.$t("validUntil")} ${this.isMobile ? "<br>" : ""} ${
          this.date
        }`,
        addonSet: this.$t("addonSet"),
        viewMenu: this.$t("viewMenu"),
        perPackRule:
          this.isAcceptManyQuantity === true && this.packagePerPackRule > 1
            ? `1-${this.packagePerPackRule}`
            : this.packagePerPackRule,
        people: this.$tc("people", this.packagePerPackRule),
        course: this.$tc("course", this.packageCourseRule),
        termAndCondition: this.$t("termAndCondition"),
        selected: this.$t("selected"),
        parsedBookButtonText: "",
        parsedName: kebabCase(this.name),
        acceptsVoucher: this.$t("acceptsVoucher"),
      },
    };
  },
  computed: {
    ...mapState("webConfig", ["config"]),
    ...mapGetters("inventorySummary", ["getInventorySummaries"]),
  },
  created() {
    this.setData();
    this.getPackageHeaderComponent();
    this.watchAddonPopup();
  },
  updated() {
    this.$nextTick(() => {
      this.initAddonPopup();
      this.initCustomLabelPopup();
    });
  },
  methods: {
    setData() {
      // set book button text
      if (this.bookButtonText) {
        this.textLabel.parsedBookButtonText = this.bookButtonText;
      } else {
        this.textLabel.parsedBookButtonText = packageBookButton({
          inventorySummaries: this.getInventorySummaries,
          packageId: parseInt(this.$props.id),
          packageType: this.typeCode,
          limitedSeatsShowing: this.config.limitedSeatsShowing,
        });
      }
    },
    viewMenuHandler() {
      this.$emit("on-view-menu-clicked");
    },
    packageSelectedHandler() {
      this.$emit("on-package-selected");
    },
    packageDecreasedHandler() {
      this.$emit("on-package-decreased");
    },
    packageIncreasedHandler() {
      this.$emit("on-package-increased");
    },
    async getPackageHeaderComponent() {
      let moduleRequest;
      try {
        if (this.isMobile || this.showVersion === "mobile") {
          moduleRequest = await this.$useLazyImport(() =>
            import(
              /* webpackChunkName: "PackageHeaderMobileChunk" */ "./PackageCardHeaderMobile.vue"
            )
          );
          this.packageCardHeaderComponent = moduleRequest.default;
        } else {
          moduleRequest = await this.$useLazyImport(() =>
            import(
              /* webpackChunkName: "PackageHeaderDesktopChunk" */ "./PackageCardHeaderDesktop.vue"
            )
          );
          this.packageCardHeaderComponent = moduleRequest.default;
        }
      } catch (err) {
        this.$rollbar.error(err);
        // if chunkg load error happen
        this.$alert.error("Oops, error when loading the page, please refresh");
      }
    },
    async initAddonPopup() {
      if (!isEmpty(this.addonPopUpRef) || !this.isAddon) {
        return;
      }
      const trigger = this.$refs["addon-popup"];
      this.addonPopUpRef = await initAddonToolip(trigger);
    },
    showAddonPopup() {
      if (
        !isEmpty(this.addonPopUpRef) &&
        !this.isAddonPopupEverShowed &&
        this.isAddon
      ) {
        this.addonPopUpRef.show();
        this.isAddonPopupEverShowed = true;
      }
    },
    watchAddonPopup() {
      if (this.isAddon) {
        this.$watch("isPackageBodyShow", (newVal) => {
          if (newVal) {
            this.showAddonPopup();
          }
        });
      }
    },
    initCustomLabelPopup() {
      const customLabels = this.$refs["custom-labels"];
      if (customLabels) {
        if (this.customLabelsTooltip.length === customLabels.length) {
          return;
        }
        customLabels.forEach((label) => {
          const { $el, $attrs } = label;
          const tooltip = showTooltip($el, $attrs["data-text"]);
          this.customLabelsTooltip.push(tooltip);
        });
      }
    },
  },
};
</script>
<i18n>
{
  "en": {
    "addonSet": "Add On Set",
    "viewMenu": "View Menu"
  },
  "th": {
    "addonSet": "แพ็กเสริม",
    "viewMenu": "ดูเมนู"
  }
}
</i18n>
<style lang="scss">
.package-header {
  .package-custom-label {
    width: 25px;
  }

  .package-header-shadow {
    box-shadow: 0 7px 8px 2px #eee;
  }
}
</style>
