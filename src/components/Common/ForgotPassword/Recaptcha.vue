<template>
  <div id="g-recaptcha" class="g-recaptcha" :data-sitekey="sitekey"></div>
</template>

<script>
export default {
  data() {
    return {
      sitekey: process.env.VUE_APP_RECAPTCHA_SITE_KEY,
      widgetId: 0,
    };
  },
  mounted() {
    this.render();
  },
  methods: {
    execute() {
      window.grecaptcha.execute(this.widgetId);
    },
    reset() {
      window.grecaptcha.reset(this.widgetId);
    },
    render() {
      if (window.grecaptcha && window.grecaptcha.render) {
        this.widgetId = window.grecaptcha.render("g-recaptcha", {
          sitekey: this.sitekey,
          badge: "inline",
          callback: (response) => {
            this.$emit("verify", response);
          },
        });
      }
    },
  },
};
</script>
<style>
.g-recaptcha iframe {
  height: 80px !important;
}
</style>
