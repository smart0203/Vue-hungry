<template>
  <div class="min-h-screen">
    <!-- slider -->
    <GroupLandingImageSlider
      v-if="photos.length"
      :photos="photos"
      :is-loading="isLoadingGetData"
    />
    <div class="">
      <!-- title -->
      <h1
        class="mt-8 text-2xl font-black text-center lg:text-4xl max-width"
        :class="
          isLoadingGetData
            ? 'bg-gray-300 animate-pulse h-12 w-6/12 mx-auto text-gray-300'
            : 'mx-4'
        "
      >
        {{ title }}
      </h1>
      <!-- description -->
      <h2
        class="my-8 text-xs text-center lg:text-sm max-width"
        :class="
          isLoadingGetData
            ? 'bg-gray-300 animate-pulse h-8 w-8/12 mx-auto text-gray-300'
            : 'mx-3'
        "
        v-html="description"
      ></h2>

      <div
        v-if="!isLoadingGetData && totalRestaurants > 0"
        class="h-6 my-4 text-center border-b lg:h-8 text-red-dark border-red-dark max-width"
      >
        <h3
          class="inline-block p-2 pb-0 text-base font-black capitalize bg-white lg:text-xl"
        >
          {{ $t("viewAllRestaurants", { count: totalRestaurants }) }}
        </h3>
      </div>

      <div class="max-width">
        <div class="mx-auto lg:w-10/12">
          <div class="flex flex-wrap items-center">
            <div
              v-for="restaurant in restaurants"
              :key="restaurant.id"
              class="w-1/2 px-2 pb-6 lg:pr-4 sm:w-1/3"
            >
              <RestaurantCard
                class="landing-restaurant"
                :is-lazy-load-main-image="true"
                :is-loading="isLoadingGetData"
                :restaurant="restaurant"
                :image-width-desktop="333"
                :image-height-desktop="0"
                :image-width-mobile="'half-screen'"
                :image-height-mobile="0"
                @on-link-clicked="goToRestaurantLink(restaurant)"
              />
            </div>
          </div>
        </div>
        <div
          v-if="anyRemainingRestaurants && !isLoadingGetData"
          class="flex justify-center w-full my-4"
        >
          <button
            class="flex items-center px-2 py-1 text-white capitalize rounded-lg lg:py-2 lg:px-6 bg-red-dark hover:bg-red-light disabled:opacity-50"
            :disabled="isLoadingGetRestaurants"
            @click="getMoreRestaurantHandler"
          >
            <div
              v-if="isLoadingGetRestaurants"
              class="mr-2 loader white small"
            ></div>
            <span>
              {{ isLoadingGetRestaurants ? $t("pleaseWait") : $t("showMore") }}
            </span>
          </button>
        </div>
      </div>

      <!-- customer review section -->
      <div v-if="customerReviews.length" class="py-4 bg-red-pink">
        <GroupLandingCustomerReviews
          :is-loading="isLoadingGetCustomerReviews"
          :customer-reviews="customerReviews"
        />
      </div>

      <!-- blogger review section -->
      <div v-if="bloggerReviews.length">
        <GroupLandingBloggerReviews
          :is-loading="isLoadingGetBloggerReviews"
          :blogger-reviews="bloggerReviews"
        />
      </div>

      <div v-if="footerDescription" class="my-6 max-width">
        <h3 class="mx-2 mb-4 text-base font-black lg:text-lg lg:mx-0">
          Restaurant Description
        </h3>
        <div
          class="mx-2 my-4 text-xs lg:mx-3 lg:my-8 lg:mx-0 lg:text-sm"
          v-html="footerDescription"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import RestaurantCard from "@/components/Shared/RestaurantCard/RestaurantCard.vue";
import GroupLandingImageSlider from "@/components/Page Component/GroupLanding/GroupLandingImageSlider.vue";
import "@/components/Page Component/Home/FeaturedReview/FeaturedReview.scss";
import GroupLandingCustomerReviews from "@/components/Page Component/GroupLanding/GroupLandingCustomerReviews.vue";
import GroupLandingBloggerReviews from "@/components/Page Component/GroupLanding/GroupLandingBloggerReviews.vue";

export default {
  components: {
    RestaurantCard,
    GroupLandingImageSlider,
    GroupLandingCustomerReviews,
    GroupLandingBloggerReviews,
  },
  props: {
    isLoadingGetData: {
      type: Boolean,
      default() {
        return false;
      },
    },
    isLoadingGetRestaurants: {
      type: Boolean,
      default() {
        return false;
      },
    },
    isLoadingGetCustomerReviews: {
      type: Boolean,
      default() {
        return false;
      },
    },
    isLoadingGetBloggerReviews: {
      type: Boolean,
      default() {
        return false;
      },
    },
    title: {
      type: String,
      default() {
        return "";
      },
    },
    description: {
      type: String,
      default() {
        return "";
      },
    },
    footerDescription: {
      type: String,
      default() {
        return "";
      },
    },
    photos: {
      type: Array,
      default() {
        return [];
      },
    },
    totalRestaurants: {
      type: Number,
      default() {
        return 0;
      },
    },
    restaurants: {
      type: Array,
      default() {
        return [];
      },
    },
    anyRemainingRestaurants: {
      type: Boolean,
      required: true,
    },
    getMoreRestaurantHandler: {
      type: Function,
      required: true,
    },
    customerReviews: {
      type: Array,
      default() {
        return [];
      },
    },
    bloggerReviews: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    goToRestaurantLink(restaurant) {
      setTimeout(() => {
        restaurant.goToLink();
      }, 500);
    },
  },
};
</script>

<style lang="scss">
.landing-restaurant .restaurant-card {
  width: 100%;
}

@screen md {
  .landing-restaurant .restaurant-card {
    .dine-in-icon,
    .delivery-icon {
      width: 15px;
      height: 15px;
    }

    .cuisine-icon,
    .location-icon,
    .xperience-icon {
      width: 15px;
    }
  }
}

@screen lg {
  .landing-restaurant .restaurant-card {
    width: 100%;

    @apply mr-3;

    .restaurant-name {
      @apply text-base;
    }

    .restaurant-image {
      width: 100%;
    }

    .pricing {
      @apply text-xl leading-4;
    }

    .restaurant-rating {
      min-width: 70px;
      height: 25px;
    }

    .restaurant-rating span,
    .restaurant-rating i {
      @apply text-xl mr-1;
    }

    .restaurant-rating-count {
      @apply text-2xs;
    }

    .dine-in-icon,
    .delivery-icon {
      width: 20px;
      height: 20px;
    }

    .cuisine-icon,
    .location-icon,
    .xperience-icon {
      width: 20px;
    }

    .cuisine-label,
    .location-label {
      @apply text-sm;
    }
  }
}
</style>
