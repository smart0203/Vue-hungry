import { workerFetch, axios } from "@/lib/fetcher";
import rollbar from "@/lib/rollbar";
import dayjs from "@/lib/dayjs";
import Restaurant from "@/models/restaurant";
import { packagePricingType } from "@/helper/PackageHelper";
import { stripHtmlTag } from "@/helper/stringHelper";
import { storageGetLanguage } from "@/lib/localStorage";
import qs from "qs";
import humps from "humps";
import isEmpty from "lodash-es/isEmpty";
import isArray from "lodash-es/isArray";
import adsMapper from "@/helper/adsMapper";
import useHttp from "@/composable/useHttp";

async function searchRestaurant({
  keyword,
  location,
  locationId,
  cuisineId,
  hashtags,
  branchId,
  pageNumber = 1,
  pageSize = 10,
  cityId,
  startPrice,
  endPrice,
  serviceType,
  groupTagsId,
  sortBy,
  date,
  time,
  packageType,
  section,
}) {
  try {
    const baseUrl = `/restaurants/search.json`;
    const defaultQueryString = `?page[size]=${pageSize}&page[number]=${pageNumber}`;
    const additionalQueryString = {};
    if (cityId) {
      additionalQueryString.cityId = cityId;
    }
    if (location && location.lat && location.lng) {
      additionalQueryString.geocode = {
        lat: location.lat,
        long: location.lng,
      };
    }
    if (locationId) {
      additionalQueryString.locationIdsEq = locationId;
    }
    if (cuisineId) {
      additionalQueryString.cuisineIdEq = cuisineId;
    }
    if (groupTagsId) {
      additionalQueryString.groupTagIdsEq = groupTagsId;
    }
    if (branchId) {
      additionalQueryString.branchIdEq = branchId;
    }
    if (hashtags) {
      additionalQueryString.tagIdEq = hashtags;
    }
    if (endPrice) {
      additionalQueryString.price = {
        operator: "between",
        x: startPrice,
        y: endPrice,
      };
    }
    if (keyword) {
      additionalQueryString.nameLike = keyword;
    }
    if (serviceType) {
      if (serviceType !== "delivery" && serviceType !== "dine_in") {
        throw new Error(
          'invalid serviceType, should be "dine_in" or "delivery" '
        );
      }
      additionalQueryString.serviceType = serviceType;
    }
    if (sortBy) {
      additionalQueryString.sort = sortBy;
    }
    if (date) {
      additionalQueryString.date = date;
    }
    if (time) {
      additionalQueryString.startTime = time;
    }
    if (packageType) {
      additionalQueryString.packageType = packageType;
    }
    if (section) {
      additionalQueryString.section = section;
    }

    const parseAdditionalQueryString = qs.stringify(
      humps.decamelizeKeys(additionalQueryString),
      {
        encode: false,
      }
    );
    const finalQueryString = `${defaultQueryString}&${parseAdditionalQueryString}`;

    const finalUrl = `${baseUrl}${finalQueryString}`;
    const response = await workerFetch({
      url: finalUrl,
    });

    if (response.success === true) {
      let restaurantList = [];
      const restaurants = response.data;
      const ads = response.ads;
      const meta = response.links;

      // insert ads item to section data based on ads position
      if (ads && Array.isArray(ads.data)) {
        ads.data.forEach((currentAds) => {
          currentAds.attributes.isAds = true;
          adsMapper(currentAds, restaurants);
        });
      }

      restaurants.forEach((restaurant) => {
        const restaurantObj = fullRestaurantMapper(restaurant);
        restaurantList.push(restaurantObj);
      });
      return {
        isSuccess: true,
        data: restaurantList,
        meta: meta,
        message: "",
      };
    }
    rollbar.error(response.message, response);
    return {
      isSuccess: false,
      data: [],
      message: response.message,
    };
  } catch (err) {
    if (err.dontReport) {
      return {
        isSuccess: false,
        message: null,
      };
    }
    const error = {
      message: "Oops, something went wrong, failed search restaurant",
      cause: err,
    };
    rollbar.error(error.message, error.cause);
    return {
      isSuccess: false,
      data: [],
      message: error.message,
    };
  }
}

