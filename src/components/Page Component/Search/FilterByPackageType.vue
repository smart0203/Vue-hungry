<template>
  <div>
    <div class="flex flex-col">
      <div v-if="!isLoading" class="">
        <div v-if="showedPackageType.length" class="flex flex-wrap">
          <div
            v-for="(packages, index) in showedPackageType"
            :key="packages.packageTypeCode"
            class="w-1/2 mb-3 text-sm"
            :class="index % 2 === 0 ? 'pr-2' : null"
          >
            <template v-if="isDesktop">
              <input
                v-model="packages.selected"
                type="checkbox"
                class="red-checkbox"
              />
              <span
                class="ml-2"
                :class="packages.selected ? 'text-red-dark font-bold' : null"
                >{{ packages.title }}</span
              >
            </template>
            <button
              v-else
              class="w-full h-10 border-2 rounded-lg"
              :class="
                packages.selected
                  ? 'text-red-dark font-bold border-red-dark'
                  : null
              "
              @click="packages.selected = !packages.selected"
            >
              {{ packages.title }}
            </button>
          </div>
        </div>

        <div v-else class="w-full text-center">
          {{ $t("noResultFound") }}
        </div>
      </div>
      <div v-else class="flex items-center justify-center mt-2">
        <div class="mr-1 loader small"></div>
        <div class="text-red-dark">{{ $t("loading") }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      isLoading: true,
    };
  },
  computed: {
    ...mapState("search", [
      "selectedPackageType",
      "availablePackageType",
      "filterCategory",
    ]),
    showedPackageType() {
      return this.availablePackageType.filter((packageType) => {
        return packageType.title.toLowerCase().includes(this.filterCategory);
      });
    },
  },
  created() {
    this.onCreated();
  },

  destroyed() {
    this.onDestroy();
  },
  methods: {
    async onCreated() {
      this.isLoading = true;
      if (this.availablePackageType.length === 0) {
        await this.$store.dispatch("search/getPackageType");
      }
      this.compareSelectedPackageType();
      this.isLoading = false;
    },
    compareSelectedPackageType() {
      this.availablePackageType.forEach((packages) => {
        if (this.selectedPackageType.includes(packages.packageTypeCode)) {
          packages.selected = true;
        } else {
          packages.selected = false;
        }
      });
    },
    onDestroy() {
      this.availablePackageType.forEach(
        (packageType) => (packageType.selected = false)
      );
    },
  },
};
</script>
