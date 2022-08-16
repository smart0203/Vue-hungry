<template>
  <div>
    <div>
      <div ref="featured-slider" class="w-full swiper">
        <div class="flex items-center justify-center mb-8 swiper-wrapper">
          <div class="swiper-slide featured-item-left">
            <RestaurantCard
              :is-lazy-load-main-image="false"
              :is-loading="isLoading"
              :link="leftItem.link.value"
              :image="leftItem.imageCoverUrl.original || ''"
              :name="leftItem.name"
              :available-package-type="leftItem.availablePackageTypes"
              :cuisine="leftItem.primaryCuisine.name"
              :location="leftItem.primaryLocation.name"
              :review-score="leftItem.reviewsScore"
              :review-count="leftItem.reviewsCount"
              :package-price="leftItem.price.amount"
              :package-pricing="leftItem.pricingType"
              :total-locations="leftItem.totalLocations"
              :any-dine-in-package="leftItem.anyDineInPackage"
              :any-delivery-package="leftItem.anyDeliveryPackage"
              :any-xperience-package="leftItem.anyXperiencePackage"
              @on-link-clicked="track(leftItemIndex, leftItem)"
            />
          </div>
          <div class="flex swiper-slide featured-item-center">
            <RestaurantCardBig
              :is-lazy-load-main-image="false"
              class="shadow"
              :is-loading="isLoading"
              :link="centerItem.link.value"
              :img="centerItem.imageCoverUrl.original || ''"
              :name="centerItem.name"
              :price="centerItem.price.amount"
              :pricing-type="centerItem.pricingType"
              :description="centerItem.description"
              :cuisine="centerItem.primaryCuisine.name"
              :location="centerItem.primaryLocation.name"
              :total-location="centerItem.totalLocations"
              :any-dine-in-package="centerItem.anyDineInPackage"
              :any-delivery-package="centerItem.anyDeliveryPackage"
              :any-xperience-package="centerItem.anyXperiencePackage"
              :review-score="centerItem.reviewsScore"
              :review-count="centerItem.reviewsCount"
              @on-link-clicked="track(centerItemIndex, centerItem)"
            />
          </div>
          <div class="swiper-slide featured-item-right">
            <RestaurantCard
              :is-lazy-load-main-image="false"
              :is-loading="isLoading"
              :link="rightItem.link.value"
              :image="rightItem.imageCoverUrl.original || ''"
              :name="rightItem.name"
              :available-package-type="rightItem.availablePackageTypes"
              :cuisine="rightItem.primaryCuisine.name"
              :location="rightItem.primaryLocation.name"
              :review-score="rightItem.reviewsScore"
              :review-count="rightItem.reviewsCount"
              :package-price="rightItem.price.amount"
              :package-pricing="rightItem.pricingType"
              :total-locations="rightItem.totalLocations"
              :any-dine-in-package="rightItem.anyDineInPackage"
              :any-delivery-package="rightItem.anyDeliveryPackage"
              :any-xperience-package="rightItem.anyXperiencePackage"
              @on-link-clicked="track(rightItemIndex, rightItem)"
            />
          </div>
        </div>
        <!-- Add Arrows -->
        <div class="slider-next text-red-dark" @click="showNext">
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
        <div class="slider-prev text-red-dark" @click="showPrev">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
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
      </div>
    </div>
  </div>
</template>

<script>
import throttle from "lodash-es/throttle";
import RestaurantCard from "@/components/Shared/RestaurantCard/RestaurantCard.vue";
import RestaurantCardBig from "@/components/Shared/RestaurantCardBig";
import { Swiper, Navigation, Pagination } from "swiper";
Swiper.use([Navigation, Pagination]);

export default {
  components: {
    RestaurantCard,
    RestaurantCardBig,
  },
  props: {
    isLoading: {
      required: true,
      type: Boolean,
    },
    restaurantFeatured: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      touchStartX: 0,
      touchEndX: 0,
      leftItemIndex: 0,
      centerItemIndex: 1,
      rightItemIndex: 2,
    };
  },
  computed: {
    centerItem() {
      return this.restaurantFeatured[this.centerItemIndex];
    },
    leftItem() {
      return this.restaurantFeatured[this.leftItemIndex];
    },
    rightItem() {
      return this.restaurantFeatured[this.rightItemIndex];
    },
  },
  watch: {
    isLoading: {
      handler: "initSlider",
      immediate: true,
    },
  },
  methods: {
    async initSlider() {
      try {
        const el = this.$refs["featured-slider"];
        const self = this;
        new Swiper(el, {
          lazy: true,
          slidesPerView: "auto",
          navigation: {
            nextEl: ".slider-next",
            prevEl: ".slider-prev",
          },
          on: {
            touchStart(event) {
              self.touchStartX = event.screenX;
            },
            touchEnd(event) {
              self.touchEndX = event.screenX;
              self.handle();
            },
          },
        });
      } catch (err) {
        this.$rollbar.error(err);
      }
    },
    handle: throttle(function () {
      if (this.touchEndX < this.touchStartX) {
        this.showNext();
      }
      if (this.touchEndX > this.touchStartX) {
        this.showPrev();
      }
    }, 500),
    showPrev() {
      const totalItem = this.restaurantFeatured.length - 1;

      this.leftItemIndex =
        this.leftItemIndex > 0
          ? this.leftItemIndex - 1
          : totalItem - this.leftItemIndex;
      this.centerItemIndex =
        this.centerItemIndex > 0
          ? this.centerItemIndex - 1
          : totalItem - this.centerItemIndex;
      this.rightItemIndex =
        this.rightItemIndex > 0
          ? this.rightItemIndex - 1
          : totalItem - this.rightItemIndex;
    },
    showNext() {
      const totalItem = this.restaurantFeatured.length - 1;

      this.leftItemIndex =
        this.leftItemIndex < totalItem
          ? this.leftItemIndex + 1
          : totalItem - this.leftItemIndex;
      this.centerItemIndex =
        this.centerItemIndex < totalItem
          ? this.centerItemIndex + 1
          : totalItem - this.centerItemIndex;
      this.rightItemIndex =
        this.rightItemIndex < totalItem
          ? this.rightItemIndex + 1
          : totalItem - this.rightItemIndex;
    },
    track(index, restaurant) {
      this.$track("CLICK_FEATURED_RESTAURANTS_SECTION", {
        restaurantSliderIndex: index,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
      });
      window.location = restaurant.link.value;
    },
  },
};
</script>
