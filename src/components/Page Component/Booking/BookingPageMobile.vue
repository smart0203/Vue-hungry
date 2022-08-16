<template>
  <div>
    <Booking v-if="!isLoading" />
    <div v-else class="flex items-center justify-center h-screen">
      <span class="mr-4 text-lg font-black capitalize">{{
        $t("pleaseWait")
      }}</span>
      <div class="loader"></div>
    </div>
    <component :is="addPackageMenuComponent"></component>
  </div>
</template>

<script>
import useLazyImport from "@/composable/useLazyImport";

export default {
  components: {
    Booking: () =>
      useLazyImport(() => import("@/components/Booking/Booking.vue")),
  },
  data() {
    return {
      isLoading: false,
      addPackageMenuComponent: "",
    };
  },
  computed: {
    lang() {
      return this.$store.state.lang;
    },
    route() {
      return this.$route;
    },
    anyDeliveryPackage() {
      return this.$store.getters["bookingPackage/anyDeliveryPackage"];
    },
  },
  watch: {
    lang(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getRestaurantData();
      }
    },
  },
  mounted() {
    this.loadAddPackageMenuComponent();
  },
  beforeDestroy() {
    this.resetPackagePreference();
  },
  methods: {
    async getRestaurantData() {
      this.isLoading = true;
      const restaurantName = this.route.params.restaurantName.replace(
        /\s/g,
        "-"
      );
      const result = await this.$store.dispatch(
        "restaurant/getRestaurantData",
        restaurantName
      );

      if (result.isSuccess === false && result.message) {
        this.$alert.error(result.message);
        return;
      }
      this.isLoading = false;
    },
    async loadAddPackageMenuComponent() {
      if (!this.anyDeliveryPackage) {
        return;
      }
      try {
        const { component, isSuccess, errorMessage } =
          await this.$loadComponentAsync("Package/Package-Select-Menu", {
            enableVariant: true,
            isDesktop: this.isDesktop,
          });
        if (!isSuccess.value) {
          this.$rollbar.error(errorMessage.value);
          return;
        }
        this.addPackageMenuComponent = component.value;
      } catch (err) {
        this.$rollbar.error("Failed load add package menu component", err);
      }
    },
    resetPackagePreference() {
      this.$store.commit("booking/setState", {
        state: "packagePreference",
        val: "",
      });
    },
  },
};
</script>
