<template>
  <div>
    <div class="flex flex-col min-w-0 text-gray-700 lg:flex-row">
      <!-- restaurant info -->
      <div
        class="flex flex-col justify-around flex-auto order-last min-w-0 mx-2 lg:w-2/3 restaurant-info lg:mx-0 lg:order-first md:mt-8"
      >
        <!-- restaurant profile -->
        <div class="flex flex-col h-full">
          <div class="flex min-w-0">
            <!-- restaurant icon -->
            <div
              v-if="icon"
              class="flex flex-shrink-0 mr-2 rounded-full restaurant-logo"
            >
              <hh-image
                :desktop-width="90"
                :img="icon"
                alt="restaurant icon"
              ></hh-image>
            </div>
            <div class="flex flex-col min-w-0">
              <!-- restaurant name -->
              <h1
                class="pl-2 mt-0 mb-2 text-xl font-black text-black restaurant-name"
              >
                {{ name }}
                <img
                  id="add-to-fav"
                  class="inline-block cursor-pointer"
                  :src="heartIcon"
                  loading="lazy"
                  style="width: 25px"
                  @click="onFavouriteClick"
                />
                <span
                  class="px-2 py-1 ml-4 mr-2 text-sm capitalize border rounded-full cursor-pointer text-red-dark hover:bg-red-light hover:text-white border-red-dark"
                  @click="openSharerModal"
                  >{{ $t("share") }}
                </span>
              </h1>
              <!-- restaurant stats -->
              <div>
                <!-- cuisine type, location,opening hour -->
                <div class="flex flex-wrap items-center">
                  <div class="flex items-center">
                    <img
                      class="m-2 icon"
                      loading="lazy"
                      src="@/assets/icon-fork-black.png"
                      alt=""
                    />
                    <a
                      :href="`/restaurants/search?cuisines[]=${cuisine.id}`"
                      target="_blank"
                      class="text-sm underline hover-text-red-dark"
                      >{{ cuisine.name }}
                    </a>
                  </div>
                  <div class="flex items-center px-3">
                    <img
                      class="m-2 icon"
                      loading="lazy"
                      src="@/assets/icon-pin-location-black.png"
                      alt=""
                    />
                    <a
                      :href="`/restaurants/search?locations[]=${location.id}`"
                      target="_blank"
                      class="text-sm underline whitespace-nowrap hover-text-red-dark"
                      >{{ location.name }}
                    </a>
                  </div>
                  <div
                    id="opening-hour"
                    class="flex items-center cursor-pointer"
                  >
                    <img
                      class="m-2 icon"
                      loading="lazy"
                      src="@/assets/icon-clock-black.png"
                      alt=""
                    />
                    <span class="text-sm underline whitespace-nowrap">{{
                      openingHoursSummary
                    }}</span>
                  </div>
                </div>
                <!-- tag -->
                <div
                  v-if="!isFreeReservationSystem && tags.length > 0"
                  class="relative flex items-center w-full"
                >
                  <img
                    class="m-2 icon"
                    src="@/assets/icon-tag-black.png"
                    alt=""
                    loading="lazy"
                  />
                  <div class="w-full">
                    <div
                      ref="restaurant-tags-height-limit"
                      class="mr-6 truncate"
                    >
                      <a
                        v-for="(tag, index) in tags"
                        :key="index"
                        :href="`/restaurants/search?hashtags=${tag.id}`"
                        target="_blank"
                        class="mr-1 text-sm lowercase hover-text-red-dark tag-color hover:underline"
                        @click.prevent="
                          expandOverFlowTags(
                            `/restaurants/search?hashtags=${tag.id}`
                          )
                        "
                        >{{ `#${tag.label}` }}
                      </a>
                    </div>
                  </div>
                </div>
                <!-- branch, last order -->
                <div v-if="!isFreeReservationSystem" class="flex">
                  <span v-if="lastOrder" class="flex items-center">
                    <img
                      class="m-2 icon"
                      src="@/assets/icon-trend-black.png"
                      alt=""
                      loading="lazy"
                    />
                    <span class="text-sm">{{ lastOrder }}</span>
                  </span>
                  <span
                    v-if="branchId && !isFreeReservationSystem"
                    class="flex items-center cursor-pointer xl:w-1/3"
                    @click="$emit('on-branch-clicked')"
                  >
                    <img
                      class="m-2 icon"
                      src="@/assets/icon-location-plus-red.png"
                      alt=""
                      loading="lazy"
                    />
                    <span
                      class="text-sm whitespace-nowrap text-red-dark hover:underline"
                      >{{ $t("viewOtherBranch") }}</span
                    >
                  </span>
                </div>
                <!-- accepting voucher -->
                <div v-if="isAcceptVoucherPackages" class="flex items-center">
                  <HhImage
                    :img="'@/assets/ic_use_voucher.png'"
                    :fallback="'@/assets/ic_use_voucher.png'"
                    is-local-image
                    style="width: 15px"
                    class="m-2"
                  />
                  <span class="text-xs text-red-dark"> Accepts Voucher </span>
                </div>
              </div>
            </div>
          </div>
          <!-- preferShowDeliveryFee button -->
          <div
            v-if="!preferShowDeliveryFee && isShowInputLocation"
            class="mt-2"
          >
            <button
              class="px-2 py-1 mr-auto text-sm leading-5 capitalize border rounded-full border-red-dark text-red-dark hover:underline"
              @click="preferShowDeliveryFee = true"
            >
              {{ $t("calculateDeliveryFee") }}
            </button>
          </div>
        </div>
        <!-- free reservation button -->
        <template v-if="isFreeReservationSystem">
          <button
            class="w-full py-3 font-black text-white uppercase rounded-full bg-red-dark"
          >
            {{ $t("bookATable") }}
          </button>
        </template>

        <!-- input location & delivery information -->
        <template v-else-if="isShowInputLocation && preferShowDeliveryFee">
          <InputDelivery class="px-3" no-packages show-promotion />
        </template>
      </div>
      <div>
        <!-- restaurant featured image -->
        <div class="relative flex flex-shrink-0 restaurant-featured-image">
          <template v-if="featuredImage.length">
            <hh-image
              :img="featuredImage[0].asset"
              class="object-cover cursor-pointer big-image"
              :class="bigImage"
              :desktop-width="180"
              :desktop-height="220"
              :alt="featuredImage[0].caption"
              @click.native="onFeaturedImageClick(0)"
            ></hh-image>
            <div
              v-if="featuredImage.length > 1"
              class="flex flex-col w-1/2 cursor-pointer small-image-wrapper"
            >
              <template v-if="featuredImage[1]">
                <hh-image
                  v-if="!featuredImage[1].isYoutubeVideo"
                  class="object-cover small-image"
                  :class="featuredImage.length > 1 ? 'h-half' : ''"
                  :img="featuredImage[1].asset"
                  :desktop-width="180"
                  :desktop-height="110"
                  :alt="featuredImage[1].caption"
                  @click.native="onFeaturedImageClick(1)"
                >
                </hh-image>
                <div
                  v-else-if="featuredImage[1].isYoutubeVideo"
                  class="relative block"
                  style="height: 110px"
                  @click="onFeaturedImageClick(1)"
                >
                  <img
                    :src="youtubeVideoThumb"
                    alt="youtube video"
                    loading="lazy"
                    class="object-cover h-full bg-gray-400"
                  />
                  <img
                    src="@/assets/youtube-play-overlay.png"
                    alt="youtube play overlay"
                    loading="lazy"
                    class="absolute w-1/2"
                    style="top: 25%; left: 25%"
                  />
                </div>
              </template>
              <div
                v-if="featuredImage[2]"
                class="relative h-half"
                @click="onFeaturedImageClick(2)"
              >
                <hh-image
                  class="object-cover w-full h-full small-image"
                  :img="featuredImage[2].asset"
                  :desktop-width="180"
                  :desktop-height="110"
                  :alt="featuredImage[2].caption"
                >
                </hh-image>
                <div
                  v-if="featuredImage.length > 3"
                  class="absolute flex items-center justify-center mx-auto cursor-pointer img-overlay"
                >
                  <span class="text-xl font-black text-white capitalize"
                    >+ {{ $t("photosCount", { count: moreImageText }) }}</span
                  >
                </div>
              </div>
            </div>
          </template>
          <!-- restaurant rating -->
          <div
            v-if="showRestaurantRating"
            class="cursor-pointer restaurant-rating"
            :class="isNewRestaurant ? 'new' : ''"
            @click="ratingClick"
          >
            <div
              class="flex items-center justify-center px-2 mx-auto font-black text-center text-white bg-red-dark hover:bg-red-light"
              style="border-radius: 14px"
            >
              <template v-if="isNewRestaurant">
                <span class="py-1 mr-1 text-2xl uppercase">{{
                  $t("new")
                }}</span>
                <span
                  class="font-normal text-2xs"
                  v-html="
                    $t('firstReview', {
                      review: earlyMaxReview,
                      point: `${$money(earlyReviewPoint)}+`,
                    })
                  "
                ></span>
              </template>
              <template v-else>
                <span class="mr-1 text-2xl">{{ rating }}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
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
              v-if="!isNewRestaurant"
              class="text-2xl text-center text-gray-700 restaurant-review-count"
            >
              <span class="text-sm text-center whitespace-nowrap">
                {{ $tc("rating", ratingCount, { count: formatedRatingCount }) }}
              </span>
            </div>
          </div>
          <!-- opening hour popup -->
          <div id="opening-hour-pop-up" class="hidden">
            <div class="relative bg-white" style="width: 330px">
              <div
                id="opening-hour-modal-close"
                class="text-black cursor-pointer"
              >
                <img
                  src="@/assets/icon-close-black.png"
                  width="15"
                  height="15"
                  alt="close icon"
                  loading="lazy"
                />
              </div>
              <div class="w-8/12 py-12 mx-auto">
                <div class="pb-4 text-lg font-black text-left">
                  {{ $t("restaurantHours") }}
                </div>
                <div class="flex text-base">
                  <table>
                    <tr
                      v-for="(opening, key) in openingHourDetails"
                      :key="key"
                      :class="key === boldDay ? 'font-black' : ''"
                    >
                      <td style="width: 105px; height: 38px">
                        {{ opening.name }}
                      </td>
                      <td style="width: 120px; height: 38px">
                        {{ opening.val }}
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="restaurantVRLink"
            class="absolute right-0"
            style="bottom: -25px"
          >
            <a
              id="vr-button"
              :href="restaurantVRLink"
              class="flex items-center justify-center px-1 text-sm font-medium border rounded-full border-red-dark text-red-dark"
              rel="noopener noreferrer"
              target="_blank"
              @click="onVrLinkClicked"
            >
              <img
                src="@/assets/icon-cube.png"
                alt="3D view"
                class="inline mr-1"
                loading="lazy"
                width="12"
              />
              <span> 3D View </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import RestaurantHeaderMixin from "./RestaurantHeaderMixin";
