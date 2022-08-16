<template>
  <div class="min-h-screen mx-4">
    <div class="relative mt-6 mb-8">
      <router-link to="/profile" class="absolute top-0 left-0 text-black">
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
      <p class="font-black text-center capitalize">
        {{ $t("bookingHistory") }}
      </p>
    </div>
    <div class="pb-4">
      <template v-if="pastReservation && pastReservation.length">
        <ReservationCard
          v-for="(reservation, index) in pastReservation"
          :key="index"
          class="w-full mb-3 lg:w-1/3 lg:mr-4"
          v-bind="buildReservationCardProps(reservation, true)"
          :is-loading="firstLoading"
          @on-view-detail-clicked="viewDetailCallback(reservation)"
          @on-book-again-clicked="bookAgainCallback(reservation)"
          @on-write-review-clicked="writeReviewCallback(reservation)"
        />
        <button
          v-if="anyNextPage.pastReservation"
          class="flex items-center px-2 py-1 mx-auto my-4 text-xs capitalize border rounded-full border-red-dark text-red-dark disabled:opacity-50 hover:underline"
          :disabled="loading.pastReservation"
          @click="loadMorePastReservation"
        >
          <div v-if="loading.pastReservation" class="mr-1 loader small"></div>
          {{ loading.pastReservation ? $t("loading") : $t("showMore") }}
        </button>
      </template>
      <ProfileEmptyState v-else :title="$t('noBookingHistory')" />
    </div>
  </div>
</template>

<script>
import {
  state as profileReservationState,
  methods as profileReservationMethods,
} from "@/components/Page Component/Profile/Reservation/profileReservation";
import useLazyImport from "@/composable/useLazyImport";
export default {
  components: {
    ProfileEmptyState: () =>
      useLazyImport(() =>
        import("@/components/Page Component/Profile/ProfileEmptyState")
      ),
    ReservationCard: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "ProfileMobileChunk" */ "@/components/Page Component/Profile/Reservation/ReservationCard"
        )
      ),
  },
  setup() {
    const { loading, pastReservation, pageNumber, pageSize, anyNextPage } =
      profileReservationState;
    const {
      bookAgainCallback,
      viewDetailCallback,
      buildReservationCardProps,
      getPastReservation,
      initDummyReservation,
      writeReviewCallback,
    } = profileReservationMethods;
    return {
      anyNextPage,
      loading,
      pageNumber,
      pageSize,
      pastReservation,
      bookAgainCallback,
      viewDetailCallback,
      buildReservationCardProps,
      getPastReservation,
      initDummyReservation,
      writeReviewCallback,
    };
  },
  data() {
    return {
      firstLoading: true,
    };
  },
  mounted() {
    this.pastReservation = this.initDummyReservation(5);
    this.initGetPastReservation();
  },
  beforeDestroy() {
    this.pastReservation = [];
  },
  methods: {
    async initGetPastReservation() {
      this.firstLoading = true;
      this.pageSize.pastReservation = 20;
      this.pageNumber.pastReservation = 1;
      await this.getPastReservation();
      this.firstLoading = false;
    },
    loadMorePastReservation() {
      this.pageNumber.pastReservation += 1;
      this.getPastReservation(true);
    },
  },
};
</script>
