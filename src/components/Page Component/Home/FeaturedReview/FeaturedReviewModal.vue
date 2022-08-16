<template>
  <modal name="featured-review-modal" height="auto" scrollable adaptive>
    <div>
      <div class="fixed z-10 flex justify-between w-full px-2 py-4 bg-white">
        <div class="font-black text-red-dark">
          {{ $t("customersReviews") }}
        </div>
        <img
          class="flex-shrink-0 cursor-pointer"
          src="@/assets/icon-close-black.png"
          loading="lazy"
          alt="close icon"
          style="width: 15px; height: 15px"
          @click="hideModal"
        />
      </div>
      <InfiniteScroll
        class="pt-16"
        :throttle="500"
        :visible-callback="loadMore"
      >
        <div
          v-for="(review, key) in customerReviews"
          :key="review.id + key"
          class="mr-3"
        >
          <FeaturedReviewCustomer
            class="mb-4"
            :is-loading="initialLoading"
            :customer-review="review"
          />
        </div>
        <template #activator>
          <div class="flex items-center justify-center my-4 text-center">
            <button
              class="flex px-4 py-2 text-sm capitalize border rounded-lg text-red-dark border-red-dark"
            >
              <span class="mr-2 loader small"></span>
              {{ $t("pleaseWait") }}
            </button>
          </div>
        </template>
      </InfiniteScroll>
    </div>
  </modal>
</template>

<script>
import useLazyImport from "@/composable/useLazyImport";
import axios from "@/lib/myAjax";

export default {
  components: {
    InfiniteScroll: () =>
      useLazyImport(() =>
        import("@/components/Shared/Renderless/InfiniteScroll")
      ),
    FeaturedReviewCustomer: () =>
      useLazyImport(() => import("./FeaturedReviewCustomer")),
  },
  data() {
    return {
      pageSize: 10,
      pageNumber: 1,
      initialLoading: true,
      loadMoreLoading: false,
      customerReviews: [],
    };
  },
  async created() {
    if (this.customerReviews.length === 0) {
      this.initialLoading = true;
      this.initDummyData();
      this.customerReviews = await this.getReviews("user", this.pageSize, 1);
      this.initialLoading = false;
    }
  },
  methods: {
    hideModal() {
      this.$modal.hide("featured-review-modal");
    },
    async loadMore(isVisible) {
      if (isVisible) {
        this.loadMoreLoading = true;
        this.pageNumber += 1;
        const result = await this.getReviews(
          "user",
          this.pageSize,
          this.pageNumber
        );
        this.customerReviews = this.customerReviews.concat(result);
        this.loadMoreLoading = false;
      }
    },
    async getReviews(reviewType, pageSize, pageNumber) {
      try {
        const request = await axios({
          method: "get",
          url: `/featured_reviews.json?review_type=${reviewType}&per_page=${pageSize}&page=${pageNumber}`,
        });
        const reqData = request.data;
        if (reqData) {
          if (reqData.data.length > 0 && reqData.success === true) {
            const result = reqData.data;
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
              return {
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
            });
            return reviewData;
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
    initDummyData() {
      for (let index = 0; index < 6; index++) {
        this.customerReviews.push({
          id: Math.random().toString(36),
          rating: 0,
          restaurantLink: "",
          restaurantName: "",
          restaurantId: 0,
          avatar: "",
          name: "",
          review: "",
          title: "",
          date: this.$dayjs().format("DD-MM-YYYY"),
          photos: ["", "", ""],
        });
      }
    },
  },
};
</script>
