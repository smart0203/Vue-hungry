import { ref } from "@vue/composition-api";
import { useStorage } from "@vueuse/core";
import { workerFetch, axios } from "@/lib/fetcher";
import rollbar from "@/lib/rollbar";
import {
  object,
  number,
  assert,
  string,
  array,
  boolean,
  StructError,
} from "superstruct";
import { dateFormat, timeFormat } from "@/helper/dataTypeValidation";
import { API_MINOR_VERSION, PRICING_TYPE_ALA_CARTE } from "@/lib/constant";
import Restaurant from "@/models/restaurant";
import { packagePricingType, packagePricingRule } from "@/helper/PackageHelper";
import { stripHtmlTag } from "@/helper/stringHelper";
import { storageGetLanguage } from "@/lib/localStorage";
import orderBy from "lodash-es/orderBy";
import isEmpty from "lodash-es/isEmpty";
import { nanoid } from "nanoid";
import { isAllowLocalStorage } from "@/helper/storagePermissionHelper";

let getErrorMessage =
  "Oops, something went wrong, failed get pending reservation";
let createErrorMessage =
  "Oops, something went wrong, failed create pending reservation";
let isLoading = ref(false);
let response;
const pendingDineIn = "hungryhub_pending_dine_in";
const pendingDelivery = "hungryhub_pending_delivery";
let localPendingDineIn = isAllowLocalStorage()
  ? useStorage(pendingDineIn, "")
  : ref(null);
let localPendingDelivery = isAllowLocalStorage()
  ? useStorage(pendingDelivery, "")
  : ref(null);
const correctPayload = object({
  accessToken: string(),
  minorVersion: number(),
  reservation: object({
    restaurantId: string(),
    date: dateFormat,
    startTime: timeFormat,
    adult: number(),
    kids: number(),
    specialRequest: string(),
    voucherCode: string(),
    serviceType: string(),
    isOrderNow: boolean(),
  }),
  packages: array(),
});

async function get(accessToken) {
  try {
    if (accessToken && accessToken.length) {
      return await getFromServer(accessToken);
    }
    return getFromLocal();
  } catch (err) {
    return {
      isSuccess: true,
      data: "",
      message: err || getErrorMessage,
    };
  }
}

async function getFromServer(accessToken) {
  isLoading.value = true;
  try {
    const result = await workerFetch({
      url: `/pending_transactions.json?access_token=${accessToken}`,
    });
    isLoading.value = false;
    if (result.data && !isEmpty(result.data) && result.success) {
      const responseData = result.data;
      const included = result.included;
      let pendingBookings = [];
      if (!included || isEmpty(included)) {
        response = {
          isSuccess: false,
          data: null,
          message: "",
        };
        return response;
      }
      responseData.forEach((pendingBooking) => {
        let restaurantData = null;
        let packagesData = [];

        included.forEach((inc) => {
          const attributes = inc.attributes;
          if (
            inc.type === "restaurants" &&
            inc.id == pendingBooking.attributes.restaurantId
          ) {
            restaurantData = new Restaurant({
              type: inc.type,
              logo: attributes.logoUrl.medium,
              lat: attributes.lat,
              lng: attributes.lng,
              slug: attributes.slug,
              isCatalog: true,
              id: attributes.id,
              name: attributes.name,
              reviewsCount: attributes.reviewsCount,
              reviewsScore: attributes.reviewsScore,
              branchId: attributes.branchId,
              expiryDate: attributes.expiryDate,
              primaryCuisine: {
                id: attributes.primaryCuisine.id,
                name: attributes.primaryCuisine.name || "",
              },
              primaryLocation: {
                id: attributes.primaryLocation.id,
                name: attributes.primaryLocation.name || "",
              },
              imageCoverUrl: {
                thumb: null,
                original: attributes.imageCoverUrl.large,
              },
              lastBookingWasMade: attributes.lastBookingWasMade,
              totalCovers: attributes.totalCovers,
              availablePackageTypes: attributes.availablePackageTypes,
              price: {
                amount: attributes.priceAndPricingType.amount,
                currency: attributes.priceAndPricingType.currency,
                symbol: attributes.priceAndPricingType.symbol,
                format: attributes.priceAndPricingType.format,
              },
              pricingType: packagePricingType(
                "per_person",
                storageGetLanguage()
              ),
              totalLocations: attributes.locations?.length || 0,
              description: stripHtmlTag(attributes.description),
              tags: attributes.hashtags,
              openingHoursShort: attributes.openingHoursShort,
            });
          } else if (inc.type === "restaurant-packages") {
            const matchedPackage = pendingBooking.attributes.packages.filter(
              (pack) => pack.id === inc.id
            );

            if (matchedPackage.length === 1) {
              matchedPackage[0].isAlaCarte =
                inc.attributes.pricingTypeSym == PRICING_TYPE_ALA_CARTE;
              matchedPackage[0].alaCarteTotalPrice = 0;
              // add price to menu object
              const menuSections = matchedPackage[0].menuSections;
              if (Array.isArray(menuSections)) {
                menuSections.forEach((section) => {
                  const sectionFromIncluded =
                    inc.attributes.menuSections.filter(
                      (incSection) => incSection.id === section.id
                    );
                  if (
                    section.menus &&
                    section.menus.length &&
                    sectionFromIncluded &&
                    sectionFromIncluded.length
                  ) {
                    section.menus.forEach((menu) => {
                      const isMenuSelected =
                        sectionFromIncluded[0].menus.filter(
                          (incMenu) => incMenu.id === menu.id
                        );
                      if (isMenuSelected.length) {
                        menu.price = isMenuSelected[0].price;
                        if (matchedPackage[0].isAlaCarte && menu.price) {
                          matchedPackage[0].alaCarteTotalPrice +=
                            parseFloat(menu.price) * menu.quantity;
                        }
                      }
                    });
                  }
                });
              }
              const selectedRule = packagePricingRule(
                {
                  adult: pendingBooking.attributes.adult,
                },
                attributes.rules
              );
              packagesData.push({
                id: inc.id,
                selectedRule: selectedRule,
                ...attributes,
                ...matchedPackage[0],
              });
            }
          }
        });

        pendingBookings.push({
          id: pendingBooking.id,
          ...pendingBooking.attributes,
          packageData: packagesData,
          restaurantData: restaurantData,
        });
      });

      response = {
        isSuccess: true,
        data: orderBy(pendingBookings, ["serviceType"], ["desc"]),
        message: result.data.message,
      };
      return response;
    }
    response = {
      isSuccess: false,
      data: null,
      message: null,
    };
    return response;
  } catch (err) {
    rollbar.error(err || getErrorMessage);
    response = {
      isSuccess: false,
      data: null,
      message: err || getErrorMessage,
    };
    return response;
  }
}

