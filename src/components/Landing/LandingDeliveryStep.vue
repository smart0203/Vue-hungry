<template>
  <div class="container mt-4">
    <div class="mx-8 lg:mx-0">
      <template v-if="deliveryStatus === STEP_FINDING_DRIVER">
        <img
          v-if="isTHLang"
          src="@/assets/landing delivery step/order_placed_th.png"
          alt="finding driver logo"
           loading="lazy"
          class="mx-auto"

        />
        <img
          v-else
          src="@/assets/landing delivery step/order_placed_en.png"
          alt="finding driver logo"
           loading="lazy"
          class="mx-auto"
        />
      </template>
      <template v-else-if="deliveryStatus === STEP_OTW">
        <img
          v-if="isTHLang"
          src="@/assets/landing delivery step/being_collected_th.png"
          alt="finding driver logo"
          class="mx-auto"
           loading="lazy"
        />
        <img
          v-else
          src="@/assets/landing delivery step/being_collected_en.png"
          alt="finding driver logo"
          class="mx-auto"
           loading="lazy"
        />
      </template>
      <template v-else-if="deliveryStatus === STEP_PICKED_UP">
        <img
          v-if="isTHLang"
          src="@/assets/landing delivery step/on_the_way_th.png"
          alt="finding driver logo"
          class="mx-auto"
           loading="lazy"
        />
        <img
          v-else
          src="@/assets/landing delivery step/on_the_way_en.png"
          alt="finding driver logo"
          class="mx-auto"
           loading="lazy"
        />
      </template>
      <template v-else-if="deliveryStatus === STEP_DELIVERED">
        <img
          v-if="isTHLang"
          src="@/assets/landing delivery step/delivered_th.png"
          alt="finding driver logo"
          class="mx-auto"
           loading="lazy"
        />
        <img
          v-else
          src="@/assets/landing delivery step/delivered_en.png"
          alt="finding driver logo"
          class="mx-auto"
           loading="lazy"
        />
      </template>

      <!-- estimate delivery time -->
      <template v-if="deliveryEstimationLabel">
        <div class="text-center">
          <span> {{ $t("deliveryEstimated") }} : </span>
          <span class="ml-1 font-black">{{
            `${deliveryEstimationLabel}`
          }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { state, computeds } from "./landing";
const STEP_FINDING_DRIVER = "Driver::FINDING_DRIVER";
const STEP_OTW = "Driver::ON_THE_WAY_TO_RESTAURANT";
const STEP_PICKED_UP = "Driver::PICKED_UP";
const STEP_DELIVERED = "Driver::DELIVERED";
export default {
  setup() {
    const { originalId } = state;
    const {
      deliveryStatus,
      deliveryEstimationFirebase,
      deliveryEstimationLabel,
    } = computeds;
    return {
      STEP_FINDING_DRIVER,
      STEP_OTW,
      STEP_PICKED_UP,
      STEP_DELIVERED,
      originalId,
      deliveryStatus,
      deliveryEstimationFirebase,
      deliveryEstimationLabel,
    };
  },
  computed: {
    isTHLang() {
      return this.$store.state.lang === "th";
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  @apply mx-auto;

  &.right-aligned {
    @apply ml-16 lg:ml-32 mr-auto w-6/12 lg:w-5/12;

    .sub-container {
      @apply lg:w-8/12 ml-auto;
    }
  }

  &.left-aligned {
    @apply mr-16 lg:mr-32 ml-auto w-6/12 lg:w-5/12;

    .sub-container {
      @apply lg:w-3/5 mr-auto;
    }
  }

  &.center-aligned {
    @apply w-8/12 lg:w-5/12;
  }
}

.red-line {
  width: calc(100% - 60px);
  top: 40%;
  height: 2px;
  background-color: var(--main-red);
}

.step-is-not-passed img.icon-bg-red {
  z-index: -1;
}

.step-is-not-passed img,
.step-is-passed img {
  width: 50px;
}

.step-is-active {
  img {
    width: 110px;
  }

  .step-title {
    @apply text-base mt-2;
  }
}
</style>
<i18n>
{
  "en": {
    "orderBeingCollected": "Order Being <br /> Collected",
    "orderPlaced": "Order Placed",
    "otw": "On the way",
    "delivered": "Delivered"
  },
  "th": {
    "orderBeingCollected": "รับออเดอร์",
    "orderPlaced": "สั่งซื้อแล้ว",
    "otw": "กำลังจัดส่ง",
    "delivered": "จัดส่งสำเร็จแล้ว"
  }
}
</i18n>
