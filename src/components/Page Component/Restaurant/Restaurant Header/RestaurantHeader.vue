<template>
  <div>
    <RestaurantHeaderComponent
      v-if="isDataReady"
      v-bind="subComponentHeaderProp"
      :is-show-input-location="isShowInputLocation"
      @on-branch-clicked="goToBranch"
      @on-back-clicked="backToHomePage"
    />
    <div id="restaurant-gallery"></div>
    <RestaurantSharerModal
      :restaurant-url="currentURL"
      :restaurant-name="name"
    />
  </div>
</template>

<script>
import {
  lastReservationText,
  generateBranchLink,
} from "@/helper/restaurantHelper";
import {
  state as favouriteRestaurantState,
  methods as favouriteRestaurantMethods,
} from "@/composable/favouriteRestaurant";
import { screen } from "@/helper/screenSizeHelper";
import useLazyImport from "@/composable/useLazyImport";
const currentURL = window.location.href;
let RestaurantHeaderComponent = "";

if (screen === "desktop" || screen === "large-desktop") {
  RestaurantHeaderComponent = () =>
    useLazyImport(() =>
      import(
        /* webpackChunkName: "RestaurantHeaderDesktopChunk" */ "./RestaurantHeaderDesktop.vue"
      )
    );
} else {
  RestaurantHeaderComponent = () =>
    useLazyImport(() =>
      import(
        /* webpackChunkName: "RestaurantHeaderMobileChunk" */ "./RestaurantHeaderMobile.vue"
      )
    );
}
import popUpGallery from "@/components/Shared/PopupGallery";
import debounce from "lodash-es/debounce";
import cloneDeep from "lodash-es/cloneDeep";
import {
  groupLandingList,
  belongToGroupLanding,
} from "@/composable/groupLanding";

