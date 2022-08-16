<template>
  <div class="w-full">
    <div
      class="flex items-center w-full py-2 mb-1 border-b border-gray-500 input-with-icon have-icon-left"
      stlye="padding-left: 45px"
    >
      <span class="flex items-center w-full mr-2 text-lg icon icon-left">
        <div>
          <img
            src="@/assets/icon-phone-red.png"
            width="18"
            height="18"
            alt="phone icon"
            loading="lazy"
          />
        </div>
      </span>
      <div class="relative flex items-center w-full ml-6">
        <div class="flex-grow-0">
          <InputPhoneCode @on-phone-code-change="onPhoneCodeChange" />
        </div>
        <input
          v-model="phone"
          name="phone"
          autocomplete="tel-local"
          class="absolute flex flex-auto w-full text-sm bg-transparent border-none input lg:text-base"
          style="
            border-top: 0;
            border-right: 0;
            border-left: 0;
            left: 0px;
            top: 0px;
            padding-left: 45px;
          "
          :placeholder="capitalize($t('phone'))"
          type="number"
        />
      </div>
    </div>
    <div v-if="isInvalid" class="text-sm text-red-dark">
      {{ $t("leadingZeroPhone") }}
    </div>
  </div>
</template>

<script>
import capitalize from "lodash-es/capitalize";
import InputPhoneCode from "./InputPhoneCode.vue";
import { isLeadingZero, removeLeadingZero } from "@/helper/phoneNumber";

export default {
  name: "InputPhone",
  components: {
    InputPhoneCode,
  },
  data() {
    return {
      phone: "",
      isInvalid: false,
    };
  },
  watch: {
    phone() {
      this.validate();
    },
  },
  methods: {
    capitalize,
    onPhoneCodeChange(phoneCode) {
      this.$emit("on-phone-code-change", phoneCode);
    },
    validate() {
      if (!this.phone.length) {
        return;
      }
      if (isLeadingZero(this.phone) === false) {
        this.isInvalid = true;
        return;
      }
      this.$emit("on-phone-change", removeLeadingZero(this.phone));
      this.isInvalid = false;
    },
  },
};
</script>
