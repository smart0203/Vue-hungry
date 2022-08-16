<template>
  <div class>
    <!-- pre header -->
    <template v-if="isDesktop">
      <div class="flex items-center pt-6 pb-2">
        <div class="mx-2">
          <div class="relative cart">
            <img
              :src="cartIcon"
              width="40px"
               loading="lazy"
              class="ml-4 mr-2"
              alt="cart icon"
            />
            <span class="text-sm font-black counter">
              {{ selectedPackageCount }}
            </span>
          </div>
        </div>
        <h4 class="flex-auto m-0 ml-1 text-xl font-black capitalize">
          {{ isDineIn ? $t("youAreBooking") : $t("youAreOrdering") }}
        </h4>
      </div>
    </template>
    <template v-else>
      <div class="flex items-center justify-center mx-auto font-black">
        <div class="flex items-center justify-center w-full px-3">
          <h4 class="my-3 text-lg" @click="$emit('on-back-clicked')">
            {{ restaurantName }}
          </h4>
        </div>
      </div>
    </template>
    <div v-if="allowShowBookingStep" class="flex px-4">
      <!-- step 1 -->
      <button
        id="step-0-button"
        class="w-1/3 p-2 my-2 bg-white border-none cursor-pointer lg:m-0 stepper-panel"
        @click="changeStep(1)"
      >
        <div class="relative">
          <img
            class="inline-block"
             loading="lazy"
            :src="stepOneIcon[0]"
            :style="panelIconStyle"
            alt="step image"
          />
          <div
            class="absolute top-0 left-0 flex items-center justify-center w-full mx-auto"
            style="z-index: 1"
          >
            <img
              class="inline-block"
              :src="stepOneIcon[1]"
              :style="panelIconStyle"
               loading="lazy"
              alt="step image"
            />
          </div>
        </div>
        <div
          class="mt-1 text-sm uppercase"
          :class="[step >= 1 ? 'text-red-dark' : '']"
        >
          {{ stepOneName }}
        </div>
      </button>
      <!-- step 2 & 3 -->
      <button
        id="date-time-step-button"
        class="w-1/3 p-2 m-0 my-2 bg-white border-none cursor-pointer stepper-panel"
        @click="changeStep(2)"
      >
        <div class="relative">
          <img
            :src="stepTwoIcon[0]"
            :style="panelIconStyle"
            alt="step image"
             loading="lazy"
            class="inline-block"
          />
          <div
            class="absolute top-0 left-0 flex items-center justify-center w-full mx-auto"
            :style="dateTimePanelStyle"
          >
            <img
              :src="stepTwoIcon[1]"
              :style="panelIconStyle"
               loading="lazy"
              alt="step image"
              class="inline-block"
            />
          </div>
        </div>
        <div
          class="mt-1 text-sm uppercase"
          :class="[step >= 2 ? 'text-red-dark' : 'text-gray-400']"
        >
          {{ stepTwoName }}
        </div>
      </button>
      <!-- step 4 -->
      <button
        id="last-step-button"
        class="w-1/3 p-2 m-0 my-2 bg-white border-none cursor-pointer stepper-panel"
        @click="changeStep(isDineIn && isFlowSelectDateFirst ? 4 : 5)"
      >
        <div class="relative">
          <img
            :src="stepThreeIcon[0]"
            :style="isDesktop ? 'width: 35px' : 'width: 40px'"
            alt=""
             loading="lazy"
            class="inline-block"
          />
          <div
            class="absolute top-0 left-0 flex items-center justify-center w-full mx-auto"
            :style="paymentPanelStyle"
          >
            <img
              :src="stepThreeIcon[1]"
              :style="isDesktop ? 'width: 35px' : 'width: 40px'"
              class="inline-block"
               loading="lazy"
              alt=""
            />
          </div>
        </div>
        <div
          class="mt-1 text-sm uppercase"
          :class="[step >= 4 ? 'text-red-dark' : 'text-gray-400']"
        >
          {{ stepThreeName }}
        </div>
      </button>
    </div>
    <!-- Indicator -->
    <div
      v-if="allowShowBookingStep"
      class="flex justify-center mx-auto text-center"
    >
      <div class="flex items-center flex-auto stepper-indicator">
        <div class="w-full">
          <div class="line-left" :class="[step >= 1 ? 'active' : '']"></div>
        </div>
        <div class>
          <div class="rounded-full bullet" :class="bulletStyle(1)"></div>
        </div>
        <div class="w-full">
          <div class="line-right" :class="[step >= 2 ? 'active' : '']"></div>
        </div>
      </div>
      <div class="flex items-center flex-auto stepper-indicator">
        <div class="w-full">
          <div class="line-left" :class="[step >= 2 ? 'active' : '']"></div>
        </div>
        <div class>
          <div class="rounded-full bullet" :class="bulletStyle(2)"></div>
        </div>
        <div class="w-full">
          <div class="line-right" :class="[step >= 4 ? 'active' : '']"></div>
        </div>
      </div>
      <div class="flex items-center flex-auto stepper-indicator">
        <div class="w-full">
          <div class="line-left" :class="[step >= 4 ? 'active' : '']"></div>
        </div>
        <div class>
          <div class="rounded-full bullet" :class="bulletStyle(4)"></div>
        </div>
        <div class="w-full">
          <div class="line-right" :class="[step >= 4 ? 'active' : '']"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isValid as isValidCorporateBooking } from "@/composable/corporateEvent";
