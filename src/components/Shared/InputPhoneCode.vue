<template>
  <input :id="phoneInputId" class="input-phone-code" type="text" />
</template>

<script>
import intlTelInputLib from "@/lib/intlTelInput";
import { nanoid } from "nanoid";
export default {
  name: "InputPhoneCode",
  data() {
    return {
      phoneInputId: `input-phone-code-${nanoid(5)}`,
      advPhoneInput: "",
      phoneCodeInput: "",
    };
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.initInputTelephone();
      }, 300);
    });
  },
  methods: {
    async initInputTelephone() {
      try {
        const inputTel = await intlTelInputLib();
        const el = document.getElementById(this.phoneInputId);
        if (!el) {
          return;
        }
        this.advPhoneInput = inputTel(el, {
          initialCountry: "th",
          separateDialCode: false,
        });
        el.style.cssText = "padding-left: 45px";

        this.phoneCodeInput = `+${
          this.advPhoneInput.getSelectedCountryData().dialCode
        }`;
        this.$emit("on-phone-code-change", this.phoneCodeInput);

        el.addEventListener("countrychange", () => {
          this.phoneCodeInput = `+${
            this.advPhoneInput.getSelectedCountryData().dialCode
          }`;
          this.$emit("on-phone-code-change", this.phoneCodeInput);
        });
      } catch (err) {
        this.$rollbar.error(err);
      }
    },
  },
};
</script>
<style scoped>
.input-phone-code {
  width: 45px !important;
  padding-left: 0px !important;
}
</style>
