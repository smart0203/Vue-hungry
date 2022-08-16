<template>
  <div>
    <component :is="paymentPanelComponent" />
  </div>
</template>

<script>
import { isCurrentBookingPending } from "@/composable/pendingBooking";
export default {
  setup() {
    return {
      isCurrentBookingPending,
    };
  },
  data() {
    return {
      paymentPanelComponent: "",
    };
  },
  computed: {
    selectedPackageWatcher() {
      let value = [];
      if (this.isMobile) {
        return value;
      }
      this.$store.getters["bookingPackage/getSelectedPackage"].forEach(
        (pack) => {
          if (pack.menuSections) {
            pack.menuSections.forEach((menuSection) => {
              if (menuSection.menus.length) {
                menuSection.menus.forEach((menu) => {
                  if (menu.quantity !== undefined) {
                    value.push(`${menu.name} ${menu.id} ${menu.quantity}`);
                  }
                });
              }
            });
          } else {
            value.push(`${pack.name} ${pack.id} ${pack.quantity}`);
          }
        }
      );
      return value;
    },
  },
  watch: {
    selectedPackageWatcher: {
      handler() {
        this.$store.dispatch("booking/changeStep", 1);
      },
      deep: true,
    },
  },
  created() {
    this.loadComponent();
  },
  beforeDestroy() {
    // if user leave this page set any isCurrentBookingPending to false
    this.clearCurrentPendingBooking();
  },
  methods: {
    async loadComponent() {
      let module = null;
      try {
        if (this.isDesktop) {
          module = await this.$useLazyImport(() =>
            import(
              /* webpackChunkName: "BookingPaymentPanelDesktop" */ "./BookingPaymentPanelDesktop"
            )
          );
          this.paymentPanelComponent = module.default;
        } else {
          module = await this.$useLazyImport(() =>
            import(
              /* webpackChunkName: "BookingPaymentPanelMobile" */ "./BookingPaymentPanelMobile"
            )
          );
          this.paymentPanelComponent = module.default;
        }
      } catch (err) {
        this.$rollbar.error(err);
        this.$alert.error(
          "Failed to get required component, please check your connection"
        );
      }
    },
    clearCurrentPendingBooking() {
      this.isCurrentBookingPending = false;
    },
  },
};
</script>
