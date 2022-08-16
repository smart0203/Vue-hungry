<template>
  <div>
    <div
      v-if="promotions && promotions.length && !isLoading"
      class="flex flex-col"
    >
      <div class="flex flex-wrap">
        <div v-for="promotion in promotions" :key="promotion.id" class="w-1/2">
          <HHAcceptTerm
            v-model="promotion.selected"
            class="mb-3 text-sm"
            :label="promotion.name"
          />
        </div>
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
import HHAcceptTerm from "@/components/Shared/HHAcceptTerm";
import { mapFields } from "vuex-map-fields";
export default {
  components: {
    HHAcceptTerm,
  },
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
    ...mapFields("search", ["promotions", "selectedPromotions"]),
  },
  async mounted() {
    await this.getPromotions();
    this.compareSelectedPromotions();
  },
  methods: {
    async getPromotions() {
      if (this.promotions.length === 0) {
        this.isLoading = true;
        const result = await this.$store.dispatch("search/getPromotions");
        if (result.isSuccess) {
          this.isLoading = false;
        } else {
          this.$alert.error(result.message);
        }
      }
    },
    compareSelectedPromotions() {
      this.promotions.forEach((promotion) => {
        if (this.selectedPromotions.includes(promotion.id)) {
          promotion.selected = true;
        } else {
          promotion.selected = false;
        }
      });
    },
  },
};
</script>
