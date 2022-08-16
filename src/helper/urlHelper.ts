// @ts-ignore
import { cdnUrl } from "@/composable/webConfig";
import { computed } from "@vue/composition-api";

const baseUrl = process.env.VUE_APP_API_DOMAIN;
const appMode = process.env.VUE_APP_MODE;
const baseUrlAsset = computed(() => {
  return cdnUrl.value || "https://d38lri8pyzrvor.cloudfront.net";
});
import qs from "qs";
import humps from "humps";

const rebuildUrl = function rebuildUrl(url = "", type = "link") {
  if (url && url.includes("http") === false) {
    if (type === "asset") {
      return baseUrlAsset.value + url;
    }
    return baseUrl + url;
  } else if (appMode === "development" || appMode === "staging") {
    return url;
  }
  return url;
};

const forceHttpsUrl = function forceHttpsUrl(url = "") {
  if (!url) {
    throw new Error("invalid url");
  }
  return url.replace("http://", "https://");
};

const restaurantUrl = function restaurantUrl(
  restaurantEncryptedId: string | number = "",
  restaurantBranchId: string | number = "",
  lang: number
) {
  if (restaurantBranchId !== null) {
    return `/restaurants/search?branch_id=${restaurantBranchId}&locale=${lang}`;
  }
  return `/restaurants/${restaurantEncryptedId}?locale=${lang}`;
};

function historyPushState(
  stateName: string,
  stateValue: string | number | boolean
) {
  const parsedQueryString = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  });
  if (
    typeof stateName === "string" &&
    stateName.length &&
    typeof stateValue !== "object" &&
    Array.isArray(stateValue) === false
  ) {
    parsedQueryString[stateName] = `${stateValue}`;
    const stringify = qs.stringify(humps.decamelizeKeys(parsedQueryString));
    window.history.pushState(stateName, "", `?${stringify}`);
  }
}

function historyRemoveState(stateName: string) {
  const parsedQueryString = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  });
  if (typeof stateName === "string") {
    parsedQueryString[stateName] = undefined;
    const stringify = qs.stringify(humps.decamelizeKeys(parsedQueryString), {
      skipNulls: true,
    });
    window.history.replaceState(null, "", `?${stringify}`);
  }
}

export {
  rebuildUrl,
  restaurantUrl,
  forceHttpsUrl,
  historyPushState,
  historyRemoveState,
};