async function getRestaurantTagGroup({
  pageSize = 10,
  pageNumber = 1,
  tagId = 0,
  compactMode = false,
}) {
  const defaultErrorMessage =
    "Oops, something went wrong, failed get restaurant tag group";
  try {
    let baseUrl = `/restaurant_tag_groups/${tagId}.json`;
    const url = `${baseUrl}?page[size]=${pageSize}&page[number]=${pageNumber}&compact_mode=${compactMode}`;
    const { isSuccess, data, error } = await useHttp({
      url,
    });
    if (isSuccess === true) {
      let restaurantList = [];
      const restaurants = data.data;
      const meta = data.links;
      restaurants.forEach((restaurant) => {
        let restaurantObj;
        if (restaurant.type === "featured_restaurants") {
          restaurantObj = catalogRestaurantMapper(restaurant);
        } else {
          restaurantObj = fullRestaurantMapper(restaurant);
        }
        restaurantList.push(restaurantObj);
      });
      return {
        isSuccess: true,
        data: restaurantList,
        meta: meta,
        message: "",
      };
    } else {
      const errorObject = {
        message: error.message || defaultErrorMessage,
        cause: error.detail,
      };
      rollbar.error(errorObject.message, errorObject.cause);
      return {
        isSuccess: false,
        data: [],
        message: errorObject.message,
      };
    }
  } catch (err) {
    if (err.dontReport) {
      return {
        isSuccess: false,
        message: null,
      };
    }
    const error = {
      message: defaultErrorMessage,
      cause: err,
    };
    rollbar.error(error.message, error.cause);
    return {
      isSuccess: false,
      message: error.message,
    };
  }
}

async function getRestaurantTagGroupList({ pageSize = 10, pageNumber = 1 }) {
  const defaultErrorMessage =
    "Oops, something went wrong, failed get restaurant tag group";
  try {
    let baseUrl = "/restaurant_tag_groups.json";
    const url = `${baseUrl}?page[size]=${pageSize}&page[number]=${pageNumber}`;
    const { isSuccess, data, error } = await useHttp({
      url,
    });
    const resultData = data.data;
    if (isSuccess && resultData.length) {
      const currentLang = storageGetLanguage();
      const tagGroups = resultData.map((tagGroup) => {
        let link = tagGroup.attributes.link;
        if (tagGroup.relationships?.groupLandingPages?.data?.length) {
          link = `/${tagGroup.relationships.groupLandingPages.data[0].slug}?locale=${currentLang}`;
        }
        return {
          ...tagGroup.attributes,
          id: tagGroup.id,
          link: link,
        };
      });
      return {
        isSuccess: true,
        data: tagGroups,
        message: "",
      };
    } else {
      const errorObject = {
        message: error.message || defaultErrorMessage,
        cause: error.detail,
      };
      rollbar.error(errorObject.message, errorObject.cause);
      return {
        isSuccess: false,
        data: [],
        message: errorObject.message,
      };
    }
  } catch (err) {
    if (err.dontReport) {
      return {
        isSuccess: false,
        message: null,
      };
    }
    const error = {
      message: defaultErrorMessage,
      cause: err,
    };
    rollbar.error(error.message, error.cause);
    return {
      isSuccess: false,
      message: error.message,
    };
  }
}

async function getFeaturedRestaurant({
  pageSize = 20,
  pageNumber = 1,
  cityId = 1,
}) {
  try {
    const url = `/restaurants/featured.json?page[size]=${pageSize}&page[number]=${pageNumber}&city_id=${cityId}`;
    const result = await workerFetch({
      url,
    });
    const resultData = result.data;
    if (result.success) {
      let restaurantData = [];
      resultData.forEach((restaurant) => {
        const restaurantObj = catalogRestaurantMapper(restaurant);
        restaurantData.push(restaurantObj);
      });

      return {
        isSuccess: true,
        data: restaurantData,
      };
    } else {
      const error = {
        message: "Oops, something went wrong, failed get featured restaurant",
        cause: result,
      };
      rollbar.error(error.message, error.cause);
      return {
        isSuccess: false,
        message: error.message,
      };
    }
  } catch (err) {
    if (err.dontReport) {
      return {
        isSuccess: false,
        message: null,
      };
    }
    const error = {
      message: "Oops, something went wrong, failed get featured restaurant",
      cause: err,
    };
    rollbar.error(error.message, error.cause);
    return {
      isSuccess: false,
      message: error.message,
    };
  }
}