import RestaurantHeaderTranslate from "./RestaurantHeaderTranslate";
import capitalize from "lodash-es/capitalize";

export default {
  mixins: [RestaurantHeaderMixin],
  data() {
    return {
      openingHourPopup: "",
    };
  },
  computed: {
    moreImageText() {
      return this.featuredImage.length - 3;
    },
    boldDay() {
      const today = this.$dayjs().format("dddd");
      return this.openingHourDetails.findIndex(
        (opening) => opening.name === today
      );
    },
  },
  mounted() {
    this.initPopup();
  },
  methods: {
    capitalize,
    expandOverFlowTags(link) {
      const classNode = this.$refs["restaurant-tags-height-limit"].classList;
      const isExpanded = !classNode.contains("truncate") ? true : false;
      if (isExpanded) {
        window.open(link, "_blank");
      } else {
        classNode.remove("truncate");
      }
    },
    initPopup() {
      // opening hour pop up
      const trigger = document.getElementById("opening-hour");
      const el = document.getElementById("opening-hour-pop-up");
      this.openingHourPopup = tippy(trigger, {
        theme: "opening-hour-popup",
        content: el.innerHTML,
        allowHTML: true,
        placement: "bottom-start",
        arrow: false,
        interactive: true,
        ignoreAttributes: true,
        onShown: () => {
          const el = document.getElementById("opening-hour-modal-close");
          el.addEventListener("click", this.closePopup);
        },
      });

      // add to favourite pop up
      const addToFav = document.getElementById("add-to-fav");
      tippy(addToFav, {
        content: capitalize(this.$t("addToFavourite")),
        placement: "bottom",
      });
    },
    closePopup() {
      this.openingHourPopup.hide();
    },
  },
  i18n: {
    messages: {
      en: {
        restaurantHours: "Hours:",
        bookATable: "Book a Table",
      },
      th: {
        restaurantHours: "เวลาเปิดทำการ",
        bookATable: "จองโต๊ะ",
      },
    },
    sharedMessages: RestaurantHeaderTranslate,
  },
};
</script>