export default {
  components: {
    RestaurantHeaderComponent,
    RestaurantSharerModal: () =>
      useLazyImport(() => import("./RestaurantSharerModal")),
  },
  setup() {
    const { showGallery } = popUpGallery();
    const { favouriteRestaurantIds } = favouriteRestaurantState;
    const { toggleFavouriteRestaurant, getFavoriteRestaurants } =
      favouriteRestaurantMethods;
    return {
      showGallery,
      groupLandingList,
      favouriteRestaurantIds,
      toggleFavouriteRestaurant,
      getFavoriteRestaurants,
    };
  },
  data() {
    return {
      currentURL,
      isDataReady: false,
      lang: this.$store.state.lang,
      lastOrder: "",
      groupLandingLink: null,
      // data from store
      restaurantId: "",
      name: "",
      icon: "",
      rating: "",
      ratingCount: "",
      cuisine: {
        id: "",
        name: "",
      },
      location: {
        id: "",
        name: "",
      },
      openingHoursSummary: "",
      tags: [],
      branchId: 0,
      restaurantSlug: "",
      openingHourDetails: [],
      isNewRestaurant: false,
      isRestaurantPromotedOnly: false,
      restaurantPictures: [],
      featuredImage: [],
      restaurantYoutubeId: "",
    };
  },
  computed: {
    isFavourite() {
      return this.favouriteRestaurantIds.includes(this.restaurantId);
    },
    anyDeliveryPackage() {
      return this.$store.getters["bookingPackage/anyDeliveryPackage"];
    },
    isShowInputLocation() {
      return this.anyDeliveryPackage ? true : false;
    },
    subComponentHeaderProp() {
      return {
        icon: this.icon,
        featuredImage: this.featuredImage,
        restaurantId: this.restaurantId,
        name: this.name,
        rating: this.rating,
        ratingCount: this.ratingCount,
        location: this.location,
        cuisine: this.cuisine,
        openingHoursSummary: this.openingHoursSummary,
        openingHourDetails: this.openingHourDetails,
        tags: this.tags,
        lastOrder: this.lastOrder,
        branchId: this.branchId,
        isFavourite: this.isFavourite,
        onFavouriteClick: this.toggleFavourite,
        onFeaturedImageClick: this.showImageGallery,
        isNewRestaurant: this.isNewRestaurant,
        isRestaurantPromotedOnly: this.isRestaurantPromotedOnly,
        restaurantYoutubeId: this.restaurantYoutubeId,
      };
    },
  },
  created() {
    this.setDataFromStore();
  },
  methods: {
    async setDataFromStore() {
      try {
        const {
          name,
          logoUrl,
          reviewsScore,
          reviewsCount,
          primaryCuisine,
          primaryLocation,
          openingHoursShort,
          hashtags,
          branchId,
          weekdayOpeningHours,
          lastBookingWasMade,
          totalCovers,
          restaurantSlug,
        } = this.$store.state.restaurant.restaurantData;
        this.restaurantPictures = cloneDeep(
          this.$store.state.restaurant.restaurantPictures
        );
        this.featuredImage = this.restaurantPictures.map((picture) => {
          return {
            id: picture.id,
            caption: picture.caption || "",
            asset: this.$url(picture.image, "asset"),
            isYoutubeVideo: false,
          };
        });
        this.restaurantId = this.$store.state.restaurant.restaurantId;
        this.name = name;
        this.icon = logoUrl?.medium || "";
        this.cuisine = primaryCuisine;
        this.location = primaryLocation;
        this.openingHoursSummary = openingHoursShort;
        this.restaurantSlug = restaurantSlug;
        this.tags = hashtags || [];
        this.branchId = branchId || 0;
        this.ratingCount = reviewsCount || "0";
        this.rating =
          reviewsScore % 1 === 0
            ? `${reviewsScore}.0`
            : reviewsScore.toString();
        this.openingHourDetails =
          this.setOpeningHoursDetail(weekdayOpeningHours);
        this.lastOrder = await this.setLastOrder(
          lastBookingWasMade,
          reviewsCount,
          totalCovers
        );
        this.isNewRestaurant =
          this.$store.getters["restaurant/isNewRestaurant"];
        this.isRestaurantPromotedOnly =
          this.$store.getters["restaurant/isRestaurantPromotedOnly"];
        this.restaurantYoutubeId =
          this.$store.state.restaurant.restaurantYoutubeId;
        this.checkRestaurantHaveYoutube();

        this.checkIsBelongToGroupLanding();
        this.isDataReady = true;
      } catch (err) {
        this.isDataReady = false;
        this.$rollbar.error("Failed preparing restaurant header data", err);
      }
    },
    checkIsBelongToGroupLanding() {
      const check = belongToGroupLanding(this.branchId);
      if (check && check.length) {
        this.groupLandingLink = `/${check[0].slug}?locale=${this.lang}`;
      }
    },
    checkRestaurantHaveYoutube() {
      if (this.restaurantYoutubeId.length > 0) {
        const youtubeObj = {
          id: "youtube-embed",
          caption: "",
          asset: this.restaurantYoutubeId,
          isYoutubeVideo: true,
        };
        const featuredImageLength = this.featuredImage.length;
        if (featuredImageLength > 2) {
          this.featuredImage.splice(1, 0, youtubeObj);
        } else {
          this.featuredImage.push(youtubeObj);
        }
      }
    },
    setOpeningHoursDetail(weekdayOpeningHours) {
      const openingDate = [
        { key: "Sunday", name: this.$t("sunday"), val: "" },
        { key: "Monday", name: this.$t("monday"), val: "" },
        { key: "tuesday", name: this.$t("tuesday"), val: "" },
        { key: "Wednesday", name: this.$t("wednesday"), val: "" },
        { key: "Thursday", name: this.$t("thursday"), val: "" },
        { key: "Friday", name: this.$t("friday"), val: "" },
        { key: "Saturday", name: this.$t("saturday"), val: "" },
      ];

      openingDate.forEach((opening) => {
        const simpleName = opening.key.substr(0, 3).toLowerCase();
        opening.val = weekdayOpeningHours[simpleName];
      });

      return openingDate || [];
    },
    async setLastOrder(lastBookingWasMade, reviewsCount, totalCovers) {
      return await lastReservationText(
        lastBookingWasMade,
        reviewsCount,
        totalCovers
      );
    },
    toggleFavourite: debounce(async function () {
      const result = await this.toggleFavouriteRestaurant(this.restaurantId);
      if (result) {
        this.getFavoriteRestaurants();
      }
    }, 500),
    showImageGallery(index = 0) {
      try {
        const restucture = this.featuredImage.map((featuredAsset) => {
          const parsedAsset = featuredAsset.isYoutubeVideo
            ? `https://www.youtube.com/embed/${featuredAsset.asset}?enablejsapi=1`
            : featuredAsset.asset;
          return {
            asset: parsedAsset,
            isYoutubeVideo: featuredAsset.isYoutubeVideo,
          };
        });
        this.showGallery("#restaurant-gallery", restucture, index);
        this.$store.dispatch("webConfig/toggleClevertapPopup", false);
      } catch (err) {
        this.$alert.error(
          "Gallery component can't be loaded, please refresh your browser"
        );
        this.$rollbar.error(err);
      }
    },
    goToBranch() {
      const branchUrl = generateBranchLink({
        branchId: this.branchId,
        slug: this.restaurantSlug,
      });
      const link = this.groupLandingLink ? this.groupLandingLink : branchUrl;
      window.open(link, "_blank");
    },
    backToHomePage() {
      if (process.env.NODE_ENV === "production") {
        window.location.href = "https://hungryhub.com/";
      } else {
        window.location.href = "https://hhstaging.hungryhub.com/";
      }
    },
  },
};
</script>
<i18n>
{
  "en": {
    "cta_booked_by": "Popular! Booked by %{count} people",
    "cta_last_booking": "Trending! Last booking was made",
    "cta_new": "New! Book & review to earn 100 bonus points!",
    "lastOrderAt": "Last %{type} %{time}",
    "sunday": "Sunday",
    "monday": "Monday",
    "tuesday": "Tuesday",
    "wednesday": "Wednesday",
    "thursday": "Thursday",
    "friday": "Friday",
    "saturday": "Saturday"
  },
  "th": {
    "cta_last_booking": "ร้านฮิต! จองครั้งสุดท้ายเมื่อ",
    "cta_booked_by": "มาแรง! %{count} คนจองร้านนี้แล้ว",
    "new": "ใหม่! จองแล้วรีวิวเพื่อรับโบนัส 100 คะแนน!",
    "lastOrderAt": "จองครั้งสุดท้ายเมื่อ %{time}",
    "sunday": "วันอาทิตย์",
    "monday": "วันจันทร์",
    "tuesday": "วันอังคาร",
    "wednesday": "วันพุธ",
    "thursday": "วันพฤหัสบดี",
    "friday": "วันศุกร์",
    "saturday": "วันเสาร์"
  }
}
</i18n>
