<template>
  <div
    class="flex items-center"
    :class="isReverseCheckbox ? 'flex-row-reverse' : null"
  >
    <input
      v-if="isShowCheckBox"
      v-model="isCheckboxSelected"
      type="checkbox"
      class="mx-2 red-checkbox big-checkbox"
    />
    <div class="w-full border rounded-md shadow-md">
      <div class="flex">
        <div class="flex-auto p-3 border-r border-gray-300">
          <p class="text-sm font-bold leading-5 text-gray-800">{{ name }}</p>
          <p
            class="my-2 text-xs leading-4"
            :class="
              isLoading
                ? ' bg-gray-400 text-gray-400 w-9/12'
                : 'bg-white text-gray-500'
            "
          >
            Valid until: {{ validUntil }}
          </p>
          <div class="flex">
            <div class="flex items-center font-black leading-6">
              <p v-if="showRemainingAmount" class="text-red-dark">
                {{ $money(remainingAmount) }}
                <span class="text-gray-500">/</span>
              </p>
              <p
                :class="[
                  isLoading
                    ? 'bg-gray-400 text-gray-400 w-3/12'
                    : 'bg-white text-red-dark',
                  showRemainingAmount ? 'text-gray-500' : 'text-red-dark',
                ]"
              >
                {{ $money(price) }}
              </p>
            </div>
            <div class="flex items-center justify-center flex-shrink-0">
              <div
                class="w-2 h-2 mx-2 rounded-full"
                :class="isLoading ? ' bg-gray-400' : 'bg-red-dark'"
              ></div>
            </div>
            <p
              class="font-black leading-6"
              :class="
                isLoading
                  ? ' bg-gray-400 text-gray-400 w-3/12'
                  : 'text-red-dark bg-white'
              "
            >
              {{ code }}
            </p>
          </div>
        </div>
        <div
          v-if="isShowShareButton || isShowCopyButton"
          class="flex flex-col justify-around p-3"
        >
          <button
            v-if="isShowShareButton"
            class="px-3 py-1 mb-2 text-sm capitalize border rounded-lg whitespace-nowrap"
            :class="
              isLoading
                ? 'bg-gray-400 text-gray-400'
                : 'border-red-dark text-red-dark bg-white'
            "
            @click="$emit('on-shared')"
          >
            {{ $t("share") }}
          </button>
          <button
            v-if="isShowCopyButton"
            class="px-3 py-1 text-sm capitalize rounded-lg whitespace-nowrap"
            :class="
              isLoading
                ? 'bg-gray-400 text-gray-400'
                : ' bg-red-dark text-white'
            "
            @click="$emit('on-copied')"
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
  name: "VoucherCard",
  props: {
    name: {
      type: String,
      required: true,
    },
    validUntil: {
      type: String,
      required: true,
    },
    remainingAmount: {
      type: [String, Number],
      default: "",
    },
    price: {
      type: [String, Number],
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isShowCheckBox: {
      type: Boolean,
      default: false,
    },
    isShowCopyButton: {
      type: Boolean,
      default: true,
    },
    isShowShareButton: {
      type: Boolean,
      default: true,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
    isReverseCheckbox: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isCheckboxSelected: false,
    };
  },
  computed: {
    showRemainingAmount() {
      return this.remainingAmount && this.remainingAmount != this.price;
    },
  },
  watch: {
    isSelected(newVal) {
      this.isCheckboxSelected = newVal;
    },
    isCheckboxSelected(newVal) {
      this.$emit("on-selected-change", newVal);
    },
  },
};
</script>
