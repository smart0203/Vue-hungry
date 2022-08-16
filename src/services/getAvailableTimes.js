import axios from "../lib/myAjax";
import orderBy from "lodash-es/orderBy";
/**
 *
 * @param {Boolean} isDineIn
 * @param {Boolean} isIncludePackage
 * @param {String} restaurantId
 * @param {Number} adult
 * @param {Number} kids
 * @param {Date} date
 * @param {Array} packageIds
 */
function getTimes(
  isDineIn,
  isIncludePackage,
  restaurantId,
  adult,
  kids,
  date,
  packageIds,
  isOrderNow = false
) {
  return new Promise((resolve, reject) => {
    try {
      let url =
        Array.isArray(packageIds) &&
        packageIds.length > 0 &&
        (isIncludePackage || !isDineIn)
          ? `/restaurants/${restaurantId}/available_start_times_based_on_packages.json`
          : `/restaurants/${restaurantId}/find_available_start_times.json?`;
      let payload = {
        adult,
        kids,
        date,
        minorVersion: 4,
        forDineIn: isDineIn ? true : false,
        forDelivery: isDineIn ? false : true,
        isOrderNow: isDineIn ? false : isOrderNow,
      };

      if (isIncludePackage || !isDineIn) {
        payload.restaurantPackageIds = packageIds;
      }
      axios({
        method: "POST",
        url: url,
        data: payload,
      })
        .then((resp) => {
          const times = resp.data.data.map((time) => {
            return {
              startTime: time.startTime,
              availability: time.availability,
            };
          });
          const sortedTimes = orderBy(times, "startTime", "asc");
          resolve(sortedTimes);
        })
        .catch((err) => {
          if (err.dontReport) {
            reject(null);
          } else {
            const error = {
              message: "Oops, something went wrong, failed get available times",
              cause: err,
            };
            reject(error);
          }
        });
    } catch (err) {
      const error = {
        message: "Oops, something went wrong, failed get available times",
        cause: err,
      };
      reject(error);
    }
  });
}

export default getTimes;
