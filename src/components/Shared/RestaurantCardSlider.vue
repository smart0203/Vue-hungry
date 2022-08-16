<template>
  <div class="relative restaurant-card-slider">
    <div class="">
      <div ref="restaurant-card-slider" class="swiper">
        <div
          class="mb-8 swiper-wrapper"
          :class="isLoading ? 'flex items-center justify-center' : ''"
        >
          <div
            v-for="(restaurant, index) in restaurantData"
            :key="generateLoopKey(restaurant, index)"
            class="swiper-slide restaurant-card-slide"
            :style="slideStyles"
          >
            <div class="mx-1" :class="isLoading ? 'pr-4' : null">
              <RestaurantCard
                :is-lazy-load-main-image="false"
                :is-loading="isLoading"
                image-width-mobile="half-screen"
                :restaurant="restaurant"
                @on-link-clicked="goToLink(index, restaurant)"
              />
            </div>
          </div>
        </div>
        <!-- pagination -->
        <div class="swiper-pagination"></div>
      </div>
      <div
        v-if="isShowArrow && isShowNextArrow"
        ref="slider-next"
        class="swiper-button-next"
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
        v-if="isShowArrow && isShowPrevArrow"
        ref="slider-prev"
        class="swiper-button-prev"
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
    </div>
  </div>
</template>

<script>
import { Swiper, Navigation, Pagination, Virtual } from "swiper";
Swiper.use([Navigation, Pagination, Virtual]);
import RestaurantCard from "@/components/Shared/RestaurantCard/RestaurantCard.vue";
export default {
  components: {
    RestaurantCard,
  },
  props: {
    restaurants: {
      type: Array,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
    linkClickedCallback: {
      type: Function,
      default: () => {
        return;
      },
    },
    alignCenter: {
      type: Boolean,
      default: true,
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
    restaurantData() {
      return this.isLoading ? this.restaurants : this.virtualData.slides;
    },
    isShowArrow() {
      return this.restaurants.length >= 4 && this.isDesktop;
    },
    slideStyles() {
      return `left: ${this.virtualData.offset}px;`;
    },
    slidesPerView() {
      return this.isDesktop ? 5 : 2;
    },
    isShowNextArrow() {
      return (
        this.restaurants &&
        this.restaurants.length > this.slidesPerView &&
        this.isReachEndSlide === false
      );
    },
    isShowPrevArrow() {
      return (
        this.restaurants &&
        this.restaurants.length > this.slidesPerView &&
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
      immediate: true,
    },
  },
  methods: {
    async initSlider() {
      const el = this.$refs["restaurant-card-slider"];
      let sliderConfig = {
        centerInsufficientSlides: this.alignCenter,
        slidesPerView: this.slidesPerView,
        spaceBetween: 10,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          dynamicBullets: true,
        },
        virtual: {
          slides: this.restaurants,
          renderExternal: (data) => {
            this.virtualData = data;
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
    goToLink(index, restaurant) {
      this.$emit("on-restaurant-clicked", { index, restaurant });
      restaurant.goToLink();
    },
    generateLoopKey(restaurant, index) {
      return `${restaurant.name}-$${restaurant.id}-${index}`;
    },
  },
};
</script>
