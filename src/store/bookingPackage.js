import { getField, updateField } from "vuex-map-fields";
import dayjs from "@/lib/dayjs";
import normalizePackage from "./schema/packageSchema";
import sortBy from "lodash-es/sortBy";
import rollbar from "@/lib/rollbar";
import { i18n } from "@/lib/i18n/i18n";
import * as alert from "@/lib/alert";
import { selectPackageGuard } from "@/helper/PackageHelper";
import {
  DELIVERY_METHOD_DELIVERY,
  DELIVERY_METHOD_PICKUP_AND_DELIVERY,
  DELIVERY_METHOD_PICKUP,
  PACKAGE_CODE_HAH,
  SUPPORTED_PAYMENT_PROMPT_PAY,
  SUPPORTED_PAYMENT_CREDIT_CARD,
  SUPPORTED_PAYMENT_SHOPEE_PAY,
  SUPPORTED_PAYMENT_TRUE_WALLET,
} from "@/lib/constant";

const initialState = {
  keepState: false,
  packages: [],
};

export default {
  namespaced: true,
  state: { ...initialState },
  getters: {
    getField,
    packagesBigGroup(state) {
      if (state.packages.length === 0) {
        return [];
      }
      return state.packages.filter((packages) => {
        return packages.typeCode !== PACKAGE_CODE_HAH;
      });
    },
    getPackageByType: (state) => (packageTypeArray) => {
      if (
        Array.isArray(packageTypeArray) === false ||
        (Array.isArray(packageTypeArray) && packageTypeArray.length === 0)
      ) {
        return state.packages;
      }
      return state.packages.filter((pack) => {
        if (packageTypeArray.indexOf(pack.typeCode) !== -1) {
          return pack;
        }
      });
    },
    getPackageById: (state) => (packagedId) => {
      const filter = state.packages.filter(
        (packages) => packages.id === packagedId
      );
      if (filter && filter.length) {
        return filter[0];
      }
      throw new Error(`package with id ${packagedId} not found`);
    },
    getDineInPackage(state) {
      return state.packages.filter(
        (packages) => packages.typeCode !== PACKAGE_CODE_HAH
      );
    },
    getSelectedPackage(state) {
      return state.packages.filter(
        (packages) => packages.quantity && packages.quantity > 0
      );
    },
    getSelectedPackageType(state, getters) {
      const selectedPackages = getters.getSelectedPackage;
      if (selectedPackages.length) {
        return selectedPackages.map((packages) => packages.typeCode)[0];
      }
      return "";
    },
    getSelectedPackagePayment(state, getters) {
      const supportedPayment = new Set();
      getters.getSelectedPackage.forEach((pack) => {
        const paymentTypes = pack.paymentTypes;
        if (Array.isArray(paymentTypes)) {
          if (paymentTypes.includes(SUPPORTED_PAYMENT_PROMPT_PAY)) {
            supportedPayment.add(SUPPORTED_PAYMENT_PROMPT_PAY);
          }
          if (paymentTypes.includes(SUPPORTED_PAYMENT_CREDIT_CARD)) {
            supportedPayment.add(SUPPORTED_PAYMENT_CREDIT_CARD);
          }
          if (paymentTypes.includes(SUPPORTED_PAYMENT_SHOPEE_PAY)) {
            supportedPayment.add(SUPPORTED_PAYMENT_SHOPEE_PAY);
          }
          if (paymentTypes.includes(SUPPORTED_PAYMENT_TRUE_WALLET)) {
            supportedPayment.add(SUPPORTED_PAYMENT_TRUE_WALLET);
          }
        }
      });
      return supportedPayment;
    },
    anySelectedPackages(state, getters) {
      if (getters.getSelectedPackage.length > 0) {
        return true;
      }
      return false;
    },
    getSelectedPackageFastestExpiryDate(state, getters) {
      if (getters.getSelectedPackage.length > 0) {
        return getters.getSelectedPackage
          .map((pack) => pack.endDate)
          .filter((a, b) => {
            return dayjs(a, "YYYY-MM-DD").isAfter(dayjs(b, "YYYY-MM-DD"))
              ? 1
              : -1;
          })[0];
      }
      return undefined;
    },
    getSelectedPackagDeliveryConfig(state, getters) {
      if (getters.getSelectedPackage.length > 0) {
        const takeAwayLists = getters.getSelectedPackage.map(
          (pack) => pack.takeAwayProperty
        );
        const sorted = sortBy(takeAwayLists, "deliveryFeePerKmInBaht");
        return sorted[0];
      }

      return undefined;
    },
    getSelectedPackageTnC(state, getters) {
      if (getters.getSelectedPackage.length > 0) {
        return getters.getSelectedPackage[0].packageInfo.tncLink || "";
      }
      return "";
    },
    getSelectedPackageChargePolicy(state, getters) {
      if (getters.getSelectedPackage.length > 0) {
        const { chargePolicy } = getters.getSelectedPackage[0];
        return chargePolicy;
      }
      return "";
    },
    getSelectedPackageChargePolicyImage(state, getters) {
      if (getters.getSelectedPackage.length > 0) {
        const { chargePolicyLink } = getters.getSelectedPackage[0];
        return chargePolicyLink;
      }
      return "";
    },
    anyDineInPackage(state, getters) {
      const dineInPackages = getters.getDineInPackage;
      if (dineInPackages.length > 0) {
        return true;
      }
      return false;
    },
    isSelectedPackageNotAddonPackageOnly(state, getters) {
      let addonPackage = [];
      addonPackage = getters.getSelectedPackage.filter(
        (packages) => packages.isAddOn
      );
      return addonPackage.length === getters.getSelectedPackage.length
        ? false
        : true;
    },
    anyDeliveryPackage(state, getters) {
      return getters.getPackageByType([PACKAGE_CODE_HAH]).length > 0
        ? true
        : false;
    },
    getSelectedPackageDeliveryType(state, getters) {
      const selectedPackage = getters.getSelectedPackage;
      let delivery = [];
      let pickup = [];
      let bothPickupAndDelivery = [];
      if (selectedPackage.length > 0) {
        selectedPackage.forEach((packages) => {
          if (packages.availableMethods !== undefined) {
            if (
              packages.availableMethods == DELIVERY_METHOD_PICKUP_AND_DELIVERY
            ) {
              bothPickupAndDelivery.push(true);
            } else if (packages.availableMethods == DELIVERY_METHOD_DELIVERY) {
              delivery.push(true);
            } else if (packages.availableMethods == DELIVERY_METHOD_PICKUP) {
              pickup.push(true);
            }
          }
        });
        // determine delivery type
        if (bothPickupAndDelivery.length > 0) {
          return DELIVERY_METHOD_PICKUP_AND_DELIVERY;
        } else if (delivery.length > 0 && pickup.length > 0) {
          return DELIVERY_METHOD_PICKUP_AND_DELIVERY;
        } else if (delivery.length > 0) {
          return DELIVERY_METHOD_DELIVERY;
        } else if (pickup.length > 0) {
          return DELIVERY_METHOD_PICKUP;
        } else {
          return DELIVERY_METHOD_PICKUP_AND_DELIVERY;
        }
      }
      return "";
    },
    isSelectedPackageNeedPrepaid(state, getters) {
      const packagesNeedPrepaid = getters.getSelectedPackage.filter(
        (packages) => packages.chargeType
      );
      return packagesNeedPrepaid.length > 0 ? true : false;
    },
    isSelectedPackageDineIn(state, getters) {
      if (getters.anySelectedPackages) {
        return getters.getSelectedPackageType === PACKAGE_CODE_HAH
          ? false
          : true;
      }
      return undefined;
    },
    isSelectedPackagesAcceptMultipleQuantity(state, getters) {
      const acceptManyQuantity = getters.getSelectedPackage.filter(
        (packages) => packages.isAcceptManyQuantity === true
      );
      return acceptManyQuantity.length > 0 ? true : false;
    },
    isPackageRequireCC(state, getters) {
      const packageRequireCc = getters.getSelectedPackage.filter(
        (packages) => packages.requireCc === true
      );
      return packageRequireCc.length > 0 ? true : false;
    },
    isPackageHaveEnoughtQuantity(state, getters, rootState) {
      if (
        getters.isSelectedPackageDineIn === false ||
        (getters.isSelectedPackageDineIn === true &&
          getters.isSelectedPackagesAcceptMultipleQuantity === false)
      ) {
        return undefined;
      }

      const selectedPax = rootState.booking.adult;
      let totalPackagesPack = 0;
      getters.getSelectedPackage.forEach((packages) => {
        const selectedRule = packages.getSelectedPricingRule(selectedPax);
        totalPackagesPack += selectedRule.perPack * packages.quantity;
      });
      if (totalPackagesPack >= selectedPax) {
        return true;
      }
      return false;
    },
    isSelectedPackageAcceptTravelTogether(state, getters) {
      if (getters.anySelectedPackages) {
        const packTravelTogether = getters.getSelectedPackage.filter(
          (pack) => pack.acceptWeTravelTogether
        );
        return packTravelTogether.length === getters.getSelectedPackage.length
          ? true
          : false;
      }
      return undefined;
    },
    getSelectedMenuSectionsInPackage: (state, getters) => (packageId) => {
      const packages = getters.getPackageById(packageId);
      return packages.getSectionsWithSelectedMenus();
    },
    allSectionHaveEnoughQuantity(state, getters) {
      if (getters.getSelectedPackage.length > 0) {
        let sectionInvalidQuantity = [];
        getters.getSelectedPackage.forEach((packages) => {
          if (packages.isSectionHaveValidQuantity() === false) {
            sectionInvalidQuantity.push(packages);
          }
        });

        return sectionInvalidQuantity.length === 0 ? true : false;
      }
      return false;
    },
  },
  mutations: {
    updateField,
    resetAllState(state) {
      if (state.keepState) {
        return;
      }
      let newState = {
        ...initialState,
      };
      Object.assign(state, newState);
    },
    // package mutations
    removeSelectedPackage(state, packageId) {
      const pack = state.packages.filter((pack) => pack.id === packageId);
      if (!pack) {
        rollbar.error(`Package with id ${packageId} not found`, {
          availablePackages: state.packages,
        });
        return;
      }
      pack[0].decreasePackageQuantity(0);
    },
    increasePackageQuantity(state, packageId) {
      const pack = state.packages.filter((pack) => pack.id === packageId);
      if (!pack) {
        rollbar.error(`Package with id ${packageId} not found`, {
          availablePackages: state.packages,
        });
        return;
      }
      pack[0].increasePackageQuantity();
    },
    decreasePackageQuantity(state, packageId) {
      const pack = state.packages.filter((pack) => pack.id === packageId);
      if (!pack) {
        rollbar.error(`Package with id ${packageId} not found`, {
          availablePackages: state.packages,
        });
        return;
      }
      pack[0].decreasePackageQuantity();
    },
    setState(state, payload) {
      state[payload.state] = payload.val;
    },
    pushState(state, payload) {
      state[payload.state].push(payload.val);
    },
  },
  actions: {
    setupPackage({ commit }, packagesPayload) {
      if (!packagesPayload) {
        throw new Error("Failed setup booking package, package is missing");
      }
      let sortedPackages = sortBy(packagesPayload, ["rankInRestaurantScope"]);
      commit("setState", {
        state: "packages",
        val: sortedPackages,
      });
    },
    setupBigGroupPackage({ state, commit }, packagesPayload) {
      const packages = packagesPayload.map((packages) => {
        return {
          id: packages.id,
          isBigGroup: true,
          ...packages.attributes,
        };
      });
      const normalizedPackages = normalizePackage(packages);
      const existingPackages = state.packages;
      commit("setState", {
        state: "packages",
        val: {
          ...existingPackages,
          ...normalizedPackages.entities.packages,
        },
      });
    },
    selectPackageGuard({ state, getters, rootState }, packageId) {
      const newPackage = state.packages.filter(
        (pack) => pack.id === packageId
      )[0];
      const selectedPackages = getters.getSelectedPackage;
      const bookingPackagePreference = rootState.booking.packagePreference;
      const selectedDate = dayjs(rootState.booking.selectedDate);
      const selectedTime = rootState.booking.selectedTime;
      const guardResult = selectPackageGuard({
        pack: newPackage,
        selectedPackages: selectedPackages,
        anySelectedDateAndTime:
          selectedDate.length > 0 && selectedTime.length > 0 ? true : false,
        currentPackagePreference: bookingPackagePreference,
      });
      const isSuccess = guardResult.isSuccess;
      if (!isSuccess) {
        const { invalidData, notAvailable, cannotCombine } =
          guardResult.errorType;
        if (invalidData) {
          alert.error("Invalid Data");
        }
        if (notAvailable) {
          const formatedSelectedDate = selectedDate.isValid()
            ? selectedDate.format("ddd, D")
            : "";
          const formatedSelectedMonth = selectedDate.isValid()
            ? selectedDate.format("MMM")
            : "";
          const message = ` ${i18n.t(
            "packageNotAvailable"
          )} ${formatedSelectedDate} ${formatedSelectedMonth}, ${selectedTime}`;
          alert.error(message);
        }
        if (cannotCombine) {
          const message = i18n.t("cannotCombinePackage");
          alert.error(message);
        }
      }
      return guardResult;
    },
    selectPackage({ state, getters, dispatch }, packageId) {
      const newPackage = state.packages.filter(
        (pack) => pack.id === packageId
      )[0];
      if (getters.anySelectedPackages) {
        if (
          getters.getSelectedPackageType === newPackage.typeCode &&
          getters.isSelectedPackagesAcceptMultipleQuantity &&
          newPackage.isAcceptManyQuantity
        ) {
          newPackage.increasePackageQuantity();
        } else {
          dispatch("removeAllSelectedPackage");
          newPackage.increasePackageQuantity();
        }
      } else {
        newPackage.increasePackageQuantity();
      }
    },
    removeAllSelectedPackage({ getters }) {
      getters.getSelectedPackage.forEach((packages) => {
        packages.decreasePackageQuantity(0);
      });
    },
    increasePackageQuantity({ state }, { packageId, quantity }) {
      const pack = state.packages.filter((pack) => pack.id === packageId);
      if (!pack) {
        rollbar.error(`Package with id ${packageId} not found`, {
          availablePackages: state.packages,
        });
        return;
      }
      pack[0].increasePackageQuantity(quantity);
    },
    decreasePackageQuantity({ state }, packageId) {
      const pack = state.packages.filter((pack) => pack.id === packageId);
      if (!pack) {
        rollbar.error(`Package with id ${packageId} not found`, {
          availablePackages: state.packages,
        });
        return;
      }
      pack[0].decreasePackageQuantity();
    },
    buildPackagePayload({ getters }) {
      // this function return format that ready to use in booking package payload
      return new Promise((resolve) => {
        const packagesPayload = getters.getSelectedPackage.map((pack) => {
          // check if package is hungry@home or not
          if (
            pack.menuSections === undefined ||
            pack.menuQuantityLimit === undefined ||
            pack.menuQuantityLimit == 0
          ) {
            return {
              id: pack.id,
              quantity: pack.quantity,
            };
          }

          let result = {
            id: pack.id,
            quantity: pack.quantity,
            menuSections: [],
          };
          pack.menuSections.forEach((section) => {
            const selectedMenusInSection = section.getSelectedMenu();
            if (selectedMenusInSection.length > 0) {
              let menuSectionObj = {
                id: section.id,
                name: section.name,
                menus: [],
              };
              selectedMenusInSection.forEach((selectedMenu) => {
                let menuObj = {
                  id: selectedMenu.id,
                  quantity: selectedMenu.quantity,
                  subsections: [],
                };

                if (selectedMenu.isHaveSubSections()) {
                  let box = selectedMenu.subSectionGroups.map(
                    (subSectionGroup) => {
                      let boxObj = subSectionGroup.subSections.map(
                        (subSection) => {
                          return {
                            id: subSection.id,
                            name: subSection.name,
                            menus: subSection.getSelectedSubMenus(),
                          };
                        }
                      );
                      return { box: boxObj };
                    }
                  );
                  menuObj.subsections = box;
                }
                menuSectionObj.menus.push(menuObj);
              });
              result.menuSections.push(menuSectionObj);
            }
          });
          return result;
        });
        resolve(packagesPayload);
      });
    },
  },
};
