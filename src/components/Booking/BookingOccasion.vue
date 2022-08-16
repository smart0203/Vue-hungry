<template>
  <div>
    <div class="text-center">
      <button
        id="occasion-selection-button"
        class="text-sm"
        :class="isOccasionShow ? ' text-black' : 'text-red-dark'"
        @click="isOccasionShow = true"
      >
        <svg
          v-if="isOccasionShow == false"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="inline icon-plus"
          viewBox="0 0 16 16"
        >
          <path
            d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
          />
        </svg>
        {{ $t("whatsOcasion") }}
      </button>
    </div>
    <template v-if="isOccasionShow">
      <div class="flex justify-center py-2 mx-auto my-2 occasion-shadow">
        <select v-model="occasion" class="mb-1 text-sm capitalize">
          <option value="" selected>{{ $t("selectOcasion") }}</option>
          <option
            v-for="occasion in occasionList"
            :key="occasion.id"
            class=""
            :value="occasion.id"
          >
            {{ occasion.attributes.name }}
          </option>
        </select>
      </div>
    </template>
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";
export default {
  data() {
    return {
      isOccasionShow: false,
    };
  },
  computed: {
    ...mapFields("booking", ["occasion"]),
    occasionList() {
      return this.$store.getters["booking/getState"]("occasionList");
    },
    selectedOccasion() {
      return this.$store.getters["booking/getState"]("occasion");
    },
  },
  mounted() {
    this.fetchSpecialOccasionList();
  },
  methods: {
    selectOccassion(occasionId) {
      // set value if the value of occassion id is different
      if (occasionId !== this.selectedOccasion) {
        this.$store.commit("booking/setState", {
          state: "occasion",
          val: occasionId,
        });
      }
      // if same then unselect current occassion
      else {
        this.$store.commit("booking/setState", {
          state: "occasion",
          val: "",
        });
      }
    },
    fetchSpecialOccasionList() {
      if (
        this.$store.getters["bookingPackage/getSelectedPackageType"] !== "hah"
      ) {
        this.$store.dispatch("booking/fetchSpecialOccasionList");
      }
    },
  },
};
</script>
<style scoped>
.occasion-shadow {
  box-shadow: -1px 2px 25px rgba(0, 0, 0, 0.16);
}

.occasion-list {
  height: 70px;
  overflow-y: scroll;
}

.occasion-list::-webkit-scrollbar {
  width: 10px;
}

.occasion-list {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #fff;
}

.occasion-list::-webkit-scrollbar-track {
  background: #fff;
}

.occasion-list::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 6px;
  border: 3px solid #fff;
}
</style>
<i18n>
{
  "en": {
    "selectOcasion": "Select occasion",
    "whatsOcasion": "What's the Occasion (Optional)"
  },
  "th": {
    "selectOcasion": "เลือกโอกาส",
    "whatsOcasion": "เนื่องในโอกาสพิเศษ (ไม่บังคับ)"
  }
}
</i18n>
