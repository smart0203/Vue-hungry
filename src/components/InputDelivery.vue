<template>
  <div>
    <PickLocation
      :location="location"
      :show-additional-address="!noPackages"
      @on-location-pick="setUserLocation"
    >
      <template #default="{ openPickLocationModal }">
        <div
          class="flex cursor-pointer input-with-icon delivery-input-location"
          @click="openPickLocationModal"
        >
          <img
            class="icon icon-left"
            loading="lazy"
            src="@/assets/icon-location-red.png"
            alt
          />
          <div class="flex items-center flex-auto border rounded-full input">
            <div
              class="text-xs input-location lg:text-sm"
              v-html="
                isUserPickedLocation ? pickedLocationName : $t('selectLocation')
              "
            ></div>
          </div>

          <img
            class="icon icon-right"
            loading="lazy"
            src="@/assets/icon-target-red.png"
            alt
          />
        </div>
      </template>
    </PickLocation>
    <!-- checking delivery fee -->
    <div>
      <template v-if="isLoadingDeliveryInformation">
        <div class="flex items-center mt-2">
          <span class="mr-2 text-xs lg:text-sm">{{ $t("calculating") }}</span>
          <div class="loader small"></div>
        </div>
      </template>
      <template v-else-if="isLoadingDeliveryInformation === false">
        <template v-if="isPartialChargeSuccess && distanceToRestaurant.success">
          <!-- delivery information -->
          <div class="flex items-start mt-3 mb-2 text-sm">
            <!-- left column -->
            <div
              v-if="allowShowDeliveryFee"
              class="flex flex-col items-center w-8/12 mr-2 lg:w-7/12"
            >
              <!-- delivery fee -->
              <div class="flex items-start w-full mb-2 lg:items-center">
                <img
                  src="@/assets/icon-price-red.png"
                  class="flex-shrink-0"
                  width="20"
                  height="20"
                  loading="lazy"
                  alt
                />
                <div
                  class="flex flex-col flex-wrap flex-auto ml-2 text-xs lg:text-xs"
                >
                  <template v-if="noPackages">
                    <DeliveryPricingTier
                      :restaurant-id="restaurantId"
                      :distance="distanceToRestaurant.value || undefined"
                      :class="`delivery-pricing-tier-${randomID}`"
                      :need-check-belong="true"
                    />
                  </template>
                  <template v-else>
                    <div class="flex font-bold whitespace-nowrap lg:mr-4">
                      <span class="text-black capitalize">{{
                        $t("deliveryFee")
                      }}</span>
                      <span
                        v-if="isFreeDeliveryFee"
                        class="ml-1 uppercase text-green"
                        >{{ $t("free") }}</span
                      >
                      <span
                        v-if="!isFreeDeliveryFee"
                        class="ml-1 text-red-dark"
                        >{{ $money(originalDeliveryFee) }}</span
                      >
                    </div>
                    <div class="">
                      <!-- delivery pricing tier -->
                      <button
                        class="px-2 text-xs capitalize border rounded-full cursor-pointer border-red-dark text-red-dark hover:underline"
                        :class="`delivery-pricing-tier-button-${randomID}`"
                        @click="showPopup"
                      >
                        {{ $t("viewDetai") }}
                      </button>
                    </div>
                  </template>
                </div>
              </div>
              <!-- delivery time estimation -->
              <div
                v-if="showOrderTimeEstimation"
                class="flex items-start w-full lg:items-center"
              >
                <img
                  src="@/assets/icon-time-red.png"
                  class="flex-shrink-0"
                  width="20"
                  height="20"
                  loading="lazy"
                  alt
                />
                <div class="flex flex-wrap flex-auto ml-2 text-xs lg:text-xs">
                  <div class="flex font-bold whitespace-nowrap lg:mr-4">
                    <span
                      class="text-black capitalize"
                      v-html="$t('deliveryNow', { minute: orderNowEstimation })"
                    >
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <!-- right column -->
            <div
              class="flex items-center flex-auto flex-shrink-0 w-4/12 text-xs lg:pl-3 lg:pl-0 lg:w-5/12"
            >
              <img
                src="@/assets/icon-distance-red.png"
                width="20"
                height="20"
                alt
                loading="lazy"
              />
              <div
                v-if="distanceToRestaurant.text"
                class="flex-auto ml-2"
                v-html="
                  $t('distanceToRestaurant', {
                    value: distanceToRestaurant.text,
                  })
                "
              ></div>
            </div>
          </div>
        </template>
        <div v-else class="mt-2 text-red-dark">
          {{ distanceToRestaurant.text || $t("failedCalculatingFee") }}
        </div>
      </template>
    </div>

    <modal name="delivery-pricing-modal" width="80%" height="auto" adaptive>
      <div class="text-black">
        <img
          class="mt-1 ml-1 cursor-pointer"
          src="@/assets/icon-close-black.png"
          width="15"
          height="15"
          loading="lazy"
          alt="close icon"
          @click="$modal.hide('delivery-pricing-modal')"
        />
      </div>
      <div class="px-4 py-6">
        <p class="pt-3 pb-4 text-sm font-black text-center uppercase">
          {{ $t("freeDeliveryPromotion") }}
        </p>
        <DeliveryPricingTier
          :restaurant-id="restaurantId"
          :distance="distanceToRestaurant.value || undefined"
        />
      </div>
    </modal>

    <div :class="`delivery-pricing-tier-${randomID}`" class="hidden px-3 pb-3">
      <p class="pt-3 pb-4 text-sm font-black text-center uppercase">
        {{ $t("freeDeliveryPromotion") }}
      </p>
      <DeliveryPricingTier
        :restaurant-id="restaurantId"
        :distance="distanceToRestaurant.value || undefined"
      />
    </div>
  </div>
