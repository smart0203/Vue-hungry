<template>
  <div class="w-full pl-2 pr-2">
    <template v-if="isDineIn">
      <h4 class="text-lg font-black text-center capitalize">
        {{ $t("selectPackage") }}
      </h4>

      <BookingSelectPackages
        :show-package-section-title="false"
        :available-packages="availablePackages"
        :prefer-show-voucher-icon="!isAllPackAcceptVoucher"
        @on-package-selected="onPackageSelected"
      />
      <div v-if="isDineIn && showSummary" class="mt-4 text-sm text-center">
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

      <div
        class="flex items-center justify-center w-full px-4 mx-auto mt-2 bg-white confirm-button"
      >
        <svg
          v-if="showBackIcon"
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="currentColor"
          class="cursor-pointer icon-chevron-left text-red-dark hover:text-red-light"
          viewBox="0 0 16 16"
          @click="$emit('on-back-clicked')"
        >
          <path
            fill-rule="evenodd"
            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
          />
        </svg>
        <button
          id="confirm-package-button"
          class="flex-grow py-2 my-2 ml-4 font-black leading-normal text-white uppercase border-none rounded-full cursor-pointer tracked"
          :class="isConfirmButtonDisabled ? 'bg-gray-light' : 'bg-red-dark'"
          :disabled="isConfirmButtonDisabled"
          @click="confirmButtonClicked"
        >
          {{ $t("confirm") }}
        </button>
      </div>
    </template>
    <template v-else>
      <BookingSelectedPackages
        :prefer-show-voucher-icon="!isAllPackAcceptVoucher"
      />
      <div>
        <div class="flex items-center justify-center mx-auto mt-2">
          <button
            id="confirm-package-button"
            class="w-4/5 py-2 text-base font-black text-white uppercase rounded-full"
            :class="
              isConfirmButtonDisabled
                ? 'bg-gray-light cursor-not-allowed'
                : 'bg-red-dark hover:bg-red-light cursor-pointer'
            "
            :disabled="isConfirmButtonDisabled"
            @click="confirmButtonClicked"
          >
            {{ `${$t("next")} ${selectedMenuCount}` }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import useLazyImport from "@/composable/useLazyImport";
import { mapGetters } from "vuex";
import { mapFields } from "vuex-map-fields";
import PackagePanelMixin from "./PackagePanelMixin";

export default {
  components: {
    BookingSelectedPackages: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "booking-selected-packages-chunk" */ "@/components/Booking/BookingSelectedPackages"
        )
      ),
    BookingSelectPackages: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "booking-select-packages-chunk" */ "@/components/Booking/BookingSelectPackages"
        )
      ),
  },
  mixins: [PackagePanelMixin],
  computed: {
    ...mapFields("booking", ["packagePreference"]),
    ...mapGetters("booking", ["isDineIn", "canSkipSelectTime"]),
  },
};
</script>
