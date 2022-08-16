<template>
  <div>
    <template v-if="showRestaurantsAround">
      <p class="py-4 text-lg">{{ $t("restaurantAround") }}</p>
      <HomeSliderView
        class="restaurant-around-slider"
        :is-loading="isLoading"
        :restaurants="restaurantAround"
        :style="isRestaurantSideMenuOpen ? 'z-index: -1' : ''"
        :align-center="false"
      />
    </template>
  </div>
</template>

<script>
import {
  initDummyRestaurant,
  getRestaurantAround,
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
      realRestaurantsAround: [],
      dummyRestaurantsAround: [],
    };
  },
  computed: {
    ...mapGetters(["baseUrlWithLang"]),
    ...mapState(["lang"]),
    ...mapState("restaurant", ["restaurantId"]),
    restaurantAround() {
      if (!this.isLoading) {
        return this.realRestaurantsAround;
      }
      return this.dummyRestaurantsAround;
    },
    showRestaurantsAround() {
      return this.restaurantAround.length > 0;
    },
  },
  watch: {
    restaurantId: {
      handler(val) {
        if (val) {
          this.getRestaurantsAround();
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
      const dummyCount = this.isDesktop ? 5 : 3;
      for (let i = 0; i < dummyCount; i++) {
        this.dummyRestaurantsAround.push(initDummyRestaurant());
      }
    },
    async getRestaurantsAround() {
      try {
        this.isLoading = true;
        const result = await getRestaurantAround(this.restaurantId);
        if (result.isSuccess) {
          this.realRestaurantsAround = result.data;
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
    "restaurantAround": "Restaurants Nearby"
  },
  "th": {
    "restaurantAround": "ร้านอาหารใกล้เคียง"
  }
}
</i18n>
<style lang="scss">
.restaurant-around-slider .restaurant-card-slider .swiper-button-next {
  right: -40px;
}
.restaurant-around-slider .restaurant-card-slider .swiper-button-prev {
  left: -40px;
}
</style>
