import { ref } from "@vue/composition-api";
import humps from "humps";
import qs from "qs";

let isCloseTransitionFinish = ref(false);
let isOpenTransitionFinish = ref(false);
let isOpen = ref(false);

function addBottomSheetMarkToURL() {
  const parsedQueryString = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  });
  parsedQueryString.bottomSheet = true;
  const stringify = qs.stringify(humps.decamelizeKeys(parsedQueryString));

  window.history.pushState(null, null, `?${stringify}`);
}

function removeBottomSheetMarkFromURL() {
  const parsedQueryString = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  });
  parsedQueryString.bottomSheet = null;
  const stringify = qs.stringify(humps.decamelizeKeys(parsedQueryString), {
    skipNulls: true,
  });

  window.history.replaceState(null, null, `?${stringify}`);
}

export {
  isOpen,
  isCloseTransitionFinish,
  isOpenTransitionFinish,
  addBottomSheetMarkToURL,
  removeBottomSheetMarkFromURL,
};
