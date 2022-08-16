import { isAllowLocalStorage } from "@/helper/storagePermissionHelper";

let localLanguage = {
  key: "hungryhub_lang",
  description: "current hungryhub language",
};

function storageSetLanguage(lang) {
  if (isAllowLocalStorage()) {
    localStorage.setItem(localLanguage.key, lang);
  }
}

function storageGetLanguage() {
  if (isAllowLocalStorage()) {
    const lang = localStorage.getItem(localLanguage.key);
    if (lang) {
      if (lang !== "en" && lang !== "th") {
        return "th";
      }
      return lang;
    }
    return "th";
  }
  return "th";
}

let userProfile = {
  key: "hungryhub_user_profile",
  description: "Saved user profile",
};

function storageSetUserProfile(profile) {
  if (isAllowLocalStorage()) {
    localStorage.setItem(userProfile.key, JSON.stringify(profile));
  }
}

function storageGetUserProfile() {
  if (isAllowLocalStorage()) {
    const profile = localStorage.getItem(userProfile.key);
    if (profile) {
      const parsed = JSON.parse(profile);
      return parsed;
    }
    return null;
  }
  return null;
}

function storageRemoveUserProfile() {
  if (isAllowLocalStorage()) {
    localStorage.removeItem(userProfile.key);
  }
}

let userLocation = {
  key: "hungtyhub_user_location",
  description: "Saved user location based on address search",
};

function storageSetUserLocation(location) {
  if (isAllowLocalStorage()) {
    localStorage.setItem(userLocation.key, JSON.stringify(location));
  }
}

function storageGetUserLocation() {
  if (isAllowLocalStorage()) {
    const location = localStorage.getItem(userLocation.key);
    if (location) {
      const parsed = JSON.parse(location);
      return parsed;
    }
    return null;
  }
  return null;
}

let markHasSendPurchasedEvent = {
  key: "hungryhub_tracked_reservation",
  description: "To mark reservation has benn tracked",
};

function storageSetTrackedResevation(reservationId) {
  if (isAllowLocalStorage()) {
    localStorage.setItem(markHasSendPurchasedEvent.key, reservationId);
  }
}

function storageGetTrackedReservation() {
  if (isAllowLocalStorage()) {
    return localStorage.getItem(markHasSendPurchasedEvent.key);
  }
  return "";
}

let voucherPurchasedEvent = {
  key: "hungryhub_voucher_purchased",
  description: "To mark voucher purchase event has benn tracked",
};

function storageSetVoucherPurchased(purchaseId) {
  if (isAllowLocalStorage()) {
    localStorage.setItem(voucherPurchasedEvent.key, purchaseId);
  }
}

function storageGetVoucherPurchased() {
  if (isAllowLocalStorage()) {
    return localStorage.getItem(voucherPurchasedEvent.key);
  }
  return "";
}

const see3DView = "hungryhub_3d_view_restaurant_id";

function storegeSetSeed3DView(restaurantId) {
  if (isAllowLocalStorage() && restaurantId) {
    localStorage.setItem(see3DView, restaurantId);
  }
}

function storageGetSee3DView() {
  if (isAllowLocalStorage()) {
    return localStorage.getItem(see3DView);
  }
  return "";
}

export {
  storageSetLanguage,
  storageGetLanguage,
  storageSetUserProfile,
  storageGetUserProfile,
  storageRemoveUserProfile,
  storageSetUserLocation,
  storageGetUserLocation,
  storageSetTrackedResevation,
  storageGetTrackedReservation,
  storageGetSee3DView,
  storegeSetSeed3DView,
  storageSetVoucherPurchased,
  storageGetVoucherPurchased,
};
