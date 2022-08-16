import track from "@/services/userTracking";
export default {
  methods: {
    pageViewed() {
      if (!this.$store.getters.isDontAllowTracking) {
        track("PAGE_VIEWED", { pageTitle: this.pageTitle });
      }
    },
  },
};
