<template>
  <modal
    name="ask-otp-modal"
    :width="modalWidth"
    :height="modalHeight"
    adaptive
  >
    <div class="h-full">
      <div class="relative h-full px-6 py-6 text-center text-white bg-red-dark">
        <img
          class="absolute flex-shrink-0 ml-auto cursor-pointer"
          src="@/assets/icon-close-white.png"
          alt="close icon"
           loading="lazy"
          style="width: 15px; height: 15px; top: 10px; right: 10px"
          @click="$modal.hide('ask-otp-modal')"
        />
        <div class="my-8">
          <h1
            class="text-xl font-black"
            v-html="$t('lastStepVerification')"
          ></h1>
          <div class="mt-5 mb-3">
            <div class="text-sm">{{ $t("weHaveSentVeriviation") }}</div>
            <div>{{ phoneNumber }}</div>
          </div>
          <button class="pb-1 mb-4 text-sm underline">
            {{ $t("changePhoneNumber") }}
          </button>
          <div
            class="flex justify-between px-4 py-1 mx-auto font-black text-black input-otp-wrapper"
          >
            <input
              id="input-box-1"
              class="text-2xl font-black text-center"
              type="number"
              maxlength="1"
              minlength="1"
              min="0"
              max="9"
              placeholder="-"
              @keyup="onKeyUpEvent(1, $event)"
            />
            <input
              id="input-box-2"
              class="text-2xl font-black text-center"
              type="number"
              maxlength="1"
              minlength="1"
              min="0"
              max="9"
              placeholder="-"
              @keyup="onKeyUpEvent(2, $event)"
            />
            <input
              id="input-box-3"
              class="text-2xl font-black text-center"
              type="number"
              maxlength="1"
              minlength="1"
              min="0"
              max="9"
              placeholder="-"
              @keyup="onKeyUpEvent(3, $event)"
            />
            <input
              id="input-box-4"
              class="text-2xl font-black text-center"
              type="number"
              maxlength="1"
              minlength="1"
              min="0"
              max="9"
              placeholder="-"
              @keyup="onKeyUpEvent(4, $event)"
            />
          </div>

          <button class="pb-1 mt-4 text-sm underline">
            {{ $t("resendCode") }}
          </button>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
export default {
  props: {
    phoneNumber: {
      type: Number,
      required: true,
    },
  },
  computed: {
    modalWidth() {
      return this.isDesktop ? "700px" : "90%";
    },
    modalHeight() {
      return this.isDesktop ? "350px" : "95%";
    },
  },
  methods: {
    getCodeBoxElement(index) {
      const element = document.getElementById(`input-box-${index}`);
      return element;
    },
    onKeyUpEvent(index, event) {
      const eventCode = event.which || event.keyCode;
      if (this.getCodeBoxElement(index).value.length === 1) {
        if (index !== 4) {
          this.getCodeBoxElement(index + 1).focus();
        } else {
          this.getCodeBoxElement(index).blur();
        }
      }
      if (eventCode === 8 && index !== 1) {
        this.getCodeBoxElement(index - 1).focus();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.input-otp-wrapper {
  width: 170px;
  @screen lg {
    width: 200px;
  }
  @apply rounded-full border bg-white;
}
</style>
<i18n>
{
  "en": {
    "lastStepVerification": "Last Step <br> Verifying your number!",
    "weHaveSentVeriviation": "We have sent verification code on your number",
    "resendCode": "Resend Code",
    "changePhoneNumber": "Change phone number ?"
  },
  "th": {
    "lastStepVerification": "ขั้นตอนสุดท้ายยืนยันหมายเลขโทรศัพท์ของคุณ",
    "weHaveSentVeriviation": "เราได้ส่งรหัสยืนยันไปยังหมายเลขของคุณแล้ว",
    "resendCode": "ส่งรหัสอีกครั้ง",
    "changePhoneNumber": "เปลี่ยนหมายเลขโทรศัพท์ ?"
  }
}
</i18n>
