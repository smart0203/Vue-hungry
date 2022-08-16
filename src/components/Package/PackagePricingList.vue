<template>
  <div
    class="overflow-x-scroll overflow-y-hidden lg:overflow-x-visible lg:overflow-y-visible"
    :class="isShowDesktopVersion ? null : 'tiny-scroll'"
  >
    <ul
      v-if="packagePricingList.length > 1 && !simpleMode"
      class="flex"
      :class="isShowDesktopVersion ? 'lg:block flex-col' : 'items-center'"
    >
      <li
        v-for="(price, index) in packagePricingList"
        :key="index"
        class="flex flex-col px-2 mb-2"
        :class="isShowDesktopVersion ? 'lg:px-0 lg:w-full' : ''"
      >
        <span
          class="leading-3 whitespace-nowrap text-2xs"
          :class="price.isActiveRule ? ' text-red-dark' : ''"
          >{{ price.ruleText }}</span
        >
        <span
          v-if="allowShowPrice"
          :class="price.isActiveRule ? ' text-red-dark' : ''"
          class="text-base font-black leading-4"
          >{{ price.price }}</span
        >
        <span
          v-if="isShowDesktopVersion && allowShowPrice"
          class="leading-3 text-2xs whitespace-nowrap"
          :class="price.isActiveRule ? ' text-red-dark' : ''"
          >{{ pricingType }}</span
        >
      </li>
    </ul>
    <div v-else>
      <div v-if="allowShowPrice" class="flex">
        <span
          class="font-black"
          :class="[
            !isShowOriginalPrice ? 'flex-grow' : null,
            disabledBooking ? 'text-gray-500' : 'text-red-dark',
          ]"
          >{{ lastRule.price }}</span
        >
        <span
          v-if="isShowOriginalPrice"
          class="ml-2 text-gray-500"
          style="text-decoration: line-through"
          >{{ $money(originalPrice.price) }}</span
        >
      </div>
      <div
        v-if="allowShowPrice"
        class="leading-3 text-center lg:text-left text-2xs"
        :class="[
          lastRule.isActiveRule ? ' text-red-dark' : '',
          !disabledBooking ? 'text-red-dark' : 'text-gray-500'
        ]"
      >
        {{ pricingTypeText }}
      </div>
    </div>
  </div>
</template>

<script>
import { convertToNumber } from "@/helper/stringHelper";

export default {
  name: "PackagePricingList",
  props: {
    pricingType: {
      type: String,
      required: true,
    },
    pricingList: {
      type: Array,
      required: true,
    },
    originalPrice: {
      type: Object,
      default() {
        return {};
      },
    },
    showVersion: {
      type: String,
      required: true,
      validator(value) {
        return ["desktop", "mobile"].indexOf(value) !== -1;
      },
    },
    adult: {
      type: Number,
      default: 0,
    },
    simpleMode: {
      type: Boolean,
      default: false,
    },
    allowShowPrice: {
      type: Boolean,
      default: false,
    },
    disabledBooking: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      packagePricingList: this.pricingList,
      isShowOriginalPrice: false,
    };
  },
  computed: {
    lastRule() {
      return this.packagePricingList[this.packagePricingList.length - 1];
    },
    isShowDesktopVersion() {
      return this.showVersion === "desktop";
    },
    pricingTypeText() {
      if (this.pricingList.length > 1 && this.adult === 0) {
        return this.$t("startingPrice");
      }
      return this.pricingType;
    },
  },
  created() {
    this.onCreated();
  },
  methods: {
    generateRuleText(min, max) {
      let minAdult = `${min}`;
      let maxAdult = "";
      if (eval(max) > min) {
        maxAdult =
          eval(max) === Infinity
            ? ` ${this.$t("andMore")}`
            : `- ${max} ${this.$tc("people", max)}`;
      } else {
        minAdult = `${minAdult} ${this.$tc("people", min)}`;
      }

      return minAdult + maxAdult;
    },
    highlightActiveRule(min, max, perPack) {
      if (perPack) {
        return true;
      }
      if (this.adult) {
        if (this.adult >= min && this.adult <= max) {
          return true;
        }
        return false;
      }
      return true;
    },
    onCreated() {
      if (this.pricingList && this.pricingList.length) {
        this.pricingList.forEach((pricing) => {
          const { minSeat, maxSeat, perPack } = pricing;
          pricing.ruleText = this.generateRuleText(minSeat, maxSeat);
          pricing.isActiveRule = this.highlightActiveRule(
            minSeat,
            maxSeat,
            perPack
          );
        });

        // check should show original price or not
        if (
          this.lastRule.price &&
          this.originalPrice.price &&
          this.originalPrice.price > 0
        ) {
          const sellingPrice = convertToNumber(this.lastRule.price);
          if (sellingPrice < this.originalPrice.price) {
            this.isShowOriginalPrice = true;
          }
        }
      }
    },
  },
};
</script>
<i18n>
{
  "en": {
    "andMore": "and more"
  },
  "th": {
    "andMore": "ท่านขึ้นไป"
  }
}
</i18n>
