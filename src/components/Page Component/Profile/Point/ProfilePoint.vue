<template>
  <div>
    <component :is="component"></component>
  </div>
</template>

<script>
export default {
  data() {
    return {
      component: null,
    };
  },
  created() {
    this.getComponent();
  },
  methods: {
    async getComponent() {
      let moduleRequest;
      try {
        if (this.isMobile) {
          moduleRequest = await this.$useLazyImport(() =>
            import(
              /* webpackChunkName: "ProfileMobileChunk" */ "./ProfilePointMobile.vue"
            )
          );
          this.component = moduleRequest.default;
        } else {
          moduleRequest = await this.$useLazyImport(() =>
            import(
              /* webpackChunkName: "ProfileDesktopChunk" */ "./ProfilePointDesktop.vue"
            )
          );
          this.component = moduleRequest.default;
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
