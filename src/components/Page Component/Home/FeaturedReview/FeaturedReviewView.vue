<template>
  <div>
    <div class="customer-review-section">
      <div class="relative max-width">
        <div
          class="mb-4 ml-2 text-sm font-black lg:mb-8 lg:text-xl text-red-dark lg:text-center"
        >
          {{ $t("customersReviews") }}
        </div>
        <template v-if="isDesktop">
          <div class="mx-auto customer-review-slider">
            <div class="mx-auto">
              <div
                ref="customer-review-slider"
                class="swiper"
                style="height: 450px"
              >
                <div class="flex swiper-wrapper">
                  <div
                    v-for="review in customerReviews"
                    :key="review.id"
                    class="flex swiper-slide customer-review-item"
                    style=""
                  >
                    <FeaturedReviewCustomer
                      class="mb-4"
                      :is-loading="customerReviewsLoading.initialLoading"
                      :customer-review="review"
                    />
                  </div>
                </div>
                <div class="swiper-pagination"></div>
              </div>
            </div>
          </div>
          <div class="slider-next text-red-dark">
            <div
              v-if="customerReviewsLoading.loadMoreLoading"
              class="loader small"
            ></div>
            <svg
              v-if="!customerReviewsLoading.loadMoreLoading"
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
          <div class="slider-prev text-red-dark">
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
              v-for="review in splitReview(customerReviews)"
              :key="review.id"
              class="mb-2 mr-6 swiper-slide"
            >
              <FeaturedReviewCustomer
                :is-loading="customerReviewsLoading.initialLoading"
                class="mb-4"
                :customer-review="review"
              />
            </div>
          </div>
          <div class="text-center">
            <button
              class="px-8 py-2 text-sm font-black capitalize bg-transparent border rounded-lg border-red-dark text-red-dark"
              @click="$emit('customer-review-mobile-on-load-more')"
            >
              {{ $t("readMore") }}
            </button>
          </div>
        </template>
      </div>
    </div>

    <div class="max-width">
      <div class="blogger-review-section">
        <div
          class="mt-6 mb-4 ml-2 text-sm font-black lg:text-xl lg:text-center"
        >
          {{ $t("bloggersReviews") }}
        </div>

        <div class="relative">
          <div class="mx-auto blogger-review-slider">
            <div ref="blogger-review-slider" class="relative swiper">
              <div class="flex swiper-wrapper">
                <div
                  v-for="review in bloggerSliderVirtualData.slides"
                  :key="review.id"
                  class="swiper-slide blogger-review-slider-items"
                  :style="slideStyles"
                >
                  <FeaturedReviewBlogger
                    :is-loading="bloggerReviewsLoading.initialLoading"
                    :blogger-review="review"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="my-4 text-center lg:my-6">
            <a
              href="https://www.hungryhub.com/en/bloggers/reviews.html"
              target="_blank"
              class="inline-block px-2 py-2 text-xs font-black border rounded-lg lg:px-1 lg:text-sm text-red-dark border-red-dark hover:underline capital-first-letter"
              >{{ $t("viewAllBlogger") }}
            </a>
          </div>
          <!-- Add Arrows -->
          <div class="slider-next text-red-dark">
            <div
              v-if="bloggerReviewsLoading.loadMoreLoading"
              class="loader small"
            ></div>
            <svg
              v-if="!bloggerReviewsLoading.loadMoreLoading"
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
          <div class="slider-prev text-red-dark">
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
      </div>
    </div>
  </div>
</template>

<script>
import FeaturedReviewCustomer from "./FeaturedReviewCustomer";
import FeaturedReviewBlogger from "./FeaturedReviewBlogger";
import { Swiper, Navigation, Pagination, Virtual } from "swiper";
Swiper.use([Navigation, Pagination, Virtual]);

