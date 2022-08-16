import Vue from "vue";
import VueRouter from "vue-router";
import * as alert from "@/lib/alert";
import qs from "qs";
import useLazyImport from "@/composable/useLazyImport";

const RestaurantPage = () =>
  useLazyImport(() => import(/* webpackChunkName: "restaurant" */"../views/RestaurantPage.vue"));
const HomePage = () => useLazyImport(/* webpackChunkName: "restaurant" */() => import("../views/HomePage.vue"));
const BookingPage = () =>
  useLazyImport(() => import(/* webpackChunkName: "restaurant" */"../views/BookingPage.vue"));
const LandingPage = () =>
  useLazyImport(() => import(/* webpackChunkName: "restaurant" */"../views/LandingPage.vue"));
const VoucherLandingPage = () =>
  useLazyImport(() => import(/* webpackChunkName: "restaurant" */"../views/VoucherLandingPage.vue"));
const VoucherQRPaymentLandingPage = () =>
  useLazyImport(() => import(/* webpackChunkName: "restaurant" */"../views/VoucherQRPaymentPage.vue"));
const SearchPage = () => useLazyImport(() => import(/* webpackChunkName: "restaurant" */"../views/SearchPage.vue"));
const ProfilePage = () =>
  useLazyImport(() => import(/* webpackChunkName: "restaurant" */"../views/ProfilePage.vue"));
const TopRestaurantsPage = () =>
  useLazyImport(() => import(/* webpackChunkName: "restaurant" */"../views/TopRestaurantsPage.vue"));
const VoucherPage = () =>
  useLazyImport(() => import(/* webpackChunkName: "restaurant" */"../views/VoucherPage.vue"));
const BuyVoucherPage = () =>
  useLazyImport(() => import(/* webpackChunkName: "restaurant" */"../views/BuyVoucherPage.vue"));

import {
  bookingPageGuard,
  buyVoucherPageGuard,
  sidebarBookingGuard,
  mobileBookingGuard,
  searchPageGuard,
  profilePageGuard,
  profilePageGuardMobile,
  restaurantPageGuard,
} from "./routerGuard";
import {
  ROUTE_HOME_PAGE,
  ROUTE_SEARCH_PAGE,
  ROUTE_RESTAURANT_PAGE,
  ROUTE_VOUCHER_PAGE,
  ROUTE_BUY_VOUCHER_PAGE,
  ROUTE_BUY_RESTAURANT_VOUCHER_PAGE,
  ROUTE_BUY_RESTAURANT_VOUCHER_SIDEBAR,
  ROUTE_BOOKING_LANDING_PAGE,
  ROUTE_VOUCHER_LANDING_PAGE,
  ROUTE_VOUCHER_QR_PAYMENT_LANDING_PAGE,
  ROUTE_PROFILE_VOUCHER,
  ROUTE_PROFILE_HOME,
  ROUTE_PROFILE_EDIT,
  ROUTE_PROFILE_PASSWORD,
  ROUTE_PROFFILE_POINT_HISTORY,
  ROUTE_PROFILE_FAVOURITE,
  ROUTE_PROFILE_HISTORY,
  ROUTE_PROFILE_POINT,
  ROUTE_PAYMENT_SUCCESS,
  ROUTE_NOT_FOUND,
  ROUTE_PAYMENT_OTP,
  ROUTE_PAYMENT_FAILED,
} from "@/lib/constant";
import { screen } from "@/helper/screenSizeHelper";
import rollbar from "@/lib/rollbar";

const VoucherFlow = () =>
  useLazyImport(() =>
    import("@/components/Page Component/Restaurant/RestaurantVoucherFlow.vue")
  );
const BookingStep1 = () =>
  useLazyImport(() =>
    import(
      /* webpackChunkName: "BookingFlow" */ "@/components/Page Component/Booking/BookingStep1.vue"
    )
  );

const BookingStep2 = () =>
  useLazyImport(() =>
    import(
      /* webpackChunkName: "BookingFlow" */ "@/components/Page Component/Booking/BookingStep2.vue"
    )
  );

