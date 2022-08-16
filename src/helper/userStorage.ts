import Cookies from "js-cookie";
import { isAllowCookie } from "@/helper/storagePermissionHelper";
import type { CookieAttributes } from "js-cookie";
import useReport from "@/composable/useReport";
import { isValidJsonString } from "./stringHelper";
const TESTING_DOMAIN = [".pages.dev", ".netlify.app"];

function isAbleUseCookie() {
  try {
    const getDomain = () => {
      const host = window.location.host;
      const reversedHostArray = host.split(".").reverse();
      return "." + [reversedHostArray[1], reversedHostArray[0]].join(".");
    };

    if (
      process.env.NODE_ENV === "development" ||
      TESTING_DOMAIN.includes(getDomain())
    ) {
      return false;
    }
    return isAllowCookie() ? true : false;
  } catch (err) {
    useReport({
      level: "error",
      message: "Failed determine isAbleUseCookie",
      errorException: err,
    });
  }
}

function saveToUserStorage(
  key = "",
  val: string | object,
  cookieOption?: CookieAttributes
) {
  try {
    const parsedVal = JSON.stringify(val);
    if (isAbleUseCookie()) {
      Cookies.set(key, parsedVal, cookieOption);
      return;
    }
    localStorage.setItem(key, parsedVal);
  } catch (err) {
    useReport({
      level: "error",
      message: "Failed save item to user storage",
      errorException: err,
    });
  }
}

function getFromUserStorage(key: string) {
  try {
    let val;
    if (isAbleUseCookie()) {
      val = Cookies.get(key) || "";
    } else {
      val = localStorage.getItem(key) || "";
    }
    if (typeof val === "string") {
      if (val.length === 0) {
        return val;
      }
      if (isValidJsonString(val)) {
        return JSON.parse(val);
      }
      return val;
    }
    return val;
  } catch (err) {
    useReport({
      level: "error",
      message: "Failed get item from user storage",
      errorException: err,
      object: { key },
    });
  }
}

function removeFromUserStorage(key: string, cookieOption?: CookieAttributes) {
  try {
    if (isAbleUseCookie()) {
      return Cookies.remove(key, cookieOption);
    }
    return localStorage.removeItem(key);
  } catch (err) {
    useReport({
      level: "error",
      message: "Failed remove item from user storage",
      errorException: err,
      object: { key },
    });
  }
}

export {
  isAbleUseCookie,
  getFromUserStorage,
  saveToUserStorage,
  removeFromUserStorage,
};
