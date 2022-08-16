<template>
  <div class="py-3 mt-5 mb-3 hh-shadow border-radius">
    <h4
      class="mx-4 my-2 font-black"
      :class="isPackageRequireCC ? 'text-left text-xl' : 'text-center text-lg'"
    >
      <svg
        v-if="isPackageRequireCC"
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        fill="currentColor"
        class="inline-block icon-check-circle-fill text-red-dark"
        viewBox="0 0 16 16"
      >
        <path
          d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
        />
      </svg>
      {{ isPackageRequireCC ? $t("chargedSummary") : $t("chargeSummary") }}
    </h4>
    <div class="pt-2 mx-6">
      <p class="mb-2 text-sm text-red-dark">
        {{ parsedChargedDateTime }}
      </p>
      <div v-if="!isLoading">
        <!-- selected package list -->
        <div
          v-for="packages in parsedSelectedPackages"
          :key="packages.id"
          class="flex mb-2 text-sm"
        >
          <div class="flex flex-col flex-auto">
            <!-- adult price -->
            <div class="flex items-center adult-package-price">
              <div class="flex-auto text-gray-700">
                <span> {{ packages.adult.name }} </span>
                <template v-if="!packages.adult.isAlaCarte">
                  <span v-if="allowShowPrice" class="font-black">
                    <span
                      v-if="packages.adult.customNetPrice"
                      class="text-red-dark"
                      >{{ `${packages.adult.customNetPrice}` }}</span
                    >
                    <span v-else>{{
                      `(${$money(packages.adult.priceRule)})`
                    }}</span>
                  </span>
                  <span class="ml-1 font-black">{{
                    `X${
                      packages.adult.isAcceptManyQuantity
                        ? packages.adult.quantity
                        : adult
                    }`
                  }}</span>
                </template>
              </div>
              <div
                v-if="allowShowPrice"
                class="text-base font-black text-red-dark"
              >
                {{ $money(packages.adult.totalPrice) }}
              </div>
            </div>
            <!-- kids price -->
            <div
              v-if="packages.kids"
              class="flex items-center kids-package-price"
            >
              <div class="flex-auto text-gray-700">
                <span>
                  {{ packages.kids.name }}
                  <span class="font-bold"
                    >({{
                      packages.kids.useKidsPrice
                        ? packages.kids.highestPrice
                        : packages.kids.priceRule.price
                    }})</span
                  >
                </span>
                <template v-if="!packages.kids.isAlaCarte">
                  <span class="font-black"
                    >{{
                      `X${
                        packages.kids.isAcceptManyQuantity
                          ? packages.kids.quantity
                          : kids
                      }`
                    }}
                    {{ $tc("kids", kids) }}</span
                  >
                </template>
              </div>
              <div
                v-if="allowShowPrice"
                class="text-base font-black text-red-dark"
              >
                {{ $money(packages.kids.totalPrice) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- delivery fee (if any) -->
      <div
        v-if="originalDeliveryFee && !isDineIn && allowShowPrice"
        class="flex mb-2 text-sm"
      >
        <div class="flex-auto text-gray-700 capitalize">
          {{ $t("deliveryFee") }}
        </div>
        <div class="text-base font-black text-red-dark">
          {{ $money(originalDeliveryFee) }}
        </div>
      </div>
      <!-- applied voucher (if any) -->
      <div v-if="anyValidVoucherApplied" class="flex flex-col mb-2 text-sm">
        <div
          v-for="voucher in validVoucherApplied"
          :key="voucher.voucherCode"
          class="flex w-full"
        >
          <div class="flex-auto text-gray-700">
            <div>{{ `Voucher - ${voucher.voucherCode}` }}</div>
            <div>
              {{ voucher.name }}
              <template v-if="voucher.isDeductible">{{
                `(${voucher.amount})`
              }}</template>
            </div>
          </div>
          <div class="text-base font-black text-red-dark">
            {{ `-${$money(voucher.amountUsed)}` }}
          </div>
        </div>
      </div>
      <!-- total charge -->
      <div v-if="allowShowPrice" class="flex mb-2 text-sm font-black">
        <div class="flex-auto">
          <span v-if="isPackageRequireCC || isVoucherNeedPayment">
            {{ isDineIn ? $t("totalPrepaidAmound") : $t("totalOrderValue") }}
          </span>
          <span v-else>{{ $t("totalPayAtRestaurant") }}</span>
          <span v-if="isNotFullCharge"> {{ `(${chargePercent}%)` }}</span>
        </div>
        <div>
          <div v-if="isLoading" class="loader small"></div>
          <div v-else class="text-base text-red-dark">
            {{ $money(totalCharge) }}
          </div>
        </div>
      </div>
      <!-- total pay at restaurant -->
      <div
        v-if="
          isNotFullCharge && totalPayAtRestaurant && isDineIn && allowShowPrice
        "
        class="flex text-sm font-black"
      >
        <div class="flex-auto">
          {{ $t("totalPayAtRestaurant") }}
        </div>
        <div>
          <div v-if="isLoading" class="loader small"></div>
          <div v-else class="text-base text-red-dark">
            {{ $money(totalPayAtRestaurant) }}
          </div>
        </div>
      </div>
      <div v-if="acceptVoucherPackage && allowShowPrice" class="mt-2">
        <BookingInputVoucher @on-voucher-removed="voucherRemovedCallback" />
      </div>
      <div v-if="acceptVoucherPackage && allowShowPrice">
        <BookingMyPointVoucher />
      </div>
    </div>
  </div>
</template>

<script>
import { PICK_UP, DELIVERY } from "@/lib/constant";
import { mapGetters, mapState } from "vuex";
import {
  computeds as voucherComputeds,
  methods as voucherMethods,
} from "@/composable/voucher";
import { orderNowEstimation } from "@/composable/orderTimeEstimation";
import cloneDeep from "lodash-es/cloneDeep";
import { isValid as isValidCorporateBooking } from "@/composable/corporateEvent";
import { calculateCharge } from "@/composable/calculateCharge";
import useLazyImport from "@/composable/useLazyImport";
import { getMaxPriceKids } from "@/helper/getMaxPriceKids";

export default {
  components: {
    BookingInputVoucher: () =>
      useLazyImport(() => import("./BookingInputVoucher")),
    BookingMyPointVoucher: () =>
      useLazyImport(() => import("./BookingMyPointVoucher")),
  },
  props: {
    forceMobileVersion: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const {
      validVoucherApplied,
      anyValidVoucherApplied,
      isVoucherNeedPayment,
    } = voucherComputeds;
    const { useVoucher } = voucherMethods;
    return {
      validVoucherApplied,
      anyValidVoucherApplied,
      isVoucherNeedPayment,
      useVoucher,
      orderNowEstimation,
    };
  },
  data() {
    return {
      isLoading: true,
      parsedChargedDateTime: "",
      parsedSelectedPackages: [],
    };
  },
  computed: {
    ...mapState("webConfig", ["config"]),
    ...mapState("bookingCharge", [
      "originalDeliveryFee",
      "totalPrice",
      "chargeAmountType",
      "chargePercent",
      "selectedPackagesCharged",
    ]),
    ...mapState("booking", [
      "adult",
      "kids",
      "distanceToRestaurant",
      "selectedDate",
      "selectedTime",
      "bookingMethod",
    ]),
    ...mapState("restaurant", ["isSupportOrderNow"]),
    ...mapGetters("restaurant", ["isRestaurantAcceptVoucher"]),
    ...mapGetters("booking", ["isDineIn", "canSkipSelectTime"]),
    ...mapGetters("bookingCharge", ["isNotFullCharge"]),
    ...mapGetters("bookingPackage", [
      "getSelectedPackage",
      "isSelectedPackagesAcceptMultipleQuantity",
    ]),
    ...mapGetters("bookingCharge", ["totalCharge", "totalPayAtRestaurant"]),
    ...mapGetters("bookingPackage", ["isPackageRequireCC"]),
    ...mapGetters("user", ["isUserSignedIn"]),
    ...mapGetters("bookingDateTime", ["isOrderNow"]),
    allowShowPrice() {
      return !isValidCorporateBooking.value;
    },
    acceptVoucherPackage() {
      const filterIsAcceptVoucher = this.getSelectedPackage.filter(
        (pack) => pack.isAcceptVoucher === true
      );
      return this.isRestaurantAcceptVoucher && filterIsAcceptVoucher.length > 0
        ? true
        : false;
    },
  },
  watch: {
    "distanceToRestaurant.value": function () {
      this.calculatePartialCharge();
    },
    isUserSignedIn() {
      this.calculatePartialCharge();
    },
    bookingMethod() {
      this.generateChargedDateTimeLabel();
    },
    orderNowEstimation() {
      this.generateChargedDateTimeLabel();
    },
  },
  mounted() {
    this.calculatePartialCharge();
    this.generateChargedDateTimeLabel();
  },
  methods: {
    async calculatePartialCharge() {
      try {
        this.isLoading = true;
        await calculateCharge();
        this.generateSelectedPackage();
        this.isLoading = false;
      } catch (err) {
        this.$rollbar.error("Failed call calculatePartialCharge", err);
      }
    },
    voucherRemovedCallback() {
      this.calculatePartialCharge();
    },
    generateChargedDateTimeLabel() {
      let selectedTime = this.selectedTime;
      let selectedDate = this.$dayjs(this.selectedDate);
      let formatedDate = selectedDate.format("dddd DD/MM/YYYY");

      const generate = () => {
        if (this.isDineIn) {
          if (this.canSkipSelectTime) {
            return formatedDate;
          }
          return `${formatedDate} ${this.$t("at")} ${selectedTime}`;
        } else {
          if (
            this.bookingMethod !== PICK_UP &&
            this.bookingMethod !== DELIVERY
          ) {
            return formatedDate;
          } else if (this.bookingMethod === PICK_UP) {
            let formatedPickupTime = "";
            let pickupTime = "";
            if (this.isOrderNow && this.isSupportOrderNow) {
              pickupTime = this.$dayjs();
              const { cookingTime } =
                this.$store.state.restaurant.restaurantData;
              formatedPickupTime = pickupTime
                .add(cookingTime || 0, "minute")
                .format("HH:mm dddd DD/MM/YYYY");
            } else {
              const splitTime = selectedTime.split(":");
              if (splitTime && splitTime.length) {
                const hour = splitTime[0];
                const minute = splitTime[1];
                pickupTime = selectedDate
                  .hour(parseInt(hour))
                  .minute(parseInt(minute));
                formatedPickupTime = pickupTime.format("HH:mm dddd DD/MM/YYYY");
              }
            }
            return this.$t("foodReadyAt", { time: formatedPickupTime });
          } else {
            let formatedDeliveryTime = "";
            let deliveryTime = "";
            if (this.isOrderNow && this.isSupportOrderNow) {
              deliveryTime = this.$dayjs();
              if (this.orderNowEstimation) {
                formatedDeliveryTime = deliveryTime
                  .add(this.orderNowEstimation, "minute")
                  .format("HH:mm dddd DD/MM/YYYY");
              } else {
                formatedDeliveryTime = deliveryTime.format(
                  "HH:mm dddd DD/MM/YYYY"
                );
              }
            } else {
              const splitTime = selectedTime.split(":");
              if (splitTime && splitTime.length) {
                const hour = splitTime[0];
                const minute = splitTime[1];
                deliveryTime = selectedDate
                  .hour(parseInt(hour))
                  .minute(parseInt(minute));
              }
              formatedDeliveryTime = deliveryTime.format(
                "HH:mm dddd DD/MM/YYYY"
              );
            }

            return this.$t("receiveAt", { time: formatedDeliveryTime });
          }
        }
      };

      this.parsedChargedDateTime = generate();
    },
    generateSelectedPackage() {
      this.parsedSelectedPackages = cloneDeep(this.getSelectedPackage).map(
        (packages) => {
          let kidsPricing = null;
          let adultPricing = {
            priceRule: "",
            totalPrice: "",
          };
          if (packages.isAlaCarte) {
            // get package information from charge API
            const chargedPackages = this.selectedPackagesCharged.filter(
              (pack) => {
                return pack.restaurantPackageId == packages.id;
              }
            );
            if (chargedPackages.length === 0) {
              this.$rollbar.error("Failed parse charge summary package data", {
                packageChargeFromAPI: this.selectedPackagesCharged,
                packageSelected: this.getSelectedPackage,
              });
            }

            adultPricing.priceRule = chargedPackages[0].price;
            adultPricing.totalPrice = chargedPackages[0].price;
            // merge package data & custom pricing
            adultPricing = { ...adultPricing, ...packages };
          } else {
            const totalPrice = packages.getPackagePrice(this.adult, this.kids);
            const priceRule = packages.getSelectedPricingRule(this.adult);

            adultPricing.priceRule = priceRule.price;
            adultPricing.totalPrice = totalPrice.adult;
            // merge package data & custom pricing
            adultPricing = { ...adultPricing, ...packages };

            if (this.kids && !this.isSelectedPackagesAcceptMultipleQuantity) {
              if (packages.useKidsPrice) {
                const filterPrice = packages.kidsPriceV2.filter(
                  (item) => item.priceValue !== "Free"
                );

                kidsPricing = {
                  priceRule: priceRule,
                  totalPrice:
                    parseInt(getMaxPriceKids(filterPrice)) * this.kids,
                  highestPrice: getMaxPriceKids(filterPrice),
                  ...packages,
                };
              } else {
                kidsPricing = {
                  priceRule: priceRule,
                  totalPrice: parseInt(priceRule.price) * this.kids,
                  ...packages,
                };
              }
            }
          }
          return {
            adult: adultPricing,
            kids: kidsPricing,
          };
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.border-radius {
  @screen xl {
    border-radius: 8px;
  }

  border-radius: 34px;
  background: #fff;
  box-shadow: -1px 2px 25px rgba(0, 0, 0, 0.16);
}
</style>
<i18n>
{
  "en": {
    "totalPrepaidAmound": "Total Prepaid Amount",
    "totalOrderValue": "Total Order Value",
    "totalPayAtRestaurant": "Total Pay At Restaurant",
    "useVoucher": "Use Voucher",
    "foodReadyAt": "Food Ready at {time}",
    "receiveAt": "Receive at {time}"
  },
  "th": {
    "totalPrepaidAmound": "จำนวนเงินที่ชำระล่วงหน้า",
    "totalOrderValue": "ยอดรวมทั้งสิ้น",
    "totalPayAtRestaurant": "ยอดรวมที่ต้องจ่ายที่ร้านอาหาร",
    "useVoucher": "ใช้คูปอง",
    "foodReadyAt": "รับอาหารได้ในเวลา {time}",
    "receiveAt": "ได้รับตอน {time}"
  }
}
</i18n>
