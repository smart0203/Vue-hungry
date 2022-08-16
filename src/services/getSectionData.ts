import rollbar from "@/lib/rollbar";
import { API_MINOR_VERSION } from "@/constants/api";
import { selectedCityId } from "@/composable/selectCity";
import {
  fullRestaurantMapper,
  catalogRestaurantMapper,
} from "@/services/restaurant";
import qs from "qs";
import adsMapper from "@/helper/adsMapper";
import useHttp from "@/composable/useHttp";

async function getSectionData(param: {
  pageNumber: number;
  pageSize: number;
  order: number;
  lat: number;
  lng: number;
}) {
  type SectionData = {
    message: string;
    title: string;
    data: any;
    clevertapEventName: any;
    links: any;
    ads: any;
  };
  const { pageNumber, pageSize, order, lat, lng } = param;
  const defaultErrorMessage =
    "Oops, someting went wrong, failed get section data";
  const url = `/homes/section_${order}.json`;
  const queryString = {
    city_id: selectedCityId.value,
    api_minor_version: API_MINOR_VERSION,
    page: {},
    location: {},
  };
  if (pageNumber && pageSize) {
    queryString.page = {
      size: pageSize,
      number: pageNumber,
    };
  }
  if (lat && lng) {
    queryString.location = {
      lat: lat,
      lon: lng,
    };
  }
  const stringifyQueryString = qs.stringify(queryString, { encode: false });
  const parsedUrl = `${url}?${stringifyQueryString}`;
  try {
    const { isSuccess, data, message } = await useHttp({
      url: parsedUrl,
      method: "GET",
    });
    if (!isSuccess) {
      return {
        isSuccess: false,
        message: "",
        data: [],
      };
    }
    if (isSuccess && Array.isArray(data.data)) {
      const {
        message,
        title,
        data: sectionData,
        clevertapEventName,
        links,
        ads,
      } = data as SectionData;
      // insert ads item to section data based on ads position
      if (ads && Array.isArray(ads.data)) {
        // @ts-ignore
        ads.data.forEach((currentAds) => {
          currentAds.attributes.isAds = true;
          // @ts-ignore
          adsMapper(currentAds, sectionData);
        });
      }

      // @ts-ignore
      const parsedData = sectionData.map((currentData) => {
        if (currentData.type && currentData.type.includes("restaurants")) {
          const isCatalogRestaurant =
            currentData.type === "featured_restaurants";
          if (isCatalogRestaurant) {
            return catalogRestaurantMapper(currentData);
          }
          return fullRestaurantMapper(currentData);
        }
        return {
          ...currentData.attributes,
          id: currentData.id,
          type: currentData.type,
        };
      });

      return {
        isSuccess: true,
        message: message,
        title: title,
        clevertapEventName: clevertapEventName,
        links,
        data: parsedData,
      };
    } else {
      return {
        isSuccess: false,
        message: message || defaultErrorMessage,
        data: [],
      };
    }
  } catch (err: any) {
    rollbar.error(err || defaultErrorMessage, {
      order: order,
    });
    return {
      isSuccess: false,
      data: "",
      message: err.message || defaultErrorMessage,
    };
  }
}

export default getSectionData;
