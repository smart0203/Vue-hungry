import axios from "./myAjax";

export const charge = function charge(param) {
  return new Promise((resolve, reject) => {
    if (param.guess) {
      const distance = param.distance;
      const guess = param.guess;
      const url = `/restaurants/${param.restaurantId}/calculate_package_price.json`;
      try {
        axios({
          method: "post",
          url,
          data: {
            guess,
            distance,
          },
        }).then((result) => {
          try {
            const response = result.data;
            resolve(response);
          } catch (err) {
            reject(err);
          }
        });
      } catch (err) {
        reject(err);
      }
    } else {
      if (
        param.restaurantId !== undefined &&
        param.adult !== undefined &&
        param.packages.length > 0
      ) {
        const url = `/restaurants/${param.restaurantId}/calculate_package_price.json`;
        const kids = param.kids || 0;
        const adult = param.adult;
        const packagesBought = param.packages;
        const distance = param.distance;
        try {
          axios({
            method: "post",
            url,
            data: {
              adult,
              kids,
              distance,
              packageBought: packagesBought,
            },
          }).then((result) => {
            try {
              const response = result.data;
              resolve(response);
            } catch (err) {
              reject(err);
            }
          });
        } catch (err) {
          reject(err);
        }
      } else {
        let missingParams = [];
        if (!param.restaurantId) {
          missingParams.push("restaurantId");
        }
        if (param.adult === undefined) {
          missingParams.push("adult");
        }
        if (param.packages.length === 0) {
          missingParams.push("packages");
        }
        reject(`required paramater is missing ${missingParams.toString()}`);
      }
    }
  });
};
