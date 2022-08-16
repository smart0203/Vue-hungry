<template>
  <div class="lg:pt-6">
    <div
      v-if="!isLoading && banners && banners.length"
      class="relative mt-4 lg:mt-10"
    >
      <div ref="banner-slider" class="swiper">
        <div class="mb-8 swiper-wrapper">
          <div
            v-for="(banner, index) in banners"
            :key="index"
            class="swiper-slide"
          >
            <a
              :href="
                banner.targetUrl && banner.targetUrl.length
                  ? banner.targetUrl
                  : null
              "
            >
              <HhImage
                v-if="banner.selectedBanner"
                class="object-contain w-full"
                :img="banner.selectedBanner"
                :desktop-height="200"
                :mobile-height="200"
              />
            </a>
          </div>
        </div>
        <div v-if="banners.length > 1" class="swiper-pagination"></div>
      </div>
      <div
        v-if="banners.length > 1"
        ref="slider-next"
        class="swiper-button-next"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="currentColor"
          class="inline text-black icon-chevron-right"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </div>
      <div
        v-if="banners.length > 1"
        ref="slider-prev"
        class="swiper-button-prev"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="currentColor"
          class="inline text-black icon-chevron-left"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/lib/myAjax";
import "swiper/swiper-bundle.min.css";
import { Swiper, Navigation, Pagination } from "swiper";
import reject from "lodash-es/reject";
Swiper.use([Navigation, Pagination]);

export default {
  data() {
    return {
      isLoading: true,
      banners: [],
      sliderInstance: "",
    };
  },
  mounted() {
    this.getBanner();
  },
  methods: {
    async getBanner() {
      this.isLoading = true;
      const restaurantTag =
        this.$store.state.restaurant.restaurantData.hashtags;

      if (!restaurantTag || (restaurantTag && restaurantTag.length === 0)) {
        this.isLoading = false;
        return;
      }
      const restaurantTagIDs = restaurantTag
        ? restaurantTag.map((tag) => tag.id)
        : [];
      const defaultErrorMessage =
        "Oops, someting went wrong, failed get restaurant banner";

      try {
        const response = await axios({
          method: "GET",
          url: `/banners.json?restaurant_tag_ids=${restaurantTagIDs}`,
        });
        if (response.data && response.data.length) {
          this.banners = reject(
            response.data.map((banner) => {
              let selectedBanner = "";
              if (this.isDesktop) {
                if (banner.desktopVersions && banner.desktopVersions.length) {
                  selectedBanner = banner.desktopVersions[0]?.url || "";
                } else if (
                  banner.mobileVersions &&
                  banner.mobileVersions.length
                ) {
                  selectedBanner = banner.mobileVersions[0]?.url || "";
                }
              } else {
                if (banner.mobileVersions && banner.mobileVersions.length) {
                  selectedBanner = banner.mobileVersions[0]?.url || "";
                } else if (
                  banner.desktopVersions &&
                  banner.desktopVersions.length
                ) {
                  selectedBanner = banner.desktopVersions[0]?.url || "";
                }
              }

              return {
                targetUrl: banner.targetUrl,
                selectedBanner,
              };
            }),
            (banner) => {
              !banner.selectedBanner;
            }
          );
          this.isLoading = false;

          this.$nextTick(() => {
            if (this.banners && this.banners.length > 1) {
              this.initSlider();
            }
          });
        }
        this.isLoading = false;
      } catch (err) {
        this.$rollbar.error(err || defaultErrorMessage, { restaurantTagIDs });
      }
    },
    initSlider() {
      const el = this.$refs["banner-slider"];
      let sliderConfig = {
        autoHeight: false,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          dynamicBullets: true,
        },
        navigation: {
          nextEl: this.$refs["slider-next"],
          prevEl: this.$refs["slider-prev"],
        },
      };
      try {
        this.sliderInstance = new Swiper(el, sliderConfig);
      } catch (err) {
        this.$rollbar.error(err);
      }
    },
  },
};
</script>
<style>
.swiper-button-prev::after,
.swiper-button-next::after {
  content: none;
}
</style>
