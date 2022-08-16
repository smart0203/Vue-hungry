import { axios } from "@/lib/fetcher";
import rollbar from "@/lib/rollbar";
import {
  isValid as isValidCorporateBooking,
  eventId,
} from "@/composable/corporateEvent";

/**
 *
 * @param {Boolean} isDineIn
 * @param {String} restaurantId
 * @param {Number} adult
 * @param {Number} kids
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {Array} packageIds
 */
async function getRestaurantPackages(restaurantId) {
  const defaultErrorMessage =
    "Oops, something went wrong, failed get restaurant packages";
  const url = `/restaurant_packages.json`;
  if (!restaurantId) {
    throw new Error("restaurantId paramater is missing");
  }
  try {
    let params = {
      restaurantId: restaurantId,
      includeRestaurant: false,
      corporateEventId: "",
    };

    if (isValidCorporateBooking.value === true) {
      params.corporateEventId = eventId.value;
    }

    const result = await axios({
      url: url,
      method: "get",
      params,
    });
    if (result.data) {
      const packages = result.data.data;
      if (packages && packages.length && result.data.status) {
        const parsedPackages = packages.map((pack) => {
          return {
            id: pack.id,
            ...pack.attributes,
          };
        });
        return {
          isSuccess: true,
          data: parsedPackages,
          message: result.data.message,
        };
      }
      return {
        isSuccess: false,
        data: [],
        message: result.data.message || defaultErrorMessage,
      };
    }
    return {
      isSuccess: false,
      data: [],
      message: defaultErrorMessage,
    };
  } catch (err) {
    rollbar.error(err.message || defaultErrorMessage, err, { restaurantId });
    return {
      isSuccess: false,
      data: [],
      message: err.message || defaultErrorMessage,
    };
  }
}

export default getRestaurantPackages;
