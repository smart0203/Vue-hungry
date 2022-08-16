import { ref, reactive, computed } from "@vue/composition-api";
import axios from "@/lib/myAjax";
import { i18n } from "@/lib/i18n/i18n.js";
import useRealtimeReservation from "@/composable/realtimeReservation";
import dayjs from "@/lib/dayjs";
import { relativeTime } from "@/helper/dateTimeHelper";
import {
  PRICING_TYPE_ALA_CARTE,
  RESERVATION_PENDING_ARRIVAL,
  RESERVATION_WAITING_FOR_PAYMENT,
  RESERVATION_PENDING_CONFIRMATION,
  RESERVATION_CANCELED,
  UTM_SOURCE,
  INVOLVE_ASIA_CLICK_ID,
  ROUTE_HOME_PAGE,
} from "@/lib/constant";
import {
  storageSetTrackedResevation,
  storageGetSee3DView,
} from "@/lib/localStorage";
import useQueryString from "@/composable/useQueryString";
import track from "@/services/userTracking";
const { parsedQueryString } = useQueryString();
import store from "@/store/index";
import router from "@/router/router";
import rollbar from "@/lib/rollbar";
import * as alert from "@/lib/alert";
import { convertToNumber } from "@/helper/stringHelper";
import {
  getFromUserStorage,
  removeFromUserStorage,
} from "@/helper/userStorage";

function removeCookies() {
  if (getFromUserStorage(UTM_SOURCE)) {
    removeFromUserStorage(UTM_SOURCE, { domain: ".hungryhub.com" });
    removeFromUserStorage(UTM_SOURCE, { domain: "web.hungryhub.com" });
  }
  if (getFromUserStorage(INVOLVE_ASIA_CLICK_ID)) {
    removeFromUserStorage(INVOLVE_ASIA_CLICK_ID, { domain: ".hungryhub.com" });
  }
}

const { reservationRealtimeDB, initReservationRealtimeDB } =
  useRealtimeReservation();
const state = {
  reservationRealtimeDB,
  corporateEventId: ref(0),
  isRestaurantPromotedOnly: ref(false),
  isLoading: ref(true),
  isSuccess: ref(false),
  reservationId: ref(""),
  originalId: ref(""),
  name: ref(""),
  adult: ref(""),
  kids: ref(""),
  email: ref(""),
  phone: ref(""),
  map: ref(""),
  dateTime: ref(""),
  time: ref(""),
  diningOccasion: ref(""),
  hungryPoint: ref(0),
  restaurantId: ref(""),
  restaurantName: ref(""),
  restaurantCuisine: ref(""),
  packageType: ref(""),
  isDineIn: ref(false),
  isPickUp: ref(false),
  isDelivery: ref(false),
  isBigGroup: ref(false),
  statusAsSymbol: ref(""),
  deliveryAddress: ref(""),
  driverNote: ref("-"),
  specialRequest: ref("-"),
  packages: ref(""),
  deliveryFee: ref(""),
  voucher: ref(""),
  chargeAmount: ref(0),
  priceAmount: ref(0),
  pricingType: ref(""),
  shareBookingUrl: ref(""),
  modifyBookingUrl: ref(""),
  guests: ref([]),
  isPackageCharged: ref(false),
  chargeObject: ref({}),
  qrPayment: reactive({
    qrCodeForPaymentExpiredAt: "",
    qrCodeForPayment: "",
  }),
  revenue: reactive({
    amount: "",
    currency: "",
  }),
  guestBookingIds: ref([]),
  isOrderNow: ref(false),
  hasPrepayment: ref(false),
  voucherApplied: ref([]),
  estimationDeliveredAt: ref(""),
  skipStartTime: ref(false),
  restaurantPhone: ref(""),
  facebookEventId: ref(""),
  shopeePayUrl: ref(""),
  paymentType: ref(""),
};

const pageTitle = computed(() => {
  return `${state.restaurantName.value} | Booking Success`;
});

const deliveryEstimationServer = computed(() => {
  return state.estimationDeliveredAt.value;
});

const deliveryEstimationFirebase = computed(() => {
  const driverObject = reservationRealtimeDB.value.driver_location;
  if (driverObject) {
    return dayjs(driverObject.estimation_delivered_at);
  }
  return undefined;
});

