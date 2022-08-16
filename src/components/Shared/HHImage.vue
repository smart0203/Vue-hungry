<template>
  <v-lazy-image
    v-if="isUsingExternalLazy"
    :key="retryID"
    :src="image"
    width="100%"
    height="100%"
    :src-placeholder="$options.misc.loadingPlaceHolder"
    @error.native="replaceErrorImage"
  />
  <img
    v-else
    :key="retryID"
    :src="image"
    loading="lazy"
    width="100%"
    height="100%"
    @error="replaceErrorImage"
  />
</template>

<script>
const loadingPlaceHolder = require("@/assets/skeleton-loader.svg");
const supportNativeLazy =
  "loading" in HTMLImageElement.prototype ? true : false;
import { isRetina } from "@/helper/screenSizeHelper";
import { nanoid } from "nanoid";
import VLazyImage from "v-lazy-image";
import imageMutator from "@/services/imageMutator";
export default {
  name: "HHImage",
  components: {
    VLazyImage,
  },
  props: {
    img: {
      type: String,
      required: true,
    },
    fallback: {
      type: String,
      default: "",
    },
    disableRetina: {
      type: Boolean,
      default: false,
    },
    isLazy: {
      type: Boolean,
      default: true,
    },
    isLocalImage: {
      type: Boolean,
      default: false,
    },
    mobileWidth: {
      default: 0,
    },
    mobileHeight: {
      default: 0,
    },
    desktopWidth: {
      default: 0,
    },
    desktopHeight: {
      default: 0,
    },
    preferWebp: {
      type: Boolean,
      default: true,
    },
    resizingType: {
      type: String,
      default: "fill",
    },
  },
  data() {
    return {
      image: "",
      isResized: false,
      maxRetryCount: 3,
      retryCount: 0,
      retryInterval: 1000,
      retryFunction: null,
      retryID: null,
      isUsingExternalLazy: false,
    };
  },
  misc: {
    loadingPlaceHolder,
  },
  watch: {
    img: {
      handler: function () {
        this.checkImage();
      },
      immediate: true,
    },
  },
  created() {
    this.isUsingExternalLazy = this.setLazyOption();
  },
  beforeDestroy() {
    this.clearTimeout();
  },
  methods: {
    setLazyOption() {
      if (this.isLazy) {
        if (supportNativeLazy) {
          return false;
        }
        return true;
      }
      return false;
    },
    checkImage() {
      try {
        if (!this.img || (this.img && this.img.length === 0)) {
          this.image = this.fallback;
        }
        // if local image
        if (this.isLocalImage) {
          let checkImage;
          if (this.disableRetina) {
            const split = this.img.split("/");
            checkImage = split[split.length - 1];
          } else {
            checkImage = this.retinaUrl(this.img);
          }
          import("@/assets/" + checkImage).then((img) => {
            this.image = img.default;
          });
        }
        // image from server
        else {
          let temp = this.$url(this.img, "asset");
          this.mutateImage(this.disableRetina ? temp : this.retinaUrl(temp));
        }
      } catch (err) {
        this.$rollbar.error(err);
      }
    },
    replaceErrorImage() {
      if (this.retryCount < this.maxRetryCount) {
        this.retryFunction = setTimeout(() => {
          this.retryID = this.img + nanoid(3);
          this.retryCount += 1;
        }, this.retryInterval);
      } else {
        console.log(`error using image ${this.image} now using image fallback`);
        if (this.fallback) {
          this.image = this.fallback;
          return;
        }
        this.image = window.errorImagePlaceholder;
      }
    },
    retinaUrl(url) {
      if (url && url.length) {
        // if reference to local image, return image name only
        if (this.isLocalImage) {
          const split = url.split("/");
          const imageName = split[split.length - 1];
          const splitImageName = imageName.split(".");
          if (!isRetina) {
            return splitImageName[0] + "." + splitImageName[1];
          }
          return splitImageName[0] + "@2x." + splitImageName[1];
        } else {
          return url;
        }
      }
      return "";
    },
    mutateImage(image) {
      this.image = imageMutator({
        image: image,
        desktopWidth: this.desktopWidth,
        desktopHeight: this.desktopHeight,
        mobileWidth: this.mobileWidth,
        mobileHeight: this.mobileHeight,
        isRetina: !this.disableRetina,
        isWebp: this.preferWebp,
        resizingType: this.resizingType,
      });
    },
    clearTimeout() {
      if (this.retryFunction) {
        window.clearTimeout(this.retryFunction);
      }
    },
  },
};
</script>
