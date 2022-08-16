<template>
  <div class="relative max-width group-landing-blogger-review-slider-wrapper">
    <div class="my-4 ml-2 text-sm font-black lg:my-6 lg:text-xl lg:text-center">
      {{ $t("bloggersReviews") }}
    </div>
    <div class="py-4 mx-auto lg:w-11/12">
      <div id="group-landing-blogger-review-slider" class="relative swiper">
        <div class="flex mb-8 swiper-wrapper">
          <div
            v-for="review in bloggerReviews"
            :key="review.id"
            class="swiper-slide"
          >
            <FeaturedReviewBlogger
              :is-loading="isLoading"
              :blogger-review="review"
              class="px-4"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- Add Arrows -->
    <div
      id="group-landing-blogger-review-slider-next"
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
      id="group-landing-blogger-review-slider-prev"
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
  </div>
</template>

<script>
import "@/components/Page Component/Home/FeaturedReview/FeaturedReview.scss";
import "swiper/swiper-bundle.min.css";
import FeaturedReviewBlogger from "@/components/Page Component/Home/FeaturedReview/FeaturedReviewBlogger";
import { Swiper, Navigation, Autoplay } from "swiper";
Swiper.use([Navigation, Autoplay]);
export default {
  components: {
    FeaturedReviewBlogger,
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    bloggerReviews: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    bloggerReviews: {
      handler() {
        this.$nextTick(() => {
          this.initSlider();
        });
      },
    },
  },
  methods: {
    initSlider() {
      try {
        const element = document.getElementById(
          "group-landing-blogger-review-slider"
        );
        const nextEl = document.getElementById(
          "group-landing-blogger-review-slider-next"
        );
        const prevEl = document.getElementById(
          "group-landing-blogger-review-slider-prev"
        );

        const count = this.isDesktop ? 3 : 1;
        new Swiper(element, {
          lazy: true,
          slidesPerView: count,
          navigation: {
            nextEl: nextEl,
            prevEl: prevEl,
          },
        });
      } catch (err) {
        this.$rollbar.error(err);
      }
    },
  },
};
</script>

<style lang="scss">
.group-landing-blogger-review-slider-wrapper {
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