const deliveryEstimation = computed(() => {
  if (
    deliveryEstimationServer.value &&
    deliveryEstimationServer.value.length === 0 &&
    deliveryEstimationFirebase.value &&
    deliveryEstimationFirebase.value.length === 0
  ) {
    return "";
  }
  return deliveryEstimationFirebase.value || deliveryEstimationServer.value;
});

const deliveryDriverPhone = computed(() => {
  return reservationRealtimeDB.value.driver_location?.phone || "";
});

const deliveryMap = computed(() => {
  return reservationRealtimeDB.value.driver_tracking_link || "";
});

const computeds = {
  deliveryEstimation,
  deliveryEstimationFirebase,
  deliveryDriverPhone,
  deliveryMap,
  isCanceled: computed(() => {
    return state.statusAsSymbol.value === RESERVATION_CANCELED;
  }),
  isPendinArrival: computed(() => {
    return state.statusAsSymbol.value === RESERVATION_PENDING_ARRIVAL;
  }),
  isPendingBigGroup: computed(() => {
    return (
      state.isBigGroup.value &&
      state.statusAsSymbol.value === RESERVATION_PENDING_CONFIRMATION
    );
  }),
  isQRPayment: computed(() => {
    if (
      state.qrPayment.qrCodeForPayment !== null &&
      state.statusAsSymbol.value === RESERVATION_WAITING_FOR_PAYMENT
    ) {
      return true;
    }
    return false;
  }),
  isShopeePay: computed(() => {
    if (
      state.shopeePayUrl.value &&
      state.statusAsSymbol.value === RESERVATION_WAITING_FOR_PAYMENT
    ) {
      return true;
    }
    return false;
  }),
  anyRemainingCharge: computed(() => {
    if (
      state.chargeObject &&
      state.chargeObject.value.chargeAmountType === "relative" &&
      state.chargeObject.value.chargePercent < 100
    ) {
      return true;
    }
    return false;
  }),
  totalPayAtRestaurant: computed(() => {
    if (state.chargeObject) {
      return (
        state.chargeObject.value.totalPrice -
        state.chargeObject.value.chargePrice
      );
    }
    return 0;
  }),
  totalCharge: computed(() => {
    if (state.chargeObject.value) {
      return (
        parseInt(state.chargeObject.value.chargePrice) +
        parseInt(state.chargeObject.value.deliveryFee)
      );
    }
    return 0;
  }),
  isLateDelivery: computed(() => {
    if (state.isDelivery.value === true && state.isOrderNow.value === true) {
      if (
        dayjs().isValid(deliveryEstimation.value) &&
        dayjs().isAfter(deliveryEstimation.value, "minute")
      ) {
        return true;
      }
      return false;
    }
    return false;
  }),
  deliveryStatus: computed(() => {
    return reservationRealtimeDB.value.delivery_status;
  }),
  deliveryEstimationLabel: computed(() => {
    if (
      state.isDineIn.value === true ||
      dayjs(deliveryEstimation.value).isValid() === false ||
      reservationRealtimeDB.value.delivery_status === "Driver::DELIVERED"
    ) {
      return "";
    }
    return relativeTime(deliveryEstimation.value);
  }),
};