</template>

<script>
import {
  storageSetUserLocation,
  storageGetUserLocation,
} from "@/lib/localStorage";
import { mapFields } from "vuex-map-fields";
import { mapGetters } from "vuex";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import {
  checkOrderNowEstimation,
  isSuccess as orderNowIsSuccess,
  errorMessage as orderNowErrorMessage,
  orderNowEstimation,
} from "@/composable/orderTimeEstimation";
import {
  computeds as voucherComputeds,
  methods as voucherMethods,
} from "@/composable/voucher";

import { nanoid } from "nanoid";
import { isValid as isValidCorporateBooking } from "@/composable/corporateEvent";
import { calculateCharge } from "@/composable/calculateCharge";
import useLazyImport from "@/composable/useLazyImport";

let timeOutDeliveryPricingTier;
let timeOutDeliveryPromo;
export default {
  components: {
    PickLocation: () =>
      useLazyImport(() =>
        import("@/components/Shared/Pick Location/PickLocation")
      ),
    DeliveryPricingTier: () =>
      useLazyImport(() =>
        import("@/components/Shared/delivery/DeliveryPricingTier.vue")
      ),
  },
  props: {
    noPackages: {
      type: Boolean,
      default: false,
    },
    showPromotion: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { anyValidVoucherApplied } = voucherComputeds;
    const { useVoucher } = voucherMethods;
    return {
      useVoucher,
      anyValidVoucherApplied,
      orderNowIsSuccess,
      orderNowErrorMessage,
      orderNowEstimation,
    };
  },
  data() {
    return {
      popUp: "",
      deliveryTierPopup: "",
      orderTimeEstimation: null,
      pricingTier: [],
      randomID: nanoid(10),
      restaurantId: "",
      selfPickupMessage: "",
      isSupportOrderNow: false,
    };
  },
  computed: {
    ...mapGetters("booking", ["isUserPickedLocation", "pickedLocationName"]),
    ...mapFields("booking", [
      "adult",
      "kids",
      "location",
      "distanceToRestaurant",
      "bookingMethod",
    ]),
    ...mapFields("bookingCharge", [
      "originalDeliveryFee",
      "isLoadingDeliveryInformation",
      "isPartialChargeSuccess",
    ]),
    ...mapGetters("bookingPackage", ["getSelectedPackagDeliveryConfig"]),
    ...mapGetters("bookingDateTime", ["isOrderNow"]),
    config() {
      return this.$store.state.webConfig.config;
    },
    deliveryConfig() {
      if (!this.getSelectedPackagDeliveryConfig) {
        return this.config;
      }
      return this.getSelectedPackagDeliveryConfig.deliveryFeePerKmInBaht >
        this.config.deliveryFeePerKmInBaht
        ? this.config
        : this.getSelectedPackagDeliveryConfig;
    },
    isFreeDeliveryFee() {
      return this.originalDeliveryFee <= 0 ? true : false;
    },
    showOrderTimeEstimation() {
      return (
        this.orderNowEstimation &&
        this.isSupportOrderNow &&
        !this.noPackages &&
        this.isOrderNow
      );
    },
    allowShowDeliveryFee() {
      return !isValidCorporateBooking.value;
    },
  },
  created() {
    this.setDataFromStore();
  },
  mounted() {
    this.getSavedUserLocation();
    this.initDeliveryPricingTierPopup();
    this.initDeliveryPromoPopup();
  },
  beforeDestroy() {
    clearTimeout(timeOutDeliveryPricingTier);
    clearTimeout(timeOutDeliveryPromo);
  },
  methods: {
    setDataFromStore() {
      // get data from vuex but not binding it
      const restaurantId = this.$store.state.restaurant.restaurantId;
      const { selfPickupMessage } = this.$store.state.restaurant.restaurantData;
      const isSupportOrderNow = this.$store.state.restaurant.isSupportOrderNow;
      this.isSupportOrderNow = isSupportOrderNow;
      this.restaurantId = restaurantId;
      this.selfPickupMessage = selfPickupMessage;
    },
    getSavedUserLocation() {
      const savedLocation = storageGetUserLocation();
      if (savedLocation) {
        this.location = savedLocation;
        this.calculateDeliveryTimeEstimation();
        this.populateDeliveryInformation();
      }
    },
    setUserLocation(location) {
      this.$store.dispatch("booking/setUserLocation", location);
      storageSetUserLocation(location);
      this.calculateDeliveryTimeEstimation();
      this.populateDeliveryInformation();
    },
    async populateDeliveryInformation() {
      try {
        this.isLoadingDeliveryInformation = true;
        await this.$store.dispatch("booking/fetchLalamoveDistance");
        await calculateCharge(this.noPackages);
        this.isLoadingDeliveryInformation = false;
      } catch (error) {
        this.isLoadingDeliveryInformation = false;
        if (!error.dontReport) {
          this.trackError("failed calculate delivery fee", error);
        }
      }
    },
    async calculateDeliveryTimeEstimation() {
      if (!this.noPackages) {
        await checkOrderNowEstimation();
        if (!this.orderNowIsSuccess) {
          this.$alert.error(this.orderNowErrorMessage);
        }
      }
    },
    initDeliveryPromoPopup() {
      this.$nextTick(() => {
        if (this.showPromotion) {
          timeOutDeliveryPromo = setTimeout(() => {
            const content = this.selfPickupMessage;
            if (content) {
              const el = document.querySelector(".delivery-input-location");
              if (el) {
                this.popUp = tippy(el, {
                  zIndex: "40",
                  theme: "yellow",
                  content: content,
                  allowHTML: true,
                  placement: "bottom-start",
                  arrow: true,
                  interactive: true,
                  ignoreAttributes: true,
                });
                this.popUp.show();
              }
            }
          }, 1500);
        }
      });
    },
    initDeliveryPricingTierPopup() {
      if (this.noPackages) {
        return;
      }
      timeOutDeliveryPricingTier = setTimeout(() => {
        const trigger = document.querySelector(
          `.delivery-pricing-tier-button-${this.randomID}`
        );
        const content = document.querySelector(
          `.delivery-pricing-tier-${this.randomID}`
        );
        this.deliveryTierPopup = tippy(trigger, {
          theme: "opening-hour-popup",
          content: content.innerHTML,
          allowHTML: true,
          placement: "bottom-start",
          arrow: false,
          interactive: true,
          ignoreAttributes: true,
          onShown: () => {},
        });
      }, 1000);
    },
    showPopup() {
      if (this.isMobile) {
        this.$modal.show("delivery-pricing-modal");
        return;
      }
      this.initDeliveryPricingTierPopup();
    },
  },
};
</script>
<style lang="scss" scoped>
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
</style>
<i18n>
{
  "en": {
    "selectLocation": "Please enter the address to &nbsp;<b>calculate the delivery fee</b>",
    "distanceToRestaurant": "<span class='font-bold text-black'>Distance</span> <span class='font-bold text-red-dark'>{value} km</span> <span class='text-gray-600 whitespace-nowrap'>from restaurant</span>",
    "deliveryFee": "Delivery Fee",
    "failedCalculatingFee": "Failed calculate delivery fee",
    "calculating": "Calculating",
    "freeDeliveryPromotion": "Free delivery promotion"
  },
  "th": {
    "selectLocation": "โปรดใส่ที่อยู่ เพื่อคำนวณค่าจัดส่ง",
    "distanceToRestaurant": "<span class='font-bold text-black'>ระยะทาง</span> <span class='font-bold text-red-dark'>{value} กม.</span> <span class='text-gray-600 whitespace-nowrap'>จากร้านอาหาร</span>",
    "deliveryFee": "ค่าส่ง",
    "failedCalculatingFee": "Failed calculate delivery fee",
    "calculating": "กำลังคำนวณ",
    "freeDeliveryPromotion": "โปรโมชั่นส่งฟรี"
  }
}
</i18n>
