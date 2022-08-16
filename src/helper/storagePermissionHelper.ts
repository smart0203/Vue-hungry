function isAllowLocalStorage() {
  try {
    if (window.localStorage) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

function isAllowCookie() {
  try {
    if (navigator.cookieEnabled) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export { isAllowCookie, isAllowLocalStorage };
