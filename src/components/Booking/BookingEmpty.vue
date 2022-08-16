<template>
  <div>
    <div
      class="flex items-center justify-start py-4 pl-5 pr-3 border-b border-gray-400"
    >
      <div class="relative">
        <img
          class="mr-3 empty-booking-icon"
          src="@/assets/icon-order-white.png"
          width="40"
          loading="lazy"
          alt="order icon"
        />
        <!-- <img
          v-if="false"
          loading="lazy"
          class="mr-3 filled-booking-icon"
          src="@/assets/icon-order-red.png"
          width="40"
          alt="order icon"
        /> -->
      </div>
      <span class="text-lg font-black text-red-dark">{{ buttonText }}</span>
    </div>
    <div class="flex justify-between w-10/12 py-2 mx-auto">
      <template v-if="allowBoth">
        <button
          id="go-order-button"
          class="w-full py-2 mr-4 font-black leading-normal text-white uppercase border-none rounded-full cursor-pointer bg-red-dark"
          @click="scrollDeliverySection"
        >
          {{ $t("order") }}
        </button>
        <button
          id="go-book-button"
          class="w-full py-2 font-black leading-normal text-white uppercase border-none rounded-full cursor-pointer bg-red-dark"
          @click="goToBooking()"
        >
          {{ $t("book") }}
        </button>
      </template>

      <template v-else-if="allowBook">
        <button
          id="go-book-button"
          class="w-full py-2 font-black leading-normal text-white uppercase border-none rounded-full cursor-pointer bg-red-dark"
          @click="goToBooking()"
        >
          {{ $t("bookNow") }}
        </button>
      </template>
      <template v-else-if="allowOrder">
        <button
          id="go-order-button"
          class="w-full py-2 font-black leading-normal text-white uppercase border-none rounded-full cursor-pointer bg-red-dark"
          @click="scrollDeliverySection"
        >
          {{ $t("orderNow") }}
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import {
  PACKAGE_PREFERENCE_DINE_IN,
  PACKAGE_PREFERENCE_XPERIENCE,
} from "@/lib/constant";

export default {
  props: {
    allowBook: {
      type: Boolean,
    },
    allowOrder: {
      type: Boolean,
    },
    showRedIcon: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapFields("booking", ["packagePreference"]),
    allowBoth() {
      return this.allowBook && this.allowOrder ? true : false;
    },
    buttonText() {
      if (this.allowBoth) {
        return this.$t("clickToBookOrder");
      } else if (this.allowBook) {
        return this.$t("clickToBook");
      } else if (this.allowOrder) {
        return this.$t("clickToOrder");
      } else {
        return this.$t("clickToBook");
      }
    },
  },
  methods: {
    goToBooking() {
      this.packagePreference = `${PACKAGE_PREFERENCE_XPERIENCE}/${PACKAGE_PREFERENCE_DINE_IN}`;
      this.$store.dispatch("booking/initBookingFlow", this.isMobile);
    },
    scrollDeliverySection() {
      const deliveryPackageSection =
        document.querySelector(".delivery-package");
      if (deliveryPackageSection) {
        deliveryPackageSection.scrollIntoView();
      }
      const orderButton = document.querySelectorAll(".order-button");
      orderButton.forEach((button) => {
        button.classList.add("bounce-top");
      });
      // emit event
      this.$emit("on-order-button-clicked");
    },
  },
};
</script>

<style scoped>
.filled-booking-icon {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
<i18n>
{
  "en": {
    "clickToBookOrder": "Click to Book / Order!",
    "clickToBook": "Click to Book",
    "clickToOrder": "Click to Order"
  },
  "th": {
    "clickToBookOrder": "จองโต๊ะ/สั่งกลับบ้าน",
    "clickToBook": "จองโต๊ะ",
    "clickToOrder": "สั่งกลับบ้าน"
  }
}
</i18n>
