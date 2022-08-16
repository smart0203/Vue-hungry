import { ref, computed } from "@vue/composition-api";
import isEmpty from "lodash-es/isEmpty";
import { initFirebaseDatabase, firebaseDatabase } from "@/lib/firebaseDatabase";
import { ref as firebaseRef, onValue, off } from "firebase/database";
import rollbar from "@/lib/rollbar";
import * as alert from "@/lib/alert";
import { Retrier } from "@jsier/retrier";

type ReservationRealtimeDB = {
  authorization_url?: string | null;
  delivery_status: string | null;
  facebook_event_id: string | null;
  true_wallet_url?: string | null;
  status: string | null;
  encrypted_id?: string;
  reservation_id?: string;
};

type ReservationRealtimeDBInstnace = ReturnType<typeof firebaseRef>;

function init(type?: string) {
  const reservationRealtimeDBInstance = ref<
    ReservationRealtimeDBInstnace | Record<string, unknown>
  >({});
  const reservationRealtimeDB = ref<ReservationRealtimeDB | string>("");

  const reservationStatus = computed(() => {
    return typeof reservationRealtimeDB.value !== "string"
      ? reservationRealtimeDB.value.status
      : "";
  });

  const reservationOTPPaymentURL = computed(() => {
    if (typeof reservationRealtimeDB.value !== "string") {
      return reservationRealtimeDB.value.authorization_url;
    }
    return undefined;
  });

  const reservationTrueWalletUrl = computed(() => {
    if (typeof reservationRealtimeDB.value !== "string") {
      return reservationRealtimeDB.value.true_wallet_url;
    }
    return undefined;
  });

  const watchType =
    type === "watch-voucher" ? "voucher_transaction" : "reservations";

  async function initReservationRealtimeDB(
    id: string,
    isAyncReservation = false
  ) {
    const refPath = !isAyncReservation ? `${watchType}/${id}` : id;
    if (!id) {
      throw new Error(
        "Failed start reservation realtime database, id is missing"
      );
    }

    try {
      const isInitSuccess = await initFirebaseDatabase();
      if (isInitSuccess && firebaseDatabase.value) {
        const firebaseDb = firebaseRef(firebaseDatabase.value, refPath);
        if (!isEmpty(firebaseDb)) {
          reservationRealtimeDBInstance.value = firebaseDb;

          onValue(firebaseDb, (data) => {
            const updatedValue = data.val();
            if (updatedValue) {
              reservationRealtimeDB.value = updatedValue;
            }
            // try to get correct database reference
            // if timeout have reached, then show error to user
            else {
              const options = { limit: 15, delay: 2000 };
              const retrier = new Retrier(options);
              retrier
                .resolve((attemptCount) => {
                  rollbar.info(
                    `Trying get correct firebase reference path, attemp number ${attemptCount}`
                  );
                  return new Promise((resolve, reject) => {
                    const updatedValue = data.val();
                    if (updatedValue) {
                      reservationRealtimeDB.value = updatedValue;
                      resolve(reservationRealtimeDB.value);
                    } else {
                      reject();
                    }
                  });
                })
                .then(
                  (result) =>
                    rollbar.info(
                      `Success get correct firebase reference path ${result}`
                    ),
                  () => {
                    rollbar.error(
                      "failed creating reservation, Invalid database reference from server",
                      { firebaseRef }
                    );
                  }
                );
            }
          });
        }

        return;
      }
    } catch (err: any) {
      alert.error(
        "Oops, something went wrong, failed watch reservation status"
      );
      rollbar.error(err);
    }
  }

  function deleteReservationRealtimeDBListener() {
    if (!isEmpty(reservationRealtimeDBInstance.value)) {
      // @ts-ignore
      off(reservationRealtimeDBInstance.value);
    }
  }

  return {
    reservationRealtimeDB,
    reservationStatus,
    reservationOTPPaymentURL,
    reservationTrueWalletUrl,
    initReservationRealtimeDB,
    deleteReservationRealtimeDBListener,
  };
}

export default init;
