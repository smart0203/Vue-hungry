<template>
  <div class="min-h-screen mx-4 my-6">
    <div class="relative mt-2 mb-10">
      <router-link to="/profile" class="absolute top-0 left-0 text-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          fill="currentColor"
          class="inline icon-chevron-left text-red-dark"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
            stroke-width="2"
          />
        </svg>
      </router-link>
      <p class="font-black text-center capitalize">{{ $t("redeemPoint") }}</p>
    </div>

    <div>
      <p class="capitalize">{{ $t("myHungryPoint") }}</p>
      <div class="flex items-end justify-between mt-4 text-right">
        <div class="flex items-end leading-none">
          <span class="font-bold point">
            {{ points }}
          </span>
          <div class="ml-2 text-sm capitalize">{{ $t("points") }}</div>
        </div>
        <div>
          <router-link
            v-if="points"
            to="/profile/point-history"
            class="px-4 py-2 mb-4 text-xs font-bold text-white capitalize border rounded-full bg-red-dark"
          >
            {{ $t("pointHistory") }}
          </router-link>
        </div>
      </div>

      <div
        class="px-1 py-2 mt-2 text-sm text-gray-600 border border-gray-600 rounded-lg"
      >
        {{ `100 point will expired on ` }}
      </div>
    </div>
    <p class="mt-4 mb-4 text-sm capitalize">{{ $t("myVoucher") }}</p>
    <div v-if="showedVoucherList.length">
      <VoucherCard
        v-for="voucher in showedVoucherList"
        :key="voucher.voucherCode"
        class="border shadow profile-voucher"
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
        class="flex items-center px-2 py-1 mx-auto my-2 mt-4 capitalize border rounded-full text-2xs text-red-dark border-red-dark disabled:opacity-50"
        @click="loadMoreGetVoucher"
      >
        <div v-if="voucherListIsLoading" class="mr-1 loader small"></div>
        {{ voucherListIsLoading ? $t("pleaseWait") : $t("showMore") }}
      </button>
    </div>
    <div v-else class="my-16 text-sm text-center text-gray-600">
      <img
        src="@/assets/icon-voucher-white.png"
        alt="no voucher"
        class="mx-auto"
        loading="lazy"
      />
      {{ $t("youDontHaveVoucher") }}
    </div>

    <p class="my-3 text-sm capitalize">{{ $t("redeemVouchers") }}</p>

    <div
      v-for="redeem in voucherToRedeem"
      :key="redeem.id"
      class="mb-1 border rounded-lg shadow cursor-pointer voucher-card profile-voucher"
    >
      <div class="flex rounded-lg">
        <div
          class="flex flex-col items-center justify-center w-1/3 px-4 font-black text-white rounded-lg"
          :class="redeem.canApply ? ' bg-red-dark' : ' bg-gray-dark'"
        >
          <span class="text-lg amount"> {{ $money(redeem.point) }} </span>
        </div>
        <div class="w-2/3 px-3 py-2">
          <p
            class="font-black text-black capitalize truncate text-2xs voucher-name"
          >
            {{ $t("redeem") }} {{ $money(redeem.point) }}
          </p>
          <div class="flex items-stretch justify-between">
            <div
              class="flex items-end capitalize truncate text-2xs text-red-dark voucher-code"
            >
              {{ redeem.point }} hungry points
            </div>
            <button
              class="flex items-center px-2 leading-6 text-white capitalize rounded-full text-2xs disabled:opacity-50"
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
