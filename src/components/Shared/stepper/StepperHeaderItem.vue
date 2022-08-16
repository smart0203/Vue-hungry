<template>
  <div class="flex-grow">
    <button
      class="w-full p-2 my-2 bg-white border-none cursor-pointer lg:m-0"
      data-testid="stepper-header-item-icon-wrapper"
      @click="step.onIconClick"
    >
      <div class="relative">
        <img
          class="inline-block"
           loading="lazy"
          data-testid="stepper-header-item-icon"
          :src="step.icon"
          :style="isDesktop ? 'width: 36px' : 'width: 36px'"
          alt="stepper icon"
        />
        <div
          class="absolute top-0 left-0 flex items-center justify-center w-full mx-auto"
          data-testid="stepper-header-item-icon-active"
          :style="!step.isActive ? 'z-index: -1' : null"
        >
          <img
            class="inline-block"
             loading="lazy"
            :src="step.iconActive"
            :style="isDesktop ? 'width: 36px' : 'width: 36px'"
            alt="step image"
          />
        </div>
      </div>
      <div
        class="mt-1 text-sm uppercase"
        data-testid="stepper-header-item-name"
        :class="isActiveOrPassed ? ' text-red-dark' : ' text-gray-400'"
      >
        {{ step.name }}
      </div>
    </button>

    <!-- Indicator -->
    <div class="flex justify-center mx-auto text-center">
      <div class="flex items-center flex-auto stepper-indicator">
        <div class="w-full">
          <div
            class="line-left"
            data-testid="stepper-header-item-indicator-left"
            :class="isActiveOrPassed ? 'active' : null"
          ></div>
        </div>
        <div class>
          <div
            class="rounded-full bullet"
            data-testid="stepper-header-item-indicator-bullet"
            :class="isActiveOrPassed ? 'active' : null"
          ></div>
        </div>
        <div class="w-full">
          <div
            class="line-right"
            data-testid="stepper-header-item-indicator-right"
            :class="step.isPassed ? 'active' : null"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StepperHeaderItem",
  props: {
    step: {
      type: Object,
      required: true,
      validator(value) {
        const { name, icon, iconActive, onIconClick, isActive, isPassed } =
          value;
        if (
          typeof name === "string" &&
          typeof icon === "string" &&
          typeof iconActive === "string" &&
          typeof isActive === "boolean" &&
          typeof onIconClick === "function" &&
          typeof isPassed === "boolean"
        ) {
          return true;
        }
        return false;
      },
    },
  },
  computed: {
    isActiveOrPassed() {
      return this.step.isActive || this.step.isPassed;
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
