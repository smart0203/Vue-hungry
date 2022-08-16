<template>
  <div class="px-3 pt-6 pb-4 border rounded-lg shadow pending-booking">
    <div class="flex pb-3">
      <div class="relative flex-shrink-0 mb-2 mr-4">
        <div class="relative">
          <HhImage
            :img="restaurantCover"
            class="flex-shrink-0 restaurant-image"
            :desktop-width="225"
            :mobile-width="200"
          />
          <div class="absolute left-0 text-2xs" style="bottom: -20px">
            <div class="w-10">
              <div
                class="flex items-center justify-center px-1 text-white rounded-lg bg-red-dark"
              >
                <span class="font-black capitalize">
                  {{ reviewsCount >= 5 ? reviewsScore : $t("new") }}
                </span>
                <svg
                  v-if="reviewsCount >= 5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  fill="currentColor"
                  class="inline icon-star-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
                  />
                </svg>
              </div>
            </div>

            <div class="flex pt-1 text-sm text-red-dark">
              <div v-if="anyDineInPackage" class="flex items-center pr-4 mr-1">
                <div class="flex-shrink-0 mr-1">
                  <img
                    src="@/assets/icon-plate-red.png"
                    width="13"
                    loading="lazy"
                    height="13"
                    alt="dine in icon"
                  />
                </div>
                <span class="text-xs capitalize whitespace-nowrap">{{
                  $t("dineIn")
                }}</span>
              </div>
              <div
                v-if="anyXperiencePackage"
                class="flex items-center pr-4 mr-1"
              >
                <div class="flex-shrink-0 mr-1">
                  <img
                    src="@/assets/icon-xperience.png"
                    width="13"
                    height="13"
                    loading="lazy"
                    alt="xperience icon"
                  />
                </div>
                <span class="text-xs capitalize whitespace-nowrap"
                  >Xperience</span
                >
              </div>
              <div v-if="anyDeliveryPackage" class="flex items-center">
                <div class="flex-shrink-0 mr-1">
                  <img
                    src="@/assets/icon-shopping-bag-red.png"
                    alt="delivery icon"
                    width="13"
                    loading="lazy"
                    height="13"
                  />
                </div>
                <span class="text-xs capitalize whitespace-nowrap">{{
                  $t("delivery")
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-9/12">
        <div class="flex">
          <div class="flex flex-col overflow-hidden">
            <h3 class="text-sm font-black leading-3 capitalize text-red-dark">
              {{ isDelivery ? $t("orderNow") : $t("bookItBeforeGone") }}!
            </h3>
            <div class="pb-1 mr-2 text-xs font-black truncate">
              {{ restaurantName }}
            </div>
          </div>
          <div class="flex items-start justify-end flex-grow">
            <button
              class="flex items-center justify-center font-black capitalize book-button disabled:opacity-25"
              :disabled="isLoadingGetRestaurantData"
              @click="$emit('on-book-now-clicked', id)"
            >
              <div
                v-if="isLoadingGetRestaurantData"
                class="mr-2 loader small white"
              ></div>
              {{ isDelivery ? $t("order") : $t("book") }}
            </button>
          </div>
        </div>
        <div class="flex">
          <!-- column 2 -->
          <div class="flex-grow text-xs">
            <!-- row 1 -->
            <div class="flex">
              <div class="flex-shrink-0">
                <img
                  class="icon-book-step"
                  loading="lazy"
                  src="@/assets/icon-date-red.png"
                  alt=""
                />
              </div>
              <div class="flex-shrink-0 w-24 text-xs capitalize text-red-dark">
                {{ $t("dateAndTime") }}
              </div>
              <div class="text-xs">
                {{ selectedDate }}
                {{ selectedTime ? $t("at") + " " + selectedTime : "" }}
              </div>
            </div>
            <!-- row 2 -->

            <div v-if="adult && !isDelivery" class="flex">
              <div class="flex-shrink-0">
                <img
                  class="icon-book-step"
                  loading="lazy"
                  src="@/assets/icon-people-group-red.png"
                  alt=""
                />
              </div>
              <div class="flex-shrink-0 w-24 text-xs capitalize text-red-dark">
                {{ $t("noOfPeople") }}
              </div>
              <div class="text-xs">
                <span class="capitalize"
                  >{{ adult }} {{ $tc("adult", adult) }}</span
                >
                <span class="capitalize">{{
                  kids ? `${kids} ${$tc("kids", kids)}` : ""
                }}</span>
              </div>
            </div>
            <!-- row 3 -->

            <div class="flex">
              <div class="flex-shrink-0">
                <img
                  class="icon-book-step"
                  src="@/assets/icon-menu-red.png"
                  alt=""
                  loading="lazy"
                />
              </div>
              <div class="flex-shrink-0 w-24 text-xs capitalize text-red-dark">
                {{ $t("package") }}
              </div>
              <div class="flex flex-col text-xs">
                <div>{{ packageTypeSummary }}</div>
                <div v-for="pack in packages" :key="pack.id">
                  {{ pack.name }}
                  {{
                    $money(
                      pack.isAlaCarte
                        ? pack.alaCarteTotalPrice
                        : pack.selectedRule.price
                    )
                  }}
                  {{
                    pack.isAlaCarte
                      ? ""
                      : packagePricingType(pack.pricingTypeSym, lang)
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center mr-4 text-xs text-right">
      <div class="flex-shrink-0 mr-1">
        <img
          width="12"
          loading="lazy"
          height="12"
          src="@/assets/icon-trend-black.png"
          alt=""
        />
      </div>
      <span>{{ lastOrderCTA }}</span>
    </div>
  </div>
</template>

<script>
import mixin from "./pendingBookingMixin";
export default {
  name: "PendingBookingMobile",
  mixins: [mixin],
};
</script>
