<template>
  <div class="profile-content-min-height">
    <div class="flex">
      <div class="w-full lg:flex-initial">
        <div v-if="pendingBookings && pendingBookings.length" class="mb-12">
          <p class="mb-3 text-sm capitalize lg:text-sm">
            {{ $t("incompleteReservation") }}
          </p>
          <PendingBooking class="profile-pending-booking" />
        </div>

        <template v-if="pendingPaymentReservation.length">
          <div class="mb-3 text-sm capitalize lg:text-sm">Pending payment</div>
          <div
            v-for="reservation in pendingPaymentReservation"
            :key="reservation.id + reservation.id"
            class="mb-3"
          >
            <PendingPayment
              :restaurant-name="reservation.restaurantName"
              :booking-time="reservation.startTime"
              :booking-date="reservation.date"
              :booking-pax="reservation.adult"
              :is-loading="loading.pendingPaymentReservation"
              @on-pay-clicked="
                payCallBack(reservation.encryptedId, reservation.restaurantName)
              "
              @on-cancel-clicked="showRemovePendingPaymentModal(reservation.id)"
            />
          </div>
        </template>

        <div class="mt-8">
          <p class="mb-3 text-sm capitalize lg:text-sm">
            {{ $t("upcomingReservation") }}
          </p>
          <div class="">
            <div v-if="upComingReservation.length" class="flex flex-wrap">
              <div
                v-for="reservation in upComingReservation"
                :key="reservation.id"
                class="w-full lg:w-1/3 lg:pr-3"
              >
                <ReservationCard
                  class="h-full"
                  v-bind="buildReservationCardProps(reservation, false)"
                  @on-view-detail-clicked="viewDetailCallback(reservation)"
                  @on-modify-clicked="modifyCallback(reservation)"
                  @on-share-clicked="shareCallback(reservation)"
                  @on-qr-clicked="qrCallback(reservation)"
                  @on-book-again-clicked="bookAgainCallback(reservation)"
                  @on-cancel-clicked="cancelCallback(reservation.id)"
                />
              </div>
            </div>
            <ProfileEmptyState v-else>
              <template #title>
                <div class="text-base capital-first-letter">
                  {{ $t("noUpcomingReservations") }}
                </div>
              </template>
              <template #sub-title>
                <div></div>
              </template>
              <template #icon>
                <div></div>
              </template>
            </ProfileEmptyState>
          </div>
        </div>

        <div class="mt-8">
          <p class="mb-3 text-sm capitalize lg:text-sm">
            {{ $t("bookingHistory") }}
          </p>
          <div class="">
            <div v-if="pastReservation.length" class="flex flex-wrap">
              <div
                v-for="reservation in pastReservation.slice(0, 3)"
                :key="reservation.id"
                class="w-full lg:w-1/3 lg:pr-3"
              >
                <ReservationCard
                  class="h-full"
                  v-bind="buildReservationCardProps(reservation, true)"
                  @on-view-detail-clicked="viewDetailCallback(reservation)"
                  @on-modify-clicked="modifyCallback(reservation)"
                  @on-share-clicked="shareCallback(reservation)"
                  @on-qr-clicked="qrCallback(reservation)"
                  @on-book-again-clicked="bookAgainCallback(reservation)"
                  @on-cancel-clicked="cancelCallback(reservation.id)"
                  @on-write-review-clicked="writeReviewCallback(reservation)"
                />
              </div>
              <div
                v-if="pastReservation.length > 3"
                class="w-full text-center lg:mt-4"
              >
                <router-link
                  class="text-sm font-black hover:underline text-red-dark"
                  :to="{ name: 'ProfileHistory' }"
                >
                  {{ $t("seeAllPreviousBooking") }}
                </router-link>
              </div>
            </div>
            <ProfileEmptyState v-else :bold-title="false">
              <template #title>
                <div class="text-base capital-first-letter">
                  {{ $t("noBookingHistory") }}
                </div>
              </template>
              <template #sub-title>
                <div></div>
              </template>
              <template #icon>
                <img
                  src="@/assets/mr-hungry-bg-yellow.png"
                  class="mt-4"
                  width="160"
                   loading="lazy"
                  alt="mr hungry"
                />
              </template>
              <template #button-action>
                <div></div>
              </template>
            </ProfileEmptyState>
          </div>
        </div>
      </div>
    </div>

    <HHPopup
      activator=""
      name="booking-qr"
      :is-show="isModalShow"
      :is-tooltip-desktop="false"
      :modal-width="500"
      @on-closed="onModalClosed"
    >
      <div v-if="showQrCodeModal">
        <img :src="qrCode"  loading="lazy" alt="" class="mx-auto" />
      </div>
      <div v-else-if="showCancelConfirmModal" class="text-center">
        <p>Do you want to remove your pending payment ?</p>
        <div class="flex items-center justify-center mt-2 lg:my-6">
          <button
            class="w-4/12 py-1 capitalize border rounded-full lg:w-2/12 text-red-dark border-red-dark"
            @click="showCancelConfirmModal = false"
          >
            {{ $t("no") }}
          </button>
          <button
            class="w-4/12 py-1 text-white capitalize rounded-full lg:w-2/12 border-red-dark bg-red-dark lg:ml-6"
            @click="onConfirmRemovePendingPayment"
          >
            {{ $t("yes") }}
          </button>
        </div>
      </div>
    </HHPopup>
  </div>
