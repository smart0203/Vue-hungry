<template>
  <a
    class="restaurant-card-big"
    :href="link"
    @click.prevent="$emit('on-link-clicked')"
  >
    <div class="flex w-full h-full bg-white rounded-lg card-shadow">
      <div
        v-if="isLoading"
        class="flex-shrink-0 w-full text-transparent bg-gray-300 cover-img"
      ></div>
      <div v-else class="flex flex-shrink-0 overflow-hidden">
        <div>
          <HhImage
            class="rounded-tl-lg rounded-bl-lg cover-img"
            :img="img"
            alt="restaurant image"
            :desktop-width="415"
            :desktop-height="250"
            :mobile-width="400"
            :mobile-height="250"
            width="400"
            height="250"
            :is-lazy="isLazyLoadMainImage"
          />
        </div>
      </div>
      <div
        class="flex flex-col flex-grow p-2 overflow-auto lg:overflow-hidden lg:p-4"
      >
        <div class="flex">
          <div class="overflow-hidden lg:w-full">
            <div
              class="mr-1 text-xs font-black truncate lg:text-base lg:break-normal lg:whitespace-normal"
              :class="
                isLoading
                  ? '  bg-gray-300 text-transparent h-5 lg:h-10 mb-2'
                  : ''
              "
            >
              {{ name }}
            </div>
          </div>
          <div
            class="flex justify-end flex-grow flex-shrink-0 leading-none lg:w-auto lg:mr-0"
          >
            <div>
              <div class="flex">
                <div
                  v-if="isLoading"
                  class="mr-1 text-transparent bg-gray-300 pricetag-icon"
                ></div>
                <img
                  v-else
                  src="@/assets/icon-price-red.png"
                  class="flex-shrink-0 pricetag-icon"
                  alt="pricetag-icon"
                  width="13"
                   loading="lazy"
                  height="13"
                />
                <div
                  class="text-sm font-black text-right lg:text-2xl"
                  :class="
                    isLoading
                      ? '  bg-gray-300 text-transparent w-10'
                      : 'text-red-dark'
                  "
                >
                  {{ $money(price) }}
                </div>
              </div>
              <div
                class="text-right text-2xs lg:text-xs"
                :class="
                  isLoading ? '  bg-gray-300 text-transparent' : 'text-red-dark'
                "
              >
                {{ pricingType }}
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="isLoading"
          class="h-10 text-transparent bg-gray-300 lg:h-20"
        ></div>
        <HHTextTruncate
          v-else
          class="my-2 text-2xs lg:text-xs"
          :can-read-more="false"
          :text="description"
          :max-length="isDesktop ? 250 : 100"
        />

        <div class="flex flex-col justify-end flex-grow">
          <!-- restaurant cuisine & location -->
          <div class="flex items-center justify-around mb-1">
            <div class="flex items-center w-1/2">
              <div class="mr-1">
                <div
                  v-if="isLoading"
                  class="w-4 h-4 mr-1 text-transparent bg-gray-300 icon"
                ></div>
                <img
                  v-else
                  class="icon"
                  src="@/assets/icon-fork-black.png"
                  alt="cuisine icon"
                  width="14"
                   loading="lazy"
                  height="14"
                />
              </div>
              <span
                class="truncate text-2xs lg:text-xs"
                :class="
                  isLoading ? '  bg-gray-300 text-transparent h-4 w-1/2' : ''
                "
                >{{ cuisine }}</span
              >
            </div>
            <div class="flex items-center w-1/2">
              <div class="flex-shrink-0 mr-1">
                <div
                  v-if="isLoading"
                  class="w-4 h-4 mr-1 text-transparent bg-gray-300 icon"
                ></div>
                <img
                  v-else
                  class="icon"
                  src="@/assets/icon-pin-location-black.png"
                  alt="location icon"
                  width="14"
                   loading="lazy"
                  height="14"
                />
              </div>
              <span
                class="truncate text-2xs lg:text-xs"
                :class="isLoading ? '  bg-gray-300 text-transparent' : ''"
                >{{
                  location || `${totalLocation} ${$tc("branch", totalLocation)}`
                }}</span
              >
            </div>
          </div>
          <!-- restaurant dine in / delivery/ Xperience -->
          <div class="flex items-center justify-between text-2xs lg:text-2xs">
            <div class="flex">
              <div
                v-if="anyDineInPackage"
                class="flex items-center flex-shrink-0 mr-1"
              >
                <div class="flex-shrink-0 mr-1">
                  <div
                    v-if="isLoading"
                    class="w-4 h-4 mr-1 text-transparent bg-gray-300 icon"
                  ></div>
                  <img
                    v-else
                    class="icon"
                    src="@/assets/icon-plate-red.png"
                    alt="dine in icon"
                    width="14"
                     loading="lazy"
                    height="14"
                  />
                </div>
                <span
                  class="truncate whitespace-nowrap"
                  :class="isLoading ? '  bg-gray-300 text-transparent h-4' : ''"
                  >Dine-in</span
                >
              </div>

              <div
                v-if="anyXperiencePackage"
                class="flex items-center flex-shrink-0 mr-1"
              >
                <div class="flex-shrink-0 mr-1">
                  <div
                    v-if="isLoading"
                    class="w-4 h-4 mr-1 text-transparent bg-gray-300 icon"
                  ></div>
                  <img
                    v-else
                    class="icon"
                    src="@/assets/icon-xperience.png"
                    alt="xperience icon"
                    width="14"
                     loading="lazy"
                    height="14"
                  />
                </div>
                <span
                  class="truncate whitespace-nowrap"
                  :class="isLoading ? '  bg-gray-300 text-transparent' : ''"
                  >XP</span
                >
              </div>

              <div
                v-if="anyDeliveryPackage"
                class="flex items-center mr-1 lg:flex-shrink-0"
              >
                <div class="flex-shrink-0 mr-1">
                  <div
                    v-if="isLoading"
                    class="w-4 h-4 mr-1 text-transparent bg-gray-300 icon"
                  ></div>
                  <img
                    v-else
                    class="icon"
                    src="@/assets/icon-shopping-bag-red.png"
                    alt="delivery icon"
                     loading="lazy"
                    width="14"
                    height="14"
                  />
                </div>
                <span
                  class="truncate whitespace-nowrap"
                  :class="isLoading ? '  bg-gray-300 text-transparent' : ''"
                  >Delivery</span
                >
              </div>
            </div>

            <div class="flex flex-col items-end mt-1">
              <div
                class="flex items-center justify-center px-1 font-black text-white rounded-md bg-red-dark restaurant-rating"
                :class="reviewCount >= 5 ? '' : 'new-restaurant'"
              >
                <span
                  class="ml-1 uppercase lg:text-sm"
                  :class="reviewCount >= 5 ? 'text-xs' : 'text-2xs'"
                  >{{ reviewCount >= 5 ? reviewScore : $t("new") }}</span
                >
                <svg
                  v-if="reviewCount >= 5"
                  xmlns="http://www.w3.org/2000/svg"
                  :width="isDesktop ? 14 : 10"
                  :height="isDesktop ? 14 : 10"
                  fill="currentColor"
                  class="flex-shrink-0 inline icon-star-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
                  />
                </svg>
              </div>
              <div
                v-if="isDesktop"
                class="text-xs text-center text-gray-700 whitespace-nowrap lg:text-2xs restaurant-rating-count"
                :class="
                  reviewCount >= 5 ? 'text-opacity-100' : 'text-opacity-0'
                "
              >
                {{
                  $t("reviews", { count: reviewCount.toLocaleString("en-US") })
                }}
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
    isLoading: {
      type: Boolean,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    pricingType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    cuisine: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    totalLocation: {
      type: Number,
      required: true,
    },
    anyDineInPackage: {
      type: Boolean,
      required: true,
    },
    anyDeliveryPackage: {
      type: Boolean,
      required: true,
    },
    anyXperiencePackage: {
      type: Boolean,
      required: true,
    },
    isLazyLoadMainImage: {
      type: Boolean,
      default: true,
    },
    reviewScore: {
      type: String,
      required: true,
    },
    reviewCount: {
      type: Number,
      required: true,
    },
  },
};
</script>
