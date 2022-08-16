<template>
  <div>
    <div>
      <div ref="featured-slider" class="w-full swiper">
        <div class="flex items-center mb-10 swiper-wrapper">
          <div
            v-for="(restaurant, index) in restaurantFeatured"
            :key="restaurant.id"
            class="flex w-full swiper-slide featured-item-center"
            style="min-height: 110px"
          >
            <RestaurantCardBig
              class="w-11/12 mx-4"
              :link="restaurant.link.value"
              :is-loading="isLoading"
              :img="restaurant.imageCoverUrl.original || ''"
              :name="restaurant.name"
              :price="restaurant.price.amount"
              :pricing-type="restaurant.pricingType"
              :description="restaurant.description"
              :cuisine="restaurant.primaryCuisine.name"
              :location="restaurant.primaryLocation.name"
              :total-location="restaurant.totalLocations"
              :any-dine-in-package="restaurant.anyDineInPackage"
              :any-delivery-package="restaurant.anyDeliveryPackage"
              :any-xperience-package="restaurant.anyXperiencePackage"
              :review-score="restaurant.reviewsScore"
              :review-count="restaurant.reviewsCount"
              @on-link-clicked="track(index, restaurant)"
            />
          </div>
        </div>
        <!-- pagination -->
        <div class="swiper-pagination"></div>
      </div>
    </div>
  </div>
</template>

<script>
import RestaurantCardBig from "@/components/Shared/RestaurantCardBig";
import { Swiper, Navigation, Pagination } from "swiper";
Swiper.use([Navigation, Pagination]);

export default {
  components: {
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
  watch: {
    restaurantFeatured: {
      handler: "initSlider",
      immediate: true,
    },
  },
  methods: {
    async initSlider() {
      try {
        if (this.restaurantFeatured.length > 3) {
          this.$nextTick(() => {
            const el = this.$refs["featured-slider"];
            new Swiper(el, {
              lazy: true,
              spaceBetween: 100,
              pagination: {
                el: ".swiper-pagination",
                clickable: true,
                dynamicBullets: false,
              },
            });
          });
        }
      } catch (err) {
        this.$rollbar.error(err);
      }
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
