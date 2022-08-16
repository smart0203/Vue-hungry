<template>
  <div class="flex flex-col flex-grow">
    <div v-if="isLoading" class="flex items-center justify-center">
      <div class="mr-2 loader small"></div>
      <span class="capitalize">{{ $t("pleaseWait") }}</span>
    </div>
    <template v-else-if="isFlowSelectDateFirst">
      <component
        :is="step1.component"
        v-bind="step1.props"
        v-on="step1.eventHandler"
      ></component>
    </template>
    <template v-else>
      <transition-group name="fade" tag="div" class="flex flex-col flex-grow">
        <component
          :is="step1.component"
          v-if="currentStep === 1"
          key="step-1"
          v-on="step1.eventHandler"
        ></component>
        <component
          :is="step2.component"
          v-else-if="currentStep === 2"
          key="step-2"
          v-bind="step2.props"
          v-on="step2.eventHandler"
        ></component>
      </transition-group>
    </template>
  </div>
</template>

<script>
import { splitPackagesByType } from "@/helper/PackageHelper";
import { historyPushState, historyRemoveState } from "@/helper/urlHelper";
import { mapGetters, mapState } from "vuex";
import {
  PACKAGE_CODE_AYCE,
  PACKAGE_CODE_PP,
  PACKAGE_CODE_BFP,
  PACKAGE_CODE_SM,
  PACKAGE_CODE_HS,
  PACKAGE_CODE_XP,
  PACKAGE_CODE_HAH,
} from "@/lib/constant";
const dineInPackages = [
  PACKAGE_CODE_AYCE,
  PACKAGE_CODE_PP,
  PACKAGE_CODE_BFP,
  PACKAGE_CODE_SM,
  PACKAGE_CODE_HS,
  PACKAGE_CODE_XP,
];

export default {
  data() {
    return {
      isLoading: true,
      currentStep: 1,
      step1: {
        component: "",
        props: {},
        eventHandler: {},
        showNextStep: false,
      },
      step2: {
        component: "",
        props: {},
        eventHandler: {},
        showNextStep: false,
      },
    };
  },
  computed: {
    ...mapState("webConfig", ["config"]),
    ...mapState("booking", ["adult"]),
    ...mapGetters("booking", ["isDineIn", "isFlowSelectDateFirst"]),
    ...mapGetters("bookingPackage", [
      "getPackageByType",
      "isPackageHaveEnoughtQuantity",
    ]),
    ...mapGetters("inventorySummary", [
      "getInventorySummaries",
      "getSortPackages",
    ]),
  },
  watch: {
    isDineIn: {
      handler() {
        this.initialize();
      },
      immediate: true,
    },
  },
  methods: {
    numberPanelConfirmHandler() {
      if (this.isFlowSelectDateFirst) {
        this.$store.dispatch("booking/changeStep", 2);
      } else {
        this.currentStep = 2;
      }
    },

    async initialize() {
      let packagePanelModule = null;
      let numberPanelModule = null;
      try {
        if (this.isDineIn) {
          this.isLoading = true;
          numberPanelModule = await this.$useLazyImport(() =>
            import(
              /* webpackChunkName: "BookingNumberPanel" */ "@/components/Booking/Panel/Number Panel/BookingNumberPanel"
            )
          );
          
          this.step1.component = numberPanelModule.default;
          this.step1.eventHandler = {
            "on-confirm-clicked": () => {
              this.numberPanelConfirmHandler();
            },
            "on-back-clicked": () => {
              this.$store.commit("booking/setState", {
                state: "packagePreference",
                val: "",
              });
              this.$store.dispatch("bookingPackage/removeAllSelectedPackage");
              this.$store.commit("booking/setState", {
                state: "adult",
                val: 0,
              });
              this.$store.commit("booking/setState", {
                state: "kids",
                val: 0,
              });
              if (this.isMobile) {
                this.$router.push({
                  name: "RestaurantPage",
                });
              }
            },
            "on-mounted": () => {
              window.onpopstate = () => {
                this.$router.push({
                  name: "RestaurantPage",
                });
                this.$store.commit("booking/setState", {
                  state: "packagePreference",
                  val: "",
                });
              };
            },
            "on-before-destroy": () => {
              window.onpopstate = () => {};
            },
          };
          if (this.isFlowSelectDateFirst === false) {
            packagePanelModule = await this.$useLazyImport(() =>
              import(
                /* webpackChunkName: "BookingSelectPackagePanel" */ "@/components/Booking/Panel/Package Panel/BookingPackagePanel"
              )
            );
            this.step2.component = packagePanelModule.default;
            let packageByTypes = this.getPackageByType(dineInPackages);

            this.$store.dispatch(
              "inventorySummary/comparePackagesWithInvSummaries",
              {
                packages: packageByTypes,
                limitedSeats: this.config.limitedSeatsShowing,
              }
            );
            if (this.getSortPackages.length) {
              packageByTypes = this.getSortPackages;
            }

            this.step2.props = {
              nextStep: 2,
              availablePackages: splitPackagesByType(packageByTypes),
              showSummary: false,
              showBackIcon: true,
            };

            this.step2.eventHandler = {
              "on-confirm-clicked": () => {},
              "on-back-clicked": () => {
                this.$store.dispatch("bookingPackage/removeAllSelectedPackage");
                this.currentStep = 1;
                historyRemoveState("showNextStep");
              },
              "on-mounted": () => {
                historyPushState("showNextStep", "true");
                window.onpopstate = () => {
                  this.currentStep = 1;
                  historyRemoveState("showNextStep");
                };
              },
              "on-before-destroy": () => {
                window.onpopstate = () => {};
              },
            };
          }
          this.isLoading = false;
        } else {
          this.isLoading = true;
          packagePanelModule = await this.$useLazyImport(() =>
            import(
              /* webpackChunkName: "BookingSelectPackagePanel" */ "@/components/Booking/Panel/Package Panel/BookingPackagePanel"
            )
          );
          
          this.step1.props = {
            nextStep: 2,
            availablePackages: splitPackagesByType(
              this.getPackageByType([PACKAGE_CODE_HAH])
            ),
          };

          this.step1.eventHandler = {
            "on-back-clicked": () => {
              this.$store.commit("booking/setState", {
                state: "packagePreference",
                val: "",
              });
              this.$store.dispatch("bookingPackage/removeAllSelectedPackage");
              this.$store.commit("booking/setState", {
                state: "adult",
                val: 0,
              });
              this.$store.commit("booking/setState", {
                state: "kids",
                val: 0,
              });
              if (this.isMobile) {
                this.$router.push({
                  name: "RestaurantPage",
                });
              }
            },
          };
          this.step1.component = packagePanelModule.default;
          this.isLoading = false;
        }
      } catch (err) {
        this.$rollbar.error(err);
        this.$alert.error(
          "Failed to get required component, please check your connection"
        );
      }
    },
  },
};
</script>
