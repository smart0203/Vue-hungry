<template>
  <div class="text-center bg-white rounded-lg">
    <div class="inline-block border rounded">
      <button
        class="px-3 border-r lg:text-2xl text-red-dark"
        data-testid="button-counter-decrease"
        @click="$emit('on-decrease')"
      >
        -
      </button>
      <input
        type="number"
        :value="quantity"
        class="inline-block text-center input-quantity"
        style="width: 60px"
        :disabled="disableInput"
        @keypress="isPressNumber($event)"
        @input="onQuantityChange"
        @blur="onBlur"
      />
      <button
        class="px-3 border-l lg:text-2xl text-red-dark"
        data-testid="button-counter-increase"
        @click="$emit('on-increase')"
      >
        +
      </button>
    </div>
  </div>
</template>
<script>
import { isPressNumber } from "@/helper/numberHelper";
export default {
  props: {
    quantity: {
      type: Number,
      default() {
        return 0;
      },
    },
    disableInput: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    function onQuantityChange(event) {
      const quantity = parseInt(event.target.value);
      context.emit("on-quantity-change", quantity);
    }

    function onBlur(event) {
      const quantity = parseInt(event.target.value);
      if (!quantity) {
        context.emit("on-quantity-change", 1);
      }
    }

    return {
      onQuantityChange,
      isPressNumber,
      onBlur,
    };
  },
};
</script>
<style scoped>
input.input-quantity::-webkit-outer-spin-button,
input.input-quantity::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"].input-quantity {
  -moz-appearance: textfield;
}
</style>
