import { ref, computed } from "@vue/composition-api";
import { getBanners } from "@/services/common";
import * as alert from "@/lib/alert";

const banners = ref([]);
const isLoading = ref(false);

const homeBanners = computed(() => {
  return banners.value.filter((promotion) => {
    if (promotion.locations && promotion.locations.length) {
      const isLocationPromotion = promotion.locations.filter((location) =>
        location.includes("home_page")
      );
      return isLocationPromotion.length > 0 ? true : false;
    }
    return false;
  });
});

const promotionBanners = computed(() => {
  return banners.value.filter((promotion) => {
    if (promotion.locations && promotion.locations.length) {
      const isLocationPromotion = promotion.locations.filter((location) =>
        location.includes("promotions")
      );
      return isLocationPromotion.length > 0 ? true : false;
    }
    return false;
  });
});

async function fetchBanners() {
  isLoading.value = true;
  const { isSuccess, data, message } = await getBanners();
  if (isSuccess) {
    banners.value = data;
    isLoading.value = false;
    return;
  }
  alert.error(message);
  isLoading.value = false;
}

export { fetchBanners, banners, isLoading, homeBanners, promotionBanners };
