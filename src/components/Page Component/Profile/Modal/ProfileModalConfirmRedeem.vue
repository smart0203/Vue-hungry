<template>
  <HHPopup
    name="profile-confirm-redeem"
    :modal-title="startCase($t('confirmVoucherRedemption'))"
    :is-tooltip-desktop="false"
    :modal-width="isDesktop ? 500 : '100%'"
    :is-show="isShow"
    :show-close-button="true"
    :close-on-bg-click="true"
    @on-closed="onClosed"
  >
    <div class="my-8">
      <div class="mx-4 mt-10 text-center">
        <p>
          {{ $t("aboutToRedeem", { val: $money(pointUseForRedeem) }) }}
        </p>
        <p>
          {{ $t("forPoint", { val: pointUseForRedeem }) }}
        </p>
      </div>

      <div class="flex items-center justify-center mt-6">
        <button
          class="px-2 py-1 mr-6 capitalize border rounded-full border-red-dark text-red-dark disabled:opacity-50"
          :disabled="redeemIsLoading"
          @click="onClosed"
        >
          {{ $t("cancel") }}
        </button>
        <button
          class="flex items-start px-2 py-1 text-white capitalize border rounded-full bg-red-dark border-red-dark disabled:opacity-50"
          :disabled="redeemIsLoading"
          @click="confirmRedeem"
        >
          <div v-if="redeemIsLoading" class="mr-1 loader small white"></div>
          {{ $t("confirm") }}
        </button>
      </div>
    </div>
  </HHPopup>
</template>

<script>
import startCase from "lodash-es/startCase";
import { state as profilePointState } from "../Point/profilePoint";
import useVoucherList from "@/composable/getVoucherList";

import {
  state as redeemState,
  methods as redeemMethods,
} from "@/composable/redeemVoucher";
import useLazyImport from "@/composable/useLazyImport";
export default {
  components: {
    HHPopup: () => useLazyImport(() => import("@/components/Shared/HHPopup")),
  },
  props: {
    isShow: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const { state: voucherListState, methods: voucherListMethods } =
      useVoucherList();
    const {
      isError: redeemisError,
      message: redeemMessage,
      isLoading: redeemIsLoading,
    } = redeemState;
    const { pointUseForRedeem, userPoint } = profilePointState;
    return {
      redeemisError,
      redeemMessage,
      redeemIsLoading,
      pointUseForRedeem,
      userPoint,
      ...voucherListState,
      ...voucherListMethods,
      ...redeemMethods,
    };
  },
  methods: {
    startCase,
    async confirmRedeem() {
      await this.redeemVoucher(this.pointUseForRedeem, this.userPoint);
      if (this.redeemisError) {
        this.$alert.error(this.redeemMessage);
      } else {
        this.$alert.success(this.redeemMessage);
        this.$emit("on-voucher-redeemed");
      }
    },
    onClosed() {
      this.pointUseForRedeem = 0;
      this.$emit("on-closed");
    },
  },
};
</script>

<style lang="scss">
.point {
  font-size: 56px;
}

.profile-voucher .voucher-amount-section {
  @apply w-1/3;

  .amount {
    @apply text-xl;
  }
}
</style>

<i18n>
{
  "en": {
    "aboutToRedeem": "You’re about to redeem a {val} voucher",
    "forPoint": "for {val} Hungry Points"
  },
  "th": {
    "aboutToRedeem": "คุณกำลังจะแลกรับวอชเชอร์ {val}",
    "forPoint": "สำหรับ {val} Hungry Points"
  }
}
</i18n>
