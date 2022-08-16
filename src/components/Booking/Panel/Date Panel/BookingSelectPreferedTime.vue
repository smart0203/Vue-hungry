<template>
  <div>
    <!-- order now button -->
    <div
      class="flex flex-col p-3 mx-2 mb-3 border rounded-full cursor-pointer lg:p-2 border-red-dark"
      :class="
        preferedOrderTime === ORDER_NOW
          ? 'bg-red-light text-white'
          : 'bg-white text-red-dark'
      "
      @click="$emit('on-prefered-time-selected', ORDER_NOW)"
    >
      <span
        class="text-base font-black leading-normal text-center lg:text-sm"
        :class="isSupportOrderNow ? 'my-2' : 'mb-1 '"
        >{{ $t("orderNow") }}</span
      >
      <div v-if="!isSupportOrderNow" class="text-sm text-center">
        <div class="flex items-center justify-center mb-1">
          <span>
            <img
              src="@/assets/icon-time-red.png"
              class="mr-1"
              width="14"
               loading="lazy"
              height="14"
              alt="icon time"
            />
          </span>
          {{ $t("receiveAt", { time: todayFastestBookingTime }) }}
        </div>
        <div>{{ $dayjs().format("dddd DD/MM/YYYY") }}</div>
      </div>
    </div>
    <!-- order later button -->
    <div
      class="flex flex-col p-3 mx-2 mb-2 border rounded-full cursor-pointer lg:p-2 border-red-dark"
      :class="
        preferedOrderTime === ORDER_LATER
          ? ' bg-red-light text-white'
          : 'bg-white text-red-dark'
      "
      @click="$emit('on-prefered-time-selected', ORDER_LATER)"
    >
      <span
        class="mb-1 text-base font-black leading-normal text-center lg:text-sm"
        >{{ $t("orderLater") }}</span
      >
      <div class="text-xs text-center">
        <span class="mr-1">{{ $t("chooseDateTime") }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import { mapState } from "vuex";
import { ORDER_NOW, ORDER_LATER } from "@/lib/constant";

export default {
  data() {
    return {
      ORDER_NOW,
      ORDER_LATER,
    };
  },
  computed: {
    ...mapState("restaurant", ["isSupportOrderNow"]),
    ...mapState("bookingDateTime", [
      "isTodayAvailableForBooking",
      "todayFastestBookingTime",
    ]),
    ...mapFields("booking", ["selectedDate", "selectedTime"]),
    ...mapFields("bookingDateTime", ["preferedOrderTime"]),
  },
};
</script>
<i18n>
{
  "en": {
    "chooseDateTime": "Choose date & time",
    "orderLater": "ORDER LATER",
    "orderNow": "ORDER NOW",
    "receiveAt": "Receive at {time}"
  },
  "th": {
    "chooseDateTime": "เลือกวันและเวลา",
    "orderLater": "สั่งซื้อทีหลัง",
    "orderNow": "สั่งซื้อตอนนี้",
    "receiveAt": "ได้รับตอน {time}"
  }
}
</i18n>