function getFromLocal() {
  try {
    let localData = [];

    const addSelectedRuleAttribute = function (pendingReservation) {
      pendingReservation.packageData.forEach((pack) => {
        pack.selectedRule = packagePricingRule(
          {
            adult: pendingReservation.adult,
          },
          pack.rules
        );
      });
    };

    if (localPendingDineIn.value) {
      const pendingDineIn = JSON.parse(localPendingDineIn.value);
      if (pendingDineIn) {
        addSelectedRuleAttribute(pendingDineIn);
        localData.push(pendingDineIn);
      }
    }
    if (localPendingDelivery.value) {
      const pendingDelivery = JSON.parse(localPendingDelivery.value);
      if (pendingDelivery) {
        addSelectedRuleAttribute(pendingDelivery);
        localData.push(pendingDelivery);
      }
    }

    return {
      isSuccess: true,
      data: orderBy(localData, ["serviceType"], ["desc"]),
      message: "",
    };
  } catch (err) {
    return {
      isSuccess: true,
      data: [],
      message: "",
    };
  }
}

async function saveToServer(accessToken, reservation, packages) {
  try {
    const payload = {
      minorVersion: API_MINOR_VERSION,
      accessToken,
      reservation,
      packages,
    };
    // validation
    assert(payload, correctPayload);
    const url = "/pending_transactions.json";
    isLoading.value = true;
    const result = await axios({
      method: "POST",
      url: url,
      data: payload,
    });
    isLoading.value = false;
    if (result.data.success) {
      response = {
        isSuccess: true,
        data: result.data.data,
        message: null,
      };
      return response;
    } else {
      response = {
        isSuccess: false,
        data: result.data.data,
        message: result.data.message || createErrorMessage,
      };
      rollbar.error(response.message, response.data);
      return response;
    }
  } catch (err) {
    isLoading.value = false;
    if (err.dontReport) {
      return;
    }
    if (err instanceof StructError) {
      response = {
        isSuccess: false,
        data: null,
        message: `Oops, ${err.key} is wrong formatted`,
      };
      rollbar.error(response.message, err);
      return response;
    }
    response = {
      isSuccess: false,
      data: err,
      message: createErrorMessage,
    };
    rollbar.error(response.message, response.data);
    return response;
  }
}

async function saveToLocal(reservation, packageData, restaurantData) {
  // generate dummy id (because it dont have id)
  reservation.id = nanoid(10);
  const dataToSave = {
    packageData: packageData,
    restaurantData: restaurantData,
    ...reservation,
  };
  if (reservation.serviceType === "dine-in") {
    localPendingDineIn.value = JSON.stringify(dataToSave);
  } else if (reservation.serviceType === "delivery") {
    localPendingDelivery.value = JSON.stringify(dataToSave);
  }

  return {
    isSuccess: true,
    data: dataToSave,
    message: "",
  };
}

function deleteLocal(serviceType) {
  if (serviceType === "dine-in") {
    localPendingDineIn.value = null;
  } else if (serviceType === "delivery") {
    localPendingDelivery.value = null;
  }
}

export {
  isLoading as isLoadingPendingBooking,
  get as getPendingBooking,
  saveToServer as savePendingToServer,
  saveToLocal as savePendingToLocal,
  deleteLocal as deleteLocalPending,
};
