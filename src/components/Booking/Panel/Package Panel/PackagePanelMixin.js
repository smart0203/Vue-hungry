import startCase from "lodash-es/startCase";
import { mapGetters } from "vuex";
import { mapFields } from "vuex-map-fields";
import {
  PACKAGE_PREFERENCE_DELIVERY_PICK_UP,
  PACKAGE_CODE_HAH,
} from "@/lib/constant";
import { mapState } from "vuex";
import {
  eventData,
  isValid as isValidCorporateEvent,
} from "@/composable/corporateEvent";
import props from "./PackagePanelProp";
import PanelMixin from "../PanelMixin";

export default {
  mixins: [PanelMixin],
  props,
  computed: {
    ...mapState("booking", ["packagePreference"]),
    ...mapFields("booking", ["adult", "selectedDate", "selectedTime"]),
    ...mapGetters("booking", ["bookingSummary"]),
    ...mapGetters("bookingPackage", [
      "anyDeliveryPackage",
      "anyDineInPackage",
      "getSelectedPackage",
      "getPackageByType",
      "allSectionHaveEnoughQuantity",
      "isSelectedPackagesAcceptMultipleQuantity",
      "isPackageHaveEnoughtQuantity",
      "isSelectedPackageNotAddonPackageOnly",
      "getSelectedPackageType",
    ]),
    ...mapGetters("restaurantPackages", ["isAllAcceptVoucher"]),
    isConfirmButtonDisabled() {
      if (this.getSelectedPackage.length > 0) {
        if (this.isDineIn) {
          return this.isPackageHaveEnoughtQuantity === false ? true : false;
        }
        return this.allSectionHaveEnoughQuantity === false ? true : false;
      }
      return true;
    },
    bookingSummaryText() {
      const adult = `${this.$tc("numberOfAdult", this.bookingSummary.adult, {
        adult: this.bookingSummary.adult,
      })}`;
      const kids = `${
        this.bookingSummary.kids > 0
          ? ` ${this.$tc("numberOfKids", this.bookingSummary.kids, {
              kids: this.bookingSummary.kids,
            })}`
          : ""
      }
          `;
      const packageName = `${
        this.bookingSummary.packageName
          ? " | " + this.bookingSummary.packageName
          : ""
      }`;
      return ` ${adult} ${kids} ${packageName}`;
    },
    selectedMenuCount() {
      let currentSelected = 0;
      let maxSelectedQuantity = 0;
      if (this.getSelectedPackageType === PACKAGE_CODE_HAH) {
        this.getSelectedPackage.forEach((pack) => {
          const sections = pack.getSections();
          if (sections) {
            sections.forEach((section) => {
              const sectionSelectedMenuQuantity =
                section.getTotalSelectedMenu();
              currentSelected += sectionSelectedMenuQuantity;
              if (pack.isAlaCarte) {
                maxSelectedQuantity += sectionSelectedMenuQuantity;
              } else if (section.totalQuantityLimit) {
                maxSelectedQuantity += section.totalQuantityLimit;
              }
            });
          }
        });
        return `(${currentSelected}/${maxSelectedQuantity})`;
      }
      return "";
    },
    isAllPackAcceptVoucher() {
      return this.isAllAcceptVoucher;
    },
  },
  methods: {
    onPackageSelected(isAcceptManyQuantity) {
      if (!isAcceptManyQuantity) {
        this.confirmButtonClicked();
      }
    },
    onBackClicked() {
      this.$emit("on-back-clicked");
    },
    confirmButtonClicked() {
      if (this.packagePreference == PACKAGE_PREFERENCE_DELIVERY_PICK_UP) {
        this.adult = 1;
      }
      if (this.isSelectedPackageNotAddonPackageOnly === false) {
        this.$alert.info(startCase(this.$t("addonPackageAlert")));
      } else {
        if (isValidCorporateEvent.value) {
          const { date, startTime } = eventData.value;
          if (
            date &&
            typeof date === "string" &&
            startTime &&
            typeof startTime === "string"
          ) {
            this.selectedDate = date;
            this.selectedTime = startTime;
            this.$store.dispatch("booking/changeStep", 5);
          }
        } else {
          this.$store.dispatch("booking/changeStep", this.nextStep);
          this.$emit("on-confirm-clicked");
        }
      }
    },
  },
};
