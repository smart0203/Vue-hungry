<template>
  <div>
    <div
      v-if="isShow"
      class="fixed bottom-0 left-0 w-full text-white bg-black pdpa-container"
    >
      <div
        class="flex flex-col items-center w-11/12 py-4 pr-6 mx-auto text-sm lg:w-9/12 lg:flex-row lg:text-sm lg:py-6 lg:px-0"
      >
        <div class="flex w-full">
          <span>
            {{ $t("content") }}
            <a
              target="_blank"
              class="ml-1 text-blue-400 underline"
              :href="pdpaLink"
              >{{ $t("privacyPolicy") }}
            </a>
          </span>
        </div>
        <div class="flex flex-row w-full mt-4 lg:w-auto lg:mt-0">
          <button
            class="mr-4 font-black text-center text-white bg-transparent border border-white rounded-full learn-more-btn"
            @click="togglePDPAModal(true)"
          >
            {{ $t("cookieSetting") }}
          </button>
          <button
            class="font-black text-center text-white bg-blue-500 border-blue-500 rounded-full accept-btn"
            @click="acceptAllCookie"
          >
            {{ $t("accept") }}
          </button>
        </div>
      </div>
    </div>

    <PDPAModal
      :is-shown="isShowPDPAModal"
      :pdpa-link="pdpaLink"
      @on-closed="togglePDPAModal(false)"
    ></PDPAModal>
  </div>
</template>

<script>
import PDPAModal from "./PDPAModal.vue";
import {
  acceptAdvertisingCookies,
  acceptFunctionalityCookies,
  isAcceptAdvertisingCookies,
  isAcceptFunctionalityCookies,
  removePreviousPDPACookie,
} from "./pdpa";
export default {
  components: {
    PDPAModal,
  },
  data() {
    return {
      isShow: true,
      isShowPDPAModal: false,
      pdpaLink: "https://hungryhub.zendesk.com/hc/en-us/articles/360009040074",
    };
  },
  watch: {
    isShowPDPAModal() {
      this.checkPDPA();
    },
  },
  mounted() {
    this.checkPDPA();
  },
  methods: {
    togglePDPAModal(show) {
      this.isShowPDPAModal = show;
    },
    checkPDPA() {
      // remmove previous PDPA cookie
      removePreviousPDPACookie();
      if (
        isAcceptAdvertisingCookies() != undefined &&
        isAcceptFunctionalityCookies() != undefined
      ) {
        this.isShow = false;
      }
    },
    acceptAllCookie() {
      acceptAdvertisingCookies(true);
      acceptFunctionalityCookies(true);
      this.isShow = false;
    },
  },
};
</script>
<i18n>
{
  "en": {
    "content": "We use cookies to improve your experience and performance on our website. You can manage your preferences by clicking 'Cookies setting' ",
    "privacyPolicy": "Privacy Policy",
    "cookieSetting": "Cookies Setting",
    "accept": "Accept All"
  },
  "th": {
    "content": "เราใช้คุกกี้เพื่อเพิ่มประสิทธิภาพ และประสบการณ์ที่ดีในการใช้งานเว็บไซต์ คุณสามารถเลือกตั้งค่าความยินยอมการใช้คุกกี้ได้ โดยคลิก 'การตั้งค่าคุกกี้' ",
    "privacyPolicy": "นโยบายความเป็นส่วนตัว",
    "cookieSetting": "การตั้งค่าคุกกี้",
    "accept": "ยอมรับ"
  }
}
</i18n>
