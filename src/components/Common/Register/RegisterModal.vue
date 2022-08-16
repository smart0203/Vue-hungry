<template>
  <modal
    name="register-modal"
    :width="modalWidth"
    height="auto"
    scrollable
    adaptive
    @opened="modalOpened"
    @beforeClose="clearGuestBookingIds"
  >
    <div class="wrapper">
      <component :is="registerComponent" v-if="registerComponent"></component>
    </div>
  </modal>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  data() {
    return {
      registerComponent: "",
    };
  },
  computed: {
    ...mapFields("user", ["guestBookingIds"]),
    modalWidth() {
      if (this.isDesktop || this.isTablet) {
        return "530";
      }
      return "90%";
    },
  },
  methods: {
    async modalOpened() {
      if (this.registerComponent === "") {
        await this.loadRegisterComponent();
      }
    },
    clearGuestBookingIds() {
      this.guestBookingIds = [];
    },
    async loadRegisterComponent() {
      try {
        const moduleResult = await this.$useLazyImport(() =>
          import(/* webpackChunkName: "RegisterChunk" */ "./Register")
        );
        this.registerComponent = moduleResult.default;
      } catch (err) {
        this.$rollbar.error(
          "Oops, something went wrong, failed to open register screen",
          err
        );
        this.$alert.error(
          "Oops, something went wrong, failed to open register screen"
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
