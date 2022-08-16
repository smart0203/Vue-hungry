<template>
  <div class="my-6 profile-content-min-height">
    <div class="flex">
      <!-- my voucher section -->
      <section class="w-full pr-12">
        <p class="mb-3 text-sm capitalize">{{ $t("myVoucher") }}</p>
        <div v-if="showedVoucherList.length">
          <VoucherCard
            v-for="voucher in showedVoucherList"
            :key="voucher.voucherCode"
            class="mb-1 border shadow profile-voucher"
            :amount="voucher.amount"
            :name="voucher.name"
            :expired="voucher.expiryDate"
            :code="voucher.voucherCode"
            :is-show-use-now="false"
            :is-show-copy-code="false"
            :is-loading="voucherListIsInitialLoading"
          />
          <button
            v-if="voucherListAnyNextPage"
            :disabled="voucherListIsLoading"
            class="flex items-center px-2 py-1 mx-auto mt-4 text-xs capitalize border rounded-full text-red-dark border-red-dark disabled:opacity-50"
            @click="loadMoreGetVoucher"
          >
            <div v-if="voucherListIsLoading" class="mr-1 loader small"></div>
            {{ voucherListIsLoading ? $t("pleaseWait") : $t("showMore") }}
          </button>
        </div>
        <div v-else class="my-12 text-sm text-center text-gray-600">
          <img
            src="@/assets/icon-voucher-white.png"
            alt="no voucher"
            loading="lazy"
            class="mx-auto"
          />
          {{ $t("youDontHaveVoucher") }}
        </div>
      </section>

      <!-- voucher to redeem section -->
      <section class="w-full">
        <p class="mb-3 text-sm capitalize">{{ $t("redeemVouchers") }}</p>

        <div
          v-for="redeem in voucherToRedeem"
          :key="redeem.id"
          class="mb-1 shadow voucher-card profile-voucher"
        >
          <div class="flex rounded-lg">
            <div
              class="flex flex-col items-center justify-center w-1/3 px-4 font-black text-white"
              :class="redeem.canApply ? ' bg-red-dark' : ' bg-gray-dark'"
            >
              <span class="text-lg amount"> {{ $money(redeem.point) }} </span>
            </div>
            <div class="w-2/3 px-3 py-2">
              <p
                class="text-xs font-black text-black capitalize truncate voucher-name"
              >
                {{ $t("redeem") }} {{ $money(redeem.point) }}
              </p>
              <div class="flex items-end justify-between">
                <p
                  class="text-xs capitalize truncate text-red-dark voucher-code"
                >
                  <span>{{ redeem.point }} hungry points</span>
                </p>
                <button
                  class="flex items-center px-2 text-xs leading-6 text-white capitalize rounded-full"
                  :class="
                    redeem.canApply
                      ? ' bg-red-dark border-red-dark'
                      : ' bg-gray-dark border-gray-dark'
                  "
                  :disabled="!redeem.canApply || redeem.isLoading"
                  @click="willRedeem(redeem.point)"
                >
                  <span
                    v-if="redeem.isLoading"
                    class="mr-1 loader small white"
                  ></span>
                  {{ $t("getVoucher") }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <ProfileModalConfirmRedeem
      :is-show="showConfirmRedeemModal"
      @on-closed="showConfirmRedeemModal = false"
      @on-voucher-redeemed="voucherRedeemedCallback"
    />
  </div>
</template>

<script>
import profilePointMixin from "./profilePointMixin";
export default {
  mixins: [profilePointMixin],
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
