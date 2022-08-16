<template>
  <HomeBannerView
    :img="bannerImg"
    :total-cover="totalCovers"
    :title="title"
    :lang="lang"
    :show-city-option="allowSearchByCity"
  />
  <!-- <HhImage
    :img="bannerImg"
    :total-cover="totalCovers"
    :title="title"
    :lang="lang"
    :show-city-option="allowSearchByCity"
    :mobile-width="'full-screen'"
    class="font-black text-center banner-bg"
  /> -->
</template>

<script>
import { mapState } from "vuex";
import {
  selectedCityName,
  selectedCityHomeDescription,
} from "@/composable/selectCity";
import { isLoading, homeBanners } from "@/composable/banners";
import HomeBannerView from "./HomeBannerView";
import { rebuildUrl } from "@/helper/urlHelper";
import imageMutator from "@/services/imageMutator";

export default {
  components: {
    HomeBannerView,
  },
  setup() {
    return {
      selectedCityName,
      selectedCityHomeDescription,
      homeBanners,
      isLoading,
    };
  },
  computed: {
    ...mapState(["lang"]),
    ...mapState("webConfig", ["config", "allowSearchByCity"]),
    title() {
      return (
        this.selectedCityHomeDescription || "Discover Incredible Dining Deals"
      );
    },
    bannerImg() {
      if (
        this.isLoading ||
        !Array.isArray(this.homeBanners) ||
        !this.homeBanners.length
      ) {
        return "";
      }
      const firstBanner = this.homeBanners[0];
      if (firstBanner.active) {
        const desktopVersion =
          Array.isArray(firstBanner.desktopVersions) &&
          firstBanner.desktopVersions.length
            ? firstBanner.desktopVersions[0]?.url
            : "";
        const mobileVersion =
          Array.isArray(firstBanner.mobileVersions) &&
          firstBanner.mobileVersions.length
            ? firstBanner.mobileVersions[0]?.url
            : "";

        let selectedVersion = "";
        if (this.isDesktop) {
          selectedVersion = desktopVersion || mobileVersion;
        } else {
          selectedVersion = mobileVersion || desktopVersion;
        }
        const finalImage = imageMutator({
          image: rebuildUrl(selectedVersion),
          desktopHeight: 400,
          mobileHeight: 230,
          isRetina: true,
          isWebp: true,
        });
        return `background-image: url(${finalImage});`;
      }
      return "";
    },
    totalCovers() {
      return this.$formatThousand(this.config.totalCovers || 1000000);
    },
  },
};
</script>
