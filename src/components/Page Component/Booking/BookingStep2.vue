<template>
  <component :is="currentComponent"></component>
</template>

<script>
export default {
  data() {
    return {
      currentComponent: "",
    };
  },
  created() {
    this.loadComponent();
  },
  methods: {
    async loadComponent() {
      let module = null;
      try {
        module = await this.$useLazyImport(() =>
          import(
            /* webpackChunkName: "BookingDatePanel" */ "@/components/Booking/Panel/Date Panel/BookingDatePanel"
          )
        );
        this.currentComponent = module.default;
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
