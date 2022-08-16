<template>
  <div ref="package" class="package-card">
    <PackageHeader
      v-if="!packages.isAlaCarte"
      v-bind="packageHeaderProps"
      @on-view-menu-clicked="
        () => {
          togglePackageBody();
          scrollFocusToPackage();
        }
      "
      @on-package-selected="selectPackage"
      @on-package-increased="$emit('on-package-increased')"
      @on-package-decreased="$emit('on-package-decreased')"
    />
    <!-- package card body -->
    <PackageBody
      v-if="packages.isAlaCarte ? true : isPackageBodyShow"
      :is-ala-carte="packages.isAlaCarte"
      :type-code="packages.typeCode"
      @on-close-menu-clicked="
        () => {
          togglePackageBody(false);
          scrollFocusToPackage();
        }
      "
    >
      <!-- loading get component -->
      <div
        v-if="packageBodyInnerComponent.isLoading"
        class="flex justify-center w-full my-4 lg:my-6"
      >
        <span class="mr-2 text-sm">{{ $t("loading") }}</span>
        <div class="loader small"></div>
      </div>
      <!-- loading finished -->
      <div v-else class="w-full">
        <!-- get component successfully -->
        <component
          :is="packageBodyInnerComponent.component"
          v-if="packageBodyInnerComponent.component"
          v-bind="packageSubComponentProps"
        ></component>
        <!-- required component failed to donwload -->
        <div
          v-else
          class="flex items-center justify-center w-full my-4 lg:my-6"
        >
          <span class="mr-2 text-sm">Failed loading package menu</span>
          <button
            class="mx-2 my-1 text-sm try-load-package-body-inner-comp-button"
            @click="loadPackageBodyInnerComponent"
          >
            Try again
          </button>
        </div>
      </div>
    </PackageBody>
  </div>
</template>

