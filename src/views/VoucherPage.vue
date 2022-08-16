<template>
  <div>
    <div class="min-h-screen voucher-page">
      <!-- breadcrumb -->
      <ul
        class="flex px-4 mt-4 mb-4 overflow-x-scroll text-sm lg:overflow-x-auto lg:overflow-y-hidden lg:mb-6 lg:mt-2 lg:px-0 breadcrumbs"
      >
        <li>
          <router-link
            :to="{ name: ROUTE_HOME_PAGE }"
            class="whitespace-nowrap text-red-dark hover:text-red-light hover:underline"
          >
            Home
          </router-link>
        </li>
        <li class="flex items-center mx-4">
          <img
            src="@/assets/icon-arrow-right-red.png"
            style="width: 10px"
             loading="lazy"
            alt="icon arrow right"
          />
        </li>
        <li>
          <router-link
            :to="{ name: ROUTE_VOUCHER_PAGE }"
            class="font-black whitespace-nowrap text-red-dark hover:text-red-light hover:underline"
          >
            Hungry Hub Gift Card
          </router-link>
        </li>
      </ul>
      <div class="flex flex-col lg:flex-row">
        <div class="main">
          <MainContent
            :is-loading="isLoading"
            :title="title"
            :introduction-items="introductionItems"
            @on-voucher-clicked="selectCustomVoucher"
          />
        </div>
        <!-- sidebar (only in desktop) -->
        <div v-if="isDesktop" class="sidebar">
          <div id="sticky-voucher-flow" class="hh-shadow">
            <VoucherFlow
              v-if="isStartVoucherFlow"
              :is-show-restaurant-package="false"
              :pre-select-custom-vouchers="selectedCustomVouchers"
              @on-back-clicked="toggleStartVoucherFlow(false)"
              @on-custom-voucher-removed="removeSelectedCustomVoucher"
            />
            <VoucherEmpty
              v-else
              @on-button-clicked="toggleStartVoucherFlow(true)"
            />
          </div>
        </div>
        <!-- mobile book button -->
        <div v-else id="sticky-voucher-flow" class="bg-white">
          <VoucherEmpty
            @on-back-button-click="$router.push({ name: ROUTE_HOME_PAGE })"
            @on-button-clicked="toggleStartVoucherFlow(true)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ROUTE_HOME_PAGE,
  ROUTE_VOUCHER_PAGE,
  ROUTE_BUY_VOUCHER_PAGE,
} from "@/lib/constant";
import humps from "humps";
import stickybits from "stickybits";
import useQueryString from "@/composable/useQueryString";
import { getVoucherIntroduction } from "@/services/common";
import useLazyImport from "@/composable/useLazyImport";

export default {
  name: "VoucherPage",
  metaInfo() {
    return {
      title: "Hungry Hub Gift Card",
    };
  },
  components: {
    VoucherEmpty: () =>
      useLazyImport(() =>
        import("@/components/Page Component/hungryhub_voucher/VoucherEmpty.vue")
      ),
    MainContent: () =>
      useLazyImport(() =>
        import("@/components/Page Component/hungryhub_voucher/MainContent.vue")
      ),
    VoucherFlow: () =>
      useLazyImport(() =>
        import(
          "@/components/Page Component/Restaurant/RestaurantVoucherFlow.vue"
        )
      ),
  },
  setup() {
    const {
      getQueryString,
      addQueryString,
      removeQueryString,
      getStringifyQueryString,
    } = useQueryString();
    return {
      ROUTE_HOME_PAGE,
      ROUTE_VOUCHER_PAGE,
      removeQueryString,
      getStringifyQueryString,
      addQueryString,
      getQueryString,
    };
  },
  data() {
    return {
      title: "",
      introductionItems: [],
      isLoading: true,
      isStartVoucherFlow: false,
      selectedCustomVouchers: [],
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    this.removeQueryString("selectedAmount");
    this.setVoucherFlowSticky();
  },
  methods: {
    selectCustomVoucher(amount) {
      if (typeof amount === "number") {
        this.selectedCustomVouchers = [amount];
      }
      this.toggleStartVoucherFlow(true);
    },
    removeSelectedCustomVoucher() {
      this.selectedCustomVouchers = [];
    },
    toggleStartVoucherFlow(isStart) {
      if (this.isDesktop) {
        this.isStartVoucherFlow = isStart;
        return;
      }
      const routeConfig = {
        name: ROUTE_BUY_VOUCHER_PAGE,
      };
      if (this.selectedCustomVouchers.length) {
        this.addQueryString("selectedAmount", this.selectedCustomVouchers[0]);
        const final = this.getQueryString();
        routeConfig.query = humps.decamelizeKeys(final);
      }
      this.$router.push(routeConfig);
    },
    setVoucherFlowSticky() {
      const config = {};
      if (this.isDesktop) {
        config.stickyBitStickyOffset = 45;
        this.$nextTick(() => {
          stickybits("#sticky-voucher-flow", config);
        });
      } else {
        const el = document.getElementById("sticky-voucher-flow");
        el.style.position = "sticky";
        el.style.bottom = 0;
      }
    },
    async getData() {
      this.isLoading = true;
      const { isSuccess, message, data } = await getVoucherIntroduction();
      if (isSuccess) {
        this.title = data.introDescription;
        this.introductionItems = Array.isArray(data.data) ? data.data : [];
        this.isLoading = false;
        return;
      }
      this.$alert.error(message);
    },
  },
};
</script>

<style scoped>
@screen lg {
  .voucher-page {
    max-width: 1280px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 25px;
    margin-bottom: 25px;
  }

  .main {
    width: 75%;
  }

  .sidebar {
    width: 28%;
  }
}
</style>
