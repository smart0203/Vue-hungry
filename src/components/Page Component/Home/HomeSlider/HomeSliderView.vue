<template>
  <div>
    <div
      class="section-title"
      :class="
        isLoading
          ? ' bg-gray-300  h-4 lg:h-6  w-5/12 lg:w-1/5 lg:mx-auto mr-auto text-gray-300'
          : null
      "
    >
      <slot></slot>
    </div>
    <component
      :is="desktopComponent"
      v-if="isDesktop"
      :is-loading="isLoading"
      :restaurants="restaurants"
      :align-center="alignCenter"
      @on-restaurant-clicked="onRestaurantClicked"
    ></component>
    <div v-else class="flex mb-4 overflow-x-scroll">
      <div
        v-for="(restaurant, index) in restaurants"
        :key="restaurant.name + restaurant.id"
        :class="isLoading ? 'mr-4' : null"
        class="flex-shrink-0 mr-2"
        style="width: 200px"
      >
        <component
          :is="mobileComponent"
          :is-lazy-load-main-image="true"
          :is-loading="isLoading"
          :restaurant="restaurant"
          :image-width-mobile="200"
          :image-height-mobile="100"
          @on-link-clicked="restaurantCardClicked({ index, restaurant })"
        ></component>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    restaurants: {
      type: Array,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
    alignCenter: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      desktopComponent: "",
      mobileComponent: "",
    };
  },
  created() {
    this.loadRequiredComponent();
  },
  methods: {
    async loadRequiredComponent() {
      let component;
      try {
        if (this.isDesktop) {
          component = await this.$useLazyImport(() =>
            import(
              /* webpackChunkName: "RestaurantCardSlider" */ "@/components/Shared/RestaurantCardSlider.vue"
            )
          );
          this.desktopComponent = component.default;
          return;
        }
        component = await this.$useLazyImport(() =>
          import(
            /* webpackChunkName: "RestaurantCardChunk" */ "@/components/Shared/RestaurantCard/RestaurantCard.vue"
          )
        );
        this.mobileComponent = component.default;
      } catch (err) {
        this.$alert.error(
          "Failed to get required component, please check your connection"
        );
        this.$rollbar.error(
          "Failed to get required component, please check your connection",
          err
        );
      }
    },
    restaurantCardClicked({ index, restaurant }) {
      restaurant.goToLink();
      this.onRestaurantClicked({ index, restaurant });
    },
    onRestaurantClicked({ index, restaurant }) {
      this.$emit("on-restaurant-clicked", { index, restaurant });
    },
  },
};
</script>
