import axios from "../lib/myAjax";
import dayjs from "dayjs";
import { object, number, define, boolean, assert } from "superstruct";
import { API_MINOR_VERSION } from "../constants/api";
import packageFactory from "@/factories/packages";

/**
 *
 * @param {Date} date
 * @param {String} startTime
 * @param {Number} adult
 * @param {Number} kids
 * @param {Boolean} forDelivery
 * @param {Boolean} forDineIn
 * @param {String} restaurantId
 */

const dateFormat = define("date with format 'YYYY-MM-DD'", (val) => {
  return dayjs(val, "YYYY-MM-DD").isValid();
});

const timeFormat = define("time with format 'HH:ss' ", (val) => {
  return dayjs(val, "HH:ss").isValid();
});

const correctPayload = object({
  date: dateFormat,
  startTime: timeFormat,
  adult: number(),
  kids: number(),
  forDelivery: boolean(),
  forDineIn: boolean(),
  minorVersion: number(),
});

function getAvailablePackages(
  date,
  startTime,
  adult,
  kids,
  forDelivery,
  forDineIn,
  restaurantId
) {
  return new Promise((resolve, reject) => {
    try {
      if (!restaurantId) {
        throw new Error("Invalid restaurant id");
      }
      let url = `/restaurants/${restaurantId}/find_available_packages.json`;
      let payload = {
        date,
        adult,
        kids,
        startTime,
        forDelivery,
        forDineIn,
        minorVersion: API_MINOR_VERSION,
      };
      // validation
      assert(payload, correctPayload);
      axios({
        method: "POST",
        url: url,
        data: payload,
      })
        .then((resp) => {
          if (resp.data.success === false) {
            reject({
              message: resp.data.message,
              cause: resp.data,
            });
          } else {
            const parsedPackages = resp.data.data.map((pack) => {
              return packageFactory({
                id: pack.id,
                ...pack.attributes,
              });
            });
            resolve(parsedPackages);
          }
        })
        .catch((err) => {
          if (err.dontReport) {
            reject(null);
            return;
          }
          const error = {
            message:
              "Oops, something went wrong, failed get available packages",
            cause: err,
          };
          reject(error);
        });
    } catch (err) {
      if (err.dontReport) {
        reject(null);
      } else if (err.name === "StructError") {
        const error = {
          message: `Oops, ${err.key} is wrong formatted`,
          cause: err,
        };
        reject(error);
      } else {
        const error = {
          message: "Oops, something went wrong, failed get available packages",
          cause: err,
        };
        reject(error);
      }
    }
  });
}

export default getAvailablePackages;
