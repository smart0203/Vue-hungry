<template>
  <InputVoucher>
    <template
      #default="{
        useVoucherHandler,
        inputVoucherHandler,
        removeVoucherHandler,
        voucherCheckLoading,
      }"
    >
      <div>
        <!-- input voucher -->
        <div
          v-if="voucherApplied.length === 0 || isAnyGiftVoucherApplied"
          class="flex"
        >
          <input
            type="text"
            class="flex-auto w-full mr-6 text-sm text-center capitalize border-gray-400 border-none"
            style="border-bottom-width: 1px; border-bottom-style: solid"
            placeholder="Enter Voucher Code"
            :value="voucherCode.toUpperCase()"
            @input="inputVoucherHandler"
            @keydown="onKeydown"
          />
          <button
            id="use-voucher-button"
            class="flex items-center px-3 py-1 text-base font-black leading-normal text-white border-none rounded-full whitespace-nowrap bg-red-dark tracked hover:bg-red-light"
            :disabled="voucherCheckLoading"
            @click="useVoucherHandler"
          >
            <span
              v-if="voucherCheckLoading"
              class="mr-2 loader white small"
            ></span>
            {{ voucherCheckLoading ? "checking" : $t("useVoucher") }}
          </button>
        </div>
        <!-- voucher validation error -->
        <InlineAlert
          v-if="
            voucherValidationIsSuccess === false &&
            voucherApplied.length > 0 &&
            parsedVoucherValidationMessage.length
          "
          class="mt-3 font-black"
          :message="parsedVoucherValidationMessage"
          :type="voucherValidationErrorType"
        />
      </div>
      <!-- applied voucher -->
      <div class="flex flex-wrap mb-3">
        <div
          v-for="voucher in voucherApplied"
          :key="voucher.voucherCode"
          class="flex items-center flex-grow px-2 py-1 mt-2 mr-2 text-sm rounded-lg bg-red-pink"
        >
          <span class="flex-auto mr-2 uppercase">{{
            voucher.voucherCode
          }}</span>
          <img
            class="cursor-pointer"
            loading="lazy"
            src="@/assets/icon-close-black.png"
            alt="remove voucher"
            style="width: 10px; height: 10px"
            @click="
              removeVoucherHandler(voucher.voucherCode);
              $emit('on-voucher-removed');
            "
          />
        </div>
      </div>
    </template>
  </InputVoucher>
</template>

<script>
import { mapState } from "vuex";
import {
  state as voucherState,
  computeds as voucherComputeds,
} from "@/composable/voucher";
import useLazyImport from "@/composable/useLazyImport";

export default {
  components: {
    InlineAlert: () =>
      useLazyImport(() => import("@/components/Shared/InlineAlert")),
    InputVoucher: () =>
      useLazyImport(() =>
        import("@/components/Shared/Renderless/InputVoucher")
      ),
  },
  setup() {
    const { voucherApplied, voucherValidationIsSuccess, voucherCode } =
      voucherState;
    const {
      parsedVoucherValidationMessage,
      voucherPaymentType,
      isAnyGiftVoucherApplied,
    } = voucherComputeds;
    return {
      voucherCode,
      voucherApplied,
      voucherValidationIsSuccess,
      parsedVoucherValidationMessage,
      voucherPaymentType,
      isAnyGiftVoucherApplied,
    };
  },
  computed: {
    ...mapState("booking", ["creditCard"]),
    voucherValidationErrorType() {
      if (
        this.voucherPaymentType.ccPayment &&
        this.creditCard.number.length === 0
      ) {
        return "warning";
      }
      return "error";
    },
  },
  methods: {
    onKeydown(event) {
      // disable input space
      const eventCode = event.which || event.keyCode;
      const spaceKeyCode = 32;
      if (eventCode === spaceKeyCode) {
        event.preventDefault();
      }
    },
  },
};
</script>
<i18n>
{
  "en": {
    "useVoucher": "Use Voucher"
  },
  "th": {
    "useVoucher": "ใช้คูปอง"
  }
}
</i18n>
