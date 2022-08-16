<template>
  <div>
    <!-- banner -->
    <HhImage
      :mobile-width="'full-screen'"
      :img="voucherBanner"
      class="mx-auto"
    />

    <!-- description -->
    <h2
      class="my-6 text-sm text-center text-gray-800 lg:mx-auto lg:w-8/12 lg:text-base"
      :class="
        isLoading
          ? ' w-10/12 h-10 bg-gray-400 text-gray-400 mx-auto animate-pulse'
          : 'mx-4'
      "
      v-html="title"
    ></h2>
    <!-- title -->
    <h1
      class="flex items-center justify-between mx-4 mb-4 text-lg text-center lg:justify-center lg:font-black lg:mx-0"
    >
      <span
        class="font-bold"
        :class="isLoading ? ' bg-gray-400 text-gray-400 animate-pulse' : ''"
      >
        Hungry Hub Gift Card</span
      >
      <span
        v-if="isMobile"
        class="text-sm capitalize"
        :class="
          isLoading ? ' bg-gray-400 text-gray-400' : ' text-red-dark bg-white'
        "
        @click="$router.push({ name: ROUTE_BUY_VOUCHER_PAGE })"
        >{{ $t("seeAll") }}</span
      >
    </h1>
    <!-- voucher selection section -->
    <div class="relative">
      <div class="mx-4 lg:w-11/12 lg:mx-auto">
        <div ref="voucher-selection-slider" class="swiper">
          <div class="swiper-wrapper">
            <div
              v-for="voucher in hungryhubVouchers"
              :key="`hh-voucher-${voucher.amount}`"
              class="voucher-slider-item swiper-slide"
            >
              <VoucherCard
                class="mr-2 text-sm lg:text-base"
                :is-loading="isLoading"
                :title="voucher.name"
                :amount="voucher.amount"
                @on-selected="onVoucherClicked(voucher.amount)"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="isDesktop"
        ref="slider-next"
        class="absolute cursor-pointer"
        style="top: 40%; right: 0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="currentColor"
          class="inline icon-chevron-right text-red-dark"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </div>
      <div
        v-if="isDesktop"
        ref="slider-prev"
        class="absolute cursor-pointer"
        style="top: 40%; left: 0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          class="inline icon-chevron-left text-red-dark"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
          />
        </svg>
      </div>
    </div>
    <div style="height: 1px" class="w-full my-6 bg-gray-400"></div>
    <!-- details section -->
    <div v-if="isLoading">
      <div v-for="n in 3" :key="n" class="mb-5">
        <div
          class="w-2/12 mx-5 mb-3 bg-gray-400 section-image animate-pulse"
          style="height: 30px"
        ></div>
        <div
          class="w-8/12 bg-gray-400 section-content animate-pulse"
          style="height: 100px"
        ></div>
      </div>
    </div>
    <div
      v-else-if="!isLoading && introductionItems"
      class="mx-4 lg:mx-0"
      :class="isLoading ? 'min-h-screen' : ''"
    >
      <div
        v-for="(item, index) in introductionItems"
        :key="`detail-section-${item.id}-${index}`"
        class="mb-5"
      >
        <HhImage
          :mobile-width="180"
          :desktop-width="270"
          :img="item.header.url"
          alt="section image"
          class="mb-3 section-image"
        />
        <div class="section-content" v-html="item.content"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ROUTE_BUY_VOUCHER_PAGE } from "@/lib/constant";
import "swiper/swiper-bundle.min.css";
import { Swiper, Navigation, Pagination } from "swiper";
import useLazyImport from "@/composable/useLazyImport";
Swiper.use([Navigation, Pagination]);

export default {
  components: {
    VoucherCard: () =>
      useLazyImport(() =>
        import("@/components/Page Component/hungryhub_voucher/VoucherCard.vue")
      ),
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    introductionItems: {
      type: Array,
      default() {
        return [];
      },
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ROUTE_BUY_VOUCHER_PAGE,
      sliderInstance: null,
      hungryhubVouchers: [
        {
          name: "Hungry Hub Gift Card",
          amount: "Custom Value",
        },
        {
          name: "Hungry Hub Gift Card",
          amount: 200,
        },
        {
          name: "Hungry Hub Gift Card",
          amount: 500,
        },
        {
          name: "Hungry Hub Gift Card",
          amount: 1000,
        },
        {
          name: "Hungry Hub Gift Card",
          amount: 1500,
        },
      ],
    };
  },
  computed: {
    voucherBanner() {
      return this.$store.getters["webConfig/voucherBanner"];
    },
  },
  mounted() {
    this.initSlider();
  },
  methods: {
    onVoucherClicked(amount) {
      this.$emit("on-voucher-clicked", amount);
    },
    initSlider() {
      const el = this.$refs["voucher-selection-slider"];
      const slidesPerView = this.isDesktop ? 4 : "auto";
      let sliderConfig = {
        slidesPerView: slidesPerView,
        spaceBetween: 10,
      };

      if (this.isDesktop) {
        sliderConfig.navigation = {
          nextEl: this.$refs["slider-next"],
          prevEl: this.$refs["slider-prev"],
        };
      }

      try {
        this.sliderInstance = new Swiper(el, sliderConfig);
      } catch (err) {
        this.$alert.error(err);
        this.$rollbar.error(err);
      }
    },
  },
};
</script>
<style lang="scss">
.voucher-slider-item {
  width: 75%;
  @screen lg {
    width: 100%;
  }
}
.section-image {
  width: 180px;
  @screen lg {
    widtth: 270px;
  }
}

.section-content {
  @apply ml-5 text-gray-900 text-sm mb-6;
  @screen lg {
    @apply text-base;
  }
}
.section-content ul {
  list-style: disc;
}

.section-content ol {
  list-style: decimal;
}

.section-content a {
  @apply text-blue-500 hover:underline;
}
</style>
