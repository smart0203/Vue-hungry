import { getRestaurantsDeliveryFee } from "@/services/restaurant";
import { convertToNumber } from "@/helper/stringHelper";
import askUseCurrentLocation from "@/helper/userLocationHelper";
import store from "@/store/index";

async function generateRestaurantDeliveryFee(restaurantData, location) {
  if (Array.isArray(restaurantData) === false) {
    throw new Error("Restaurant data is not array");
  }
  const isPermited =
    store.state?.webConfig?.config?.showDistanceOnSearchPage || false;
  if (!isPermited || restaurantData.length === 0) {
    return;
  }
  try {
    restaurantData.forEach((restaurant) => {
      restaurant.deliveryProperty.isLoading = true;
      restaurant.deliveryProperty.isShow = true;
    });
    let lat = 0;
    let lng = 0;
    if (
      location &&
      typeof location.lat === "number" &&
      typeof location.lng === "number"
    ) {
      lat = location.lat;
      lng = location.lng;
    } else {
      // if no lat lng supplied then use current user location
      const userLocation = await askUseCurrentLocation();
      lat = userLocation.lat;
      lng = userLocation.lng;
    }
    if (typeof lat === "number" && typeof lng === "number") {
      const restaurantIds = restaurantData.map((restaurant) => restaurant.id);
      const resultRestauransDeliveryFee = await getRestaurantsDeliveryFee(
        restaurantIds,
        lat,
        lng
      );
      if (resultRestauransDeliveryFee.isSuccess) {
        restaurantData.forEach((restaurant) => {
          const findDeliveryFee = resultRestauransDeliveryFee.data.filter(
            (restauranDeliveryFee) => {
              return restaurant.id == restauranDeliveryFee.id;
            }
          );
          if (findDeliveryFee.length) {
            restaurant.deliveryProperty.isLoading = false;
            restaurant.deliveryProperty = {
              ...findDeliveryFee[0],
              ...restaurant.deliveryProperty,
            };
            restaurant.deliveryProperty.deliveryFee = convertToNumber(
              restaurant.deliveryProperty.deliveryFee
            );
            restaurant.deliveryProperty.isShow =
              restaurant.deliveryProperty.success;
          }
        });
      } else {
        this.$alert.error(resultRestauransDeliveryFee.message);
      }
    } else {
      restaurantData.forEach((restaurant) => {
        restaurant.deliveryProperty.isLoading = false;
        restaurant.deliveryProperty.isShow = false;
      });
    }
  } catch (err) {
    restaurantData.forEach((restaurant) => {
      restaurant.deliveryProperty.isShow = false;
      restaurant.deliveryProperty.isLoading = false;
    });
  }
}

export default generateRestaurantDeliveryFee;
