<template>
  <div class="package-type-section">
    <div
      class="mt-2 text-sm font-black text-center capitalize lg:text-xl lg:mt-4"
      :class="
        isLoading
          ? 'bg-gray-300  h-3 lg:h-6 w-5/12 lg:w-1/12 lg:mx-auto mr-auto text-gray-300'
          : ''
      "
    >
      {{ !isLoading ? $t("packageTypeSectionTitle") : "" }}
    </div>
    <div
      class="mb-2 text-xs text-center capitalize lg:text-lg lg:mb-6 lg:block"
      :class="
        isLoading
          ? 'bg-gray-300  h-3 lg:h-6 w-7/12 lg:w-4/12 lg:mx-auto mr-auto text-gray-300 mt-2'
          : null
      "
    >
      {{ !isLoading ? $t("packageTypeSectionSubTitle") : "" }}
    </div>
    <div class="relative mt-4">
      <div ref="package-type-slider" class="swiper">
        <div
          class="w-full mb-8 swiper-wrapper"
          :class="isLoading ? 'justify-center' : null"
        >
          <div
            v-for="(type, index) in packageType"
            :key="type.id"
            class="swiper-slide"
            :class="isLoading ? 'is-loading' : null"
          >
            <a
              :href="buildLink(type.packageTypeCode)"
              class="brand-item"
              @click.prevent="goToLink(index, type)"
            >
              <div
                class="circle"
                :class="
                  isLoading ? ' bg-gray-400 rounded-full' : ' border-none'
                "
              >
                <div class="block">
                  <hh-image
                    v-if="!isLoading && type.coverImg"
                    :is-lazy="false"
                    :img="type.coverImg"
                    :desktop-width="400"
                    :desktop-height="400"
                    :mobile-height="400"
                    :mobile-width="400"
                    :width="200"
                    :height="200"
                  />
                </div>
              </div>
              <div
                class="flex flex-col items-center justify-center text-xs lg:text-sm"
              >
                <div
                  class="label"
                  :class="
                    isLoading
                      ? ' bg-gray-300 text-gray-300  w-20 h-4 mb-2'
                      : null
                  "
                >
                  {{ type.title }}
                </div>
              </div>
            </a>
          </div>
        </div>
        <div v-if="isShowPagination" class="swiper-pagination"></div>
      </div>
      <!-- Add Arrows -->
      <template v-if="isShowArrow">
        <div
          v-if="isReachEndSlide === false"
          ref="slider-next"
          class="home-slider-next slider-next text-red-dark"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="currentColor"
            class="inline icon-chevron-right"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </div>
        <div
          v-if="isReachBeginningSlide === false"
          ref="slider-prev"
          class="home-slider-prev slider-prev text-red-dark"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            class="inline icon-chevron-left"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
            />
          </svg>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { Swiper, Navigation, Pagination } from "swiper";
import { selectedCityId } from "@/composable/selectCity";
Swiper.use([Navigation, Pagination]);

export default {
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    packageType: {
      type: Array,
      required: true,
    },
  },
  setup() {
    return {
      selectedCityId,
    };
  },
  data() {
    return {
      isReachBeginningSlide: true,
      isReachEndSlide: false,
    };
  },
  computed: {
    isShowPagination() {
      return !this.isLoading && this.packageType.length > this.slidesPerView;
    },
    isShowArrow() {
      return (
        !this.isLoading &&
        this.isDesktop &&
        this.packageType.length > this.slidesPerView
      );
    },
    slidesPerView() {
      return this.isDesktop ? 5 : 3;
    },
  },
  watch: {
    isLoading: {
      handler(newVal) {
        if (newVal === false) {
          this.$nextTick(() => {
            this.initSlider();
          });
        }
      },
    },
  },
  updated() {
    this.$nextTick(() => {
      this.initSlider();
    });
  },
  methods: {
    async initSlider() {
      const el = this.$refs["package-type-slider"];
      let config = {
        centerInsufficientSlides: true,
        slidesPerView: this.slidesPerView,
        spaceBetween: 10,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          dynamicBullets: true,
        },
      };

      if (this.isShowArrow) {
        config.navigation = {
          nextEl: this.$refs["slider-next"],
          prevEl: this.$refs["slider-prev"],
        };
        config.on = {
          slideChange: () => {
            this.isReachBeginningSlide = this.sliderInstance.isBeginning;
            this.isReachEndSlide = this.sliderInstance.isEnd;
          },
        };
      }
      try {
        this.sliderInstance = new Swiper(el, config);
      } catch (err) {
        this.$alert.error(err);
        this.$rollbar.error(err);
      }
    },
    buildLink(id) {
      return `/restaurants/search?city_id=${this.selectedCityId}&package_type[]=${id}`;
    },
    goToLink(index, packageType) {
      const link = `/restaurants/search?city_id=${this.selectedCityId}&package_type[]=${packageType.packageTypeCode}`;
      this.$emit("on-package-type-clicked", { index, packageType });
      window.location = link;
    },
  },
};
</script>
<i18n>
{
  "en": {
    "packageTypeSectionTitle": "Feast Like Never Before",
    "packageTypeSectionSubTitle": "Learn more about our revolutionary packages"
  },
  "th": {
    "packageTypeSectionTitle": "ดีลร้านอาหารดีๆ แบบไม่เคยมีที่ไหนมาก่อน",
    "packageTypeSectionSubTitle": "เรียนรู้เพิ่มเติมเกี่ยวกับแพ็คเก็จที่ดีที่สุดของเรา"
  }
}
</i18n>