<script>
import PackageHeader from "./Package-Card-Header/PackageCardHeader.vue";
import PackageBody from "./PackageCardBody.vue";
import { initTooltip } from "@/components/Package/packageTooltip";
import useLazyImport from "@/composable/useLazyImport";
export default {
  components: {
    PackageBody,
    PackageHeader,
  },
  props: {
    packages: {
      type: Object,
      required: true,
    },
    showVersion: {
      type: String,
      required: true,
      validator(value) {
        return ["desktop", "mobile"].indexOf(value) !== -1;
      },
    },
    isSelectedPackage: {
      type: Boolean,
      required: true,
    },
    showViewMenuButton: {
      type: Boolean,
      required: true,
    },
    packageQuantity: {
      type: Number,
    },
    showPackageBody: {
      type: Boolean,
      default: false,
    },
    autoShowPackageBody: {
      type: Boolean,
      default: true,
    },
    isButtonShow: {
      type: Boolean,
      default: true,
    },
    isAcceptManyQuantity: {
      type: Boolean,
      required: true,
    },
    isAcceptVoucher: {
      type: Boolean,
      default: false,
    },
    bookButtonText: {
      type: Object,
      default: null,
    },
    adult: {
      type: Number,
      default: 0,
    },
    price: {
      type: String,
      required: true,
    },
    freeDeliveryRadius: {
      type: Number,
      default: 0,
    },
    allowShowPrice: {
      type: Boolean,
      default: true,
    },
    preferShowVoucherIcon: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isRestaurantPromotedOnly: "",
      isRestaurantAcceptVoucher: "",
      packageCardHeaderComponent: "",
      isPackageBodyShow: false,
      packageBodyInnerComponent: {
        isLoading: true,
        isSuccess: null,
        component: null,
      },
      // packageType:
      packageType: "",
      packagePerPackRule: "",
      packageCourseRule: "",
      isPrebook: false,
    };
  },
  computed: {
    packageHeaderProps() {
      const parseDate = () => {
        if (this.isPrebook) {
          const startDate = this.$dayjs(this.packages.startDate, "YYYY-MM-DD");
          return startDate.isValid()
            ? startDate.format("DD MMM")
            : this.packages.startDate;
        }
        const validUntilDate = this.$dayjs(this.packages.endDate, "YYYY-MM-DD");
        return validUntilDate.isValid()
          ? validUntilDate.format("DD MMM YYYY")
          : this.packages.endDate;
      };

      return {
        id: this.packages.id,
        tnc: this.packages.packageInfo.tncLink || "",
        price: this.price,
        pricingType: this.packages.pricingType,
        pricingList: this.packages.rules,
        originalPrice: this.packages.originalPrice,
        customPrice: this.packages.customNetPrice,
        packagePerPackRule: this.packagePerPackRule,
        packageCourseRule: this.packageCourseRule,
        customLabels: this.packages.customLabels,
        acceptWeTravelTogether: this.packages.acceptWeTravelTogether,
        isAddon: this.packages.isAddOn,
        typeCode: this.packages.typeCode,
        name: this.packages.name,
        description: this.cleanPackageDescription(this.packages.description),
        date: parseDate(),
        isPrebook: this.isPrebook,
        isSelectedPackage: this.isSelectedPackage,
        showViewMenuButton: this.showViewMenuButton,
        packageQuantity: this.packageQuantity,
        viewMenu: this.isPackageBodyShow,
        isAcceptManyQuantity: this.isAcceptManyQuantity,
        isAcceptVoucher: this.isAcceptVoucher,
        isButtonShow: this.isButtonShow,
        isPackageBodyShow: this.isPackageBodyShow,
        bookButtonText: this.bookButtonText,
        adult: this.adult,
        showVersion: this.showVersion,
        freeDeliveryRadius: this.freeDeliveryRadius,
        allowShowPrice: this.allowShowPrice,
        preferShowVoucherIcon: this.preferShowVoucherIcon,
      };
    },
    packageSubComponentProps() {
      let props = {};
      if (this.packageType === "hah") {
        props = {
          isRestaurantPromotedOnly: this.isRestaurantPromotedOnly,
          isRestaurantAcceptVoucher: this.isRestaurantAcceptVoucher,
          tnc: this.packages.packageInfo.tncLink || "",
          packages: this.packages,
          isSelectedPackage: this.isSelectedPackage,
          isShow: this.packages.isAlaCarte ? true : this.isPackageBodyShow,
        };
      } else {
        props = {
          isRestaurantAcceptVoucher: this.isRestaurantAcceptVoucher,
          isRestaurantPromotedOnly: this.isRestaurantPromotedOnly,
          showVersion: this.showVersion,
          packages: this.packages,
          isShow: this.isPackageBodyShow,
          adult: this.adult,
        };
      }
      props.packageMedia = this.packages.menus;

      return props;
    },
  },
  created() {
    this.setData();
    this.checkAutoShowPackageBody();
  },
  mounted() {
    initTooltip();
  },
  methods: {
    setData() {
      this.isRestaurantAcceptVoucher =
        this.$store.getters["restaurant/isRestaurantAcceptVoucher"];
      this.isRestaurantPromotedOnly =
        this.$store.getters["restaurant/isRestaurantPromotedOnly"];
      this.packageType = this.packages.typeCode;
      this.packagePerPackRule = this.packages.rules[0].perPack || null;
      this.packageCourseRule = this.packages.noOfCourses || null;
      this.isPrebook = this.packages.isPrebook;
    },

    selectPackage() {
      this.$emit("on-package-selected");
    },
    async togglePackageBody(isShow) {
      this.isPackageBodyShow =
        isShow === undefined ? !this.isPackageBodyShow : isShow;
      // get inner component
      if (this.packageBodyInnerComponent.component === null) {
        await this.loadPackageBodyInnerComponent();
        if (this.packageBodyInnerComponent.isSuccess === false) {
          return;
        }
      }
      this.$emit("on-package-body-toggled", this.isPackageBodyShow);
    },
    scrollFocusToPackage() {
      // scroll user screen back to package header
      const packageContainer = this.$refs.package;
      if (packageContainer) {
        const navbarHeight = 45;
        const offset = 20;
        const elementPosition = packageContainer.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - navbarHeight - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    },
    async loadPackageBodyInnerComponent() {
      if (!this.packageBodyInnerComponent.component) {
        this.packageBodyInnerComponent.isLoading = true;
        if (this.packageType !== "hah") {
          try {
            const moduleResult = await useLazyImport(() =>
              import(
                /* webpackChunkName: "PackageDescriptionChhunk" */ "../Package Description/PackageDescription"
              )
            );
            this.packageBodyInnerComponent.component = moduleResult.default;
            this.packageBodyInnerComponent.isSuccess = true;
          } catch (err) {
            this.packageBodyInnerComponent.isSuccess = false;
            this.$rollbar.error(
              "failed getting package description component",
              err
            );
          } finally {
            this.packageBodyInnerComponent.isLoading = false;
          }
        } else {
          try {
            const moduleResult = await useLazyImport(() =>
              import(
                /* webpackChunkName: "PackageMenuChhunk" */ "../Package Menu/PackageMenu"
              )
            );
            this.packageBodyInnerComponent.component = moduleResult.default;
            this.packageBodyInnerComponent.isSuccess = true;
          } catch (err) {
            this.packageBodyInnerComponent.isSuccess = false;
            this.$rollbar.error("failed getting package menu component", err);
          } finally {
            this.packageBodyInnerComponent.isLoading = false;
          }
        }
      }
    },
    cleanPackageDescription(description) {
      const div = document.createElement("div");
      div.innerHTML = description;
      return div.textContent || div.innerText || "";
    },
    checkAutoShowPackageBody() {
      if (this.autoShowPackageBody) {
        this.$watch(
          "showPackageBody",
          (newVal) => {
            this.togglePackageBody(newVal);
            if (this.isSelectedPackage && newVal === true) {
              this.scrollFocusToPackage();
            }
          },
          { immediate: true }
        );
      }
    },
  },
};
</script>
