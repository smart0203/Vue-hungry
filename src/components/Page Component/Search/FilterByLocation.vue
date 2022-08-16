<template>
  <div>
    <div
      v-if="locations && locations.length && !isLoading"
      class="flex flex-col items-start"
    >
      <div
        v-if="chunkedLocations.length"
        class="flex justify-start w-full lg:justify-start"
      >
        <div
          v-for="(chunk, index) in chunkedLocations"
          :key="index"
          class="flex flex-col w-full lg:mr-10 lg:w-1/4"
          :class="index === 0 ? 'mr-2' : null"
        >
          <div
            v-for="location in chunk"
            :key="location.id"
            class="flex items-center mb-3 text-sm"
          >
            <template v-if="isDesktop">
              <input
                v-model="location.selected"
                type="checkbox"
                class="red-checkbox"
              />
              <span
                class="ml-2"
                :class="location.selected ? 'text-red-dark font-bold' : null"
                >{{ location.name }}</span
              >
            </template>
            <button
              v-else
              class="w-full h-10 border-2 rounded-lg"
              :class="
                location.selected
                  ? 'text-red-dark font-bold border-red-dark'
                  : null
              "
              @click="location.selected = !location.selected"
            >
              {{ location.name }}
            </button>
          </div>
        </div>
      </div>

      <div v-else class="w-full mt-4 text-center">
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
    ...mapFields("search", [
      "locations",
      "selectedLocations",
      "filterCategory",
    ]),
    filteredLocations() {
      return this.locations.filter((location) => {
        return location.name.toLowerCase().includes(this.filterCategory);
      });
    },
    chunkedLocations() {
      const { getChunkResult } = generateFilterItemChunk(
        this.filteredLocations
      );
      return getChunkResult();
    },
  },
  async mounted() {
    await this.getLocations();
    this.compareSelectedLocation();
  },
  destroyed() {
    this.onDestroy();
  },
  methods: {
    async getLocations() {
      if (this.locations.length === 0) {
        this.isLoading = true;
        const result = await this.$store.dispatch("search/getLocations");
        if (result.isSuccess) {
          this.isLoading = false;
        } else {
          this.$alert.error(result.message);
        }
      }
    },
    compareSelectedLocation() {
      this.locations.forEach((location) => {
        if (this.selectedLocations.includes(location.id)) {
          location.selected = true;
        } else {
          location.selected = false;
        }
      });
    },
    onDestroy() {
      this.locations.forEach((location) => (location.selected = false));
    },
  },
};
</script>
