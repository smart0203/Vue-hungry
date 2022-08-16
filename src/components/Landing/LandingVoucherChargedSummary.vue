<template>
  <div class="py-3 mx-1 my-3 lg:px-8">
    <div class="flex items-center mt-3 mb-5">
      <div
        class="flex items-center justify-center flex-shrink-0 mr-3 text-white rounded-full bg-red-dark"
        style="width: 35px; height: 35px"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          class="inline icon-check-circle-fill"
          viewBox="0 0 16 16"
        >
          <path
            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
          />
        </svg>
      </div>
      <h4 class="text-xl font-black ma0">
        {{ $t("chargedSummary") }}
      </h4>
    </div>

    <div
      v-for="(voucher, index) in vouchers"
      :key="`voucher-${index}-${voucher.name}`"
      class="flex mb-2"
    >
      <div class="flex-auto text-sm font-medium">
        {{ `${voucher.name} (x${voucher.quantity})` }}
      </div>
      <div class="font-black text-red-dark">
        {{ `${$money(voucher.quantity * voucher.amount)}` }}
      </div>
    </div>

    <div v-if="total" class="flex mb-2 font-black text-red-dark">
      <div class="flex-auto">{{ `${$t("totalPrepaidAmound")}:` }}</div>
      <div>{{ $money(total) }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LandingVoucherChargedSummary",
  props: {
    vouchers: {
      type: Array,
      default() {
        return [];
      },
    },
    total: {
      type: Number,
      default() {
        return 0;
      },
    },
  },
};
</script>

<style scoped>
.shadow {
  box-shadow: 0 0 21px 4px rgba(217, 217, 217, 1);
}
</style>
<i18n src="./landingTranslate.json"></i18n>
