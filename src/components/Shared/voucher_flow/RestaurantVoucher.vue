<template>
  <div class="flex">
    <input
      v-if="isShowCheckBox"
      :checked="isSelected"
      type="checkbox"
      class="mt-3 mr-2 red-checkbox big-checkbox restaurant-voucher-checkbox"
      data-testid="restaurant-voucher-checkbox"
      @input="checkBoxChanged"
    />
    <div
      class="flex-grow min-w-0 border rounded-lg"
      :class="cardClass"
      :style="cardStyle"
    >
      <div class="p-2">
        <div class="flex items-center justify-between my-2">
          <div class="w-10/12 mr-2 font-bold truncate restaurant-voucher-name">
            {{ name }}
          </div>
          <button
            class="text-xs capitalize text-red-dark restaurant-voucher-details-button hover:underline whitespace-nowrap"
            @click="$emit('on-detail-clicked')"
          >
            {{ $t("detail") }}
          </button>
        </div>

        <div
          class="mb-1 text-sm font-normal text-gray-500 restaurant-voucher-description"
        >
          <HHTextTruncate
            :text="description"
            :max-length="truncateDescriptionLength"
            :allow-html="false"
            :can-read-more="false"
          />
        </div>
      </div>

      <hr />

      <div
        class="flex items-center justify-between px-2 py-2"
        :class="isSelected ? ' bg-red-dark' : ' bg-white'"
      >
        <span
          class="text-lg font-black restaurant-voucher-price"
          :class="isSelected ? ' text-white' : ' text-red-dark'"
          >{{ price }}</span
        >
        <ButtonCounter
          :quantity="quantity"
          @on-decrease="$emit('on-quantity-decreased')"
          @on-increase="$emit('on-quantity-increased')"
          @on-quantity-change="
            (quantity) => $emit('on-quantity-changed', quantity)
          "
        />
      </div>
    </div>
  </div>
</template>
<script>
import ButtonCounter from "./ButtonCounter.vue";
export default {
  components: {
    ButtonCounter,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default() {
        return "";
      },
    },
    truncateDescriptionLength: {
      type: Number,
      default() {
        return 120;
      },
    },
    price: {
      type: String,
      required: true,
    },
    isShowCheckBox: {
      type: Boolean,
      default() {
        return true;
      },
    },
    isSelected: {
      type: Boolean,
      defautl() {
        return false;
      },
    },
    cardClass: {
      type: String,
      default() {
        return "";
      },
    },
    cardStyle: {
      type: String,
      default() {
        return "";
      },
    },
  },
  watch: {
    isSelected(newVal) {
      this.$emit("on-select-change", newVal);
    },
  },
  methods: {
    checkBoxChanged(event) {
      this.$emit("on-checkbox-changed", event.target.checked);
    },
  },
};
</script>
