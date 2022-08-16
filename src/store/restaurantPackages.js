import dayjs from "@/lib/dayjs";
import * as alert from "@/lib/alert";
import rollbar from "@/lib/rollbar";
import { isBudhistYear } from "@/helper/dateTimeHelper";
import getPackages from "@/services/getRestaurantPackages";
import { RESTAURANT_TIME } from "@/lib/constant";
import { SUPPORTED_PACKAGE_TYPE } from "@/lib/constant";
import isEmpty from "lodash-es/isEmpty";
import omitBy from "lodash-es/omitBy";
import packageFactory from "@/factories/packages";
import {
  eventPackages,
  isValid as isValidEvent,
} from "@/composable/corporateEvent";

const initialState = {
  keepState: false,
  isLoading: true,
  restaurantPackages: [],
  restaurantPackagesIsNotAllowed: [],
  restaurantPackagesExpired: [],
};

// determine if package is expired or not
function checkIsPackageNotExpired(paramPackage = {}) {
  let isPackageNotExpired = true;
  let packageExpDate = dayjs(paramPackage.endDate, "YYYY-MM-DD")
    .tz("Asia/Bangkok")
    .startOf("day");

  let today = "";
  if (isBudhistYear()) {
    today = RESTAURANT_TIME.subtract(543, "year").endOf("day");
  } else {
    today = RESTAURANT_TIME.endOf("day");
  }

  if (today && today.isValid() && packageExpDate && packageExpDate.isValid()) {
    isPackageNotExpired = today.isSameOrBefore(packageExpDate, "day");
  }

  return isPackageNotExpired;
}

// return object that have attribute of package type
function splitPackageByType(packages = []) {
  let packagesByType = {};
  SUPPORTED_PACKAGE_TYPE.forEach((packageType) => {
    packagesByType[packageType] = [];
  });
  if (packages) {
    packages.forEach((pack) => {
      packagesByType[pack.typeCode].push(pack);
    });
  }
  // delete package type if it has empty array
  const filteredPackagesByType = omitBy(packagesByType, isEmpty);
  return filteredPackagesByType;
}

// return package that available in corporate booking event
function checkIsPackageAvailableInEvent(pack = {}) {
  if (isValidEvent.value === false || eventPackages.value.length === 0) {
    return true;
  }
  return eventPackages.value.indexOf(pack.id) !== -1;
}

export default {
  state: {
    ...initialState,
  },
  namespaced: true,
  mutations: {
    setState(state, payload) {
      state[payload.state] = payload.val;
    },
    pushState(state, payload) {
      state[payload.state] = [...state[payload.state], ...payload.val];
    },
    resetAllState(state) {
      if (state.keepState) {
        return;
      }
      let newState = {
        ...initialState,
      };
      Object.assign(state, newState);
    },
  },
  actions: {
    async getRestaurantPackages(
      { state, dispatch, commit },
      restaurantId = ""
    ) {
      try {
        commit("setState", {
          state: "isLoading",
          val: true,
        });
        const result = await getPackages(restaurantId);
        if (result.isSuccess) {
          const packages = result.data;
          if (packages) {
            const restaurantExpiredPackages = [];
            const restaurantPackages = [];
            const restaurantPackagesIsNotAllowed = [];
            packages.forEach((pack) => {
              const packageInstance = packageFactory(pack);
              const isNotExpired =
                isValidEvent.value === true
                  ? packageInstance
                  : checkIsPackageNotExpired(packageInstance);
              const isAvailableInEvent =
                checkIsPackageAvailableInEvent(packageInstance);
              if (!isAvailableInEvent) {
                restaurantPackagesIsNotAllowed.push(packageInstance);
              } else if (isNotExpired) {
                restaurantPackages.push(packageInstance);
              } else {
                restaurantExpiredPackages.push(packageInstance);
              }
            });

            commit("setState", {
              state: "restaurantPackages",
              val: restaurantPackages,
            });

            commit("setState", {
              state: "restaurantPackagesIsNotAllowed",
              val: restaurantPackagesIsNotAllowed,
            });

            commit("setState", {
              state: "restaurantExpiredPackages",
              val: restaurantExpiredPackages,
            });

            if (state.restaurantPackages && state.restaurantPackages.length) {
              const restaurantPackagesByType = splitPackageByType(
                state.restaurantPackages
              );
              commit(
                "restaurant/setAvailablePackageTypes",
                Object.keys(restaurantPackagesByType),
                { root: true }
              );
              commit("setState", {
                state: "isLoading",
                val: false,
              });
              dispatch(
                "bookingPackage/setupPackage",
                state.restaurantPackages,
                {
                  root: true,
                }
              );

              return;
            }
            rollbar.error("All restaurant package is expired", {
              restaurantId,
            });
            return;
          }
          alert.error(result.message);
        }
      } catch (err) {
        const message =
          "Oops, someting went wrong, Failed get restaurant packages";
        rollbar.error(message, err, { restaurantId });
        alert.error(message);
      }
    },
  },
  getters: {
    isAllAcceptVoucher: (state) => {
      let everyIsAcceptVoucher = state.restaurantPackages.every(
        (pack) => pack.isAcceptVoucher === true
      );

      return everyIsAcceptVoucher;
    },
  },
};
