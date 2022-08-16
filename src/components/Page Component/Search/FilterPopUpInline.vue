<template>
  <div
    class="absolute z-10 w-auto py-8 transition-all bg-white rounded-lg"
    style="top: 150%; box-shadow: -1px 2px 25px rgba(0, 0, 0, 0.16)"
  >
    <img
      class="absolute flex-shrink-0 cursor-pointer"
      src="@/assets/icon-close-black.png"
      alt="close icon"
      style="width: 15px; height: 15px; top: 10px; left: 10px"
      loading="lazy"
      @click="
        activeFilterTab !== 'date'
          ? $emit('on-close-clicked')
          : $emit('on-filter-applied')
      "
    />
    <!-- current title -->
    <div
      class="flex justify-between pb-2 mx-8 capitalize"
      :class="isShowFilterCategory ? 'border-b' : null"
    >
      <span class="flex-1 text-base font-black">
        {{ activeFilterTabTitle }}</span
      >
      <div class="flex">
        <button
          class="text-sm font-black capitalize cursor-pointer text-red-dark hover:underline disabled:opacity-50"
          :disabled="isLoading"
          @click="$emit('on-filter-cleard')"
        >
          {{ $t("clear") }}
        </button>
        <!-- apply filter button -->
        <button
          v-if="isShowApplyFilter"
          class="px-4 py-1 ml-3 text-sm font-black text-white capitalize rounded-full bg-red-dark disabled:opacity-50"
          :disabled="isLoading"
          @click="filterApplied"
        >
          {{ isLoading ? $t("pleaseWait") : $t("applyFilter") }}
        </button>
      </div>
    </div>
    <!-- search form -->
    <form
      v-if="isShowFilterCategory"
      class="relative flex items-center mx-8 my-4 border border-t-2 rounded-full"
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
    <div class="mx-8">
      <transition>
        <FilterByCuisine
          v-if="activeFilterTab === 'cuisine'"
          key="cuisine"
          class="flex-grow"
        />
        <FilterByPackageType
          v-else-if="activeFilterTab === 'packageType'"
          key="packageType"
          class="flex-grow mt-2"
        />
        <FilterByPromotion
          v-else-if="false"
          key="promotion"
          class="flex-grow"
        />
        <FilterByPrice
          v-else-if="activeFilterTab === 'price'"
          key="price"
          :start-price="startPrice"
          :end-price="endPrice"
          @on-value-change="setPrice"
        />
        <FilterByLocation
          v-else-if="activeFilterTab === 'location'"
          key="location"
          style="height: 500px; overflow-y: scroll; overflow-x: hidden"
        />
        <FilterByDate
          v-else-if="activeFilterTab === 'date'"
          key="date"
          class="flex-grow"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import debounce from "lodash-es/debounce";
import { mapFields } from "vuex-map-fields";
import { mapGetters } from "vuex";
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
      tempStartPrice: 0,
      tempEndPrice: 20000,
      tempFilterCategory: "",
    };
  },
  computed: {
    ...mapFields("search", [
      "activeFilterTab",
      "startPrice",
      "endPrice",
      "isFilterByPrice",
      "filterCategory",
    ]),
    ...mapGetters("search", ["activeFilterTabTitle"]),
    isShowApplyFilter() {
      return this.activeFilterTab !== "date";
    },
    isShowFilterCategory() {
      return (
        this.activeFilterTab !== "date" && this.activeFilterTab !== "price"
      );
    },
  },
  watch: {
    activeFilterTab() {
      this.tempFilterCategory = "";
      this.filterCategory = "";
    },
  },
  destroyed() {
    this.filterCategory = "";
  },
  methods: {
    setPrice({ startPrice, endPrice }) {
      this.tempStartPrice = startPrice;
      this.tempEndPrice = endPrice;
    },
    filterApplied() {
      if (this.activeFilterTab === "price") {
        this.startPrice = this.tempStartPrice;
        this.endPrice = this.tempEndPrice;
        this.isFilterByPrice = true;
      }
      this.$emit("on-filter-applied");
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
