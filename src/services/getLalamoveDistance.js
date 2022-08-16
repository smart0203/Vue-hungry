import axios from "../lib/myAjax";

/**
 *
 * @param {String} restaurantId
 * @param {String} lng
 * @param {String} lat
 */

function getDistance(restaurantId, lng, lat) {
  return new Promise((resolve, reject) => {
    try {
      let url = `/restaurants/${restaurantId}/find_visitor_distance.json?lng=${lng}&lat=${lat}`;
      axios({
        method: "GET",
        url: url,
      })
        .then((resp) => {
          if (resp.success === false) {
            reject({
              message: resp.message,
              cause: resp.data,
            });
          } else {
            resolve(resp.data);
          }
        })
        .catch((err) => {
          if (err.dontReport) {
            reject({
              message: null,
              cause: null,
            });
          } else {
            const error = {
              message: "Oops, something went wrong, failed get distance",
              cause: err,
            };
            reject(error);
          }
        });
    } catch (err) {
      const error = {
        message: "Oops, something went wrong, failed get distance",
        cause: err,
      };
      reject(error);
    }
  });
}

export default getDistance;
