import store from "@/store/index";
import { computed } from "@vue/composition-api";
import { screen, isDesktop } from "@/helper/screenSizeHelper";
import bookingStepGuard from "@/services/bookingStepRules";
import * as alert from "@/lib/alert";
import { isCurrentBookingPending } from "@/composable/pendingBooking";
import router from "./router.js";
import rollbar from "@/lib/rollbar";
import isEmpty from "lodash-es/isEmpty";
import { isValid as isValidCorporateBooking } from "@/composable/corporateEvent";
import { ROUTE_PROFILE_HOME, ROUTE_HOME_PAGE } from "@/lib/constant";
import useLazyImport from "@/composable/useLazyImport";

const bookingPageBeforeEnteValidation = () => {
  const anyPackagePreference =
    store.state.booking.packagePreference.length > 0 ? true : false;
  const anySelectedPackage =
    store.getters["bookingPackage/anySelectedPackages"];

  if (screen === "phone" || screen === "tablet") {
    if (anyPackagePreference || anySelectedPackage) {
      return true;
    }
    return false;
  } else {
    if (anySelectedPackage) {
      return true;
    }
    return false;
  }
};

async function bookingPageGuard(to, from, next) {
  if (!store.hasModule("restaurant")) {
    const restaurantStore = await useLazyImport(() =>
      import(
        /* webpackChunkName: "RestaurantStoreChunk" */ "@/store/restaurant"
      )
    );
    if (restaurantStore.default) {
      store.registerModule("restaurant", restaurantStore.default);
    }
  }
  if (!store.hasModule("bookingCharge")) {
    const bookingCharge = await useLazyImport(() =>
      import(
        /* webpackChunkName: "BookingChargeStoreChunk" */ "@/store/bookingCharge"
      )
    );
    if (bookingCharge.default) {
      store.registerModule("bookingCharge", bookingCharge.default);
    }
  }
  if (!store.hasModule("bookingPackage")) {
    const bookingPackage = await useLazyImport(() =>
      import(
        /* webpackChunkName: "BookingPackageStoreChunk" */ "@/store/bookingPackage"
      )
    );
    if (bookingPackage.default) {
      store.registerModule("bookingPackage", bookingPackage.default);
    }
  }
  if (!store.hasModule("bookingDateTime")) {
    const bookingDateTime = await useLazyImport(() =>
      import(
        /* webpackChunkName: "BookingDateTimeStoreChunk" */ "@/store/bookingDateTime"
      )
    );
    if (bookingDateTime.default) {
      store.registerModule("bookingDateTime", bookingDateTime.default);
    }
  }
  const isRequiredStoreLoaded =
    store.hasModule("restaurant") &&
    store.hasModule("bookingCharge") &&
    store.hasModule("bookingPackage") &&
    store.hasModule("bookingDateTime");
  if (bookingPageBeforeEnteValidation() && isRequiredStoreLoaded) {
    next();
  } else {
    if (from.name) {
      if (from.name === "RestaurantPage") {
        next(false);
      } else {
        next({
          name: "RestaurantPage",
          params: {
            ...to.params,
          },
        });
      }
    } else {
      next({
        name: "RestaurantPage",
        params: {
          ...to.params,
        },
      });
    }
  }
}

async function buyVoucherPageGuard(to, from, next) {
  if (from.name) {
    if (
      from.name === "RestaurantPage" &&
      isValidCorporateBooking.value === false
    ) {
      next();
    } else {
      next({
        name: "RestaurantPage",
        params: {
          ...to.params,
        },
      });
    }
  } else {
    next({
      name: "RestaurantPage",
      params: {
        ...to.params,
      },
    });
  }
}

function sidebarBookingGuard(to, from, next) {
  const anyPackagePreference =
    store.state.booking.packagePreference.length > 0 ? true : false;

  if (anyPackagePreference) {
    bookingFlowRules("desktop", from, to, next);
  } else {
    next({
      name: "RestaurantPage",
      params: {
        ...to.params,
      },
    });
  }
}

