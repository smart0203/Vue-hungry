<template>
  <div>
    <div class="p-3">
      <!-- term & condition -->
      <div class="flex">
        <div class="lg:w-4/12 lg:pr-8">
          <div class="flex mb-3 text-sm font-bold lg:text-xs text-red-dark">
            <div
              v-if="showCollect"
              class="flex flex-row items-center cursor-pointer collect-icon"
            >
              <img
                src="@/assets/icon-collect-red.png"
                width="18"
                height="18"
                loading="lazy"
                alt="icon collect"
                class="mr-2"
              />
              <span class="mr-4 capitalize">{{ $t("collect") }}</span>
            </div>
            <div
              v-if="showRedeem"
              class="flex flex-row items-center cursor-pointer redeem-icon"
            >
              <img
                src="@/assets/icon-redeem-red.png"
                class="mr-2"
                width="18"
                height="18"
                loading="lazy"
                alt=""
              />
              <span class="mr-4 capitalize">{{ $t("redeem") }}</span>
            </div>
            <div
              v-if="showCustomDelivery"
              class="flex flex-row items-center cursor-pointer custom-delivery-icon"
            >
              <img
                src="@/assets/icon-delivery-bike-red.png"
                class="mr-2"
                width="18"
                height="18"
                alt=""
                loading="lazy"
              />
              <span class="mr-4 capitalize">{{ $t("delivery") }}</span>
            </div>
          </div>
        </div>
        <div class="mb-3 text-center">
          <a
            v-if="tnc && isDesktop"
            target="_blank"
            :href="tnc"
            class="px-3 py-2 text-sm capitalize border rounded-full lg:py-1 border-red-dark text-red-dark lg:text-xs"
          >
            {{ $t("termAndCondition") }}
          </a>
        </div>
      </div>
      <div class="flex">
        <!-- bookable date time -->
        <div class="flex flex-shrink-0 text-sm" style="width: 620px">
          <section v-if="showBookableDate" class="w-8/12 lg:text-xs">
            <div class="mb-3 font-black">{{ $t("bookDayAndTime") }}</div>
            <div class="flex flex-col lg:flex-row">
              <div class="w-5/12">
                <div
                  v-for="opening in openingHoursGroupLeft"
                  :key="opening.day"
                  class="flex mb-3 lg:mr-4"
                >
                  <div style="width: 100px">{{ opening.day }}</div>
                  <div class="whitespace-nowrap">
                    {{ `${opening.start} - ${opening.end}` }}
                  </div>
                </div>
              </div>
              <div class="w-2/12"></div>
              <div class="w-5/12">
                <div
                  v-for="opening in openingHoursGroupRight"
                  :key="opening.day"
                  class="flex mb-3 mr-4"
                >
                  <div style="width: 100px">{{ opening.day }}</div>
                  <div class="whitespace-nowrap">
                    {{ `${opening.start} - ${opening.end}` }}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div class="w-3/12"></div>
          <div
            v-if="showPaxRule"
            class="flex flex-col w-5/12 lg:flex-row lg:w-7/12"
          >
            <!-- package detail section -->
            <section class="mb-0 text-xs">
              <div class="mb-3 font-black">{{ $t("packagaeDetail") }}</div>
              <div v-if="minPax" class="flex mb-3 whitespace-nowrap">
                <div class="mr-2" style="width: 100px">
                  {{ $t("min") }}
                </div>
                <div class="">{{ minPax }} {{ $tc("adult", minPax) }}</div>
              </div>
              <div v-if="maxPax" class="flex mb-3 whitespace-nowrap">
                <div class="mr-2" style="width: 100px">{{ $t("max") }}</div>
                <div class="">
                  <template v-if="maxPax !== 'No Limit'">
                    {{ maxPax }} {{ $tc("adult", maxPax) }}
                  </template>
                  <span v-else class="capitalize">{{ maxPax }}</span>
                </div>
              </div>
              <div
                v-if="maxPaxPerPack"
                class="flex mb-3 text-xs whitespace-nowrap"
              >
                <div class="mr-2" style="width: 100px">
                  {{ $t("maxPerPack") }}
                </div>
                <div class="">
                  {{ maxPaxPerPack }} {{ $tc("adult", maxPaxPerPack) }}
                </div>
              </div>
              <div v-if="timeLimit" class="flex mb-3 whitespace-nowrap">
                <div class="mr-2" style="width: 100px">
                  {{ $t("timeLimit") }}
                </div>
                <div class="">{{ timeLimit }}</div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <div v-if="useKidsPrice" class="flex" style="width: 723px">
        <div class="w-8/12"></div>
        <div class="w-3/12"></div>
        <div class="flex text-sm w-5/12 lg:w-7/12">
          <div class="flex">
            <div class="mb-0 mr-2 text-xs font-bold" style="width: 100px">
              {{ $t("kidsPrice") }}
            </div>
            <section class="mb-0 text-xs">
              <div
                v-for="(priceKids, index) in kidsPriceV2"
                :key="priceKids.priceValue + index"
                class="flex mb-3 whitespace-nowrap"
              >
                <div class="mr-2" style="width: 100px">
                  {{ priceKids.pricePolicy }}
                </div>
                <div>{{ $money(priceKids.priceValue) }}</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import packageDescriptionMixin from "./packageDescriptionMixin";

export default {
  mixins: [packageDescriptionMixin],
  data() {
    return {
      openingHoursGroupLeft: [],
      openingHoursGroupRight: [],
    };
  },
  mounted() {
    this.openingHoursGrouping();
  },
  methods: {
    openingHoursGrouping() {
      if (this.openingHours.length > 0) {
        if (this.openingHours.length > 4) {
          this.openingHoursGroupLeft = this.openingHours.slice(0, 4);
          this.openingHoursGroupRight = this.openingHours.slice(4);
        } else {
          this.openingHoursGroupLeft = this.openingHours;
        }
      }
    },
  },
};
</script>
