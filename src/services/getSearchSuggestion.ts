// @ts-ignore
import { axios } from "@/lib/fetcher";
import rollbar from "@/lib/rollbar";

async function getSearchSuggestion(keyword: string, cityId = 1) {
  if (!keyword || (keyword && keyword.length === 0)) {
    throw new Error("keyword paramater is missing");
  }
  const defaultErrorMessage =
    "Oops, something went wrong, failed get search suggestion";

  let url = `/suggest.json?keyword=${encodeURIComponent(
    keyword
  )}&page[size]=10&page[number]=1`;

  if (cityId) {
    url = `${url}&city_id=${cityId}`;
  }

  if (keyword.length === 0) {
    return {
      isSuccess: true,
      data: {
        restaurants: [],
        locations: [],
        cuisines: [],
      },
      message: "",
    };
  }

  try {
    const result = await axios({
      url: url,
      method: "get",
    });
    if (result.data) {
      if (result.data.data && result.data.success) {
        return {
          isSuccess: true,
          data: result.data.data,
          message: result.data.message,
        };
      }
      rollbar.error(result.data.message || defaultErrorMessage, {
        keyword: keyword,
      });
      return {
        isSuccess: false,
        data: "",
        message: result.data.message || defaultErrorMessage,
      };
    }
    return {
      isSuccess: false,
      data: "",
      message: defaultErrorMessage,
    };
  } catch (err: any) {
    rollbar.error(err || defaultErrorMessage, {
      keyword: keyword,
    });
    return {
      isSuccess: false,
      data: "",
      message: err.message || defaultErrorMessage,
    };
  }
}

async function getAdsSearchSuggestion() {
  const defaultErrorMessage =
    "Oops, something went wrong, failed get ads search suggestion";

  const url = `/suggest_ads.json`;
  try {
    const result = await axios({
      url: url,
      method: "get",
    });
    if (result.data) {
      if (result.data.data?.restaurants && result.data.success) {
        return {
          isSuccess: true,
          data: result.data.data.restaurants,
          message: result.data.message,
        };
      }
      rollbar.error(result.data.message || defaultErrorMessage, {
        response: result.data.data,
      });
      return {
        isSuccess: false,
        data: "",
        message: result.data.message || defaultErrorMessage,
      };
    }
    return {
      isSuccess: false,
      data: "",
      message: defaultErrorMessage,
    };
  } catch (err: any) {
    rollbar.error(err || defaultErrorMessage);
    return {
      isSuccess: false,
      data: "",
      message: err.message || defaultErrorMessage,
    };
  }
}

export { getSearchSuggestion, getAdsSearchSuggestion };
