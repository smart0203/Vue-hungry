import { getFavourite } from "@/services/user";
import { ref, computed } from "@vue/composition-api";
import store from "@/store/index";
import isArray from "lodash-es/isArray";
import * as alert from "@/lib/alert";
import Vue from "vue";
import { toggleFavouriteRestaurant as togggleFavRestaurant } from "@/services/user";

let isLoading = ref(false);
let isLoadingLoadMore = ref(false);
const pageNumber = ref(1);
const pageSize = ref(10);
let anyNextPage = ref(false);
let accessToken = computed(() => {
  return store.state.user.accessToken;
});
const isUserSignedIn = computed(() => {
  return store.getters["user/isUserSignedIn"];
});
let favoriteRestaurants = ref([]);
let favouriteRestaurantIds = computed(() => {
  return favoriteRestaurants.value.map((item) => item.id);
});

async function loadMoreFavouriteRestaurant() {
  pageNumber.value += 1;
  return getFavoriteRestaurants(pageNumber.value, pageSize.value);
}

function toggleLoading(toggleIsLoading) {
  if (pageNumber.value === 1) {
    isLoading.value = toggleIsLoading;
    return;
  }
  isLoadingLoadMore.value = toggleIsLoading;
}

async function getFavoriteRestaurants(pageNumber = 1, pageSize = 10) {
  try {
    toggleLoading(true);
    const result = await getFavourite(
      accessToken.value,
      pageNumber,
      pageSize,
      true
    );
    toggleLoading(false);
    if (result.isSuccess) {
      const newFavRestaurants = result.data;
      if (newFavRestaurants.length) {
        if (favoriteRestaurants.value.length) {
          newFavRestaurants.forEach((restaurant) => {
            const isFound = favouriteRestaurantIds.value.indexOf(restaurant.id);
            if (isFound === -1) {
              favoriteRestaurants.value.push(restaurant);
            }
          });
        } else {
          favoriteRestaurants.value = newFavRestaurants;
        }
      } else {
        favoriteRestaurants.value = [];
      }

      const nextPage = result?.meta?.link?.next;
      if (typeof nextPage === "string" && nextPage.length) {
        anyNextPage.value = true;
      } else {
        anyNextPage.value = false;
      }
      return {
        isSuccess: true,
        data: null,
        message: "",
      };
    } else {
      return {
        isSuccess: false,
        message: result.message,
      };
    }
  } catch (err) {
    return {
      isSuccess: false,
      message: "Invalid access token",
    };
  }
}

async function toggleFavouriteRestaurant(restaurantId) {
  if (!restaurantId) {
    return false;
  }
  if (isUserSignedIn.value === false) {
    Vue.prototype.$modal.show("login-modal");
    return false;
  } else {
    try {
      const isFavourite = () => {
        return favouriteRestaurantIds.value.includes(restaurantId);
      };
      if (isFavourite()) {
        const indexToRemove =
          favouriteRestaurantIds.value.indexOf(restaurantId);
        if (indexToRemove === 0) {
          favoriteRestaurants.value.shift();
        } else if (indexToRemove >= 1) {
          favoriteRestaurants.value.splice(indexToRemove, 1);
        }
      }
      const toggleResponse = await togggleFavRestaurant(
        accessToken.value,
        restaurantId
      );
      if (toggleResponse.isSuccess) {
        alert.success(toggleResponse.message);
        return true;
      } else {
        alert.error(toggleResponse.message);
        return false;
      }
    } catch (err) {
      if (err) {
        alert.error(err);
        return false;
      }
    }
  }
}

function checkIsFavouriteRestaurant(restaurantId) {
  if (!restaurantId) {
    throw new Error(
      "Failed checking checkIsFavouriteRestaurant, 'restaurantId' is missing"
    );
  }
  if (isArray(favouriteRestaurantIds.value)) {
    return favouriteRestaurantIds.value.includes(restaurantId);
  }
  return false;
}

const state = {
  isLoading,
  isLoadingLoadMore,
  anyNextPage,
  favoriteRestaurants,
  favouriteRestaurantIds,
  pageNumber,
};

const methods = {
  getFavoriteRestaurants,
  toggleFavouriteRestaurant,
  checkIsFavouriteRestaurant,
  loadMoreFavouriteRestaurant,
};

export { state, methods };
