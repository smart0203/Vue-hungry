<template>
  <div class="min-h-screen lg:min-h-full">
    <div v-if="isMobile" class="relative mx-4 mt-8 mb-8">
      <router-link to="/profile/point" class="absolute top-0 left-0 text-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          fill="currentColor"
          class="inline icon-chevron-left text-red-dark"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
            stroke-width="2"
          />
        </svg>
      </router-link>
      <p class="font-black text-center capitalize">{{ $t("pointHistory") }}</p>
    </div>
    <div
      v-if="isInitialLoading"
      class="flex items-center justify-center flex-grow mt-8 font-black capitalize"
    >
      <div class="mr-2 loader small"></div>
      <span>{{ $t("pleaseWait") }}</span>
    </div>
    <template v-else>
      <div
        v-if="pointHistory && pointHistory.length"
        class="flex flex-col mt-4"
      >
        <div
          v-for="point in pointHistory"
          :key="point.id"
          class="flex items-center flex-grow mb-4 ml-4 mr-6"
        >
          <div class="mr-2">
            <img
              v-if="point.title === 'Spend Points'"
              src="@/assets/icon-baht-red.png"
              width="26"
              loading="lazy"
              height="26"
              alt="icon heart"
            />
            <img
              v-else
              src="@/assets/icon-heart-red.png"
              width="26"
              height="26"
              alt="icon baht"
              loading="lazy"
            />
          </div>
          <div class="w-full">
            <div class="text-xs font-black">{{ point.title }}</div>
            <div class="mt-2 text-xs">
              {{
                `${point.description} ${
                  point.title !== "Spend Points"
                    ? "on " + parseCreatedAt(point.createdAt)
                    : ""
                }`
              }}
            </div>
          </div>
          <div class="text-sm font-black">
            {{ point.point }}
          </div>
        </div>

        <button
          v-if="anyNextPage"
          class="flex items-center px-3 py-1 mx-auto my-4 text-xs capitalize border rounded-full border-red-dark text-red-dark lg:text-sm"
          :disabled="loadingPointHistory || isInitialLoading"
          @click="loadMore"
        >
          <span v-if="loadingPointHistory" class="mr-2 loader small"></span>
          {{ loadingPointHistory ? $t("pleaseWait") : $t("showMore") }}
        </button>
      </div>

      <div v-else class="flex items-center justify-center flex-grow font-black">
        {{ "No point history found" }}
      </div>
    </template>
  </div>
</template>

<script>
import { state, methods } from "@/composable/pointHistory";
export default {
  setup() {
    const { getPointHistoryList } = methods;
    const {
      pointHistory,
      isLoading: loadingPointHistory,
      isInitialLoading,
      anyNextPage,
    } = state;
    return {
      isInitialLoading,
      loadingPointHistory,
      pointHistory,
      getPointHistoryList,
      anyNextPage,
    };
  },
  data() {
    return {
      pageNumber: 1,
    };
  },
  mounted() {
    this.onMounted();
  },
  beforeDestroy() {
    this.pointHistory = [];
  },
  methods: {
    async onMounted() {
      if (this.isDesktop) {
        return;
      }
      await this.getPointHistoryList(this.pageNumber, 10, false);
    },
    parseCreatedAt(date) {
      return this.$dayjs(date).format("MM/DD/YYYY");
    },
    loadMore() {
      this.pageNumber += 1;
      this.getPointHistoryList(this.pageNumber, 10, true);
    },
  },
};
</script>
