import getConfig from "@/services/getConfig";
import { getField, updateField } from "vuex-map-fields";
import { SUPPORTED_PACKAGE_TYPE, PAYMENT_PROVIDER_OMISE } from "@/lib/constant";
import isEmpty from "lodash-es/isEmpty";
import * as alert from "@/lib/alert";
import { config as useConfig } from "@/composable/webConfig";
import { isDesktop } from "@/helper/screenSizeHelper";

export default {
  namespaced: true,
  state: {
    config: {},
    allowSearchByCity: false,
    openLoginModal: false,
    subscribeMarketingReward: "฿100",
  },
  getters: {
    getField,
    paymentProvider(state) {
      if (state.config.selectedPaymentProvider) {
        return (
          state.config.selectedPaymentProvider.cc || PAYMENT_PROVIDER_OMISE
        );
      }
      return "";
    },
    availableCities(state) {
      return (
        state.config?.cities || [
          {
            id: 1,
            name: "Bangkok",
          },
        ]
      );
    },
    packageList(state) {
      if (!isEmpty(state.config)) {
        const packageListObj = state.config.packageList;
        // convert object of package list from server to array
        let array = [];
        for (const prop in packageListObj) {
          // only push package type that supported in web app
          if (SUPPORTED_PACKAGE_TYPE.includes(prop)) {
            array.push({
              key: prop,
              val: packageListObj[prop],
            });
          }
        }
        return array;
      }
      return [];
    },
    referrerRewardPoint(state) {
      return state.config?.dynamicPoints?.referrerRewardPoint || 0;
    },
    earlyReviewPoint(state) {
      return state.config?.dynamicPoints?.earlyBird?.point || 0;
    },
    earlyMaxReview(state) {
      return state.config?.dynamicPoints?.earlyBird?.maxReviews || 0;
    },
    isUsingAsyncBooking(state) {
      return state.config?.useAsyncBooking || false;
    },
    qrPaymentCountDown(state) {
      return state.config?.promptpayCountdown / 60 || 5;
    },
    voucherBanner(state) {
      return isDesktop
        ? state.config?.bannerVoucherUrl
        : state.config?.mobileBannerVoucherUrl;
    },
    voucherFeataureIsEnable(state) {
      return state.config?.enableGiftCardFeature || false;
    },
  },
  mutations: {
    updateField,
  },
  actions: {
    async getConfig({ state }) {
      const result = await getConfig();
      if (result.isSuccess) {
        state.config = { ...state.config, ...result.data };
        useConfig.value = state.config;
        return;
      }
      if (result.message) {
        alert.error(result.message);
      }
    },
    toggleClevertapPopup(ctx, isShow = false) {
      const clevertapSelector = "#wizParDiv2";
      const el = document.querySelector(clevertapSelector);
      if (el) {
        el.style.display = isShow ? "block" : "none";
      }
    },
    toggleLoginModal({ state }, isShow) {
      if (typeof isShow !== "boolean") {
        throw new Error("Failed toggleLoginModal, invalid 'isShow' value");
      }
      state.openLoginModal = isShow;
    },
  },
};