const redOrderIcon = require("@/assets/icon-order-red.png");
const whiteOrderIcon = require("@/assets/icon-order-white.png");
export default {
  props: {
    isFlowSelectDateFirst: {
      type: Boolean,
      required: true,
    },
    isDineIn: {
      type: Boolean,
      required: true,
    },
    restaurantName: {
      type: String,
      required: true,
    },
    selectedPackageCount: {
      type: Number,
      required: true,
    },
    step: {
      required: true,
    },
    stepOneName: {
      type: String,
      required: true,
      default: "Package",
    },
    stepOneIcon: {
      type: Array,
      required: true,
    },
    stepTwoName: {
      type: String,
      required: true,
      default: "Date",
    },
    stepTwoIcon: {
      type: Array,
      required: true,
    },
    stepThreeName: {
      type: String,
      required: true,
      default: "Payment",
    },
    stepThreeIcon: {
      type: Array,
      required: true,
    },
  },
  computed: {
    allowShowBookingStep() {
      return isValidCorporateBooking.value === false;
    },
    dateTimePanelStyle() {
      if (this.step >= 2) {
        return {
          zIndex: 1,
        };
      }
      return {
        zIndex: -1,
      };
    },
    paymentPanelStyle() {
      if (this.step >= 4) {
        return {
          zIndex: 1,
        };
      }
      return {
        zIndex: -1,
      };
    },
    panelIconStyle() {
      if (this.isDesktop) {
        return {
          width: "30px",
        };
      }
      return {
        width: "36px",
      };
    },
    cartIcon() {
      return this.selectedPackageCount > 0 ? redOrderIcon : whiteOrderIcon;
    },
  },
  methods: {
    changeStep(step) {
      this.$emit("step-change", step);
    },
    bulletStyle(paramStep) {
      if (paramStep == this.step) {
        return "active";
      } else if (paramStep < this.step) {
        return "passed";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.stepper-indicator {
  position: relative;
  .line-left,
  .line-right {
    width: 100%;
    height: 2px;
    display: block;
    @apply bg-gray-light;
    &.active {
      @apply bg-red-dark;
    }
  }
  .line-right {
    flex-shrink: 1;
  }
}
.bullet {
  width: 15px;
  height: 15px;
  @apply bg-gray-light;
  &.active {
    @apply bg-red-dark;
    border: 3px solid;
    @apply border-red-dark;
    border-radius: 100%;
  }
  &.passed {
    @apply bg-red-dark;
    color: white;
  }
}
.cart {
  .counter {
    position: absolute;
    left: 50%;
    top: 20%;
    color: white;
    -webkit-transform: translateX(-50%);
    transform: translateX(-30%);
  }
}
</style>
