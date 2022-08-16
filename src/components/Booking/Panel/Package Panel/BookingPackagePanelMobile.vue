<template>
  <div class="flex flex-col flex-grow">
    <!-- select package screen -->
    <template v-if="selectPackageScreen">
      <h4 class="text-lg font-black text-center capitalize">
        {{ $t("selectPackage") }}
      </h4>
      <BookingSelectPackages
        :available-packages="availablePackages"
        @on-package-selected="onPackageSelected"
      />
      <div v-if="isDineIn && showSummary" class="mx-2 mb-4 text-sm text-center">
        <div class="font-black">
          {{ bookingSummaryText }}
        </div>
        <div>
          {{
            `${bookingSummary.date} ${
              bookingSummary.time ? $t("at") + " " + bookingSummary.time : ""
            }`
          }}
        </div>
      </div>
      <!-- button to go 'confirm selected menu' screen -->
      <div
        class="flex items-center justify-center w-full mx-auto mt-2 bg-white confirm-button"
      >
        <svg
          v-if="shouldShowBackIcon"
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="currentColor"
          class="mx-4 cursor-pointer icon-chevron-left text-red-dark hover:text-red-light"
          viewBox="0 0 16 16"
          @click="onBackClicked"
        >
          <path
            fill-rule="evenodd"
            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
          />
        </svg>
        <div v-else class="relative mx-3" @click="goToConfirmScreen">
          <img :src="selectedPackageButtonIcon" width="40"  loading="lazy" alt="button icon" />
          <span
            class="absolute text-sm text-white"
            style="top: 8px; left: 17px"
            >{{ selectedPackageCount }}</span
          >
        </div>
        <button
          id="confirm-package-button"
          class="flex-grow py-2 my-2 mr-6 font-black leading-normal text-white uppercase border-none rounded-full cursor-pointer tracked"
          :class="isConfirmButtonDisabled ? 'bg-gray-light' : 'bg-red-dark'"
          :disabled="isConfirmButtonDisabled"
          @click="goToConfirmScreen"
        >
          {{ `${$t("confirm")} ${selectedMenuCount}` }}
        </button>
      </div>
    </template>
    <!-- confirm selected package screen -->
    <template v-else>
      <div class="flex-grow mb-10 lg:mt-4 confirm-selected-package-screen">
        <div class="selected-package-list">
          <BookingSelectedPackages class="mx-6" />
        </div>
      </div>
      <div
        class="flex items-center justify-center w-full mx-auto mt-2 bg-white confirm-button"
      >
        <img
          src="@/assets/icon-arrow-left-red.png"
          style="width: 23px"
           loading="lazy"
          @click="selectPackageScreen = true"
        />
        <button
          id="confirm-package-button"
          class="w-4/6 py-2 my-2 ml-4 font-black leading-normal text-white uppercase border-none rounded-full cursor-pointer tracked"
          :class="isConfirmButtonDisabled ? 'bg-gray-light' : 'bg-red-dark'"
          :disabled="isConfirmButtonDisabled"
          @click="confirmButtonClicked"
        >
          {{ $t("confirm") }}
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import PackagePanelMixin from "./PackagePanelMixin";
import redOrderIcon from "@/assets/icon-order-red.png";
import whiteOrderIcon from "@/assets/icon-order-white.png";
import { mapGetters } from "vuex";
import qs from "qs";
import humps from "humps";
import { PACKAGE_CODE_HAH } from "@/lib/constant";
import useLazyImport from "@/composable/useLazyImport";
export default {
  components: {
    BookingSelectPackages: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "booking-select-packages-chunk" */ "@/components/Booking/BookingSelectPackages"
        )
      ),
    BookingSelectedPackages: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "booking-selected-packages-chunk" */ "@/components/Booking/BookingSelectedPackages"
        )
      ),
  },
  mixins: [PackagePanelMixin],
  data() {
    return {
      selectPackageScreen: true,
    };
  },
  computed: {
    ...mapGetters("booking", ["isDineIn"]),
    shouldShowBackIcon() {
      return (
        this.showBackIcon && this.getSelectedPackageType !== PACKAGE_CODE_HAH
      );
    },
    selectedPackageButtonIcon() {
      return this.getSelectedPackage.length == 0
        ? whiteOrderIcon
        : redOrderIcon;
    },
    selectedPackageCount() {
      let count = 0;
      this.getSelectedPackage.forEach(
        (packages) => (count += packages.quantity)
      );
      return count;
    },
  },
  watch: {
    selectPackageScreen(newVal) {
      if (newVal) {
        this.removeMarkFromURL();
        this.removePopStateHandler();
      } else {
        this.addMarkToURL();
        this.registerPopStateHandler();
      }
    },
  },
  methods: {
    goToConfirmScreen() {
      if (this.getSelectedPackageType === "hah") {
        this.selectPackageScreen = false;
        this.$emit("on-confirm-clicked");
      } else {
        this.confirmButtonClicked();
      }
      this.mobileScrollToTop();
    },
    registerPopStateHandler() {
      window.onpopstate = () => {
        this.selectPackageScreen = true;
        this.removeMarkFromURL();
      };
    },
    removePopStateHandler() {
      window.onpopstate = {};
    },
    addMarkToURL() {
      const parsedQueryString = qs.parse(window.location.search, {
        ignoreQueryPrefix: true,
      });
      parsedQueryString.confirmPackage = true;
      const stringify = qs.stringify(humps.decamelizeKeys(parsedQueryString));

      window.history.pushState(null, null, `?${stringify}`);
    },
    removeMarkFromURL() {
      const parsedQueryString = qs.parse(window.location.search, {
        ignoreQueryPrefix: true,
      });
      parsedQueryString.confirmPackage = null;
      const stringify = qs.stringify(humps.decamelizeKeys(parsedQueryString), {
        skipNulls: true,
      });

      window.history.replaceState(null, null, `?${stringify}`);
    },
  },
};
</script>

<style scoped>
/* .section-wrapper {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  margin: 24px 0;
} */

.confirm-button {
  position: sticky;
  bottom: 0;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
}

.selected-package-list {
  background: #fff;
}

.confirm-selected-package-screen {
  min-height: 400px;
}
</style>
