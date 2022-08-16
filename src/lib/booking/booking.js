import useHttp from "@/composable/useHttp";
import createOmiseToken from "./omise";
import createGbPrimePayToken from "./gbPrimePay";
import isNil from "lodash-es/isNil";
import omitBy from "lodash-es/omitBy";
import dayjs from "../dayjs";
import isEmpty from "lodash-es/isEmpty";
import {
  SOURCE,
  PROVIDER,
  API_MINOR_VERSION,
  UTM_SOURCE,
  PICK_UP,
  DELIVERY,
  DINE_IN,
  INVOLVE_ASIA_CLICK_ID,
  PAYMENT_TRUEWALLET,
  PAYMENT_PROMPTPAY,
  PAYMENT_SHOPEEPAY,
  PAYMENT_CREDIT_CARD,
  PAYMENT_PROVIDER_OMISE,
  PAYMENT_PROVIDER_GB_PRIMEPAY,
  UTM_MEDIUM,
  UTM_VERSION,
} from "@/lib/constant";
import { initReservationRealtimeDB } from "@/composable/watchReservationStatus";
import { getFromUserStorage } from "@/helper/userStorage";

/**
 * @typedef {object} Booking
 * @param {String} adult
 * @param {String} kids
 * @param {String} specialRequest
 * @param {Date} date
 * @param {String} selectedTime
 * @param {Array} packages
 * @param {String} restaurantId
 * @param {Boolean} isBigGroup
 * @param {String} isBigGroup
 * @param {String} paymentProvider
 */
