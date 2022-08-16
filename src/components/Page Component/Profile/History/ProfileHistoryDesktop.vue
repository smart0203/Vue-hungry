<template>
  <div class="profile-content-min-height">
    <div class="mt-2 mb-4">
      <p class="text-left capitalize">
        {{ $t("bookingHistory") }}
      </p>
    </div>
    <div class="">
      <template v-if="pastReservation && pastReservation.length">
        <ReservationCard
          v-for="(reservation, index) in pastReservation"
          :key="index"
          class="w-full mb-3"
          v-bind="buildReservationCardProps(reservation, true)"
          :is-loading="firstLoading"
          force-version="mobile"
          @on-view-detail-clicked="viewDetailCallback(reservation)"
          @on-book-again-clicked="bookAgainCallback(reservation)"
          @on-write-review-clicked="writeReviewCallback(reservation)"
        />

        <button
          v-if="anyNextPage.pastReservation"
          class="flex items-center px-2 py-1 mx-auto mt-4 text-xs capitalize border rounded-full border-red-dark text-red-dark disabled:opacity-50 hover:underline"
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
      loading,
      pageNumber,
      pageSize,
      anyNextPage,
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
    this.initGetPastReservation();
  },
  beforeDestroy() {
    this.pastReservation = [];
  },
  methods: {
    async initGetPastReservation() {
      this.pastReservation = this.initDummyReservation(5);
      this.pageSize.pastReservation = 20;
      this.pageNumber.pastReservation = 1;
      await this.getPastReservation(false);
      this.firstLoading = false;
    },
    loadMorePastReservation() {
      this.pageNumber.pastReservation += 1;
      this.getPastReservation(true);
    },
  },
};
</script>
