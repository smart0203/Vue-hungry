import Cookies from "js-cookie";

import { isAllowCookie } from "@/helper/storagePermissionHelper";

const COOKIE_EXP_DAY = 365;
const COOKIE_ACCEPT_ADVERTISING = "hungryhub_cookie_accept_advertising";
const COOKIE_ACCEPT_FUNCTIONALITY = "hungryhub_cookie_accept_functionality";
const OLD_PDPA_COOKIE = "hungtyhub_accept_cookies";
const allowCookie = isAllowCookie();

export function isAcceptAdvertisingCookies() {
  if (!allowCookie) {
    return "";
  }
  return Cookies.get(COOKIE_ACCEPT_ADVERTISING);
}

export function isAcceptFunctionalityCookies() {
  if (!allowCookie) {
    return "";
  }
  return Cookies.get(COOKIE_ACCEPT_FUNCTIONALITY);
}

export function acceptAdvertisingCookies(accept: boolean) {
  if (!allowCookie) {
    return;
  }
  Cookies.set(COOKIE_ACCEPT_ADVERTISING, `${accept}`, {
    expires: COOKIE_EXP_DAY,
  });

  //@ts-ignore
  window.isAcceptAdvertisingCookies = accept;
}

export function acceptFunctionalityCookies(accept: boolean) {
  if (!allowCookie) {
    return;
  }
  Cookies.set(COOKIE_ACCEPT_FUNCTIONALITY, `${accept}`, {
    expires: COOKIE_EXP_DAY,
  });

  //@ts-ignore
  window.isAcceptFunctionalityCookies = accept;
}

export function removePreviousPDPACookie() {
  if (!allowCookie) {
    return;
  }
  Cookies.remove(OLD_PDPA_COOKIE);
}

export function enablePixelScripts() {
  const externalScript = ["twitter-script", "addroll-script"];
  externalScript.forEach((item) => {
    const script = document.getElementById(item);
    //@ts-ignore
    script.src = script?.getAttribute("data-src");
  });
}

export function toggleGoogleAnalytic(id: string, isActive: boolean) {
  //@ts-ignore
  window[`ga-disable-${id}`] = isActive || false;
}
