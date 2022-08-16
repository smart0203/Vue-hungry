<template>
  <component :is="step.component" v-on="step.eventHandler"></component>
</template>

<script>
export default {
  data() {
    return {
      step: {
        component: "",
        props: {},
        eventHandler: {},
      },
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
            /* webpackChunkName: "BookingTimePanel" */ "@/components/Booking/Panel/Time Panel/BookingTimePanel"
          )
        );
        this.step.eventHandler = {
          "on-time-selected": () => {
            let nextStep;
            if (
              this.$store.getters["booking/isFlowSelectDateFirst"] === false ||
              this.$store.getters["booking/isDineIn"] === false
            ) {
              nextStep = 5;
            } else {
              nextStep = 4;
            }
            this.$store.dispatch("booking/changeStep", nextStep);
          },
          "on-back-clicked": () => {
            this.$store.dispatch("booking/changeStep", 2);
          },
        };
        this.step.component = module.default;
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
