<template>
  <div class="rounded-lg cursor-pointer voucher-card">
    <div class="flex rounded-lg">
      <div
        class="flex flex-col items-center justify-center flex-shrink-0 px-4 font-black text-white rounded-lg voucher-amount-section"
        :class="isLoading ? ' bg-gray-300 ' : 'bg-red-dark'"
      >
        <span v-if="isShowUseNow" class="uppercase whitespace-nowrap">{{
          $t("useNow")
        }}</span>
        <span v-if="!isLoading" class="text-lg amount">
          {{ $money(amount) }}
        </span>
      </div>
      <div class="flex-grow px-3 py-2 truncate">
        <p
          class="font-black truncate text-2xs lg:text-sm voucher-name"
          :class="isLoading ? ' bg-gray-300  h-6 text-gray-300' : 'text-black'"
        >
          {{ name }}
        </p>
        <p
          class="capitalize truncate text-2xs lg:text-sm voucher-exp-date"
          :class="isLoading ? ' bg-gray-300  h-4 text-gray-300 mt-2 w-20' : ''"
        >
          {{ $t("validUntil") }}: {{ expired }}
        </p>
        <div
          class="flex justify-between capitalize truncate text-2xs lg:text-sm voucher-code"
          :class="
            isLoading
              ? ' bg-gray-300  h-4 text-gray-300 mt-2 w-20'
              : 'text-red-dark'
          "
        >
          <p>
            <span v-if="!isShowCopyCode" class="mr-1"
              >{{ $t("voucherCode") }}:</span
            >
            <span class="font-black">{{ code }}</span>
          </p>

          <button
            v-if="isShowCopyCode"
            class="px-2 leading-6 text-white capitalize rounded-full shadow text-2xs lg:text-sm bg-red-dark border-red-dark"
          >
            {{ $t("copy") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    amount: {
      type: [String, Number],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    expired: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    isShowUseNow: {
      type: Boolean,
      default: true,
    },
    isShowCopyCode: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="scss" scoped>
.voucher-card:hover .voucher-name {
  @apply underline;
}
</style>
