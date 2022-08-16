<template>
  <modal
    name="login-modal"
    :width="modalWidth"
    height="auto"
    scrollable
    adaptive
    @opened="modalOpened"
  >
    <div class="wrapper">
      <component :is="loginComponent" v-if="loginComponent"></component>
    </div>
  </modal>
</template>

<script>
export default {
  data() {
    return {
      loginComponent: "",
    };
  },
  computed: {
    modalWidth() {
      if (this.isDesktop || this.isTablet) {
        return "530";
      }
      return "90%";
    },
  },
  methods: {
    modalOpened() {
      if (this.loginComponent === "") {
        this.loadLoginComponent();
      }
    },
    async loadLoginComponent() {
      try {
        const moduleResult = await this.$useLazyImport(() =>
          import(/* webpackChunkName: "LoginChunk" */ "./Login")
        );
        this.loginComponent = moduleResult.default;
      } catch (err) {
        this.$rollbar.error(
          "Oops, something went wrong, failed to open login screen",

          err
        );
        this.$alert.error(
          "Oops, something went wrong, failed to open login screen"
        );
      }
    },
  },
};
</script>
<style scoped>
.wrapper {
  transition: all ease-in 0.5;
}
</style>
