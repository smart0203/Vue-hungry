<template>
  <div>
    <div class="flex flex-col">
      <template v-if="needCheckBelong">
        <div v-if="showedTier.length">
          <div
            v-for="tier in showedTier"
            :key="tier.id"
            class="flex text-xs lg:text-sm"
          >
            <div class="flex">
              <span
                class="font-bold capitalize"
                :class="
                  isBelongToTier(tier.freeDeliveryRadiusInKm)
                    ? ' text-green'
                    : null
                "
                >{{
                  isBelongToTier(tier.freeDeliveryRadiusInKm)
                    ? $t("freeDelivery")
                    : $t("deliveryFee")
                }}</span
              >
              <span
                v-if="!isBelongToTier(tier.freeDeliveryRadiusInKm)"
                class="font-bold"
                style="margin-left: 2px"
              >
                {{ $money(tier.chargedDeliveryFee) }}</span
              >
              <span
                v-if="tier.startRatePrice"
                style="margin-left: 4px"
                class="text-red-dark"
              >
                ({{
                  $t("spend", {
                    value: `${$formatThousand(tier.startRatePrice)}฿+`,
                  })
                }})</span
              >
            </div>
          </div>
        </div>

        <div v-else>
          <div v-for="tier in pricingTier" :key="tier.id" class="flex">
            <div class="flex">
              <span class="mr-1 font-bold capitalize">{{
                $t("deliveryFee")
              }}</span>
              <span class="font-bold">{{
                $money(tier.chargedDeliveryFee)
              }}</span>
              <span v-if="tier.startRatePrice" class="text-red-dark"
                >({{
                  $t("spend", {
                    value: `${$formatThousand(tier.startRatePrice)}฿+`,
                  })
                }})</span
              >
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-for="tier in pricingTier" :key="tier.id" class="flex text-sm">
          <div style="min-width: 110px">
            <span v-if="tier.startRatePrice">
              {{ $t("spend", { value: $money(tier.startRatePrice) }) }}</span
            >
            <span v-else>{{ $t("noMinimumCharge") }}</span>
          </div>
          <div>
            <span v-if="tier.startRatePrice">
              {{
                $t("deliveryPricingTierText", {
                  distance: tier.freeDeliveryRadiusInKm,
                  pricePerKM: $money(tier.deliveryFeePrice),
                })
              }}
            </span>
            <span v-else>
              {{
                $t("deliveryHelperText", {
                  distance: tier.freeDeliveryRadiusInKm,
                  exceedDeliveryFee: $money(tier.deliveryFeePrice),
                })
              }}
            </span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import sortBy from "lodash-es/sortBy";
import { getPricingTier } from "@/services/getDeliveryPricingTier";
export default {
  props: {
    restaurantId: {
      required: true,
    },
    distance: {
      required: true,
    },
    needCheckBelong: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      pricingTier: [],
      belongToTier: null,
      showedTier: [],
    };
  },
  watch: {
    distance: {
      handler(newVal) {
        if (newVal !== null || newVal !== undefined) {
          this.checkBelongToTierGroup();
        }
      },
    },
  },
  mounted() {
    this.onMounted();
  },
  methods: {
    async onMounted() {
      await this.populatePricingTier();
      if (this.pricingTier && this.pricingTier.length) {
        this.checkBelongToTierGroup();
      }
    },
    async populatePricingTier() {
      if (!this.restaurantId) {
        this.$rollbar.error(
          "Failed get delivery pricing tier Missing restaurant id"
        );
        return;
      }
      const response = await getPricingTier(this.restaurantId);
      if (response.isSuccess) {
        this.pricingTier = sortBy(response.data, ["freeDeliveryRadiusInKm"]);
        return;
      }
      this.$alert.error(response.message);
    },
    isBelongToTier(freeDeliveryRadiusInKm) {
      return this.belongToTier === freeDeliveryRadiusInKm;
    },
    checkBelongToTierGroup() {
      this.showedTier = [];
      if (!this.pricingTier) {
        return;
      }
      if (this.distance !== null || this.distance !== undefined) {
        this.pricingTier.forEach((tier, index) => {
          this.calculateChargedDeliveryFee(tier);
          const prevTier = this.pricingTier[index - 1];
          const prevTierDeliveryRadius = prevTier?.freeDeliveryRadiusInKm || 0;
          if (
            this.distance > prevTierDeliveryRadius &&
            this.distance <= tier.freeDeliveryRadiusInKm
          ) {
            if (index !== 0) {
              for (let innerIndex = 0; innerIndex < index; innerIndex++) {
                const element = this.pricingTier[innerIndex];
                this.showedTier.push(element);
              }
            }
            this.showedTier.push(tier);
          }
        });
      }
      this.belongToTier =
        this.showedTier && this.showedTier.length
          ? this.showedTier[this.showedTier.length - 1].freeDeliveryRadiusInKm
          : null;
    },
    calculateChargedDeliveryFee(tier) {
      tier.chargedDeliveryFee = 0;
      if (tier && typeof tier.freeDeliveryRadiusInKm === "number") {
        const chargedDistance = this.distance - tier.freeDeliveryRadiusInKm;
        tier.chargedDeliveryFee = chargedDistance * tier.deliveryFeePrice;
      }
    },
  },
};
</script>
<i18n>
{
  "en": {
    "deliveryHelperText": "Free Delivery for the first {distance} km, {exceedDeliveryFee}/km after that.",
    "deliveryPricingTierText": "Get {distance} km FREE and {pricePerKM}/km after that",
    "noMinimumCharge": "No minimum charge",
    "spend": "Spend {value}"
  },
  "th": {
    "deliveryHelperText": "ฟรีค่าส่ง {distance} กม.แรก และกิโลเมตรต่อไป {exceedDeliveryFee} บาท/กม.",
    "deliveryPricingTierText": "ส่งฟรี {distance} แรก และกิโลเมตรต่อไป {pricePerKM} บาท/กม.",
    "noMinimumCharge": "ไม่มีค่าใช้จ่ายขั้นต่ำ",
    "spend": "ค่าใช้จ่าย {value}"
  }
}
</i18n>
