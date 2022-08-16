<template>
  <div>
    <slot
      name="input"
      :context="context"
      :actions="{
        selectItemFromList,
        shiftResultsSelection,
        unshiftResultsSelection,
      }"
      :events="{ inputHasReceivedFocus, inputHasChanged, inputHasLostFocus }"
    >
      <input
        v-model="context.input"
        type="search"
        class="vbga-input"
        @focus="inputHasReceivedFocus"
        @blur="inputHasLostFocus"
        @input="inputHasChanged"
        @keydown.enter.prevent="selectItemFromList"
        @keydown.down.prevent="shiftResultsSelection"
        @keydown.up.prevent="unshiftResultsSelection"
      />
    </slot>
    <ul
      v-if="hasResults"
      class="vbga-results"
      style="list-style: none; padding-left: 10px"
    >
      <li
        v-for="(result, index) in autocomplete.results"
        :key="result.id"
        :class="{ highlighted: index === autocomplete.resultsHighlight }"
        @click="resultHasBeenSelected(result)"
      >
        <slot
          v-if="index !== autocomplete.resultsHighlight"
          name="item"
          :place="result"
        >
          {{ result.description }}
        </slot>
        <slot v-else name="activeItem" :place="result">
          {{ result.description }}
        </slot>
      </li>
    </ul>
  </div>
</template>

<script>
import { getPlaceDetail } from "@/lib/googleMapPlaceParser";
export default {
  name: "GooglePlacesAutocomplete",
  props: {
    bounds: {
      type: Object,
      required: false,
      default: null,
    },
    mapFields: {
      type: Array,
      required: false,
      default: () => [],
    },
    value: {
      type: String,
      required: false,
      default: "",
    },
    place: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  data() {
    return {
      isInputFocus: false,
      autocomplete: {
        service: null,
        sessionToken: null,
        results: [],
        resultsHighlight: 0,
        status: null,
        selected: this.place,
      },
      context: {
        input: this.value,
        disableSearch: false,
      },
    };
  },
  computed: {
    hasResults() {
      return this.autocomplete.results.length > 0;
    },
    searchValue() {
      return this.context.input;
    },
    resultField() {
      return ["formatted_address", "geometry", ...this.mapFields];
    },
  },
  watch: {
    value: {
      handler(value) {
        if (!value) return;
        this.$set(this.context, "input", value);
      },
      immediate: true,
    },
    place: {
      handler(value) {
        if (!value) return;
        this.$set(this.autocomplete, "selected", value);
      },
      immediate: true,
    },
    searchValue(newValue, oldValue) {
      if (newValue || !oldValue) return;
      this.$emit("resultCleared");
    },
  },
  methods: {
    initGoogleAutoCompleteService() {
      this.$set(
        this.autocomplete,
        "sessionToken",
        new window.google.maps.places.AutocompleteSessionToken()
      );
      this.$set(
        this.autocomplete,
        "service",
        new window.google.maps.places.AutocompleteService()
      );
    },
    selectItemFromList() {
      const { results, resultsHighlight, selected } = this.autocomplete;
      const { input } = this.context;
      /**
       * Bail if there is nothing to work with
       */
      if (!input && !results.length) {
        return;
      }
      /**
       * Return the last result if things haven't changed
       */
      if (input === this.value && Object.keys(selected).length) {
        return this.returnLastSelection();
      }
      /**
       * Show the search results again
       */
      if (input && !results.length) {
        return this.inputHasChanged();
      }
      /**
       * The expected standard user journey. The user selected a result from the list.
       */
      // eslint-disable-next-line no-undef
      this.resultHasBeenSelected(results[resultsHighlight] || place);
    },
    shiftResultsSelection() {
      const { results, resultsHighlight } = this.autocomplete;
      let newIndex = Math.min(results.length, resultsHighlight) + 1;
      if (newIndex >= results.length) newIndex = 0;
      this.$set(this.autocomplete, "resultsHighlight", newIndex);
    },
    unshiftResultsSelection() {
      const { results, resultsHighlight } = this.autocomplete;
      let newIndex = Math.min(results.length, resultsHighlight) - 1;
      if (newIndex < 0) newIndex = results.length - 1;
      this.$set(this.autocomplete, "resultsHighlight", newIndex);
    },
    inputHasLostFocus() {
      this.isInputFocus = false;
    },
    inputHasReceivedFocus() {
      this.$emit("focused");
      this.isInputFocus = true;
      if (this.autocomplete.service) return;
      this.initGoogleAutoCompleteService();
    },
    inputHasChanged() {
      const { service, sessionToken } = this.autocomplete;
      const { input } = this.context;
      const { bounds } = this;
      this.$set(this.autocomplete, "resultsHighlight", 0);
      if (!input) {
        this.$set(this.autocomplete, "selected", {});
        this.$set(this.autocomplete, "results", []);
        return;
      }
      service.getPlacePredictions(
        {
          input,
          sessionToken,
          bounds,
          componentRestrictions: {
            country: "th",
          },
        },
        (predictions, status) => {
          this.$set(this.autocomplete, "status", status);
          if (status !== window.google.maps.places.PlacesServiceStatus.OK)
            return;
          this.$set(this.autocomplete, "results", predictions);
        }
      );
    },
    async resultHasBeenSelected({ place_id: placeId, description }) {
      try {
        const result = await getPlaceDetail(placeId);
        this.$set(this.autocomplete, "selected", result);
        this.$set(this.context, "input", description);
        this.$set(this.autocomplete, "results", []);
        this.$emit("resultChanged", result);
      } catch (err) {
        const message =
          err.message || "Oops, something went wrong, failed get place detail";
        this.$alert.error(message);
      }
    },
    returnLastSelection() {
      const { selected: place } = this.autocomplete;
      if (!place) return;
      this.$emit("resultChanged", place);
    },
  },
};
</script>
