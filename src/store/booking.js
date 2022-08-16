import { getField, updateField } from "vuex-map-fields";
import { getDistanceToRestaurant } from "@/lib/googleMapPlaceParser.js";
import getLalamoveDistance from "@/services/getLalamoveDistance.js";
import dayjs from "@/lib/dayjs";
import * as alert from "@/lib/alert";
import router from "../router/router";
import Booking from "@/lib/booking/booking";
import axios from "@/lib/myAjax";
import rollbar from "@/lib/rollbar";
import { packagePrice } from "@/helper/PackageHelper";
import moneyFormat from "@/lib/money";
import { removeLeadingZero } from "@/helper/phoneNumber";
import {
  PACKAGE_PREFERENCE_DINE_IN,
  PACKAGE_PREFERENCE_DELIVERY_PICK_UP,
  PACKAGE_PREFERENCE_XPERIENCE,
  PACKAGE_CODE_HAH,
  BOOKING_FLOW_PREFERENCE_DATE_FIRST,
  PAYMENT_CREDIT_CARD,
} from "@/lib/constant";
import {
  storageSetUserProfile,
  storageSetUserLocation,
} from "@/lib/localStorage";
import {
  isValid as isValidCorporateEvent,
  eventData as corporateEventData,
} from "@/composable/corporateEvent";
import { i18n } from "@/lib/i18n/i18n";
import { state as voucherState } from "@/composable/voucher";
import { methods as QRPaymentCheckingMethods } from "@/composable/realtimeQRPaymentChecking";
import { getFromUserStorage } from "@/helper/userStorage";
import { createBookingLocking } from "@/services/bookingLocking";

const { onReservationExpired } = QRPaymentCheckingMethods;
const { voucherApplied } = voucherState;

const initialState = {
  keepState: false,
  isMobileBooking: true,
  showTrueWalletPayment: false,
  packagePreference: "", // possible value : dine in package / delivery/pick up package / xperience package or combination like 'dine in package/xperience package'
  step: 1,
  adult: 0,
  kids: 0,
  isBigGroup: false,
  bigGroupMinSize: 0,
  bookingMethod: "", // possible value: dine in / pick up / delivery
  paymentMethod: "", // possible value: card / promptpay / true_wallet  for package that require cc or '' if not require cc
  specialRequest: "",
  selectedDate: "",
  selectedTime: "",
  distanceToRestaurant: 0,
  location: {
    placeName: "",
    detail: "",
    lat: "",
    lng: "",
    noteForDriver: "",
  },
  occasion: "",
  occasionList: [],
  recordGuest: [],
  creditCard: {
    name: "",
    number: "",
    expMonthYear: "",
    securityCode: "",
    logo: "",
  },
  acceptWeTravelTogether: false,
  temporaryBookingId: "",
  bookingExpiryDate: "",
};