const BookingStep3 = () =>
  useLazyImport(() =>
    import(
      /* webpackChunkName: "BookingFlow" */ "@/components/Page Component/Booking/BookingStep3.vue"
    )
  );

const BookingStep4 = () =>
  useLazyImport(() =>
    import(
      /* webpackChunkName: "BookingFlow" */ "@/components/Page Component/Booking/BookingStep4.vue"
    )
  );

const BookingStep5 = () =>
  useLazyImport(() =>
    import(
      /* webpackChunkName: "BookingFlow" */ "@/components/Page Component/Booking/BookingStep5.vue"
    )
  );

const GroupLandingPage = () =>
  useLazyImport(() =>
    import(
      /* webpackChunkName: "GroupLandingPage" */ "@/views/GroupLandingPage.vue"
    )
  );

const PromotionPage = () =>
  useLazyImport(() =>
    import(/* webpackChunkName: "PromotionPage" */ "@/views/PromotionPage.vue")
  );

const NotFoundPage = () =>
  useLazyImport(() =>
    import(/* webpackChunkName: "NotFoundPage" */ "@/views/NotFoundPage.vue")
  );

const ProfileHome = () =>
  useLazyImport(() =>
    import(
      /* webpackChunkName: "ProfileMobileChunk" */ "@/components/Page Component/Profile/Home/ProfileHome.vue"
    )
  );

const ProfileEdit = () =>
  useLazyImport(() =>
    import(
      /* webpackChunkName: "ProfileMobileChunk" */ "@/components/Page Component/Profile/Edit/ProfileEditMobile.vue"
    )
  );

const ProfileFavourite = () =>
  useLazyImport(() =>
    import(
      /* webpackChunkName: "ProfileMobileChunk" */ "@/components/Page Component/Profile/Favourite/ProfileFavourite.vue"
    )
  );

const ProfileHistory = () =>
  useLazyImport(() =>
    import(
      /* webpackChunkName: "ProfileMobileChunk" */ "@/components/Page Component/Profile/History/ProfileHistory.vue"
    )
  );

const ProfilePoint = () =>
  useLazyImport(() =>
    import(
      /* webpackChunkName: "ProfileMobileChunk" */ "@/components/Page Component/Profile/Point/ProfilePoint.vue"
    )
  );

const ProfileEditPasswordPage = () =>
  useLazyImport(() =>
    import(
      /* webpackChunkName: "ProfileMobileChunk" */ "@/components/Page Component/Profile/Edit/ProfileEditPasswordPage.vue"
    )
  );

const ProfilePointHistory = () =>
  useLazyImport(() =>
    import(
      /* webpackChunkName: "ProfileMobileChunk" */ "@/components/Page Component/Profile/Point/ProfilePointHistory.vue"
    )
  );

const ProfileMemberPrivilege = () =>
  import(
    /* webpackChunkName: "ProfileMobileChunk" */ "@/components/Page Component/Profile/MemberPrivilege/MemberPrivilege.vue"
  );
const ProfileVoucher = () =>
  useLazyImport(() =>
    import(
      /* webpackChunkName: "ProfileMobileChunk" */ "@/components/Page Component/Profile/Voucher/ProfileVoucher.vue"
    )
  );

const PaymentSuccessPage = () =>
  useLazyImport(() =>
    import(
      /* webpackChunkName: "PaymentSuccessPage" */ "@/views/PaymentSuccessPage"
    )
  );

const PaymentOTPPage = () =>
  useLazyImport(() =>
    import(
      /* webpackChunkName: "PaymentSuccessPage" */ "@/views/PaymentOTPPage"
    )
  );

const PaymentFailedPage = () =>
  useLazyImport(() =>
    import(
      /* webpackChunkName: "PaymentFailedPage" */ "@/views/PaymentFailedPage"
    )
  );

