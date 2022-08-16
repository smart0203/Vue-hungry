<template>
  <div class="block my-2 rounded-lg">
    <RestaurantCardLoading
      v-if="isLoading"
      class="restaurant-card card-shadow"
    />
    <RestaurantCardMain
      v-else
      v-bind="$props"
      :favourite-icon="favouriteIcon"
      :text-label="textLabel"
      :on-favourite-click-callback="favClickCallback"
      :on-link-clicked="linkClickCallback"
    />
  </div>
</template>

<script>
import iconHeartBlack from "@/assets/icon-heart-black.png";
import iconHeartRed from "@/assets/icon-heart-red.png";
import useLazyImport from "@/composable/useLazyImport";
export default {
  name: "RestaurantCard",
  components: {
    RestaurantCardMain: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "RestaurantCardChunk" */ "./RestaurantCardMain"
        )
      ),
    RestaurantCardLoading: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "RestaurantCardChunk" */ "./RestaurantCardLoading"
        )
      ),
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    isLazyLoadMainImage: {
      type: Boolean,
      default: true,
    },
    restaurant: {
      type: Object,
      required: true,
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
  },
  data() {
    return {
      favouriteIcon: iconHeartBlack,
      textLabel: {
        moneyFormater: this.$money,
        new: this.$t("new"),
        reviewsCount: this.$t("reviews", {
          count: this.restaurant.reviewsCount.toLocaleString("en-US"),
        }),
        branch: this.$tc("branch", this.restaurant.totalLocations),
      },
    };
  },
  mounted() {
    this.onMounted();
  },
  methods: {
    onMounted() {
      if (this.isShowFavouriteButton) {
        this.$watch("restaurant.isFavourited", this.toggleFavIcon, {
          immediate: true,
        });
      }
    },
    toggleFavIcon() {
      if (this.restaurant.isFavourited) {
        this.favouriteIcon = iconHeartRed;
        return;
      }
      this.favouriteIcon = iconHeartBlack;
    },
    favClickCallback() {
      this.$emit("on-favourite-clicked");
    },
    linkClickCallback() {
      this.$emit("on-link-clicked");
    },
  },
};
</script>
