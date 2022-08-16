<template>
  <div class="relative promotion-section-wrapper">
    <div ref="promo-slider" class="swiper">
      <h2 class="my-3 text-xl font-black text-center capitalize text-red-dark">
        {{ $t("promotions") }}
      </h2>
      <div v-if="isMobile" class="flex mb-8 overflow-x-scroll">
        <a
          v-for="(promo, index) in promos"
          :key="promo.id"
          :href="promo.targetUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="flex-shrink-0 pr-4 promo-item"
          @click.prevent="goToLink(index, promo)"
        >
          <div v-if="isLoading" class="h-full mr-2 bg-gray-300"></div>
          <HhImage
            v-else
            class="object-cover bg-gray-300"
            :img="parseImg(promo)"
            alt="promotion item"
            :desktop-width="500"
            :is-lazy="true"
            mobile-width="full-screen"
            width="320"
            height="195"
          />
        </a>
      </div>
      <div v-else class="mb-10 lg:ml-3 swiper-wrapper">
        <a
          v-for="(promo, index) in promos"
          :key="promo.id"
          :href="promo.targetUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="swiper-slide promo-item"
          @click.prevent="goToLink(index, promo)"
        >
          <div v-if="isLoading" class="h-full mr-2 bg-gray-300"></div>
          <HhImage
            v-else
            class="object-cover"
            :img="parseImg(promo)"
            alt="promotion item"
            :desktop-width="500"
            :is-lazy="false"
            mobile-width="full-screen"
            width="320"
            height="195"
          />
        </a>
      </div>
      <!-- pagination -->
      <div class="swiper-pagination"></div>
    </div>

    <!-- Add Arrows -->
    <template v-if="isShowArrow">
      <div ref="slider-next" class="swiper-button-next home-slider-next">
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
      <div ref="slider-prev" class="swiper-button-prev home-slider-prev">
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
</template>

<script>
import { Swiper, Navigation, Pagination, Autoplay } from "swiper";
Swiper.use([Navigation, Pagination, Autoplay]);
export default {
  props: {
    promos: {
      type: Array,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isShowArrow() {
      return this.isDesktop && !this.isLoading;
    },
  },
  watch: {
    isLoading: {
      handler(val) {
        if (val === false) {
          this.$nextTick(() => {
            this.initSlider();
          });
        }
      },
    },
  },
  methods: {
    parseImg(promo) {
      const imgVersion = promo.mobileVersions;
      return imgVersion && imgVersion.length ? imgVersion[0].url : "";
    },
    async initSlider() {
      if (!this.isDesktop) {
        return;
      }
      const el = this.$refs["promo-slider"];
      const config = () => {
        if (this.isDesktop) {
          return {
            slidesPerView: 4,
            slidesPerGroup: 4,
            spaceBetween: 20,
            loop: true,
            autoplay: {
              delay: 6000,
            },
            navigation: {
              nextEl: this.$refs["slider-next"],
              prevEl: this.$refs["slider-prev"],
            },
          };
        } else {
          return {
            spaceBetween: 10,
            slidesPerView: "auto",
          };
        }
      };
      try {
        new Swiper(el, {
          pagination: {
            el: ".swiper-pagination",
            clickable: true,
          },
          ...config(),
        });
      } catch (err) {
        this.$alert.error(err);
        this.$rollbar.error(err);
      }
    },
    goToLink(index, promo) {
      this.$emit("on-promotion-clicked", { index, promo });
      window.location = promo.targetUrl;
    },
  },
};
</script>
