<template>
  <BookingNumberPanelView
    :adults="adultOption"
    :selected-adult="adult"
    :kids="kids"
    :is-show-kids="isShowKids"
    :is-show-kids-button="isShowKidsButton"
    :is-show-big-group-button="isShowBigGroupButton"
    :big-group-size="bigGroupMinSize"
    :disabled-button="disabledButton"
    @on-big-group-clicked="selectBigGroup"
    @on-back-clicked="resetState"
    @on-confirm-clicked="confirm"
    @on-kids-increased="increaseKids"
    @on-kids-decreased="decreaseKids"
    @on-select-adult="selectAdult"
    @on-show-kids-toggled="toggleShowKids"
  />
</template>

<script>
import useLazyImport from "@/composable/useLazyImport";
import { mapFields } from "vuex-map-fields";
import PanelMixin from "../PanelMixin";
export default {
  components: {
    BookingNumberPanelView: () =>
      useLazyImport(() => import("./BookingNumberPanelView")),
  },
  mixins: [PanelMixin],
  data() {
    return {
      restaurantId: "",
      restaurantName: "",
      restaurantCanonicalLink: "",
      adultOption: [],
      isShowKids: false,
      isShowBigGroupButton: false,
      isShowKidsButton: false,
      largestTable: 9999,
      minPartySize: 0,
      customSeats: [],
    };
  },
  computed: {
    ...mapFields("booking", ["adult", "kids", "isBigGroup", "bigGroupMinSize"]),
    disabledButton() {
      if (this.adult === 0 || this.adult === "") {
        return true;
      }
      return false;
    },
  },
  created() {
    this.setData();
  },
  mounted() {
    this.generateNumberPanel();
    this.$emit("on-mounted");
  },
  beforeDestroy() {
    this.$emit("on-before-destroy");
  },
  methods: {
    setData() {
      const {
        restaurantData,
        restaurantId,
        restaurantName,
        restaurantCanonicalLink,
      } = this.$store.state.restaurant;
      this.restaurantId = restaurantId;
      this.restaurantName = restaurantName;
      this.restaurantCanonicalLink = restaurantCanonicalLink;
      this.isShowBigGroupButton = restaurantData.enableBigGroupFeature || false;
      this.isShowKidsButton = restaurantData.acceptKids;
      this.largestTable = restaurantData.largestTable;
      this.minPartySize = restaurantData.minPartySize;
      this.customSeats = restaurantData.customSeats;
    },
    generateNumberPanel() {
      const largestTable = this.largestTable;
      const smallestTable = this.minPartySize;
      const customSeats = this.customSeats;
      // set number seat to custom seats if any
      if (customSeats.length > 0) {
        this.adultOption = customSeats;
      }

      // else set number seat to restaurant rule
      else {
        let arr = [];
        for (let index = smallestTable; index <= largestTable; index++) {
          arr.push(index);
        }
        this.adultOption = arr;
      }
      this.setupBigGroupMinSize();
    },
    selectBigGroup() {
      this.isBigGroup = true;
    },
    setupBigGroupMinSize() {
      if (this.adultOption.length > 0) {
        this.bigGroupMinSize = this.adultOption[this.adultOption.length - 1];
      } else {
        this.bigGroupMinSize = this.largestTable;
      }
    },
    resetState() {
      this.$emit("on-back-clicked");
    },
    toggleShowKids() {
      this.isShowKids = !this.isShowKids;
      if (this.isShowKids) {
        this.kids = 1;
      } else {
        this.kids = 0;
      }
    },
    selectAdult(adult) {
      this.adult = adult;
    },
    confirm() {
      if (this.kids > 0) {
        this.$track("BOOKING_STEP_ADD_KIDS", {
          userID: this.$store.state.user.id,
          bookingAdult: this.adult,
          bookingKids: this.kids,
          restaurantId: this.restaurantId,
          restaurantName: this.$store.getters["restaurant/restaurantNameEn"],
          restaurantCanonicalLink: this.restaurantCanonicalLink,
        });
      } else {
        this.$track("BOOKING_STEP_ADULT_SELECTED", {
          userID: this.$store.state.user.id,
          bookingAdult: this.adult,
          restaurantId: this.restaurantId,
          restaurantName: this.$store.getters["restaurant/restaurantNameEn"],
          restaurantCanonicalLink: this.restaurantCanonicalLink,
        });
      }
      this.$emit("on-confirm-clicked");
      // scroll to top if in mobile
      this.mobileScrollToTop();
    },
    increaseKids() {
      this.kids += 1;
    },
    decreaseKids() {
      if (this.kids === 0) {
        return;
      }
      this.kids -= 1;
    },
    registerPopStateHandler() {
      window.onpopstate = () => {
        this.$router.push({
          name: "RestaurantPage",
        });
        this.$store.commit("booking/setState", {
          state: "packagePreference",
          val: "",
        });
      };
    },
    removePopStateHandler() {
      if (typeof window.onpopstate === "function") {
        window.onpopstate = () => {};
      }
    },
  },
};
</script>
