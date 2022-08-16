<template>
  <div>
    <div class="p-2">
      <!-- point section -->
      <div class="flex">
        <section class="w-5/12 mx-2">
          <div
            v-if="showCollect || showRedeem"
            class="flex flex-wrap mb-3 text-xs font-bold text-red-dark"
          >
            <div
              v-if="showCollect"
              class="flex flex-row items-center w-1/2 mb-1 cursor-pointer collect-icon"
            >
              <img
                src="@/assets/icon-collect-red.png"
                width="18"
                 loading="lazy"
                height="18"
                alt="icon collect"
                class="mr-2"
              />
              <span class="capitalize">{{ $t("collect") }} </span>
            </div>
            <div
              v-if="showRedeem"
              class="flex flex-row items-center w-1/2 mb-1 cursor-pointer redeem-icon"
            >
              <img
                src="@/assets/icon-redeem-red.png"
                class="mr-2"
                width="18"
                 loading="lazy"
                height="18"
                alt=""
              />
              <span class="capitalize">{{ $t("redeem") }}</span>
            </div>
            <div
              v-if="showCustomDelivery"
              class="flex flex-row items-center w-1/2 mb-1 cursor-pointer custom-delivery-icon"
            >
              <img
                src="@/assets/icon-delivery-bike-red.png"
                class="mr-2"
                width="18"
                height="18"
                alt=""
                 loading="lazy"
              />
              <span class="capitalize whitespace-nowrap">{{
                $t("delivery")
              }}</span>
            </div>
          </div>
        </section>
        <div
          v-if="pricingList.length > 1 && !adult"
          ref=""
          class="relative w-6/12 ml-4 pricingListWrapper"
        >
          <div class="absolute top-0 left-0">
            <PackagePricingList
              :style="pricingListMaxWidth"
              :pricing-type="pricingType"
              :pricing-list="pricingList"
              show-version="mobile"
              :adult="adult"
            />
          </div>
        </div>
      </div>
      <div class="flex flex-col mx-2 text-sm">
        <!-- bookable date time -->
        <section class="w-full">
          <div class="flex flex-row text-xs">
            <div v-if="showBookableDate" class="w-5/12">
              <div class="mb-3 font-black">
                {{ $t("bookDayAndTime") }}
              </div>
              <div
                v-for="opening in openingHours"
                :key="opening.day"
                class="flex mb-3"
              >
                <div style="width: 80px">{{ opening.day }}</div>
                <div class="whitespace-nowrap">
                  {{ `${opening.start} - ${opening.end}` }}
                </div>
              </div>
            </div>
            <div class="w-2/12"></div>
            <div class="flex flex-col w-5/12">
              <!-- package detail section -->
              <div class="flex items-end">
                <section v-if="showPaxRule" class="w-full">
                  <div class="mb-3 font-black">{{ $t("packagaeDetail") }}</div>
                  <div v-if="minPax" class="flex mb-3 text-xs">
                    <div class="" style="width: 100px">
                      {{ $t("min") }}
                    </div>
                    <div
                      class="whitespace-nowrap lg:whitespace-normal lg:text-right"
                    >
                      {{ minPax }} {{ $tc("adult", minPax) }}
                    </div>
                  </div>
                  <div v-if="maxPax" class="flex mb-3 text-xs">
                    <div class="" style="width: 100px">{{ $t("max") }}</div>
                    <div
                      class="whitespace-nowrap lg:whitespace-normal lg:text-right"
                    >
                      <template v-if="maxPax !== 'No Limit'">
                        {{ maxPax }} {{ $tc("adult", maxPax) }}
                      </template>
                      <template v-else>{{ maxPax }}</template>
                    </div>
                  </div>
                  <div v-if="maxPaxPerPack" class="flex mb-3 text-xs">
                    <div class="" style="width: 100px">
                      {{ $t("maxPerPack") }}
                    </div>
                    <div
                      class="whitespace-nowrap lg:whitespace-normal lg:text-right"
                    >
                      {{ maxPaxPerPack }} {{ $tc("adult", maxPaxPerPack) }}
                    </div>
                  </div>
                  <div v-if="timeLimit" class="flex mb-3 text-xs">
                    <div class="" style="width: 100px">
                      {{ $t("timeLimit") }}
                    </div>
                    <div
                      class="whitespace-nowrap lg:whitespace-normal lg:text-right"
                    >
                      {{ timeLimit }}
                    </div>
                  </div>
                </section>
              </div>
              <!-- kids price -->
              <div v-if="useKidsPrice" class="flex items-end">
                <section class="w-full">
                  <div class="mb-3 font-black">{{ $t("kidsPrice") }}</div>
                  <div
                    v-for="(priceKids, index) in kidsPriceV2"
                    :key="priceKids.priceValue + index"
                    class="flex mb-3 text-xs"
                  >
                    <div style="width: 100px">
                      {{ priceKids.pricePolicy }}
                    </div>
                    <div>
                      {{ priceKids.priceValue }}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import useLazyImport from "@/composable/useLazyImport";
import packageDescriptionMixin from "./packageDescriptionMixin";
export default {
  components: {
    PackagePricingList: () =>
      useLazyImport(() => import("@/components/Package/PackagePricingList")),
  },
  mixins: [packageDescriptionMixin],
  data() {
    return {
      pricingListMaxWidth: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.pricingList.length > 1) {
        this.calculatePricingListMaxWidth();
      }
    });
  },
  methods: {
    calculatePricingListMaxWidth() {
      const pricingListWrapper = document.querySelector(".pricingListWrapper");
      if (pricingListWrapper) {
        this.pricingListMaxWidth = `width: ${pricingListWrapper.clientWidth}px`;
      }
    },
  },
};
</script>
