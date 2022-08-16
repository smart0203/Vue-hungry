import { watch, ref } from "@vue/composition-api";
import { useStorage, useIntervalFn } from "@vueuse/core";
import { isAllowLocalStorage } from "@/helper/storagePermissionHelper";
import dayjs from "@/lib/dayjs";

import useRealTimeReservation from "@/composable/realtimeReservation";
const {
  reservationStatus,
  initReservationRealtimeDB,
  deleteReservationRealtimeDBListener,
} = useRealTimeReservation();

const DEFAULT_QR_PAYMENT_TIME_OUT = 5000; // 5 second

const localStorageKey = {
  reservationId: "hungryhub_watched_reservation_id",
  landingURL: "hungryhub_watched_reservation_landing_url",
  expiredAt: "hungryhub_watched_reservation_expired_at",
};

let storedReservationId = isAllowLocalStorage()
  ? useStorage(localStorageKey.reservationId, "")
  : ref(null);
let storedReservationLandingURL = isAllowLocalStorage()
  ? useStorage(localStorageKey.landingURL, "")
  : ref(null);
let storedReservationExpiredAt = isAllowLocalStorage()
  ? useStorage(localStorageKey.expiredAt, "")
  : ref(null);
let reservationIsExpired = ref(false);

watch(
  () => reservationStatus.value,
  (newVal, oldVal) => {
    if (newVal === "pending_arrival" && oldVal === "waiting_for_payment") {
      onReservationConfirmed();
    }
  }
);

watch(
  () => reservationIsExpired.value,
  (newVal, oldVal) => {
    if (newVal === true && oldVal === false) {
      onReservationExpired();
    }
  }
);

function saveReservationId(reservationId) {
  let parsedReservationId = "";
  if (typeof reservationId === "string") {
    parsedReservationId = reservationId;
  } else if (typeof reservationId === "number") {
    parsedReservationId = `${reservationId}`;
  } else {
    throw new Error("Reservation Id should be number or string");
  }
  storedReservationId.value = parsedReservationId;
}

function saveReservationLandingURL(url) {
  storedReservationLandingURL.value = url;
}

function removeReservationId() {
  storedReservationId.value = null;
}

function removeReservationLandingURL() {
  storedReservationLandingURL.value = null;
}

function saveReservationExpiredAt(expiredAt) {
  if (!expiredAt) {
    storedReservationExpiredAt.value = dayjs()
      .add(DEFAULT_QR_PAYMENT_TIME_OUT, "millisecond")
      .utc()
      .toISOString();
    return;
  }
  storedReservationExpiredAt.value = expiredAt;
}

function removeReservationExpiredAt() {
  storedReservationExpiredAt.value = null;
}

function onReservationConfirmed() {
  if (storedReservationId && storedReservationLandingURL) {
    window.location = storedReservationLandingURL.value;
    deleteReservationRealtimeDBListener();
    removeReservationLandingURL();
    removeReservationId();
    removeReservationExpiredAt();
  }
}

function onReservationExpired() {
  deleteReservationRealtimeDBListener();
  removeReservationLandingURL();
  removeReservationId();
  removeReservationExpiredAt();
}

function startReservationTimeOutChecker() {
  if (!storedReservationExpiredAt.value) {
    return;
  }
  const checker = () => {
    const now = dayjs();
    const diff = dayjs(storedReservationExpiredAt.value).diff(now, "second");
    if (diff < 0) {
      reservationIsExpired.value = true;
      pause();
    }
  };
  const { pause } = useIntervalFn(checker, 1000);
}

async function startWatchQRPaymentStatus() {
  if (
    typeof storedReservationId.value === "string" &&
    storedReservationId.value.length
  ) {
    await initReservationRealtimeDB(storedReservationId.value);
    startReservationTimeOutChecker();
  }
}

const state = {
  storedReservationId,
  storedReservationLandingURL,
};

const methods = {
  removeReservationId,
  removeReservationLandingURL,
  removeReservationExpiredAt,
  onReservationExpired,
  saveReservationId,
  saveReservationLandingURL,
  saveReservationExpiredAt,
  startReservationTimeOutChecker,
  startWatchQRPaymentStatus,
};

export { state, methods };
