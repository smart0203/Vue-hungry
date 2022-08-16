export default function adsMapper(
  restaurantAd: any = {},
  restaurantArray: any[] = []
) {
  const restaurantAdAttribute = restaurantAd.attributes || restaurantAd;
  restaurantAdAttribute.isAds = true;
  const adsPosition = restaurantAdAttribute.position;
  if (
    Array.isArray(restaurantArray) === false ||
    (Array.isArray(restaurantArray) && restaurantArray.length === 0)
  ) {
    return;
  }
  if (typeof adsPosition === "number") {
    const parsedPosition = adsPosition > 0 ? adsPosition - 1 : 1;
    const findIndex = restaurantArray.findIndex(
      (restaurant) => restaurant.id === restaurantAd.id
    );
    // ads data is exist on restaurant array
    if (findIndex !== -1) {
      // if ads position is in 0 or ads postion is bigger or equal than the restaurant than make the restaurant isAds attributes to true
      if (
        (parsedPosition === 0 && findIndex === 0) ||
        parsedPosition >= findIndex
      ) {
        if (restaurantArray[findIndex].attributes) {
          restaurantArray[findIndex].attributes.isAds = true;
        } else {
          restaurantArray[findIndex].isAds = true;
        }
      }
      // if ads position is smaller than the restaurant than swap the index
      else if (parsedPosition < findIndex) {
        const restaurant = restaurantArray[findIndex];
        // set restaurant isAds attributes to be true
        if (restaurant.attributes) {
          restaurant.attributes.isAds = true;
        } else {
          restaurant.isAds = true;
        }
        restaurantArray.splice(findIndex, 1);
        restaurantArray.splice(parsedPosition, 0, restaurant);
      }
    } else {
      if (parsedPosition === 0) {
        restaurantArray.unshift(restaurantAd);
      } else {
        restaurantArray.splice(parsedPosition, 0, restaurantAd);
      }
    }
  }
}
