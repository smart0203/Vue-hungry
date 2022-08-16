import { ref } from "@vue/composition-api";
import axios from "@/lib/myAjax";
import rollbar from "@/lib/rollbar";

let defaultErrorMessage =
  "Oops, something went wrong, failed get delivery pricing tier";
let isLoading = ref(false);
let response;

async function get(restaurantId) {
  if (!restaurantId) {
    const message = "Failed getting delivery pricing, restaurantId is missing";
    rollbar.error(message);
    return {
      isSuccess: false,
      data: null,
      message: message,
    };
  }
  isLoading.value = true;
  try {
    const axiosResponse = await axios({
      method: "POST",
      url: `/restaurants/${restaurantId}/delivery_pricing_tiers.json`,
    });
    isLoading.value = false;
    if (
      axiosResponse.data &&
      axiosResponse.data.data &&
      axiosResponse.data.success
    ) {
      response = {
        isSuccess: true,
        data: axiosResponse.data.data.map((item) => {
          return {
            id: item.id,
            ...item.attributes,
          };
        }),
        message: axiosResponse.data.message,
      };
      return response;
    }
    response = {
      isSuccess: false,
      data: axiosResponse.data.data.map((item) => {
        return {
          id: item.id,
          ...item.attributes,
        };
      }),
      message: axiosResponse.data.message || defaultErrorMessage,
    };
    return response;
  } catch (err) {
    rollbar.error(err || defaultErrorMessage);
    response = {
      isSuccess: false,
      data: null,
      message: err || defaultErrorMessage,
    };
    return response;
  }
}

export {
  isLoading as isLoadingPricingTier,
  get as getPricingTier,
  response as responsePricingTier,
};
