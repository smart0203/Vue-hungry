import { getField, updateField } from "vuex-map-fields";
import axios from "@/lib/myAjax";
import rollbar from "@/lib/rollbar";
import { getProfile, updateProfile } from "@/services/user";
import {
  storageSetAccessTokenExpiredIn,
  storageSetRefreshToken,
  storageSetAccessToken,
  storageGetAccessToken,
  storageRemoveRefreshToken,
  storageRemoveAccessTokenExpiredIn,
  storageRemoveAccessToken,
} from "@/composable/accessToken";
import { removeConfirmPhone } from "@/composable/confirmPhone";
import track from "@/services/userTracking";
import dayjs from "@/lib/dayjs";
import { ERROR_EXPIRED_TOKEN } from "@/lib/constant";
import { rebuildUrl } from "@/helper/urlHelper";

const accessToken = storageGetAccessToken();

export default {
  namespaced: true,
  state: {
    isLoading: false,
    id: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    phoneCode: "+66",
    phoneCodeCountry: "th",
    accessToken: accessToken,
    referralCode: "",
    points: "",
    birthDay: "",
    avatarThumb: "",
    avatarOriginal: "",
    guestBookingIds: [],
    cleverTapObj: "",
    totalSpend: "",
    totalReservation: "",
    loyaltyLevelId: "",
    topLoyaltyLevelId: "",
    progressTotalReservations: 0,
    progressTotalSpend: 0,
    startDateLevel: "",
  },
  getters: {
    getField,
    isUserSignedIn(state) {
      return state.accessToken && state.accessToken.length > 0 ? true : false;
    },
    isUserHavePhone(state) {
      if (
        state.phone &&
        state.phone.length > 0 &&
        state.phoneCode &&
        state.phoneCode.length > 0
      ) {
        return true;
      }
      return false;
    },
    getAccessToken(state) {
      return state.accessToken;
    },
    getState: (state) => (name) => {
      return state[name];
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
      state.name = "";
      state.email = "";
      state.password = "";
      state.phone = "";
      state.phoneCode = "+66";
      state.accessToken = "";
      state.referralCode = "";
    },
  },
  actions: {
    async doSignIn({ state, dispatch }, { email, password }) {
      try {
        state.isLoading = true;
        const baseUrl = process.env.VUE_APP_API_DOMAIN;
        const response = await axios({
          url: `${baseUrl}/oauth/token.json`,
          method: "post",
          data: {
            username: email,
            password: password,
            grantType: "password",
          },
        });
        if (!response) {
          return {
            isSuccess: false,
            message: "",
          };
        }
        if (response.data.success === true) {
          const respData = response.data.data;
          dispatch("setProfile", respData);
          state.isLoading = false;

          return { isSuccess: true };
        } else {
          state.isLoading = false;

          return { isSuccess: false, message: response.data.message };
        }
      } catch (err) {
        if (err.dontReport) {
          return { isSuccess: false, message: null };
        }
        const error = {
          message: "Oops, something went wrong, failed to sign in",
          data: {
            username: state.email,
            password: state.password,
          },
          cause: err,
        };
        rollbar.error(error.message, error);
        return { isSuccess: false, message: error.message };
      }
    },
    async doForgotPasword({ state }) {
      try {
        const response = await axios({
          url: `/passwords/reset.json`,
          method: "POST",
          data: {
            email: state.email,
          },
        });

        if (!response) {
          return {
            isSuccess: false,
            message: "",
          };
        }
        if (response.data.success === true) {
          return { isSuccess: true, message: response.data.message };
        } else {
          return { isSuccess: false, message: response.data.message };
        }
      } catch (err) {
        if (err.dontReport) {
          return { isSuccess: false, message: null };
        }
        const error = {
          message: "Oops, something went wrong, failed to reset password",
          data: {
            email: state.email,
          },
          cause: err,
        };
        rollbar.error(error.message, error);
        return { isSuccess: false, message: error.message };
      }
    },
    async doSignUp(
      { state, rootState },
      {
        name,
        email,
        password,
        phone,
        referralCode,
        phoneCode,
        subscribePromotion,
      }
    ) {
      const url = "/users.json";
      const lang = rootState.lang === "th" ? "th-TH" : "en-EN";
      let payload = {
        language: lang,
        guestBookingIds: state.guestBookingIds,
        name: name,
        password: password,
        email: email,
        phone: phone,
        callingCode: phoneCode,
        rCode: referralCode,
        provider: "hungryhub",
        subscribeMarketingEmail:
          typeof subscribePromotion === "boolean" ? subscribePromotion : false,
      };
      try {
        const response = await axios({
          url,
          method: "post",
          data: payload,
        });
        if (!response) {
          return {
            isSuccess: false,
            message: "",
          };
        }
        if (response.data.success === false) {
          return {
            isSuccess: false,
            message: response.data.message,
          };
        }
        return {
          isSuccess: true,
        };
      } catch (err) {
        if (err.dontReport) {
          return {
            isSuccess: false,
            message: null,
            cause: null,
          };
        }
        const error = {
          message: "Oops, something went wrong, failed to sign up",
          data: payload,
          cause: err,
        };
        rollbar.error(error.message, err, { data: error });

        return {
          isSuccess: false,
          message: error.message,
          cause: error.cause,
        };
      }
    },
    doSignOut({ commit }) {
      removeConfirmPhone();
      storageRemoveAccessToken();
      storageRemoveRefreshToken();
      storageRemoveAccessTokenExpiredIn();
      commit("resetState");
    },
    async updateProfile(
      { state },
      { callingCode, phone, birthDay, lang, name, email, password, avatar }
    ) {
      try {
        let payload = [];
        if (avatar) {
          payload.push({
            key: "avatar",
            val: avatar,
          });
        }
        if (callingCode) {
          payload.push({
            key: "calling_code",
            val: callingCode,
          });
        }
        if (phone) {
          payload.push({
            key: "phone",
            val: phone,
          });
        }
        if (birthDay) {
          payload.push({
            key: "birthday",
            val: birthDay,
          });
        }
        if (lang) {
          payload.push({
            key: "lang",
            val: lang,
          });
        }
        if (name) {
          payload.push({
            key: "name",
            val: name,
          });
        }
        if (email) {
          payload.push({
            key: "new_email",
            val: email,
          });
        }
        if (password) {
          payload.push({
            key: "new_password",
            val: password,
          });
        }
        const response = await updateProfile(state.accessToken, payload);
        if (response.isSuccess === true) {
          return {
            isSuccess: true,
            data: response.data,
            message: response.message,
          };
        }
        return {
          isSuccess: false,
          data: response.data,
          message: response.message,
        };
      } catch (err) {
        rollbar.error(err);
        return {
          isSuccess: false,
          data: null,
          message: err,
        };
      }
    },
    async getProfile({ state, dispatch }) {
      try {
        let response;
        state.isLoading = true;
        response = await getProfile(state.accessToken);
        if (response.isSuccess === true) {
          dispatch("setProfile", response.data);
          state.isLoading = false;
          return {
            isSuccess: true,
          };
        } else {
          state.isLoading = false;
          dispatch("doSignOut");
          return {
            isSuccess: false,
            message: ERROR_EXPIRED_TOKEN,
          };
        }
      } catch (err) {
        dispatch("doSignOut");
        return {
          isSuccess: false,
          message: ERROR_EXPIRED_TOKEN,
        };
      }
    },
    setProfile({ commit }, profile) {
      const {
        id,
        callingCode,
        name,
        email,
        phone,
        birthday,
        countryCallingCode,
        points,
        avatar,
        accessToken,
        clevertapProps,
        rCode,
        loyaltyLevelExpiryDate,
        loyaltyLevelId,
        topLoyaltyLevelId,
        totalSpend,
        totalReservations,
        progressTotalReservations,
        progressTotalSpend,
        expiresIn,
        refreshToken,
        startDateLevel,
      } = profile;
      const parsedCallingCode =
        typeof callingCode === "string" && callingCode.length > 0
          ? callingCode.includes("+") === true
            ? callingCode
            : `+${callingCode}`
          : "";
      const commits = [
        { state: "id", val: id },
        { state: "name", val: name },
        { state: "email", val: email },
        { state: "phone", val: phone },
        { state: "birthDay", val: birthday },
        { state: "phoneCode", val: parsedCallingCode },
        { state: "phoneCodeCountry", val: countryCallingCode },
        { state: "points", val: points },
        {
          state: "avatarThumb",
          val: rebuildUrl(avatar.original, "asset") || "",
        },
        {
          state: "avatarOriginal",
          val: rebuildUrl(avatar.original, "asset") || "",
        },
        { state: "accessToken", val: accessToken },
        { state: "cleverTapObj", val: clevertapProps },
        { state: "referralCode", val: rCode },
        {
          state: "loyaltyLevelExpiryDate",
          val:
            typeof loyaltyLevelExpiryDate === "string" &&
            loyaltyLevelExpiryDate.length
              ? dayjs(loyaltyLevelExpiryDate).format("DD/MM/YYYY")
              : "",
        },
        {
          state: "startDateLevel",
          val:
            typeof startDateLevel === "string" && startDateLevel.length
              ? dayjs(startDateLevel).format("DD/MM/YYYY")
              : "",
        },
        { state: "loyaltyLevelId", val: loyaltyLevelId },
        { state: "topLoyaltyLevelId", val: topLoyaltyLevelId },
        { state: "totalSpend", val: totalSpend },
        { state: "totalReservation", val: totalReservations },
        {
          state: "progressTotalReservations",
          val:
            typeof progressTotalReservations === "number"
              ? progressTotalReservations
              : 0,
        },
        {
          state: "progressTotalSpend",
          val: typeof progressTotalSpend === "number" ? progressTotalSpend : 0,
        },
      ];

      commits.forEach((item) => {
        commit("setState", {
          state: item.state,
          val: item.val,
        });
      });
      // set token to browser storage
      storageSetAccessToken(accessToken);
      storageSetAccessTokenExpiredIn(expiresIn);
      storageSetRefreshToken(refreshToken);
      // configure rollbar person tracking
      rollbar.configure({
        payload: {
          person: {
            id: id,
            name: name,
            email: email,
            phone: phone,
          },
        },
      });
    },
    sendClevertapObject({ state }, eventName) {
      if (eventName !== "USER_SIGNED_IN" && eventName !== "USER_SIGNED_UP") {
        rollbar.error("Invalid event name", { eventName });
        return;
      }
      const {
        identity,
        name,
        phone,
        email,
        credits,
        photo,
        cancelReservationsCount,
        allReservationsCount,
        activeReservationsCount,
        noShowReservationsCount,
        age,
        language,
        subscribeMarketingEmail,
      } = state.cleverTapObj;

      function splitName(paramName = "") {
        let firstName = "";
        let lastName = "";
        try {
          if (typeof paramName !== "string") {
            return {
              firstName,
              lastName,
            };
          }
          if (paramName.length) {
            const split = paramName.trim().split(" ");
            firstName = split[0];
            if (split.length > 1) {
              split.forEach((nameFragment, index) => {
                if (index > 0) {
                  lastName = lastName.length
                    ? `${lastName} ${nameFragment}`
                    : nameFragment;
                }
              });
            } else {
              lastName = firstName;
            }
          }
          return {
            firstName,
            lastName,
          };
        } catch (err) {
          return {
            firstName,
            lastName,
          };
        }
      }

      const { firstName, lastName } = splitName(name);

      track(eventName, {
        userID: identity,
        userName: name,
        userPhone: phone,
        userEmail: email,
        userCredits: credits,
        userPhoto: photo,
        userReservationCancel: cancelReservationsCount,
        userReservationAll: allReservationsCount,
        userReservationActive: activeReservationsCount,
        userReservationNoShow: noShowReservationsCount,
        userAge: age,
        userLang: language,
        userFirstName: firstName,
        userLastName: lastName,
        trackClevertap:
          typeof subscribeMarketingEmail === "boolean"
            ? subscribeMarketingEmail
            : true,
      });
    },
  },
};
