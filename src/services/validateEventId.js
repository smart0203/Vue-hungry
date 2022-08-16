import { axios } from "@/lib/fetcher";
import isEmpty from "lodash-es/isEmpty";
import rollbar from "@/lib/rollbar";

async function validateEventId(eventId) {
  const defaultErrorMessage =
    "Oops, something went wrong, failed validate event id";
  try {
    if (!eventId) {
      throw new Error("Missing or invalid event id");
    }
    const result = await axios({
      method: "POST",
      url: "/corporates/events/validate",
      data: {
        secretKey: eventId,
      },
    });

    const resultData = result.data;
    if (!isEmpty(resultData) && resultData.success) {
      const eventData = resultData.data;
      if (!isEmpty(eventData)) {
        const remapEventData = {
          id: eventData.id,
          restaurantPackages: eventData.relationships.restaurantPackages,
          ...eventData.attributes,
        };
        return {
          isSuccess: true,
          data: remapEventData,
          message: "",
        };
      }
      rollbar.error(`${defaultErrorMessage}, Data is Empty`, {
        data: resultData,
      });
      return {
        isSuccess: false,
        message: "Data is Empty",
        data: null,
      };
    }
    return {
      isSuccess: false,
      message: resultData.message || defaultErrorMessage,
      data: null,
    };
  } catch (err) {
    rollbar.error(`${defaultErrorMessage}`, err);
    return {
      isSuccess: false,
      message: err || defaultErrorMessage,
      data: null,
    };
  }
}

export default validateEventId;
