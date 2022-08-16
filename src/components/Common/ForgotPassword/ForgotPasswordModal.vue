<template>
  <modal
    name="forgot-password-modal"
    :width="modalWidth"
    height="auto"
    @opened="modalOpened"
  >
    <div class="wrapper">
      <component
        :is="forgotPasswordComponent"
        v-if="forgotPasswordComponent"
      ></component>
    </div>
  </modal>
</template>

<script>
export default {
  data() {
    return {
      forgotPasswordComponent: "",
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
      if (this.forgotPasswordComponent === "") {
        this.loadForgotPasswordComponent();
      }
    },
    async loadForgotPasswordComponent() {
      try {
        const moduleResult = await this.$useLazyImport(() =>
          import(
            /* webpackChunkName: "ForgotPasswordChunk" */ "./ForgotPassword"
          )
        );
        this.forgotPasswordComponent = moduleResult.default;
      } catch (err) {
        this.$rollbar.error(
          "Oops, something went wrong, failed to open forgot password screen",
          err
        );
        this.$alert.error(
          "Oops, something went wrong, failed to open forgot password screen"
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
