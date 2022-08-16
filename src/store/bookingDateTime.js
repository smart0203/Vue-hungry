import { getField, updateField } from "vuex-map-fields";
import dayjs from "@/lib/dayjs";
import getDates from "@/services/getAvailableDates.js";
import getTimes from "@/services/getAvailableTimes.js";
import rollbar from "@/lib/rollbar";
import { ORDER_NOW } from "@/lib/constant";
import orderBy from "lodash-es/orderBy";

function initialState() {
  return {
    keepState: false,
    isTodayAvailableForBooking: false,
    preferedOrderTime: "", // possible value: order-later / order-now
    todayFastestBookingTime: "",
    enableDates: [],
    bookedDates: [],
    availableTime: [],
    // contain array of promise date checking
    lazyDateCheck: [],
    initialDateCheck: [],
    checkedMonths: [],
    currentMonth: -1,
  };
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    getField,
    anyAvailableDates(state) {
      if (state.enableDates.length > 0) {
        return true;
      }
      return false;
    },
    isOrderNow(state) {
      return state.preferedOrderTime === ORDER_NOW;
    },
  },
  mutations: {
    updateField,
    setState(state, payload) {
      state[payload.state] = payload.val;
    },
    pushState(state, payload) {
      state[payload.state].push(payload.val);
    },
    setStateAttribute(state, { name, attribute, val }) {
      state[name][attribute] = val;
    },
    resetAllState(state) {
      if (state.keepState) {
        return;
      }
      Object.assign(state, initialState());
    },
  },
  actions: {
    async fetchTodayAvailableDateTimes({
      rootState,
      rootGetters,
      state,
      commit,
    }) {
      try {
        const isDineIn = rootGetters["booking/isDineIn"];
        const isIncludePackage =
          rootGetters["booking/isFlowSelectDateFirst"] === false ||
          isDineIn === false
            ? true
            : false;
        const { adult, kids } = rootState.booking;
        const restaurantId = rootState.restaurant.restaurantId;
        const isRestaurantSupportOrderNow =
          rootState.restaurant.isSupportOrderNow;
        const packageIds = rootGetters["bookingPackage/getSelectedPackage"].map(
          (packages) => packages.id
        );
        const today = dayjs().format("YYYY-MM-DD");
        const getDatesRequest = await getDates(
          isDineIn,
          isIncludePackage,
          restaurantId,
          adult,
          kids,
          today,
          today,
          packageIds
        );
        if (getDatesRequest && getDatesRequest.length > 0) {
          const isAvailable = getDatesRequest[0].availability;
          if (isAvailable) {
            const timeResponse = await getTimes(
              isDineIn,
              isIncludePackage,
              restaurantId,
              adult,
              kids,
              today,
              packageIds,
              isRestaurantSupportOrderNow
            );
            const availableTimes =
              Array.isArray(timeResponse) && timeResponse.length
                ? timeResponse.filter((time) => time.availability)
                : [];
            if (availableTimes.length > 0) {
              state.isTodayAvailableForBooking = true;
              state.todayFastestBookingTime = availableTimes[0].startTime;
              commit("pushState", {
                state: "enableDates",
                val: dayjs().format("YYYY-MM-DD"),
              });
            } else {
              // no time is available for today
              state.isTodayAvailableForBooking = false;
            }
          } else {
            // today is not available
            state.isTodayAvailableForBooking = false;
          }
        } else {
          // today is not available
          state.isTodayAvailableForBooking = false;
        }
      } catch (err) {
        if (err) {
          const errorMessage = "failed get today booking date time";
          rollbar.error(errorMessage, err);
          throw new Error(errorMessage);
        }
      }
    },
    async fetchAvailableDatesPerMonth(
      { commit, rootGetters, rootState },
      dateChunk
    ) {
      const isDineIn = rootGetters["booking/isDineIn"];
      const isIncludePackage =
        rootGetters["booking/isFlowSelectDateFirst"] === false ||
        isDineIn === false
          ? true
          : false;
      const { adult, kids } = rootState.booking;
      const restaurantId = rootState.restaurant.restaurantId;
      const packageIds = rootGetters["bookingPackage/getSelectedPackage"].map(
        (packages) => packages.id
      );
      const listRequests = [];
      dateChunk.forEach((chunk) => {
        listRequests.push(
          getDates(
            isDineIn,
            isIncludePackage,
            restaurantId,
            adult,
            kids,
            chunk.startDate,
            chunk.endDate,
            packageIds
          )
        );
      });
      try {
        const allRequestResult = await Promise.all(listRequests);
        if (allRequestResult && allRequestResult.length) {
          allRequestResult.forEach((result) => {
            if (result && result.length) {
              result.forEach((filtered) => {
                if (
                  filtered.availability === false &&
                  filtered.bookedSeat > 0
                ) {
                  commit("pushState", {
                    state: "bookedDates",
                    val: filtered.date,
                  });
                } else if (
                  filtered.availability === true &&
                  filtered.seatLeft > 0
                ) {
                  commit("pushState", {
                    state: "enableDates",
                    val: filtered.date,
                  });
                }
              });
            }
          });
        }
      } catch (err) {
        rollbar.error(err);
      }
    },
    async fetchAvailableTimes({ rootState, rootGetters, commit }) {
      try {
        const { adult, selectedDate, kids } = rootState.booking;
        const formatedDate = dayjs(selectedDate).format("YYYY-MM-DD");
        const isDineIn = rootGetters["booking/isDineIn"];
        const isIncludePackage =
          rootGetters["booking/isFlowSelectDateFirst"] === false ||
          isDineIn === false
            ? true
            : false;
        const restaurantId = rootState.restaurant.restaurantId;
        const packageIds = rootGetters["bookingPackage/getSelectedPackage"].map(
          (packages) => packages.id
        );
        const result = await getTimes(
          isDineIn,
          isIncludePackage,
          restaurantId,
          adult,
          kids,
          formatedDate,
          packageIds,
          false
        );
        const sortedTimes = orderBy(
          result,
          ["availability", "startTime"],
          ["desc", "asc"]
        );
        commit("setState", {
          state: "availableTime",
          val: sortedTimes,
        });
        return true;
      } catch (err) {
        if (!err) {
          return null;
        }
        rollbar.error(err);
        return err;
      }
    },
    resetAllState({ commit }) {
      commit("resetAllState");
    },
  },
};
