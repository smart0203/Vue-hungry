import { getInventoriesSummaries } from "@/services/inventorySummary";
import * as alert from "@/lib/alert";
import rollbar from "@/lib/rollbar";

const initialState = {
  inventorySummaries: [],
  packagesSort: [],
};

export default {
  state: {
    ...initialState,
  },
  namespaced: true,
  mutations: {
    setState(state, payload) {
      state[payload.state] = payload.val;
    },
  },
  actions: {
    async setupInventorySummaries({ commit }, restaurantId = "") {
      try {
        const result = await getInventoriesSummaries(restaurantId);

        if (result.isSuccess) {
          const datas = result.data.data;
          commit("setState", {
            state: "inventorySummaries",
            val: datas,
          });
        }
      } catch (err) {
        const message =
          "Oops, someting went wrong, Failed get restaurant packages";
        rollbar.error(message, err, { restaurantId });
        alert.error(message);
      }
    },
    comparePackagesWithInvSummaries(
      { getters, commit },
      { packages, limitedSeats }
    ) {
      // compare summaries and packages
      let checkInventorySummaries = getters.getInventorySummaries.filter((o1) =>
        packages.some((o2) => o1.restaurantPackageId === parseInt(o2.id))
      );

      if (checkInventorySummaries.length) {
        const checkSummaryLimitedSeats = checkInventorySummaries.filter(
          (inventorySummary) =>
            inventorySummary.totalSeatLeftPackage < parseInt(limitedSeats)
        );

        let packagesSortArray = [];
        if (checkSummaryLimitedSeats.length) {
          let sortSummaries = checkInventorySummaries.sort(
            (a, b) => a.totalSeatLeftPackage - b.totalSeatLeftPackage
          );

          // packages sold out
          const soldOutPackages = sortSummaries.filter(
            (value) => value.totalSeatLeftPackage === 0
          );
          if (soldOutPackages.length) {
            const seatLeftPackagesNotSoldOut = sortSummaries.filter(
              (value) => value.totalSeatLeftPackage !== 0
            );

            sortSummaries = seatLeftPackagesNotSoldOut.length
              ? seatLeftPackagesNotSoldOut.concat(soldOutPackages)
              : soldOutPackages;
          }

          // find package and show packages
          const findPackageArray = [];
          sortSummaries.forEach((value) => {
            const findPackage = packages.find(
              (v) => parseInt(v.id) === value.restaurantPackageId
            );

            if (findPackage) {
              findPackageArray.push(findPackage);
            }
          });

          //sort packages if add on false move to bottom
          const sortPackagesAddOn = findPackageArray.sort(
            (a, b) => a.isAddOn - b.isAddOn
          );

          packagesSortArray = sortPackagesAddOn;
        }
        commit("setState", {
          state: "packagesSort",
          val: packagesSortArray,
        });
      }
    },
  },
  getters: {
    getInventorySummaries(state) {
      if (state.inventorySummaries.length === 0) {
        return [];
      }
      return state.inventorySummaries;
    },
    getSortPackages(state) {
      if (state.packagesSort.length === 0) {
        return [];
      }

      return state.packagesSort;
    },
  },
};
