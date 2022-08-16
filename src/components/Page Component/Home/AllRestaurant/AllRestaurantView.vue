<template>
  <div>
    <div
      class="section-title"
      :class="
        isLoading
          ? 'bg-gray-300  h-3 lg:h-6  w-5/12 lg:mx-auto mr-auto text-gray-300'
          : null
      "
    >
      <slot></slot>
    </div>

    <div class="flex flex-wrap justify-around lg:justify-start">
      <div
        v-for="(restaurant, index) in restaurants"
        :key="genereateLoopkey(restaurant, index)"
        class="w-full lg:w-1/5 md:w-1/2"
      >
        <RestaurantCard
          v-if="isDesktop || isTablet"
          class="md:mr-3"
          :is-lazy-load-main-image="true"
          :is-loading="isLoading"
          :restaurant="restaurant"
          @on-link-clicked="goToLink(index, restaurant)"
        />
        <AllRestaurantCard
          v-else
          :is-lazy-load-main-image="true"
          :is-loading="isLoading"
          :restaurant="restaurant"
          @on-link-clicked="goToLink(index, restaurant)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import RestaurantCard from "@/components/Shared/RestaurantCard/RestaurantCard.vue";
import AllRestaurantCard from "./AllRestaurantCard.vue";
import { nanoid } from "nanoid";

export default {
  components: {
    RestaurantCard,
    AllRestaurantCard,
  },
  props: {
    restaurants: {
      type: Array,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    goToLink(index, restaurant) {
      this.$emit("on-restaurant-clicked", { index, restaurant });
      restaurant.goToLink();
    },
    genereateLoopkey(restaurant, index) {
      const restaurantId = restaurant.id || nanoid(3);
      return `${restaurantId}-${restaurant.name}-${index}`;
    },
  },
};
</script>