function Booking(
  adult,
  kids,
  specialRequest,
  selectedDate,
  selectedTime,
  packages,
  restaurantId,
  voucherCode,
  isBigGroup = false
) {
  this.adult = adult;
  this.kids = kids;
  this.specialRequest = specialRequest;
  this.selectedDate = dayjs(selectedDate).format("YYYY-MM-DD");
  this.selectedTime = selectedTime;
  this.packages = packages;
  this.restaurantId = restaurantId;
  this.voucherCode = voucherCode;
  this.isBigGroup = isBigGroup;
  this.occasion = "";
  this.address = "";
  this.bookingMethod = "";
  this.paymentMethod = "";
  this.distanceToRestaurant = "";
  this.accessToken = "";
  this.cardObject = {};
  this.omiseToken = "";
  this.gbPrimePay = {};
  this.gbPrimePayAuthKey = "";
  this.guestsAttributes = [];
  this.guestUser = {
    name: "",
    email: "",
    phone: "",
  };
  this.paymentProvider = ""; // possible value: omise/gb_primepay
  this.isOrderNow = false;
  this.isAsyncBooking = false;
  this.fbConversion = {
    fbp: "",
    fbc: "",
  };
  this.corporateEventId = 0;
  this.acceptWeTravelTogether = false;
  this.tempBookingId = "";
  this.is3DPayment = null;

  /**
   * @param {Boolean} isUserSignedIn - Boolean value that indicate if user signed in or not
   * @param {string|Object} data - if user signed in, pass access token if not pass name,phone,email of user
   */
  this.setCredential = function (isUserSignedIn, data) {
    if (isUserSignedIn) {
      this.accessToken = data;
    } else {
      this.guestUser.name = data.name;
      this.guestUser.email = data.email;
      this.guestUser.phone = data.phone;
    }
  };

  /**
   *
   * @param {String} method - possible value: dine in, pick up, delivery
   * @param {*} data - if dine in, pass occasion id, if delivery pass address and distance to restaurant, if pickup no need to pass anything
   */
  this.setBookingMethod = function (method, data) {
    if (method === DINE_IN) {
      this.occasion = data;
    } else if (method === DELIVERY) {
      this.address = data.address;
      this.distanceToRestaurant = data.distanceToRestaurant;
    }
    this.bookingMethod = method;
  };

  /**
   * @param {string} method - possible value: normal, promptpay, omise
   * @param [data]
   */
  this.setPaymentMethod = function (method, data) {
    this.paymentMethod = method;
    if (this.paymentMethod === PAYMENT_CREDIT_CARD) {
      const { name, number, securityCode, expMonthYear } = data;
      const splitExp = expMonthYear.split("/");
      this.cardObject.name = name;
      this.cardObject.number = number;
      this.cardObject.securityCode = securityCode;
      this.cardObject.expirationMonth = splitExp[0];
      this.cardObject.expirationYear = splitExp[1];
    }
  };

  /**
   * @param {string} method - possible value: omise, gb_primepay
   * @param [provider]
   */
  this.setPaymentProvider = function (provider, gbPrimePayAuthKey) {
    if (
      provider !== PAYMENT_PROVIDER_OMISE &&
      provider !== PAYMENT_PROVIDER_GB_PRIMEPAY
    ) {
      throw new Error(
        `Invalid paymnet provider, possible option are: omise and ${PAYMENT_PROVIDER_GB_PRIMEPAY}`
      );
    }
    if (provider === PAYMENT_PROVIDER_GB_PRIMEPAY && !gbPrimePayAuthKey) {
      throw new Error("GB Prime Pay auth key is undefined");
    }
    this.paymentProvider = provider;
    this.gbPrimePayAuthKey = gbPrimePayAuthKey;
  };

  this.setAsOrderNow = function () {
    this.isOrderNow = true;
  };

  this.setAsAsyncBooking = function () {
    this.isAsyncBooking = true;
  };
  /**
   *
   * @param {Array} arrayOfGuest - array of guest contain object {name: ' ' , phone: ' ' }
   */
  this.addGuest = function (arrayOfGuest) {
    this.guestsAttributes = arrayOfGuest;
  };

  this.setFBConversion = function (payload = {}) {
    if (payload && !isEmpty(payload)) {
      const { fbp, fbc } = payload;
      if (fbp && fbc) {
        this.fbConversion.fbc = fbc;
        this.fbConversion.fbp = fbp;
      }
    }
  };

  this.setCorporateEventId = function (eventId = 0) {
    if (typeof eventId === "number" || typeof eventId === "string") {
      this.corporateEventId = eventId;
    }
  };

  this.setAcceptWeTravelTogether = function (isAccept) {
    if (typeof isAccept === "boolean") {
      this.acceptWeTravelTogether = isAccept;
    }
  };

  this.setTempBookingId = function (tempBookingId) {
    if (typeof tempBookingId === "number") {
      this.tempBookingId = tempBookingId;
    }
  };

  this.setAs3DPayment = function (is3DPayment) {
    this.is3DPayment = typeof is3DPayment === "boolean" ? is3DPayment : null;
  };

  const buildPayload = () => {
    return {
      ...buildBasePayload(),
      reservation: { ...buildReservationPayload() },
      packages: this.packages,
    };
  };

  const buildReservationPayload = () => {
    const addDistanceToRestaurant = () => {
      return this.bookingMethod === DELIVERY ? this.distanceToRestaurant : null;
    };

    const addServiceType = () => {
      if (this.bookingMethod === PICK_UP) {
        return "pick_up";
      } else if (this.bookingMethod === DELIVERY) {
        return "delivery";
      }
      return null;
    };

    const addDiningOccasionId = () => {
      return this.bookingMethod === DINE_IN ? this.occasion : null;
    };

    const payload = {
      date: this.selectedDate,
      adult: this.adult,
      kids: this.kids,
      restaurantId: this.restaurantId,
      specialRequest: this.specialRequest,
      startTime: this.selectedTime,
      voucherCode: this.voucherCode,
      diningOccasionId: addDiningOccasionId(),
      distanceToRestaurant: addDistanceToRestaurant(),
      serviceType: addServiceType(),
      isOrderNow: this.isOrderNow || null,
      clickId: getInvolveAsiaClickId(),
      acceptWeTravelTogether: this.acceptWeTravelTogether,
    };
    return omitBy(payload, isNil);
  };

  const buildBasePayload = () => {
    const addAddress = () => {
      return this.bookingMethod === DELIVERY ? this.address : null;
    };

    const addOmisePaymentType = () => {
      if (this.paymentMethod === PAYMENT_PROMPTPAY) {
        return PAYMENT_PROMPTPAY;
      } else if (this.paymentMethod === PAYMENT_CREDIT_CARD) {
        return "cc";
      } else if (this.paymentMethod === PAYMENT_TRUEWALLET) {
        return PAYMENT_TRUEWALLET;
      }
      return null;
    };

    const addPaymentType = () => {
      if (this.paymentMethod === PAYMENT_TRUEWALLET) {
        return PAYMENT_TRUEWALLET;
      }
      if (this.paymentMethod === PAYMENT_SHOPEEPAY) {
        return PAYMENT_SHOPEEPAY;
      }
      return null;
    };
    const addAccessToken = () => {
      return this.accessToken || null;
    };
    const addOmiseToken = () => {
      return this.paymentMethod === PAYMENT_CREDIT_CARD &&
        this.paymentProvider === PAYMENT_PROVIDER_OMISE
        ? this.omiseToken
        : null;
    };
    const addGbPrimePayPayload = () => {
      return this.paymentMethod === PAYMENT_CREDIT_CARD &&
        this.paymentProvider === PAYMENT_PROVIDER_GB_PRIMEPAY
        ? this.gbPrimePay
        : null;
    };
    const addGuestUser = () => {
      if (
        this.guestUser.name !== "" &&
        this.guestUser.email !== "" &&
        this.guestUser.phone !== ""
      ) {
        return this.guestUser;
      }
      return null;
    };
    const addGuestAttributes = () => {
      return this.guestsAttributes.length ? this.guestsAttributes : null;
    };

    const addUtmSource = () => {
      const defaultUtmSource = "web";
      const utmSource = getFromUserStorage(UTM_SOURCE, {
        domain: ".hungryhub.com",
      });
      const utmMedium = getFromUserStorage(UTM_MEDIUM, {
        domain: ".hungryhub.com",
      });
      const utmVersion = getFromUserStorage(UTM_VERSION, {
        domain: ".hungryhub.com",
      });
      let utm = "";
      if (
        typeof utmVersion === "string" &&
        utmVersion === "v2" &&
        typeof utmMedium === "string" &&
        utmMedium.length
      ) {
        utm = utmMedium;
      } else {
        utm = utmSource;
      }
      if (typeof getInvolveAsiaClickId() === "string") {
        return "InvolveAsia";
      }
      return typeof utm === "string" && utm.length ? utm : defaultUtmSource;
    };

    const addAsyncBooking = () => {
      return this.isAsyncBooking ? true : null;
    };

    const addFBConversion = () => {
      const { fbc, fbp } = this.fbConversion;
      if (fbc && fbc.length && fbp && fbp.length) {
        return {
          fbc,
          fbp,
        };
      }
      return null;
    };

    const addCorporateEventId = () => {
      if (this.corporateEventId) {
        return this.corporateEventId;
      }
      return null;
    };

    const addTempBookingId = () => {
      if (this.tempBookingId) {
        return this.tempBookingId;
      }
      return null;
    };

    const data = {
      address: addAddress(),
      accessToken: addAccessToken(),
      minorVersion: API_MINOR_VERSION,
      channel: addUtmSource(),
      source: SOURCE,
      provider: PROVIDER,
      bigGroup: this.isBigGroup,
      omiseToken: addOmiseToken(),
      omisePaymentType: addOmisePaymentType(),
      paymentType: addPaymentType(),
      guestUser: addGuestUser(),
      guestsAttributes: addGuestAttributes(),
      gbPrimepayCard: addGbPrimePayPayload(),
      asyncBooking: addAsyncBooking(),
      fbConversion: addFBConversion(),
      corporateEventId: addCorporateEventId(),
      tmpReservationId: addTempBookingId(),
      use_3d_secure: this.is3DPayment,
    };
    // reject attributes that have null value
    return omitBy(data, isNil);
  };

  const createCreditCardPayload = async () => {
    try {
      if (this.paymentProvider === PAYMENT_PROVIDER_OMISE) {
        this.omiseToken = await createOmiseToken(this.cardObject);
        return true;
      } else if (this.paymentProvider === PAYMENT_PROVIDER_GB_PRIMEPAY) {
        const resp = await createGbPrimePayToken(
          this.cardObject,
          this.gbPrimePayAuthKey
        );
        if (resp.isSuccess) {
          this.gbPrimePay = resp.card;
          // set card name field from user input since server response is null
          this.gbPrimePay.name = this.cardObject.name;
          return true;
        }
        return resp;
      }
    } catch (err) {
      return err;
    }
  };

  const booking = async () => {
    const defaultMessage =
      "Oops, something went wrong, failed creating reservation";
    const payload = buildPayload();
    try {
      const { data, httpStatus, message, error } = await useHttp({
        url: "/reservations.json",
        method: "POST",
        data: payload,
        canRetry: false,
      });

      if (data.data) {
        const reservationId = data.data.id;
        await initReservationRealtimeDB(reservationId);
        return {
          isSuccess: true,
          message: message,
          data: data.data,
          status: httpStatus,
        };
      } else {
        return {
          isSuccess: false,
          message: error.message || defaultMessage,
          status: httpStatus,
          data: {
            payload,
            response: data.data,
          },
        };
      }
    } catch (err) {
      if (err.data) {
        return {
          isSuccess: false,
          message: err.data.message,
          data: {
            payload,
            response: err,
          },
        };
      } else {
        return {
          isSuccess: false,
          message: "Unknown Error",
          data: {
            payload,
            response: err,
          },
        };
      }
    }
  };

  const asyncBooking = async () => {
    const defaultMessage =
      "Oops, something went wrong, failed creating reservation";
    const payload = buildPayload();
    try {
      const { data, httpStatus, error } = await useHttp({
        url: "/reservations.json",
        method: "POST",
        data: payload,
        canRetry: false,
      });

      if (!isEmpty(data)) {
        const { success, firebaseKey, message } = data;

        if (success === true) {
          await initReservationRealtimeDB(firebaseKey, true);
          return {
            isSuccess: true,
            message: message,
            data: null,
            status: httpStatus,
          };
        }

        return {
          isSuccess: false,
          message: error.message || defaultMessage,
          status: httpStatus,
          data: {
            payload,
            response: data.data,
          },
        };
      } else {
        return {
          isSuccess: false,
          message: error.message || defaultMessage,
          status: httpStatus,
          data: {
            payload,
            response: data.data,
          },
        };
      }
    } catch (err) {
      if (err.data) {
        return {
          isSuccess: false,
          message: err.data.message,
          data: {
            payload,
            response: err,
          },
        };
      } else {
        return {
          isSuccess: false,
          message: defaultMessage,
          data: {
            payload,
            response: err,
          },
        };
      }
    }
  };

  this.createBooking = async function () {
    try {
      if (this.paymentMethod === PAYMENT_CREDIT_CARD) {
        const getTokenRequest = await createCreditCardPayload();
        if (getTokenRequest !== true) {
          return {
            isSuccess: false,
            message: `Failed to create booking. ${getTokenRequest.message}`,
            data: {
              ...getTokenRequest.data,
            },
          };
        }
      }
      const respBooking = this.isAsyncBooking ? asyncBooking() : booking();
      return respBooking;
    } catch (err) {
      return {
        isSuccess: false,
        message: err,
      };
    }
  };
}

function getInvolveAsiaClickId() {
  const clickId = getFromUserStorage(INVOLVE_ASIA_CLICK_ID, {
    domain: ".hungryhub.com",
  });
  if (typeof clickId === "string" && clickId.length) {
    return clickId;
  }
  return null;
}

export default Booking;
