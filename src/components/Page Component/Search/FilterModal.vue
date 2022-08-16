<template>
  <modal name="filter-modal" height="auto" scrollable adaptive>
    <div class="flex flex-col px-2 mt-4" style="min-height: 100vh">
      <div class="flex items-center justify-between">
        <p class="ml-4 font-black capitalize">{{ $t("filter") }}</p>
        <img
          class="flex-shrink-0 cursor-pointer"
          src="@/assets/icon-close-black.png"
          alt="close icon"
          loading="lazy"
          style="width: 15px; height: 15px"
          @click="$modal.hide('filter-modal')"
        />
      </div>

      <button
        :disabled="isLoading"
        class="px-1 py-2 mr-2 text-sm font-black text-right capitalize text-red-dark hover:underline disabled:opacity-50"
        @click="onResetFilter"
      >
        {{ $t("resetFilter") }}
      </button>

      <!-- filter bar -->
      <div class="flex mx-2 my-4">
        <button
          class="flex-auto px-2 py-2 mr-2 text-sm capitalize rounded-full"
          :class="filterByCuisineButtonClass"
          style="box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16)"
          @click="setActiveTab('cuisine')"
        >
          {{ generateButtonText("cuisines") }}
        </button>
        <button
          class="flex-auto px-2 py-2 mr-2 text-sm capitalize rounded-full"
          :class="filterByPriceRangeButtonClass"
          style="box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16)"
          @click="setActiveTab('price')"
        >
          {{ $t("price") }}
        </button>
        <!-- <button
          v-if="false"
          class="flex-auto px-2 py-2 mr-2 text-sm capitalize bg-white rounded-full"
          style="box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16)"
          :class="filterByPromotionButtonClass"
          @click="setActiveTab('promotion')"
        >
          {{ $t("promotion") }}
        </button> -->
        <button
          class="flex-auto px-2 py-2 mr-2 text-sm capitalize rounded-full"
          style="box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16)"
          :class="filterByPackageTypeButtonClass"
          @click="setActiveTab('packageType')"
        >
          {{ generateButtonText("packageType") }}
        </button>
        <button
          class="flex-auto px-2 py-2 mr-2 text-sm capitalize rounded-full"
          style="box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16)"
          :class="filterByLocationButtonClass"
          @click="setActiveTab('location')"
        >
          {{ generateButtonText("location") }}
        </button>
        <!-- <button
          v-if="false"
          class="flex-auto px-2 py-2 mr-2 text-sm capitalize bg-white rounded-full"
          style="box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16)"
          :class="
            activeFilterTab === 'date'
              ? 'bg-red-dark text-white'
              : ' bg-white text-black'
          "
          @click="setActiveTab('date')"
        >
          More
        </button> -->
      </div>
      <!-- current title -->
      <div class="flex justify-between mx-4 mt-2 capitalize">
        <span class="text-base font-black"> {{ activeFilterTabTitle }}</span>
        <button
          class="text-sm font-black capitalize text-red-dark disabled:opacity-50"
          :disabled="isLoading"
          @click="$emit('on-filter-cleard')"
        >
          {{ $t("clear") }}
        </button>
      </div>
      <!-- search form -->
      <form
        v-if="isShowFilterCategory"
        class="relative flex items-center mx-4 my-4 border border-t-2 rounded-full"
        @submit.prevent="applyFilterCategory;"
      >
        <div class="flex-shrink-0 h-full ml-2">
          <svg
            class="icon-search"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7.41173 0C3.31835 0 0 3.31835 0 7.41173C0 11.5051 3.31835 14.8235 7.41173 14.8235C9.07655 14.8235 10.6132 14.2746 11.8505 13.3479L16.1925 17.6899C16.606 18.1034 17.2764 18.1034 17.6899 17.6899C18.1034 17.2764 18.1034 16.606 17.6899 16.1925L13.3479 11.8505C14.2746 10.6132 14.8235 9.07655 14.8235 7.41173C14.8235 3.31835 11.5051 0 7.41173 0ZM2.11764 7.41173C2.11764 4.48788 4.48788 2.11764 7.41173 2.11764C10.3356 2.11764 12.7058 4.48788 12.7058 7.41173C12.7058 10.3356 10.3356 12.7058 7.41173 12.7058C4.48788 12.7058 2.11764 10.3356 2.11764 7.41173Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <input
          v-model.trim="tempFilterCategory"
          type="text"
          :placeholder="$t('findCategory')"
          name="search-category"
          class="w-full px-2 py-2 truncate rounded-full"
          autocomplete="off"
          @input="applyFilterCategory"
        />
      </form>
      <div class="relative flex justify-center w-full lg:w-auto lg:flex-grow">
        <transition>
          <div
            v-if="activeFilterTab === 'cuisine'"
            key="cuisine"
            class="w-full"
          >
            <FilterByCuisine class="flex-grow mx-4" />
            <div class="w-full h-64"></div>
          </div>
          <!-- <FilterByPromotion
            v-if="false"
            key="promotion"
            class="flex-grow mx-4 mb-10"
          /> -->
          <FilterByPackageType
            v-else-if="activeFilterTab === 'packageType'"
            key="packageType"
            class="flex-grow mx-4 mb-10"
          />
          <FilterByPrice
            v-else-if="activeFilterTab === 'price'"
            key="price"
            :start-price="startPrice"
            :end-price="endPrice"
            @on-value-change="setPrice"
          />
          <div
            v-else-if="activeFilterTab === 'location'"
            key="location"
            class="w-full"
          >
            <FilterByLocation class="flex-grow mx-4" />
            <div class="w-full h-64"></div>
          </div>
          <FilterByDate v-else-if="activeFilterTab === 'date'" key="date" />
        </transition>

        <div
          class="fixed bottom-0 z-10 flex items-center w-full px-4 bg-white border"
        >
          <button
            class="w-full h-10 py-1 mx-auto my-4 text-sm font-black text-white capitalize rounded-full bg-red-dark disabled:opacity-50"
            :disabled="isLoading"
            @click="applyFilter"
          >
            {{ isLoading ? $t("pleaseWait") : $t("applyFilter") }}
          </button>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import { mapGetters } from "vuex";
