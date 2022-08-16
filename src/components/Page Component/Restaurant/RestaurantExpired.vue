<template>
  <div
    class="flex flex-col justify-center px-4 mt-6 restaurant-expired-wrapper lg:mt-0"
  >
    <div class="flex items-center justify-center lg:justify-start">
      <HhImage
        v-if="icon"
        :img="icon"
        alt="restaurant icon"
        class="mr-2 rounded-full lg:mr-8 restaurant-icon"
      />
      <div class="w-full">
        <h1 class="mb-4 text-lg font-black lg:text-3xl text-red-dark lg:mr-0">
          {{ name }}
        </h1>
        <p class="text-base font-black lg:text-lg">
          This promotion has been expired
        </p>
      </div>
    </div>
    <p class="mt-4 text-sm" v-html="description"></p>
    <HomeSlider :api-order="1" :home-section-order="2" />
    <HomeSlider :api-order="3" :home-section-order="4" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import useLazyImport from "@/composable/useLazyImport";
export default {
  components: {
    HomeSlider: () =>
      useLazyImport(() =>
        import("@/components/Page Component/Home/HomeSlider/HomeSlider.vue")
      ),
  },
  computed: {
    ...mapState("restaurant", ["restaurantData"]),
    name() {
      if (this.restaurantData) {
        return this.restaurantData.name;
      }
      return "";
    },
    icon() {
      if (this.restaurantData.logoUrl.original) {
        return this.$url(this.restaurantData.logoUrl.original, "asset");
      }
      return "";
    },
    description() {
      if (this.restaurantData) {
        return this.restaurantData.description;
      }
      return "";
    },
  },
};
</script>
<style lang="scss" scoped>
.restaurant-icon {
  width: 100px;
  height: 100px;

  @screen lg {
    width: 200px;
    height: 200px;
  }
}
</style>