async function getTopNewRestaurant({
  type,
  cityId = 1,
  pageSize = 10,
  pageNumber = 1,
}) {
  let meta = {};
  try {
    if (type !== "top" && type !== "new") {
      throw new Error("restaurant type must 'new' or 'top' ");
    }

    const url = `/restaurants/new_compact.json?sort_by=${type}&page[size]=${pageSize}&page[number]=${pageNumber}&city_id=${cityId}`;
    const result = await axios({
      url,
      canRetry: true,
    });

    const resultData = result.data;
    if (resultData.success && isArray(resultData.data)) {
      const restaurants = resultData.data.map((restaurant) => {
        const restaurantObj = catalogRestaurantMapper(restaurant);
        return restaurantObj;
      });
      meta = !isEmpty(resultData.links) ? resultData.links : {};
      return {
        isSuccess: true,
        data: restaurants,
        meta,
      };
    } else {
      const error = {
        message: `Oops, something went wrong, failed get ${type} restaurant`,
        cause: result,
      };
      rollbar.error(error.message, error.cause);
      return {
        isSuccess: false,
        message: error.message,
        meta,
      };
    }
  } catch (err) {
    if (err.dontReport) {
      return {
        isSuccess: false,
        message: null,
        meta,
      };
    }
    const error = {
      message: `Oops, something went wrong, failed get ${type} restaurant`,
      cause: err,
    };
    rollbar.error(error.message, error.cause);
    return {
      isSuccess: false,
      message: error.message,
      meta,
    };
  }
}

async function getSimilarRestaurant(restaurantId) {
  const currentDate = dayjs().format("YYYY-MM-DD");
  const url = `/restaurants/${restaurantId}/similar.json?page=1&date=${currentDate}`;
  try {
    const { isSuccess, data, error } = await useHttp({
      url: url,
    });
    if (isSuccess === true) {
      if (data.data.length) {
        const restaurants = data.data.map((restaurant) => {
          const restaurantObj = catalogRestaurantMapper(restaurant);
          return restaurantObj;
        });

        return {
          isSuccess: true,
          message: "",
          data: restaurants,
        };
      }
      return {
        isSuccess: true,
        message: "",
        data: [],
      };
    }
    const errorObject = {
      isSuccess: false,
      message:
        error.message ||
        "Oops, something went wrong, failed get similar restaurant",
      data: error.detail,
    };
    rollbar.error(errorObject.message, errorObject.data);
    return error;
  } catch (err) {
    if (err.dontReport) {
      return {
        isSuccess: false,
        message: null,
      };
    }
    const error = {
      isSuccess: false,
      message: "Oops, something went wrong, failed get similar restaurant",
      data: err,
    };
    rollbar.error(error.message, error.data);
    return error;
  }
}

async function getRestaurantAround(restaurantId) {
  try {
    if (!restaurantId) {
      throw new Error("Invalid or missing restaurantId");
    }
    const url = `/restaurants/${restaurantId}/around_restaurants.json`;
    const { isSuccess, data, error } = await useHttp({
      url: url,
    });
    if (isSuccess === true) {
      if (data.data.length) {
        const restaurants = data.data.map((restaurant) => {
          const restaurantObj = catalogRestaurantMapper(restaurant);
          return restaurantObj;
        });

        return {
          isSuccess: true,
          message: "",
          data: restaurants,
        };
      }
      return {
        isSuccess: true,
        message: "",
        data: [],
      };
    }
    const errorObject = {
      isSuccess: false,
      message:
        error.message ||
        "Oops, something went wrong, failed get restaurant around",
      data: error.detail,
    };
    rollbar.error(errorObject.message, errorObject.data);
    return error;
  } catch (err) {
    if (err.dontReport) {
      return {
        isSuccess: false,
        message: null,
      };
    }
    const error = {
      isSuccess: false,
      message: "Oops, something went wrong, failed get restaurant around",
      data: err,
    };
    rollbar.error(error.message, error.data);
    return error;
  }
}