export default {
  namespaced: true,
  state: { ...initialState },
  getters: {
    getField,
    getState: (state) => (name) => {
      return state[name];
    },
    totalPax(state) {
      return state.adult + state.kids;
    },
    isFlowSelectDateFirst(state, getters) {
      // HAH package must using select date first flow
      if (!getters.isDineIn) {
        return true;
      }
      return getters.flowPreference === BOOKING_FLOW_PREFERENCE_DATE_FIRST;
    },
    isDineIn(state, getters, rootState, rootGetters) {
      const selectedPackageType =
        rootGetters["bookingPackage/getSelectedPackageType"];

      if (selectedPackageType === undefined && state.packagePreference === "") {
        return undefined;
      } else if (
        selectedPackageType === PACKAGE_CODE_HAH ||
        state.packagePreference.includes(PACKAGE_PREFERENCE_DELIVERY_PICK_UP)
      ) {
        return false;
      }
      return true;
    },
    isUserPickedLocation(state) {
      if (state.location.lat !== "" && state.location.lng !== "") {
        return true;
      }
      return false;
    },
    pickedLocationName(state) {
      const placeName = state.location.placeName;
      const placeDetail = state.location.detail;
      if (
        typeof placeName === "string" &&
        placeName.length &&
        typeof placeDetail === "string" &&
        placeDetail.length
      ) {
        return `${placeName}, ${placeDetail}`;
      }
      return "";
    },
    packageFilter(state, getters, rootState, rootGetters) {
      const anySelectedPackage =
        rootGetters["bookingPackage/anySelectedPackages"];
      if (anySelectedPackage) {
        const isDineInPackage =
          rootGetters["bookingPackage/isSelectedPackageDineIn"];
        return isDineInPackage
          ? PACKAGE_PREFERENCE_DINE_IN
          : PACKAGE_PREFERENCE_DELIVERY_PICK_UP;
      }
      return "";
    },
    bookingSummary(state, getters, rootState, rootGetters) {
      try {
        let packageName = "";
        const isAnySelectedPackages =
          rootGetters["bookingPackage/anySelectedPackages"];

        if (isAnySelectedPackages) {
          packageName = rootGetters["bookingPackage/getSelectedPackage"]
            .map((packages) => {
              const parsedPrice = packagePrice(
                { adult: state.adult, kids: state.kids },
                packages.rules,
                packages.quantity
              );
              const price = moneyFormat(parsedPrice.adult + parsedPrice.kids);

              if (packages.isAcceptManyQuantity) {
                return `${packages.name} X ${packages.quantity} (${price})`;
              }
              return `${packages.name} ${price}`;
            })
            .join(", ");
        }
        const selectedDate = state.selectedDate
          ? dayjs(state.selectedDate).format("ddd D MMM")
          : "";

        const selectedTime = getters.canSkipSelectTime
          ? null
          : state.selectedTime;
        return {
          adult: state.adult,
          kids: state.kids,
          date: selectedDate,
          time: selectedTime,
          packageName: packageName,
        };
      } catch (err) {
        rollbar.error(err);
        return "";
      }
    },
    bookingSummaryText(state, getters) {
      const adult = `${i18n.tc("numberOfAdult", getters.bookingSummary.adult, {
        adult: getters.bookingSummary.adult,
      })}`;
      const kids = `${
        getters.bookingSummary.kids > 0
          ? ` ${i18n.tc("numberOfKids", getters.bookingSummary.kids, {
              kids: getters.bookingSummary.kids,
            })}`
          : ""
      }
          `;
      const packageName = `${
        getters.bookingSummary.packageName
          ? ` | ${getters.bookingSummary.packageName}`
          : ""
      }`;

      const date = getters.bookingSummary.date
        ? ` | ${getters.bookingSummary.date}`
        : "";
      const time = getters.bookingSummary.time
        ? `${i18n.t("at")} ${getters.bookingSummary.time}`
        : "";
      return ` ${adult} ${kids} ${packageName} ${date} ${time}`;
    },
    isAllCcFieldValid(state) {
      if (
        state.creditCard.name.length > 0 &&
        state.creditCard.number.length > 0 &&
        state.creditCard.expMonthYear.length > 0 &&
        state.creditCard.securityCode.length > 0
      ) {
        return true;
      }
      return false;
    },
    canSkipSelectTime(state, getters, rootState, rootGetters) {
      const selectedPackage = rootGetters["bookingPackage/getSelectedPackage"];

      if (selectedPackage && selectedPackage.length > 0) {
        const filterXperiencePackage = selectedPackage.filter(
          (pack) => pack.typeCode === "xp" && pack.skipTimeSelection === true
        );
        return filterXperiencePackage.length > 0 ? true : false;
      }
      return undefined;
    },
    flowPreference(state, getters, rootState) {
      return typeof rootState.restaurant.restaurantData.bookingFlow === "string"
        ? rootState.restaurant.restaurantData.bookingFlow
        : BOOKING_FLOW_PREFERENCE_DATE_FIRST;
    },
  },
  mutations: {
    updateField,
    setState(state, payload) {
      if (state[payload.state] === undefined) {
        throw new Error(`State with name ${payload.state} not found`);
      }
      state[payload.state] = payload.val;
    },
    setStateAttribute(state, { name, attribute, val }) {
      state[name][attribute] = val;
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
      // some state do not need to reset
      newState.isMobileBooking = state.isMobileBooking;
      newState.location = state.location;
      newState.showTrueWalletPayment = state.showTrueWalletPayment;
      newState.distanceToRestaurant = state.distanceToRestaurant;
      newState.packagePreference = state.packagePreference;
      Object.assign(state, newState);
    },
  },
  actions: {
    generateNewStepRoute(ctx, step) {
      let newStep;
      if (step === "next") {
        newStep = ctx.state.step + 1;
      } else if (step === "back") {
        newStep = ctx.state.step - 1;
      } else {
        newStep = step;
      }
      const newRoute = ctx.state.isMobileBooking
        ? { name: `booking-page-step-${newStep}` }
        : { name: `sidebar-booking-step-${newStep}` };

      return { newStep, newRoute };
    },
    navigateToNewStep(ctx, { route, navigateMethod }) {
      const isTrueMoney = ctx.state.showTrueWalletPayment;
      if (isTrueMoney) {
        route.query = {
          utm_source: "truemoney",
        };
      }
      if (navigateMethod === "replace") {
        return router.replace(route);
      }
      return router.push(route);
    },
    async changeStep(ctx, step) {
      const { newStep, newRoute } = await ctx.dispatch(
        "generateNewStepRoute",
        step
      );
      ctx
        .dispatch("navigateToNewStep", {
          route: newRoute,
          navigateMethod: "push",
        })
        .then(() => {
          ctx.commit("setState", {
            state: "step",
            val: newStep,
          });
        });
    },
    decideBookingMethod(ctx) {
      const selectedPackageType =
        ctx.rootGetters["bookingPackage/getSelectedPackageType"];
      if (selectedPackageType === "hah") {
        ctx.commit("setState", {
          state: "bookingMethod",
          val: "delivery/pick up",
        });
      } else {
        ctx.commit("setState", {
          state: "bookingMethod",
          val: "dine in",
        });
      }
    },
    decidePackagePreference(ctx) {
      const selectedPackageType =
        ctx.rootGetters["bookingPackage/getSelectedPackageType"];
      let packagePrefrence = "";
      if (selectedPackageType === "hah") {
        packagePrefrence = PACKAGE_PREFERENCE_DELIVERY_PICK_UP;
      } else if (selectedPackageType === "xp") {
        packagePrefrence = PACKAGE_PREFERENCE_XPERIENCE;
      } else {
        packagePrefrence = PACKAGE_PREFERENCE_DINE_IN;
      }

      ctx.commit("setState", {
        state: "packagePreference",
        val: packagePrefrence,
      });
    },
    setUserLocation(ctx, location) {
      ctx.commit("setStateAttribute", {
        name: "location",
        attribute: "lat",
        val: location.lat,
      });
      ctx.commit("setStateAttribute", {
        name: "location",
        attribute: "lng",
        val: location.lng,
      });
      ctx.commit("setStateAttribute", {
        name: "location",
        attribute: "placeName",
        val: location.placeName,
      });
      ctx.commit("setStateAttribute", {
        name: "location",
        attribute: "detail",
        val: location.detail,
      });
      ctx.commit("setStateAttribute", {
        name: "location",
        attribute: "noteForDriver",
        val: location.noteForDriver,
      });
      storageSetUserLocation(location);
    },
    fetchDistanceToRestaurant(ctx) {
      return new Promise((resolve, reject) => {
        try {
          const { restaurantLat, restaurantLng } =
            ctx.rootGetters["restaurant/restaurantLatLng"];
          const payload = {
            restaurantLocation: {
              lat: restaurantLat,
              lng: restaurantLng,
            },
            currentLocation: {
              lat: ctx.state.location.lat,
              lng: ctx.state.location.lng,
            },
          };

          getDistanceToRestaurant(payload)
            .then((distance) => {
              // set distance value to KM
              distance.value = distance.value / 1000;
              ctx.commit("setState", {
                state: "distanceToRestaurant",
                val: distance,
              });
              resolve();
            })
            .catch((err) => {
              reject(err);
            });
        } catch (err) {
          reject(err);
        }
      });
    },
    async fetchLalamoveDistance(ctx) {
      const { lng, lat } = ctx.state.location;
      await getLalamoveDistance(ctx.rootState.restaurant.restaurantId, lng, lat)
        .then((res) => {
          let text = "";
          if (res.success) {
            if (res.data.distance === res.data.minDistance) {
              text = `< ${res.data.minDistance}`;
            } else {
              text = `${res.data.distance}`;
            }
          } else {
            text = res.message;
          }
          const distance = {
            success: res.success,
            text: text,
            value: res.data.distance,
          };
          ctx.commit("setState", {
            state: "distanceToRestaurant",
            val: distance,
          });
          return true;
        })
        .catch((err) => {
          if (err.message) {
            rollbar.error(err, {
              restaurantId: ctx.rootState.restaurant,
              lat: lat,
              lng: lng,
              message: err.message,
            });
          }
          return false;
        });
    },
    fetchSpecialOccasionList(ctx) {
      return new Promise((resolve, reject) => {
        axios({
          url: "/dining_occasions.json",
          mehtod: "get",
        })
          .then((resp) => {
            ctx.commit("setState", {
              state: "occasionList",
              val: resp.data.data,
            });
            resolve();
          })
          .catch((err) => {
            if (err.dontReport) {
              reject(null);
            } else {
              reject(err);
            }
          });
      });
    },
    resetAllState(ctx) {
      ctx.commit("resetAllState");
    },
    async doBooking({ rootState, state, rootGetters, dispatch }) {
      if (!rootGetters["user/isUserSignedIn"]) {
        const phone = rootState.user.phone;
        const profile = {
          id: rootState.user.id,
          name: rootState.user.name,
          email: rootState.user.email,
          phone: phone,
          phoneCode: rootState.user.phoneCode,
          avatar: rootState.avatarThumb,
        };
        storageSetUserProfile(profile);
      }

      if (!dayjs(state.selectedDate).isValid()) {
        rollbar.error("User select invalid date", { date: state.selectedDate });
        return {
          isSuccess: false,
          message: "Invalid date, please choose another date",
        };
      }

      onReservationExpired();

      return await dispatch("createBooking");
    },
    async createBooking({
      state,
      getters,
      rootState,
      commit,
      rootGetters,
      dispatch,
    }) {
      try {
        const selectedPackage =
          rootGetters["bookingPackage/getSelectedPackage"][0];
        const adult = () => {
          // force set adult to 1 if hah package
          if (selectedPackage.typeCode === "hah") {
            commit("setState", {
              state: "adult",
              val: 1,
            });
          }
          return state.adult;
        };
        const kids = state.kids;
        const specialRequest = state.specialRequest;
        const selectedDate = state.selectedDate;
        const selectedTime = getters.canSkipSelectTime
          ? selectedPackage.defaultStartTime
          : state.selectedTime;
        const restaurantId = rootState.restaurant.restaurantId;
        const selectedPackages = await dispatch(
          "bookingPackage/buildPackagePayload",
          {},
          { root: true }
        );
        const voucherCode = voucherApplied.value.map(
          (voucher) => voucher.voucherCode
        );
        const isBigGroup = state.isBigGroup;
        const temporaryBookingId = state.temporaryBookingId;
        const isRestaurantRecordGuest =
          rootGetters["restaurant/restaurantRecordGuest"];
        const bookingMethod = state.bookingMethod;
        const isBookingFromFB = () => {
          const fbc = getFromUserStorage("_fbc");
          const fbp = getFromUserStorage("_fbp");
          if (fbp && fbp.length && fbc && fbc.length) {
            return {
              fbc,
              fbp,
            };
          }
          return false;
        };
        const bookingMethodData = () => {
          if (bookingMethod === "dine in") {
            return state.occasion;
          } else if (bookingMethod === "delivery") {
            return {
              address: {
                name: "default",
                detail: `${state.location.placeName} ${state.location.detail}`,
                placeName: state.location.placeName,
                lat: state.location.lat,
                lon: state.location.lng,
                noteForDriver: state.location.noteForDriver,
              },
              distanceToRestaurant: state.distanceToRestaurant.value,
            };
          }
          return "";
        };
        const paymentMethod = () => {
          return state.paymentMethod;
        };
        const cardObject = state.creditCard;
        const isUserSignedIn = rootGetters["user/isUserSignedIn"];
        const credential = () => {
          if (isUserSignedIn) {
            return rootGetters["user/getAccessToken"];
          }
          const phone = removeLeadingZero(
            rootGetters["user/getState"]("phone")
          );
          const phoneCode = rootGetters["user/getState"]("phoneCode");
          return {
            name: rootGetters["user/getState"]("name"),
            email: rootGetters["user/getState"]("email"),
            phone: `${phoneCode}${phone}`,
          };
        };

        const creditCardProvider = rootGetters["webConfig/paymentProvider"];

        const addGbPrimePayAuthKey = () => {
          if (creditCardProvider !== "omise") {
            return (
              rootState.restaurant.restaurantData.gbPrimepayPublicKey ||
              rootState.webConfig.config.gbPrimepayPublicKey
            );
          }
          return "";
        };

        const isChargeFree = rootGetters["bookingCharge/isChargeFree"];

        const booking = new Booking(
          adult(),
          kids,
          specialRequest,
          selectedDate,
          selectedTime,
          selectedPackages,
          restaurantId,
          voucherCode,
          isBigGroup
        );
        booking.setCredential(isUserSignedIn, credential());
        booking.setBookingMethod(bookingMethod, bookingMethodData());
        booking.setPaymentProvider(creditCardProvider, addGbPrimePayAuthKey());
        booking.setAcceptWeTravelTogether(state.acceptWeTravelTogether);
        if (isChargeFree === false) {
          booking.setPaymentMethod(paymentMethod(), cardObject);
        }
        if (isValidCorporateEvent.value) {
          const { id } = corporateEventData.value;
          booking.setCorporateEventId(id);
        }
        if (rootGetters["webConfig/isUsingAsyncBooking"]) {
          booking.setAsAsyncBooking();
        }
        if (
          rootGetters["bookingDateTime/isOrderNow"] &&
          rootState.restaurant.isSupportOrderNow
        ) {
          booking.setAsOrderNow();
        }
        if (isRestaurantRecordGuest && bookingMethod === "dine in") {
          let guests = [];
          state.recordGuest.forEach((guest) => {
            if (
              typeof guest.phoneCode === "string" &&
              guest.phoneCode.includes("+") &&
              guest.phoneCode.length > 1
            ) {
              const phone = removeLeadingZero(guest.phone);
              guests.push({
                name: `${guest.firstName} ${guest.lastName}`,
                phone: `${guest.phoneCode}${phone}`,
              });
            }
          });

          if (guests.length) {
            booking.addGuest(guests);
          }
        }

        booking.setFBConversion(isBookingFromFB());
        booking.setTempBookingId(temporaryBookingId);
        booking.setAs3DPayment(state.paymentMethod === PAYMENT_CREDIT_CARD);
        const result = await booking.createBooking();
        if (result.isSuccess === false) {
          if (result.status !== 401) {
            rollbar.error("Failed creating reservation", result.data);

            if (!rootGetters["user/isUserSignedIn"]) {
              // configure rollbar to track guest user
              rollbar.configure({
                payload: {
                  id: rootGetters["user/getState"]("email"),
                  name: rootGetters["user/getState"]("name"),
                  email: rootGetters["user/getState"]("email"),
                  phone: rootGetters["user/getState"]("phone"),
                },
              });
            }
          }
        }
        return result;
      } catch (err) {
        return err;
      }
    },
    async initBookingFlow({ dispatch, commit }, isMobileBooking = true) {
      commit("setState", {
        state: "isBigGroup",
        val: false,
      });
      commit("setState", {
        state: "isMobileBooking",
        val: isMobileBooking,
      });
      const { newStep, newRoute } = await dispatch("generateNewStepRoute", 1);
      dispatch("navigateToNewStep", {
        route: newRoute,
        navigateMethod: "push",
      }).then(() => {
        commit("setState", {
          state: "step",
          val: newStep,
        });
      });
    },
    async createBookingLocking(
      { state, commit, rootState, dispatch },
      isCreateNew = false
    ) {
      const {
        selectedDate,
        adult,
        kids,
        selectedTime,
        temporaryBookingId,
        bookingExpiryDate,
      } = state;
      let isAlreadyExpired = false;
      const selectedPackages = await dispatch(
        "bookingPackage/buildPackagePayload",
        {},
        { root: true }
      );
      const currentBookingExpiryDate = dayjs(bookingExpiryDate);
      if (currentBookingExpiryDate.isValid()) {
        const now = dayjs().utc();
        const diff = currentBookingExpiryDate.diff(now, "seconds");
        if (diff <= 0) {
          isAlreadyExpired = true;
        }
      }
      const { isSuccess, message, data } = await createBookingLocking({
        date: selectedDate,
        adult: adult,
        kids: kids,
        startTime: selectedTime,
        packages: selectedPackages,
        temporaryBookingId:
          !isCreateNew && !isAlreadyExpired ? temporaryBookingId : undefined,
        restaurantId: rootState.restaurant.restaurantId,
      });
      if (!isSuccess || !data) {
        if (message) {
          alert.error(message);
        }
        dispatch("changeStep", 1);
        return;
      }
      const { expiredAt, tmpReservationId } = data;
      commit("setState", {
        state: "temporaryBookingId",
        val: tmpReservationId,
      });
      commit("setState", {
        state: "bookingExpiryDate",
        val: expiredAt,
      });
    },
  },
};