function getReservation(reservationId, token = "") {
  return new Promise((resolve, reject) => {
    state.reservationId.value = reservationId;
    let params = {};
    let url = `reservations/${state.reservationId.value}/detail.json`;
    const isContainNumberOnly =
      typeof reservationId === "number" || reservationId.match(/^[0-9]*$/);

    if (isContainNumberOnly) {
      if (token && token.length) {
        params.accessToken = token;
        url = `reservations/${state.reservationId.value}.json`;
      } else {
        const error = {
          message: "authentication-failed",
          data: null,
        };
        reject(error);
        return;
      }
    }
    state.isLoading.value = true;
    try {
      axios({
        method: "get",
        url,
        params,
      })
        .then((resp) => {
          if (resp.data.success && resp.data.data.attributes) {
            const result = resp.data.data.attributes;
            const included = resp.data.included;
            state.isSuccess.value = true;
            state.originalId.value = resp.data.data.id;
            state.corporateEventId.value = result.corporateEventId;
            state.isBigGroup.value = result.isGroupBooking;
            state.statusAsSymbol.value = result.statusAsSymbol;
            state.adult.value = result.adult;
            state.kids.value = result.kids;
            state.name.value = result.name;
            state.email.value = result.email;
            state.phone.value = result.phone;
            state.dateTime.value = result.date;
            state.skipStartTime.value = result.skipStartTime;
            if (!result.skipStartTime) {
              state.dateTime.value = `${state.dateTime.value} ${i18n.t("at")} ${
                result.startTime
              }`;
            }
            state.time.value = result.startTime;
            state.diningOccasion.value = result.diningOccasion;
            state.restaurantName.value = result.restaurantName;
            state.restaurantId.value = result.restaurantId;
            state.hungryPoint.value = result.hungryPoints;
            if (result.serviceType === "dine_in") {
              state.isDineIn.value = true;
            } else if (result.serviceType === "delivery") {
              state.isDelivery.value = true;
            } else if (result.serviceType === "pick_up") {
              state.isPickUp.value = true;
            }
            state.packageType.value = result.type;
            state.priceAmount.value = result.priceAmount;
            state.guests.value = result.guests || [];
            state.guestBookingIds.value = result.guestBookingId;
            state.deliveryAddress.value = result.deliveryAddressHumanize || "";
            state.revenue.amount = result.revenue.amount;
            state.revenue.currency = result.revenue.currency;
            state.shareBookingUrl.value = result.shareUrl;
            state.modifyBookingUrl.value = result.modifyUrl;
            state.specialRequest.value = result.specialRequest;
            state.isOrderNow.value = result.isOrderNow;
            state.packages.value = result.packages.map((packages) => {
              return {
                isAlaCarte: packages.pricingType === PRICING_TYPE_ALA_CARTE,
                ...packages,
                price: parseInt(packages.amount),
              };
            });
            state.voucher.value = "";
            state.qrPayment.qrCodeForPaymentExpiredAt =
              result.qrCodeForPaymentExpiredAt;
            state.qrPayment.qrCodeForPayment =
              result.qrCodeForPayment || result.qrcode;
            state.hasPrepayment.value = result.hasPrepayment;
            state.shopeePayUrl.value = result.shopeePayUrl;
            state.estimationDeliveredAt.value = result.estimationDeliveredAt;
            state.facebookEventId.value = result.facebookEventId;
            state.paymentType.value =
              typeof result.paymentType === "string"
                ? result.paymentType.replace("_", " ")
                : "";
            if (included.length) {
              let restaurantData;
              let deliveryAddressData;
              let voucher;
              included.forEach((inc) => {
                if (inc.type === "restaurants") {
                  restaurantData = inc;
                  state.isRestaurantPromotedOnly =
                    restaurantData.attributes.promotedByHh === false
                      ? true
                      : false;
                  state.map.value = restaurantData.attributes.mapLocation;
                  state.restaurantPhone.value =
                    restaurantData.attributes.phoneForDelivery;
                  state.restaurantCuisine = restaurantData.attributes.cuisine;
                } else if (inc.type === "delivery-address") {
                  deliveryAddressData = inc;
                  state.driverNote.value =
                    deliveryAddressData.attributes.noteForDriver;
                } else if (inc.type === "vouchers") {
                  voucher = inc;
                  const filterUsedVoucher = result.usedVouchers.filter(
                    (usedVoucher) => usedVoucher.id == voucher.id
                  );
                  voucher.attributes.usedAmount = filterUsedVoucher.length
                    ? filterUsedVoucher[0].amount
                    : 0;
                  state.voucherApplied.value.push(voucher.attributes);
                }
              });
            }

            // set charge object
            state.isPackageCharged.value = true;
            const {
              chargePercent,
              chargeAmountType,
              chargePrice,
              chargeType,
              deliveryFee,
              deliveryFeeInBaht,
              deliveryFeePerKmInBaht,
              originalDeliveryFee,
              deliveryRadius,
              totalPrice,
            } = result;
            state.chargeObject.value = {
              chargePercent,
              chargeAmountType,
              chargePrice,
              chargeType,
              originalDeliveryFee: convertToNumber(originalDeliveryFee.amount),
              deliveryFee: convertToNumber(deliveryFee.amount) || 0,
              deliveryFeeInBaht,
              deliveryFeePerKmInBaht,
              deliveryRadius,
              totalPrice,
            };
            state.chargeAmount.value =
              convertToNumber(chargePrice) +
              convertToNumber(state.chargeObject.value.deliveryFee);
            state.isLoading.value = false;

            resolve();
          } else {
            state.isSuccess.value = false;
            state.isLoading.value = false;
            let error = {};
            if (resp.status === 401) {
              error = {
                message: "authentication-failed",
                data: null,
              };
              reject(error);
            } else if (!resp.data.data || !resp.data.success) {
              error = {
                message: "Data not found",
                data: null,
              };
              reject(error);
            }
          }
        })
        .catch((err) => {
          state.isSuccess.value = false;
          if (err.dontReport) {
            reject(err);
          } else {
            rollbar.error(err);
            const error = {
              message:
                "Oops, something went wrong, failed get your reservation data",
              data: {
                reservationId: state.reservationId.value,
              },
              cause: err,
            };
            reject(error);
            state.isLoading.value = false;
          }
        });
    } catch (err) {
      rollbar.error(err);
      const error = {
        message: "Oops, something went wrong, failed get your reservation data",
        data: {
          reservationId: state.reservationId.value,
        },
        cause: err,
      };
      reject(error);
    }
  });
}

