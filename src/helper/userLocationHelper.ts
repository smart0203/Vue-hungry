export default function askUseCurrentLocation(paramOption = {}) {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      const defaultOption = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      };
      const option = { ...defaultOption, ...paramOption };
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const geoLocation = {
            lat: 0,
            lng: 0,
          };
          geoLocation.lat = position.coords.latitude;
          geoLocation.lng = position.coords.longitude;
          resolve(geoLocation);
        },
        (param) => {
          const error = {
            data: param,
            message:
              "We cannot track your location properly, please type your address",
            cause: param,
          };
          reject(error);
        },
        option
      );
    } else {
      return;
    }
  });
}
