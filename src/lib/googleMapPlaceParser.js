const MAP_API_KEY = process.env.VUE_APP_GOOGLE_MAP_API_KEY;
import orderBy from "lodash-es/orderBy";
import Rollbar from "./rollbar";

const getPlaceID = (geoLocation) => {
  return new Promise((resolve, reject) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${geoLocation.lat},${geoLocation.lng}&key=${MAP_API_KEY}`;
      fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          const locationData = response.results[0];
          if (locationData) {
            const placeId = locationData.place_id;
            resolve(placeId);
          } else {
            if (response.status === "ZERO_RESULTS") {
              reject("ZERO_RESULTS");
            } else {
              const error = {
                data: response,
                cause: "Google map API return wrong format",
                message: "failed get place ID from lat, lng",
              };
              Rollbar.error(error.message, {
                message: error.cause,
                data: error.data,
              });
              reject(error);
            }
          }
        });
    } catch (err) {
      const error = {
        data: err,
        cause: err,
        message: "failed get place ID from lat, lng",
      };
      Rollbar.error(error.message, {
        message: error.cause,
        data: error.data,
      });
      reject(error);
    }
  });
};

const getPlaceDetail = (placeId) => {
  return new Promise((resolve, reject) => {
    try {
      const placeService = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );
      placeService.getDetails(
        {
          placeId,
          fields: ["name", "formatted_address", "geometry.location"],
        },
        (place) => {
          if (!place) {
            const error = {
              data: place,
              cause: "Google map API return wrong format",
              message: "failed get place detail from place ID",
            };
            Rollbar.error(error.message, {
              message: error.cause,
              data: error.data,
            });
            reject(error);
          } else {
            const selectedLocation = {
              placeName: place.name,
              detail: place.formatted_address,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };
            resolve(selectedLocation);
          }
        }
      );
    } catch (err) {
      const error = {
        data: err,
        cause: err,
        message: "failed get place detail from place ID",
      };
      Rollbar.error(error.message, {
        message: error.cause,
        data: error.data,
      });
      reject(error);
    }
  });
};

const getAddress = (geoLocation) => {
  return new Promise((resolve, reject) => {
    if (geoLocation === null) {
      const error = {
        data: geoLocation,
        cause: "Required parammter 'geo location' not found",
        message: "failed get place detail from place ID",
      };
      Rollbar.error(error.message, {
        message: error.cause,
        data: error.data,
      });
      reject(error);
    } else {
      try {
        // call the function
        getPlaceID(geoLocation)
          .then((placeId) => {
            getPlaceDetail(placeId).then((selectedLocation) => {
              resolve(selectedLocation);
            });
          })
          .catch((err) => {
            if (err === "ZERO_RESULTS") {
              reject({
                data: "",
                message: "address not found",
              });
            } else {
              const error = {
                data: err,
                cause: err,
                message: "failed get Address",
              };
              Rollbar.error(error.message, {
                message: error.cause,
                data: error.data,
              });
              reject(error);
            }
          });
      } catch (err) {
        const error = {
          data: err,
          cause: err,
          message: "failed get Address",
        };
        Rollbar.error(error.message, {
          message: error.cause,
          data: error.data,
        });
        reject(error);
      }
    }
  });
};

const getDistanceToRestaurant = (payload) => {
  return new Promise((resolve, reject) => {
    try {
      const lat = payload.currentLocation.lat;
      const lng = payload.currentLocation.lng;
      const restLat = payload.restaurantLocation.lat;
      const restLng = payload.restaurantLocation.lng;

      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: new window.google.maps.LatLng(restLat, restLng),
          destination: new window.google.maps.LatLng(lat, lng),
          travelMode: "DRIVING",
          avoidTolls: true,
          provideRouteAlternatives: true,
          unitSystem: window.google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
          if (status === "OK") {
            if (response.routes.length > 0) {
              const arrayOfDistance = response.routes.map((route) => {
                return route.legs[0];
              });
              const shortedDistanceFirst = orderBy(
                arrayOfDistance,
                "distance.value"
              );
              resolve(shortedDistanceFirst[0].distance);
            } else {
              const error = {
                cause: "No routes found from user to restaurant",
                message:
                  "Oops, no routes found from your location to the restaurant",
              };
              Rollbar.error(error.message, error.cause);
              reject(error);
            }
          } else if (status === "ZERO_RESULTS") {
            const error = {
              cause: "No routes found from user to restaurant",
              message:
                "Oops, no routes found from your location to the restaurant",
            };
            Rollbar.error(error.message, error.cause);
            reject(error);
          } else {
            const error = {
              cause: response,
              message:
                "Oops, something went wrong, failed to calculate distance",
            };
            Rollbar.error(error.message, error.cause);
            reject(error);
          }
        }
      );
    } catch (err) {
      const error = {
        cause: err,
        message: "Oops, something went wrong, failed to calculate distance",
      };
      Rollbar.error(error.message, error.cause);

      reject(error);
    }
  });
};

export { getAddress, getPlaceID, getPlaceDetail, getDistanceToRestaurant };
