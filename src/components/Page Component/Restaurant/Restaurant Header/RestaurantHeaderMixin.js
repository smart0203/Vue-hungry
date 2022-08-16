import { mapGetters } from "vuex";
import { numberFormatThousand } from "@/helper/stringHelper";
import useLazyImport from "@/composable/useLazyImport";
import iconHeartBlack from "@/assets/icon-heart-black.png";
import iconHeartRed from "@/assets/icon-heart-red.png";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";
import "./restaurantHeader.scss";
import { saveToUserStorage, getFromUserStorage } from "@/helper/userStorage";
import { storegeSetSeed3DView } from "@/lib/localStorage";

export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: Array,
      required: true,
    },
    restaurantId: {
      type: [Number, String],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      required: true,
    },
    ratingCount: {
      required: true,
    },
    cuisine: {
      type: Object,
      required: true,
    },
    location: {
      type: Object,
      required: true,
    },
    openingHoursSummary: {
      type: String,
      required: true,
    },
    openingHourDetails: {
      type: Array,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
    lastOrder: {
      type: String,
      required: true,
    },
    branchId: {
      type: Number,
      required: true,
    },
    isRestaurantPromotedOnly: {
      type: Boolean,
      required: true,
    },
    isFavourite: {
      type: Boolean,
      required: true,
      default: false,
    },
    isShowInputLocation: {
      type: Boolean,
      required: true,
      default: false,
    },
    isNewRestaurant: {
      type: Boolean,
      default: false,
    },
    onFavouriteClick: {
      type: Function,
      required: true,
    },
    onFeaturedImageClick: {
      type: Function,
      required: true,
    },
    restaurantYoutubeId: {
      type: String,
      default: "",
    },
  },
  components: {
    InputDelivery: () =>
      useLazyImport(() => import("@/components/InputDelivery")),
  },
  data() {
    return {
      preferShowDeliveryFee: false,
      youtubeVideoThumb: "",
    };
  },
  computed: {
    ...mapGetters("restaurant", [
      "isFreeReservationSystem",
      "isRestaurantAcceptVoucher",
    ]),
    ...mapGetters("webConfig", ["earlyMaxReview", "earlyReviewPoint"]),
    ...mapGetters("restaurantPackages", ["isAllAcceptVoucher"]),
    heartIcon() {
      return this.isFavourite ? iconHeartRed : iconHeartBlack;
    },
    baseUrl() {
      return this.$store.getters.baseUrlWithLang;
    },
    bigImage() {
      if (this.featuredImage.length == 1) {
        return "w-full";
      } else {
        return "w-1/2";
      }
    },
    showRestaurantRating() {
      return this.isRestaurantPromotedOnly ? false : true;
    },
    formatedRatingCount() {
      return numberFormatThousand(this.ratingCount);
    },
    restaurantVRLink() {
      return this.$store.state.restaurant.restaurantData.myMoobanVrLink || "";
    },
    isAcceptVoucherPackages() {
      return this.isAllAcceptVoucher;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initVRTour();
      this.getYoutubeVideoThumb();
    });
  },
  methods: {
    initVRTour() {
      const storageId = "hungryhub_tour_vr";
      const vrButton = "#vr-button";
      const isEverShowTour = getFromUserStorage(storageId);
      if (
        isEverShowTour ||
        this.restaurantVRLink.length === 0 ||
        this.isDesktop
      ) {
        return;
      }
      const tour = new Shepherd.Tour({
        useModalOverlay: true,
        exitOnEsc: true,
        defaultStepOptions: {
          classes: " text-red-dark bg-gray-600",
          scrollTo: true,
        },
      });

      tour.on("complete", () => {
        saveToUserStorage(storageId, true, {
          expires: 365,
          domain: ".hungryhub.com",
        });
      });

      tour.addStep({
        id: "vr-link-tour",
        text: "Tap to view restaurant in 3D !",
        attachTo: {
          element: vrButton,
          on: "left",
        },
        classes: "vr-tour-step",
        arrow: false,
        advanceOn: {
          selector: ".shepherd-modal-overlay-container",
          event: "click",
        },
      });

      tour.start();
    },
    getYoutubeVideoThumb() {
      this.youtubeVideoThumb =
        typeof this.restaurantYoutubeId === "string" &&
        this.restaurantYoutubeId.length > 0
          ? `https://img.youtube.com/vi/${this.restaurantYoutubeId}/mqdefault.jpg`
          : "";
    },
    ratingClick() {
      if (this.isNewRestaurant === false) {
        this.$store.commit("restaurant/setState", {
          state: "restaurantActiveTab",
          val: "reviews",
        });
        const el = document.getElementById("restaurant-information-tab");
        if (el) {
          el.scrollIntoView();
        }
      }
    },
    openSharerModal() {
      this.$modal.show("restaurant-sharer-modal");
    },
    onVrLinkClicked() {
      this.$track("VR_LINK_CLICKED", {
        restaurantName: this.$store.getters["restaurant/restaurantNameEn"],
        restaurantId: this.restaurantId,
        userSignedIn: this.$store.getters["user/isUserSignedIn"]
          ? "User"
          : "Guest",
      });
      storegeSetSeed3DView(this.restaurantId);
    },
  },
};
