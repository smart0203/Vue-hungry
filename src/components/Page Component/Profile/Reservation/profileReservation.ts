import { ref, reactive, computed } from "@vue/composition-api";
import store from "@/store/index";
import * as alert from "@/lib/alert";
import rollbar from "@/lib/rollbar";
import dayjs from "@/lib/dayjs";
import { i18n } from "@/lib/i18n/i18n";
import { getReservation, cancelReservation } from "@/services/user";
import isEmpty from "lodash-es/isEmpty";
import { nanoid } from "nanoid";
import router from "@/router/router";
import {
  PACKAGE_CODE_HAH,
  PACKAGE_CODE_XP,
  ROUTE_BOOKING_LANDING_PAGE,
} from "@/lib/constant";
import Vue from "vue";

const loading = reactive({
  pendingPaymentReservation: true,
  pastReservation: true,
  upCommingReservation: true,
});

const pageNumber = reactive({
  pendingPaymentReservation: 1,
  pastReservation: 1,
  upCommingReservation: 1,
});

const pageSize = reactive({
  pendingPaymentReservation: 10,
  pastReservation: 10,
  upCommingReservation: 10,
});

const anyNextPage = reactive({
  pendingPaymentReservation: false,
  pastReservation: false,
  upComingReservation: false,
});

const pendingPaymentReservation = ref<any[]>([]);
const pastReservation = ref<any[]>([]);
const upComingReservation = ref<any[]>([]);
const accessToken = computed(() => {
  // @ts-ignore
  return store.state.user.accessToken;
});

const qrCode = ref("");
const showQrCodeModal = ref(false);
const showCancelConfirmModal = ref(false);
const reservationIdInsideModal = ref("");

async function getUpCommingReservation(isLoadMore = false) {
  if (!accessToken.value) {
    Vue.prototype.$modal.show("login-modal");
    router.push({
      name: "HomePage",
    });
    return;
  }
  loading.upCommingReservation = true;
  try {
    const { isSuccess, data, meta, message } = await getReservation(
      accessToken.value,
      "upcoming",
      pageNumber.upCommingReservation,
      pageSize.upCommingReservation
    );
    if (isSuccess && data !== null) {
      if (isLoadMore === false) {
        upComingReservation.value = data;
      } else {
        upComingReservation.value.push(data);
      }
      const link = meta?.link;
      if (link) {
        anyNextPage.upComingReservation = link.next ? true : false;
      } else {
        anyNextPage.upComingReservation = false;
      }
      loading.upCommingReservation = false;
      return;
    }
    alert.error(message);
  } catch (err: any) {
    alert.error(err);
    rollbar.error(err);
  }
}

async function getPastReservation(isLoadMore = false) {
  if (!accessToken.value) {
    Vue.prototype.$modal.show("login-modal");
    router.push({
      name: "HomePage",
    });
    return;
  }
  loading.pastReservation = true;
  try {
    const { isSuccess, message, data, meta } = await getReservation(
      accessToken.value,
      "past",
      pageNumber.pastReservation,
      pageSize.pastReservation
    );
    if (isSuccess && data !== null) {
      if (isLoadMore === false) {
        pastReservation.value = data;
      } else {
        data.forEach((reservation) => {
          pastReservation.value.push(reservation);
        });
      }
      const link = meta?.link;
      if (link) {
        anyNextPage.pastReservation = link.next ? true : false;
      } else {
        anyNextPage.pastReservation = false;
      }
      loading.pastReservation = false;
      return;
    }
    alert.error(message);
  } catch (err) {
    alert.error(err);
  }
}

async function getPendingPaymentReservation(isLoadMore = false) {
  if (!accessToken.value) {
    Vue.prototype.$modal.show("login-modal");
    router.push({
      name: "HomePage",
    });
    return;
  }
  loading.pendingPaymentReservation = true;
  try {
    const { isSuccess, message, data, meta } = await getReservation(
      accessToken.value,
      "pending",
      pageNumber.pendingPaymentReservation,
      pageSize.pendingPaymentReservation
    );
    if (isSuccess && data !== null) {
      if (isLoadMore === false) {
        pendingPaymentReservation.value = data;
      } else {
        data.forEach((reservation) => {
          pendingPaymentReservation.value.push(reservation);
        });
      }
      const link = meta?.link;
      if (link) {
        anyNextPage.pendingPaymentReservation = link.next ? true : false;
      } else {
        anyNextPage.pendingPaymentReservation = false;
      }
      loading.pendingPaymentReservation = false;
      return;
    }
    alert.error(message);
  } catch (err) {
    alert.error(err);
  }
}

function initDummyReservation(dummyCount = 3) {
  const dummy = [];
  for (let index = 0; index < dummyCount; index++) {
    const dummyData = {
      isLoading: true,
      id: nanoid(5),
      restaurantName: "",
      date: "2020-01-01",
      startTime: "",
      adult: 0,
      kids: 0,
      shareUrl: "",
      modifyUrl: "",
      serviceType: "",
      reviewData: "",
      status: "",
      statusAsSymbol: "",
      hungryPoints: 0,
    };
    dummy.push(dummyData);
  }
  return dummy;
}