</template>

<script>
import { computed } from "@vue/composition-api";
import {
  state as reservationState,
  methods as reservationMethods,
} from "@/components/Page Component/Profile/Reservation/profileReservation";
import "@/components/Page Component/Profile/Home/PendingBooking/PendingBooking.scss";
import { pendingBookings } from "@/composable/pendingBooking";
import useLazyImport from "@/composable/useLazyImport";
let timeOutInstance;

export default {
  components: {
    ReservationCard: () =>
      useLazyImport(() =>
        import(
          "@/components/Page Component/Profile/Reservation/ReservationCard"
        )
      ),
    HHPopup: () => useLazyImport(() => import("@/components/Shared/HHPopup")),
    ProfileEmptyState: () =>
      useLazyImport(() =>
        import("@/components/Page Component/Profile/ProfileEmptyState")
      ),
    PendingBooking: () =>
      useLazyImport(() =>
        import(
          "@/components/Page Component/Profile/Home/PendingBooking/PendingBooking.vue"
        )
      ),
    PendingPayment: () =>
      import("@/components/Page Component/Profile/Home/PendingPayment.vue"),
  },
  setup() {
    const isModalShow = computed(() => {
      return (
        reservationState.showQrCodeModal.value ||
        reservationState.showCancelConfirmModal.value
      );
    });

    function onModalClosed() {
      reservationState.showQrCodeModal.value = false;
      reservationState.showCancelConfirmModal.value = false;
    }

    return {
      pendingBookings,
      onModalClosed,
      isModalShow,
      ...reservationState,
      ...reservationMethods,
    };
  },
  beforeDestroy() {
    clearTimeout(timeOutInstance);
    this.showCancelConfirmModal = false;
    this.showQrCodeModal = false;
  },
  mounted() {
    this.upComingReservation = this.initDummyReservation();
    this.pastReservation = this.initDummyReservation();
    this.pendingPaymentReservation = this.initDummyReservation();
    timeOutInstance = setTimeout(() => {
      this.pageSize.upCommingReservation = 3;
      this.getUpCommingReservation();
      this.getPastReservation();
      this.getPendingPaymentReservation();
    }, 500);
  },
};
</script>
<style lang="scss">
.profile-pending-booking {
  .pending-booking {
    @apply px-4 py-3;
  }

  .restaurant-image-wrapper {
    display: none;
  }

  .pending-title {
    display: none;
  }
}
</style>
