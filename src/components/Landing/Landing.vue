<template>
  <div class="flex flex-wrap wrapper">
    <div
      class="w-full"
      :class="showChargeSummary ? 'mr-auto lg:w-7/12' : 'mx-auto lg:w-7/12'"
    >
      <div class="">
        <LandingHeader
          :title="landingTitle"
          :sub-title="landingSubTitle"
          :desc="landingDesc"
        />
        <LandingDeliveryStep v-if="isDelivery" />
        <LandingMap class="mt-4" :map="map" />
        <div class="flex flex-col mx-auto lg:w-11/12 lg:flex-row lg:mt-4">
          <HhImage
            v-if="isDesktop"
            :img="avatarThumb"
            :fallback="defaultAvatar"
            alt="user avatar"
            class="mx-auto mt-4 mb-3 rounded-full lg:mt-0 lg:mb-0 user-avatar lg:mr-10"
          />
          <div class="w-full">
            <LandingUserInfo />
            <LandingChargedSummary
              v-if="isMobile && showChargeSummary && !isCanceled"
              :expandable-menu="showMenuDetail"
            />
          </div>
        </div>
      </div>
      <LandingFooter
        v-if="!isCanceled"
        :is-signedin="isSignedin"
        :is-restaurant-promoted-only="isRestaurantPromotedOnly"
        @on-sign-up-campaign-click="openSignupModal"
      />
    </div>
    <div v-if="isDesktop && showChargeSummary && !isCanceled" class="lg:w-4/12">
      <LandingChargedSummary :expandable-menu="showMenuDetail" />
    </div>
  </div>
</template>

<script>
import { DEFAULT_AVATAR } from "@/lib/constant";
import { state, computeds, methods } from "./landing";
import { ROUTE_RESTAURANT_PAGE } from "@/lib/constant";
import useLazyImport from "@/composable/useLazyImport";
import useQueryString from "@/composable/useQueryString";

export default {
  name: "DefaultLandingPage",
  components: {
    LandingHeader: () => useLazyImport(() => import("./LandingHeader")),
    LandingFooter: () => useLazyImport(() => import("./LandingFooter")),
    LandingDeliveryStep: () =>
      useLazyImport(() => import("./LandingDeliveryStep")),
    LandingMap: () => useLazyImport(() => import("./LandingMap")),
    LandingUserInfo: () => useLazyImport(() => import("./LandingUserInfo")),
    LandingChargedSummary: () =>
      useLazyImport(() => import("./LandingChargedSummary")),
  },
  props: {
    isSignedin: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const { deliveryMap, isPendingBigGroup, isCanceled } = computeds;
    const { initReservationRealtimeDB } = methods;
    const { parsedQueryString } = useQueryString();
    const { shopeePayPaymentSuccess } = parsedQueryString;
    return {
      isCanceled,
      initReservationRealtimeDB,
      isPendingBigGroup,
      deliveryMap,
      shopeePayPaymentSuccess,
      ...state,
    };
  },
  data() {
    return {
      avatarThumb: "",
    };
  },
  computed: {
    landingTitle() {
      if (this.isCanceled) {
        return "Reservation Cancelled";
      }
      return this.isPendingBigGroup
        ? this.$t("pleaseWait")
        : this.$t("confirmed");
    },
    landingSubTitle() {
      if (this.isPendingBigGroup) {
        return this.$t("bigGroupTitle");
      }
      const type = this.isDineIn ? this.$t("bookingId") : this.$t("orderId");
      return `<span class="capitalize">${type} :</span><span class="text-red-dark">${this.originalId}</span>`;
    },
    landingDesc() {
      if (this.isCanceled) {
        return "";
      }
      if (this.isPickUp) {
        return this.$t("pickUpReadyAt", {
          time: this.deliveryEstimationLabel || this.time,
        });
      } else if (this.isDelivery && this.isLateDelivery) {
        return `<span class="font-black text-red-dark">${this.$t(
          "sorryForDelay"
        )}</span>`;
      }
      return "";
    },
    defaultAvatar() {
      return DEFAULT_AVATAR;
    },
    showMenuDetail() {
      if (this.isDineIn === false) {
        const anyPackageWithMenu = this.packages.filter(
          (packages) => packages.sections.length > 0
        );
        if (anyPackageWithMenu.length > 0) {
          return true;
        }
        return false;
      }
      return false;
    },
    showChargeSummary() {
      return this.isPackageCharged ? true : false;
    },
  },
  mounted() {
    this.closeTab();
    this.initReservationRealtimeDB(this.originalId);
    this.registerPopStateCallback();
  },
  beforeDestroy() {
    this.clearState();
    this.removePopStateCallback();
  },
  methods: {
    openSignupModal() {
      const guestBookingIds = [];
      guestBookingIds.push(this.guestBookingIds);
      this.$store.commit("user/setState", {
        state: "guestBookingIds",
        val: guestBookingIds,
      });
      this.$modal.show("register-modal");
    },
    clearState() {
      this.$store.commit("user/setState", {
        state: "guestBookingIds",
        val: [],
      });
    },
    registerPopStateCallback() {
      window.onpopstate = () => {
        this.$router.push({ name: ROUTE_RESTAURANT_PAGE });
      };
    },
    removePopStateCallback() {
      window.onpopstate = {};
    },
    closeTab() {
      if (this.shopeePayPaymentSuccess) {
        window.close();
      }
    },
  },
};
</script>
<i18n>
{
  "en": {
    "confirmed": "Confirmed!",
    "pleaseWait": "Please WAIT!",
    "bigGroupTitle": "We got your big group request. Our team is trying our best to get you a table and will contact you back shortly.",
    "thisIsNotConfirmation": "This is NOT a confirmation <br> We’re checking a table for you.",
    "sorryForDelay": "We are sorry for the delay, your order will arrive soon!",
    "pickUpReadyAt": "Your delicious food will be ready to pickup <span class='text-red-dark'>{time}</span>"
  },
  "th": {
    "confirmed": "ยืนยันการจอง!",
    "pleaseWait": "รอก่อน!",
    "bigGroupTitle": "นี่ยังไม่ใช่หน้ายืนยันการจองทางเรากำลังตรวจสอบที่นั่งให้คุณอยู่ค่ะ",
    "thisIsNotConfirmation": "นี่ไม่ใช่การยืนยันการจอง เรากำลังเช็คกับทางร้านอาหารอยู่",
    "sorryForDelay": "ขออภัยในความล่าช้า คำสั่งซื้อของคุณจะมาถึงเร็ว ๆ นี้",
    "pickUpReadyAt": "รับอาหารได้ในเวลา <span class='text-red-dark'>{time}</span>"

  }
}
</i18n>
<style lang="scss" scoped>
.wrapper {
  min-height: 80vh;
}
.user-avatar {
  width: 60px;
  height: 60px;
}
@screen lg {
  .user-avatar {
    width: 100px;
    height: 100px;
  }
}
</style>
