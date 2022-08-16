import Vue from "vue";
import Vuex from "vuex";
import booking from "./booking";
import user from "./user";
import webConfig from "./webConfig";
import { storageSetLanguage } from "@/lib/localStorage";
import { loadENLocale } from "@/lib/i18n/i18n.js";
import { getField, updateField } from "vuex-map-fields";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    lang: "th",
    baseUrl: process.env.VUE_APP_API_DOMAIN,
    isIntegrationTesting:
      process.env.VUE_APP_IS_INTEGRATION_TESTING == "true" ? true : false,
    isGoogleMapsScriptLoaded: false,
  },
  getters: {
    getField,
    getState: (state) => (name) => {
      return state[name];
    },
    baseUrlWithLang(state) {
      return `${state.baseUrl}/${state.lang}`;
    },
    isDontAllowTracking() {
      return window.location.search.includes("notracking=true");
    },
  },
  mutations: {
    updateField,
    changeLang(state, lang) {
      state.lang = lang;
      storageSetLanguage(lang);
    },
    setState(state, payload) {
      state[payload.state] = payload.val;
    },
  },
  actions: {
    async loadEnLocale() {
      const loadENLang = await loadENLocale();
      return loadENLang;
    },
    changeLang({ rootGetters, commit }, lang) {
      const { adult, kids, date, packageName, time } =
        rootGetters["booking/bookingSummary"];
      if (
        adult == 0 &&
        kids == 0 &&
        date == "" &&
        packageName == "" &&
        time == ""
      ) {
        commit("changeLang", lang);

        return true;
      }
      if (
        window.confirm(
          "Are you sure want to change language now ? its will reset your booking back to the first step."
        )
      ) {
        commit("changeLang", lang);
        return true;
      } else {
        return false;
      }
    },
  },
  modules: {
    webConfig,
    user,
    booking,
  },
});
export default store;
