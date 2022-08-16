<template>
  <div
    class="relative landing-slider-wrap"
    :class="[isLoading ? 'is-loading' : null]"
  >
    <div v-if="isLoading" class="w-full h-full bg-gray-300 animate-pulse"></div>
    <template v-else>
      <hh-image
        v-if="photos.length === 1"
        :img="photos[0]"
        class="w-full"
        desktop-width="full-screen"
        mobile-width="full-screen"
        :desktop-height="400"
        :mobile-height="150"
        :is-lazy="isSafari && isDesktop ? false : true"
      ></hh-image>
      <div v-else class="h-full main-group-landing-slider swiper">
        <div class="swiper-wrapper">
          <div
            v-for="(photo, key) in photos"
            :key="`main-image-${key}`"
            class="w-full swiper-slide"
          >
            <hh-image
              :img="photo"
              class="w-full"
              desktop-width="full-screen"
              mobile-width="full-screen"
              :desktop-height="400"
              :mobile-height="150"
              :is-lazy="isSafari && isDesktop ? false : true"
            ></hh-image>
          </div>
        </div>
      </div>
      <div
        v-if="shouldShowArrow"
        id="main-group-landing-slider-slider-next"
        class="slider-next text-red-dark"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="currentColor"
          class="inline icon-chevron-right"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </div>
      <div
        v-if="shouldShowArrow"
        id="main-group-landing-slider-slider-prev"
        class="slider-prev text-red-dark"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          class="inline icon-chevron-left"
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
</template>

<script>
import "swiper/swiper-bundle.min.css";
import { Swiper, Navigation, Autoplay } from "swiper";
import parseUserAgent from "@/helper/userAgentParser";
Swiper.use([Navigation, Autoplay]);
const { browserName } = parseUserAgent();
export default {
  props: {
    photos: {
      type: Array,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const isSafari = browserName.includes("safari");
    return {
      isSafari,
    };
  },
  computed: {
    shouldShowArrow() {
      return this.photos.length && this.photos.length > 1;
    },
  },
  watch: {
    isLoading: {
      handler(newVal) {
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
      let config = {
        slidesPerView: 1,
        loop: this.isSafari ? false : true,
        autoPlay: this.isSafari ? false : true,
        navigation: {},
        autoHeight: this.isSafari ? false : true,
      };
      const el = ".main-group-landing-slider";
      if (this.shouldShowArrow) {
        const nextEl = document.getElementById(
          "main-group-landing-slider-slider-next"
        );
        const prevEl = document.getElementById(
          "main-group-landing-slider-slider-prev"
        );
        config.navigation = {
          nextEl: nextEl,
          prevEl: prevEl,
        };
      }
      try {
        new Swiper(el, config);
      } catch (err) {
        this.$rollbar.error(err);
      }
    },
  },
};
</script>

<style lang="scss">
.landing-slider-wrap {
  &.is-loading {
    height: 150px;
  }
  height: 100%;
  .swiper-slide {
    img {
      height: 100%;
    }
  }
  @screen lg {
    &.is-loading {
      height: 300px;
    }
    .swiper-slide {
      img {
        height: 100%;
        min-height: 200px;
      }
    }
  }
  .slider-next {
    position: absolute;
    top: 40%;
    right: 0;
    z-index: 10;
    cursor: pointer;
  }
  .slider-prev {
    position: absolute;
    top: 40%;
    left: 0;
    z-index: 10;
    cursor: pointer;
  }
}
</style>
