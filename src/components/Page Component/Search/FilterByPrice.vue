<template>
  <div class="flex-grow mx-4">
    <div class="flex flex-col w-11/12 mx-auto my-6">
      <div id="slider-start" class="price-slider"></div>

      <div class="flex justify-between mt-10">
        <div class="w-5/12">
          <div class="text-sm font-black">
            {{ $t("startingPrice") }}
          </div>
          <div class="flex py-3 border-b border-black">
            <span class="mr-2">฿</span>
            <input
              id="starting-price"
              v-model="tempStartPrice"
              class="w-full"
              type="number"
              min="0"
              step="10"
              @input="startPriceInputChange"
            />
          </div>
        </div>
        <div class="w-5/12">
          <div class="text-sm font-black capitalize">
            {{ $t("highestPrice") }}
          </div>
          <div class="flex py-3 border-b border-black">
            <span class="mr-2">฿</span>
            <input
              id="end-price"
              v-model="tempEndPrice"
              class="w-full"
              type="number"
              max="20000"
              step="10"
              @input="startPriceInputChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { convertToNumber } from "@/helper/stringHelper";
import noUiSlider from "nouislider";
import "nouislider/distribute/nouislider.min.css";
export default {
  props: {
    startPrice: {
      type: Number,
      required: true,
    },
    endPrice: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      inputSlider: null,
      tempStartPrice: 0,
      tempEndPrice: 0,
    };
  },
  mounted() {
    this.initSlider();
    this.tempStartPrice = this.startPrice;
    this.tempEndPrice = this.endPrice;
  },
  methods: {
    initSlider() {
      if (!this.inputSlider) {
        this.inputSlider = document.getElementById("slider-start");
        const self = this;
        noUiSlider.create(this.inputSlider, {
          start: [this.startPrice, this.endPrice],
          connect: [false, true, false],
          tooltips: [true, true],
          step: 10,
          range: {
            min: [0],
            max: [20000],
          },
          format: {
            to(value) {
              return self.$money(value);
            },
            from(value) {
              return Number(value);
            },
          },
        });

        this.inputSlider.noUiSlider.on("change", () => {
          const sliderVal = this.inputSlider.noUiSlider.get();
          this.tempStartPrice = convertToNumber(sliderVal[0]);
          this.tempEndPrice = convertToNumber(sliderVal[1]);
          this.$emit("on-value-change", {
            startPrice: this.tempStartPrice,
            endPrice: this.tempEndPrice,
          });
        });
      }
    },
    startPriceInputChange() {
      this.inputSlider.noUiSlider.set([this.tempStartPrice, this.tempEndPrice]);
      this.$emit("on-value-change", {
        startPrice: this.tempStartPrice,
        endPrice: this.tempEndPrice,
      });
    },
  },
};
</script>

<style lang="scss">
.price-slider {
  &.noUi-horizontal {
    height: 10px;
    background-color: #e4e4e4;
    @apply border-none;
  }
  .noUi-tooltip {
    bottom: -30px;
    @apply text-sm border-none text-red-dark;
  }
  .noUi-handle {
    width: 20px;
    height: 20px;
    box-shadow: none;
    @apply bg-white rounded-full border-red-dark border;
    &::after,
    &::before {
      content: none;
    }
  }
}
.noUi-connect {
  @apply bg-red-dark;
}
</style>
