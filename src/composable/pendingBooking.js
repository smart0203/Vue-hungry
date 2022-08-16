import store from "@/store/index";
import { ref, computed } from "@vue/composition-api";
import { isDineInPackage } from "@/helper/PackageHelper";
import { getPendingBooking } from "@/services/pendingBooking.js";
import * as alert from "@/lib/alert";
import { isDesktop } from "@/helper/screenSizeHelper";
import router from "@/router/router";
import dayjs from "@/lib/dayjs";
import rollbar from "@/lib/rollbar";
import Restaurant from "@/models/restaurant";
import track from "@/services/userTracking";
import { selectedCityId, selectedCityName } from "@/composable/selectCity";

import {
  savePendingToServer,
  savePendingToLocal,
  deleteLocalPending,
} from "@/services/pendingBooking";

import {
  PACKAGE_PREFERENCE_DINE_IN,
  PACKAGE_PREFERENCE_DELIVERY_PICK_UP,
  PACKAGE_PREFERENCE_XPERIENCE,
} from "@/lib/constant";

const isUserSignedIn = computed(() => {
  return store.getters["user/isUserSignedIn"];
});
const CAN_CONTINUE_BOOKING_IN_MINUTE = 10;
let isCurrentBookingPending = ref(false);
let isLodingGetRestaurantData = ref(false);
let pendingBookings = ref([]);

function toggleIsPendingBooking(isPending) {
  isCurrentBookingPending.value = isPending;
}

async function getPendingBookingList(accessToken) {
  try {
    const result = await getPendingBooking(accessToken);
    if (result.isSuccess && result.data && result.data.length) {
      const activePendingBooking = result.data.filter((pending) => {
        // can continue to booking flow if start time is not less than 10 minute and contain package data
        const isCanContinueBooking = () => {
          const now = dayjs();
          const bookingTime = dayjs(
            `${pending.date} ${pending.startTime}`,
            "YYYY-MM-DD HH:ss"
          );
          const timeDifference = bookingTime.diff(now, "minute");
          const notLessThanSpecificTime =
            bookingTime.isAfter(now, "minute") &&
            timeDifference > CAN_CONTINUE_BOOKING_IN_MINUTE;
          const containPackage = pending.packageData.length;
          return notLessThanSpecificTime && containPackage;
        };

        return isCanContinueBooking() ? true : false;
      });
      pendingBookings.value = activePendingBooking;
    }
  } catch (err) {
    alert.error(err);
  }
}

async function createPendingBooking() {
  const {
    bookingMethod,
    selectedDate,
    selectedTime,
    adult,
    kids,
    specialRequest,
    packagePreference,
  } = store.state.booking;
  const canSkipSelectTime = store.getters["booking/canSkipSelectTime"];
  const packagesPayload = store.getters["bookingPackage/getSelectedPackage"];
  let bookingTime = selectedTime;

  // dont create pending booking again if current booking session is mark as pending booking
  if (isCurrentBookingPending.value === true) {
    return;
  }
  // if dont have package payload then return
  if (packagesPayload && packagesPayload.length === 0) {
    return;
  }

  // when that is Xperience that have canSkipSelectTime = true,use default start time of package
  if (
    packagePreference.includes(PACKAGE_PREFERENCE_XPERIENCE) &&
    canSkipSelectTime
  ) {
    bookingTime =
      store.getters["bookingPackage/getSelectedPackage"][0].defaultStartTime;
  }
  console.log("creating pending booking..");
  const { restaurantId } = store.state.restaurant;
  const { accessToken } = store.state.user;
  const formatedDate = dayjs(selectedDate).format("YYYY-MM-DD");

  try {
    const serviceType = () => {
      if (bookingMethod === "dine in") {
        return "dine-in";
      } else if (bookingMethod === "pick up") {
        return "pick-up";
      }
      return "delivery";
    };
    const reservationPayload = {
      restaurantId: restaurantId,
      date: formatedDate,
      startTime: bookingTime,
      adult: adult,
      kids: kids,
      specialRequest: specialRequest,
      voucherCode: "",
      serviceType: serviceType(),
      isOrderNow: store.getters["bookingDateTime/isOrderNow"],
    };

    let result;
    if (isUserSignedIn.value) {
      trackPendingBooking();
      result = await createPendingBookingToServer(
        accessToken || "",
        reservationPayload,
        packagesPayload
      );
    } else {
      result = await createLocalPendingBooking(
        reservationPayload,
        packagesPayload
      );
    }

    if (result.isSuccess) {
      console.log("pending booking created");
    } else {
      alert.error(result.message);
    }
  } catch (err) {
    const error = {
      message: "Oops, something went wrong, failed create pending reservation",
      cause: err,
    };
    rollbar.error(error.message, error.cause);
  } finally {
    isCurrentBookingPending.value = false;
  }
}

