<template>
  <div
    class="flex justify-center booking-page-container"
    :class="isDesktop ? 'items-center' : ''"
  >
    <div v-if="isLoading" class="loader big"></div>
    <div v-else class="w-full">
      <BookingPageMobile />
    </div>
  </div>
</template>

<script>
import pageMixin from "./pageMixin";
import { mapGetters, mapState } from "vuex";
import useLazyImport from "@/composable/useLazyImport";
export default {
  components: {
    BookingPageMobile: () =>
      useLazyImport(() =>
        import("@/components/Page Component/Booking/BookingPageMobile")
      ),
  },
  mixins: [pageMixin],
  metaInfo() {
    return {
      title: this.seo.title,
      meta: this.seo.meta,
      link: this.seo.link,
    };
  },
  props: {
    restaurantName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isLoading: true,
      seo: { meta: [], link: [] },
    };
  },
  computed: {
    ...mapGetters(["baseUrlWithLang"]),
    ...mapState("restaurant", ["restaurantData", "restaurantSeo"]),
    pageTitle() {
      return this.restaurantMetaTitle + " Book Now";
    },
  },
  mounted() {
    this.getRestaurantData();
    this.pageViewed();
  },
  methods: {
    async getRestaurantData() {
      if (this.restaurantData != "") {
        this.isLoading = false;
        return;
      }
      this.isLoading = true;
      const result = await this.$store.dispatch(
        "restaurant/getRestaurantData",
        this.restaurantName
      );
      if (result.isSuccess === false) {
        if (result.message) {
          this.$alert.error(result.message);
        }
        setTimeout(() => {
          window.location = `/restaurants/search`;
        }, 300);
      } else {
        this.$set(this.$data, "seo", this.restaurantSeo);
        this.isLoading = false;
      }
    },
  },
};
</script>
<style scoped>
.booking-page-container {
  min-height: 400px;
}

@screen lg {
  .booking-page-container {
    min-height: 0;
  }
}
</style>
