import useHttp from "@/composable/useHttp";

export function getDetailReservation(
  reservationId: string,
  accessToken?: string
) {
  const payload = {
    url: "",
    params: {},
  };
  if (typeof accessToken === "string" && accessToken.length) {
    payload.params = {
      accessToken,
    };
    payload.url = `reservations/${reservationId}.json`;
  } else {
    payload.url = `reservations/${reservationId}/detail.json`;
  }
  return useHttp(payload);
}
