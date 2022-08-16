export default {
  methods: {
    mobileScrollToTop() {
      if (this.isMobile) {
        window.scrollTo(0, 0);
      }
    },
  },
};
