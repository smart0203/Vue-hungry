<template>
  <PromotionView
    :key="viewId"
    :is-loading="isLoading"
    :promos="promos"
    @on-promotion-clicked="trackPromotionClicked"
  />
</template>

<script>
import {
  promotionBanners as promos,
  isLoading,
  fetchBanners,
} from "@/composable/banners";
import PromotionView from "./PromotionView";
import debounce from "lodash-es/debounce";
import { selectedCityId } from "@/composable/selectCity";
import { nanoid } from "nanoid";

export default {
  name: "PromotionSection",
  components: {
    PromotionView,
  },
  props: {
    homeSectionOrder: {
      type: Number,
      required: true,
    },
  },
  setup() {
    return {
      selectedCityId,
      promos,
      isLoading,
    };
  },
  data() {
    return {
      viewId: nanoid(3),
    };
  },
  watch: {
    selectedCityId() {
      this.debounceOnCityChange();
    },
  },
  created() {
    this.initDummyPromos();
    this.debounceOnCityChange = debounce(this.onCityIdChange, 250);
  },
  methods: {
    initDummyPromos() {
      for (let index = 0; index < 10; index++) {
        this.promos.push(
          Object.freeze({
            id: index,
            val: "",
          })
        );
      }
    },
    trackPromotionClicked({ index, promo }) {
      const url = promo.targetUrl;
      const listingIndex = index + 1;

      this.$track(
        "HOME_SECTION_TAPPED",
        {
          homeSectionID: promo.id.toString(),
          homeSectionType: "banner",
          homeSectionName: "Promotions",
          homeSectionOrder: this.homeSectionOrder,
          homeSectionListingName: promo.name,
          homeSectionListingOrder: listingIndex,
          homeSectionURL: url,
        },
        true
      );
    },
    async onCityIdChange() {
      this.viewId = nanoid(3);
      this.isLoading = true;
      await fetchBanners();
    },
  },
};
</script>
