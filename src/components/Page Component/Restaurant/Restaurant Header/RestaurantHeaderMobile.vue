<template>
  <div class="flex flex-col items-center w-full text-gray-700">
    <!-- restaurant name -->
    <div
      class="z-20 flex items-center w-full px-3 bg-white restaurant-name-bar"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        class="inline icon-chevron-left text-red-dark"
        viewBox="0 0 16 16"
        @click="$emit('on-back-clicked')"
      >
        <path
          fill-rule="evenodd"
          d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
        />
      </svg>
      <h1 class="flex justify-center flex-auto mx-auto font-black ma0">
        {{ name }}
      </h1>
      <img
        src="@/assets/icon-share-black.png"
        class="mr-1"
        alt="share icon"
        style="width: 20px; height: 20px"
        loading="lazy"
        @click="shareRestaurant"
      />
      <img
        id="add-to-fav"
        class="inline-block ml-1"
        :src="heartIcon"
        style="width: 25px"
        alt="heart icon"
        loading="lazy"
        @click="onFavouriteClick"
      />
    </div>

    <!-- restaurant featured image -->
    <div class="relative w-full">
      <div v-if="icon" class="absolute flex mr-2 rounded-full restaurant-logo">
        <hh-image
          :desktop-width="90"
          :mobile-width="90"
          :img="icon"
          alt="restaurant icon"
          class="bg-gray-300"
        ></hh-image>
      </div>
      <div class="flex restaurant-featured-image">
        <template v-if="featuredImage.length">
          <hh-image
            class="object-cover w-1/2 bg-gray-300 big-image"
            :class="bigImage"
            :img="featuredImage[0].asset"
            mobile-width="half-screen"
            :mobile-height="250"
            :alt="featuredImage[0].caption"
            @click.native="onFeaturedImageClick(0)"
          >
          </hh-image>

          <div
            v-if="featuredImage.length > 1"
            class="flex flex-col w-1/2 small-image-wrapper"
            @click="onFeaturedImageClick(1)"
          >
            <template v-if="featuredImage[1]">
              <hh-image
                v-if="!featuredImage[1].isYoutubeVideo"
                class="object-cover small-image"
                :class="featuredImage.length > 1 ? 'h-half' : ''"
                :img="featuredImage[1].asset"
                mobile-width="half-screen"
                :mobile-height="125"
                :alt="featuredImage[1].caption"
              >
              </hh-image>

              <div
                v-else-if="featuredImage[1].isYoutubeVideo"
                class="relative block"
                style="height: 125px"
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
                  class="absolute w-1/2"
                  loading="lazy"
                  style="top: 25%; left: 25%"
                />
              </div>
            </template>

            <div
              v-if="featuredImage[2]"
              class="relative h-1/2"
              @click="onFeaturedImageClick(0)"
            >
              <hh-image
                class="object-cover w-full h-full bg-gray-300 small-image"
                :img="featuredImage[2].asset"
                :alt="featuredImage[2].caption"
                :desktop-width="180"
                mobile-width="half-screen"
                :mobile-height="125"
              >
              </hh-image>
              <div
                v-if="featuredImage.length > 3"
                class="absolute flex items-center justify-center mx-auto cursor-pointer img-overlay"
              >
                <span class="text-xl font-black text-white"
                  >+ {{ $t("photos", { count: moreImageText }) }}</span
                >
              </div>
            </div>
          </div>
        </template>
      </div>
      <!-- restaurant rating -->
      <div
        v-if="showRestaurantRating"
        class="mb-2 restaurant-rating"
        :class="isNewRestaurant ? 'new' : ''"
        @click="ratingClick"
      >
        <div
          class="flex items-center justify-center px-2 ml-auto font-black text-center text-white bg-red-dark hover:bg-red-light"
          style="border-radius: 14px"
        >
          <template v-if="isNewRestaurant">
            <span class="py-1 mr-1 text-2xl uppercase">{{ $t("new") }}</span>
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
            <span class="mr-1">{{ rating }}</span>
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
        <div class="text-center text-gray-700 text-2xs">
          <span v-if="!isNewRestaurant" class="">
            {{ $tc("rating", ratingCount, { count: formatedRatingCount }) }}
          </span>
        </div>
      </div>

      <div
        v-if="restaurantVRLink"
        class="absolute"
        style="bottom: -30px; right: 10px"
      >
        <a
          id="vr-button"
          :href="restaurantVRLink"
          class="flex items-center justify-center px-2 text-sm font-medium leading-6 border rounded-full border-red-dark text-red-dark"
          rel="noopener noreferrer"
          target="_blank"
          @click="onVrLinkClicked"
        >
          <img
            src="@/assets/icon-cube.png"
            alt="3D view"
            class="inline mr-1"
            width="13"
            loading="lazy"
          />
          <span> 3D View </span>
        </a>
      </div>
    </div>
    <!-- restaurant info -->
    <div class="w-full pt-6 mt-4 restaurant-info">
      <!-- restaurant profile -->
      <div class="flex items-center px-6">
        <div class="flex flex-col w-full">
          <!-- restaurant stats -->
          <div class="text-sm">
            <div class="flex items-center justify-between">
              <a
                class="flex items-center"
                :href="`/restaurants/search?cuisines[]=${cuisine.id}`"
                target="_blank"
              >
                <img
                  class="m-2 ml-0 icon"
                  src="@/assets/icon-fork-black.png"
                  alt=""
                  loading="lazy"
                />
                <span class="underline">{{ cuisine.name }}</span>
              </a>
              <a
                :href="`/restaurants/search?locations[]=${location.id}`"
                target="_blank"
                class="flex items-center"
              >
                <img
                  class="m-2 ml-0 icon"
                  src="@/assets/icon-pin-location-black.png"
                  loading="lazy"
                  alt=""
                />
                <span class="underline">{{ location.name }}</span>
              </a>
              <div class="flex items-center">
                <img
                  class="m-2 ml-0 icon"
                  loading="lazy"
                  src="@/assets/icon-clock-black.png"
                  alt=""
                />
                <span class="underline" @click="showHourModal">{{
                  openingHoursSummary
                }}</span>
              </div>
            </div>
            <div
              v-if="!isFreeReservationSystem && tags.length > 0"
              class="relative flex items-center"
            >
              <img
                class="m-2 ml-0 icon"
                src="@/assets/icon-tag-black.png"
                alt=""
                loading="lazy"
              />
              <div
                class="restaurant-tags-height-limit"
                :style="overFlowTagsStyle"
              >
                <a
                  v-for="(tag, index) in tags"
                  :key="index"
                  class="flex-shrink-0 mr-2 lowercase break-words tag-color hover:underline"
                  @click="
                    goToTagsLink(`/restaurants/search?hashtags=${tag.id}`)
                  "
                  >{{ `#${tag.label}` }}
                </a>
              </div>
              <button
                v-if="overFlowTagsStyle"
                class="restaurant-tags-expand-button tag-color"
                @click="expandOverFlowTags"
              >
                ...
              </button>
            </div>
            <div class="flex justify-between mb-2">
              <span v-if="lastOrder" class="flex items-center mr-2">
                <img
                  class="m-2 ml-0 icon"
                  loading="lazy"
                  src="@/assets/icon-trend-black.png"
                  alt=""
                />
                <span class="text-sm">{{ lastOrder }}</span>
              </span>
              <span
                v-if="branchId && !isFreeReservationSystem"
                class="flex items-center"
                @click="$emit('on-branch-clicked')"
              >
                <img
                  class="m-2 ml-0 icon"
                  loading="lazy"
                  src="@/assets/icon-location-plus-red.png"
                  alt=""
                />
                <span class="text-sm text-red-dark">{{
                  $t("viewOtherBranch")
                }}</span>
              </span>
            </div>
            <!-- accepting voucher -->
            <div v-if="isAcceptVoucherPackages" class="flex items-center">
              <HhImage
                :img="'@/assets/ic_use_voucher.png'"
                :fallback="'@/assets/ic_use_voucher.png'"
                is-local-image
                style="width: 15px"
                class="m-2 ml-0"
              />
              <span class="text-xs text-red-dark"> Accepts Voucher </span>
            </div>
          </div>
        </div>
      </div>
      <!-- input location  -->
      <template v-if="isShowInputLocation">
        <div v-if="!preferShowDeliveryFee" class="mx-6 mt-1">
          <button
            class="w-full py-1 text-sm leading-5 capitalize border rounded-full border-red-dark text-red-dark"
            @click="preferShowDeliveryFee = true"
          >
            {{ $t("calculateDeliveryFee") }}
          </button>
        </div>
        <InputDelivery
          v-if="preferShowDeliveryFee"
          class="px-3"
          no-packages
          show-promotion
        />
        <RestaurantCovidRating
          v-if="showCovidRating"
          :staff-protection="covidRating.staffProtection"
          :social-distancing="covidRating.socialDistancing"
          :overall-cleanliness="covidRating.overallCleanliness"
          class="mt-2"
        />
      </template>
    </div>
    <!-- opening hour modal -->
    <RestaurantHourModal :opening-hours="openingHourDetails" />
  </div>
