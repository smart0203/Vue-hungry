<template>
  <a
    :href="restaurant.link.value"
    class="block my-2 bg-white rounded-lg restaurant-card card-shadow"
    @click.prevent="$emit('on-link-clicked')"
  >
    <!-- restaurant image -->
    <div class="relative">
      <div class="flex items-center">
        <template v-if="!isLoading">
          <hh-image
            :is-lazy="isLazyLoadMainImage"
            :img="restaurant.imageCoverUrl.original"
            alt="restaurant image"
            mobile-width="full-screen"
            :mobile-height="150"
            width="full-screen"
            height="150"
            class="w-full mx-auto rounded-tl-lg rounded-tr-lg bg-gray-300"
            style="height: 150px"
          ></hh-image>

          <div
            class="absolute top-0 left-0 flex items-center justify-center px-1 font-black text-white rounded-md bg-red-dark"
            style="top: 15px"
            :class="restaurant.reviewsCount >= 5 ? '' : 'new-restaurant'"
          >
            <span
              class="uppercase lg:text-sm"
              :class="restaurant.reviewsCount >= 5 ? 'text-sm' : 'text-sm'"
              >{{
                restaurant.reviewsCount >= 5
                  ? restaurant.reviewsScore
                  : $t("new")
              }}</span
            >
            <svg
              v-if="restaurant.reviewsCount >= 5"
              xmlns="http://www.w3.org/2000/svg"
              :width="isDesktop ? 14 : 14"
              :height="isDesktop ? 14 : 14"
              fill="currentColor"
              class="flex-shrink-0 inline mx-1 icon-star-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
              />
            </svg>
          </div>
        </template>
        <template v-else>
          <div class="w-full h-32 bg-gray-300"></div>
        </template>
      </div>
    </div>
    <!-- restaurant info -->
    <div class="flex items-center p-2 pb-0">
      <div class="flex flex-col flex-grow w-8/12">
        <!-- restaurant name -->
        <div class="flex flex-col">
          <span
            v-if="!isLoading"
            class="mb-1 text-xs font-black truncate lg:mb-2 lg:text-sm ma0 restaurant-name"
          >
            {{ restaurant.name }}
          </span>
          <span v-else class="h-5 bg-gray-300"></span>
        </div>
      </div>
      <div class="flex items-end justify-around pl-1">
        <!-- is loading for restaurant rating, review score -->
        <template v-if="!isLoading">
          <div class="flex items-center justify-end leading-none">
            <img
              src="@/assets/icon-price-red.png"
              class="pricetag-icon"
              alt="pricetag-icon"
              width="12"
              height="12"
              loading="lazy"
            />
            <span
              class="ml-1 text-xs font-black lg:text-base text-red-dark pricing"
              >{{ $money(restaurant.price.amount) }}</span
            >
          </div>
          <div class="ml-2 text-right whitespace-nowrap text-2xs text-red-dark">
            {{ restaurant.pricingType }}
          </div>
        </template>
        <template v-else>
          <div class="w-10/12 h-4 mx-auto mb-2 bg-gray-300"></div>
          <div class="w-10/12 h-2 mx-auto bg-gray-300"></div>
        </template>
      </div>
    </div>

    <div>
      <div class="flex p-2 pt-0">
        <!-- side by side cuisine,location with rating -->
        <div class="flex flex-col w-full">
          <!-- restaurant cuisine & location -->
          <div class="flex items-center justify-around mb-1">
            <div class="flex items-center justify-around w-1/2">
              <div class="flex items-center w-1/2">
                <template v-if="!isLoading">
                  <div class="mr-1">
                    <img
                      v-if="restaurant.isStaycation"
                      src="@/assets/icon-staycation-black.png"
                      alt="staycation-icon"
                      width="12"
                      height="12"
                      loading="lazy"
                    />
                    <img
                      v-else
                      src="@/assets/icon-fork-black.png"
                      alt="cuisine-icon"
                      width="12"
                      height="12"
                      loading="lazy"
                    />
                  </div>
                  <span class="truncate text-2xs lg:text-xs cuisine-label">{{
                    restaurant.primaryCuisine.name
                  }}</span>
                </template>
                <template v-else>
                  <div class="w-full h-2 mt-2 mr-2 bg-gray-300"></div>
                </template>
              </div>
              <div class="flex items-center w-1/2">
                <template
                  v-if="
                    !isLoading &&
                    (restaurant.primaryLocation.name ||
                      restaurant.totalLocations)
                  "
                >
                  <div class="flex-shrink-0 mr-1">
                    <img
                      class="location-icon"
                      src="@/assets/icon-pin-location-black.png"
                      alt="location-icon"
                      width="12"
                      height="12"
                      loading="lazy"
                    />
                  </div>
                  <span class="truncate text-2xs lg:text-xs location-label">{{
                    restaurant.primaryLocation.name ||
                    `${restaurant.totalLocations} ${$tc(
                      "branch",
                      restaurant.totalLocations
                    )}`
                  }}</span>
                </template>
                <template v-else>
                  <div class="w-full h-2 mt-2 mr-2 bg-gray-300"></div>
                </template>
              </div>
            </div>
            <div class="flex items-center w-1/2">
              <div
                v-if="restaurant.anyDineInPackage"
                class="flex items-center justify-end w-full text-2xs"
              >
                <template v-if="!isLoading">
                  <div class="mr-1">
                    <img
                      class="dine-in-icon"
                      src="@/assets/icon-plate-red.png"
                      width="12"
                      height="12"
                      alt="dine in icon"
                      loading="lazy"
                    />
                  </div>
                  <span class="whitespace-nowrap">Dine-in</span>
                </template>
                <template v-else>
                  <div class="w-full h-2 mt-2 mr-2 bg-gray-300"></div>
                </template>
              </div>
              <div
                v-if="restaurant.anyXperiencePackage"
                class="flex items-center justify-end w-full text-2xs"
              >
                <template v-if="!isLoading">
                  <div class="mr-1">
                    <img
                      class="xperience-icon"
                      src="@/assets/icon-xperience.png"
                      alt="xperience icon"
                      width="12"
                      loading="lazy"
                      height="12"
                    />
                  </div>
                  <span class="whitespace-nowrap">XP</span>
                </template>
                <template v-else>
                  <div class="w-full h-2 mt-2 mr-2 bg-gray-300"></div>
                </template>
              </div>
              <div
                v-if="restaurant.anyDeliveryPackage"
                class="flex items-center justify-end w-full text-2xs"
              >
                <template v-if="!isLoading">
                  <div class="mr-1">
                    <img
                      class="delivery-icon"
                      src="@/assets/icon-shopping-bag-red.png"
                      alt="delivery icon"
                      width="12"
                      height="12"
                      loading="lazy"
                    />
                  </div>
                  <span class="whitespace-nowrap">Delivery</span>
                </template>
                <template v-else>
                  <div class="w-full h-2 mt-2 mr-2 bg-gray-300"></div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a>
</template>

<script>
export default {
  props: {
    restaurant: {
      type: Object,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isLazyLoadMainImage: {
      type: Boolean,
      default: true,
    },
    imageWidthDesktop: {
      type: Number,
      default: 225,
    },
    imageWidthMobile: {
      type: Number,
      default: 200,
    },
  },
};
</script>
