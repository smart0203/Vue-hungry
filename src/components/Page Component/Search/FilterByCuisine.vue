<template>
  <div>
    <div v-if="cuisines && !isLoading" class="flex flex-col items-start">
      <div
        v-if="chunkedCuisines.length"
        class="flex justify-around w-full lg:justify-start"
      >
        <div
          v-for="(chunk, index) in chunkedCuisines"
          :key="index"
          class="flex flex-col w-full lg:mr-10 lg:w-1/4"
          :class="index === 0 ? 'mr-2' : null"
        >
          <div
            v-for="cuisine in chunk"
            :key="cuisine.id"
            class="flex items-center mb-3 text-sm"
          >
            <template v-if="isDesktop">
              <input
                v-model="cuisine.selected"
                type="checkbox"
                class="red-checkbox"
              />
              <span
                class="ml-2"
                :class="cuisine.selected ? 'text-red-dark font-bold' : null"
                >{{ cuisine.name }}</span
              >
            </template>
            <button
              v-else
              class="w-full h-10 border-2 rounded-lg"
              :class="
                cuisine.selected
                  ? 'text-red-dark font-bold border-red-dark'
                  : null
              "
              @click="cuisine.selected = !cuisine.selected"
            >
              {{ cuisine.name }}
            </button>
          </div>
        </div>
      </div>
      <div v-else class="w-full text-center">
        {{ $t("noResultFound") }}
      </div>
    </div>
    <div v-else class="flex items-center justify-center mt-40 lg:my-10">
      <div class="loader"></div>
      <div class="ml-2 font-black capitalize">
        {{ $t("pleaseWait") }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import { generateFilterItemChunk } from "./filterItem";

export default {
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
    ...mapFields("search", ["cuisines", "selectedCuisines", "filterCategory"]),
    filteredCuisines() {
      return this.cuisines.filter((cuisine) => {
        return cuisine.name.toLowerCase().includes(this.filterCategory);
      });
    },
    chunkedCuisines() {
      const { getChunkResult } = generateFilterItemChunk(this.filteredCuisines);
      return getChunkResult();
    },
  },
  async mounted() {
    await this.getCuisineList();
    this.compareSelectedCuisine();
  },
  destroyed() {
    this.onDestroy();
  },
  methods: {
    async getCuisineList() {
      if (this.cuisines.length === 0) {
        this.isLoading = true;
        const result = await this.$store.dispatch("search/getCuisines");
        if (result.isSuccess) {
          this.isLoading = false;
        } else {
          this.$alert.error(result.message);
        }
      }
    },
    compareSelectedCuisine() {
      this.cuisines.forEach((cuisine) => {
        if (this.selectedCuisines.includes(cuisine.id)) {
          cuisine.selected = true;
        } else {
          cuisine.selected = false;
        }
      });
    },
    onDestroy() {
      this.cuisines.forEach((cuisine) => (cuisine.selected = false));
    },
  },
};
</script>