function mobileBookingGuard(to, from, next) {
  bookingFlowRules("mobile", from, to, next);
}

function bookingFlowRules(deviceType, from, to, next) {
  // if it is pending booking, allow to bypass flow rule and immediate go to last step
  if (isCurrentBookingPending.value === true) {
    next();
    return;
  }
  let baseRoute = "";
  if (deviceType === "desktop") {
    baseRoute = "sidebar-booking-step";
  } else {
    baseRoute = "booking-page-step";
  }

  let isGoToNextStep = true;
  if (from.name.includes("step")) {
    const nextStep = to.name.charAt(to.name.length - 1);
    const fromStep = from.name.charAt(from.name.length - 1);
    isGoToNextStep = nextStep > fromStep ? true : false;
  }
  const bookStepGuard = new bookingStepGuard(isGoToNextStep);

  if (from.name === to.name) {
    next(false);
  } else if (to.name === `${baseRoute}-1`) {
    if (isGoToNextStep) {
      bookStepGuard.goToAdultStepGuard() === true ? next() : next(false);
    } else {
      bookStepGuard.backToAdultStepCallback();
      next();
    }
  } else if (to.name === `${baseRoute}-2`) {
    if (isGoToNextStep) {
      const isPass = bookStepGuard.goToDateStepGuard();
      if (isPass === true) {
        next();
      } else {
        alert.error(isPass);
        next(false);
      }
    } else {
      bookStepGuard.backToDateStepCallback();
      next();
    }
  } else if (to.name === `${baseRoute}-3`) {
    if (isGoToNextStep) {
      const isPass = bookStepGuard.goToTimeStepGuard();
      if (isPass === true) {
        next();
      } else {
        alert.error(isPass);
        next(false);
      }
    } else {
      bookStepGuard.backToTimeStepCallback();
      next();
    }
  } else if (to.name === `${baseRoute}-4`) {
    if (isGoToNextStep) {
      const isPass = bookStepGuard.goToSelectPackageStepGuard();
      if (isPass === true) {
        next();
      } else {
        alert.error(isPass);
        next(false);
      }
    } else {
      bookStepGuard.backToSelectPackageCallback();
      next();
    }
  } else if (to.name === `${baseRoute}-5`) {
    if (isGoToNextStep) {
      const isPass = bookStepGuard.goToPaymentStepGuard();
      if (isPass === true) {
        next();
      } else {
        alert.error(isPass);
        next(false);
      }
    } else {
      bookStepGuard.backToPaymentStepCallback();
      next();
    }
  }
}

async function searchPageGuard(to, from, next) {
  // register search vuex store
  if (!store.hasModule("search")) {
    try {
      const module = await useLazyImport(() =>
        import(/* webpackChunkName: "SearchStoreChunk" */ "@/store/search")
      );
      if (module.default) {
        store.registerModule("search", module.default);
        next();
        return;
      }
      alert.error("Oops, error when loading the page, please refresh");
    } catch (err) {
      rollbar.error("Failed to load search store module", err);
      alert.error("Oops, error when loading the page, please refresh");
      return;
    }
  }
  next();
}

