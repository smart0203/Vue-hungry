import { i18n } from "@/lib/i18n/i18n.js";
import vuexStore from "@/store/index";
import { PACKAGE_PREFERENCE_DELIVERY_PICK_UP } from "@/lib/constant";

class bookingStepRules {
  constructor() {
    this.store = vuexStore;
    this.isDineIn = this.store.getters["booking/isDineIn"];
    this.packagePreference = this.store.state.booking.packagePreference;
    this.isFlowSelectDateFirst =
      this.store.getters["booking/isFlowSelectDateFirst"];
    this.canSkipSelectTime = this.store.getters["booking/canSkipSelectTime"];
    this.anySelectedPackages =
      this.store.getters["bookingPackage/anySelectedPackages"];
  }

  removeAllSelectedPackages = () => {
    if (
      this.packagePreference.includes(PACKAGE_PREFERENCE_DELIVERY_PICK_UP) ===
        false &&
      this.isFlowSelectDateFirst === true
    ) {
      this.store.dispatch("bookingPackage/removeAllSelectedPackage");
    }
  };

  backToAdultStepCallback() {
    const commits = [
      { state: "adult", val: 0 },
      { state: "kids", val: 0 },
      { state: "selectedDate", val: "" },
      { state: "selectedTime", val: "" },
      { state: "isBigGroup", val: false },
    ];
    commits.forEach((commit) =>
      this.store.commit("booking/setState", {
        state: commit.state,
        val: commit.val,
      })
    );
    // if user back to select adult again, then reset bookingDateTime store (so calendar will fetch again)
    this.store.commit("bookingDateTime/resetAllState");
    if (this.isFlowSelectDateFirst === false) {
      this.store.dispatch("bookingPackage/removeAllSelectedPackage");
    } else {
      this.removeAllSelectedPackages();
    }
    return true;
  }

  goToAdultStepGuard() {
    return true;
  }

  backToDateStepCallback() {
    // reset state
    const commits = [
      { state: "selectedDate", val: "" },
      { state: "selectedTime", val: "" },
    ];
    commits.forEach((commit) =>
      this.store.commit("booking/setState", {
        state: commit.state,
        val: commit.val,
      })
    );
    this.removeAllSelectedPackages();

    return true;
  }

  goToDateStepGuard() {
    const anySelectedAdult = this.store.state.booking.adult ? true : false;
    const allSectionHaveEnoughQuantity =
      this.store.getters["bookingPackage/allSectionHaveEnoughQuantity"];
    if (this.isDineIn === true) {
      if (anySelectedAdult === false) {
        return i18n.t("pleaseSelectAdult");
      }
      if (
        this.isFlowSelectDateFirst === false &&
        this.anySelectedPackages === false
      ) {
        return i18n.t("pleaseSelectPackage");
      } else {
        return true;
      }
    } else {
      if (this.anySelectedPackages === false) {
        return i18n.t("pleaseSelectPackage");
      } else if (allSectionHaveEnoughQuantity === false) {
        return i18n.t("pleaseSelectPackageMenu");
      } else {
        return true;
      }
    }
  }

  backToTimeStepCallback() {
    this.removeAllSelectedPackages();
    return true;
  }

  goToTimeStepGuard() {
    const anySelectedDate =
      new Date(this.store.state.booking.selectedDate).toString() !==
      "Invalid Date"
        ? true
        : false;
    return anySelectedDate ? true : i18n.t("pleaseSelectDate");
  }

  backToSelectPackageCallback() {
    this.removeAllSelectedPackages();
    return true;
  }

  goToSelectPackageStepGuard() {
    const isSelectDateGuardPass = this.goToDateStepGuard();
    const isSelectTimeGuardPass = this.goToTimeStepGuard();
    const anySelectedTime = this.store.state.booking.selectedTime.length
      ? true
      : false;

    if (isSelectDateGuardPass !== true) {
      return isSelectDateGuardPass;
    }
    if (isSelectTimeGuardPass !== true) {
      return isSelectTimeGuardPass;
    }
    if (anySelectedTime || this.canSkipSelectTime) {
      return true;
    }
    return i18n.t("pleaseSelectDateTime");
  }

  backToPaymentStepCallback() {
    this.removeAllSelectedPackages();
    return true;
  }

  goToPaymentStepGuard() {
    const isSelectDateGuardPass = this.goToDateStepGuard();
    const isSelectTimeGuardPass = this.goToTimeStepGuard();
    const isSelectPackageGuardPass = this.goToSelectPackageStepGuard();
    // const anySelectedTime =
    //   this.store.state.booking.selectedTime.length > 0 ? true : false;

    const anySelectedPackages =
      this.store.getters["bookingPackage/anySelectedPackages"];

    if (isSelectDateGuardPass !== true) {
      return isSelectDateGuardPass;
    }
    if (isSelectTimeGuardPass !== true) {
      return isSelectTimeGuardPass;
    }
    if (isSelectPackageGuardPass !== true) {
      return isSelectPackageGuardPass;
    }
    if (anySelectedPackages !== true) {
      return i18n.t("pleaseSelectPackage");
    }
    return true;
  }
}

export default bookingStepRules;