async function createLocalPendingBooking(reservationData, packageData) {
  const restaurantData = { ...store.state.restaurant.restaurantData };
  restaurantData.imageCoverUrl.original = restaurantData.imageCoverUrl.large;
  restaurantData.slug = restaurantData.restaurantSlug;
  restaurantData.price = restaurantData.priceAndPricingType;
  restaurantData.type = "restaurants";
  restaurantData.isCatalog = true;
  restaurantData.logo = restaurantData.logoUrl.medium;
  const remapPackageData = packageData.map((pack) => {
    const selectedPrice = pack.getPackagePrice(
      reservationData.adult,
      reservationData.kids
    );
    return {
      selectedPrice: selectedPrice,
      ...pack,
    };
  });
  const restaurantInstance = new Restaurant(restaurantData);
  return await savePendingToLocal(
    reservationData,
    remapPackageData,
    restaurantInstance
  );
}

async function createPendingBookingToServer(
  accessToken,
  reservation,
  packages
) {
  return await savePendingToServer(accessToken, reservation, packages);
}

async function continuePendingBooking(pendingId) {
  try {
    // mark loading get restaurant data
    isLodingGetRestaurantData.value = true;
    // get pending booking from array of pending
    const filterPendingBooking = pendingBookings.value.filter(
      (pending) => pending.id === pendingId
    );
    // if no pending booking with id `pendingId` found
    if (!filterPendingBooking && filterPendingBooking.length === 0) {
      throw new Error(`No pending reservation with id ${pendingId} found`);
    }
    const selectedPendingBooking = filterPendingBooking[0];
    const restaurantSlug = selectedPendingBooking.restaurantData.slug;
    if (!store.hasModule("restaurant")) {
      const restaurantStore = await import(
        /* webpackChunkName: "RestaurantStoreChunk" */ "@/store/restaurant"
      );
      if (restaurantStore.default) {
        store.registerModule("restaurant", restaurantStore.default);
      }
    }
    if (!store.hasModule("restaurantPackages")) {
      const restaurantPackages = await import(
        /* webpackChunkName: "RestaurantPackagesStoreChunk" */ "@/store/restaurantPackages"
      );
      if (restaurantPackages.default) {
        store.registerModule("restaurantPackages", restaurantPackages.default);
      }
    }
    if (!store.hasModule("restaurantReview")) {
      const restaurantReviewStore = await import(
        /* webpackChunkName: "RestaurantReviewStoreChunk" */ "@/store/restaurantReview"
      );
      if (restaurantReviewStore.default) {
        store.registerModule("restaurantReview", restaurantReviewStore.default);
      }
    }
    if (!store.hasModule("bookingPackage")) {
      const bookingPackage = await import(
        /* webpackChunkName: "BookingPackageStoreChunk" */ "@/store/bookingPackage"
      );
      if (bookingPackage.default) {
        store.registerModule("bookingPackage", bookingPackage.default);
      }
    }
    if (!store.hasModule("bookingDateTime")) {
      const bookingDateTime = await import(
        /* webpackChunkName: "bookingDateTimeStoreChunk" */ "@/store/bookingDateTime"
      );
      if (bookingDateTime.default) {
        store.registerModule("bookingDateTime", bookingDateTime.default);
      }
    }
    await initRestaurantData(restaurantSlug);
    await getRestaurantPackage();
    setBookingState(selectedPendingBooking);
    setTimeout(() => {
      redirectToBooking(restaurantSlug);
    }, 500);
  } catch (err) {
    rollbar.error(
      "Oops, something went wrong, failed continue pending booking",
      err
    );
    alert.error("Oops, something went wrong, failed continue pending booking");
  }
}

async function initRestaurantData(restaurantSlug) {
  const result = await store.dispatch(
    "restaurant/getRestaurantData",
    restaurantSlug
  );
  if (result.isSuccess === false) {
    alert.error(result.message);
  }
  return;
}

async function getRestaurantPackage() {
  const restaurantId = store.state.restaurant.restaurantId;
  await store.dispatch(
    "restaurantPackages/getRestaurantPackages",
    restaurantId
  );
}