function pageViewed() {
  if (!store.getters.isDontAllowTracking) {
    track("PAGE_VIEWED", { pageTitle: pageTitle.value });
  }
}

function trackChargedReservation() {
  const isTracked = parsedQueryString.tracked;
  if (
    !isTracked &&
    state.statusAsSymbol.value === RESERVATION_PENDING_ARRIVAL
  ) {
    const vouchersName = state.voucherApplied.value.join(",");
    const savedSee3DViewRestaurantId = storageGetSee3DView();
    const compare3DViewRestaurantId =
      savedSee3DViewRestaurantId == state.restaurantId.value;
    track("CHARGED", {
      userName: state.name.value,
      userEmail: state.email.value,
      userPhone: state.phone.value,
      restaurantName: state.restaurantName.value,
      restaurantId: state.restaurantId.value,
      restaurantCuisine: state.restaurantCuisine.value,
      bookingId: state.originalId.value,
      bookingRevenue: state.revenue.amount,
      bookingCurrency: state.revenue.currency,
      bookingVoucher: vouchersName,
      facebookEventId: state.facebookEventId.value,
      see3DView: compare3DViewRestaurantId,
    });
    storageSetTrackedResevation(state.originalId.value);
    pageViewed();
    const { getStringifyQueryString, addQueryString } = useQueryString();
    addQueryString("tracked", true);
    window.location.search = getStringifyQueryString();
    // add ?tracked=true to url so if user open in antoher browser, it dont send track event
  }
}

function trackBigGroupConfirmed() {
  if (
    state.isBigGroup.value &&
    state.statusAsSymbol.value === RESERVATION_PENDING_ARRIVAL
  ) {
    track("BOOKING_STEP_BIG_GROUP_CONFIRMED", {
      userName: state.name.value,
      userEmail: state.email.value,
      userPhone: state.phone.value,
      restaurantName: state.restaurantName.value,
      restaurantId: state.restaurantId.value,
      bookingId: state.originalId.value,
      bookingRevenue: state.revenue.amount,
      bookingCurrency: state.revenue.currency,
      facebookEventId: state.facebookEventId.value,
    });
  }
}

function getReservationData(encryptedId) {
  const token = store.getters["user/isUserSignedIn"]
    ? store.state.user.accessToken
    : "";
  getReservation(encryptedId, token)
    .then(() => {
      if (state.isSuccess.value) {
        trackChargedReservation();
        trackBigGroupConfirmed();
        removeCookies();
      }
    })
    .catch((error) => {
      if (error) {
        if (error.message == "authentication-failed") {
          router.push({
            name: "error",
            params: {
              errorId: "authentication-failed",
            },
          });
        } else if (error.message === "Data not found") {
          alert.error(error.message);
          router.push({ name: ROUTE_HOME_PAGE });
        } else {
          rollbar.error(error.message, error.cause, error.data);
          if (error.message) {
            alert.error(error.message);
          }
          router.push({ name: ROUTE_HOME_PAGE });
        }
      }
    });
}

const methods = {
  getReservation,
  initReservationRealtimeDB,
  getReservationData,
};
export { state, computeds, methods };
