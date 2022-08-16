<template>
  <div>
    <component
      :is="packageDescriptionComponent"
      v-bind="packageDescriptionProps"
    ></component>
    <PackageMedia :menu-media="packageMedia" />
  </div>
</template>

<script>
import PackageMedia from "@/components/Package/Package Media/PackageMedia.vue";
import {
  initCustomDeliveryTooltip,
  initCollectRedeemTooltip,
} from "@/components/Package/packageTooltip";
import { PACKAGE_CODE_XP, PACKAGE_CODE_PP } from "@/lib/constant";
export default {
  components: {
    PackageMedia,
  },
  props: {
    packages: {
      type: Object,
      required: true,
    },
    isShow: {
      type: Boolean,
      required: true,
    },
    packageMedia: {
      type: Object,
    },
    isRestaurantPromotedOnly: {
      type: Boolean,
      required: true,
    },
    isRestaurantAcceptVoucher: {
      type: Boolean,
      required: true,
    },
    showVersion: {
      type: String,
      required: true,
      validator(value) {
        return ["desktop", "mobile"].indexOf(value) !== -1;
      },
    },
    adult: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      packageDescriptionComponent: "",
    };
  },
  computed: {
    openingHours() {
      return this.packages.openingHours.map((packages) => {
        return {
          day: packages.dayName,
          start: packages.schedule.open || "N/A",
          end: packages.schedule.close || "N/A",
        };
      });
    },
    menuLink() {
      return this.$url(this.packages.menuLink, "link");
    },
    timeLimit() {
      const packageType = this.packages.typeCode;
      const time = this.packages.packageInfo.timeLimit;
      return time &&
        packageType !== PACKAGE_CODE_PP &&
        packageType !== PACKAGE_CODE_XP
        ? time.toString()
        : "";
    },
    tnc() {
      return this.packages.packageInfo.tncLink || "";
    },
    maxPaxPerPack() {
      const packageRules = this.packages.rules;
      if (packageRules && packageRules.length) {
        const perPack = packageRules[0].perPack;
        return perPack ? perPack.toString() : "";
      }
      const packageInfo = this.packages.packageInfo;
      return packageInfo.perPack ? packageInfo.perPack.toString() : "";
    },
    minPax() {
      const packageRules = this.packages.rules;
      if (packageRules && packageRules.length) {
        const minSeat = packageRules[0].minSeat;
        return minSeat ? minSeat.toString() : minSeat;
      }
      const packageInfo = this.packages.packageInfo;
      return packageInfo.minPax ? packageInfo.minPax.toString() : "";
    },
    maxPax() {
      const packageRules = this.packages.rules;
      if (packageRules && packageRules.length) {
        const maxSeat = packageRules[packageRules.length - 1].maxSeat;
        if (maxSeat && maxSeat === "Infinity") {
          return this.$t("noLimit");
        }
        return maxSeat ? maxSeat.toString() : "";
      }
      const packageInfo = this.packages.packageInfo;
      return packageInfo.maxPax ? packageInfo.maxPax.toString() : "";
    },
    showRedeem() {
      return this.isRestaurantAcceptVoucher;
    },
    showCollect() {
      if (this.isRestaurantPromotedOnly) {
        return false;
      }
      return this.packages.earnPoint;
    },
    showCustomDelivery() {
      return this.packages.hasCustomDeliveryFee;
    },
    showPaxRule() {
      return this.packages.typeCode !== PACKAGE_CODE_XP;
    },
    showBookableDate() {
      return this.packages.typeCode !== PACKAGE_CODE_XP;
    },
    kidsPriceV2() {
      return this.packages.kidsPriceV2;
    },
    useKidsPrice() {
      return this.packages.useKidsPrice;
    },
    packageDescriptionProps() {
      return {
        openingHours: this.openingHours,
        timeLimit: this.timeLimit,
        minPax: this.minPax || "",
        maxPax: this.maxPax,
        tnc: this.tnc,
        maxPaxPerPack: this.maxPaxPerPack,
        showCollect: this.showCollect,
        showRedeem: this.showRedeem,
        showCustomDelivery: this.showCustomDelivery,
        showBookableDate: this.showBookableDate,
        showPaxRule: this.showPaxRule,
        pricingList: this.packages.rules,
        pricingType: this.packages.pricingType,
        adult: this.adult,
        kidsPriceV2: this.kidsPriceV2,
        useKidsPrice: this.useKidsPrice,
      };
    },
  },
  async mounted() {
    await this.selectComponent();
    initCustomDeliveryTooltip();
    initCollectRedeemTooltip();
  },
  methods: {
    async selectComponent() {
      let moduleRequest;
      try {
        if (this.isMobile || this.showVersion === "mobile") {
          moduleRequest = await this.$useLazyImport(() =>
            import(
              /* webpackChunkName: "PackageDescriptionMobile" */ "./PackageDescriptionViewMobile.vue"
            )
          );
          this.packageDescriptionComponent = moduleRequest.default;
        } else {
          moduleRequest = await this.$useLazyImport(() =>
            import(
              /* webpackChunkName: "PackageDescriptionDesktop" */ "./PackageDescriptionViewDesktop.vue"
            )
          );
          this.packageDescriptionComponent = moduleRequest.default;
        }
      } catch (err) {
        this.$rollbar.error(err);
        // if chunkg load error happen
        this.$alert.error("Oops, error when loading the page, please refresh");
      }
    },
  },
};
</script>