</template>

<script>
import useLazyImport from "@/composable/useLazyImport";
import useNavigatorShare, {
  isSupport as isSupprotNavigatorShare,
} from "@/composable/useNavigatorShare";
import RestaurantHeaderMixin from "./RestaurantHeaderMixin";
import RestaurantHeaderTranslate from "./RestaurantHeaderTranslate";
export default {
  components: {
    RestaurantHourModal: () =>
      useLazyImport(() => import("./RestaurantHourModal.vue")),
    RestaurantCovidRating: () =>
      useLazyImport(() =>
        import(
          "@/components/Page Component/Restaurant/RestaurantCovidRating.vue"
        )
      ),
  },
  mixins: [RestaurantHeaderMixin],
  data() {
    return {
      featuredImageSlider: null,
      overFlowTagsStyle: "",
    };
  },
  computed: {
    moreImageText() {
      return this.featuredImage.length - 3;
    },
    covidRating() {
      return this.$store.state.restaurant.restaurantData.covid19Rating;
    },
    showCovidRating() {
      return (
        this.covidRating &&
        this.$store.getters["restaurant/isRestaurantHaveEnoughtCovidRating"]
      );
    },
  },
  mounted() {
    this.limitShowedTags();
  },
  methods: {
    shareRestaurant() {
      if (isSupprotNavigatorShare) {
        useNavigatorShare({
          title: this.name,
          message: this.name,
          url: window.location.href,
          erroMessage: "Oops, something went wrong, failed share restaurant",
        });
      } else {
        this.$modal.show("restaurant-sharer-modal");
      }
    },
    showHourModal() {
      this.$modal.show("restaurant-hour-modal");
    },
    expandOverFlowTags() {
      this.overFlowTagsStyle = "";
    },
    goToTagsLink(link) {
      if (this.overFlowTagsStyle) {
        this.overFlowTagsStyle = "";
        return;
      }
      window.open(link, "_blank");
    },
    limitShowedTags() {
      this.$nextTick(() => {
        if (this.tags.length) {
          const el = document.querySelector(".restaurant-tags-height-limit");
          if (el && el.getBoundingClientRect().height >= 20) {
            this.overFlowTagsStyle = {
              overflow: "hidden",
              height: "20px",
            };
          }
        }
      });
    },
  },
  i18n: {
    sharedMessages: RestaurantHeaderTranslate,
  },
};
</script>

<style lang="scss" scoped>
.restaurant-featured-image {
  height: 250px;
  width: 100%;

  .img-overlay {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(30, 32, 48, 0.55);
  }
}

.restaurant-rating {
  position: absolute;
  bottom: -40px;
  left: 20px;
  width: 80px;

  &.new {
    width: 190px;
    bottom: -22px;
  }
}

.restaurant-logo {
  width: 70px;
  height: 70px;
  z-index: 2;
  top: 10px;
  left: 10px;
  overflow: hidden;

  img {
    object-fit: cover;
  }
}

.icon {
  width: 16px;
}

.input-with-icon {
  position: relative;

  .icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    &.icon-left {
      left: 5px;
      width: 20px;
    }

    &.icon-right {
      right: 5px;
      width: 25px;
    }
  }

  .input {
    min-height: 40px;
    padding-left: 30px;
    padding-right: 30px;
  }
}

.restaurant-tags-expand-button {
  @apply absolute text-sm bg-white;

  top: 7px;
  right: 0;
}
</style>