import debounce from "lodash-es/debounce";
import useLazyImport from "@/composable/useLazyImport";

export default {
  components: {
    FilterByCuisine: () =>
      useLazyImport(() =>
        import(/* webpackChunkName: "SearchFilterChunk" */ "./FilterByCuisine")
      ),
    FilterByPromotion: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "SearchFilterChunk" */ "./FilterByPromotion"
        )
      ),
    FilterByPrice: () =>
      useLazyImport(() =>
        import(/* webpackChunkName: "SearchFilterChunk" */ "./FilterByPrice")
      ),
    FilterByLocation: () =>
      useLazyImport(() =>
        import(/* webpackChunkName: "SearchFilterChunk" */ "./FilterByLocation")
      ),
    FilterByDate: () =>
      useLazyImport(() =>
        import(/* webpackChunkName: "SearchFilterChunk" */ "./FilterByDate")
      ),
    FilterByPackageType: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "SearchFilterChunk" */ "./FilterByPackageType"
        )
      ),
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      startPriceTemp: 0,
      endPriceTemp: 0,
      tempFilterCategory: "",
    };
  },
  computed: {
    ...mapGetters("search", [
      "activeFilterTabTitle",
      "selectedAvailableCuisines",
      "selectedAvailableLocations",
      "selectedAvailablePackageType",
    ]),
    ...mapFields("search", [
      "selectedCuisines",
      "selectedPromotions",
      "selectedLocations",
      "selectedPackageType",
      "activeFilterTab",
      "startPrice",
      "endPrice",
      "cuisines",
      "isFilterByPrice",
      "filterCategory",
    ]),
    isShowFilterCategory() {
      return (
        this.activeFilterTab !== "date" && this.activeFilterTab !== "price"
      );
    },
    filterByCuisineButtonClass() {
      if (this.activeFilterTab === "cuisine") {
        return "bg-red-dark text-white";
      } else if (this.selectedCuisines.length > 0) {
        return "bg-red-pink text-black";
      }
      return "";
    },
    filterByLocationButtonClass() {
      if (this.activeFilterTab === "location") {
        return "bg-red-dark text-white";
      } else if (this.selectedLocations.length > 0) {
        return "bg-red-pink text-black";
      }
      return "";
    },
    filterByPackageTypeButtonClass() {
      if (this.activeFilterTab === "packageType") {
        return "bg-red-dark text-white";
      } else if (this.selectedPackageType.length > 0) {
        return "bg-red-pink text-black";
      }
      return "";
    },
    filterByPriceRangeButtonClass() {
      if (this.activeFilterTab === "price") {
        return "bg-red-dark text-white";
      } else if (this.isFilterByPrice) {
        return "bg-red-pink text-black";
      }
      return "";
    },
    filterByPromotionButtonClass() {
      if (this.activeFilterTab === "promotion") {
        return "bg-red-dark text-white";
      } else if (this.selectedPromotions.length > 0) {
        return "bg-red-pink text-black";
      }
      return "";
    },
  },
  methods: {
    generateButtonText(param) {
      let count;
      if (param === "cuisines") {
        count =
          this.selectedCuisines.length || this.selectedAvailableCuisines.length;
        return count
          ? `${this.$t("cuisines")} (${count})`
          : this.$t("cuisines");
      }
      if (param === "location") {
        count =
          this.selectedLocations.length ||
          this.selectedAvailableLocations.length;
        return count
          ? `${this.$t("location")} (${count}) `
          : this.$t("location");
      }
      if (param === "packageType") {
        count =
          this.selectedPackageType.length ||
          this.selectedAvailablePackageType.length;
        return count
          ? `${this.$t("packageType")} (${count})`
          : this.$t("packageType");
      }
    },
    setActiveTab(type) {
      this.activeFilterTab = type;
    },
    applyFilter() {
      if (this.activeFilterTab === "price") {
        this.isFilterByPrice = true;
        this.priceFilterCallback();
      }
      this.$emit("on-filter-applied");
    },
    priceFilterCallback() {
      this.startPrice = this.startPriceTemp;
      this.endPrice = this.endPriceTemp;
    },
    setPrice({ startPrice, endPrice }) {
      this.startPriceTemp = startPrice;
      this.endPriceTemp = endPrice;
    },
    onResetFilter() {
      this.$emit("on-reset-filter");
    },
    applyFilterCategory: debounce(function () {
      this.filterCategory = this.tempFilterCategory.toLowerCase();
    }, 300),
  },
  i18n: {
    messages: {
      en: {
        findCategory: "Find category",
      },
      th: {
        findCategory: "Find category",
      },
    },
  },
};
</script>
