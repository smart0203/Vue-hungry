<template>
  <div class="popular-brand-section">
    <div
      class="mt-2 mb-4 text-sm capitalize lg:font-black lg:text-center lg:text-xl lg:my-4"
      :class="
        isLoading
          ? 'bg-gray-300  h-3 lg:h-6 w-4/12 lg:w-1/12 lg:mx-auto mr-auto text-gray-300'
          : null
      "
    >
      {{ !isLoading ? title : "" }}
    </div>
    <div class="relative">
      <div ref="popular-brand-slider" class="popular-brand-slider swiper">
        <div class="mb-10 swiper-wrapper">
          <a
            v-for="(brand, index) in popularBrandData"
            :key="brand.id"
            class="swiper-slide"
            :style="slideStyles"
            :href="buildLink(index, brand)"
            @click.prevent="goToLink(index, brand)"
          >
            <div class="brand-item">
              <div
                class="relative circle"
                :class="isLoading ? '  bg-gray-400' : null"
              >
                <hh-image
                  v-if="!isLoading && brand.logo && brand.logo.length"
                  :desktop-width="120"
                  :desktop-height="120"
                  :mobile-width="88"
                  :mobile-height="88"
                  :is-lazy="false"
                  class="w-full h-full rounded-full"
                  :img="brand.logo"
                />

                <!-- ads label -->
                <div
                  v-if="brand.isAds"
                  class="absolute left-0 right-0 text-xs text-gray-500 rounded-lg ads"
                >
                  Ad
                </div>
              </div>
              <div
                :class="
                  isLoading ? ' text-gray-300 bg-gray-300  w-20' : 'w-full'
                "
                class="truncate label"
              >
                <span>{{ brand.name }}</span>
              </div>
            </div>
          </a>
        </div>
        <div v-if="isShowPagination" class="swiper-pagination"></div>
      </div>
      <!-- Add Arrows -->
      <template v-if="isShowArrow">
        <div
          v-if="isShowNextArrow"
          ref="slider-next"
          class="swiper-button-next home-slider-next"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="currentColor"
            class="inline icon-chevron-right text-red-dark"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </div>
        <div
          v-if="isShowPrevArrow"
          ref="slider-prev"
          class="home-slider-prev swiper-button-prev"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            class="inline icon-chevron-left text-red-dark"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
            />
          </svg>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { Swiper, Navigation, Pagination, Virtual } from "swiper";
import { belongToGroupLanding } from "@/composable/groupLanding";
Swiper.use([Navigation, Pagination, Virtual]);
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    popularBrand: {
      type: Array,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      virtualData: {
        slides: [],
      },
      sliderInstance: null,
      isReachEndSlide: false,
      isReachBeginningSlide: true,
    };
  },
  computed: {
    popularBrandData() {
      return this.isLoading ? this.popularBrand : this.virtualData.slides;
    },
    isShowPagination() {
      return this.popularBrand && this.popularBrand.length > this.slidesPerView;
    },
    isShowArrow() {
      return this.isDesktop;
    },
    isShowNextArrow() {
      return (
        this.popularBrand &&
        this.popularBrand.length > this.slidesPerView &&
        this.isReachEndSlide === false
      );
    },
    isShowPrevArrow() {
      return (
        this.popularBrand &&
        this.popularBrand.length > this.slidesPerView &&
        this.isReachBeginningSlide === false
      );
    },
    slidesPerView() {
      return this.isDesktop ? 7 : 3;
    },
    slideStyles() {
      return `left: ${this.virtualData.offset}px;`;
    },
  },
  watch: {
    isLoading: {
      handler: function (newVal) {
        if (newVal === false) {
          this.$nextTick(() => {
            this.initSlider();
          });
        }
      },
    },
  },
  methods: {
    async initSlider() {
      const self = this;
      const el = this.$refs["popular-brand-slider"];
      let sliderConfig = {
        centerInsufficientSlides: true,
        slidesPerView: this.slidesPerView,
        spaceBetween: 10,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          dynamicBullets: true,
        },
        virtual: {
          slides: this.popularBrand,
          renderExternal(data) {
            self.virtualData = data;
          },
        },
      };

      if (this.isShowArrow) {
        sliderConfig.navigation = {
          nextEl: this.$refs["slider-next"],
          prevEl: this.$refs["slider-prev"],
        };
        sliderConfig.on = {
          slideChange: () => {
            this.isReachBeginningSlide = this.sliderInstance.isBeginning;
            this.isReachEndSlide = this.sliderInstance.isEnd;
          },
        };
      }

      try {
        this.sliderInstance = new Swiper(el, sliderConfig);
      } catch (err) {
        this.$alert.error(err);
        this.$rollbar.error(err);
      }
    },
    buildLink(index, brand) {
      let link = `/restaurants/search?branch_id=${brand.id}`;
      const isBelongToGroupLanding = belongToGroupLanding(brand.id);
      if (isBelongToGroupLanding && isBelongToGroupLanding.length) {
        link = `/${isBelongToGroupLanding[0].slug}`;
      }
      return link;
    },
    goToLink(index, brand) {
      const link = this.buildLink(index, brand);
      this.$emit("on-brand-clicked", { index, brand, link });
      window.location = link;
    },
  },
};
</script>
