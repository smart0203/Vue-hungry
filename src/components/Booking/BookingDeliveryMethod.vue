<template>
  <div class="px-2 mx-auto">
    <h4 class="text-base font-black text-center lg:text-xl">
      {{
        forceMobileVersion
          ? `${order}. ${$t("selectMethod")}`
          : `${order}. ${$t("selectMethod")}`
      }}
    </h4>
    <div class="flex items-center justify-center mx-auto mt-3 lg:mt-6 lg:mb-3">
      <button
        v-if="
          getSelectedPackageDeliveryType ===
            DELIVERY_METHOD_PICKUP_AND_DELIVERY ||
          getSelectedPackageDeliveryType === DELIVERY_METHOD_PICKUP
        "
        id="self-pickup-button"
        class="w-1/2 h-12 px-2 py-2 mr-2 text-sm font-black leading-normal border rounded-full cursor-pointer border-red-dark lg:text-base delivery-method-button self-pickup-button"
        :class="
          bookingMethod === PICK_UP
            ? 'bg-red-pink text-red-dark'
            : 'text-red-dark bg-white'
        "
        @click="setBookingMethod(PICK_UP)"
      >
        {{ $t("selfPickUp") }}
      </button>
      <button
        v-if="
          getSelectedPackageDeliveryType ===
            DELIVERY_METHOD_PICKUP_AND_DELIVERY ||
          getSelectedPackageDeliveryType === DELIVERY_METHOD_DELIVERY
        "
        id="delivery-button"
        class="w-1/2 h-12 px-2 py-2 text-sm font-black leading-normal border rounded-full cursor-pointer border-red-dark lg:text-base delivery-method-button"
        :class="
          bookingMethod === DELIVERY
            ? 'bg-red-pink text-red-dark'
            : 'text-red-dark bg-white'
        "
        @click="setBookingMethod(DELIVERY)"
      >
        {{ $t("delivery") }}
      </button>
    </div>
    <template v-if="showCookingTime">
      <div class="flex items-center justify-center mt-2">
        <img
          src="@/assets/icon-time-red.png"
          class="flex-shrink-0 mr-2"
          width="15"
           loading="lazy"
          height="15"
          alt
        />
        <div
          class="text-sm"
          v-html="$t('readyToPickupAt', { minute: cookingTime })"
        ></div>
      </div>
    </template>
    <template v-else-if="bookingMethod === DELIVERY">
      <div class="mx-auto" :class="!forceMobileVersion ? 'px-1' : 'w-11/12'">
        <!-- input location  -->
        <InputDelivery key="input-delivery-confirmation-page" class="mt-3" />
        <!-- input delivery message -->
        <template
          v-if="
            isLoadingDeliveryInformation === false &&
            isPartialChargeSuccess &&
            distanceToRestaurant.success
          "
        >
          <div class="flex pb-2 border-b border-black input-with-icon">
            <img
              class="icon icon-left"
              src="@/assets/icon-note-red.png"
              alt="icon message"
              width="18px"
               loading="lazy"
            />
            <input
              id="noteDrive"
              v-model="location.noteForDriver"
              class="flex flex-auto text-sm border-none input lg:text-sm"
              style="border-top: 0; border-right: 0; border-left: 0"
              :placeholder="$t('noteToDriver')"
              type="text"
            />
          </div>
          <!-- please recheck -->
          <div
            v-if="location.noteForDriver"
            class="my-3 text-center text-red-dark"
          >
            {{ $t("recheckYourInformation") }}
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import { mapGetters, mapState } from "vuex";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import {
  PICK_UP,
  DELIVERY,
  DELIVERY_METHOD_DELIVERY,
  DELIVERY_METHOD_PICKUP_AND_DELIVERY,
  DELIVERY_METHOD_PICKUP,
} from "@/lib/constant";
import useLazyImport from "@/composable/useLazyImport";

