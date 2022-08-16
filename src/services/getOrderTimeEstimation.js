import { axios } from "@/lib/fetcher";
import rollbar from "@/lib/rollbar";

async function checkOrderNowEstimation(
  packages,
  lat,
  lng,
  restaurantId,
  orderType
) {
  if (!packages || !lat || !lng) {
    throw new Error("packages or lat or lng paramater is missing");
  }
  if (
    orderType !== "dine_in" &&
    orderType !== "delivery" &&
    orderType !== "self_pickup"
  ) {
    throw new Error(
      "orderType paramater is not dine_in or delivery or self_pickup"
    );
  }
  const defaultErrorMessage =
    "Oops, something went wrong, failed get order now estimation";
  const url = `/restaurants/check_order_now_estimation`;
  try {
    const result = await axios({
      url: url,
      method: "post",
      data: {
        restaurantId: restaurantId,
        orderType: orderType,
        packages: packages,
        destination: {
          lat: lat,
          lon: lng,
        },
      },
    });
    if (result.data) {
      if (result.data.data && result.data.success) {
        return {
          isSuccess: true,
          data: result.data.data,
          message: result.data.message,
        };
      }
      return {
        isSuccess: false,
        data: "",
        message: result.data.message || defaultErrorMessage,
      };
    }
    return {
      isSuccess: false,
      data: "",
      message: defaultErrorMessage,
    };
  } catch (err) {
    rollbar.error(err.message || defaultErrorMessage, err.data);
    return {
      isSuccess: false,
      data: "",
      message: err.message || defaultErrorMessage,
    };
  }
}

export default checkOrderNowEstimation;
