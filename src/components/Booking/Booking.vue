<template>
  <div
    :key="bookingFormKey"
    class="flex flex-col booking-form"
    :class="isDesktop ? 'scroll-overflow' : null"
  >
    <template v-if="isBigGroup">
      <BookingBigGroup :is-dine-in="isDineIn" />
    </template>
    <template v-else>
      <template v-if="isDesktop">
        <template v-if="packagePreference.length === 0">
          <BookingEmpty
            :show-red-icon="anySelectedPackages"
            :allow-book="anyDineInPackage"
            :allow-order="anyDeliveryPackage"
            @on-order-button-clicked="initiateBooking"
            @on-book-button-clicked="initiateBooking"
          />
        </template>
        <template v-else>
          <BookingHeader
            :restaurant-name="restaurantName"
            :selected-package-count="selectedPackageCount"
            :step-one-name="stepOneName"
            :step-one-icon="stepOneIcon"
            :step-two-name="stepTwoName"
            :step-two-icon="stepTwoIcon"
            :step-three-name="stepThreeName"
            :step-three-icon="stepThreeIcon"
            :step="step"
            :is-dine-in="isDineIn"
            :is-flow-select-date-first="isFlowSelectDateFirst"
            @step-change="changeStep"
          />
          <BookingBody />
        </template>
      </template>
      <template v-else>
        <BookingHeader
          :restaurant-name="restaurantName"
          :selected-package-count="selectedPackageCount"
          :step-one-name="stepOneName"
          :step-one-icon="stepOneIcon"
          :step-two-name="stepTwoName"
          :step-two-icon="stepTwoIcon"
          :step-three-name="stepThreeName"
          :step-three-icon="stepThreeIcon"
          :step="step"
          :is-dine-in="isDineIn"
          :is-flow-select-date-first="isFlowSelectDateFirst"
          @step-change="changeStep"
          @on-back-clicked="backToRestaurantPage"
        />
        <BookingBody />
      </template>
    </template>
  </div>
</template>

<script>
import BookingEmpty from "./BookingEmpty";
import BookingHeader from "./BookingHeader.vue";
import BookingBody from "./BookingBody.vue";
import BookingBigGroup from "./Big Group/BookingBigGroup";
import { mapGetters, mapState } from "vuex";
import { mapFields } from "vuex-map-fields";
import iconPeopleRed from "@/assets/icon-people-group-red.png";
import iconPeopleBlack from "@/assets/icon-people-group-red.png";
import iconMenuBlack from "@/assets/icon-menu-black.png";
import iconMenuRed from "@/assets/icon-menu-red.png";
import iconDateBlack from "@/assets/icon-date-black.png";
import iconDateRed from "@/assets/icon-date-red.png";
import iconPaymentBlack from "@/assets/icon-payment-black.png";
import iconPaymenyRed from "@/assets/icon-payment-red.png";
export default {
  name: "BookingContainer",
  components: {
    BookingEmpty,
    BookingHeader,
    BookingBody,
    BookingBigGroup,
  },
  data() {
    return {
      bookingFormStyle: {},
      bookingFormKey: "",
      restaurantName: "",
      restaurantId: "",
      restaurantCanonicalLink: "",
    };
  },
  computed: {
    ...mapFields("booking", ["step"]),
    ...mapState("booking", ["isBigGroup", "packagePreference"]),
    ...mapGetters("booking", ["isDineIn", "isFlowSelectDateFirst"]),
    ...mapGetters("bookingPackage", [
      "anySelectedPackages",
      "anyDineInPackage",
      "anyDeliveryPackage",
      "getSelectedPackage",
    ]),
    selectedPackageCount() {
      let count = 0;
      this.getSelectedPackage.forEach(
        (packages) => (count += packages.quantity)
      );
      return count;
    },
    stepOneName() {
      return this.isDineIn && this.isFlowSelectDateFirst
        ? this.$t("pax")
        : this.$t("packages");
    },
    stepOneIcon() {
      if (this.isDineIn && this.isFlowSelectDateFirst) {
        return [iconPeopleBlack, iconPeopleRed];
      }
      return [iconMenuBlack, iconMenuRed];
    },
    stepTwoName() {
      return this.$t("selectDate");
    },
    stepTwoIcon() {
      return [iconDateBlack, iconDateRed];
    },
    stepThreeName() {
      return this.isDineIn && this.isFlowSelectDateFirst
        ? this.$t("packages")
        : this.$t("payment");
    },
    stepThreeIcon() {
      if (this.isDineIn && this.isFlowSelectDateFirst) {
        return [iconMenuBlack, iconMenuRed];
      }
      return [iconPaymentBlack, iconPaymenyRed];
    },
  },
  watch: {
    $route(newVal, oldVal) {
      const currentPath = oldVal.path;
      const newPath = newVal.path;
      function getStepFromPath(path) {
        return path.split("step-");
      }
      const currentStep = getStepFromPath(currentPath)[1] || null;
      const newStep = getStepFromPath(newPath)[1] || null;
      if (
        currentStep !== null &&
        newStep !== null &&
        typeof newStep === "string"
      ) {
        this.$store.commit("booking/setState", {
          state: "step",
          val: newStep,
        });
      }
    },
  },
  created() {
    this.setData();
  },
  methods: {
    setData() {
      const { restaurantName, restaurantId, restaurantCanonicalLink } =
        this.$store.state.restaurant;
      this.restaurantName = restaurantName;
      this.restaurantId = restaurantId;
      this.restaurantCanonicalLink = restaurantCanonicalLink;
    },
    changeStep(step) {
      this.$store.dispatch("booking/changeStep", step);
    },
    initiateBooking() {
      this.$track("INITIATED_TO_BOOK", {
        restaurantName: this.$store.getters["restaurant/restaurantNameEn"],
        restaurantId: this.restaurantId,
        restaurantCanonicalLink: this.restaurantCanonicalLink,
      });
    },
    backToRestaurantPage() {
      this.$router.push({
        name: "RestaurantPage",
      });
    },
  },
  i18n: {
    messages: {
      en: {
        selectDate: "date",
      },
      th: {
        selectDate: "วันที่และเวลา",
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.booking-form {
  min-height: 100vh;
}
@screen lg {
  .booking-form {
    min-height: auto;
  }
}
.scroll-overflow {
  max-height: 85vh;
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #fff;
}
.scroll-overflow::-webkit-scrollbar {
  width: 10px;
}
.scroll-overflow::-webkit-scrollbar-track {
  background: #fff;
}
.scroll-overflow::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 6px;
  border: 3px solid #fff;
}
</style>