<style lang="scss" scoped>
#opening-hour-modal-close {
  position: absolute;
  top: 5px;
  left: 5px;
}

table {
  border-collapse: separate;
  border-spacing: 0 8px;
}

.restaurant-review-count {
  @apply leading-2;
}

.restaurant-rating {
  position: absolute;
  bottom: -20px;
  left: 20px;
  width: 80px;

  &.new {
    width: 190px;
    bottom: -20px;
  }
}

.restaurant-featured-image {
  .img-overlay {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(30, 32, 48, 0.55);
  }
}

.restaurant-logo {
  width: 90px;
  height: 90px;
  overflow: hidden;

  img {
    object-fit: cover;
  }
}

.icon {
  width: 14px;
}

.input-with-icon {
  position: relative;

  .icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    &.icon-left {
      left: 5px;
      width: 25px;
    }

    &.icon-right {
      right: 5px;
      width: 35px;
    }
  }

  .input {
    height: 50px;
    padding-left: 40px;
    padding-right: 40px;
  }
}

.restaurant-tags-expand-button {
  @apply absolute text-sm bg-white;

  top: 5px;
  right: -3px;
}

@screen lg {
  .restaurant-featured-image {
    margin-left: 1.5rem;
  }

  .restaurant-featured-image {
    width: 360px;
    height: 220px;
  }

  .restaurant-rating {
    bottom: -40px;
  }

  .restaurant-review-count {
    @apply leading-8;
  }
}
</style>
<style>
/* tippy instace custom css */
.tippy-box[data-theme~="opening-hour-popup"] {
  background-color: rgba(255, 255, 255, 1);
  color: black;

  @apply text-xs;
  @apply shadow;
}
</style>
