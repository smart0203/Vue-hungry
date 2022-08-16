<template>
  <div v-observe-visibility="{ callback: visibilityChanged, once: true }">
    <FeaturedReviewView
      :blogger-reviews-loading="bloggerReviewsLoading"
      :customer-reviews-loading="customerReviewsLoading"
      :blogger-reviews="bloggerReviews"
      :customer-reviews="customerReviews"
      @customer-slider-on-reach-end="fetchMoreReviews('customer')"
      @blogger-slider-on-reach-end="fetchMoreReviews('blogger')"
      @customer-review-mobile-on-load-more="openFeaturedReviewModal"
    />
    <component :is="FeaturedReviewModal"></component>
  </div>
</template>

<script>
import axios from "@/lib/myAjax";
import { mapGetters } from "vuex";
import FeaturedReviewView from "./FeaturedReviewView";
import { selectedCityId } from "@/composable/selectCity";
import { nanoid } from "nanoid";
import debounce from "lodash-es/debounce";

export default {
  components: {
    FeaturedReviewView,
  },
  setup() {
    return {
      selectedCityId,
    };
  },
  data() {
    return {
      FeaturedReviewModal: "",
      customerReviewsPagination: {
        pageSize: 10,
        pageNumber: 1,
      },
      bloggerReviewsPagination: {
        pageSize: 10,
        pageNumber: 1,
      },
      bloggerReviewsLoading: {
        initialLoading: true,
        loadMoreLoading: false,
      },
      customerReviewsLoading: {
        initialLoading: true,
        loadMoreLoading: false,
      },
      bloggerReviews: [],
      customerReviews: [],
    };
  },
  computed: {
    ...mapGetters(["baseUrlWithLang"]),
  },
  watch: {
    selectedCityId() {
      this.debounceOnCityChange();
    },
  },
  created() {
    this.debounceOnCityChange = debounce(this.onCityIdChange, 500);
  },
  mounted() {
    this.initDummyData();
  },

  methods: {
    visibilityChanged(visibility) {
      if (visibility === true) {
        this.fetchInitialReview("customer");
        this.fetchInitialReview("blogger");
      }
    },
    initDummyData() {
      for (let index = 0; index <= 4; index++) {
        const dummyBloggerReviews = {
          id: Math.random().toString(36),
          avatar: "",
          name: "",
          excerpt: "",
          review: "",
          title: "",
          link: "",
          date: this.$dayjs().format("DD-MM-YYYY"),
          photos: ["", "", ""],
          restaurantName: "",
          restaurantId: 0,
          restaurantLink: "/",
        };
        this.bloggerReviews.push(Object.freeze(dummyBloggerReviews));

        const dummyCustomerReviews = {
          id: Math.random().toString(36),
          rating: 0,
          restaurantLink: "/",
          restaurantName: "",
          restaurantId: 0,
          avatar: "",
          name: "",
          review: "",
          title: "",
          date: this.$dayjs().format("DD-MM-YYYY"),
          photos: ["", "", ""],
        };
        this.customerReviews.push(Object.freeze(dummyCustomerReviews));
      }
    },
    async getBloggersReviews() {
      const result = await this.getReviews(
        "blogger",
        this.bloggerReviewsPagination.pageSize,
        this.bloggerReviewsPagination.pageNumber
      );
      if (result) {
        const reviewData = result.map((review) => {
          const reviewRelationship = review.relationships;
          const reviewAttr = review.attributes;

          const restaurantLink = () => {
            const restaurantSlug = reviewRelationship.restaurant?.data?.slug;
            const restaurantBranchId = reviewRelationship.branch?.data?.id;

            if (restaurantSlug) {
              return `/restaurants/${restaurantSlug}?locale=${this.currentLang}`;
            } else if (restaurantBranchId) {
              return `/restaurants/search?branch_id=${restaurantBranchId}&locale=${this.currentLang}`;
            }
            this.$rollbar.error("Invalid restaurant slug / branch id", {
              review,
            });
            return "/";
          };

          const restaurantName = reviewAttr.restaurantId
            ? review.relationships.restaurant?.data?.name
            : null;

          const restaurantNameBranch = !review.attributes.restaurantId
            ? review.relationships.branch?.data?.name
            : null;

          const mappedReview = {
            id: review.id,
            avatar: reviewAttr.blogger.avatar.original,
            name: reviewAttr.blogger.name,
            excerpt: reviewAttr.excerpt,
            review: reviewAttr.review,
            title: reviewAttr.title,
            link: reviewAttr.bloggerLink || review.attributes.link,
            date: reviewAttr.createdAt,
            photos: reviewAttr.photos,
            restaurantName: restaurantName || restaurantNameBranch,
            restaurantId: reviewAttr.restaurantId,
            restaurantLink: restaurantLink(),
          };
          return Object.freeze(mappedReview);
        });
        return reviewData;
      }
      return [];
    },
    async getCustomerReview() {
      const result = await this.getReviews(
        "user",
        this.customerReviewsPagination.pageSize,
        this.customerReviewsPagination.pageNumber
      );
      if (result) {
        const reviewData = result.map((review) => {
          let restaurantId = "";
          let restaurantName = "";
          let restaurantLink = "";
          if (review.attributes.restaurant) {
            restaurantId = review.attributes.restaurant.id;
            restaurantName = review.attributes.restaurant.name;
            restaurantLink = `/restaurants/${review.attributes.restaurant.link}?locale=${this.currentLang}`;
          }
          const avatar = review.attributes.userAvatar
            ? review.attributes.userAvatar.original
            : review.attributes.avatar;
          const mappedReview = {
            id: review.id,
            rating: review.attributes.rating,
            restaurantId: restaurantId,
            restaurantName: restaurantName,
            restaurantLink: restaurantLink,
            avatar: avatar,
            name: review.attributes.userName,
            review: review.attributes.review,
            title: "",
            date: review.attributes.createdAt,
            photos: review.attributes.pictures,
          };
          return Object.freeze(mappedReview);
        });
        return reviewData;
      }
      return [];
    },
    async getReviews(reviewType, pageSize, pageNumber) {
      try {
        const request = await axios({
          method: "get",
          url: `/featured_reviews.json?review_type=${reviewType}&per_page=${pageSize}&page=${pageNumber}&city_id=${this.selectedCityId}`,
        });
        const reqData = request.data;
        if (reqData) {
          if (reqData.data.length > 0 && reqData.success === true) {
            return reqData.data;
          } else {
            this.$alert.error(reqData.message);
            this.$rollbar.error(reqData.message);
          }
        } else {
          this.$alert.error("Oops, something went wrong, failed get reviews");
          this.$rollbar.error(request);
        }
      } catch (err) {
        if (!err.dontReport) {
          this.$alert.error("Oops, something went wrong, failed get reviews");
          this.$rollbar.error(err);
        }
      }
    },
    async fetchInitialReview(reviewType) {
      if (reviewType === "customer") {
        this.customerReviewsLoading.initialLoading = true;
        this.customerReviews = await this.getCustomerReview();
        this.customerReviewsLoading.initialLoading = false;
      } else if (reviewType === "blogger") {
        this.bloggerReviewsLoading.initialLoading = true;
        this.bloggerReviews = await this.getBloggersReviews();
        this.bloggerReviewsLoading.initialLoading = false;
      }
    },
    async fetchMoreReviews(reviewType) {
      if (reviewType === "customer") {
        this.customerReviewsLoading.loadMoreLoading = true;
        this.customerReviewsPagination.pageNumber += 1;
        const result = await this.getCustomerReview();
        this.customerReviews = this.customerReviews.concat(result);
        this.customerReviewsLoading.loadMoreLoading = false;
      } else if (reviewType === "blogger") {
        this.bloggerReviewsLoading.loadMoreLoading = true;
        this.bloggerReviewsPagination.pageNumber += 1;
        const result = await this.getBloggersReviews();
        this.bloggerReviews = this.bloggerReviews.concat(result);
        this.bloggerReviewsLoading.loadMoreLoading = false;
      }
    },
    async openFeaturedReviewModal() {
      if (!this.FeaturedReviewModal) {
        let moduleRequest = await this.$useLazyImport(() =>
          import(
            /* webpackChunkName: "FeaturedReviewModal" */ "./FeaturedReviewModal"
          )
        );
        this.FeaturedReviewModal = moduleRequest.default;
        this.$nextTick(() => {
          this.$modal.show("featured-review-modal");
        });
      } else {
        this.$modal.show("featured-review-modal");
      }
    },
    async onCityIdChange() {
      this.viewId = nanoid(3);
      this.bloggerReviewsLoading.initialLoading = true;
      this.customerReviewsLoading.initialLoading = true;
      this.bloggerReviewsPagination.pageNumber = 1;
      this.customerReviewsPagination.pageNumber = 1;
      // save current review array to temp for later use
      const bloggerReviewsTemp = [...this.bloggerReviews];
      const customerReviewsTemp = [...this.customerReviews];
      await this.fetchInitialReview("customer");
      await this.fetchInitialReview("blogger");
      if (this.customerReviews.length === 0) {
        // if after fetch API again and restaurant still empty then set to temp
        this.customerReviews = customerReviewsTemp;
      }
      if (this.bloggerReviews.length === 0) {
        // if after fetch API again and restaurant still empty then set to temp
        this.bloggerReviews = bloggerReviewsTemp;
      }
    },
  },
};
</script>
