<template>
  <div
    class="w-full px-4 pt-2 pb-8 text-xs text-gray-700 lg:text-sm lg:px-2 lg:w-11/12 lg:mx-auto lg:mt-4"
  >
    <div class="relative mt-5 mb-3 leading-normal">
      <div class="description" :class="containerClass" v-html="about"></div>
      <div
        v-if="isMobile && containerClass"
        class="mt-3 text-center button-expand-wrap"
      >
        <button
          id="mobile-read-more-restaurant-description-button"
          class="px-8 py-1 text-sm font-black capitalize bg-white border lg:py-2 text-red-dark border-red-dark button-expand lg:text-base lg:px-4 br3"
          style="border-radius: 11px"
          @click="isExpanded = !isExpanded"
        >
          {{ isExpanded ? `${$t("showLess")}` : `${$t("showMore")}` }}
        </button>
      </div>
    </div>
    <div class="flex items-center py-1 lg:py-3">
      <!-- direction -->
      <div class="mr-3 whitespace-nowrap">
        <a
          target="_blank"
          :href="direction"
          class="p-2 border border-gray-500 rounded-full gray"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="inline icon-geo-alt-fill"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
            />
          </svg>
          {{ $t("getDirection") }}
        </a>
      </div>
      <div>
        <!-- address -->
        <div class="mt-3 lg:mt-0">{{ address }}</div>
        <!-- parking & corkage charge -->
        <div v-if="isDesktop" class="flex mt-2">
          <div>{{ $t("parking") }}</div>
          <div class="mx-8 font-black">{{ parking }}</div>
          <div class="ml-6">{{ $t("corkageCharge") }}</div>
          <div class="mx-8 font-black">{{ corkageCharge }}</div>
        </div>
      </div>
    </div>
    <div v-if="isMobile" class="flex mt-2">
      <div>{{ $t("parking") }}</div>
      <div class="mx-8 font-black">{{ parking }}</div>
      <div class="ml-12">{{ $t("corkageCharge") }}</div>
      <div class="mx-8 font-black">{{ corkageCharge }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    about: {
      type: String,
    },
    direction: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    corkageCharge: {
      type: String,
      required: true,
    },
    parking: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isExpanded: false,
      youtubePlayed: false,
      containerClass: "",
    };
  },
  computed: {
    ...mapState("restaurant", [
      "restaurantId",
      "restaurantName",
      "restaurantCanonicalLink",
    ]),
  },
  watch: {
    isExpanded(val) {
      if (val) {
        this.containerClass += " open";
      } else {
        this.containerClass = this.containerClass.replace("open", "");
      }
    },
  },
  mounted() {
    this.calculateContainerHeight();
  },
  methods: {
    calculateContainerHeight() {
      if (this.isMobile) {
        const element = document.getElementsByClassName("description");
        let classStyle = "";
        if (element && element.length) {
          const elementHeight = element[0].getBoundingClientRect().height;
          if (elementHeight > 400) {
            classStyle += "limit-height";
          }
        }
        this.containerClass = classStyle;
      }
      return "";
    },
  },
};
</script>

<style lang="scss" scoped>
#youtube-player {
  height: 195px;

  @screen xl {
    height: 280px;
    width: 450px;
  }
}

@media (max-width: 767.98px) {
  .description {
    transition: max-height 0.5s linear;

    &.open {
      max-height: 20000px !important;
    }

    &.limit-height {
      max-height: 400px;
      overflow: hidden;
    }
  }
}
</style>
<i18n>
{
  "en": {
    "getDirection": "Get direction",
    "parking": "Parking",
    "corkageCharge": "Corkage charge"
  },
  "th": {
    "getDirection": "ดูวิธีเดินทางไปร้าน",
    "parking": "ที่จอดรถ",
    "corkageCharge": "ค่าเปิดขวด"
  }
}
</i18n>
