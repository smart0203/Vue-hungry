<template>
  <div class="top-categories-section">
    <div
      class="section-title"
      :class="
        isLoading
          ? 'bg-gray-300  h-4 lg:h-6  w-5/12 lg:w-1/5 lg:mx-auto mr-auto text-gray-300'
          : null
      "
    >
      {{ !isLoading ? title : "" }}
    </div>
    <div class="relative">
      <div ref="top-categories-slider" class="top-categories-slider swiper">
        <div class="mb-8 swiper-wrapper">
          <div
            v-for="(topCategory, index) in item"
            :key="topCategory.id"
            class="swiper-slide"
            :class="isLoading ? 'is-loading' : null"
            :style="slideStyles"
          >
            <a
              :href="buildLink(topCategory.id)"
              class="block top-categories-item"
              @click.prevent="goToLink(index, topCategory)"
            >
              <div class="rounded-lg cover" :class="isLoading ? ' ' : null">
                <hh-image
                  v-if="!isLoading"
                  :desktop-width="150"
                  :mobile-width="130"
                  :desktop-height="180"
                  :mobile-height="120"
                  :img="topCategory.cover.url"
                  :alt="topCategory.title"
                  class="w-full h-full rounded-lg"
                  :is-lazy="false"
                />
              </div>
              <div class="text-xs label lg:text-sm">
                <div
                  class="font-black truncate"
                  :class="
                    isLoading
                      ? ' bg-gray-300 text-gray-300  w-8 h-4 mb-2'
                      : null
                  "
                >
                  {{ topCategory.title }}
                </div>
                <div class="flex items-center text-xs">
                  <div v-if="!isLoading" class="mr-1 lg:mr-2">
                    <img
                      src="@/assets/icon-home-black.png"
                      alt="icon home"
                      width="10"
                      height="10"
                      loading="lazy"
                    />
                  </div>
                  <span
                    class="text-2xs lg:text-sm"
                    :class="
                      isLoading ? ' bg-gray-300  text-gray-300 h-6' : null
                    "
                  >
                    {{
                      `${topCategory.totalRestaurants} ${$tc(
                        "restaurant",
                        $formatThousand(topCategory.totalRestaurants)
                      )}`
                    }}
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
      <!-- Add Arrows -->
      <template v-if="isShowArrow">
        <div
          v-if="isShowNextArrow"
          ref="slider-next"
          class="home-slider-next swiper-button-next"
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
import { selectedCityId } from "@/composable/selectCity";
Swiper.use([Navigation, Pagination, Virtual]);

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Array,
      required: true,
    },
  },
  setup() {
    return {
      selectedCityId,
    };
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
    isShowArrow() {
      return this.isDesktop;
    },
    slidesPerView() {
      return this.isMobile ? 4 : 7;
    },
    slideStyles() {
      return `left: ${this.virtualData.offset}px;`;
    },
    isShowNextArrow() {
      return (
        this.item &&
        this.item.length > this.slidesPerView &&
        this.isReachEndSlide === false
      );
    },
    isShowPrevArrow() {
      return (
        this.item &&
        this.item.length > this.slidesPerView &&
        this.isReachBeginningSlide === false
      );
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
      const el = this.$refs["top-categories-slider"];
      let config = {
        centerInsufficientSlides: true,
        slidesPerView: this.slidesPerView,
        spaceBetween: this.isDesktop ? 20 : 10,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 2,
        },
      };

      if (this.isShowArrow) {
        config.navigation = {
          nextEl: this.$refs["slider-next"],
          prevEl: this.$refs["slider-prev"],
        };

        config.on = {
          slideChange: () => {
            this.isReachBeginningSlide = this.sliderInstance?.isBeginning;
            this.isReachEndSlide = this.sliderInstance?.isEnd;
          },
        };
      }

      try {
        this.sliderInstance = new Swiper(el, config);
      } catch (err) {
        this.$alert.error(err);
        this.$rollbar.error(err);
      }
    },
    buildLink(id) {
      return `restaurants/search?city_id=${this.selectedCityId}&cuisines[]=${id}`;
    },
    goToLink(index, topCategory) {
      const link = this.buildLink(topCategory.id);
      this.$emit("on-category-clicked", { index, topCategory, link });
      window.location = link;
    },
  },
};
</script>