const ErrorPage = () =>
  useLazyImport(() =>
    import(/* webpackChunkName: "Erropage" */ "@/views/ErrorPage.vue")
  );

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: ROUTE_HOME_PAGE,
    component: HomePage,
  },
  {
    path: "/profile",
    component: ProfilePage,
    beforeEnter: profilePageGuard,
    children: [
      {
        path: "",
        name: ROUTE_PROFILE_HOME,
        component: ProfileHome,
      },
      {
        path: "edit",
        name: ROUTE_PROFILE_EDIT,
        component: ProfileEdit,
        beforeEnter: profilePageGuardMobile,
      },
      {
        path: "password",
        name: ROUTE_PROFILE_PASSWORD,
        component: ProfileEditPasswordPage,
        beforeEnter: profilePageGuardMobile,
      },
      {
        path: "favourite",
        name: ROUTE_PROFILE_FAVOURITE,
        component: ProfileFavourite,
      },
      {
        path: "voucher",
        name: ROUTE_PROFILE_VOUCHER,
        component: ProfileVoucher,
      },
      {
        path: "history",
        name: ROUTE_PROFILE_HISTORY,
        component: ProfileHistory,
      },
      {
        path: "point",
        name: ROUTE_PROFILE_POINT,
        component: ProfilePoint,
      },
      {
        path: "point-history",
        name: ROUTE_PROFFILE_POINT_HISTORY,
        component: ProfilePointHistory,
        beforeEnter: profilePageGuardMobile,
      },
      {
        path: "privilege",
        name: "ProfileMemberPrivilege",
        component: ProfileMemberPrivilege,
      },
      {
        path: "*",
        name: "profile-home",
        component: ProfileHome,
      },
    ],
  },
  {
    path: "/promotions",
    name: "promotion",
    component: PromotionPage,
  },
  {
    path: "/hungry-hub-gift-card",
    alias: "/hungry-hub-voucher",
    name: ROUTE_VOUCHER_PAGE,
    component: VoucherPage,
    meta: { scrollToTop: true },
  },
  {
    path: "/hungry-hub-gift-card/buy",
    alias: "/hungry-hub-voucher/buy",
    name: ROUTE_BUY_VOUCHER_PAGE,
    component: BuyVoucherPage,
    meta: { scrollToTop: true },
  },
  {
    path: "/restaurants/top",
    name: "top-restaurants",
    component: TopRestaurantsPage,
  },
  {
    path: "/restaurants/search",
    name: ROUTE_SEARCH_PAGE,
    component: SearchPage,
    beforeEnter: searchPageGuard,
    meta: { scrollToTop: true },
  },
  {
    path: "/restaurants/search.html",
    redirect: {
      name: ROUTE_SEARCH_PAGE,
    },
  },
  {
    path: "/restaurants/:restaurantName",
    name: ROUTE_RESTAURANT_PAGE,
    component: RestaurantPage,
    beforeEnter: restaurantPageGuard,
    props: true,
    meta: { scrollToTop: true },
    alias: "/corporate-restaurants/:restaurantName",
    children: [
      {
        path: "buy-voucher",
        name: ROUTE_BUY_RESTAURANT_VOUCHER_SIDEBAR,
        component: VoucherFlow,
      },
      {
        path: "book/step-1",
        name: "sidebar-booking-step-1",
        component: BookingStep1,
        beforeEnter: sidebarBookingGuard,
      },
      {
        path: "book/step-2",
        name: "sidebar-booking-step-2",
        component: BookingStep2,
        beforeEnter: sidebarBookingGuard,
      },
      {
        path: "book/step-3",
        name: "sidebar-booking-step-3",
        component: BookingStep3,
        beforeEnter: sidebarBookingGuard,
      },
      {
        path: "book/step-4",
        name: "sidebar-booking-step-4",
        component: BookingStep4,
        beforeEnter: sidebarBookingGuard,
      },
      {
        path: "book/step-5",
        name: "sidebar-booking-step-5",
        component: BookingStep5,
        beforeEnter: sidebarBookingGuard,
      },
    ],
  },
  {
    path: "/:lang?/restaurants/:restaurantName/mobile-book",
    name: "Book",
    component: BookingPage,
    props: true,
    beforeEnter: bookingPageGuard,
    children: [
      {
        path: "step-1",
        name: "booking-page-step-1",
        component: BookingStep1,
        beforeEnter: mobileBookingGuard,
      },
      {
        path: "step-2",
        name: "booking-page-step-2",
        component: BookingStep2,
        beforeEnter: mobileBookingGuard,
      },
      {
        path: "step-3",
        name: "booking-page-step-3",
        component: BookingStep3,
        beforeEnter: mobileBookingGuard,
      },
      {
        path: "step-4",
        name: "booking-page-step-4",
        component: BookingStep4,
        beforeEnter: mobileBookingGuard,
      },
      {
        path: "step-5",
        name: "booking-page-step-5",
        component: BookingStep5,
        beforeEnter: mobileBookingGuard,
      },
    ],
  },
  {
    path: "/:lang?/restaurants/:restaurantName/mobile-buy-voucher",
    name: ROUTE_BUY_RESTAURANT_VOUCHER_PAGE,
    component: BuyVoucherPage,
    beforeEnter: buyVoucherPageGuard,
    props: true,
  },
  {
    path: "/restaurants/:restaurantName/landing/:encryptedId",
    name: ROUTE_BOOKING_LANDING_PAGE,
    component: LandingPage,
    props: true,
  },
  {
    path: "/restaurants/:restaurantName/payment-success/:encryptedReservationId",
    name: ROUTE_PAYMENT_SUCCESS,
    component: PaymentSuccessPage,
    props: true,
  },
  {
    path: "/restaurants/:restaurantName/payment-failed",
    name: ROUTE_PAYMENT_FAILED,
    component: PaymentFailedPage,
    props: true,
  },
  {
    path: "/restaurants/:restaurantName/payment-otp/:url",
    name: ROUTE_PAYMENT_OTP,
    component: PaymentOTPPage,
    props: true,
  },
  {
    path: "/restaurants/:restaurantName/voucher/:encryptedId",
    name: ROUTE_VOUCHER_LANDING_PAGE,
    component: VoucherLandingPage,
    props: true,
  },
  {
    path: "/restaurants/:restaurantName/voucher/qr-payment/:encryptedId",
    name: ROUTE_VOUCHER_QR_PAYMENT_LANDING_PAGE,
    component: VoucherQRPaymentLandingPage,
    props: true,
  },
  {
    path: "/restaurants/group/:groupLandingId",
    name: "group-landing",
    component: GroupLandingPage,
    props: true,
  },
  {
    path: "/:groupLandingId",
    name: "group-landing-alias",
    component: GroupLandingPage,
    props: true,
  },
  {
    path: "/error/:errorId",
    name: "error",
    component: ErrorPage,
    props: true,
  },
  {
    path: "*",
    name: ROUTE_NOT_FOUND,
    component: NotFoundPage,
  },
];

