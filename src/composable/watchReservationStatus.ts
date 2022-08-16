import useRealtimeReservation from "./realtimeReservation";

const realtimeReservation = useRealtimeReservation();

const {
  reservationTrueWalletUrl,
  reservationOTPPaymentURL,
  reservationRealtimeDB,
  reservationStatus,
  initReservationRealtimeDB,
  deleteReservationRealtimeDBListener,
} = realtimeReservation;

export {
  reservationTrueWalletUrl,
  reservationOTPPaymentURL,
  reservationRealtimeDB,
  reservationStatus,
  initReservationRealtimeDB,
  deleteReservationRealtimeDBListener,
};
