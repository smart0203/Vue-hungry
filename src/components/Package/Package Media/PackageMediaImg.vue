<template>
  <div>
    <HhImage
      v-for="(img, index) in images"
      :key="img.original"
      :img="img.original"
      :desktop-width="900"
      mobile-width="full-screen"
      class="w-full cursor-pointer"
      @click.native="showPopupGallery(index)"
    />
    <div :id="popUpGalleryId"></div>
  </div>
</template>

<script>
import popUpGallery from "@/components/Shared/PopupGallery";

export default {
  props: {
    images: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const { showGallery } = popUpGallery();
    return {
      showGallery,
    };
  },
  data() {
    return {
      popUpImages: [],
    };
  },
  computed: {
    popUpGalleryId() {
      return `package-media-plain-img-${new Date().getTime()}`;
    },
  },
  mounted() {
    this.restructureData();
  },
  methods: {
    restructureData() {
      this.popUpImages = this.images.map((img) => {
        return {
          asset: this.$url(img.original, "asset"),
        };
      });
    },
    showPopupGallery(index) {
      const el = `#${this.popUpGalleryId}`;
      try {
        this.showGallery(el, this.popUpImages, index);
      } catch (err) {
        this.$alert.error(
          "Gallery component can't be loaded, please refresh your browser"
        );
        this.$rollbar.error(err);
      }
    },
  },
};
</script>
