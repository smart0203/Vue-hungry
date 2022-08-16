<template>
  <div>
    <!-- term & condition -->
    <div
      v-if="showCollect || showRedeem || showCustomDelivery || tnc"
      class="flex mt-2 mb-4 ml-2"
    >
      <div class="lg:w-4/12 lg:pr-8">
        <div class="flex mb-3 text-sm font-bold lg:text-xs text-red-dark">
          <div
            v-if="showCollect"
            class="flex flex-row items-center collect-icon"
          >
            <img
              src="@/assets/icon-collect-red.png"
              width="18"
              height="18"
              loading="lazy"
              alt="icon collect"
              class="mr-2"
            />
            <span class="mr-4 capitalize">{{ $t("collect") }}</span>
          </div>
          <div
            v-if="showRedeem"
            class="flex flex-row items-center cursor-pointer redeem-icon"
          >
            <img
              src="@/assets/icon-redeem-red.png"
              class="mr-2"
              loading="lazy"
              width="18"
              height="18"
              alt=""
            />
            <span class="mr-4 capitalize">{{ $t("redeem") }}</span>
          </div>
          <div
            v-if="showCustomDelivery"
            class="flex flex-row items-center cursor-pointer custom-delivery-icon"
          >
            <img
              src="@/assets/icon-delivery-bike-red.png"
              class="mr-2"
              width="18"
              height="18"
              loading="lazy"
              alt=""
            />
            <span class="capitalize">{{ $t("delivery") }}</span>
          </div>
        </div>
      </div>
      <div class="mb-3 text-center">
        <a
          v-if="tnc && isDesktop"
          target="_blank"
          :href="tnc"
          class="px-3 py-2 text-sm capitalize border rounded-full lg:py-1 border-red-dark text-red-dark lg:text-xs"
        >
          {{ $t("termAndCondition") }}
        </a>
      </div>
    </div>
    <!-- show package name here if it is ala carte -->
    <div
      v-if="packages.isAlaCarte"
      class="text-xl font-black text-center lg:mb-8 text-red-dark lg:text-2xl"
    >
      {{ packages.name }}
    </div>
    <PackageSection
      v-if="packages.isUsingMenuSection()"
      v-bind="packageSectionProps"
    />
    <PackageMedia v-else :menu-media="packageMedia"></PackageMedia>
  </div>
</template>

<script>
import isEmpty from "lodash-es/isEmpty";
import {
  initCustomDeliveryTooltip,
  initCollectRedeemTooltip,
} from "@/components/Package/packageTooltip";
import { initializeSelectMenuFlow } from "@/components/Package/Package-Select-Menu/packageSelectMenu";
import { isOpen as toggleRestaurantSideMenu } from "@/components/Page Component/Restaurant/Restaurant-Side-Menu/restaurantSideMenu";
import { isOpen as toggleBottomSheet } from "@/components/Common/BottomSheet/bottomSheet";
import { isValid as isValidCorporateEvent } from "@/composable/corporateEvent";
import useLazyImport from "@/composable/useLazyImport";

export default {
  name: "PackageMenu",
  components: {
    PackageSection: () =>
      useLazyImport(() => import("@/components/Package/PackageSection.vue")),
    PackageMedia: () =>
      useLazyImport(() =>
        import("@/components/Package/Package Media/PackageMedia")
      ),
  },
  props: {
    packages: {
      type: Object,
      default() {
        return {};
      },
    },
    isSelectedPackage: {
      type: Boolean,
      default: false,
    },
    tnc: {
      type: String,
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
  },
  setup() {
    return {
      toggleRestaurantSideMenu,
      toggleBottomSheet,
    };
  },
  data() {
    return {
      allCustomLabels: [],
    };
  },
  computed: {
    showCollect() {
      return this.packages.earnPoint && this.packages.isAlaCarte === false;
    },
    showRedeem() {
      if (this.isRestaurantPromotedOnly) {
        return false;
      }
      return (
        this.isRestaurantAcceptVoucher && this.packages.isAlaCarte === false
      );
    },
    showCustomDelivery() {
      return this.packages.hasCustomDeliveryFee;
    },
    packageSectionProps() {
      return {
        isAlaCarte: this.packages.isAlaCarte,
        quantity: this.packages.quantity || 1,
        allCustomLabels: this.allCustomLabels,
        menuSections: this.packages.getSections(),
        isSelectedPackage: this.isSelectedPackage,
        isShowMenuPrice:
          this.packages.hideMenuPrice == false &&
          isValidCorporateEvent.value === false,
        menuClickCallback: this.onMenuClicked,
        textLabel: {
          selectPortionsLabel: this.selectPortionsLabel,
          priceFormatter: this.$money,
          notAvailable: this.$t("notAvailable"),
        },
      };
    },
  },
  mounted() {
    this.buildMenuSection();
    initCustomDeliveryTooltip();
    initCollectRedeemTooltip();
  },
  methods: {
    buildMenuSection() {
      const sections = this.packages.getSections();
      sections.forEach((section) => {
        const isHaveMenu = section.isHaveMenu();
        if (isHaveMenu) {
          const menus = section.getMenu();
          menus.forEach((menu) => {
            if (menu.isHaveCustomLabel()) {
              this.addCustomLabel(menu.getCustomLabel());
            }
          });
        }
      });
    },
    selectPortionsLabel(sectionQuantityLimit, quantity) {
      return this.$tc("selectPortions", sectionQuantityLimit * quantity, {
        count: sectionQuantityLimit * quantity,
      });
    },
    addCustomLabel(customLabel) {
      const find = this.allCustomLabels.filter(
        (label) => label.name === customLabel.name
      );
      if (find.length === 0) {
        this.allCustomLabels.push(customLabel);
      }
    },
    onMenuClicked(menu = {}, section = {}) {
      if (isEmpty(menu) || isEmpty(section)) {
        this.$rollbar.error(
          "Oops, someting went wrong, failed call on menu click function",
          { packages: this.packages }
        );
        this.$alert.error(
          "Oops, something went wrong, failed open menu section"
        );
        return;
      }

      initializeSelectMenuFlow({
        packages: this.packages,
        packageQuantity: this.packages.quantity,
        isAlaCarte: this.packages.isAlaCarte,
        menu: menu,
        sectionId: section.id,
        sectionName: section.name,
      });

      this.$nextTick(() => {
        if (this.isDesktop) {
          this.toggleRestaurantSideMenu = true;
          return;
        }
        this.toggleBottomSheet = true;
      });
    },
  },
};
</script>
