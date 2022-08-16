<template>
  <div class="relative max-width">
    <div
      class="mx-auto lg:w-11/12 group-landing-customer-review-slider-wrapper"
    >
      <div
        class="mb-4 ml-2 text-sm font-black lg:mb-8 lg:text-xl text-red-dark lg:text-center"
      >
        {{ $t("customersReviews") }}
      </div>
      <template v-if="isDesktop">
        <div class="mx-auto">
          <div class="mx-auto">
            <div
              id="group-landing-customer-review-slider"
              class="swiper"
              :class="isLoading ? 'is-loading' : null"
              style="height: 450px"
            >
              <div class="flex swiper-wrapper lg:flex-wrap">
                <div
                  v-for="review in customerReviews"
                  :key="review.id"
                  class="swiper-slide lg:w-1/2"
                >
                  <FeaturedReviewCustomer
                    class="mb-4"
                    :is-loading="isLoading"
                    :customer-review="review"
                  />
                </div>
              </div>
              <div
                id="group-landing-customer-review-slider-pagination"
                class="swiper-pagination"
              ></div>
            </div>
          </div>
        </div>
        <div
          id="group-landing-customer-review-slider-next"
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
          id="group-landing-customer-review-slider-prev"
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
      <template v-else>
        <div class="flex flex-col">
          <div
            v-for="review in customerReviews"
            :key="review.id"
            class="mb-2 mr-6 swiper-slide"
          >
            <FeaturedReviewCustomer
              :is-loading="isLoading"
              class="px-2 mb-4"
              :customer-review="review"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import "swiper/swiper-bundle.min.css";
import "@/components/Page Component/Home/FeaturedReview/FeaturedReview.scss";
import FeaturedReviewCustomer from "@/components/Page Component/Home/FeaturedReview/FeaturedReviewCustomer";
import { Swiper, Navigation, Autoplay, Grid } from "swiper";
Swiper.use([Navigation, Autoplay, Grid]);
export default {
  components: {
    FeaturedReviewCustomer,
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    customerReviews: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    customerReviews: {
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
          "group-landing-customer-review-slider"
        );
        const nextEl = document.getElementById(
          "group-landing-customer-review-slider-next"
        );
        const prevEl = document.getElementById(
          "group-landing-customer-review-slider-prev"
        );
        const pagination = document.getElementById(
          "group-landing-customer-review-slider-pagination"
        );

        new Swiper(element, {
          slidesPerView: 2,
          spaceBetween: 30,
          grid: {
            rows: 2,
          },
          pagination: {
            el: pagination,
            clickable: true,
            dynamicBullets: false,
          },
          lazy: true,
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
.group-landing-customer-review-slider-wrapper {
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

#group-landing-customer-review-slider {
  &.is-loading {
    @screen lg {
      .swiper-slide {
        width: 50%;
      }
    }
  }

  .swiper-slide {
    height: calc((100% - 30px) / 2);
  }
}
</style>
