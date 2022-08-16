<template>
  <div>
    <template v-if="anyInvalidPackagePrice">
      <div class="my-4 font-black text-center text-red-dark">
        No price found for {{ adult }} adult
      </div>
    </template>
    <template v-else>
      <div class="px-4 py-3 mx-1 my-3 shadow">
        <div class="flex items-center mt-3 mb-5">
          <div
            class="flex items-center justify-center mr-3 text-white rounded-full bg-red-dark"
            style="width: 35px; height: 35px"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              class="inline icon-check-circle-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
              />
            </svg>
          </div>
          <h4 class="text-xl font-black ma0">{{ $t("chargeSummary") }}</h4>
        </div>
        <!-- package name -->
        <template v-for="pack in selectedPackages">
          <div :key="pack.id" class="flex mb-3 text-sm">
            <div class="flex-auto">
              {{ pack.name }}
              <span class="ml-1">{{
                `x${pack.isAcceptManyQuantity ? pack.quantity : adult}`
              }}</span>
            </div>
            <div class="font-black text-red-dark">
              {{ pack.price }}
            </div>
          </div>
        </template>
        <!-- total prepaid -->
        <div class="flex mb-3 text-sm text-red-dark">
          <div class="flex-shrink-0 font-black">
            {{ $t("totalPrepaidAmount") }}
          </div>
          <div v-if="isLoading" class="flex items-center justify-end flex-grow">
            <div class="mr-2 loader small"></div>
          </div>
          <div v-else class="justify-end flex-grow font-black text-right">
            {{ $money(totalCharge) }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import throttle from "lodash-es/throttle";
import { calculateCharge } from "@/composable/calculateCharge";
import { mapState, mapGetters } from "vuex";
import { packagePrice } from "@/helper/PackageHelper";
export default {
  data() {
    return {
      isLoading: true,
      anyInvalidPackagePrice: false,
      selectedPackages: [],
    };
  },
  computed: {
    ...mapState("booking", ["adult", "kids"]),
    ...mapGetters("bookingPackage", ["getSelectedPackage"]),
    ...mapGetters("bookingCharge", ["totalCharge"]),
    selectedPackageIds() {
      return this.getSelectedPackage.map((packages) => packages.id)[0];
    },
  },
  watch: {
    adult: {
      handler() {
        throttle(this.parsePackage, 500)();
      },
      immediate: true,
    },
    selectedPackageIds: {
      handler() {
        throttle(this.parsePackage, 500)();
      },
      immediate: true,
    },
  },
  methods: {
    packagePrice,
    parsePackage() {
      this.selectedPackages = this.getSelectedPackage.map((pack) => {
        return {
          name: pack.name,
          quantity: pack.quantity,
          isAcceptManyQuantity: pack.isAcceptManyQuantity,
          price: this.getPackagePrice(
            { adult: this.adult, kids: this.kids },
            pack.rules,
            pack.quantity
          ),
        };
      });
    },
    getPackagePrice(pax, rules, quantity) {
      try {
        const price = packagePrice(pax, rules, quantity).adult;
        this.anyInvalidPackagePrice = false;
        this.calculateChargeSummary();
        return this.$money(price);
      } catch (err) {
        this.anyInvalidPackagePrice = true;
      }
    },
    calculateChargeSummary: throttle(async function () {
      this.isLoading = true;
      await calculateCharge();
      this.isLoading = false;
    }, 1000),
  },
};
</script>

<style scoped>
.shadow {
  box-shadow: 0px 0px 21px 4px rgba(217, 217, 217, 1);
}
</style>
<i18n>
{
  "en": {
    "chargeSummary": "Charged Summary",
    "totalPrepaidAmount": "Total Prepaid Amount:"
  },
  "th": {
    "chargeSummary": "สรุุปยอดเงิน",
    "totalPrepaidAmount": "ยอดที่ต้องชำระจำนวนทั้งสิ้น:"
  }
}
</i18n>
