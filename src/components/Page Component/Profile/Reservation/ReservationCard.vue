<template>
  <div class="px-2 py-2 reservation-card-shadow">
    <div class="flex h-full">
      <!-- left column -->
      <div class="flex flex-col justify-between flex-grow">
        <div class="">
          <div
            v-if="!isPast"
            class="flex text-sm font-black capitalize"
            :class="
              isLoading
                ? ' bg-gray-300  text-gray-300 w-32'
                : ' bg-white text-red-dark'
            "
          >
            <span>{{ $t("bookingId") }}: {{ bookingId }}</span>
            <span
              v-if="!isLoading && !isUsingDesktopVersion"
              class="flex items-center ml-3"
            >
              <div class="mr-1">
                <img
                  :src="serviceTypeIcon"
                  loading="lazy"
                  class="flex-shrink-0 icon"
                  alt="dine in icon"
                  style="width: 14px; height: 14px"
                />
              </div>
              <span class="whitespace-nowrap text-red-dark">
                {{ serviceTypeLabel }}</span
              >
            </span>
          </div>

          <div
            class="text-xs font-black lg:text-sm lg:my-1"
            :class="
              isLoading ? ' bg-gray-300  text-gray-300 w-40' : ' bg-white'
            "
          >
            {{ restaurantName }}
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="my-1 text-xs text-gray-800 lg:text-sm">
            <div
              v-if="isPast"
              class="capitalize"
              :class="
                isLoading
                  ? ' bg-gray-300  text-gray-300 w-20 mb-2'
                  : ' bg-white'
              "
            >
              {{ $t("bookingId") }} {{ bookingId }}
            </div>
            <div
              class="truncate"
              :class="
                isLoading
                  ? ' bg-gray-300  text-gray-300 w-48 mb-2'
                  : ' bg-white'
              "
            >
              {{ reservationDateTime }} for {{ reservationPax }}
              {{ $tc("people", reservationPax) }}
            </div>
            <!-- reservation status -->
            <div
              v-if="reservationStatusSymbol && isPast"
              class="flex items-center justify-between"
            >
              <div class="text-xs text-gray-800 lg:text-sm">
                <div
                  class="capitalize"
                  :class="[
                    isLoading
                      ? ' bg-gray-300  text-gray-300 w-10'
                      : ' bg-white',
                    reservationStatus == 'Cancel' ||
                    reservationStatus == 'Rejected'
                      ? ' text-red-dark'
                      : null,
                  ]"
                >
                  {{ parsedReservationStatus }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style="height: 20px">
          <template v-if="!isLoading && isUsingDesktopVersion">
            <div v-if="!isPast" class="flex items-center">
              <div class="mr-1">
                <img
                  :src="serviceTypeIcon"
                  class="flex-shrink-0 icon"
                  loading="lazy"
                  alt="dine in icon"
                  style="width: 14px; height: 14px"
                />
              </div>
              <span class="whitespace-nowrap text-red-dark">
                {{ serviceTypeLabel }}</span
              >
            </div>
            <div v-if="reviewStar" class="flex mt-1">
              <svg
                v-for="rating in reviewStar"
                :key="rating"
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                fill="currentColor"
                class="icon-star-fill text-red-dark"
                viewBox="0 0 16 16"
              >
                <path
                  d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
                />
              </svg>
            </div>
          </template>
        </div>

        <div v-if="!isLoading" class="flex mt-2">
          <button
            v-if="isPast && isUsingDesktopVersion"
            class="px-2 mr-2 text-xs font-black capitalize border rounded-full book-again-button"
            :class="primaryButtonStyle"
            @click="$emit('on-book-again-clicked')"
          >
            {{ isDineIn ? $t("bookAgain") : $t("orderAgain") }}
          </button>
          <button
            v-if="(isUsingDesktopVersion || !isPast) && !isCancel"
            class="w-1/4 mr-2 text-xs font-black leading-5 text-white capitalize border rounded-full border-red-dark bg-red-dark whitespace-nowrap"
            @click="$emit('on-view-detail-clicked')"
          >
            {{ $t("detail") }}
          </button>
          <button
            v-if="showModifyButton"
            class="w-1/4 mr-2 text-xs font-black leading-5 text-white capitalize border rounded-full border-red-dark bg-red-dark whitespace-nowrap"
            @click="$emit('on-modify-clicked')"
          >
            {{ $t("modifyBooking") }}
          </button>
        </div>

        <!-- review section -->
        <section v-if="!isLoading && !isUsingDesktopVersion" class="flex">
          <div v-if="isHasReview" class="flex justify-between">
            <svg
              v-for="rating in reviewStar"
              :key="rating"
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              fill="currentColor"
              class="icon-star-fill text-red-dark"
              viewBox="0 0 16 16"
            >
              <path
                d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
              />
            </svg>
          </div>
          <template v-if="showReviewButton">
            <button
              class="px-2 mt-2 text-xs leading-6 text-white rounded-full bg-red-dark"
              @click="$emit('on-write-review-clicked')"
            >
              {{ $t("writeReview") }}
            </button>
          </template>
        </section>
      </div>
      <!-- right column -->
      <div class="flex flex-col justify-between mt-1">
        <template v-if="isPast && !isUsingDesktopVersion">
          <div>
            <button
              class="block w-full px-2 text-xs font-black capitalize border rounded-full book-again-reservation"
              :class="primaryButtonStyle"
              @click="!isLoading ? $emit('on-book-again-clicked') : () => {}"
            >
              {{ isDineIn ? $t("bookAgain") : $t("orderAgain") }}
            </button>
            <button
              v-if="!isCancel"
              class="block w-full px-2 mt-2 text-xs font-black capitalize border rounded-full detail-reservation"
              :class="primaryButtonStyle"
              @click="!isLoading ? $emit('on-view-detail-clicked') : () => {}"
            >
              {{ $t("detail") }}
            </button>
          </div>
          <span
            v-if="showHungryPoint"
            class="block mt-2 text-xs font-black text-red-dark"
            >{{ `+${hungryPoints} Hungry Point` }}</span
          >
        </template>
        <template v-else-if="!isPast">
          <div class="relative h-full">
            <div v-if="isLoading" class="w-5 h-5 bg-gray-300"></div>
            <img
              v-else
              class="cursor-pointer"
              src="@/assets/icon-share-red.png"
              width="20"
              loading="lazy"
              height="20"
              @click="$emit('on-share-clicked')"
            />

            <div
              v-if="isLoading"
              class="absolute bottom-0 right-0 w-5 h-5 bg-gray-300"
            ></div>
            <img
              v-else
              src="@/assets/icon-qr-red.png"
              alt="icon qr"
              width="20"
              loading="lazy"
              height="20"
              class="absolute bottom-0 right-0 cursor-pointer"
              @click="$emit('on-qr-clicked')"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReservationCard",
  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
    isPast: {
      type: Boolean,
      required: true,
    },
    isDineIn: {
      type: Boolean,
      required: true,
    },
    isDelivery: {
      type: Boolean,
      required: true,
    },
    isPickup: {
      type: Boolean,
      required: true,
    },
    isXperience: {
      type: Boolean,
      required: true,
    },
    restaurantName: {
      type: String,
      required: true,
    },
    bookingId: {
      type: String,
    },
    reservationDateTime: {
      type: String,
      required: true,
    },
    reservationPax: {
      type: Number,
      required: true,
    },
    reservationStatus: {
      type: String,
      default: "",
    },
    reviewText: {
      type: String,
    },
    reviewStar: {
      type: Number,
    },
    reservationStatusSymbol: {
      type: String,
      required: true,
    },
    reservationDate: {
      type: String,
      required: true,
    },
    hungryPoints: {
      type: Number,
      default: 0,
    },
    forceVersion: {
      type: String,
      default: "",
    },
    getReward: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    isArrived() {
      return this.reservationStatusSymbol == "arrived";
    },
    isCancel() {
      return this.reservationStatusSymbol === "cancelled";
    },
    parsedReservationStatus() {
      return this.reservationStatusSymbol.replace(/_/g, " ");
    },
    primaryButtonStyle() {
      if (this.isLoading) {
        return "bg-gray-300  text-gray-300 ";
      }
      if (this.isPast) {
        return " bg-red-dark border-red-dark text-white";
      }
      return "bg-white border-red-dark text-red-dark";
    },
    showShareButton() {
      return !this.isPast;
    },
    showPrimaryActionButton() {
      return !this.isPast ? true : false;
    },
    showQRButton() {
      return !this.isPast;
    },
    showModifyButton() {
      return this.isDineIn && !this.isPast && !this.isArrived ? true : false;
    },
    isHasReview() {
      return (
        (this.reviewText && this.reviewText.length > 0) || this.reviewStar > 0
      );
    },
    showReviewButton() {
      const reservationDate = this.$dayjs(this.reservationDate, "YYYY-MM-DD");
      const dateDifference = this.$dayjs().diff(reservationDate, "day");
      if (
        !this.isHasReview &&
        this.getReward === true &&
        this.isPast &&
        this.isArrived &&
        dateDifference < 30
      ) {
        return true;
      }
      return false;
    },
    showHungryPoint() {
      return this.getReward === true && this.hungryPoints && this.isArrived;
    },
    serviceTypeLabel() {
      if (this.isXperience) {
        return "Xperience";
      }
      if (this.isDineIn) {
        return "Dine-In";
      }
      if (this.isDelivery) {
        return "Delivery";
      }
      return "Pick Up";
    },
    serviceTypeIcon() {
      if (this.isDineIn) {
        return require("@/assets/icon-plate-red.png");
      }
      if (this.isXperience) {
        return require("@/assets/icon-xperience.png");
      }
      return require("@/assets/icon-shopping-bag-red.png");
    },
    isUsingDesktopVersion() {
      if (this.forceVersion.length == 0) {
        return this.isDesktop ? true : false;
      }
      return this.forceVersion === "desktop" ? true : false;
    },
  },
};
</script>
<style scoped>
.reservation-card-shadow {
  box-shadow: -1px 3px 6px rgba(0, 0, 0, 0.160784);
  border-radius: 6px;
}
</style>
<i18n>
{
  "en": {
    "writeReview": "Write a review and earn Hungry Points!"
  },
  "th": {
    "writeReview": "เขียนรีวิวเพื่อรับคะแนน"
  }
}
</i18n>
