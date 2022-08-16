import { charge } from "@/lib/partialCharge";
import { getField, updateField } from "vuex-map-fields";
import { convertToNumber } from "@/helper/stringHelper";

const initialState = {
  chargeType: "",
  chargePrice: "",
  chargeAmountType: "",
  chargePercent: "",
  originalDeliveryFee: "",
  deliveryFee: "",
  deliveryFeeInBaht: "",
  deliveryFeePerKmInBaht: "",
  deliveryRadius: "",
  freeDeliveryRadius: "",
  totalPrice: "",
  isLoadingDeliveryInformation: "",
  isPartialChargeSuccess: false,
  selectedPackagesCharged: [],
};

export default {
  namespaced: true,
  state: {
    ...initialState,
  },
  getters: {
    getField,
    getState: (state) => (name) => {
      return state[name];
    },
    totalCharge(state) {
      return state.chargePrice + state.deliveryFee;
    },
    totalPayAtRestaurant(state, getters) {
      if (getters.isNotFullCharge) {
        return state.totalPrice - getters.totalCharge;
      }
      return state.totalPrice;
    },
    isNotFullCharge(state) {
      return state.chargeAmountType != "fixed" &&
        state.chargeAmountType == "relative" &&
        state.chargePercent != 100
        ? true
        : false;
    },
    isChargeFree(state) {
      return (
        state.chargePrice == 0 &&
        state.deliveryFee == 0 &&
        state.totalPrice == 0
      );
    },
  },
  mutations: {
    updateField,
    setState(state, payload) {
      state[payload.state] = payload.val;
    },
    resetState(state) {
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
    async calculatePartialCharge({ commit, rootState, dispatch }, payload) {
      const isDelivery = rootState.booking.bookingMethod === "delivery";
      const packages = await dispatch(
        "bookingPackage/buildPackagePayload",
        {},
        { root: true }
      );
      // const alaCartePackages = rootGetters["bookingPackage/getSelectedPackageAlaCarte"]
      return new Promise((resolve, reject) => {
        const param = {
          adult: rootState.booking.adult,
          kids: rootState.booking.kids,
          restaurantId: rootState.restaurant.restaurantId,
          packages: packages,
          guess: payload.guess || false,
          menuSections: [],
        };
        if (isDelivery || payload.guess === true) {
          param.distance = rootState.booking.distanceToRestaurant.value;
        }
        charge(param)
          .then((resp) => {
            const data = resp.data;
            dispatch("applyChargeData", data);
            resolve();
          })
          .catch((err) => {
            reject(err);
            commit("resetState");
          });
      });
    },
    applyChargeData({ commit }, data) {
      const {
        chargePercent,
        chargeType,
        chargePrice,
        chargeAmountType,
        originalDeliveryFee,
        deliveryFee,
        deliveryFeeInBaht,
        deliveryFeePerKmInBahtm,
        deliveryRadius,
        freeDeliveryRadius,
        totalPrice,
        selectedPackages,
      } = data;
      commit("setState", {
        state: "selectedPackagesCharged",
        val: selectedPackages,
      });
      commit("setState", {
        state: "chargeType",
        val: chargeType,
      });
      commit("setState", {
        state: "isPartialChargeSuccess",
        val: true,
      });
      commit("setState", {
        state: "chargePercent",
        val: chargePercent,
      });
      commit("setState", {
        state: "chargePrice",
        val: convertToNumber(chargePrice),
      });
      commit("setState", {
        state: "chargeAmountType",
        val: chargeAmountType,
      });
      commit("setState", {
        state: "deliveryFee",
        val: convertToNumber(deliveryFee),
      });
      commit("setState", {
        state: "originalDeliveryFee",
        val: convertToNumber(originalDeliveryFee),
      });
      commit("setState", {
        state: "deliveryFeeInBaht",
        val: deliveryFeeInBaht,
      });
      commit("setState", {
        state: "deliveryFeePerKmInBahtm",
        val: deliveryFeePerKmInBahtm,
      });
      commit("setState", {
        state: "deliveryRadius",
        val: deliveryRadius,
      });
      commit("setState", {
        state: "freeDeliveryRadius",
        val: freeDeliveryRadius,
      });
      commit("setState", {
        state: "totalPrice",
        val: convertToNumber(totalPrice),
      });
    },
  },
};
