<template>
  <div class="h-screen text-white bg-dark-red">
    <div class="container mx-auto">
      <div class="flex flex-col items-center justify-center h-screen pb-24">
        <img
          src="@/assets/not-found-hero-image.png"
          class="mb-4 hero-image"
           loading="lazy"
          alt="not found hero image"
        />
        <h1 class="text-2xl font-black lg:text-5xl">Oops …</h1>
        <h2 class="text-sm font-black lg:text-2xl">
          {{ errorTitle }}
        </h2>
        <h2 class="text-sm font-black lg:text-2xl">
          Don’t worry! We will take you back to
        </h2>
        <div class="flex flex-col mt-6 text-sm lg:text-base lg:flex-row">
          <a
            :href="homeLink"
            class="flex items-center justify-center mb-4 font-black uppercase bg-white border rounded-full lg:mr-4 lg:mb-0 home-button text-red-dark border-red-dark hover:bg-gray-200"
          >
            homepage
          </a>
          <a
            :href="searchLink"
            class="flex items-center justify-center font-black uppercase bg-white border rounded-full find-restaurant-button text-red-dark border-red-dark hover:bg-gray-200"
          >
            find a restaurant
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    errorId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters(["baseUrlWithLang"]),
    errorTitle() {
      return "It looks like you don't have access to this page.";
    },
    homeLink() {
      return this.baseUrlWithLang;
    },
    searchLink() {
      return `${this.baseUrlWithLang}/restaurants/search`;
    },
  },
};
</script>

<style lang="scss" scoped>
.hero-image {
  width: 155px;
  height: 155px;

  @screen lg {
    width: 260px;
    height: 260px;
  }
}

.home-button,
.find-restaurant-button {
  width: 188px;
  height: 30px;
}

@screen lg {
  .home-button {
    width: 170px;
    height: 40px;
  }

  .find-restaurant-button {
    width: 230px;
    height: 40px;
  }
}
</style>
