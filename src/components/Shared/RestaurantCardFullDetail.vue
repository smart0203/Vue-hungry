<template>
  <div
    class="relative block p-3 pb-2 rounded-lg lg:px-4 lg:py-6 restaurant-card-full-detail"
    style="box-shadow: -1px 3px 6px rgba(0, 0, 0, 0.16)"
  >
    <div class="flex">
      <!-- main image -->
      <div class="relative flex items-center flex-shrink-0">
        <!-- custom text -->
        <div
          v-if="restaurant.customText"
          class="absolute left-0 py-1 text-center text-white border-l-0 lg:pl-1 text-2xs bg-red-dark"
          style="
            top: 10px;
            min-width: 45%;
            border-top-right-radius: 9999px;
            border-bottom-right-radius: 9999px;
          "
        >
          {{ restaurant.customText }}
        </div>

        <a
          :href="restaurant.link.value"
          class="flex flex-col flex-shrink-0 main-image"
          @click.prevent="$emit('on-link-clicked')"
        >
          <div v-if="isLoading" class="h-full bg-gray-300"></div>
          <div v-else>
            <hh-image
              :img="restaurant.imageCoverUrl.original"
              alt="restaurant image"
              :is-lazy="isLazyLoad"
              :desktop-width="225"
              :desktop-height="145"
              :mobile-width="80"
              :mobile-height="85"
              class="mx-auto rounded-lg"
            ></hh-image>
          </div>
        </a>
      </div>
      <!-- information wrapper -->
      <div
        class="flex flex-col justify-between flex-auto pl-3 lg:pl-8 restaurant-attribute"
        style="min-width: 0"
      >
        <!-- line 1 -->
        <a
          :href="restaurant.link.value"
          class="flex mb-1"
          @click.prevent="$emit('on-link-clicked')"
        >
          <!-- logo -->
          <div
            v-if="isDesktop && restaurant.logo"
            class="flex-shrink-0 mr-3"
            style="width: 55px; height: 55px"
          >
            <hh-image
              :img="restaurant.logo"
              :desktop-width="55"
              :desktop-height="55"
              alt="restaurant logo"
              class="h-full rounded-full"
            />
          </div>
          <!-- name -->
          <div class="w-full mr-1 truncate">
            <h4
              class="flex items-center restaurant-name"
              :class="isLoading ? 'bg-gray-300  h-6' : ''"
            >
              <!-- ads label -->

              <template v-if="restaurant.isAds">
                <div
                  class="flex-shrink-0 mr-1 text-xs font-black lg:text-base"
                  :class="isLoading ? ' text-gray-300  h-6' : 'text-red-dark'"
                >
                  Ad
                </div>
                <div
                  class="flex-shrink-0 w-2 h-2 mr-1 rounded-full"
                  :class="isLoading ? ' bg-gray-300' : 'bg-red-dark'"
                ></div>
              </template>
              <div class="w-full text-sm font-black truncate lg:text-base">
                {{ restaurant.name }}
              </div>
            </h4>
            <div
              v-if="!isLoading && isDesktop"
              class="flex items-center mt-1 text-2xs lg:text-sm"
            >
              <div
                v-if="restaurant.anyDineInPackage"
                class="flex items-center mr-2"
              >
                <div class="mr-1">
                  <img
                    src="@/assets/icon-plate-red.png"
                    class="flex-shrink-0 icon"
                    alt="dine in icon"
                     loading="lazy"
                  />
                </div>
                <span class="whitespace-nowrap text-red-dark">Dine-in</span>
              </div>

              <div
                v-if="restaurant.anyDeliveryPackage"
                class="flex items-center mr-2"
              >
                <div class="mr-1">
                  <img
                    src="@/assets/icon-shopping-bag-red.png"
                    class="flex-shrink-0 icon"
                    alt="delivery icon"
                     loading="lazy"
                  />
                </div>
                <span class="whitespace-nowrap text-red-dark">Delivery</span>
              </div>

              <div
                v-if="restaurant.anyXperiencePackage"
                class="flex items-center mr-2"
              >
                <div class="mr-1">
                  <img
                    src="@/assets/icon-xperience.png"
                    class="flex-shrink-0 icon"
                    alt="xperience icon"
                     loading="lazy"
                  />
                </div>
                <span class="whitespace-nowrap text-red-dark">Xperience</span>
              </div>

              <!-- delivery property -->
              <div
                v-if="isDesktop && restaurant.deliveryProperty.isShow"
                class="flex items-center"
              >
                <img
                  class="mr-1 icon"
                   loading="lazy"
                  :src="deliveryIcon"
                  alt="icon delivery man black"
                />
                <div
                  class="capitalize truncate text-2xs lg:text-sm"
                  :class="[
                    restaurant.deliveryProperty.isLoading
                      ? 'bg-gray-300  text-gray-300 h-4 w-10'
                      : '',
                    restaurant.anyDeliveryPackage ? 'capitalize' : null,
                  ]"
                >
                  {{ deliveryFeeText }}
                </div>
              </div>

              <!-- Accepting Voucher -->
              <div
                v-if="restaurant.acceptVoucher && isDesktop"
                class="flex items-center mr-2 text-xs"
              >
                <span>
                  <HhImage
                    :img="'@/assets/ic_use_voucher.png'"
                    :fallback="'@/assets/ic_use_voucher.png'"
                    is-local-image
                    loading="lazy"
                    class="icon"
                  />
                </span>
                <span class="ml-1 text-xs text-red-dark">
                  {{ $t("acceptsVoucher") }}</span
                >
              </div>
            </div>
          </div>
          <!-- rating -->
          <div v-if="!isLoading" class="rating">
            <div
              class="flex items-center justify-center px-2 mx-auto text-2xl font-black text-center text-white rounded-lg bg-red-dark hover:bg-red-light"
            >
              <template v-if="restaurant.isNewRestaurant">
                <span class="text-sm uppercase lg:py-1 lg:mr-1 lg:text-xl">{{
                  $t("new")
                }}</span>
              </template>
              <template v-else>
                <span class="mr-1 text-sm lg:text-2xl">{{
                  restaurant.reviewsScore
                }}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  :width="isDesktop ? 20 : 13"
                  :height="isDesktop ? 20 : 13"
                  fill="currentColor"
                  class="inline icon-star-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
                  />
                </svg>
              </template>
            </div>
            <div
              v-if="isDesktop && restaurant.reviewsCount"
              class="text-xs text-center text-gray-600 whitespace-nowrap"
            >
              {{
                $tc("rating", restaurant.reviewsCount, {
                  count: restaurant.reviewsCount.toLocaleString("en-US"),
                })
              }}
            </div>
          </div>
        </a>
        <div class="flex justify-between">
          <!-- line 2 & 3 wrapper -->
          <div class="w-2/3">
            <!-- line 2 -->
            <div class="flex items-center w-full mb-1">
              <!-- cuisine -->
              <div class="flex items-center w-1/2 lg:w-1/3">
                <div class="mr-1">
                  <img
                    v-if="restaurant.isStaycation"
                    class="mr-1 icon"
                     loading="lazy"
                    src="@/assets/icon-staycation-black.png"
                    alt=""
                  />
                  <img
                    v-else
                    class="mr-1 icon"
                     loading="lazy"
                    src="@/assets/icon-fork-black.png"
                    alt=""
                  />
                </div>
                <span
                  class="truncate text-2xs lg:text-sm"
                  :class="
                    isLoading ? ' bg-gray-300  h-3 lg:h-4 w-full mr-1' : ''
                  "
                  >{{ restaurant.primaryCuisine.name }}</span
                >
              </div>
              <!-- location -->
              <div class="flex items-center w-1/2 lg:w-1/3">
                <div class="flex-shrink-0 mr-1">
                  <img
                    class="mr-1 icon"
                     loading="lazy"
                    src="@/assets/icon-pin-location-black.png"
                    alt=""
                  />
                </div>
                <span
                  class="truncate text-2xs lg:text-sm"
                  :class="
                    isLoading
                      ? ' bg-gray-300  h-3 lg:h-4 w-full mr-1 text-gray-300'
                      : ''
                  "
                  >{{
                    restaurant.primaryLocation.name ||
                    `${restaurant.totalLocations} ${$tc(
                      "branch",
                      restaurant.totalLocations
                    )}`
                  }}</span
                >
              </div>
              <!-- opening hour summary (desktop) -->
              <div v-if="isDesktop" class="flex items-center lg:w-1/3">
                <img
                  class="m-2 icon"
                  src="@/assets/icon-clock-black.png"
                   loading="lazy"
                  alt=""
                />
                <span
                  class="text-sm"
                  :class="
                    isLoading
                      ? ' bg-gray-300  h-3 lg:h-4 w-full mr-1 text-gray-300'
                      : ''
                  "
                  >{{ restaurant.openingHoursShort }}</span
                >
              </div>
            </div>
            <!-- line 3 (tags) -->
            <div
              v-if="restaurant.tags && restaurant.tags.length"
              class="w-full mb-1 lg:w-10/12"
            >
              <div class="flex items-center lg:truncate">
                <img
                  class="mr-1 icon"
                  src="@/assets/icon-tag-black.png"
                  alt=""
                   loading="lazy"
                />
                <div
                  v-if="isLoading"
                  class="w-full h-3 bg-gray-300 lg:h-4"
                ></div>
                <div
                  v-else
                  class="truncate lg:pb-1 lg:whitespace-normal lg:h-6"
                >
                  <a
                    v-for="(tag, index) in restaurant.tags"
                    :key="index"
                    :href="`/restaurants/search?hashtags=${tag.id}`"
                    target="_blank"
                    class="mr-1 lowercase text-2xs hover-text-red-dark tag-color hover:underline lg:text-sm"
                    >{{ `#${tag.label}` }}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <!-- love button -->
          <button
            v-if="isShowFavouriteButton"
            class="absolute"
            style="top: 40px; right: 15px"
            @click="onFavouriteClick"
          >
            <img
              id="add-to-fav"
              class="inline-block cursor-pointer"
              :src="favouriteIcon"
              style="width: 25px"
               loading="lazy"
              alt="heart icon"
            />
          </button>
        </div>
        <!-- line 4 (last booking & view other branch) -->
        <div class="flex items-center w-9/12 mb-1">
          <div
            v-if="restaurant.lastBookingWasMadeCTA"
            class="flex items-center lg:w-9/12"
          >
            <img class="mr-1 icon"  loading="lazy" src="@/assets/icon-trend-black.png" alt="" />
            <div
              class="truncate text-2xs lg:text-sm"
              :class="isLoading ? 'bg-gray-300  text-gray-300' : ''"
            >
              {{ restaurant.lastBookingWasMadeCTA }}
            </div>
          </div>
          <a
            v-if="restaurant.isHaveBranch && isDesktop && restaurant.branchLink"
            class="flex items-center cursor-pointer xl:w-1/3"
            :href="restaurant.branchLink"
          >
            <img
              class="m-2 icon"
              src="@/assets/icon-location-plus-red.png"
               loading="lazy"
              alt=""
            />
            <span
              class="text-sm whitespace-nowrap text-red-dark hover:underline"
              >{{ $t("viewOtherBranch") }}</span
            >
          </a>
        </div>
        <!-- line 5 (delivery fee (mobile)) -->
        <div
          v-if="isMobile && restaurant.deliveryProperty.isShow"
          class="flex items-center"
        >
          <div class="flex items-center lg:w-9/12">
            <img
              class="mr-1 icon"
               loading="lazy"
              :src="deliveryIcon"
              alt="icon delivery man black"
            />
            <div
              class="truncate text-2xs lg:text-sm"
              :class="[
                restaurant.deliveryProperty.isLoading
                  ? 'bg-gray-300  text-gray-300 h-4 w-10'
                  : '',
                restaurant.anyDeliveryPackage ? 'capitalize' : null,
              ]"
            >
              {{ deliveryFeeText }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- dine in & delivery icon -->
    <div
      v-if="!isLoading && isMobile"
      class="flex items-center mt-2 text-2xs lg:text-sm"
    >
      <div v-if="restaurant.anyDineInPackage" class="flex items-center mr-2">
        <div class="mr-1">
          <img
            src="@/assets/icon-plate-red.png"
            class="flex-shrink-0 icon"
             loading="lazy"
            alt="dine in icon"
          />
        </div>
        <span class="whitespace-nowrap text-red-dark">Dine-in</span>
      </div>

      <div v-if="restaurant.anyXperiencePackage" class="flex items-center mr-2">
        <div class="mr-1">
          <img
            src="@/assets/icon-xperience.png"
            class="flex-shrink-0 icon"
            alt="delivery xperience"
             loading="lazy"
          />
        </div>
        <span class="whitespace-nowrap text-red-dark">Xperience</span>
      </div>

      <div v-if="restaurant.anyDeliveryPackage" class="flex items-center mr-2">
        <div class="mr-1">
          <img
            src="@/assets/icon-shopping-bag-red.png"
            class="flex-shrink-0 icon"
             loading="lazy"
            alt="delivery icon"
          />
        </div>
        <span class="whitespace-nowrap text-red-dark">Delivery</span>
      </div>

      <!-- Accepting Voucher -->
      <div
        v-if="restaurant.acceptVoucher && isMobile"
        class="flex items-center"
      >
        <div class="flex items-center lg:w-9/12">
          <span>
            <HhImage
              :img="'@/assets/ic_use_voucher.png'"
              :fallback="'@/assets/ic_use_voucher.png'"
              is-local-image
              loading="lazy"
              class="delivery icon"
            />
          </span>
          <span class="ml-1 text-red-dark"> {{ $t("acceptsVoucher") }}</span>
        </div>
      </div>
    </div>
    <!-- pricing -->
    <div v-if="!isLoading" class="text-right package-pricing">
      <template v-if="restaurant.price.amount > 0">
        <div class="text-base font-black text-red-dark lg:text-xl">
          {{ $money(restaurant.price.amount) }}
        </div>
        <div class="text-2xs lg:text-xs text-red-dark">
          {{ restaurant.pricingType }}
        </div>
      </template>
      <div
        v-if="(isOneMonthWillExpired && isDesktop) || isMobile"
        :class="isOneMonthWillExpired ? 'opacity-100' : ' opacity-0'"
        class="mb-1 text-gray-700 lg:mb-0 text-2xs lg:text-xs"
      >
        {{ $t("validUntil") }}
        {{ $dayjs(restaurant.expiryDate, "YYYY-MM-DD").format("MMM DD") }}
      </div>
    </div>
  </div>
</template>

<script>
const iconHeartBlack = require("@/assets/icon-heart-black.png");
const iconHeartRed = require("@/assets/icon-heart-red.png");
const iconDistance = require("@/assets/icon-distance-black.png");
const iconDelivery = require("@/assets/icon-delivery-man-black.png");
import { convertToNumber } from "@/helper/stringHelper";

export default {
  props: {
    restaurant: {
      type: Object,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: true,
    },
    isLazyLoad: {
      type: Boolean,
      default: true,
    },
    isShowFavouriteButton: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isOneMonthWillExpired() {
      return this.$dayjs(this.expiryDate, "YYYY-MM-DD").diff(
        this.$dayjs(),
        "day"
      ) <= 30
        ? true
        : false;
    },
    favouriteIcon() {
      return this.restaurant.isFavourited ? iconHeartRed : iconHeartBlack;
    },
    deliveryFeeText() {
      if (this.restaurant.anyDeliveryPackage) {
        if (convertToNumber(this.restaurant.deliveryProperty.deliveryFee)) {
          return `${this.$money(
            this.restaurant.deliveryProperty.deliveryFee
          )}  ${this.$t("deliveryFee")}`;
        }
        return this.$t("freeDelivery");
      }
      return `${this.restaurant.deliveryProperty.distance} km`;
    },
    deliveryIcon() {
      if (this.restaurant.anyDeliveryPackage) {
        return iconDelivery;
      }
      return iconDistance;
    },
  },
  methods: {
    onFavouriteClick() {
      this.$emit("on-favourite-clicked");
    },
  },
};
</script>

<style lang="scss" scoped>
.restaurant-card-full-detail:hover .restaurant-name {
  @apply underline;
}

.restaurant-card-full-detail {
  .restaurant-attribute {
    min-height: 85px;

    @screen lg {
      min-height: 145px;
    }
  }
}

.main-image {
  width: 80px;

  @screen md {
    width: 100px;
  }

  @screen lg {
    width: 225px;
    height: 145px;
  }
}

.icon {
  width: 14px;
  height: 14px;
}

.package-pricing {
  position: absolute;
  bottom: 0;
  right: 10px;

  @screen lg {
    bottom: 23px;
  }
}
</style>
