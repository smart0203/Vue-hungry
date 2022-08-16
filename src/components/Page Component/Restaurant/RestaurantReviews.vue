<template>
  <div
    v-observe-visibility="{
      callback: visibilityChanged,
      once: true,
      throttle: 1000,
    }"
  >
    <div class="border-b">
      <div class="flex items-center mr-6 lg:w-4/12 lg:mx-auto">
        <!-- total score -->
        <div class="mx-3 text-center">
          <div class="reviews-total-score">
            <span class="text-3xl">{{ reviewsTotalScore }}</span>
          </div>
          <div class="mt-2 text-xs text-gray-700">
            {{
              $tc("rating", reviewsTotalCount, {
                count: $formatThousand(reviewsTotalCount),
              })
            }}
          </div>
        </div>
        <!-- stars and bar chart -->
        <div class="flex-auto ml-2">
          <div
            v-for="(stars, index) in starsCount"
            :key="index"
            class="flex items-center"
          >
            <RestaurantReviewStar
              :stars-font-size="''"
              :rating="parseInt(starsCount.length - index)"
              :margin-stars="1"
              :center-stars="true"
            />
            <div
              class="flex-auto mx-1 overflow-y-hidden bg-gray-300 bar-chart-outer"
            >
              <div
                class="h-full bg-red-dark shadow-1 bar-chart-inner"
                :style="`width:${(stars * 100) / reviewsTotalCount}%`"
              />
            </div>
            <span class="w-3 ml-1 text-xs text-right">{{
              $formatThousand(stars)
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- loading get blogger & customer review -->
    <template v-if="initialLoading">
      <div class="flex items-center justify-center w-full py-10">
        <div class="loader small"></div>
        <div class="ml-4 text-xs capitalize">{{ $t("pleaseWait") }}</div>
      </div>
    </template>

    <template v-else>
      <!-- blogger & customer review button toggle -->
      <div class="py-2 text-center">
        <!-- customer -->
        <div class="relative inline-block">
          <button
            v-if="reviews.length > 0"
            id="show-restaurant-customer-reviews-button"
            class="px-2 text-sm capitalize bg-white rounded-full cursor-pointer lg:text-xs"
            :class="
              reviewsType === 'customers'
                ? 'text-red-dark border border-red-dark'
                : 'text-gray-700'
            "
            @click="toggleReviews('customers')"
          >
            {{ $t("customers") }}
          </button>
          <!-- tooltip -->
          <!-- <div
            v-if="false && isShowBranchButton"
            class="review-all-branch-button"
          >
            <div>
              <div class="pretty p-svg p-round">
                <input type="checkbox" />
                <div class="flex items-center state p-danger">
                  <svg class="svg svg-icon" viewBox="0 0 20 20">
                    <path
                      d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
                      style="stroke: white; fill: white"
                    ></path>
                  </svg>
                  <label class="text-red-dark">All Outlets</label>
                </div>
              </div>
            </div>
          </div> -->
        </div>
        <!-- blogger -->
        <button
          v-if="bloggerReviews.length > 0"
          id="show-restaurant-blogger-reviews-button"
          class="px-4 text-sm capitalize bg-white cursor-pointer lg:text-xs"
          :class="
            reviewsType === 'bloggers'
              ? 'text-red-dark border-red-dark border rounded-full'
              : 'text-gray-700 border-none'
          "
          @click="toggleReviews('bloggers')"
        >
          {{ $t("bloggers") }}
        </button>
      </div>

      <!-- list of bloggers & customers reviews -->
      <div class="lg:my-2">
        <div v-if="reviewsType === 'bloggers'">
          <div
            v-for="review in bloggerReviews"
            :key="review.id"
            class="py-4 border-b"
          >
            <RestaurantReviewItem
              :id="review.id"
              class="py-3"
              :avatar="review.avatar"
              :date="formatDate(review.date)"
              :name="review.name"
              :photos="review.photos"
              :review="cutLongReview(review.excerpt)"
              :title="review.title"
              :link="review.link"
              reviews-type="bloggers"
              @on-link-click="goToLink(review.link, review.id)"
            />
          </div>
          <!-- load more button -->
          <div v-if="anyNextBloggerReviews" class="py-4 text-center">
            <button
              id="load-more-blogger-reviews-button"
              class="px-10 py-2 text-sm font-black capitalize border cursor-pointer rounded-xl text-red-dark border-red-dark br3"
              :class="loadingReviews ? 'bg-gray-100' : 'bg-white'"
              :disabled="loadingReviews"
              @click="lodaMoreBloggerReview"
            >
              {{ loadingBloggerReviews ? $t("loading") : $t("seeMoreReview") }}
            </button>
          </div>
        </div>
        <div v-if="reviewsType === 'customers'">
          <div v-for="review in reviews" :key="review.id" class="py-4 border-b">
            <RestaurantReviewItem
              :id="review.id"
              class="py-3"
              :avatar="review.avatar"
              :date="formatDate(review.date)"
              :name="review.name"
              :photos="review.photos"
              :review="review.review || ''"
              :title="review.title"
              :restaurant-name="review.restaurantName"
              :rating="review.rating"
              reviews-type="customers"
            />
          </div>
          <!-- load more button -->
          <div v-if="anyNextReviews" class="py-4 text-center">
            <button
              id="load-more-customer-reviews-button"
              class="px-10 py-2 text-sm font-black capitalize border cursor-pointer rounded-xl text-red-dark border-red-dark br3"
              :class="loadingReviews ? 'bg-gray-100' : 'bg-white'"
              :disabled="loadingReviews"
              @click="loadMoreReview"
            >
              {{ loadingReviews ? $t("loading") : $t("seeMoreReview") }}
            </button>
          </div>
        </div>
      </div>

      <!-- popup gallery -->
      <div id="user-review-gallery"></div>
    </template>
  </div>
</template>

<script>
import useLazyImport from "@/composable/useLazyImport";
import { mapState } from "vuex";
let timeOutInstance;

export default {
  components: {
    RestaurantReviewStar: () =>
      useLazyImport(() => import("./RestaurantReviewsStar")),
    RestaurantReviewItem: () =>
      useLazyImport(() => import("./RestaurantReviewItem")),
  },
  props: {
    reviewsTotalScore: {
      default: 0,
    },
    reviewsTotalCount: {
      default: 0,
    },
    starsCount: {
      type: Array,
    },
  },
  data() {
    return {
      isVisible: false,
      initialLoading: true,
      loadingBloggerReviews: false,
      loadingReviews: false,
      reviewsType: "customers",
      isShowBranchButton: false,
      restaurantId: 0,
      bar: {
        fiveStar: 0,
        fourStar: 0,
        threeStar: 0,
        twoStar: 0,
        oneStar: 0,
      },
      reviewGallery: [],
    };
  },
  computed: {
    ...mapState("restaurantReview", [
      "bloggerReviews",
      "reviews",
      "anyNextReviews",
      "anyNextBloggerReviews",
    ]),
    lang() {
      return this.$store.state.lang;
    },
  },
  watch: {
    isVisible(newVal) {
      if (newVal) {
        this.getInitialReview();
      }
    },
  },
  created() {
    this.restaurantId = this.$store.state.restaurant.restaurantId;
  },
  mounted() {
    this.generateBarChartData();
  },
  beforeDestroy() {
    clearTimeout(timeOutInstance);
  },
  methods: {
    visibilityChanged(isVisible) {
      if (isVisible) {
        this.isVisible = true;
      }
    },
    getInitialReview() {
      this.initialLoading = true;
      Promise.all([this.getBloggerReview(), this.getReview()])
        .then(() => {
          if (this.reviews.length) {
            this.reviewsType = "customers";
          } else if (
            this.reviews.length === 0 &&
            this.bloggerReviews.length > 0
          ) {
            this.reviewsType = "customers";
          }
          timeOutInstance = setTimeout(() => {
            this.initialLoading = false;
          }, 2000);
        })
        .catch((err) => {
          this.$rollbar.error(err);
        });
    },
    toggleReviews(type) {
      this.reviewsType = type;
      if (this.reviewsType === "bloggers") {
        this.isShowBranchButton = false;
      } else if (this.reviewsType === "customers" && type === "customers") {
        this.isShowBranchButton = !this.isShowBranchButton;
      } else {
        this.isShowBranchButton = true;
      }
    },
    lodaMoreBloggerReview() {
      this.$track("MORE_BLOGGER_REVIEW_TAPPED", {
        restaurantId: this.restaurantId,
      });
      this.fetchMoreBloggerReview();
    },
    loadMoreReview() {
      this.$track("MORE_REVIEW_TAPPED", {
        restaurantId: this.restaurantId,
      });
      this.fetchMoreReview();
    },
    fetchMoreBloggerReview() {
      this.loadingBloggerReviews = true;
      this.$store
        .dispatch("restaurantReview/lodaMoreBloggerReview")
        .catch((err) => {
          this.$alert.error(err);
        })
        .finally(() => (this.loadingBloggerReviews = false));
    },
    fetchMoreReview() {
      this.loadingReviews = true;
      this.$store
        .dispatch("restaurantReview/loadMoreReview")
        .catch((err) => {
          this.$alert.error(err);
        })
        .finally(() => (this.loadingReviews = false));
    },
    goToLink(link, bloggerReviewId) {
      this.$track("BLOGGER_REVIEW_TAPPED", {
        bloggerReviewId: bloggerReviewId,
        restaurantId: this.restaurantId,
      });
      window.open(link, "_blank");
    },
    cutLongReview(review) {
      if (!review) {
        return "";
      }
      if (review.length <= 500) {
        return review;
      }
      const shortReview = review.substring(0, 500);
      return `${shortReview} ...`;
    },
    formatDate(date) {
      return this.$dayjs(date).locale(this.lang).format("D MMM YYYY");
    },
    getBloggerReview() {
      return new Promise((resolve, reject) => {
        if (this.bloggerReviews.length !== 0) {
          resolve();
          return;
        }
        this.$store
          .dispatch("restaurantReview/getBloggerReview")
          .then(() => {
            resolve();
          })
          .catch((errMessage) => {
            if (errMessage) {
              this.$alert.error(errMessage);
            }
            reject();
          });
      });
    },
    getReview() {
      return new Promise((resolve, reject) => {
        if (this.reviews.length !== 0) {
          resolve();
          return;
        }
        this.$store
          .dispatch("restaurantReview/getReview")
          .then(() => {
            resolve();
          })
          .catch((errMessage) => {
            if (errMessage) {
              this.$alert.error(errMessage);
            }
            reject();
          });
      });
    },
    generateBarChartData() {
      const total = 100;

      this.bar.fiveStar = (70 * 100) / total;
      this.bar.fourStar = (30 * 100) / total;
      this.bar.threeStar = (10 * 100) / total;
      this.bar.twoStar = (5 * 100) / total;
      this.bar.oneStar = (5 * 100) / total;
    },
  },
};
</script>

<style lang="scss" scoped>
.review-all-branch-button {
  position: absolute;
  left: 0;
  top: 24px;
  width: 100%;
  height: 30px;
  border-radius: 8px;
  background: #fff;
  opacity: 0.95;
  box-shadow: -1px 2px 25px rgba(0, 0, 0, 0.16);

  @apply text-xs flex items-center justify-center;
}

.reviews-total-score {
  margin: auto;
  position: relative;
  width: 70px;
  height: 70px;
  border: 4px solid var(--main-red);
  border-radius: 99%;
}

.reviews-total-score span {
  font-weight: bold;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.bar-chart-outer {
  height: 10px;
}
</style>
<i18n>
{
  "en": {
    "rating":"{count} Reviews"
  },
  "th": {
    "rating": "{count} รีวิว"
  }
}
</i18n>
