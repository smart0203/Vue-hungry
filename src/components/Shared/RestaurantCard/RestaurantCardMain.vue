<template>
  <div class="block my-2 bg-white rounded-lg restaurant-card card-shadow">
    <!-- restaurant image -->
    <div class="relative">
      <a
        class="block w-full aspect-w-16 aspect-h-9"
        :href="restaurant.link.value"
        @click.prevent="onLinkClicked"
      >
        <hh-image
          :is-lazy="isLazyLoadMainImage"
          :img="restaurant.imageCoverUrl.original"
          alt="restaurant image"
          :desktop-width="imageWidthDesktop"
          :mobile-width="imageWidthMobile"
          :mobile-height="imageHeightMobile"
          :desktop-height="imageHeightDesktop"
          class="mx-auto bg-gray-300 rounded-tl-lg rounded-tr-lg restaurant-image"
        ></hh-image>
      </a>

      <!-- fav button -->
      <button
        v-if="isShowFavouriteButton"
        class="absolute restaurant-card-fav-button"
        style="top: 10px; left: 10px"
        @click="onFavouriteClickCallback"
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

      <!-- custom text -->
      <div
        v-if="restaurant.customText"
        class="absolute left-0 py-1 pl-1 text-center text-white border-l-0 text-2xs bg-red-dark"
        style="
          top: 10px;
          min-width: 45%;
          border-top-right-radius: 9999px;
          border-bottom-right-radius: 9999px;
        "
      >
        {{ restaurant.customText }}
      </div>

      <!-- ads label -->

      <div
        v-if="restaurant.isAds"
        class="absolute right-0 p-1 text-xs text-white bg-opacity-100"
        style="bottom: 10px"
      >
        Ad
      </div>
    </div>
    <a :href="restaurant.link.value" @click.prevent="onLinkClicked">
      <!-- restaurant info -->
      <div class="flex p-2 pb-0 restaurant-info">
        <div class="flex flex-col flex-grow w-8/12">
          <!-- restaurant name -->
          <span
            class="mb-1 text-xs font-black truncate lg:mb-2 md:text-base lg:text-sm ma0 restaurant-name"
          >
            {{ restaurant.name }}
          </span>
        </div>
        <div
          v-if="restaurant.price.amount > 0"
          class="flex flex-col items-end pl-1"
        >
          <!-- is loading for restaurant rating, review score -->
          <div class="flex items-center justify-end leading-none">
            <img
              src="@/assets/icon-price-red.png"
              class="pricetag-icon"
              alt="pricetag-icon"
               loading="lazy"
              width="12"
              height="12"
            />
            <span
              class="ml-1 text-xs font-black md:text-base text-red-dark pricing"
              >{{ textLabel.moneyFormater(restaurant.price.amount) }}</span
            >
          </div>
          <div
            class="text-right whitespace-nowrap pricetag-rule text-2xs text-red-dark"
          >
            {{ restaurant.pricingType }}
          </div>
        </div>
      </div>
      <div class="flex p-2 pt-0">
        <!-- side by side primaryCuisine,primaryLocation with rating -->
        <div class="flex flex-col w-9/12 mr-1">
          <!-- restaurant primaryCuisine & primaryLocation -->
          <div class="flex items-center justify-around mb-1">
            <div class="flex items-center w-1/2">
              <div class="mr-1">
                <img
                  v-if="restaurant.isStaycation"
                  class="icon"
                  src="@/assets/icon-staycation-black.png"
                  alt="staycation-icon"
                  width="12"
                   loading="lazy"
                  height="12"
                />
                <img
                  v-else
                  class="icon cuisine-icon"
                   loading="lazy"
                  src="@/assets/icon-fork-black.png"
                  alt="cuisine-icon"
                  width="12"
                  height="12"
                />
              </div>
              <span
                class="truncate text-2xs md:text-base lg:text-xs cuisine-label"
                >{{ restaurant.primaryCuisine.name }}</span
              >
            </div>
            <div class="flex items-center w-1/2">
              <template
                v-if="
                  restaurant.primaryLocation.name || restaurant.totalLocations
                "
              >
                <div class="flex-shrink-0 mr-1">
                  <img
                    class="icon location-icon"
                    src="@/assets/icon-pin-location-black.png"
                    alt="location-icon"
                    width="12"
                     loading="lazy"
                    height="12"
                  />
                </div>
                <!-- delivery property -->
                <div
                  v-if="shouldShowDeliveryProperty"
                  class="flex items-center truncate text-2xs lg:text-xs"
                >
                  <div
                    class="capitalize truncate text-2xs lg:text-xs"
                    :class="
                      restaurant.deliveryProperty.isLoading
                        ? 'bg-gray-300  text-gray-300 h-2 lg:h-4 w-10'
                        : ''
                    "
                  >
                    {{ deliveryFeeText }}
                  </div>
                </div>
                <!-- location -->
                <span
                  v-else
                  class="truncate text-2xs md:text-base lg:text-xs location-label"
                  >{{
                    restaurant.primaryLocation.name ||
                    `${restaurant.totalLocations} ${textLabel.branch}`
                  }}</span
                >
              </template>
            </div>
          </div>
          <!-- restaurant dine in / delivery -->
          <div class="flex items-center text-2xs lg:text-xs">
            <div
              v-if="restaurant.anyDineInPackage"
              class="flex items-center mr-1"
            >
              <div class="mr-1">
                <img
                  class="dine-in-icon"
                   loading="lazy"
                  src="@/assets/icon-plate-red.png"
                  width="12"
                  height="12"
                  alt="dine in icon"
                />
              </div>
              <span class="whitespace-nowrap">Dine-in</span>
            </div>

            <div
              v-if="restaurant.anyXperiencePackage"
              class="flex items-center mr-1"
            >
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
            </div>

            <div
              v-if="restaurant.anyDeliveryPackage"
              class="flex items-center mr-1"
            >
              <div class="mr-1">
                <img
                  class="delivery-icon"
                  src="@/assets/icon-shopping-bag-red.png"
                  alt="delivery icon"
                  width="12"
                   loading="lazy"
                  height="12"
                />
              </div>
              <span class="whitespace-nowrap">Delivery</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-end justify-end w-3/12">
          <div class="flex flex-col items-end mt-1">
            <div
              class="flex items-center justify-center px-1 font-black text-white rounded-md bg-red-dark restaurant-rating"
              :class="isNotNew ? null : 'new-restaurant mb-4'"
            >
              <span
                class="mx-1 leading-4 uppercase lg:text-sm"
                :class="isNotNew ? 'text-xs md:text-base' : 'text-2xs'"
                >{{ isNotNew ? restaurant.reviewsScore : textLabel.new }}</span
              >
              <svg
                v-if="isNotNew"
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
              v-if="isDesktop && isNotNew"
              class="text-xs text-center text-gray-700 whitespace-nowrap md:text-2xs restaurant-rating-count"
              :class="isHave3Service ? 'w-11/12 truncate' : null"
            >
              {{ textLabel.reviewsCount }}
            </div>
          </div>
        </div>
      </div>
    </a>
  </div>
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
      default: 225,
    },
    imageHeightDesktop: {
      default: 169,
    },
    imageWidthMobile: {
      default: 200,
    },
    imageHeightMobile: {
      default: 104,
    },
    isShowFavouriteButton: {
      type: Boolean,
      default: false,
    },
    isStatic: {
      type: Boolean,
      default: false,
    },
    textLabel: {
      type: Object,
      required: true,
    },
    favouriteIcon: {
      type: String,
      required: true,
    },
    onFavouriteClickCallback: {
      type: Function,
      required: true,
    },
    onLinkClicked: {
      type: Function,
      required: true,
    },
  },
  computed: {
    shouldShowDeliveryProperty() {
      if (this.restaurant.isNearMe && this.restaurant.deliveryProperty.isShow) {
        return true;
      }
      if (
        this.restaurant.deliveryProperty.isShow &&
        this.restaurant.anyDeliveryPackage
      ) {
        return true;
      }
      return false;
    },
    deliveryFeeText() {
      if (this.restaurant.isNearMe) {
        return `${this.restaurant.deliveryProperty.distance} km`;
      } else if (this.restaurant.anyDeliveryPackage) {
        if (this.restaurant.deliveryProperty.deliveryFee) {
          return `${this.$money(
            this.restaurant.deliveryProperty.deliveryFee
          )}  ${this.$t("deliveryFee")}`;
        }
        return this.$t("freeDelivery");
      }
      return "";
    },
    isNotNew() {
      return this.restaurant.reviewsCount >= 5;
    },
    isHave3Service() {
      return (
        this.restaurant.anyDeliveryPackage &&
        this.restaurant.anyDineInPackage &&
        this.restaurant.anyXperiencePackage
      );
    },
  },
};
</script>
