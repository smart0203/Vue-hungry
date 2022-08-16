import axios from "../lib/myAjax";
import isEmpty from "lodash-es/isEmpty";
import rollbar from "@/lib/rollbar";

/**
 *
 * @param {Boolean} isIncludePackage
 * @param {String} restaurantId
 * @param {Number} adult
 * @param {Number} kids
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {Array} packageIds
 */
function getDates(
  isDineIn,
  isIncludePackage,
  restaurantId,
  adult,
  kids,
  startDate,
  endDate,
  packageIds
) {
  return new Promise((resolve) => {
    const defaultErrorMessage =
      "Oops, something went wrong, failed get available dates";
    try {
      let url =
        Array.isArray(packageIds) &&
        packageIds.length > 0 &&
        (isIncludePackage || !isDineIn)
          ? `/restaurants/${restaurantId}/available_dates_based_on_packages.json`
          : `/restaurants/${restaurantId}/find_available_dates.json?`;
      let payload = {
        adult,
        kids,
        startDate,
        endDate,
        minorVersion: 4,
        ignoreEndDate: false,
        forDelivery: isDineIn ? false : true,
      };

      if (isIncludePackage) {
        payload.isDineIn = isDineIn;
      } else {
        payload.forDineIn = isDineIn;
      }
      if (isIncludePackage || !isDineIn) {
        payload.restaurantPackageIds = packageIds;
      }

      axios({
        method: "POST",
        url: url,
        data: payload,
      })
        .then((resp) => {
          if (!isEmpty(resp.data)) {
            if (resp.data.success === true) {
              const data = resp.data.data || [];
              resolve(data);
              return;
            }
            resolve([]);
            rollbar.error(resp.data.message, { data: resp.data });
            return;
          }
          resolve([]);
          rollbar.error(defaultErrorMessage, { data: resp });
          return;
        })
        .catch((err) => {
          const error = {
            message: defaultErrorMessage,
            cause: err,
          };
          resolve([]);
          rollbar.error(defaultErrorMessage, { error });
        });
    } catch (err) {
      const error = {
        message: defaultErrorMessage,
        cause: err,
      };
      resolve([]);
      rollbar.error(defaultErrorMessage, { error });
    }
  });
}

export default getDates;