async function getRestaurantsDeliveryFee(restaurantIDs, lat, lng) {
  const defaultErrorMessage =
    "Ops, something went wrong, failed get restaurants delivery fee";
  if (
    !Array.isArray(restaurantIDs) ||
    typeof lat !== "number" ||
    typeof lng !== "number"
  ) {
    let message = [];
    if (!Array.isArray(restaurantIDs)) {
      message.push("restaurantIDs is not Array");
    }
    if (typeof lat !== "number") {
      message.push("lat is not an number");
    }
    if (typeof lng !== "number") {
      message.push("lng is not an number");
    }
    return {
      isSuccess: false,
      data: [],
      message: `${defaultErrorMessage} ${message.toString()}`,
    };
  }
  try {
    const request = await axios({
      url: "/restaurants/calc_delivery_fees.json",
      method: "POST",
      data: {
        restaurantIds: restaurantIDs,
        lat,
        lng,
      },
      canRetry: false,
    });
    if (request.data.success) {
      return {
        isSuccess: true,
        message: request.data.message || "",
        data: request.data.data,
      };
    }
    const errorMessage = request.message || defaultErrorMessage;
    rollbar.error(errorMessage, { data: request.data });
    return {
      isSuccess: false,
      message: errorMessage,
      data: request.data,
    };
  } catch (err) {
    const errorMessage = err || defaultErrorMessage;
    rollbar.error(errorMessage, err);
    return {
      isSuccess: false,
      data: [],
      message: errorMessage,
    };
  }
}

async function getRestaurantByType({
  type,
  value,
  pageNumber = 1,
  pageSize = 10,
  compactMode = false,
}) {
  const defaultErrorMessage =
    "Oops, something went wrong, failed get restaurant by branch";
  let response = {
    isSuccess: undefined,
    message: "",
  };
  const validType = ["branch", "tags", "groupTags"];
  if (
    validType.indexOf(type) === -1 ||
    (typeof value !== "string" && typeof value !== "number")
  ) {
    response.isSuccess = false;
    response.message = "Invalid type paramater or value parameter";
    return response;
  }
  const generateUrl = () => {
    let url = "";
    let defaultQueryString = `compact_mode=${compactMode}&page[size]=${pageSize}&page[number]=${pageNumber}`;
    if (type === "branch") {
      url = `/branch/${value}/restaurants.json?${defaultQueryString}`;
    } else if (type === "tags") {
      url = `/restaurant_tags/${value}/restaurants.json?${defaultQueryString}`;
    } else if (type === "groupTags") {
      url = `/restaurant_tag_groups/${value}.json?${defaultQueryString}`;
    } else {
      rollbar.error("Not implemented", { type });
    }
    return url;
  };

  try {
    let meta = {};
    const request = await axios({
      url: generateUrl(),
      canRetry: true,
    });
    if (request.data.success) {
      meta = request.data.links || {};
      let restaurantData = [];
      request.data.data.forEach((restaurant) => {
        let restaurantObj;
        if (restaurant.type === "featured_restaurants") {
          restaurantObj = catalogRestaurantMapper(restaurant);
        } else {
          restaurantObj = fullRestaurantMapper(restaurant);
        }
        restaurantData.push(restaurantObj);
      });
      return {
        isSuccess: true,
        message: request.data.message || "",
        data: restaurantData,
        meta,
      };
    }
    const errorMessage = request.message || defaultErrorMessage;
    rollbar.error(errorMessage, { data: request.data });
    return {
      isSuccess: false,
      message: errorMessage,
      data: request.data,
      meta,
    };
  } catch (err) {
    const errorMessage = err || defaultErrorMessage;
    rollbar.error(errorMessage, err);
    return {
      isSuccess: false,
      data: [],
      message: errorMessage,
    };
  }
}

function initDummyRestaurant() {
  return new Restaurant({
    type: "restaurants",
    slug: "",
    isCatalog: true,
    id: Math.random().toString(36),
    name: "",
    reviewsCount: 0,
    reviewsScore: 0,
    branchId: "",
    primaryCuisine: {
      id: null,
      name: "",
    },
    primaryLocation: {
      id: null,
      name: "",
    },
    imageCoverUrl: {
      thumb: "",
      original: "",
    },
    lastBookingWasMade: "",
    totalCovers: "",
    availablePackageTypes: ["hah", "ayce"],
    price: {
      amount: 0,
      currency: "",
      symbol: "",
      format: "",
    },
    openingHoursShort: "",
    pricingType: "",
    totalLocations: 0,
    description: "",
    expiryDate: "",
    isFavourited: false,
    isAcceptVoucher: false,
  });
}

