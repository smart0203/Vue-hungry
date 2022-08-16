<template>
  <GroupLanding
    :is-loading-get-data="isInitialLoading"
    :is-loading-get-restaurants="isLoadMoreLoading"
    :get-more-restaurant-handler="loadMoreTopRestaurants"
    :any-remaining-restaurants="isAnyNextPage"
    :restaurants="restaurants"
    :title="$t('topRestaurants')"
  />
</template>

<script>
import GroupLanding from "@/components/Page Component/GroupLanding/GroupLanding.vue";
import {
  getTopNewRestaurant,
  initDummyRestaurant,
} from "@/services/restaurant";
import { ref } from "@vue/composition-api";

export default {
  components: {
    GroupLanding,
  },
  setup() {
    const pageNumber = ref(1);
    const pageSize = ref(6);
    const isAnyNextPage = ref(false);
    const isInitialLoading = ref(true);
    const isLoadMoreLoading = ref(false);
    const restaurants = ref([]);

    for (let index = 0; index < 5; index++) {
      restaurants.value.push(initDummyRestaurant());
    }

    return {
      pageSize,
      pageNumber,
      isAnyNextPage,
      isInitialLoading,
      isLoadMoreLoading,
      restaurants,
    };
  },
  data() {
    return {
      initialLoading: true,
    };
  },
  mounted() {
    this.getTopRestaurants();
  },
  methods: {
    async getTopRestaurants() {
      this.isInitialLoading = true;
      const result = await getTopNewRestaurant({
        type: "top",
        pageSize: this.pageSize,
      });
      if (result.isSuccess) {
        this.restaurants = result.data;
        this.isAnyNextPage =
          typeof result.meta.next === "string" && result.meta.next.length
            ? true
            : false;
        this.isInitialLoading = false;
        return;
      }
      if (result.message) {
        this.$alert.error(result.message);
      }
    },
    async loadMoreTopRestaurants() {
      this.pageNumber += 1;
      this.isLoadMoreLoading = true;
      const result = await getTopNewRestaurant({
        type: "top",
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
      });
      if (result.isSuccess) {
        this.restaurants = [...this.restaurants, ...result.data];
        this.isAnyNextPage =
          typeof result.meta.next === "string" && result.meta.next.length
            ? true
            : false;
        this.isLoadMoreLoading = false;
        return;
      }
      if (result.message) {
        this.$alert.error(result.message);
      }
    },
  },
};
</script>
