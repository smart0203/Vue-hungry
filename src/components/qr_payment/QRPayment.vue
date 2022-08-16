<template>
  <div
    class="flex flex-col items-center w-11/12 mx-auto md:flex-row lg:py-16 lg:w-3/4"
  >
    <!-- left -->
    <div class="w-full mt-6 md:mt-0 md:w-2/6">
      <!-- restaurant name -->
      <div
        class="mb-4 text-lg font-black text-center capitalize lg:mb-4 lg:text-xl"
      >
        {{ restaurantName }}
      </div>
      <div class="flex justify-between my-2 font-extrabold lg:my-4">
        <div class="text-base lg:text-xl">
          <span class="text-red-dark">{{ title }} :</span>
          <span class="ml-1">{{ id }}</span>
        </div>
        <div v-if="chargeAmount" class="text-base lg:text-xl">
          {{ $money(chargeAmount) }}
        </div>
      </div>
      <div
        v-if="!qrCodeUrl"
        class="flex items-center justify-center w-full capitalize bg-gray-300"
        style="min-height: 300px"
      >
        <div class="mr-2 loader small"></div>
        {{ $t("loading") }}
      </div>
      <img v-else :key="imgKey" :src="qrCodeUrl" alt="QR Payment"  loading="lazy" />

      <div class="mb-2 text-sm text-center lg:mt-4 lg:text-base text-red-dark">
        *{{ $t("qrExpiredWithin") }}
      </div>
      <div class="p-2 text-center">
        <countdown
          :time="qrCountDown"
          :transform="countDownTransform"
          emit-events
          @end="onTimerEnded"
        >
          <template slot-scope="props">
            <span
              class="px-2 py-2 text-xl font-extrabold rounded-full text-red-dark lg:text-2xl"
              style="background: #fcdede"
              >{{ `${props.minutes}:${props.seconds}` }}</span
            >
          </template>
        </countdown>
      </div>
      <button
        v-if="isDesktop"
        id="reload-qr-button"
        class="block px-4 py-1 mx-auto my-2 text-sm text-white uppercase rounded-full bg-red-dark lg:py-2 lg:px-4 lg:my-4 hover:bg-red-light lg:text-base"
        @click="reloadQr"
      >
        {{ $t("reloadQr") }}
      </button>

      <div v-if="isMobile" class="w-5/6 mx-auto">
        <!-- helper text -->
        <ol class="mt-2 ml-4 text-sm list-decimal">
          <li class="mb-1">{{ $t("instruction1") }}</li>
          <li class="mb-1">{{ $t("instruction2") }}</li>
          <li class="mb-1">{{ $t("instruction3") }}</li>
        </ol>

        <div class="mx-4 my-4 text-sm font-semibold">
          <span class="text-red-dark">*</span>
          {{ $t("highLoadWarning") }}
        </div>
        <!-- cancel button & reload qr button -->
        <div class="flex items-center justify-center">
          <button
            id="reload-qr-button"
            class="block px-4 py-2 my-2 mr-4 text-sm font-black uppercase border rounded-full text-red-dark border-red-dark"
            @click="reloadQr"
          >
            {{ $t("reloadQr") }}
          </button>
          <button
            id="cancel-qr-button"
            class="block px-4 py-2 my-2 text-sm font-black uppercase capitalize border rounded-full text-red-dark border-red-dark"
            @click="onCancel"
          >
            {{ $t("cancel") }}
          </button>
        </div>
      </div>
    </div>
    <!-- right column -->
    <div v-if="isDesktop" class="w-full p-2 shadow-xl md:w-4/6 lg:shadow-none">
      <div class="lg:w-3/4 lg:mx-auto">
        <slot></slot>
        <!-- helper text -->
        <div>
          <ol class="mt-6 ml-4 text-sm list-decimal lg:text-base">
            <li class="mb-2">{{ $t("instruction1") }}</li>
            <li class="mb-2">{{ $t("instruction2") }}</li>
            <li class="mb-2">{{ $t("instruction3") }}</li>
          </ol>

          <div class="mx-4 mt-4 font-semibold">
            <span class="text-red-dark">*</span>
            {{ $t("highLoadWarning") }}
          </div>
        </div>
        <!-- cancel button -->
        <div class="mt-6">
          <button
            id="cancel-qr-button"
            class="px-6 py-2 font-black uppercase border rounded-full text-red-dark border-red-dark hover:bg-red-dark hover:text-white"
            @click="onCancel"
          >
            {{ $t("cancel") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useLazyImport from "@/composable/useLazyImport";
export default {
  components: {
    countdown: () => useLazyImport(() => import("@chenfengyuan/vue-countdown")),
  },
  props: {
    restaurantName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    id: {
      type: [String, Number],
      required: true,
    },
    chargeAmount: {
      type: [String, Number],
      required: true,
    },
    qrCodeUrl: {
      type: String,
      required: true,
    },
    qrCountDown: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      imgKey: 0,
    };
  },
  methods: {
    onTimerEnded() {
      this.$emit("on-timer-ended");
    },
    countDownTransform(props) {
      Object.entries(props).forEach(([key, value]) => {
        // Adds leading zero
        const digits = value < 10 ? `0${value}` : value;
        props[key] = `${digits}`;
      });

      return props;
    },
    onCancel() {
      this.$emit("on-cancel");
    },
    reloadQr() {
      this.$nextTick(() => {
        this.imgKey = Date.now();
      });
    },
  },
};
</script>
<i18n>
{
  "en": {
    "qrExpiredWithin": "QR Code will be expired within",
    "instruction1": "Turn on your Banking application and select “scan QR code” function.",
    "instruction2": "Check the payment amount and scan QR on the left to pay.",
    "instruction3": "Payment successful!.",
    "reloadQr": "Reload QR code",
    "chargeSummary": "Charge summary",
    "orderId": "Order ID",
    "reservationId": "Reservation ID",
    "remainingAmount": "*Remaining amount will need to be paid at restaurant.",
    "totalChargeAmount": "Total Charge Amount",
    "totalPrepaidAmound": "Total Prepaid Amount",
    "totalOrderValue": "Total Order Value",
    "totalPayAtRestaurant": "Total Pay At Restaurant",
    "pendingCharge": "We Will Charge Your Payment Once The Restaurant Confirm Your Seat",
    "chargedSummary": "Charged Summary",
    "viewMenu": "View Menu",
    "deliveryFee": "Delivery Fee",
    "closeDetail": "Close Details"
  },
  "th": {
    "qrExpiredWithin": "โค้ด QR จะหมดอายุภายใน",
    "instruction1": "เปิดแอปพลิเคชั่นธนาคารของคุณและเลือก “แสกน QR Code”",
    "instruction2": "ตรวจสอบยอดเงินและแสกนโค้ดเพื่อชำระ",
    "instruction3": "การจ่ายเงินเสร็จสิ้น",
    "reloadQr": "เปลี่ยน QR Code",
    "chargeSummary": "สรุปยอดเงิน",
    "orderId": "รหัสยืนยัน",
    "reservationId": "รหัสยืนยัน",
    "remainingAmount": "*ชำระเงินที่หน้าร้าน.",
    "totalPrepaidAmound": "จำนวนเงินที่ชำระล่วงหน้า",
    "totalChargeAmount": "ราคาสุทธิ",
    "totalOrderValue": "ยอดรวมทั้งสิ้น",
    "totalPayAtRestaurant": "ยอดรวมที่ต้องจ่ายที่ร้านอาหาร",
    "pendingCharge": "เมื่อร้านอาหารยืนยันที่นั่งแล้ว ทางร้านจะขอเก็บค่ามัดจำ",
    "chargedSummary": "สรุปยอดเงิน",
    "viewMenu": "ดูเมนู",
    "deliveryFee": "ค่าจัดส่ง",
    "closeDetail": "ปิด"
  }
}
</i18n>
