import { ref } from "@vue/composition-api";
import validateEventId from "@/services/validateEventId";
import * as alert from "@/lib/alert";

const eventId = ref(0);
const eventForRestaurant = ref(0);
const isValid = ref(false);
const isLoading = ref(false);
const isSuccess = ref(false);
const eventData = ref({});
const eventPackages = ref([]);

function setEventId(paramEventId) {
  if (typeof paramEventId !== "number" && typeof paramEventId !== "string") {
    throw new Error("Invalid or missing Invalid Id");
  }
  eventId.value = paramEventId;
}

function setEventForRestaurant(restaurantId) {
  if (typeof restaurantId !== "number" && typeof restaurantId !== "string") {
    throw new Error("Invalid or missing restaurant Id");
  }
  eventForRestaurant.value = restaurantId;
}

function resetState() {
  eventId.value = 0;
  eventForRestaurant.value = 0;
  isValid.value = false;
  isLoading.value = false;
  isSuccess.value = false;
  eventData.value = {};
  eventPackages.value = [];
}

async function validateEvent() {
  isLoading.value = true;
  const request = await validateEventId(eventId.value);
  if (request.isSuccess) {
    isSuccess.value = true;
    eventData.value = request.data;
    if (eventData.value.restaurantId == eventForRestaurant.value) {
      isValid.value = true;
      eventPackages.value =
        request.data.restaurantPackages?.data.map((pack) => pack.id) || [];
      isLoading.value = false;
      return;
    }
    isValid.value = false;
    eventPackages.value = [];
    isLoading.value = false;
    alert.error("You open wrong corporate restaurant");
    return;
  }
  isValid.value = false;
  isSuccess.value = false;
  eventData.value = {};
  eventPackages.value = [];
  isLoading.value = false;
}

export {
  eventForRestaurant,
  eventId,
  isValid,
  isLoading,
  isSuccess,
  eventData,
  eventPackages,
  setEventId,
  setEventForRestaurant,
  validateEvent,
  resetState,
};
