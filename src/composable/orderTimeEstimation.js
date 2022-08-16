import { ref } from "@vue/composition-api";
import getOrderTimeEstimation from "@/services/getOrderTimeEstimation";
import store from "@/store/index";
import { PICK_UP, DELIVERY } from "@/lib/constant";

let isLoading = ref(false);
let isSuccess = ref(true);
let errorMessage = ref("");
let orderNowEstimation = ref(0);
const bookingState = store.state.booking;

async function checkOrderNowEstimation() {
  if (!store.state.restaurant.isSupportOrderNow) {
    return;
  }
  const packages = await store.dispatch("bookingPackage/buildPackagePayload");
  const { lat, lng } = bookingState.location;
  const restaurantId = store.state.restaurant.restaurantId;
  const orderType = () => {
    if (bookingState.bookingMethod === PICK_UP) {
      return "self_pickup";
    } else if (bookingState.bookingMethod === DELIVERY) {
      return "delivery";
    }
    return "dine_in";
  };
  isLoading.value = true;
  const result = await getOrderTimeEstimation(
    packages,
    lat,
    lng,
    restaurantId,
    orderType()
  );
  if (result.isSuccess) {
    isSuccess.value = true;
    errorMessage.value = "";
    orderNowEstimation.value = result.data.timeEstimation;
  } else {
    isSuccess.value = false;
    errorMessage.value = result.data.message;
    orderNowEstimation.value = 0;
  }
  isLoading.value = false;
}

export {
  checkOrderNowEstimation,
  isLoading,
  isSuccess,
  errorMessage,
  orderNowEstimation,
};