function catalogRestaurantMapper(restaurantData) {
  const restaurantType = restaurantData.type;
  const restaurantsAttributes = restaurantData.attributes;
  const restaurantId = restaurantsAttributes.restaurantId || restaurantData.id;
  const restaurantObj = new Restaurant({
    type: restaurantType,
    slug: restaurantsAttributes.restaurantEncryptedId,
    isCatalog: true,
    isAds: restaurantsAttributes.isAds,
    id: restaurantId,
    name: restaurantsAttributes.name,
    reviewsCount: restaurantsAttributes.totalReviews,
    reviewsScore: restaurantsAttributes.avgReviews,
    branchId: restaurantsAttributes.branchId,
    primaryCuisine: {
      id: null,
      name: restaurantsAttributes.cuisine || "",
    },
    primaryLocation: {
      id: null,
      name: restaurantsAttributes.location || "",
    },
    imageCoverUrl: {
      thumb: null,
      original: restaurantsAttributes.cover?.original,
    },
    lastBookingWasMade: restaurantsAttributes.lastBookingWasMade,
    totalCovers: restaurantsAttributes.totalCovers,
    availablePackageTypes: restaurantsAttributes.packageTypes,
    price: {
      amount: restaurantsAttributes.priceV2.amount,
      currency: restaurantsAttributes.priceV2.currency,
      symbol: restaurantsAttributes.priceV2.symbol,
      format: restaurantsAttributes.priceV2.format,
    },
    pricingType: packagePricingType("per_person", storageGetLanguage()),
    totalLocations: restaurantsAttributes.totalLocations || 0,
    description: stripHtmlTag(restaurantsAttributes.description),
    customText: restaurantsAttributes.customText,
    acceptVoucher: restaurantsAttributes.acceptVoucher,
  });
  return restaurantObj;
}

function fullRestaurantMapper(restaurantData) {
  const restaurantsAttributes = restaurantData.attributes;
  const restaurantType = restaurantData.type;
  const restaurantId = restaurantData.id;
  const restaurantObj = new Restaurant({
    type: restaurantType,
    logo: restaurantsAttributes.logoUrl.medium,
    lat: restaurantsAttributes.lat,
    lng: restaurantsAttributes.lng,
    slug: restaurantsAttributes.slug,
    isCatalog: true,
    isAds: restaurantsAttributes.isAds,
    id: restaurantId,
    name: restaurantsAttributes.name,
    reviewsCount: restaurantsAttributes.reviewsCount,
    reviewsScore: restaurantsAttributes.reviewsScore,
    branchId: restaurantsAttributes.branchId,
    expiryDate: restaurantsAttributes.expiryDate,
    primaryCuisine: {
      id: restaurantsAttributes.primaryCuisine.id,
      name: restaurantsAttributes.primaryCuisine.name || "",
    },
    primaryLocation: {
      id: restaurantsAttributes.primaryLocation.id,
      name: restaurantsAttributes.primaryLocation.name || "",
    },
    imageCoverUrl: {
      thumb: null,
      original: restaurantsAttributes.imageCoverUrl.large,
    },
    lastBookingWasMade: restaurantsAttributes.lastBookingWasMade,
    totalCovers: restaurantsAttributes.totalCovers,
    availablePackageTypes: restaurantsAttributes.availablePackageTypes,
    price: {
      amount: restaurantsAttributes.priceAndPricingType.amount,
      currency: restaurantsAttributes.priceAndPricingType.currency,
      symbol: restaurantsAttributes.priceAndPricingType.symbol,
      format: restaurantsAttributes.priceAndPricingType.format,
    },
    pricingType: packagePricingType("per_person", storageGetLanguage()),
    totalLocations: restaurantsAttributes.locations?.length || 0,
    description: stripHtmlTag(restaurantsAttributes.description),
    tags: restaurantsAttributes.hashtags,
    openingHoursShort: restaurantsAttributes.openingHoursShort,
    customText: restaurantsAttributes.customText,
    hasDeliveryPricingTier: restaurantsAttributes.hasDeliveryPricingTier,
    acceptVoucher: restaurantsAttributes.acceptVoucher,
  });
  return restaurantObj;
}

export {
  getRestaurantTagGroup,
  getFeaturedRestaurant,
  getTopNewRestaurant,
  searchRestaurant,
  getSimilarRestaurant,
  initDummyRestaurant,
  getRestaurantTagGroupList,
  getRestaurantAround,
  getRestaurantsDeliveryFee,
  fullRestaurantMapper,
  getRestaurantByType,
  catalogRestaurantMapper,
};
