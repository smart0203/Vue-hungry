<template>
  <div>
    <template v-if="anyPlainImg && plainImg.length">
      <component :is="plainImgComponent" :images="plainImg"></component>
    </template>
    <template v-if="anyIMenuPro && iMenuPro.length">
      <component
        :is="iMenuProComponent"
        v-for="imenu in iMenuPro"
        :key="imenu.link"
        :menu-link="imenu.link"
        is-show
      />
    </template>
  </div>
</template>

<script>
import qs from "query-string";
export default {
  props: {
    menuMedia: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      iMenuProComponent: "",
      plainImgComponent: "",
    };
  },
  computed: {
    anyIMenuPro() {
      return this.menuMedia.type.includes("imenupro") ? true : false;
    },
    anyPlainImg() {
      return this.menuMedia.type.includes("img") ||
        this.menuMedia.type.includes("image")
        ? true
        : false;
    },
    iMenuPro() {
      if (this.anyIMenuPro) {
        if (this.menuMedia.data.imenupro) {
          // make imenu pro not include img, just plain imenu pro
          if (this.anyPlainImg) {
            return this.menuMedia.data.imenupro.map((imenuPro) => {
              let finalLink = "";
              if (imenuPro.link.includes("?")) {
                const paramQueryString = imenuPro.link.split("?");
                if (paramQueryString.length >= 1) {
                  const parsed = qs.parse(paramQueryString[1]);
                  parsed.imenupro_only = true;
                  const stringify = qs.stringify(parsed);
                  finalLink = `${paramQueryString[0]}?${stringify}`;
                } else {
                  finalLink = `${imenuPro.link}?imenupro_only=true`;
                }
              } else {
                finalLink = `${imenuPro.link}?imenupro_only=true`;
              }

              return {
                link: finalLink,
                loaded: imenuPro.loaded,
              };
            });
          }
          // imenu pro include img
          return this.menuMedia.data.imenupro;
        }
        return [];
      }
      return [];
    },
    plainImg() {
      if (this.anyPlainImg) {
        if (this.menuMedia.data.img) {
          return this.menuMedia.data.img;
        }
        return [];
      }
      return [];
    },
  },
  mounted() {
    if (this.anyIMenuPro) {
      this.loadIMenuProComponent();
    }
    if (this.anyPlainImg) {
      this.loadPlainImgComponent();
    }
  },
  methods: {
    async loadIMenuProComponent() {
      try {
        const moduleRequest = await this.$useLazyImport(() =>
          import(
            /* webpackChunkName: "PackageMediaIframe" */ "./PackageMediaIframe"
          )
        );
        this.iMenuProComponent = moduleRequest.default;
      } catch (err) {
        this.$rollbar.error("faield load package menu Iframe component");
      }
    },
    async loadPlainImgComponent() {
      try {
        const moduleRequest = await this.$useLazyImport(() =>
          import(
            /* webpackChunkName: "PackageMediaPlainImg" */ "./PackageMediaImg"
          )
        );
        this.plainImgComponent = moduleRequest.default;
      } catch (err) {
        this.$rollbar.error("failed load package menu img component");
      }
    },
  },
};
</script>
