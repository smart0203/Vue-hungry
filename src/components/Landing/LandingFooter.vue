<template>
  <div>
    <div
      v-if="isPendingBigGroup"
      class="mt-4 mb-4 text-xl font-black text-center"
      v-html="$t('bigGroupWarning')"
    ></div>
    <template v-else>
      <div class="flex justify-center mx-2 my-4 lg:mx-4 lg:w-full">
        <a
          v-if="modifyBookingUrl && isDineIn"
          :href="$t('modifyBookingUrl', { url: modifyBookingUrl })"
          class="inline-block w-full py-2 mr-2 font-black leading-normal text-center uppercase border rounded-full cursor-pointer lg:w-11/12 lg:mr-4 lg:w-4/12 lg:py-3 border-red-dark text-red-dark hover:bg-gray-100"
        >
          {{ $t("modifyBooking") }}
        </a>
        <a
          :href="shareBookingUrl"
          class="inline-block w-full py-2 font-black leading-normal text-center uppercase border rounded-full cursor-pointer lg:w-11/12 lg:mr-4 lg:w-8/12 lg:py-3 border-red-dark text-red-dark hover:bg-gray-100"
        >
          {{ shareButtonText }}
        </a>
      </div>

      <template v-if="!isRestaurantPromotedOnly && !isCorporateEvent">
        <div
          v-if="!isSignedin"
          class="flex justify-center mx-2 my-4 lg:mx-4 lg:w-full"
        >
          <button
            id="landing-signup-cta-button"
            class="inline-block w-full py-2 text-sm leading-normal text-center text-white border rounded-full cursor-pointer lg:mr-4 lg:w-8/12 lg:py-3 border-red-dark bg-red-dark hover:bg-red-light lg:text-base"
            @click="$emit('on-sign-up-campaign-click')"
          >
            {{ signUpCampaignText }}
          </button>
        </div>
        <div v-else class="flex items-center justify-center mb-4 text-sm">
          <div>
            <img
              src="@/assets/icon-collect-red.png"
              class="mr-2"
              width="18"
               loading="lazy"
              height="18"
              alt="point icon"
            />
          </div>
          <div v-if="isDineIn">
            {{ $t("hungryPointBooking", { point: hungryPoint }) }}
          </div>
          <div v-else>{{ $t("hungryPointOrder", { point: hungryPoint }) }}</div>
        </div>

        <!-- tax invoice -->
        <div
          class="my-6 text-sm font-black text-center lg:mt-6 lg:mb-0 text-red-dark"
        >
          <div>{{ $t("bookingRequestInvoice1") }}</div>
          <div>{{ $t("bookingRequestInvoice2") }}</div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { state, computeds } from "./landing";
export default {
  props: {
    isSignedin: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    return {
      ...state,
      ...computeds,
    };
  },
  computed: {
    shareButtonText() {
      if (this.isDineIn) {
        return this.$t("shareBooking");
      }
      return this.$t("shareOrder");
    },
    signUpCampaignText() {
      return this.isDineIn
        ? this.$t("signUpCampaign", { point: this.hungryPoint })
        : this.$t("signUpCampaignOrder", { point: this.hungryPoint });
    },
    isCorporateEvent() {
      return this.corporateEventId ? true : false;
    },
  },
};
</script>
<i18n>
{
  "en": {
    "hungryPointOrder": "You will earn {point} points for this order",
    "hungryPointBooking": "You will earn {point} points for this booking",
    "signUpCampaign": "Sign up now to earn {point} Hungry Points for this booking",
    "signUpCampaignOrder": "Sign up now to earn {point} Hungry Points for this order",
    "bigGroupWarning": "This is NOT a confirmation <br> We’re checking a table for you.",
    "modifyBooking": "Modify Booking",
    "shareBooking": "Share Booking",
    "shareOrder": "Share Order",
    "modifyBookingUrl": "{url}?locale=en",
    "bookingRequestInvoice1": "If you would like tax invoice for your order,",
    "bookingRequestInvoice2": "please contact the restaurant directly with your order ID"
  },
  "th": {
    "hungryPointOrder": "คุณได้รับ {point} คะแนนสำหรับการออเดอร์ในครั้งนี้",
    "hungryPointBooking": "คุณได้รับ {point} คะแนนสำหรับการจองในครั้งนี้",
    "signUpCampaign": "เข้าสู่ระบบเพื่อสะสม {point} Hungry Points",
    "signUpCampaignOrder": "เข้าสู่ระบบเพื่อสะสม {point} Hungry Points",
    "bigGroupWarning": "นี่ยังไม่ใช่หน้ายืนยันการจองทางเรากำลังตรวจสอบที่นั่งให้คุณอยู่ค่ะ",
    "modifyBooking": "แก้ไขรายละเอียดการจอง",
    "shareBooking": "แชร์การจองนี้",
    "shareOrder": "แชร์การจองนี้",
    "modifyBookingUrl": "{url}?locale=th",
    "bookingRequestInvoice1": "ในกรณีที่ลูกค้าต้องการใบกำกับภาษี",
    "bookingRequestInvoice2": "สามารถติดต่อกับทางร้านโดยตรง พร้อมแจ้ง Order ID ได้เลยครั"
  }
}
</i18n>
