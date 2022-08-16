import { getField, updateField } from "vuex-map-fields";
// import dayjs from "@/lib/dayjs";
import { axios, axiosCancel } from "@/lib/myAjax.js";
import rollbar from "@/lib/rollbar";
import { stripHtmlTag } from "@/helper/stringHelper";
import { rebuildUrl } from "@/helper/urlHelper";
import { packageTypeOrder } from "@/helper/PackageHelper";
import { getYoutubeId } from "@/helper/restaurantHelper";
// import { isBudhistYear } from "@/helper/dateTimeHelper";
import { storageGetAccessToken } from "@/composable/accessToken";
import isString from "lodash-es/isString";
import toUpper from "lodash-es/toUpper";
import checkOrderNowSupport from "@/services/checkOrderNowSupport";

let axiosCancelInstance;
const accessToken = storageGetAccessToken();
const initialState = {
  keepState: false, // to keep state value not being reseted after some component calling 'resetAllState'
  restaurantId: "",
  restaurantName: "",
  restaurantData: {},
  restaurantMetaTitle: "",
  restaurantMetaDescription: "",
  restaurantMetaKeywords: "",
  restaurantCanonicalLink: "",
  restaurantSeo: "",
  restaurantYoutubeId: "",
  restaurantPictures: [],
  restaurantActiveTab: "about",
  availablePackageTypes: [],
  isSupportOrderNow: false,
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
    restaurantLatLng(state) {
      return {
        restaurantLat: state.restaurantData.lat,
        restaurantLng: state.restaurantData.lng,
      };
    },
    restaurantRecordGuest(state) {
      return state.restaurantData.recordGuests;
    },
    isRestaurantExpired(state) {
      return state.restaurantData.allowBooking === false ? true : false;
    },
    isRestaurantPromotedOnly(state) {
      return state.restaurantData.promotedByHh === false ? true : false;
    },
    isRestaurantAcceptVoucher(state) {
      return state.restaurantData.acceptVoucher || false;
    },
    isNewRestaurant(state) {
      return state.restaurantData.reviewsCount < 5 ? true : false;
    },
    isActiveRestaurant(state) {
      return state.restaurantData.availability === "in stock" ? true : false;
    },
    isFreeReservationSystem(state) {
      return state.restaurantData.reservationSystemOnly;
    },
    isRestaurantHaveEnoughtCovidRating(state) {
      const covidRating = state.restaurantData.covid19Rating;
      const overallCleanliness = covidRating?.overallCleanliness
        ? parseFloat(covidRating.overallCleanliness)
        : 0;
      const socialDistancing = covidRating?.socialDistancing
        ? parseFloat(covidRating.socialDistancing)
        : 0;
      const staffProtection = covidRating?.staffProtection
        ? parseFloat(covidRating.staffProtection)
        : 0;
      return (
        overallCleanliness >= 4.5 &&
        socialDistancing >= 4.5 &&
        staffProtection >= 4.5
      );
    },
    restaurantNameEn(state) {
      return state.restaurantData.names.en || state.restaurantName;
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
    resetAllState(state) {
      if (state.keepState) {
        return;
      }
      let newState = {
        ...initialState,
      };
      Object.assign(state, newState);
    },
    setAvailablePackageTypes(state, payload) {
      if (!payload) {
        throw new Error("failed set available package type of restaurant");
      }
      state.availablePackageTypes = packageTypeOrder(payload);
    },
  },
  actions: {
    async getRestaurantData({ commit, dispatch }, restaurantName) {
      try {
        axiosCancelInstance = axiosCancel();
        const removeQuestionMark = restaurantName.split("?");
        const removeDotMark = removeQuestionMark[0].split(".");
        const restaurantSlug = removeDotMark[0];
        const url = `/restaurants/${restaurantSlug}/slug.json`;
        const method = "get";
        const params = {
          include_packages: false,
          include_pictures: true,
          preview_mode: false,
          minor_version: 3,
          accessToken,
        };
        const result = await axios({
          method,
          url,
          params,
          cancelToken: axiosCancelInstance.token,
        });

        if (!result) {
          return {
            isSuccess: false,
            message: "Sorry, something went wrong",
          };
        }

        const response = result.data;
        if (response.success) {
          const data = response.data;
          const meta = response.meta;
          const { attributes } = data;
          attributes.restaurantSlug = restaurantSlug;
          let restaurantPictures = [];
          if (response.included) {
            response.included.forEach((included) => {
              if (included.type === "restaurants-pictures") {
                restaurantPictures.push({
                  id: included.id,
                  caption: included.attributes.caption,
                  image: included.attributes.item.url,
                });
              }
            });
          }

          if (attributes.promotedByHh === true) {
            dispatch("setRestaurantSeo", {
              id: data.id,
              attributes: attributes,
            });
          }

          const commitArray = [
            { state: "restaurantId", val: data.id },
            { state: "restaurantName", val: attributes.name },
            { state: "restaurantData", val: attributes },
            { state: "restaurantPictures", val: restaurantPictures },
            { state: "restaurantCanonicalLink", val: attributes.canonicalLink },
            {
              state: "restaurantYoutubeId",
              val: getYoutubeId(attributes.videos),
            },
          ];
          commitArray.forEach((item) => {
            commit("setState", {
              state: item.state,
              val: item.val,
            });
          });
          // review
          const reviewData = [
            {
              state: "reviewTotalScore",
              val: meta.reviews.average,
            },
            {
              state: "reviewTotalCount",
              val: meta.reviews.total,
            },
            {
              state: "reviewStarsCount",
              val: [
                meta.reviews.starsCount.five || 0,
                meta.reviews.starsCount.four || 0,
                meta.reviews.starsCount.three || 0,
                meta.reviews.starsCount.two || 0,
                meta.reviews.starsCount.one || 0,
              ],
            },
          ];
          reviewData.forEach((item) => {
            commit(
              "restaurantReview/setState",
              {
                state: item.state,
                val: item.val,
              },
              { root: true }
            );
          });
          return {
            isSuccess: true,
            message: false,
          };
        } else {
          // restaurant not found
          if (response.message === "Data not found") {
            window.location = `/restaurants/search`;
          }
          // other error
          else {
            const error = {
              isSuccess: false,
              message:
                response.message ||
                "Oops, something went wrong, failed get restaurant data",
              cause: response,
            };
            rollbar.error("unknown error", response, result);
            return error;
          }
        }
      } catch (err) {
        if (err.dontReport) {
          return {
            isSuccess: false,
            message: null,
            cause: null,
          };
        } else if (err.message && err.message === "canceled by user") {
          return {
            isSuccess: undefined,
            message: null,
            cause: null,
          };
        }
        let error;
        error = {
          isSuccess: false,
          message: "Oops, something went wrong, failed get restaurant data",
          cause: err,
        };
        rollbar.error(err);
        return error;
      }
    },
    async checkRestaurantOrderNowSupport({ state, commit }) {
      try {
        const orderNowSupportRequest = await checkOrderNowSupport(
          state.restaurantId
        );
        const isRestaurantSupportOrderNow = orderNowSupportRequest.isSuccess
          ? orderNowSupportRequest.data.isSupport
          : false;
        commit("setState", {
          state: "isSupportOrderNow",
          val: isRestaurantSupportOrderNow,
        });
        return {
          isSuccess: true,
          message: "",
          data: [],
        };
      } catch (err) {
        rollbar.error(
          "Oops, something went wrong, failed check restaurant is support order now",
          err,
          { restaurantId: state.restaurantId }
        );
        return {
          isSuccess: false,
          message:
            "Oops, something went wrong, failed check restaurant is support order now",
          data: [],
        };
      }
    },
    cancelGetRestaurantData() {
      axiosCancelInstance.cancel("canceled by user");
    },
    async getRestaurantJsonLd({ state }) {
      try {
        const result = await axios({
          method: "get",
          url: `/restaurants/${state.restaurantId}/json_ld.json`,
        });

        if (!result) {
          return {
            isSuccess: false,
            message: "",
          };
        }
        const response = result.data;
        if (response.success) {
          return {
            isSuccess: true,
            message: "",
            data: response.data,
          };
        }
        return {
          isSuccess: false,
          message: result.message,
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
          isSuccess: false,
          message: "Oops, something went wrong, failed get restaurant jsonld",
          cause: err,
        };
        rollbar.error(err);
        return error;
      }
    },
    async getRestaurantBigGroupPackage({ state, dispatch }) {
      try {
        const url = "/restaurant_packages/check_availability.json";
        const result = await axios({
          method: "get",
          url,
          params: {
            restaurantId: state.restaurantId,
            bigGroup: true,
            forDineIn: true,
            forDelivery: false,
          },
        });

        if (!result) {
          return {
            isSuccess: false,
            message: "",
          };
        }

        const response = result.data;
        if (response.success) {
          const bigGroupPackages = response.data;
          await dispatch(
            "bookingPackage/setupBigGroupPackage",
            bigGroupPackages,
            {
              root: true,
            }
          );
          return {
            isSuccess: true,
            message: "",
          };
        }
        return {
          isSuccess: false,
          message: result.message,
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
          isSuccess: false,
          message: "Oops, something went wrong, failed get big group packages",
          cause: err,
        };
        rollbar.error(err);
        return error;
      }
    },
    setRestaurantSeo({ commit, rootState }, { id, attributes }) {
      const title = attributes.seo.title || attributes.name;
      const description = attributes.seo.description || attributes.description;
      const sanitizeDescription = isString(description)
        ? stripHtmlTag(description)
        : "";
      const restaurantSeo = {
        title: title,
        meta: [
          {
            vmid: "description",
            name: "description",
            content: sanitizeDescription,
          },
          { name: "keywords", content: attributes.seo.keywords },

          {
            property: "product:retailer_item_id",
            content: id,
          },
          {
            property: "product:availability",
            content: attributes.availability,
          },
          {
            property: "product:condition",
            content: "new",
          },
          {
            property: "product:price:amount",
            content: parseInt(attributes.pricePerPerson.amount, 10),
          },
          {
            property: "product:price:currency",
            content: attributes.pricePerPerson.currency,
          },
          {
            property: "product:category",
            content: "Business &amp; Industrial &gt; Food Service",
          },
          { property: "product:is_product_shareable", content: "true" },
          { property: "og:description", content: sanitizeDescription },
          {
            property: "og:url",
            content: rebuildUrl(attributes.canonicalLink, "link"),
          },
          { property: "og:title", content: attributes.name },
          { property: "og:type", content: "product" },
          {
            property: "og:locale",
            content: `${rootState.lang}_${toUpper(rootState.lang)}`,
          },
          {
            property: "og:locale:locale",
            content: "th_TH",
          },
          {
            property: "og:locale:locale",
            content: "en_US",
          },
          {
            property: "og:image",
            content: rebuildUrl(attributes.imageCoverUrl.large, "asset"),
          },
          {
            property: "twitter:card",
            content: "summary_large_image",
          },
          {
            property: "twitter:image",
            content: rebuildUrl(attributes.imageCoverUrl.large, "asset"),
          },
          {
            property: "twitter:description",
            content: sanitizeDescription,
          },
          {
            name: "apple-itunes-app",
            content: `app-id=879303325, app-argument=https://www.hungryhub.com/restaurants/${id}`,
          },
        ],
        link: [
          {
            rel: "canonical",
            href: rebuildUrl(attributes.canonicalLink, "link"),
          },
          {
            rel: "alternate",
            href: rebuildUrl(attributes.link, "link"),
          },
          {
            rel: "image_src",
            href: rebuildUrl(attributes.imageCoverUrl.large, "asset"),
          },
        ],
      };

      commit("setState", {
        state: "restaurantSeo",
        val: restaurantSeo,
      });
    },
  },
};
