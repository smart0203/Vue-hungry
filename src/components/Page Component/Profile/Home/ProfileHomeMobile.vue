<template>
  <div>
    <div class="pb-4 max-width">
      <div
        class="flex px-3 py-6 rounded-lg"
        :style="`background: url('${getHeaderBgColor()}'); color: ${
          currentPrivilegeLevel.profileTextColor
        }`"
      >
        <!-- left column -->
        <div class="user-image">
          <!-- image profile -->
          <router-link
            class="relative block"
            :to="{ name: ROUTE_PROFILE_EDIT }"
          >
            <hh-image
              class="user-image"
              :img="avatarOriginal"
              :mobile-width="60"
              :mobile-height="60"
            ></hh-image>
            <img
              v-if="currentPrivilegeLevel.iconBadge"
              class="absolute"
              loading="lazy"
              :src="currentPrivilegeLevel.iconBadge.url"
              :alt="currentPrivilegeLevel.name"
              width="30"
              style="bottom: -5px; right: -5px"
            />
          </router-link>
        </div>
        <!-- right column -->
        <div class="flex-grow ml-2">
          <ul class="">
            <li>
              <span class="font-black">{{ name }}</span>
            </li>
            <li>
              <div class="flex items-center">
                <span>Hungry Point</span>
                <span class="ml-2 font-black">{{ hungryPoints }}</span>
              </div>
            </li>
            <li>
              <div class="flex flex-wrap w-full text-xs">
                <span class="mr-1 capitalize">{{
                  `${$t("referralCode")}: `
                }}</span>
                <div class="flex items-center">
                  <span>{{ referralCode }}</span>
                  <div
                    class="ml-2"
                    @click="
                      toggleModal(true, 'share-referral', {
                        width: '85%',
                        height: 250,
                      })
                    "
                  >
                    <img
                      class="flex-shrink-0 cursor-pointer"
                      :src="
                        isOnMaxPrivilegeLevel ? iconShareWhite : iconShareBlack
                      "
                      width="12"
                      loading="lazy"
                      height="12"
                    />
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div class="flex flex-col items-end justify-end">
          <span class="text-lg font-black leading-4">{{
            currentPrivilegeLevel.name
          }}</span>
          <span class="text-xs text-center capitalize">{{
            $t("currentLevel")
          }}</span>
        </div>
      </div>

      <div class="">
        <div class="flex flex-col mx-5 text-sm">
          <router-link
            class="capitalize reservation-button tab-button"
            :to="{ name: ROUTE_PROFILE_EDIT }"
          >
            {{ $t("editProfile") }}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              class="inline icon-chevron-right"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </router-link>
          <div class="tab-button-separator"></div>
          <router-link
            class="capitalize favourite-button tab-button"
            :to="{ name: ROUTE_PROFILE_FAVOURITE }"
          >
            {{ $t("favorites") }}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              class="inline icon-chevron-right"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </router-link>
          <div class="tab-button-separator"></div>
          <router-link
            class="capitalize booking-history-button tab-button"
            :to="{ name: ROUTE_PROFILE_HISTORY }"
          >
            {{ $t("bookingHistory") }}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              class="inline icon-chevron-right"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </router-link>
          <div class="tab-button-separator"></div>
          <router-link
            :to="{ name: ROUTE_PROFILE_PRIVILEGE }"
            class="capitalize member-priviliges-button tab-button"
          >
            {{ $t("memberPriviliges") }}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              class="inline icon-chevron-right"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </router-link>
          <div class="tab-button-separator"></div>
          <router-link
            :to="{ name: ROUTE_PROFILE_VOUCHER }"
            class="capitalize voucher-button tab-button"
          >
            {{ $t("myVoucher") }}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              class="inline icon-chevron-right"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </router-link>
          <div class="tab-button-separator"></div>
          <router-link
            class="capitalize redeem-point-button tab-button"
            :to="{ name: ROUTE_PROFILE_POINT }"
          >
            {{ $t("redeemPoint") }}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              class="inline icon-chevron-right"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </router-link>
          <div class="tab-button-separator"></div>
          <!-- <router-link
            v-if="false"
            class="payment-button tab-button"
            :to="{ name: 'ProfilePayment' }"
          >
            Payment Methods
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              class="inline icon-chevron-right"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </router-link>
          <div v-if="false" class="tab-button-separator"></div> -->
        </div>
      </div>

      <div class="mt-4 mb-6">
        <div class="px-4">
          <div class="mb-6">
            <p
              v-if="pendingBookings && pendingBookings.length"
              class="mb-3 text-sm capitalize lg:text-sm"
            >
              {{ $t("incompleteReservation") }}
            </p>
            <PendingBooking class="my-0 profile-pending-booking" />
          </div>

          <div v-if="pendingPaymentReservation.length">
            <div class="mb-1 text-xs capitalize lg:text-sm">
              Pending payment
            </div>
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
                  payCallBack(
                    reservation.encryptedId,
                    reservation.restaurantName
                  )
                "
                @on-cancel-clicked="
                  () => {
                    toggleModal(true, 'confirm-remove-pending-payment', {
                      width: '85%',
                      height: 250,
                    });
                    showRemovePendingPaymentModal(reservation.id);
                  }
                "
              />
            </div>
          </div>

          <p
            class="mb-1 text-xs"
            :class="anyUpcomingReservation > 0 ? ' text-left' : ' text-center'"
          >
            {{
              anyUpcomingReservation
                ? `${$t("upcomingReservationOrOrder")}(${
                    upComingReservation.length
                  })`
                : $t("noUpcomingReservations")
            }}
          </p>
          <template v-if="upComingReservation.length">
            <ReservationCard
              v-for="(reservation, index) in upComingReservation"
              :key="index"
              v-bind="buildReservationCardProps(reservation, false)"
              :is-loading="loading.upCommingReservation"
              @on-view-detail-clicked="viewDetailCallback(reservation)"
              @on-modify-clicked="modifyCallback(reservation)"
              @on-share-clicked="shareCallback(reservation)"
              @on-qr-clicked="qrCallback(reservation)"
              @on-book-again-clicked="bookAgainCallback(reservation)"
              @on-cancel-clicked="showRemovePendingPaymentModal(reservation.id)"
            />
            <button
              v-if="anyNextPage.upCommingReservation"
              class="flex items-center px-2 py-1 mx-auto text-xs capitalize border rounded-full border-red-dark text-red-dark disabled:opacity-50 hover:underline"
              :disabled="loading.upCommingReservation"
              @click="loadMoreUpComingReservation"
            >
              <div
                v-if="loading.upCommingReservation"
                class="mr-1 loader small"
              ></div>
              {{
                loading.upCommingReservation ? $t("loading") : $t("showMore")
              }}
            </button>
          </template>
          <div v-else class="flex flex-col items-center justify-center py-2">
            <router-link
              :to="{ name: ROUTE_HOME_PAGE }"
              class="px-2 mt-2 mb-4 text-sm leading-5 bg-white border rounded-full text-red-dark border-red-dark"
            >
              {{ $t("findARestaurant") }}
            </router-link>
            <img
              class="mb-6 no-upcoming-reservation-img"
              src="@/assets/mr-hungry-bg-yellow.png"
              alt="no upcoming reservation img"
              loading="lazy"
            />
          </div>

          <!-- make suggestion  -->
          <div class="flex flex-col items-center justify-center py-2 mt-4">
            <span class="text-xs">{{ $t("youCanHelpUs") }}</span>
            <a
              href="https://hungryhub.zendesk.com/hc/en-us/requests/new"
              target="_blank"
              class="px-2 mt-2 mb-4 text-sm leading-5 bg-white border rounded-full text-red-dark border-red-dark"
            >
              {{ $t("makeSuggestion") }}
            </a>
          </div>
        </div>
      </div>
    </div>
    <HHPopup
      :key="activeModal"
      activator=""
      name="booking-qr-share-referral"
      :is-show="showQrCodeModal || isModalShow"
      :is-tooltip-desktop="false"
      :modal-width="modalWidth"
      :modal-height="modalHeight"
      @on-closed="onModalClosed"
    >
      <div>
        <ProfileModalShareReferral
          v-if="activeModal === 'share-referral'"
          @on-referral-code-shared="onModalClosed"
        />
        <div
          v-else-if="activeModal === 'confirm-remove-pending-payment'"
          class="text-sm text-center"
        >
          <p>Do you want to remove your pending payment ?</p>
          <div class="flex items-center justify-center my-6 lg:my-6">
            <button
              class="w-4/12 py-1 capitalize border rounded-full lg:w-2/12 text-red-dark border-red-dark"
              @click="onModalClosed"
            >
              {{ $t("no") }}
            </button>
            <button
              class="w-4/12 py-1 ml-6 text-white capitalize rounded-full lg:w-2/12 border-red-dark bg-red-dark"
              @click="
                () => {
                  onModalClosed();
                  onConfirmRemovePendingPayment();
                }
              "
            >
              {{ $t("yes") }}
            </button>
          </div>
        </div>
        <img v-else :src="qrCode" alt="" class="mx-auto" loading="lazy" />
      </div>
    </HHPopup>
  </div>
</template>

<script>
import { state as profileState } from "@/components/Page Component/Profile/profile";
import {
  state as reservationState,
  methods as reservationMethods,
} from "@/components/Page Component/Profile/Reservation/profileReservation";
import "@/components/Page Component/Profile/Home/PendingBooking/PendingBooking.scss";
import { pendingBookings } from "@/composable/pendingBooking";
import {
  ROUTE_HOME_PAGE,
  ROUTE_PROFILE_VOUCHER,
  ROUTE_PROFILE_EDIT,
  ROUTE_PROFILE_FAVOURITE,
  ROUTE_PROFILE_HISTORY,
  ROUTE_PROFILE_POINT,
  ROUTE_PROFILE_PRIVILEGE,
} from "@/lib/constant";
import useLazyImport from "@/composable/useLazyImport";
import {
  currentPrivilegeLevel,
  privilegeLevel,
  getHeaderBgColor,
  isOnMaxPrivilegeLevel,
} from "@/composable/useUserPrivileges";
import iconShareWhite from "@/assets/icon-share-white.png";
import iconShareBlack from "@/assets/icon-share-black.png";
export default {
  name: "ProfileHomeMobile",
  components: {
    ReservationCard: () =>
      useLazyImport(() => import("../Reservation/ReservationCard.vue")),
    HHPopup: () => useLazyImport(() => import("@/components/Shared/HHPopup")),
    PendingBooking: () =>
      useLazyImport(() =>
        import(
          "@/components/Page Component/Profile/Home/PendingBooking/PendingBooking.vue"
        )
      ),
    ProfileModalShareReferral: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "ProfileDesktopChunk" */ "@/components/Page Component/Profile/Modal/ProfileModalShareReferral.vue"
        )
      ),
    PendingPayment: () =>
      import("@/components/Page Component/Profile/Home/PendingPayment.vue"),
  },
  setup() {
    return {
      ROUTE_HOME_PAGE,
      ROUTE_PROFILE_EDIT,
      ROUTE_PROFILE_FAVOURITE,
      ROUTE_PROFILE_HISTORY,
      ROUTE_PROFILE_POINT,
      ROUTE_PROFILE_VOUCHER,
      ROUTE_PROFILE_PRIVILEGE,
      pendingBookings,
      currentPrivilegeLevel,
      privilegeLevel,
      getHeaderBgColor,
      isOnMaxPrivilegeLevel,
      iconShareWhite,
      iconShareBlack,
      ...profileState,
      ...reservationState,
      ...reservationMethods,
    };
  },
  data() {
    return {
      isModalShow: false,
      activeModal: "",
      modalWidth: "",
      modalHeight: "",
    };
  },
  computed: {
    anyUpcomingReservation() {
      return this.upComingReservation.length > 0;
    },
  },
  mounted() {
    this.initGetUpcomingReservation();
    this.initGetPendingPaymentReservation();
  },
  methods: {
    getProfile() {
      this.$store.dispatch("user/getProfile");
    },
    initGetPendingPaymentReservation() {
      this.pendingPaymentReservation = this.initDummyReservation(3);
      this.getPendingPaymentReservation();
    },
    initGetUpcomingReservation() {
      this.pageSize.upComingReservation = 3;
      this.upComingReservation = this.initDummyReservation(3);
      this.getUpCommingReservation(false);
    },
    loadMoreUpComingReservation() {
      this.pageNumber.pastReservation += 1;
      this.getUpCommingReservation(true);
    },
    toggleModal(isShow = false, modalName = "", { width, height }) {
      this.activeModal = modalName;
      if (width) {
        this.modalWidth = width;
      }
      if (height) {
        this.modalHeight = height;
      }
      this.$nextTick(() => {
        this.isModalShow = isShow;
      });
    },
    onModalClosed() {
      this.isModalShow = false;
      this.showQrCodeModal = false;
      this.activeModal = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.user-image {
  width: 60px;
  height: 60px;

  @screen lg {
    width: 95px;
    height: 95px;
  }

  @apply border rounded-full;
}

.tab-button {
  @apply w-full pb-2 pt-2 px-2 text-red-dark font-black flex items-center justify-between;
}

.tab-button-separator {
  width: 100%;
  height: 2px;
  border: 0.5px solid #e4e4e4;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.160784);
}

.no-upcoming-reservation-img {
  width: 155px;
}
</style>
<i18n>
{
  "en": {
    "upcomingReservationOrOrder": "Upcoming Reservations / Orders",
    "youCanHelpUs": "You can help us serve you better",
    "makeSuggestion": "Make a Suggestion"
  },
  "th": {
    "upcomingReservationOrOrder": "การจอง / คำสั่งซื้อที่จะเกิดขึ้น",
    "youCanHelpUs": "คุณสามารถช่วยเรา ให้บริการคุณได้ดีขึ้น",
    "makeSuggestion": "ให้คำแนะนำ"
  }
}
</i18n>
