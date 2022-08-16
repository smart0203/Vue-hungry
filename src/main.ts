// @ts-nocheck
import "./lib/Date.toLocaleDateString";
import "./lib/installCompositionAPI";

import Vue from "vue";
import App from "./App.vue";
import router from "./router/router";
import { routerPushGuard } from "@/router/routerGuard";
import store from "./store/index";
import { i18n } from "./lib/i18n/i18n";
import "./registerServiceWorker";

// custom lib
import dayjs from "./lib/dayjs";
import * as alert from "./lib/alert";
import rollbar from "./lib/rollbar";
import PortalVue from "portal-vue";
import { importComponent } from "./helper/loadComponentAsync";
import { vfmPlugin } from "vue-final-modal";
import veeValidateLocalize from "./lib/veeValidateLocalize";

import moneyFormat from "./lib/money";
import track from "./services/userTracking";
import { rebuildUrl } from "./helper/urlHelper";
import { numberFormatThousand } from "./helper/stringHelper";
import { isDesktop, isMobile, isTablet } from "./helper/screenSizeHelper";
import useLazyImport from "./composable/useLazyImport";
import { storageGetLanguage } from "@/lib/localStorage";

// add IntersectionObserver polyfill (for safari 11)
if (!("IntersectionObserver" in window)) {
  require("intersection-observer");
}
// add fetch polyfill
if (!("fetch" in window)) {
  require("whatwg-fetch");
}
// add modernizr-custom
require("../public/external/modernizr-custom");
// global component
import HHImage from "./components/Shared/HHImage.vue";
import HHAcceptTerm from "./components/Shared/HHAcceptTerm.vue";
import HHTextTruncate from "./components/Shared/HHTextTruncate.vue";

// create global placeholder for img loading & error img
import simpleSvgPlaceholder from "@cloudfour/simple-svg-placeholder";
window.errorImagePlaceholder = simpleSvgPlaceholder({
  text: "Hungry Hub",
  bgColor: window.cssVar("--main-red"),
  textColor: "#ffffff",
});
window.addEventListener("rejectionhandled", function () {
  return;
});
// window.Omise.setPublicKey(process.env.VUE_APP_OMISE_PUBLIC_KEY);
// vendor
import VModal from "vue-js-modal";
import VueObserveVisibility from "vue-observe-visibility";
import VueMeta from "vue-meta";
import isSupportWebp from "@/helper/isSupportWebpHelper";
import VueCodeMirror from "vue-codemirror-lite";

isSupportWebp();
const isDev = process.env.NODE_ENV === "development" ? true : false;

Vue.use(VueMeta);
Vue.use(VModal, { dynamic: true, injectModalsContainer: true });
Vue.use(VueObserveVisibility);
// Vue.use(vMediaQuery.default);
Vue.use(PortalVue);
Vue.use(vfmPlugin);
Vue.use(VueCodeMirror);
Vue.prototype.$useLazyImport = useLazyImport;
Vue.prototype.$alert = alert;
Vue.prototype.$rollbar = rollbar;
Vue.prototype.$dayjs = dayjs;
Vue.prototype.$track = track;
Vue.prototype.$money = moneyFormat;
Vue.prototype.$url = rebuildUrl;
Vue.prototype.$i18nInstance = i18n;
Vue.prototype.$veeValidateLocalize = veeValidateLocalize;
Vue.prototype.$formatThousand = numberFormatThousand;
Vue.prototype.$routerPushGuard = routerPushGuard;
Vue.config.productionTip = false;
Vue.config.performance = isDev ? true : false;

if (isDev === false) {
  Vue.config.warnHandler = function warnHandlerF(error) {
    console.debug("report vue warn to rollbar");
    rollbar.error("Vue warn", error);
  };

  Vue.config.errorHandler = function errorHandlerF(error) {
    console.debug("report vue error to rollbar");
    rollbar.error("Vue error", error);
  };
}

Vue.component("HhImage", HHImage);
Vue.component("HHAcceptTerm", HHAcceptTerm);
Vue.component("HHTextTruncate", HHTextTruncate);
Vue.prototype.$loadComponentAsync = importComponent;

Vue.mixin({
  computed: {
    currentLang() {
      return storageGetLanguage();
    },
    isMobile() {
      return isMobile;
    },
    isDesktop() {
      return isDesktop;
    },
    isTablet() {
      return isTablet;
    },
  },
  methods: {
    trackError(message, data, type = "log") {
      if (this.rollbar && this.rollbar[type]) {
        this.rollbar[type](message, data);
      }
    },
  },
});

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