export default {
  components: {
    FeaturedReviewCustomer,
    FeaturedReviewBlogger,
  },
  props: {
    customerReviewsLoading: {
      type: Object,
      required: true,
    },
    bloggerReviewsLoading: {
      type: Object,
      required: true,
    },
    bloggerReviews: {
      type: Array,
      required: true,
    },
    customerReviews: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      bloggerSlider: null,
      bloggerSliderLastIndex: null,
      customerSlider: null,
      showedCustomerReviews: 2,
      bloggerSliderVirtualData: {
        slides: [],
      },
    };
  },
  computed: {
    slideStyles() {
      return `left: ${this.bloggerSliderVirtualData.offset}px;`;
    },
  },
  watch: {
    "bloggerReviewsLoading.initialLoading": {
      handler() {
        this.initBloggerReviewSlider();
      },
      immediate: true,
    },
    "customerReviewsLoading.initialLoading": {
      handler() {
        if (this.isDesktop) {
          this.initCustomerSlider();
        }
      },
      immediate: true,
    },
    customerReviews: {
      handler() {
        if (this.customerReviewsLoading.initialLoading === false) {
          this.updateSlider("customer");
        }
      },
    },
    "bloggerReviewsLoading.loadMoreLoading": {
      handler(newVal, oldVal) {
        if (newVal === false && oldVal === true) {
          this.updateSlider("blogger");
        }
      },
    },
  },
  methods: {
    async initBloggerReviewSlider() {
      try {
        const self = this;
        this.$nextTick(() => {
          const el = this.$refs["blogger-review-slider"];
          const slidesPerViewCount = this.isDesktop ? 3 : 1;
          this.bloggerSlider = new Swiper(el, {
            // lazy: true,
            slidesPerView: slidesPerViewCount,
            navigation: {
              nextEl: ".blogger-review-section .slider-next",
              prevEl: ".blogger-review-section .slider-prev",
            },
            virtual: {
              slides: this.bloggerReviews,
              renderExternal(data) {
                self.bloggerSliderVirtualData = data;
              },
            },
            on: {
              slideChange: () => {
                if (this.bloggerSlider.isEnd) {
                  this.bloggerSliderLastIndex = this.bloggerSlider.realIndex;
                  setTimeout(() => {
                    this.sliderReachEndCallback("blogger");
                  }, 300);
                }
              },
            },
          });
        });
      } catch (err) {
        this.$rollbar.error(err);
      }
    },
    async initCustomerSlider() {
      try {
        const self = this;
        this.$nextTick(() => {
          const el = this.$refs["customer-review-slider"];
          this.customerSlider = new Swiper(el, {
            slidesPerView: 2,
            slidesPerColumn: 2,
            slidesPerGroup: 2,
            spaceBetween: 30,
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
              dynamicBullets: true,
            },
            lazy: true,
            navigation: {
              nextEl: ".customer-review-section .slider-next",
              prevEl: ".customer-review-section .slider-prev",
            },
            on: {
              reachEnd() {
                setTimeout(() => {
                  self.sliderReachEndCallback("customer");
                }, 300);
              },
            },
          });
        });
      } catch (err) {
        this.$rollbar.error(err);
      }
    },
    sliderReachEndCallback(type) {
      if (type === "customer") {
        console.log("customer slider reach end of slides");
        this.$emit("customer-slider-on-reach-end");
      } else if (type === "blogger") {
        console.log("blogger slider reach end of slides");
        this.$emit("blogger-slider-on-reach-end");
      }
    },
    updateSlider(type) {
      if (type === "customer") {
        if (this.customerSlider) {
          console.log("updating customer slider");
          this.customerSlider.update();
        }
      } else if (type === "blogger") {
        if (this.bloggerSlider) {
          console.log("updating blogger slider");
          this.initBloggerReviewSlider();
          this.slideToLatest();
        }
      }
    },
    splitReview(reviews) {
      return reviews.slice(0, this.showedCustomerReviews);
    },
    slideToLatest() {
      setTimeout(() => {
        this.bloggerSlider.slideTo(this.bloggerSliderLastIndex - 1);
      }, 500);
    },
  },
};
</script>
<style lang="scss" scoped>
.customer-review-section {
  @apply bg-red-pink px-4 py-4;
}

.customer-review-item {
  height: calc((100% - 30px) / 2);
}

.blogger-review-slider {
  width: 90%;
}
@screen lg {
  .blogger-review-slider,
  .customer-review-slider {
    width: 90%;
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
</style>
