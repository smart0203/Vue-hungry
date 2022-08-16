<template>
  <HHPopup
    name="landing-help"
    :is-tooltip-desktop="false"
    :modal-width="isDesktop ? '300' : '80%'"
    :is-show="isShow"
    :show-close-button="true"
    :close-on-bg-click="true"
    @on-closed="onClosed"
  >
    <div class="flex flex-col items-center justify-center py-2">
      <div class="my-2 font-black">{{ $t("getHelpOnOrder") }}</div>
      <template v-if="hungryhubPhone">
        <div class="text-sm">
          {{ $t("callHungryhub") }}
        </div>
        <button
          class="flex px-3 py-2 mb-3 text-sm font-black text-white border rounded-full bg-red-dark"
        >
          <img
            src="@/assets/icon-phone-white.png"
            width="16"
            height="16"
            class="mr-2"
             loading="lazy"
            alt="icon phone"
          />

          <a class="text-white" :href="`tel:${hungryhubPhone}`">{{
            hungryhubPhone
          }}</a>
        </button>
      </template>
      <template v-if="isDelivery && driverPhone">
        <div class="text-sm">
          {{ $t("callDriver") }}
        </div>
        <button
          class="flex px-3 py-2 mb-3 text-sm font-black text-white border rounded-full bg-red-dark"
        >
          <img
            src="@/assets/icon-phone-white.png"
            width="16"
            height="16"
            class="mr-2"
             loading="lazy"
            alt="icon phone"
          />
          <a class="text-white" :href="`tel:${driverPhone}`">{{
            driverPhone
          }}</a>
        </button>
      </template>
      <template v-if="restaurantPhone">
        <div class="text-sm">
          {{ $t("callRestaurant") }}
        </div>
        <button
          class="flex px-3 py-2 mb-3 text-sm font-black text-white border rounded-full bg-red-dark"
        >
          <img
            src="@/assets/icon-phone-white.png"
            width="16"
             loading="lazy"
            height="16"
            class="mr-2"
            alt="icon phone"
          />
          <a class="text-white" :href="`tel:${restaurantPhone}`">{{
            restaurantPhone
          }}</a>
        </button>
      </template>
    </div>
  </HHPopup>
</template>

<script>
import useLazyImport from "@/composable/useLazyImport";
import { state } from "./landing";

export default {
  components: {
    HHPopup: () => useLazyImport(() => import("@/components/Shared/HHPopup")),
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    restaurantPhone: {
      type: String,
      default: "",
    },
    hungryhubPhone: {
      type: String,
      default: "",
    },
    driverPhone: {
      type: String,
      default: "",
    },
  },
  setup() {
    const { isDelivery } = state;
    return {
      isDelivery,
    };
  },
  computed: {},
  methods: {
    onClosed() {
      this.$emit("on-closed");
    },
  },
};
</script>
<i18n>
{
  "en": {
    "getHelpOnOrder": "Get help on your order",
    "callHungryhub": "Call Hungry Hub",
    "callRestaurant": "Call Restaurant",
    "callDriver": "Call Driver"
  },
  "th": {
    "getHelpOnOrder": "ขอความช่วยเหลือเกี่ยวกับการสั่งซื้อของคุณ",
    "callHungryhub": "โทรหา Hungry Hub",
    "callRestaurant": "โทรหาร้านอาหาร",
    "callDriver": "โทรหาคนขับ"
  }
}
</i18n>
