<template>
  <GroupLanding
    :any-remaining-restaurants="anyRemainingRestaurants"
    :blogger-reviews="bloggerReviews"
    :customer-reviews="customerReviews"
    :description="description"
    :footer-description="footerDescription"
    :get-more-restaurant-handler="getMoreRestaurantsList"
    :is-loading-get-blogger-reviews="bloggerReviewsLoading"
    :is-loading-get-customer-reviews="customerReviewsLoading"
    :is-loading-get-data="isLoadingGetLandingData"
    :is-loading-get-restaurants="isLoadingGetRestaurants"
    :photos="mainPhotos"
    :restaurants="restaurants"
    :title="title"
    :total-restaurants="totalRestaurants"
  />
</template>

<script>
import GroupLanding from "@/components/Page Component/GroupLanding/GroupLanding.vue";
import {
  bloggerReview,
  customerReview,
} from "@/components/Page Component/GroupLanding/review";
import groupLanding from "@/components/Page Component/GroupLanding/groupLanding";
export default {
  components: {
    GroupLanding,
  },
  props: {
    groupLandingId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { groupLandingId } = props;
    const cleanGroupLandingId = groupLandingId.replace(".html", "");
    const {
      desktopPhotos,
      mobilePhotos,
      title,
      description,
      restaurants,
      totalRestaurants,
      getGroupLandingData,
      isLoadingGetLandingData,
      anyRemainingRestaurants,
      getMoreRestaurantsList,
      isLoadingGetRestaurants,
      footerDescription,
      isGroupLandingFound,
    } = groupLanding(cleanGroupLandingId);
    const { reviews: bloggerReviews, isLoading: bloggerReviewsLoading } =
      bloggerReview(cleanGroupLandingId, isGroupLandingFound);
    const {
      reviews: customerReviews,
      isLoading: customerReviewsLoading,
      loadMoreReview: loadMoreCustomerReview,
      isShowLoadMore: isShowLoadMoreCustomerReview,
    } = customerReview(cleanGroupLandingId, isGroupLandingFound);
    return {
      title,
      description,
      isLoadingGetLandingData,
      isGroupLandingFound,
      mobilePhotos,
      desktopPhotos,
      getGroupLandingData,
      restaurants,
      totalRestaurants,
      getMoreRestaurantsList,
      isLoadingGetRestaurants,
      anyRemainingRestaurants,
      footerDescription,
      // blogger reviews
      bloggerReviews,
      bloggerReviewsLoading,
      // customer reviews
      customerReviews,
      customerReviewsLoading,
      loadMoreCustomerReview,
      isShowLoadMoreCustomerReview,
    };
  },
  computed: {
    mainPhotos() {
      if (this.isDesktop) {
        return this.desktopPhotos;
      }
      return this.mobilePhotos;
    },
  },
  mounted() {
    this.getGroupLandingData();
  },
};
</script>