function buildReservationCardProps(
  reservation: any,
  isPastReservation: boolean
) {
  let isLoading = !isPastReservation
    ? loading.upCommingReservation
    : loading.pastReservation;
  if (reservation.isLoading) {
    isLoading = reservation.isLoading;
  }
  const {
    restaurantName,
    id,
    date,
    startTime,
    adult,
    kids,
    shareUrl,
    modifyUrl,
    serviceType,
    reviewData,
    status,
    typeShort,
    statusAsSymbol,
    hungryPoints,
    eligibleToGetReward,
  } = reservation;
  const dateTime = `${dayjs(date, "YYYY-MM-DD").format(
    "dddd, DD MMM YYYY"
  )} ${i18n.t("at")} ${startTime}`;
  const review = () => {
    if (!isEmpty(reviewData)) {
      const { review, rating } = reviewData;
      return {
        review,
        rating,
      };
    }
    return {
      review: "",
      rating: 0,
    };
  };
  return {
    isLoading: isLoading,
    isPast: isPastReservation,
    restaurantName: restaurantName,
    bookingId: id,
    reservationDate: date,
    reservationDateTime: dateTime,
    reservationPax: adult + kids,
    reservationStatus: status,
    reservationStatusSymbol: statusAsSymbol,
    shareUrl: shareUrl,
    modifyUrl: modifyUrl,
    isXperience: serviceType === "dine_in" && typeShort === PACKAGE_CODE_XP,
    isDineIn:
      serviceType === "dine_in" &&
      typeShort !== PACKAGE_CODE_HAH &&
      typeShort !== PACKAGE_CODE_XP,
    isDelivery: typeShort === PACKAGE_CODE_HAH && serviceType === "delivery",
    isPickup: typeShort === PACKAGE_CODE_HAH && serviceType === "pick_up",
    reviewText: review().review,
    reviewStar: review().rating,
    hungryPoints: hungryPoints,
    getReward:
      typeof eligibleToGetReward === "boolean" ? eligibleToGetReward : true,
  };
}

function bookAgainCallback(reservation: any) {
  const slug = reservation.restaurantData?.slug;
  if (!slug) {
    alert.error("Ops, something went wrong, cannot show your booking detail");
    throw new Error("restaurant slug is missing");
  }
  router.push({
    path: `/restaurants/${slug}`,
  });
}

async function cancelCallback(reservationId: string) {
  if (
    typeof reservationId !== "string" ||
    (typeof reservationId === "string" && reservationId.length === 0)
  ) {
    throw new Error("Invalid reservationId");
  }
  const { isSuccess, message } = await cancelReservation(
    reservationId,
    accessToken.value
  );
  if (isSuccess && message) {
    alert.success(message);
  }
}

function viewDetailCallback(reservation: any) {
  const slug = reservation.restaurantData?.slug;
  const id = reservation.id;
  if (!slug && !id) {
    alert.error("Ops, something went wrong, cannot show your booking detail");
    throw new Error("restaurant slug or reservation encryptedId is missing");
  }
  router.push({
    path: `/restaurants/${slug}/landing/${id}?tracked=true`,
  });
}

function writeReviewCallback(reservation: any) {
  if (!reservation.reviewUrl) {
    alert.error("Ops, something went wrong, cannot go to review page");
    throw new Error("Reservation review url not defined");
  }
  window.location = reservation.reviewUrl;
}

function modifyCallback(reservation: any) {
  if (!reservation.modifyUrl) {
    alert.error("Ops, something went wrong, cannot modify your booking");
    throw new Error("Reservation share url not defined");
  }
  window.location = reservation.modifyUrl;
}

function shareCallback(reservation: any) {
  if (!reservation.shareUrl) {
    alert.error("Ops, something went wrong, cannot share your booking detail");
    throw new Error("Reservation share url not defined");
  }
  window.open(reservation.shareUrl, "_newtab");
}

function qrCallback(reservation: any) {
  if (!reservation.qrcode) {
    alert.error("Ops, something went wrong, cannot show your booking qr code");
    throw new Error("Reservation share url not defined");
  }
  showQrCodeModal.value = true;
  qrCode.value = reservation.qrcode;
}

function payCallBack(reservationId: string, restaurantName: string) {
  if (typeof reservationId !== "string" && typeof reservationId !== "number") {
    throw new Error("Invalid reservationId");
  }
  if (
    typeof restaurantName !== "string" ||
    (typeof restaurantName === "string" && restaurantName.length === 0)
  ) {
    throw new Error("Invalid restaurantName");
  }
  router.push({
    name: ROUTE_BOOKING_LANDING_PAGE,
    params: {
      restaurantName: restaurantName.replace(/ /g, "-"),
      encryptedId: reservationId,
    },
  });
}

function showRemovePendingPaymentModal(reservationId: string) {
  reservationIdInsideModal.value = reservationId;
  showCancelConfirmModal.value = true;
}

async function onConfirmRemovePendingPayment() {
  showCancelConfirmModal.value = false;
  await cancelCallback(reservationIdInsideModal.value);
  getPendingPaymentReservation();
}

const state = {
  pendingPaymentReservation,
  upComingReservation,
  pastReservation,
  showQrCodeModal,
  showCancelConfirmModal,
  qrCode,
  loading,
  pageSize,
  pageNumber,
  anyNextPage,
  reservationIdInsideModal,
};
const methods = {
  getPendingPaymentReservation,
  getUpCommingReservation,
  getPastReservation,
  initDummyReservation,
  buildReservationCardProps,
  viewDetailCallback,
  modifyCallback,
  shareCallback,
  qrCallback,
  bookAgainCallback,
  cancelCallback,
  writeReviewCallback,
  payCallBack,
  showRemovePendingPaymentModal,
  onConfirmRemovePendingPayment,
};

export { state, methods };
