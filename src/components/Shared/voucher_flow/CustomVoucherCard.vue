<template>
  <div class="flex flex-col border rounded">
    <div class="mx-3 my-4">
      <div class="relative">
        <input
          :value="amount"
          class="w-full px-2 py-2 border rounded input-amount"
          type="number"
          :placeholder="$t('applyAmount')"
          @input="onAmountChange($event)"
        />
        <button
          class="absolute p-1 text-xs rounded-lg hover:underline capitalize"
          :class="
            anyAmountInputed
              ? 'text-red-dark hover:bg-red-pink'
              : ' text-gray-400 cursor-not-allowed'
          "
          style="top: 25%; right: 10px"
        >
          <span>
            {{ $t("apply") }}
          </span>
        </button>
      </div>
      <div class="flex mt-3">
        <button
          v-for="amountOption in amountOptions"
          :key="amountOption"
          class="w-full px-1 py-1 mr-1 text-xs text-center border rounded-full lg:text-sm hover:underline"
          :class="
            amount === amountOption ? 'bg-red-dark text-white' : 'text-gray-500'
          "
          @click="onAmountOptionClicked(amountOption)"
        >
          {{ $money(amountOption) }}
        </button>
      </div>

      <div class="mt-4 text-center">
        <ButtonCounter
          :disable-input="amount.length === 0"
          :quantity="quantity"
          @on-increase="increaseQuantity"
          @on-decrease="decreaseQuantity"
          @on-quantity-change="onQuantityChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed } from "@vue/composition-api";
import debounce from "lodash-es/debounce";
import ButtonCounter from "./ButtonCounter.vue";
export default {
  components: {
    ButtonCounter,
  },
  props: {
    quantity: {
      type: Number,
      default: 0,
    },
    amount: {
      type: String,
      default: "",
    },
    amountOptions: {
      type: Array,
      default() {
        return ["100", "200", "500", "1000", "1500"];
      },
    },
  },
  setup(props: any, context: any) {
    const anyAmountInputed = computed(() => {
      return props.amount.length;
    });
    const selectedAmountOption = ref(0);

    function onAmountOptionClicked(paramAmount: string) {
      context.emit("on-amount-option-clicked", paramAmount);
    }

    const onAmountChange = debounce((event) => {
      const amount = event.target.value;
      context.emit("on-amount-change", amount);
    }, 250);

    function onQuantityChange(quantity: number) {
      context.emit("on-quantity-change", quantity);
    }

    function decreaseQuantity() {
      context.emit("on-quantity-decreased");
    }

    function increaseQuantity() {
      context.emit("on-quantity-increased");
    }

    return {
      anyAmountInputed,
      selectedAmountOption,
      onAmountOptionClicked,
      onAmountChange,
      onQuantityChange,
      increaseQuantity,
      decreaseQuantity,
    };
  },
  i18n: {
    messages: {
      en: {
        apply: "apply",
        applyAmount: "Apply amount",
      },
      th: {
        apply: "ยืนยัน",
        applyAmount: "ระบุยอดเงิน",
      },
    },
  },
};
</script>

<style scoped>
input.input-amount::-webkit-outer-spin-button,
input.input-amount::-webkit-inner-spin-button,
input.input-quantity::-webkit-outer-spin-button,
input.input-quantity::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"].input-amount,
input[type="number"].input-quantity {
  -moz-appearance: textfield;
}
</style>
