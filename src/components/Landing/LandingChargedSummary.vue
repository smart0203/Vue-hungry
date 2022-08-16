<template>
  <div class="px-4 py-3 rounded-lg shadow lg:px-8">
    <div class="flex items-center mt-3 mb-5">
      <div
        class="flex items-center justify-center flex-shrink-0 mr-3 text-white rounded-full bg-red-dark"
        style="width: 35px; height: 35px"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          class="inline icon-check-circle-fill"
          viewBox="0 0 16 16"
        >
          <path
            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
          />
        </svg>
      </div>
      <h4 class="text-xl font-black ma0">
        {{ isPendingBigGroup ? $t("pendingCharge") : $t("chargedSummary") }}
      </h4>
    </div>
    <!-- package name -->
    <!-- selected package list -->
    <div
      v-for="pack in parsedSelectedPackages"
      :key="pack.id"
      class="flex mb-2 text-sm"
    >
      <div class="flex flex-col flex-auto">
        <!-- adult price -->
        <div class="flex items-center adult-package-price">
          <div class="flex-auto text-gray-700">
            <span> {{ pack.adult.name }} </span>
            <template v-if="!pack.isAlaCarte">
              <span
                v-if="allowShowPrice"
                :class="pack.adult.customNetPrice ? ' text-red-dark' : null"
                class="font-black"
                >{{ pack.adult.showedPrice }}</span
              >
              <span class="ml-1 font-black">{{
                `X${
                  pack.adult.isAcceptManyQuantity ? pack.adult.quantity : adult
                }`
              }}</span>
            </template>
          </div>
          <div v-if="allowShowPrice" class="text-base font-black text-red-dark">
            {{
              $money(pack.isAlaCarte ? pack.adult.price : pack.adult.totalPrice)
            }}
          </div>
        </div>
        <!-- kids price -->
        <div v-if="pack.kids" class="flex items-center kids-package-price">
          <div class="flex-auto text-gray-700">
            <span>
              {{ pack.kids.name }}
              <span class="font-bold"
                >({{
                  pack.kids.useKidsPrice
                    ? pack.kids.highestPrice
                    : pack.kids.priceRule.price
                }})</span
              >
            </span>
            <template v-if="!pack.isAlaCarte">
              <span class="font-black"
                >{{
                  `X${
                    pack.kids.isAcceptManyQuantity ? pack.kids.quantity : kids
                  }`
                }}
                {{ $tc("kids", kids) }}</span
              >
            </template>
          </div>
          <div v-if="allowShowPrice" class="text-base font-black text-red-dark">
            {{ $money(pack.kids.totalPrice) }}
          </div>
        </div>
      </div>
    </div>
    <!-- delivery fee -->
    <div
      v-if="isDelivery && allowShowPrice"
      class="flex mb-3 text-sm lg:text-sm"
    >
      <div class="flex-auto text-gray-700 capitalize">
        {{
          chargeObject.originalDeliveryFee
            ? $t("deliveryFee")
            : $t("freeDelivery")
        }}
      </div>
      <div
        v-if="chargeObject.originalDeliveryFee"
        class="font-black text-red-dark"
      >
        {{ $money(chargeObject.originalDeliveryFee) }}
      </div>
    </div>
    <!-- applied voucher (if any) -->
    <div v-if="voucherApplied.length" class="flex flex-col mb-2 text-sm">
      <div
        v-for="voucher in voucherApplied"
        :key="voucher.voucherCode"
        class="flex w-full mb-2"
      >
        <div class="flex-auto text-gray-700">
          <div>{{ `Voucher - ${voucher.voucherCode}` }}</div>
          <div>{{ voucher.name }}</div>
        </div>
        <div class="text-base font-black text-red-dark">
          {{ `-${$money(voucher.usedAmount)}` }}
        </div>
      </div>
    </div>
    <!-- total prepaid -->
    <template v-if="isObject(chargeObject) && allowShowPrice">
      <div v-if="totalCharge" class="flex mb-3 text-sm lg:text-sm">
        <div class="flex-auto font-black capitalize">
          <span v-if="hasPrepayment">
            {{ isDineIn ? $t("totalPrepaidAmound") : $t("totalOrderValue") }}
          </span>
          <span v-else>
            {{ $t("totalPayAtRestaurant") }}
          </span>
          <span
            v-if="
              chargeObject.chargeAmountType === 'relative' &&
              chargeObject.chargePercent < 100
            "
          >
            {{ `(${chargeObject.chargePercent}%)` }}</span
          >
        </div>
        <div class="font-black text-red-dark">
          {{ $money(totalCharge) }}
        </div>
      </div>
      <div
        v-if="isDineIn && totalPayAtRestaurant"
        class="flex mb-3 text-sm lg:text-sm"
      >
        <div class="flex-auto font-black capitalize">
          <span>
            {{ $t("totalPayAtRestaurant") }}
          </span>
        </div>
        <div class="font-black text-red-dark">
          {{ $money(totalPayAtRestaurant) }}
        </div>
      </div>
    </template>
    <!-- payment method -->
    <template v-if="paymentType">
      <div class="flex mb-3 text-sm lg:text-sm">
        <div class="flex-auto font-black capitalize">
          <span>
            {{ "Payment Method" }}
          </span>
        </div>
        <div class="font-black capitalize text-red-dark">
          {{ paymentType }}
        </div>
      </div>
    </template>
    <template v-if="expandableMenu">
      <button
        id="landing-expand-menu-button"
        class="px-2 mt-2 text-sm bg-white border rounded-full border-red-dark text-red-dark"
        @click="expandMenu = !expandMenu"
      >
        <svg
          v-if="expandMenu"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="inline icon-chevron-up"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          fill="currentColor"
          class="inline icon-chevron-down"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
          />
        </svg>
        {{ $t("viewMenu") }}
      </button>
      <div v-if="expandMenu" class="mt-3">
        <div v-for="pack in packages" :key="pack.id">
          <div class="mb-5">
            <div class="flex items-center justify-between mb-3 text-lg">
              <div class="font-black text-red-dark">
                {{ pack.name }}
                {{
                  !pack.isAlaCarte && allowShowPrice ? $money(pack.price) : ""
                }}
                <span class="text-black">{{ `x ${pack.quantity}` }}</span>
              </div>
            </div>
            <div
              v-for="section in pack.sections"
              :key="section.id"
              class="mb-3 text-sm"
            >
              <div class="mb-2 font-black">
                {{ section.name }} {{ `(${menuInSection(section)})` }}
              </div>
              <div v-for="menu in section.menus" :key="menu.id" class="ml-2">
                <div class="flex justify-between mb-1">
                  <span>{{ menu.name }}</span>
                  <span class="flex-shrink ml-1">X {{ menu.quantity }}</span>
                  <span
                    v-if="allowShowPrice"
                    class="flex-grow text-right text-red-dark"
                    >{{
                      menu.price && pack.isAlaCarte
                        ? $money(menu.price * menu.quantity)
                        : ""
                    }}</span
                  >
                </div>

                <!-- sub sections -->
                <div v-if="Array.isArray(menu.subsections)">
                  <div
                    v-for="(subSection, index) in menu.subsections"
                    :key="index"
                  >
                    <div class="mb-1 font-black">
                      {{
                        $t("portion", {
                          order: `(${formatOrdinalNumber(index + 1)})`,
                        })
                      }}
                    </div>
                    <div
                      v-for="boxSection in subSection.box"
                      :key="boxSection.id"
                      class="mb-1"
                    >
                      <div class="flex">
                        <span>{{ boxSection.name }}</span>
                        <span class="mx-1">:</span>
                        <div class="flex">
                          <div
                            v-for="boxSectionMenu in boxSection.menus"
                            :key="boxSectionMenu.id"
                          >
                            {{
                              `${boxSectionMenu.name} x ${boxSectionMenu.quantity}`
                            }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center">
          <button
            id="landing-close-expanded-menu-button"
            class="p-2 text-sm font-black bg-white border rounded cursor-pointer border-red-dark text-red-dark"
            @click="expandMenu = !expandMenu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="inline mr-2 icon-chevron-up"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
              />
            </svg>
            {{ $t("closeDetail") }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { packagePrice, packagePricingRule } from "@/helper/PackageHelper";
import { state, computeds } from "./landing";
import isObject from "lodash-es/isObject";
import { getMaxPriceKids } from "@/helper/getMaxPriceKids";
let numbro;

export default {
  props: {
    expandableMenu: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    return {
      ...state,
      ...computeds,
    };
  },
  data() {
    return {
      expandMenu: false,
    };
  },
  computed: {
    parsedSelectedPackages() {
      return this.packages.map((packages) => {
        let kids = null;
        const totalPrice = packagePrice(
          { adult: this.adult, kids: this.kids },
          packages.rules,
          packages.quantity
        );
        const priceRule = packagePricingRule(
          { adult: this.adult, kids: this.kids },
          packages.rules
        );
        const showedPrice = packages.customNetPrice
          ? packages.customNetPrice
          : packages.isAlaCarte
          ? `${this.$money(packages.price)}`
          : `${this.$money(priceRule.price)}`;
        const adult = {
          priceRule: priceRule,
          totalPrice: totalPrice.adult,
          showedPrice,
          ...packages,
        };
        if (this.kids && !packages.isAcceptManyQuantity) {
          if (packages.useKidsPrice) {
            const filterPrice = packages.kidsPriceV2.filter(
              (item) => item.priceValue !== "Free"
            );

            kids = {
              priceRule: priceRule,
              totalPrice: parseInt(getMaxPriceKids(filterPrice)) * this.kids,
              highestPrice: getMaxPriceKids(filterPrice),
              ...packages,
            };
          } else {
            kids = {
              priceRule: priceRule,
              totalPrice: parseInt(priceRule.price) * this.kids,
              showedPrice,
              ...packages,
            };
          }
        }
        return {
          isAlaCarte: packages.isAlaCarte,
          adult,
          kids,
        };
      });
    },
    allowShowPrice() {
      return !this.corporateEventId ? true : false;
    },
  },
  mounted() {
    this.loadNumbro();
  },
  methods: {
    isObject,
    async loadNumbro() {
      try {
        const module = await import("numbro");
        numbro = module.default;
      } catch (err) {
        this.$rollbar.error(err);
      }
    },
    totalPrice(price, quantity) {
      const total = price * quantity;
      return this.$money(total);
    },
    menuInPackage(pack) {
      let quantity = 0;
      pack.sections.forEach((section) => {
        quantity = quantity + this.menuInSection(section);
      });
      return quantity;
    },
    menuInSection(section) {
      let quantity = 0;
      section.menus.forEach((menu) => {
        quantity = quantity + menu.quantity;
      });
      return quantity;
    },
    formatOrdinalNumber(number) {
      const lang = this.$store.state.lang;
      if (typeof number === "number" && numbro && lang === "en") {
        return numbro(number).format({ output: "ordinal" });
      }
      return number;
    },
  },
};
</script>

<style scoped>
.shadow {
  box-shadow: 0 0 21px 4px rgba(217, 217, 217, 1);
}
</style>

<i18n src="./landingTranslate.json"></i18n>
