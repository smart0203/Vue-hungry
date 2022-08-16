import { ref } from "@vue/composition-api";
import rollbar from "@/lib/rollbar";
import * as alert from "@/lib/alert";
import { Swiper, Navigation, Autoplay } from "swiper";
Swiper.use([Navigation, Autoplay]);
import {
  initDummyRestaurant,
  getRestaurantByType,
} from "@/services/restaurant";
import { getGroupLanding } from "@/composable/groupLanding";
import filter from "lodash-es/filter";
import { isDesktop } from "@/helper/screenSizeHelper";
import generateRestaurantDeliveryFee from "@/composable/restaurantDeliveryFee";

function main(id) {
  let pageNumber = ref(1);
  let pageSize = 6;
  let groupLandingId = ref(id);
  let isGroupLandingFound = ref(false);
  let isLoadingGetLandingData = ref(true);
  let isLoadingGetRestaurants = ref(false);
  let anyRemainingRestaurants = ref(true);
  let desktopPhotos = ref([]);
  let mobilePhotos = ref([]);
  let title = ref("");
  let description = ref("");
  let footerDescription = ref("");
  let restaurants = ref([]);
  let totalRestaurants = ref(0);
  let groupTagId = ref(0);
  let branchId = ref(0);
  let hashtags = ref("");
  let groupLandingData = ref({});
  let compactRestaurant = ref(false);

  function insertDummyRestaurants() {
    const count = isDesktop ? 6 : 4;
    for (let index = 0; index < count; index++) {
      restaurants.value.push(initDummyRestaurant());
    }
  }

  async function getRestaurantsList() {
    try {
      isLoadingGetRestaurants.value = true;
      let result;
      const generateTypeValue = () => {
        let type = "";
        let value = "";
        if (branchId.value) {
          type = "branch";
          value = branchId.value;
        } else if (hashtags.value) {
          type = "tags";
          value = hashtags.value;
        } else if (groupTagId.value) {
          type = "groupTags";
          value = groupTagId.value;
        } else {
          rollbar.error("Not implemented", {
            branchId: branchId.value,
            hashtags: hashtags.value,
            groupTagId: groupTagId.value,
          });
        }
        return {
          type,
          value,
        };
      };
      const { type, value } = generateTypeValue();
      result = await getRestaurantByType({
        pageNumber: pageNumber.value,
        pageSize: pageSize,
        type,
        value,
        compactMode: compactRestaurant.value,
      });
      if (result.isSuccess && result.data) {
        const restaurants = result.data;
        generateRestaurantDeliveryFee(restaurants);
        isLoadingGetRestaurants.value = false;
        if (result.meta.next?.length > 0) {
          anyRemainingRestaurants.value = true;
        } else {
          anyRemainingRestaurants.value = false;
        }
        return restaurants;
      } else {
        alert.error(result.message);
      }
    } catch (err) {
      alert.error(
        "Oops, something went wrong, failed get group restaurants list"
      );
      rollbar.error(err);
    }
  }

  async function getMoreRestaurantsList() {
    if (!isLoadingGetLandingData.value || !isLoadingGetRestaurants.value) {
      pageNumber.value = pageNumber.value + 1;
      const result = await getRestaurantsList();
      restaurants.value = restaurants.value.concat(result);
    }
  }

  async function getGroupLandingData() {
    try {
      isLoadingGetLandingData.value = true;
      const result = await getGroupLanding(groupLandingId.value);
      if (result.isSuccess) {
        groupLandingData.value = result.data;
        desktopPhotos.value = filter(result.data.desktopPhotos);
        mobilePhotos.value = filter(result.data.mobilePhotos);
        title.value = result.data.title;
        description.value = result.data.description;
        totalRestaurants.value = result.data.totalRestaurants;
        groupTagId.value = result.data.groupTagId;
        branchId.value = result.data.branchId;
        hashtags.value = result.data.tagId;
        footerDescription.value = result.data.footerDescription;
        compactRestaurant.value = result.data.compactRestaurant;
        restaurants.value = await getRestaurantsList();
        isGroupLandingFound.value = true;
        isLoadingGetLandingData.value = false;
      } else {
        isGroupLandingFound.value = false;
        alert.error(result.message);
        // if failed getting group landing page, then redirect to home
        setTimeout(() => {
          window.location = "/";
        }, 300);
      }
    } catch (err) {
      isGroupLandingFound.value = false;
      alert.error("Oops, something went wrong, failed get group landing data");
      rollbar.error(err);
    }
  }

  async function initMainSlider({ el, nextEl, prevEl }) {
    try {
      new Swiper(el, {
        slidesPerView: 1,
        loop: true,
        autoPlay: true,
        navigation: {
          nextEl: nextEl,
          prevEl: prevEl,
        },
      });
    } catch (err) {
      rollbar.error(err);
    }
  }

  insertDummyRestaurants();
  return {
    isGroupLandingFound,
    isLoadingGetLandingData,
    isLoadingGetRestaurants,
    desktopPhotos,
    mobilePhotos,
    title,
    description,
    footerDescription,
    restaurants,
    totalRestaurants,
    groupTagId,
    groupLandingData,
    getGroupLandingData,
    insertDummyRestaurants,
    initMainSlider,
    getMoreRestaurantsList,
    getRestaurantsList,
    anyRemainingRestaurants,
  };
}

export default main;
