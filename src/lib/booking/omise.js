import humps from "humps";
const createOmiseToken = function omiseCreateToken(cardObject) {
  return new Promise((resolve, reject) => {
    try {
      window.Omise.createToken(
        "card",
        humps.decamelizeKeys(cardObject),
        (statusCode, response) => {
          if (
            response.object == "error" ||
            response.card.security_code_check === false
          ) {
            let messageText =
              "We're sorry, something went wrong while checking your credit card";
            if (response.object == "error") {
              messageText = response.message;
            } else if (response.object == "token") {
              messageText = "We're sorry, we can't process your credit card";
            }
            reject({
              isSucces: false,
              message: messageText,
              data: {
                response: response,
                payload: {
                  name: cardObject.name,
                  number: cardObject.number,
                  expirationMonth: cardObject.expirationMonth,
                  expirationYear: cardObject.expirationYear,
                },
              },
            });
          } else {
            if (response.id) {
              resolve(response.id);
            } else {
              reject({
                isSucces: false,
                message: "No token found",
                data: {
                  response: response,
                  payload: {
                    name: cardObject.name,
                    number: cardObject.number,
                    expirationMonth: cardObject.expirationMonth,
                    expirationYear: cardObject.expirationYear,
                  },
                },
              });
            }
          }
        }
      );
    } catch (err) {
      reject({
        isSucces: false,
        message: "Failed to omise create token",
        data: {
          cause: err,
          payload: {
            name: cardObject.name,
            number: cardObject.number,
            expirationMonth: cardObject.expirationMonth,
            expirationYear: cardObject.expirationYear,
          },
        },
      });
    }
  });
};
export default createOmiseToken;
