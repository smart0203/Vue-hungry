<template>
  <div class="border rounded-lg shadow">
    <div class="px-3 py-3">
      <div
        class="font-bold leading-5"
        :class="isLoading ? ' bg-gray-400 text-gray-400' : ''"
      >
        {{ title }}
      </div>
      <hr class="my-2" />
      <div class="flex items-center justify-between lg:text-sm">
        <div
          class="mr-2 font-normal"
          :class="isLoading ? ' bg-gray-400 text-gray-400' : ''"
        >
          {{ amountLabel }}
        </div>
        <button
          class="flex items-center px-3 py-1 text-sm text-white capitalize rounded-lg"
          :disabled="isLoading"
          :class="
            isLoading
              ? 'bg-gray-400 text-gray-400'
              : 'bg-red-dark hover:bg-red-light active:bg-red-light'
          "
          @click="$emit('on-selected')"
        >
          <span v-if="!isLoading" class="flex-shrink-0 mr-1">
            <img
              src="@/assets/icon-shopping-cart-white.png"
              alt="icon shopping"
              loading="lazy"
            />
          </span>
          <span class="flex-shrink-0 whitespace-nowrap">
            {{ $t("buy") }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VoucherCard",
  props: {
    title: {
      type: String,
      required: true,
    },
    amount: {
      type: [Number, String],
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    amountLabel() {
      return typeof this.amount === "string"
        ? this.amount
        : this.$money(this.amount);
    },
  },
};
</script>