// https://github.com/vuejs/vue-router/issues/2881#issuecomment-520554378
// handle promise rejection when failed go to new route
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => {
    if (VueRouter.isNavigationFailure(err)) {
      // resolve err
      return err;
    }
    // rethrow error
    return Promise.reject(err);
  });
};

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    const matchedRoute = to.matched[to.matched.length - 1];
    if (screen === "phone" || matchedRoute.meta?.scrollToTop) {
      return { x: 0, y: 0 };
    } else {
      return savedPosition;
    }
  },
  parseQuery(query) {
    const parsed = qs.parse(query);
    return qs.parse(parsed);
  },
  stringifyQuery(query) {
    const result = qs.stringify(query, {
      arrayFormat: "brackets",
      encode: false,
    });
    return result ? `?${result}` : "";
  },
});

function hasQueryParams(route) {
  return !!Object.keys(route.query).length;
}

router.beforeEach((to, from, next) => {
  if (!hasQueryParams(to) && hasQueryParams(from)) {
    const newRoute = { ...to };
    newRoute.query = from.query;
    next(newRoute);
  } else {
    next();
  }
});

router.onError((error) => {
  if (/loading chunk \d* failed./i.test(error.message)) {
    alert.error("Oops, error when loading the page, please refresh");
    rollbar.warning(error.message);
  } else {
    rollbar.warning(error.message);
  }
});

export default router;
