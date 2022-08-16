<template>
  <div>
    <template v-if="showSimilarRestaurant">
      <p class="py-4 text-lg">{{ $t("similarRestaurant") }}</p>
      <HomeSliderView
        class="restaurant-similar-slider"
        :is-loading="isLoading"
        :restaurants="restaurantSimilar"
        :style="isRestaurantSideMenuOpen ? 'z-index: -1' : ''"
        :align-center="false"
      />
    </template>
  </div>
</template>

<script>
import {
  initDummyRestaurant,
  getSimilarRestaurant,
} from "@/services/restaurant";
import { mapState, mapGetters } from "vuex";
import { isOpen as isRestaurantSideMenuOpen } from "@/components/Page Component/Restaurant/Restaurant-Side-Menu/restaurantSideMenu";
import HomeSliderView from "@/components/Page Component/Home/HomeSlider/HomeSliderView.vue";

export default {
  components: {
    HomeSliderView,
  },
  setup() {
    return {
      isRestaurantSideMenuOpen,
    };
  },
  data() {
    return {
      isLoading: true,
      realSimilarRestaurants: [],
      dummySimilarRestaurants: [],
    };
  },
  computed: {
    ...mapGetters(["baseUrlWithLang"]),
    ...mapState(["lang"]),
    ...mapState("restaurant", ["restaurantId"]),
    restaurantSimilar() {
      if (!this.isLoading) {
        return this.realSimilarRestaurants;
      }
      return this.dummySimilarRestaurants;
    },
    showSimilarRestaurant() {
      return this.restaurantSimilar.length > 0;
    },
  },
  watch: {
    restaurantId: {
      handler(val) {
        if (val) {
          this.getSimilarRestaurant();
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.initDummyRestaurant();
  },
  methods: {
    initDummyRestaurant() {
      // set dummy similar restaurant
      const dummyCount = this.isDesktop ? 5 : 3;
      for (let i = 0; i < dummyCount; i++) {
        this.dummySimilarRestaurants.push(initDummyRestaurant());
      }
    },
    async getSimilarRestaurant() {
      try {
        this.isLoading = true;
        const result = await getSimilarRestaurant(this.restaurantId);
        if (result.isSuccess) {
          this.realSimilarRestaurants = result.data;
          this.isLoading = false;
        } else {
          this.$alert.error(result.message);
        }
      } catch (err) {
        if (err.message) {
          this.$alert.error(err);
        }
      }
    },
  },
};
</script>
<i18n>
{
  "en": {
    "similarRestaurant": "Similar Restaurant"
  },
  "th": {
    "similarRestaurant": "ร้านอาหารใกล้เคียง"
  }
}
</i18n>

<style lang="scss">
.restaurant-similar-slider .restaurant-card-slider .swiper-button-next {
  right: -40px;
}
.restaurant-similar-slider .restaurant-card-slider .swiper-button-prev {
  left: -40px;
}
</style>