function setBookingState(selectedPendingBooking) {
  // mark the current booking is pending booking, so it will not call create pending again
  toggleIsPendingBooking(true);
  store.commit("booking/setState", {
    state: "adult",
    val: selectedPendingBooking.adult,
  });
  store.commit("booking/setState", {
    state: "kids",
    val: selectedPendingBooking.kids,
  });
  store.commit("booking/setState", {
    state: "selectedDate",
    val: dayjs(selectedPendingBooking.date, "YYYY-MM-DD"),
  });
  store.commit("booking/setState", {
    state: "selectedTime",
    val: selectedPendingBooking.startTime,
  });

  if (selectedPendingBooking.isOrderNow) {
    store.commit("bookingDateTime/setState", {
      state: "preferedOrderTime",
      val: "order-now",
    });
  }
  selectedPendingBooking.packageData.forEach((pack) => {
    // set packagePreference
    if (store.state.booking.packagePreference === "") {
      store.commit("booking/setState", {
        state: "packagePreference",
        val: isDineInPackage(pack.typeCode)
          ? PACKAGE_PREFERENCE_DINE_IN
          : PACKAGE_PREFERENCE_DELIVERY_PICK_UP,
      });
    }

    const selectedPackage = store.getters["bookingPackage/getPackageById"](
      pack.id
    );
    // increase package quantity
    selectedPackage.increasePackageQuantity(pack.quantity);
    // get menu quantity from pending booking package
    const getMenuQuantity = (menuSectionId, menuId) => {
      if (!menuSectionId || !menuId) {
        return false;
      }
      const section = pack.menuSections.filter(
        (packSection) => packSection.id == menuSectionId
      );
      if (section && section.length) {
        const menu = section[0].menus.filter((menu) => menu.id == menuId);
        if (menu && menu.length) {
          return menu[0].quantity;
        }
        return false;
      }
      return false;
    };
    if (
      selectedPackage.menuSections &&
      selectedPackage.menuSections.length > 0
    ) {
      selectedPackage.menuSections.forEach((section) => {
        section.menus.forEach((menu) => {
          const storedMenuQuantity = getMenuQuantity(section.id, menu.id);
          if (storedMenuQuantity !== false) {
            menu.setQuantity(storedMenuQuantity);
          }
        });
      });
    }
  });

  store.commit("booking/setState", {
    state: "step",
    val: 5,
  });
}

function redirectToBooking(restaurantSlug) {
  store.commit("booking/setState", {
    state: "isMobileBooking",
    val: isDesktop ? false : true,
  });
  const lang = store.state.lang;
  if (isDesktop) {
    router.push({
      path: `/restaurants/${restaurantSlug}/book/step-5?locale=${lang}`,
    });
  } else {
    router.push({
      path: `/restaurants/${restaurantSlug}/mobile-book/step-5?locale=${lang}`,
    });
  }
}

function deleteLocalPendingBooking() {
  const isDineIn = store.getters["booking/isDineIn"];
  if (isDineIn) {
    deleteLocalPending("dine-in");
  } else {
    deleteLocalPending("delivery");
  }
}

function trackPendingBooking() {
  const { restaurantId, restaurantName } = store.state.restaurant;
  const { id: userId } = store.state.user;
  const selectedPackages = store.getters["bookingPackage/getSelectedPackage"];
  const { bookingMethod, selectedDate, selectedTime, adult, kids } =
    store.state.booking;
  const serviceType = () => {
    if (bookingMethod === "dine in") {
      return "dine-in";
    } else if (bookingMethod === "pick up") {
      return "pick-up";
    }
    return "delivery";
  };
  let selectedPackagesId = [];
  let selectedPackagesQuantity = [];
  let selectedPackagesName = [];
  let selectedPackagesType = [];
  selectedPackages.forEach((pack) => {
    const { name, typeCode, quantity, id } = pack;
    selectedPackagesId.push(id);
    selectedPackagesQuantity.push(quantity);
    selectedPackagesName.push(name);
    selectedPackagesType.push(typeCode);
  });

  track("PENDING_TRANSACTION", {
    restaurantId: restaurantId,
    restaurantName: restaurantName,
    userID: userId,
    bookingAdult: adult,
    bookingKids: kids,
    bookingDate: dayjs(selectedDate).format("YYYY-MM-DD"),
    bookingTime: selectedTime,
    packageId: selectedPackagesId.join(", "),
    packageName: selectedPackagesName.join(", "),
    packageQuantity: selectedPackagesQuantity.join(", "),
    packageType: selectedPackagesType.join(", "),
    serviceType: serviceType(),
    cityId: selectedCityId.value,
    cityName: selectedCityName.value,
  });
}

export {
  pendingBookings,
  isLodingGetRestaurantData,
  createPendingBooking,
  continuePendingBooking,
  getPendingBookingList,
  toggleIsPendingBooking,
  isCurrentBookingPending,
  deleteLocalPendingBooking,
};