async function restaurantPageGuard(to, from, next) {
  // register restaurant & restaurantReview vuex store
  try {
    if (!store.hasModule("restaurant")) {
      const restaurantStore = await useLazyImport(() =>
        import(
          /* webpackChunkName: "RestaurantStoreChunk" */ "@/store/restaurant"
        )
      );
      if (restaurantStore.default) {
        store.registerModule("restaurant", restaurantStore.default);
      }
    }
    if (!store.hasModule("restaurantPackages")) {
      const restaurantPackages = await useLazyImport(() =>
        import(
          /* webpackChunkName: "RestaurantPackagesStoreChunk" */ "@/store/restaurantPackages"
        )
      );
      if (restaurantPackages.default) {
        store.registerModule("restaurantPackages", restaurantPackages.default);
      }
    }
    if (!store.hasModule("inventorySummary")) {
      const inventorySummaries = await useLazyImport(() =>
        import(
          /* webpackChunkName: "InventroySummaryStoreChunk" */ "@/store/inventorySummary"
        )
      );
      if (inventorySummaries.default) {
        store.registerModule("inventorySummary", inventorySummaries.default);
      }
    }
    if (!store.hasModule("restaurantReview")) {
      const restaurantReviewStore = await useLazyImport(() =>
        import(
          /* webpackChunkName: "RestaurantReviewStoreChunk" */ "@/store/restaurantReview"
        )
      );
      if (restaurantReviewStore.default) {
        store.registerModule("restaurantReview", restaurantReviewStore.default);
      }
    }
    if (!store.hasModule("bookingCharge")) {
      const bookingCharge = await useLazyImport(() =>
        import(
          /* webpackChunkName: "BookingChargeStoreChunk" */ "@/store/bookingCharge"
        )
      );
      if (bookingCharge.default) {
        store.registerModule("bookingCharge", bookingCharge.default);
      }
    }
    if (!store.hasModule("bookingPackage")) {
      const bookingPackage = await useLazyImport(() =>
        import(
          /* webpackChunkName: "BookingPackageStoreChunk" */ "@/store/bookingPackage"
        )
      );
      if (bookingPackage.default) {
        store.registerModule("bookingPackage", bookingPackage.default);
      }
    }
    if (!store.hasModule("bookingDateTime")) {
      const bookingDateTime = await useLazyImport(() =>
        import(
          /* webpackChunkName: "BookingDateTimeStoreChunk" */ "@/store/bookingDateTime"
        )
      );
      if (bookingDateTime.default) {
        store.registerModule("bookingDateTime", bookingDateTime.default);
      }
    }
    const isRequiredStoreLoaded =
      store.hasModule("restaurant") &&
      store.hasModule("restaurantReview") &&
      store.hasModule("bookingCharge") &&
      store.hasModule("bookingPackage") &&
      store.hasModule("bookingDateTime");
    if (isRequiredStoreLoaded) {
      next();
      return;
    }
    alert.error("Oops, error when loading the page, please refresh");
  } catch (err) {
    rollbar.error("Failed to load search store module", err);
    alert.error("Oops, error when loading the page, please refresh");
    return;
  }

  next();
}

function profilePageGuard(to, from, next) {
  const token = computed(() => {
    return store.state.user.accessToken;
  });
  if (!token.value) {
    alert.error("Please login to continue");
    next({ name: ROUTE_HOME_PAGE });
  }
  next();
}

function profilePageGuardMobile(to, from, next) {
  const token = computed(() => {
    return store.state.user.accessToken;
  });
  if (!token.value) {
    alert.error("Please login to continue");
    next({ name: ROUTE_HOME_PAGE });
  } else if (isDesktop) {
    next({ name: ROUTE_PROFILE_HOME });
  }
  next();
}
function routerPushGuard(newRoute) {
  // if new path is same with current path refresh the page
  // else push new path
  if (!newRoute || isEmpty(newRoute)) {
    rollbar.error("invalid new route", { newRoute });
    return;
  }
  const { location, route } = newRoute;
  if (isEmpty(location) || isEmpty(route)) {
    rollbar.error("invalid new route properties", { location, route });
    return;
  }

  if (router.currentRoute.path !== route.path) {
    router.push({ ...location });
  } else {
    router.go();
  }
}

export {
  restaurantPageGuard,
  bookingPageGuard,
  buyVoucherPageGuard,
  sidebarBookingGuard,
  mobileBookingGuard,
  searchPageGuard,
  profilePageGuard,
  profilePageGuardMobile,
  routerPushGuard,
};
