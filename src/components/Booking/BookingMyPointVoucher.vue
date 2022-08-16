<template>
  <div>
    <div v-if="isShow" class="relative">
      <button
        class="flex items-center justify-center w-full py-1 mx-auto text-sm border rounded-full text-red-dark border-red-dark my-point-voucher-button"
        @click="togglePointDropdown"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          fill="currentColor"
          class="inline-block mr-1 icon-chevron-down"
          style="transition: all 0.2s ease-in"
          :class="isPointDropdownShow ? ' rotate-180-deg' : ''"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
          />
        </svg>
        <span class="leading-3 capitalize hover:underline">
          {{ $t("viewMyPointVoucher") }}</span
        >
      </button>

      <div
        v-if="isPointDropdownShow"
        class="pt-2 mt-1 mb-4 shadow my-point-voucher-dropdown"
      >
        <div class="flex items-center justify-between mx-2 my-2">
          <div>
            <img
              loading="lazy"
              src="@/assets/icon-baht-red.png"
              alt="baht-icon"
              width="20"
              height="20"
            />
          </div>
          <span class="text-sm capitalize">
            {{ $t("yourHungryPoint") }}
          </span>
          <div v-if="pointHistoryIsLoading" class="loader small"></div>
          <span v-else class="text-sm font-black text-red-dark">{{
            totalPoint
          }}</span>

          <div v-if="isHavePoint && canRedeem" class="relative">
            <button
              class="px-2 text-sm text-white capitalize border rounded-full bg-red-dark border-red-dark disabled:opacity-25 hover:bg-red-light"
              :disabled="redeemLoading"
              @click="toggleRedeemDropdown"
            >
              <div v-if="redeemLoading" class="mr-1 loader small white"></div>
              {{ redeemLoading ? $t("pleaseWait") : $t("redeem") }}
            </button>

            <div
              v-if="isRedeemDropdownShow"
              class="absolute left-0 flex flex-col w-full bg-white shadow text-red-dark"
              style="top: 100%"
            >
              <button
                class="my-1 font-black hover:underline redeem-voucher-button"
                @click="showConfirmRedeemModal(200)"
              >
                200
              </button>
              <button
                class="mb-1 font-black hover:underline redeem-voucher-button"
                @click="showConfirmRedeemModal(500)"
              >
                500
              </button>
              <button
                class="my-1 font-black hover:underline redeem-voucher-button"
                @click="showConfirmRedeemModal(1000)"
              >
                1000
              </button>
            </div>
          </div>
        </div>

        <div class="">
          <div
            v-if="voucherListLoading"
            class="flex items-center justify-center py-4 text-sm capitalize text-red-dark"
          >
            <div class="mr-2 loader small"></div>
            <div>{{ $t("pleaseWait") }}</div>
          </div>

          <div
            v-if="!canRedeem"
            class="w-full my-2 text-sm font-black text-center text-red-dark capital-first-letter"
          >
            {{ $t("colectPointToRedeem", { point: 200 }) }}
          </div>
          <div>
            <div v-if="voucherList.length" class="pr-2 voucher-wrapper">
              <VoucherCard
                v-for="(voucher, index) in voucherList"
                :key="`${index}-${voucher.id}-${voucher.voucherCode}`"
                class="border shadow"
                :amount="
                  voucher.isDeductible
                    ? voucher.deductibleBalance
                    : voucher.amount
                "
                :name="voucher.name"
                :expired="voucher.expiryDate"
                :code="voucher.voucherCode"
                @click.native="applyVoucher(voucher.voucherCode)"
              />

              <div
                v-if="voucherListAnyNextPage"
                class="flex items-center justify-center mt-5 mb-5"
              >
                <button
                  class="px-2 py-1 mx-auto text-xs capitalize border rounded-full text-red-dark border-red-dark hover:underline"
                  @click="showMoreVoucher"
                >
                  {{ $t("showMore") }}
                </button>
              </div>
            </div>
            <div
              v-else
              class="pb-2 text-sm font-black text-center text-red-dark capital-first-letter"
            >
              <span class="">{{ $t("youDontHaveVoucher") }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <vue-final-modal
      v-model="isConfirmRedeemShow"
      name="confirm-redeem-popup"
      classes="flex justify-center items-center"
      content-class="flex flex-col p-4"
    >
      <div
        class="relative w-auto mx-auto bg-white border rounded"
        @click="isConfirmRedeemShow = false"
      >
        <!-- close button -->
        <div
          class="absolute cursor-pointer text-red-dark"
          style="top: 5px; right: 8px"
          @click="isConfirmRedeemShow = false"
        >
          <img
            style="width: 15px; height: 15px"
            class="inline-block"
            loading="lazy"
            src="@/assets/icon-close-red.png"
            alt="close modal"
          />
        </div>
        <div class="px-4 pt-8 pb-2 lg:pt-2">
          <div
            class="text-sm text-center whitespace-nowrap lg:text-base lg:mt-8"
            v-html="$t('confirmRedeem', { point: pointToRedeem })"
          ></div>

          <div class="flex justify-end mt-4 lg:mt-8">
            <button
              class="flex items-center px-3 py-1 mr-2 text-sm font-black leading-normal capitalize border rounded-full whitespace-nowrap border-red-dark text-red-dark"
              @click="isConfirmRedeemShow = false"
            >
              {{ $t("cancel") }}
            </button>
            <button
              class="flex items-center px-3 py-1 text-sm font-black leading-normal text-white capitalize border-none rounded-full whitespace-nowrap bg-red-dark tracked hover:bg-red-light border-red-dark"
              @click="doRedeem"
            >
              {{ $t("confirm") }}
            </button>
          </div>
        </div>
      </div>
    </vue-final-modal>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
import useVoucherList from "@/composable/getVoucherList";
import {
  state as redeemState,
  methods as redeemMethods,
} from "@/composable/redeemVoucher";
import {
  state as pointHistoryState,
  methods as pointHistoryMethods,
} from "@/composable/pointHistory";
import {
  state as voucherState,
  methods as voucherMethods,
} from "@/composable/voucher";
import { mapGetters } from "vuex";
import { MIN_POINT_TO_REDEEM } from "@/lib/constant";
import useLazyImport from "@/composable/useLazyImport";
export default {
  components: {
    VoucherCard: () =>
      useLazyImport(() => import("@/components/Shared/VoucherCard")),
  },
  setup() {
    // point history
    const {
      isLoading: pointHistoryIsLoading,
      isError: pointHistoryIsError,
      anyNextPage: pointHistoryAnyNextPage,
      totalPoint,
    } = pointHistoryState;
    const { getPointHistoryList } = pointHistoryMethods;
    // use voucher
    const { voucherCode, voucherCheckLoading } = voucherState;
    const { useVoucher } = voucherMethods;
    // voucher list
    const { state: voucherListState, methods: voucherListMethods } =
      useVoucherList();
    const {
      isLoading: voucherListLoading,
      isError: voucherListError,
      voucherList,
      anyNextPage: voucherListAnyNextPage,
      pageNumber: voucherListPageNumber,
      totalVoucher,
    } = voucherListState;
    // redeem
    const {
      isLoading: redeemLoading,
      isError: redeemError,
      message: redeemMessage,
    } = redeemState;
    const { redeemVoucher } = redeemMethods;

    let isPointDropdownShow = ref(false);
    let isRedeemDropdownShow = ref(false);
    let isConfirmRedeemShow = ref(false);
    let pointToRedeem = ref(0);

    return {
      isPointDropdownShow,
      isRedeemDropdownShow,
      isConfirmRedeemShow,
      pointToRedeem,
      // voucher
      voucherCode,
      useVoucher,
      voucherCheckLoading,
      // voucher list
      voucherListLoading,
      voucherListError,
      voucherList,
      voucherListAnyNextPage,
      voucherListPageNumber,
      totalVoucher,
      ...voucherListMethods,
      // point history
      pointHistoryIsLoading,
      pointHistoryIsError,
      pointHistoryAnyNextPage,
      totalPoint,
      getPointHistoryList,
      // redeem
      redeemLoading,
      redeemError,
      redeemMessage,
      redeemVoucher,
    };
  },
  computed: {
    ...mapGetters("user", ["isUserSignedIn"]),
    isShow() {
      return this.isUserSignedIn;
    },
    isHavePoint() {
      return this.totalPoint && this.totalPoint > 0;
    },
    canRedeem() {
      return this.totalPoint && this.totalPoint >= MIN_POINT_TO_REDEEM;
    },
  },
  watch: {
    isShow: {
      handler(newVal) {
        if (newVal) {
          this.getPointAndVoucher();
        }
      },
      immediate: true,
    },
  },
  methods: {
    showConfirmRedeemModal(point) {
      this.toggleRedeemDropdown();
      this.pointToRedeem = point;
      this.isConfirmRedeemShow = true;
    },
    async doRedeem() {
      await this.redeemVoucher(this.pointToRedeem);
      if (this.redeemError) {
        this.$alert.error(this.redeemMessage);
      } else {
        this.$alert.success(this.redeemMessage);
        this.getPointHistoryList();
        this.getVoucherList("active", false);
      }
      this.isConfirmRedeemShow = false;
    },
    togglePointDropdown() {
      this.isPointDropdownShow = !this.isPointDropdownShow;
    },
    toggleRedeemDropdown() {
      this.isRedeemDropdownShow = !this.isRedeemDropdownShow;
    },
    applyVoucher(code) {
      if (!this.voucherCheckLoading) {
        this.voucherCode = code;
        this.useVoucher(true);
      }
    },
    showMoreVoucher() {
      this.voucherListPageNumber += 1;
      this.getVoucherList("active", true);
    },
    async getPointAndVoucher() {
      if (this.isShow) {
        await this.getPointHistoryList();
        if (!this.pointHistoryIsError) {
          await this.getVoucherList("active", false);
        }
      }
    },
  },
};
</script>
<style scoped>
.rotate-180-deg {
  transform: rotate(180deg);
}

.shadow {
  box-shadow: -1px 3px 6px rgba(0, 0, 0, 0.160784);
}

.voucher-wrapper {
  height: 130px;
  overflow-y: scroll;
}
</style>
