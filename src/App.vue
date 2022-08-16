<template>
  <div id="app">
    <div id="panel" class="">
      <TopBar />
      <Navbar
        @on-register-clicked="openRegisterModal"
        @on-signin-clicked="toggleSignInModal(true)"
      />
      <router-view />
      <Footer />
    </div>
    <LoginModal />
    <RegisterModal />
    <ForgotPasswordModal />
    <ServerBusyModal />
    <component :is="bottomSheetComponent"></component>
    <div id="modal-container"></div>
    <portal-target :name="PORTAL_FOR_MODAL_SELECTOR" multiple></portal-target>
  </div>
</template>
<script>
import "pretty-checkbox/src/pretty-checkbox.scss";
import "placeholder-loading/dist/css/placeholder-loading.min.css";
import "@/assets/css/tailwind.css";
import "@/assets/index.scss";
import "@/assets/css/AppCritical.scss";
import { mapGetters } from "vuex";
import {
  isAllowLocalStorage,
  isAllowCookie,
} from "@/helper/storagePermissionHelper";
import TopBar from "@/components/TopBar.vue";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import LoginModal from "@/components/Common/Login/LoginModal.vue";
import ServerBusyModal from "@/components/Common/ServerBusy/ServerBusyModal.vue";
import RegisterModal from "@/components/Common/Register/RegisterModal.vue";
import ForgotPasswordModal from "@/components/Common/ForgotPassword/ForgotPasswordModal.vue";
import { methods as realtimeQRMethods } from "@/composable/realtimeQRPaymentChecking";
import { methods as favouriteMethods } from "@/composable/favouriteRestaurant";
import {
  UTM_SOURCE,
  INVOLVE_ASIA_CLICK_ID,
  PORTAL_FOR_MODAL_SELECTOR,
  ROUTE_HOME_PAGE,
  UTM_VERSION,
  UTM_MEDIUM,
} from "@/lib/constant";
import { isOpen as isServerBusyModalOpen } from "@/components/Common/ServerBusy/serverBusy";
import { storageGetLanguage } from "@/lib/localStorage";
import { mapState } from "vuex";
import { getAllGroupLanding } from "@/composable/groupLanding";
import { mapFields } from "vuex-map-fields";
import { getAvailableCities } from "@/composable/selectCity";
import { initFirebasePerf } from "@/lib/firebasePerf";
import {
  saveToUserStorage,
  getFromUserStorage,
  removeFromUserStorage,
} from "@/helper/userStorage";
import qs from "qs";
import humps from "humps";
import {
  processRedirectLoginResult,
  needInputEmail,
  needInputPhone,
} from "@/composable/socialMediaLogin";
const DEFAULT_TITLE = "Hungry Hub, No.1 Buffet App in Thailand";
const parsedQueryString = humps.camelizeKeys(
  qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })
);
let timeOutInstance;
export default {
  components: {
    TopBar,
    Navbar,
    Footer,
    LoginModal,
    RegisterModal,
    ForgotPasswordModal,
    ServerBusyModal,
  },
  setup() {
    const { startWatchQRPaymentStatus } = realtimeQRMethods;
    const { getFavoriteRestaurants } = favouriteMethods;
    return {
      getFavoriteRestaurants,
      startWatchQRPaymentStatus,
      isServerBusyModalOpen,
      PORTAL_FOR_MODAL_SELECTOR,
    };
  },
  data() {
    return {
      bottomSheetComponent: "",
    };
  },
  computed: {
    ...mapState("webConfig", ["config", "openLoginModal"]),
    ...mapState("user", ["name", "cleverTapObj"]),
    ...mapFields("user", ["isLoading"]),
    ...mapGetters("user", ["isUserSignedIn"]),
    hhLang() {
      return this.$store.state.lang;
    },
    pageDescription() {
      return this.config.appDescription || DEFAULT_TITLE;
    },
  },
  watch: {
    openLoginModal(newVal) {
      this.toggleSignInModal(newVal);
    },
  },
  mounted() {
    this.setUtmSourceCookies();
    this.setInvolveAsiaCookie();
    this.initCredential();
    this.loadBottomSheetComponent();
    this.openForgotPasswordModal();
    this.startWatchQRPaymentStatus();
    this.checkRedirectLoginResult();
    this.addAppVersion();
    this.checkIsShowTrueWalletPayment();
    this.$nextTick(() => {
      initFirebasePerf();
    });
  },
  created() {
    this.checkGoogleMapScriptIsLoaded();
    this.forceLangInUrl();
    getAvailableCities();
    this.getConfig();
    this.setLang();
    getAllGroupLanding();
  },
  beforeDestroy() {
    clearTimeout(timeOutInstance);
  },
  methods: {
    forceLangInUrl() {
      const splitUrl = window.location.pathname.split("/");
      const langSegment = splitUrl[1];
      const urlContainLangSegment =
        langSegment && langSegment.length === 2 ? true : false;
      const queryString = parsedQueryString;
      const isUrlContainLangQueryString =
        queryString.locale && queryString.locale.length == 2 ? true : false;
      let finalUrl = "";
      if (urlContainLangSegment) {
        // url contain lang but not 'en' or 'th'
        if (langSegment !== "en" && langSegment !== "th") {
          const suggestedLanguage = storageGetLanguage();
          // remove lang from URL segment then append lang as '?lang'
          splitUrl.splice(1, 1);
          queryString.locale = suggestedLanguage;
          const urlSearchStringify = qs.stringify(
            humps.decamelizeKeys(queryString)
          );
          finalUrl = `${window.location.origin}${splitUrl.join(
            "/"
          )}?${urlSearchStringify}`;
          window.location.replace(finalUrl);
        } else {
          // remove lang from URL segment then append lang as '?lang'
          queryString.locale = langSegment;
          const urlSearchStringify = qs.stringify(
            humps.decamelizeKeys(queryString)
          );
          splitUrl.splice(1, 1);
          finalUrl = `${window.location.origin}${splitUrl.join(
            "/"
          )}?${urlSearchStringify}`;
          window.location.replace(finalUrl);
        }
      } else {
        if (!isUrlContainLangQueryString) {
          queryString.locale = storageGetLanguage();
          const urlSearchStringify = qs.stringify(
            humps.decamelizeKeys(queryString)
          );
          const finalUrl = `${window.location.origin}${window.location.pathname}?${urlSearchStringify}`;
          window.location.replace(finalUrl);
        }
      }
    },
    async setLang() {
      const lang = Array.isArray(parsedQueryString.locale)
        ? parsedQueryString.locale[0]
        : parsedQueryString.locale;
      if (lang) {
        this.$i18nInstance.locale = lang;
        this.$dayjs.locale(lang);
        this.$veeValidateLocalize(lang);
        await this.$store.dispatch("changeLang", lang);
      }
    },
    openRegisterModal() {
      this.$modal.show("register-modal");
    },
    toggleSignInModal(isShow) {
      if (isShow) {
        this.$modal.show("login-modal");
      } else {
        this.$modal.hide("login-modal");
      }
    },
    openForgotPasswordModal() {
      if (parsedQueryString.forgotpassword) {
        this.$modal.show("forgot-password-modal");
      }
    },
    async loadBottomSheetComponent() {
      if (!this.isMobile) {
        return;
      }
      try {
        const module = await this.$useLazyImport(() =>
          import(
            /* webpackChunkName: "BottomSheetChunk" */ "@/components/Common/BottomSheet/BottomSheet.vue"
          )
        );
        this.bottomSheetComponent = module.default;
      } catch (err) {
        this.$rollbar.error(
          "Oops, something went wrong, failed to load bottom sheet component",
          err
        );
        this.$alert.error(
          "Oops, something went wrong, failed to load required component"
        );
      }
    },
    async initCredential() {
      if (this.isUserSignedIn) {
        const getProfileResult = await this.$store.dispatch("user/getProfile");
        if (getProfileResult.isSuccess) {
          await this.getFavoriteRestaurants();
          return;
        }
        this.$store.dispatch("webConfig/toggleLoginModal", true);
        this.$router.push({
          name: ROUTE_HOME_PAGE,
        });
        if (getProfileResult.message) {
          this.$alert.error(getProfileResult.message);
        }
      }
    },
    async checkRedirectLoginResult() {
      if (isAllowLocalStorage() === false || isAllowCookie() === false) {
        return;
      }
      this.isLoading = true;
      const { isSuccess, message } = await processRedirectLoginResult();
      if (isSuccess) {
        this.$alert.success(`Welcome back ${this.name}`);
        this.$store.dispatch("user/sendClevertapObject", "USER_SIGNED_IN");
      }
      if (needInputEmail.value === true || needInputPhone.value === true) {
        this.$store.dispatch("webConfig/toggleLoginModal", true);
      }
      if (!isSuccess && message) {
        this.$alert.error(message);
      }
      this.isLoading = false;
    },
    async getConfig() {
      try {
        await this.$store.dispatch("webConfig/getConfig");
      } catch (err) {
        if (err) {
          this.$alert.error(err);
        }
      }
    },
    async addAppVersion() {
      try {
        const { version } = await require("../package.json");
        const app = document.getElementById("app");
        if (app) {
          app.setAttribute("app-version", version);
        }
      } catch (err) {
        this.$rollbar.error(err);
      }
    },
    checkGoogleMapScriptIsLoaded() {
      var script = document.getElementById("google-map");
      script.addEventListener("load", () => {
        this.$store.commit("setState", {
          state: "isGoogleMapsScriptLoaded",
          val: true,
        });
      });
    },
    checkIsShowTrueWalletPayment() {
      const utmSource = getFromUserStorage(UTM_SOURCE);
      if (utmSource === "truemoney") {
        this.$store.commit("booking/setState", {
          state: "showTrueWalletPayment",
          val: true,
        });
      }
    },
    setInvolveAsiaCookie() {
      const { clickId } = parsedQueryString;
      if (clickId) {
        const storedClickId = getFromUserStorage(INVOLVE_ASIA_CLICK_ID);
        if (storedClickId != clickId) {
          saveToUserStorage(INVOLVE_ASIA_CLICK_ID, clickId, {
            expires: 30,
            domain: ".hungryhub.com",
          });
        }
      } else {
        removeFromUserStorage(INVOLVE_ASIA_CLICK_ID);
      }
    },
    setUtmSourceCookies() {
      const { utmSource, utmMedium, utmVersion } = parsedQueryString;
      if (utmMedium) {
        saveToUserStorage(UTM_MEDIUM, utmMedium, {
          expires: 7,
          domain: ".hungryhub.com",
        });
      }
      if (utmVersion) {
        saveToUserStorage(UTM_VERSION, utmVersion, {
          expires: 7,
          domain: ".hungryhub.com",
        });
      }
      if (utmSource) {
        const storedUtmSource = getFromUserStorage(UTM_SOURCE);
        if (storedUtmSource != utmSource) {
          saveToUserStorage(UTM_SOURCE, utmSource, {
            expires: 7,
            domain: ".hungryhub.com",
          });
        }
      }
    },
  },
  metaInfo() {
    return {
      title: DEFAULT_TITLE,
      titleTemplate: "%s | Hungry hub",
      meta: [
        {
          vmid: "description",
          name: "description",
          content: this.pageDescription,
        },
      ],
    };
  },
};
</script>
