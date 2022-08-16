<template>
  <div class="max-width">
    <div class="flex px-10 py-6 border rounded-lg shadow pending-booking">
      <div class="relative">
        <div class="w-3/12 overflow-hidden restaurant-image">
          <HhImage
            :img="restaurantCover"
            class="flex-shrink-0 rounded-lg"
            :desktop-width="225"
            :mobile-width="200"
          />
        </div>

        <div class="absolute left-0" style="bottom: -20px">
          <div class="text-xl">
            <div
              class="flex items-center justify-center px-1 text-white rounded-lg bg-red-dark"
            >
              <span class="font-black capitalize">
                {{ reviewsCount >= 5 ? reviewsScore : $t("new") }}
              </span>
              <svg
                v-if="reviewsCount >= 5"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="inline ml-1 icon-star-fill"
                viewBox="0 0 16 16"
              >
                <path
                  d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
                />
              </svg>
            </div>
          </div>
          <div v-if="reviewsCount > 0" class="inline text-xs text-gray-500">
            {{ $tc("rating", reviewsCount, { count: reviewsCount }) }}
          </div>
        </div>
      </div>
      <div class="w-full">
        <h3 class="mx-6 mb-2 text-xl font-black capitalize text-red-dark">
          {{ isDelivery ? $t("orderNow") : $t("bookItBeforeGone") }}!
        </h3>
        <div class="flex">
          <!-- column 1 -->
          <div class="flex flex-col w-5/12 mx-6">
            <!-- row 1 -->
            <div class="flex mb-2">
              <HhImage
                v-if="isDesktop && restaurantIcon"
                :img="restaurantIcon"
                class="mr-3 rounded-full restaurant-icon"
              />
              <div class="overflow-hidden">
                <div class="pb-1 font-black truncate">
                  {{ restaurantName }}
                </div>

                <div class="flex text-sm text-red-dark">
                  <div
                    v-if="anyDineInPackage"
                    class="flex items-center flex-shrink-0 mr-2"
                  >
                    <div class="mr-1">
                      <img
                        src="@/assets/icon-plate-red.png"
                        width="20"
                        height="20"
                        loading="lazy"
                        alt="dine in icon"
                      />
                    </div>
                    <span class="capitalize whitespace-nowrap">{{
                      $t("dineIn")
                    }}</span>
                  </div>

                  <div
                    v-if="anyXperiencePackage"
                    class="flex items-center flex-shrink-0 mr-2"
                  >
                    <div class="mr-1">
                      <img
                        src="@/assets/icon-xperience.png"
                        width="20"
                        height="20"
                        loading="lazy"
                        alt="xperience icon"
                      />
                    </div>
                    <span class="capitalize whitespace-nowrap">XP</span>
                  </div>

                  <div
                    v-if="anyDeliveryPackage"
                    class="flex items-center flex-shrink-0 mr-2"
                  >
                    <div class="mr-1">
                      <img
                        src="@/assets/icon-shopping-bag-red.png"
                        alt="delivery icon"
                        width="20"
                        height="20"
                        loading="lazy"
                      />
                    </div>
                    <span class="capitalize whitespace-nowrap">{{
                      $t("delivery")
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- row 2 -->
            <div class="flex mb-2">
              <div class="flex items-center mr-2">
                <div class="mr-1">
                  <img
                    class="icon"
                    src="@/assets/icon-fork-black.png"
                    loading="lazy"
                    alt=""
                  />
                </div>
                <span class="truncate text-3xs lg:text-xs">{{ cuisine }}</span>
              </div>
              <div class="flex items-center">
                <div class="flex-shrink-0 mr-1">
                  <img
                    class="icon"
                    loading="lazy"
                    src="@/assets/icon-pin-location-black.png"
                    alt=""
                  />
                </div>
                <span class="truncate text-3xs lg:text-xs">{{
                  location || `${totalLocations} ${$t("branch")}`
                }}</span>
              </div>
            </div>
            <!-- row 3 -->
            <span class="flex items-center">
              <img
                class="mr-2 icon"
                loading="lazy"
                src="@/assets/icon-trend-black.png"
                alt=""
              />
              <span class="text-sm">{{ lastOrderCTA }}</span>
            </span>
          </div>
          <!-- column 2 -->
          <div class="w-6/12 mr-10 text-sm">
            <!-- row 1 -->
            <div class="flex mb-2">
              <div class="flex-shrink-0">
                <img
                  class="icon-book-step"
                  loading="lazy"
                  src="@/assets/icon-date-red.png"
                  alt=""
                />
              </div>
              <div class="flex-shrink-0 w-32 capitalize text-red-dark">
                {{ $t("dateAndTime") }}
              </div>
              <div>
                {{ selectedDate }}
                {{ selectedTime ? $t("at") + " " + selectedTime : "" }}
              </div>
            </div>
            <!-- row 2 -->

            <div v-if="adult && !isDelivery" class="flex mb-2">
              <div class="flex-shrink-0">
                <img
                  class="icon-book-step"
                  loading="lazy"
                  src="@/assets/icon-people-group-red.png"
                  alt=""
                />
              </div>
              <div class="flex-shrink-0 w-32 capitalize text-red-dark">
                {{ $t("numberOfPeople") }}
              </div>
              <div>
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
                  loading="lazy"
                  src="@/assets/icon-menu-red.png"
                  alt=""
                />
              </div>
              <div class="flex-shrink-0 w-32 capitalize text-red-dark">
                {{ $t("package") }}
              </div>
              <div class="flex flex-col">
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
          <!-- column 3 -->
          <div class="flex items-end justify-end flex-grow">
            <button
              class="flex items-center justify-center font-black capitalize book-button disabled:opacity-25"
              :disabled="isLoadingGetRestaurantData"
              @click="$emit('on-book-now-clicked', id)"
            >
              <div
                v-if="isLoadingGetRestaurantData"
                class="mr-2 loader small white"
              ></div>
              {{ isDelivery ? $t("orderNow") : $t("bookNow") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "./pendingBookingMixin";
export default {
  name: "PendingBookingDesktop",
  mixins: [mixin],
};
</script>
