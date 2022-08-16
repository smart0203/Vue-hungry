<template>
  <div>
    <div class="font-black text-center banner-bg" :style="img">
      <div
        class="flex flex-col items-center justify-center h-full pt-10 pb-10 text-white bg-overlay"
      >
        <h1 class="mx-5 title">
          {{ title }}
        </h1>
        <h3 class="my-2 sub-title">
          {{ $t("subTitle", { totalCover: totalCover }) }}
        </h3>
        <RestaurantSearchSuggestion
          class="w-11/12"
          :style="isDesktop ? 'width: 650px' : null"
        >
          <template #default="{ handler, meta }">
            <form
              id="search-input"
              class="mx-auto"
              action=""
              @submit.prevent="submitSearchForm"
            >
              <div class="flex justify-center">
                <div
                  class="flex flex-grow text-black bg-white rounded-full search-form"
                >
                  <div
                    v-if="!isConfigLoading && showCityOption"
                    class="custom-dropdown"
                  >
                    <select
                      class="h-full mr-4 text-sm rounded-full lg:text-base"
                      :value="selectedCityId"
                      @change="
                        selectCity($event);
                        handler.submitHandler();
                      "
                    >
                      <option
                        v-for="cities in availableCities"
                        :key="cities.id"
                        :value="cities.id"
                        class="capitalize"
                      >
                        {{ cities.name }}
                      </option>
                    </select>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      fill="currentColor"
                      class="absolute right-0 inline icon-chevron-down text-red-dark"
                      style="top: 30%"
                      viewBox="0 0 16 16"
                      stroke="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        stroke-width="2"
                        d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                      />
                    </svg>
                  </div>
                  <div
                    v-if="showCityOption"
                    class="my-auto mr-2 searchbox-separator h-half"
                  ></div>
                  <div v-if="isDesktop" class="flex items-center ml-2">
                    <div>
                      <img
                        src="@/assets/icon-search-red.png"
                        width="24"
                        loading="lazy"
                        height="24"
                        alt="search icon"
                      />
                    </div>
                  </div>
                  <input
                    id="homepage-banner-search"
                    v-model="query"
                    type="search"
                    autocomplete="off"
                    :placeholder="$t('searchRestaurantPlaceHolder')"
                    class="flex-grow px-2 text-sm truncate rounded-full md:flex-grow md:text-base"
                    @input="handler.inputHandler"
                    @focus="handler.focusHandler"
                  />
                  <button
                    class="flex font-black text-white capitalize rounded-full lg:py-2 lg:px-6"
                    type="button"
                    :class="meta.isLoading ? 'bg-red-light' : 'bg-red-dark'"
                    :disabled="meta.isLoading === true"
                    @click="handler.submitHandler"
                  >
                    <template v-if="isDesktop">
                      {{ $t("findARestaurant") }}
                    </template>
                    <template v-else>
                      <img
                        class="inline"
                        loading="lazy"
                        src="@/assets/icon-search-red-circle.png"
                        :width="isDesktop ? 18 : 28"
                        height="100%"
                        alt="search icon"
                      />
                    </template>
                  </button>
                </div>
              </div>
            </form>
          </template>
        </RestaurantSearchSuggestion>
      </div>
    </div>
  </div>
</template>

<script>
import RestaurantSearchSuggestion from "@/components/Shared/RestaurantSearchSuggestion";
import {
  selectedCityId,
  availableCities,
  isLoading as isConfigLoading,
} from "@/composable/selectCity";

export default {
  components: {
    RestaurantSearchSuggestion,
  },
  props: {
    img: {
      type: String,
      required: true,
    },
    totalCover: {
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    lang: {
      type: String,
      default() {
        return "th";
      },
    },
    showCityOption: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    return {
      isConfigLoading,
      selectedCityId,
      availableCities,
    };
  },
  data() {
    return {
      query: "",
    };
  },
  methods: {
    selectCity(event) {
      this.selectedCityId = event.target.value;
    },
    submitSearchForm() {
      if (this.query.length > 0) {
        window.location = `/restaurants/search?name_like=${this.query}&locale=${this.lang}`;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.bg-overlay {
  background-color: rgba(0, 0, 0, 0.5);
}

.banner-bg {
  background: #342828;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  height: 230px;

  @screen lg {
    height: 350px;
  }
}

.title {
  @screen md {
    font-size: 30px;
  }
  @screen lg {
    font-size: 40px;
  }
}

.sub-title {
  font-size: 10px;
  @screen md {
    font-size: 15px;
  }
  @screen lg {
    font-size: 20px;
  }
}

.search-form {
  @screen lg {
    width: 630px;
  }
  @screen md {
    width: 500px;
  }
}
</style>
<i18n>
{
  "en": {
    "subTitle": "More than {totalCover} diners seated, book your table today!"
  },
  "th": {
    "subTitle": "มียอดจองไปแล้วกว่า {totalCover} ที่นั่ง จองโต๊ะของคุณวันนี้!"
  }
}
</i18n>
