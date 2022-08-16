<template>
  <component
    :is="packagePanelComponent"
    v-bind="$props"
    @on-confirm-clicked="onConfirmClicked"
    @on-back-clicked="onBackClicked"
  ></component>
</template>

<script>
import PanelMixin from "../PanelMixin";
import props from "./PackagePanelProp";
export default {
  mixins: [PanelMixin],
  props,
  data() {
    return {
      packagePanelComponent: "",
    };
  },
  created() {
    this.getComponent();
  },
  mounted() {
    this.onMounted();
  },
  beforeDestroy() {
    this.onBeforeDestroy();
  },
  methods: {
    async getComponent() {
      try {
        let moduleResult;
        if (this.isDesktop) {
          moduleResult = await this.$useLazyImport(() =>
            import(
              /* webpackChunkName: "PackagePanelComponentDesktopChunk" */ "./BookingPackagePanelDesktop"
            )
          );
        } else {
          moduleResult = await this.$useLazyImport(() =>
            import(
              /* webpackChunkName: "PackagePanelComponentMobileChunk" */ "./BookingPackagePanelMobile"
            )
          );
        }
        this.packagePanelComponent = moduleResult.default;
      } catch (err) {
        this.$rollbar.error(err);
        this.$alert.error(
          "Oops, something went wrong, failed to get required component"
        );
      }
    },
    async onConfirmClicked() {
      const canSkipSelectTime =
        this.$store.getters["booking/canSkipSelectTime"];
      const selectedPackage =
        this.$store.getters["bookingPackage/getSelectedPackage"][0];
      if (canSkipSelectTime) {
        this.$store.commit("booking/setState", {
          state: "selectedTime",
          val: selectedPackage.defaultStartTime,
        });
      }
      this.mobileScrollToTop();
      this.$emit("on-confirm-clicked");
    },
    onBackClicked() {
      this.$emit("on-back-clicked");
    },
    onMounted() {
      this.$emit("on-mounted");
    },
    onBeforeDestroy() {
      this.$emit("on-before-destroy");
    },
  },
};
</script>