export default {
  components: {
    InputDelivery: () =>
      useLazyImport(() => import("@/components/InputDelivery")),
  },
  props: {
    forceMobileVersion: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      PICK_UP,
      DELIVERY,
      DELIVERY_METHOD_DELIVERY,
      DELIVERY_METHOD_PICKUP_AND_DELIVERY,
      DELIVERY_METHOD_PICKUP,
    };
  },
  computed: {
    ...mapState("restaurant", ["restaurantData", "isSupportOrderNow"]),
    ...mapGetters("booking", ["isUserPickedLocation", "pickedLocationName"]),
    ...mapGetters("bookingPackage", ["getSelectedPackageDeliveryType"]),
    ...mapFields("booking", [
      "bookingMethod",
      "location",
      "adult",
      "kids",
      "distanceToRestaurant",
    ]),
    ...mapFields("bookingCharge", [
      "isLoadingDeliveryInformation",
      "isPartialChargeSuccess",
    ]),
    ...mapGetters("bookingDateTime", ["isOrderNow"]),
    config() {
      return this.$store.state.webConfig.config;
    },
    showCookingTime() {
      return (
        this.isOrderNow &&
        this.bookingMethod === PICK_UP &&
        this.isSupportOrderNow &&
        this.restaurantData.cookingTime
      );
    },
    cookingTime() {
      return this.restaurantData.cookingTime;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.preSelectDeliveryMethod();
      this.initDeliveryPromoPopup();
    });
  },
  beforeDestroy() {
    this.removeBookingMethod();
  },
  methods: {
    setBookingMethod(method) {
      this.$store.commit("booking/setState", {
        state: "bookingMethod",
        val: method,
      });
    },
    removeBookingMethod() {
      this.$store.commit("booking/setState", {
        state: "bookingMethod",
        val: "",
      });
    },
    preSelectDeliveryMethod() {
      if (this.getSelectedPackageDeliveryType === DELIVERY_METHOD_PICKUP) {
        this.setBookingMethod(PICK_UP);
      } else if (
        this.getSelectedPackageDeliveryType === DELIVERY_METHOD_DELIVERY
      ) {
        this.setBookingMethod(DELIVERY);
      }
    },
    initDeliveryPromoPopup() {
      const content = this.restaurantData.selfPickupMessage;
      if (content) {
        const el = document.querySelector(".self-pickup-button");
        if (el) {
          const popUp = tippy(el, {
            zIndex: "40",
            theme: "yellow",
            content: content,
            allowHTML: true,
            placement: "bottom-start",
            arrow: true,
            interactive: true,
            ignoreAttributes: true,
          });
          popUp.show();
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.icon {
  width: 23px;
}

@screen lg {
  .icon {
    width: 25px;
  }
}

.input-with-icon {
  position: relative;

  .icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    &.icon-left {
      left: 5px;
      width: 20px;
    }

    &.icon-right {
      right: 5px;
      width: 25px;
    }
  }

  .input {
    min-height: 40px;
    padding-left: 30px;
    padding-right: 30px;
  }
}

.shadow {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
</style>
<i18n>
{
  "en": {
    "noteToDriver": "Note to Driver (eg. Room No, Floor, Building, Landmarks, Phone No.)",
    "selectMethod": "Select Delivery / Pickup",
    "selfPickUp": "SELF PICK UP",
    "delivery": "DELIVERY",
    "recheckYourInformation": "Please recheck your information"
  },
  "th": {
    "noteToDriver": "แจ้งคนขับ (บ้านเลขที่, ชั้น, ตึก, จุดสังเกตุ, เบอร์โทร)",
    "selectMethod": "วิธีการรับอาหาร",
    "selfPickUp": "รับด้วยตนเอง",
    "delivery": "เดลิเวอรี่",
    "recheckYourInformation": "โปรดตรวจสอบข้อมูลให้เรียบร้อย"
  }
}
</i18n>
