import { ref, computed } from "@vue/composition-api";
import { useStorage } from "@vueuse/core";
import { isAllowLocalStorage } from "@/helper/storagePermissionHelper";
import { getAvailableCities as serviceGetCities } from "@/services/common";
import * as alert from "@/lib/alert";
import isEmpty from "lodash-es/isEmpty";

type AvailableCities = {
  id: string;
  type: string;
  name: string;
  homeDescription: string;
}[];
const allCityOption = {
  name: "All Cities",
  homeDescription: "",
  type: "",
  id: "",
};
const localStorageKey = "hungryhub_selected_city_id";
const defaultSelectedCityId = "1"; // Bangkok

const isLoading = ref(true);
const selectedCityId = isAllowLocalStorage()
  ? useStorage(localStorageKey, defaultSelectedCityId)
  : ref(defaultSelectedCityId);
const availableCities = ref<AvailableCities>([]);
const selectedCity = computed(() => {
  if (
    isLoading.value === true ||
    !selectedCityId.value ||
    !availableCities.value ||
    isEmpty(availableCities.value)
  ) {
    return {
      name: "",
      homeDescription: "",
      type: "",
      id: 0,
    };
  }
  const filter = availableCities.value.filter(
    (city) => city.id == selectedCityId.value
  );
  return filter[0];
});

const selectedCityName = computed(() => {
  return selectedCity.value.name;
});

const selectedCityHomeDescription = computed(() => {
  return selectedCity.value.homeDescription;
});

async function getAvailableCities() {
  isLoading.value = true;
  const result = await serviceGetCities();
  if (result.isSuccess && Array.isArray(result.data)) {
    availableCities.value.push(allCityOption);
    result.data.forEach((city) => {
      availableCities.value.push({
        id: city.id,
        type: city.type,
        ...city.attributes,
      });
    });
    isLoading.value = false;
    return;
  }
  alert.error(result.message);
}

export {
  selectedCity,
  selectedCityId,
  selectedCityName,
  selectedCityHomeDescription,
  isLoading,
  availableCities,
  getAvailableCities,
};
