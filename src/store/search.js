import { getField, updateField } from "vuex-map-fields";
import { getRestaurantTagGroup } from "@/services/restaurant";
import rollbar from "@/lib/rollbar";
import { searchRestaurant } from "@/services/restaurant";
import qs from "qs";
import humps from "humps";
import { i18n } from "@/lib/i18n/i18n.js";
import {
  getPackageType,
  getCuisineList,
  getLocationList,
} from "@/services/common";

const initialState = {
  filterCategory: "",
  activeFilterTab: "",
  availablePackageType: [],
  keyword: "",
  branchId: "",
  hashtags: [],
  cuisines: [],
  promotions: [],
  locations: [],
  searchResult: [],
  pageNumber: 1,
  pageSize: 10,
  anyNextPage: false,
  startPrice: 0,
  endPrice: 20000,
  isDineIn: true,
  isDelivery: true,
  sortBy: "",
  isFilterByPrice: false,
  selectedCuisines: [],
  selectedPromotions: [],
  selectedLocations: [],
  selectedDates: [],
  selectedPackageType: [],
  selectedTime: "",
  section: "",
  selectedCityId: "",
};

export default {
  namespaced: true,
  state: { ...initialState },
  getters: {
    getField,
    searchQuery(state, getters) {
      let query = qs.parse(window.location.search, {
        ignoreQueryPrefix: true,
      });

      query.cityId = state.selectedCityId || null;
      query.nameLike = state.keyword || null;
      query.cuisines = getters["isFilterByCuisines"]
        ? state.selectedCuisines
        : null;
      query.locations = getters["isFilterByLocations"]
        ? state.selectedLocations
        : null;
      query.groupTags = getters["isFilterByPromotions"]
        ? state.selectedPromotions
        : null;
      query.packageType = getters["isFilterByPackageType"]
        ? state.selectedPackageType
        : null;
      query.price = state.isFilterByPrice
        ? `BETWEEN ${state.startPrice} AND ${state.endPrice}`
        : null;
      query.dineIn = state.isDineIn && !state.isDelivery ? true : null;
      query.delivery = state.isDelivery && !state.isDineIn ? true : null;
      query.date = state.selectedDates[0] || null;
      query.startTime = state.selectedTime || null;
      query.section = state.section || null;
      const decamelizeKeys = humps.decamelizeKeys(query);
      return qs.stringify(decamelizeKeys, {
        arrayFormat: "brackets",
        encode: false,
        skipNulls: true,
      });
    },
    serviceType(state) {
      if (state.isDineIn && state.isDelivery) {
        return "";
      } else if (state.isDineIn) {
        return "dine_in";
      } else if (state.isDelivery) {
        return "delivery";
      }
      return "";
    },
    activeFilterTabTitle(state, getters) {
      if (state.activeFilterTab === "cuisine") {
        const selectedCuisines = getters["selectedAvailableCuisines"];
        const labelSelectedCuisines =
          selectedCuisines.length > 0 ? `(${selectedCuisines.length})` : "";
        return `${i18n.t("cuisines")} ${labelSelectedCuisines}`;
      } else if (state.activeFilterTab === "location") {
        const selectedLocations = getters["selectedAvailableLocations"];
        const labelSelectLocations = selectedLocations.length
          ? `(${selectedLocations.length})`
          : "";
        return `${i18n.t("location")} ${labelSelectLocations}`;
      } else if (state.activeFilterTab === "promotion") {
        return i18n.t("promotion");
      } else if (state.activeFilterTab === "price") {
        return i18n.t("priceRange");
      } else if (state.activeFilterTab === "date") {
        return "available for these dates";
      } else if (state.activeFilterTab === "packageType") {
        const selectedPackageType = getters["selectedAvailablePackageType"];
        const labelSelectedPackageType = selectedPackageType.length
          ? `(${selectedPackageType.length})`
          : "";
        return `${i18n.t("packageType")} ${labelSelectedPackageType}`;
      }
    },
    selectedAvailableCuisines(state) {
      return state.cuisines.filter((cuisine) => cuisine.selected);
    },
    selectedAvailableLocations(state) {
      return state.locations.filter((location) => location.selected);
    },
    selectedAvailablePackageType(state) {
      return state.availablePackageType.filter(
        (packageType) => packageType.selected
      );
    },
    isFilterByCuisines(state) {
      return state.selectedCuisines && state.selectedCuisines.length > 0;
    },
    isFilterByLocations(state) {
      return state.selectedLocations && state.selectedLocations.length > 0;
    },
    isFilterByPromotions(state) {
      return state.selectedPromotions && state.selectedPromotions.length > 0;
    },
    isFilterByDates(state) {
      return state.selectedDates && state.selectedDates.length > 0;
    },
    isFilterByTimes(state) {
      return state.selectedTime && state.selectedTime.length > 0;
    },
    isFilterByHashTags(state) {
      return state.hashtags && state.hashtags.length > 0;
    },
    isFilterByPackageType(state) {
      return state.selectedPackageType && state.selectedPackageType.length > 0;
    },
  },
  mutations: {
    updateField,
    setState(state, payload) {
      state[payload.state] = payload.val;
    },
    pushState(state, payload) {
      state[payload.state] = [...state[payload.state], ...payload.val];
    },
    resetState(state) {
      Object.assign(state, initialState);
    },
  },
  actions: {
    async doSearch({ state, getters, commit }, option) {
      const {
        pageNumber,
        pageSize,
        startPrice,
        endPrice,
        keyword,
        hashtags,
        branchId,
        selectedCuisines,
        selectedPromotions,
        selectedLocations,
        selectedDates,
        selectedTime,
        selectedPackageType,
        sortBy,
        section,
      } = state;
      const allowSearchByCity = !option.ignoreCIty;
      const { serviceType } = getters;
      const cityId = state.selectedCityId;
      const cuisineId = selectedCuisines.join(",");
      const groupTagsId = selectedPromotions.join(",");
      const locationId = selectedLocations.join(",");
      const selectedPackageTypeId = selectedPackageType.join(",");
      const payload = {
        keyword: keyword,
        pageNumber: pageNumber,
        pageSize: pageSize,
        hashtags: hashtags,
        branchId: branchId,
        cuisineId: cuisineId,
        locationId: locationId,
        groupTagsId: groupTagsId,
        serviceType: serviceType,
        sortBy: sortBy,
        date: selectedDates[0],
        time: selectedTime,
        packageType: selectedPackageTypeId,
        section,
      };
      if (allowSearchByCity && cityId.length) {
        payload.cityId = cityId;
      }
      if (state.isFilterByPrice) {
        payload.startPrice = startPrice;
        payload.endPrice = endPrice;
      }
      const result = await searchRestaurant(payload);
      if (result.isSuccess) {
        const anyNextPage = result.meta?.next?.length > 0 ? true : false;
        const restaurantData = result.data;
        if (state.searchResult.length > 0) {
          commit("pushState", {
            state: "searchResult",
            val: restaurantData,
          });
        } else {
          commit("setState", {
            state: "searchResult",
            val: restaurantData,
          });
        }
        commit("setState", {
          state: "anyNextPage",
          val: anyNextPage,
        });
      }
      return result;
    },
    async getCuisines({ commit }) {
      try {
        const { isSuccess, message, data } = await getCuisineList(1, 100);
        if (isSuccess === true && data.data.length) {
          const remapResponse = data.data.map((cuisine) => {
            return {
              id: cuisine.id,
              name: cuisine.attributes.name,
              selected: false,
            };
          });
          commit("setState", {
            state: "cuisines",
            val: remapResponse,
          });
          return {
            isSuccess: true,
            message: message,
            data: remapResponse,
          };
        } else {
          return {
            isSuccess: false,
            message:
              message ||
              "Oops, something went wrong, failed to get cuisine list",
          };
        }
      } catch (err) {
        if (err.dontReport) {
          return { isSuccess: false, message: null };
        }
        const error = {
          message: "Oops, something went wrong, failed to get cuisine list",
          data: {},
          cause: err,
        };
        rollbar.error(error.message, error);
        return { isSuccess: false, message: error.message };
      }
    },
    async getLocations({ commit }) {
      try {
        const { isSuccess, message, data } = await getLocationList(1, 100);

        if (isSuccess === true && data.data.length) {
          const remapResponse = data.data.map((location) => {
            return {
              id: location.id,
              name: location.attributes.name,
              selected: false,
            };
          });
          commit("setState", {
            state: "locations",
            val: remapResponse,
          });
          return { isSuccess: true, message: message };
        } else {
          return {
            isSuccess: false,
            message:
              message ||
              "Oops, something went wrong, failed to get locations list",
          };
        }
      } catch (err) {
        if (err.dontReport) {
          return { isSuccess: false, message: null };
        }
        const error = {
          message: "Oops, something went wrong, failed to get locations list",
          data: {},
          cause: err,
        };
        rollbar.error(error.message, error);
        return { isSuccess: false, message: error.message };
      }
    },
    async getPromotions({ commit }) {
      const result = await getRestaurantTagGroup({ pageSize: 10 });
      if (result.isSuccess) {
        const remapResult = result.data.map((result) => {
          return {
            ...result,
            selected: false,
          };
        });
        commit("setState", {
          state: "promotions",
          val: remapResult,
        });
      }
      return result;
    },
    async getPackageType({ commit }) {
      const result = await getPackageType();
      if (result.isSuccess) {
        const availablePackageType = result.data.map((packageTypeList) => {
          const { id, type } = packageTypeList;
          const { coverImg } = packageTypeList.attributes;
          return {
            ...packageTypeList.attributes,
            id,
            type,
            coverImg: coverImg.url,
            selected: false,
          };
        });
        commit("setState", {
          state: "availablePackageType",
          val: availablePackageType,
        });
        return;
      }
      return;
    },
    applyFilter({ state, commit }, val) {
      if (
        [
          "cuisine",
          "location",
          "price",
          "promotion",
          "date",
          "packageType",
        ].includes(val) === false
      ) {
        throw new Error("invalid applied filter");
      }
      if (val === "cuisine") {
        commit("setState", {
          state: "selectedCuisines",
          val: state.cuisines
            .filter((cuisine) => cuisine.selected)
            .map((cuisine) => cuisine.id),
        });
      } else if (val === "promotion") {
        commit("setState", {
          state: "selectedPromotions",
          val: state.promotions
            .filter((promotion) => promotion.selected)
            .map((promotion) => promotion.id),
        });
      } else if (val === "location") {
        commit("setState", {
          state: "selectedLocations",
          val: state.locations
            .filter((location) => location.selected)
            .map((location) => location.id),
        });
      } else if (val === "packageType") {
        commit("setState", {
          state: "selectedPackageType",
          val: state.availablePackageType
            .filter((packages) => packages.selected)
            .map((packages) => packages.packageTypeCode),
        });
      }
    },
    resetSelectedCuisine({ commit }) {
      commit("setState", {
        state: "selectedCuisines",
        val: [],
      });
    },
    resetSelectedLocations({ commit }) {
      commit("setState", {
        state: "selectedLocations",
        val: [],
      });
    },
    resetSelectedPromotions({ commit }) {
      commit("setState", {
        state: "selectedPromotions",
        val: [],
      });
    },
    resetSelectedPackageType({ commit }) {
      commit("setState", {
        state: "selectedPackageType",
        val: [],
      });
    },
    resetPrice({ commit }) {
      commit("setState", {
        state: "startPrice",
        val: 0,
      });
      commit("setState", {
        state: "endPrice",
        val: 20000,
      });
    },
    resetSelectedDates({ commit }) {
      commit("setState", {
        state: "selectedDates",
        val: [],
      });
    },
    resetSelectedTime({ commit }) {
      commit("setState", {
        state: "selectedTime",
        val: "",
      });
    },
    resetSeviceType({ commit }) {
      commit("setState", {
        state: "isDineIn",
        val: true,
      });
      commit("setState", {
        state: "isDelivery",
        val: true,
      });
    },
  },
};
