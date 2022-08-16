<template>
  <div
    class="relative p-3 pb-2 rounded-lg restaurant-card-full-detail"
    style="box-shadow: -1px 3px 6px rgba(0, 0, 0, 0.16)"
  >
    <a :href="link" class="relative block">
      <div class="flex">
        <!-- main image -->
        <div class="flex flex-col flex-shrink-0 main-image">
          <div v-if="isLoading" class="h-full bg-gray-300 animate-pulse"></div>
          <hh-image
            v-else
            :img="image"
            alt="restaurant image"
            :is-lazy="isLazyLoad"
            :desktop-width="80"
            :desktop-height="75"
            :mobile-width="80"
            class="mx-auto rounded-lg"
          ></hh-image>
        </div>
        <!-- information wrapper -->
        <div
          class="flex flex-col justify-between flex-auto pl-3"
          style="min-width: 0; min-height: 75px"
        >
          <!-- line 1 -->
          <div class="flex mb-1">
            <!-- name -->
            <div class="w-full mr-1 truncate">
              <h4
                class="w-full text-sm font-black truncate restaurant-name"
                :class="isLoading ? 'bg-gray-300 animate-pulse h-6' : ''"
              >
                {{ name }}
              </h4>
            </div>
            <!-- rating -->
            <div v-if="!isLoading" class="rating">
              <div
                class="flex items-center justify-center px-2 mx-auto text-2xl font-black text-center text-white rounded-lg bg-red-dark hover:bg-red-light"
              >
                <template v-if="isNewRestaurant">
                  <span class="py-1 mr-1 text-sm uppercase">{{
                    $t("new")
                  }}</span>
                </template>
                <template v-else>
                  <span class="mr-1 text-sm">{{ reviewsScore }}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
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
            </div>
          </div>
          <!-- line 2 -->
          <div class="flex items-center w-2/3 mb-1">
            <!-- cuisine -->
            <div class="flex items-center w-1/2">
              <div class="mr-1">
                <img
                  v-if="isStaycation"
                  class="mr-1 icon"
                   loading="lazy"
                  src="@/assets/icon-staycation-black.png"
                  alt=""
                />
                <img
                  v-else
                  class="mr-1 icon"
                  src="@/assets/icon-fork-black.png"
                  alt=""
                   loading="lazy"
                />
              </div>
              <span
                class="truncate text-2xs"
                :class="
                  isLoading ? ' bg-gray-300 animate-pulse h-3 w-full mr-1' : ''
                "
                >{{ cuisine }}</span
              >
            </div>
            <!-- location -->
            <div class="flex items-center w-1/2">
              <div class="flex-shrink-0 mr-1">
                <img
                  class="mr-1 icon"
                  src="@/assets/icon-pin-location-black.png"
                  alt=""
                   loading="lazy"
                />
              </div>
              <span
                class="truncate text-2xs"
                :class="
                  isLoading
                    ? ' bg-gray-300 animate-pulse h-3 w-full mr-1 text-gray-300'
                    : ''
                "
                >{{
                  location ||
                  `${totalLocations} ${$tc("branch", totalLocations)}`
                }}</span
              >
            </div>
          </div>
          <!-- line 3 (tags) -->
          <div class="w-2/3 mb-1">
            <div class="flex items-center">
              <div
                v-if="isLoading"
                class="w-full h-3 bg-gray-300 animate-pulse"
              ></div>
              <div v-else class="truncate">
                <a
                  v-for="(tag, index) in tags"
                  :key="index"
                  :href="`/restaurants/search?hashtags=${tag.id}`"
                  target="_blank"
                  class="mr-1 lowercase text-2xs hover-text-red-dark tag-color hover:underline"
                  >{{ `#${tag.label}` }}
                </a>
              </div>
            </div>
          </div>
          <!-- line 4 (last booking & view other branch (desktop) ) -->
          <div class="flex items-center w-9/12">
            <div v-if="lastBooking" class="flex items-center w-9/12">
              <img
                class="mr-1 icon"
                src="@/assets/icon-trend-black.png"
                alt=""
                 loading="lazy"
              />
              <div
                class="truncate text-2xs"
                :class="
                  isLoading ? 'bg-gray-300 animate-pulse text-gray-300' : ''
                "
              >
                {{ lastBooking }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- dine in & delivery icon -->
      <div
        v-if="!isLoading && isMobile"
        class="flex items-center mt-2 text-2xs"
      >
        <div v-if="anyDineInPackage" class="flex items-center mr-2">
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

        <div v-if="anyDeliveryPackage" class="flex items-center">
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
      </div>
      <!-- pricing -->
      <div v-if="!isLoading" class="text-right package-pricing">
        <div class="text-base font-black text-red-dark">
          {{ $money(packagePrice) }}
        </div>
        <div class="text-2xs text-red-dark">
          {{ packagePricingType }}
        </div>
        <div class="mb-1 text-gray-700 text-2xs">
          {{ $t("validUntil") }} {{ expiryDate }}
        </div>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      default: true,
    },
    isLazyLoad: {
      type: Boolean,
      default: true,
    },
    logo: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    cuisine: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "",
    },
    reviewsScore: {
      type: String,
      required: true,
    },
    reviewsCount: {
      type: Number,
      required: true,
    },
    totalLocations: {
      type: Number,
      default: 0,
    },
    anyDineInPackage: {
      type: Boolean,
      required: true,
    },
    anyDeliveryPackage: {
      type: Boolean,
      required: true,
    },
    packagePrice: {
      required: true,
    },
    packagePricingType: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default() {
        return [];
      },
    },
    openingHoursShort: {
      type: String,
      required: true,
    },
    lastBooking: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: String,
      required: true,
    },
    isStaycation: {
      type: Boolean,
      default: false,
    },
    isNewRestaurant: {
      type: Boolean,
      default: false,
    },
    isHaveBranch: {
      type: Boolean,
      default: false,
    },
    branchLink: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.restaurant-card-full-detail:hover .restaurant-name {
  @apply underline;
}

.main-image {
  width: 80px;
}
.icon {
  width: 14px;
  height: 14px;
}
.package-pricing {
  position: absolute;
  bottom: 0;
  right: 10px;
}
</style>
