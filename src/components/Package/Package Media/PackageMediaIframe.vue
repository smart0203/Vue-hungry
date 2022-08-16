<template>
  <div>
    <div v-if="iframeLoading" class="flex items-center justify-center mx-auto">
      <div class="mr-2 loader small"></div>
      <span>{{ $t("loading") }} </span>
    </div>
    <iframe
      scrolling="yes"
      seamless="seamless"
      style="display: block; width: 100%; height: 100vh"
      :src="mediaIframe"
      @load="frameFinish"
    ></iframe>
  </div>
</template>

<script>
export default {
  props: {
    menuLink: {
      type: String,
    },
    isShow: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      iframeLoading: true,
      mediaIframe: "",
    };
  },
  watch: {
    isShow: {
      immediate: true,
      handler(val) {
        if (val === true) {
          this.loadMenuImage();
        }
      },
    },
  },
  methods: {
    frameFinish() {
      this.iframeLoading = false;
    },
    loadMenuImage() {
      this.mediaIframe = this.menuLink;
    },
  },
};
</script>
<style>
iframe {
  display: block;
  width: 100%;
  height: 100vh;
}
</style>
