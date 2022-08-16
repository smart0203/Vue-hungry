import {
  getFromUserStorage,
  saveToUserStorage,
  removeFromUserStorage,
} from "@/helper/userStorage";
import dayjs from "@/lib/dayjs";
import Rollbar from "@/lib/rollbar";

const REFRESH_TOKEN_KEY = "hungryhub_refresh_token";
const ACCESS_TOKEN_KEY = "hungryhub_access_token";
const ACCESS_TOKEN_EXPIRED_IN_KEY = "hungryhub_access_token_expired_in";
const REFRESH_TOKEN_MINIMUM_AGE = 2; // 2 days
const COOKIE_DOMAIN = ".hungryhub.com";

// refresh token
function storageGetRefreshToken() {
  return getFromUserStorage(REFRESH_TOKEN_KEY) || "";
}

function storageRemoveRefreshToken() {
  Rollbar.debug("Removing auth cookie", { name: "refresh token" });
  removeFromUserStorage(REFRESH_TOKEN_KEY, { domain: COOKIE_DOMAIN });
}

function storageSetRefreshToken(token) {
  saveToUserStorage(REFRESH_TOKEN_KEY, token, {
    expires: 60,
    domain: COOKIE_DOMAIN,
  });
}

// access token
function storageGetAccessToken() {
  return getFromUserStorage(ACCESS_TOKEN_KEY, { domain: COOKIE_DOMAIN }) || "";
}

function storageRemoveAccessToken() {
  removeFromUserStorage(ACCESS_TOKEN_KEY, { domain: COOKIE_DOMAIN });
}

function storageSetAccessToken(token) {
  saveToUserStorage(ACCESS_TOKEN_KEY, token, {
    expires: 60,
    domain: COOKIE_DOMAIN,
  });
}

//  access token expired in
function storageGetAccessTokenExpiredIn() {
  return getFromUserStorage(ACCESS_TOKEN_EXPIRED_IN_KEY, {
    domain: COOKIE_DOMAIN,
  });
}

function storageRemoveAccessTokenExpiredIn() {
  removeFromUserStorage(ACCESS_TOKEN_EXPIRED_IN_KEY, { domain: COOKIE_DOMAIN });
}

function storageSetAccessTokenExpiredIn(expiredInSecond = 0) {
  const parsedExpiredIn = dayjs().add(expiredInSecond, "second").toISOString();

  saveToUserStorage(ACCESS_TOKEN_EXPIRED_IN_KEY, parsedExpiredIn, {
    expires: 60,
    domain: COOKIE_DOMAIN,
  });
}

function canRefreshToken() {
  const expiredIn = storageGetAccessTokenExpiredIn() || false;
  const refreshToken = storageGetRefreshToken() || false;
  return expiredIn && refreshToken ? true : false;
}

function shouldRefreshToken() {
  const today = dayjs().startOf("day");
  const expiredIn = storageGetAccessTokenExpiredIn() || false;
  const differentTodayWithExpiredIn = dayjs(expiredIn)
    .startOf("day")
    .diff(today, "day");
  if (differentTodayWithExpiredIn < REFRESH_TOKEN_MINIMUM_AGE) {
    return true;
  }
  return false;
}

function shouldLoginAgain() {
  let isShouldLoginAgain = false;
  const accessToken = storageGetAccessToken();
  const expiredIn = storageGetAccessTokenExpiredIn();
  const refreshToken = storageGetRefreshToken();
  const anyAccessToken = accessToken ? true : false;
  const anyExpiredIn = expiredIn ? true : false;
  const anyRefreshToken = refreshToken ? true : false;
  if (!anyAccessToken || !anyExpiredIn || !anyRefreshToken) {
    const payload = { accessToken, expiredIn, refreshToken };
    const message = "User need to login again";
    Rollbar.warning(message, payload);
    isShouldLoginAgain = true;
  }
  return isShouldLoginAgain;
}

export {
  // expired in
  storageSetAccessTokenExpiredIn,
  storageRemoveAccessTokenExpiredIn,
  storageGetAccessTokenExpiredIn,
  // access token
  storageSetAccessToken,
  storageRemoveAccessToken,
  storageGetAccessToken,
  // refresh token
  storageSetRefreshToken,
  storageRemoveRefreshToken,
  storageGetRefreshToken,
  shouldRefreshToken,
  shouldLoginAgain,
  canRefreshToken,
};
