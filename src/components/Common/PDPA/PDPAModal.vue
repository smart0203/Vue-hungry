<template>
  <HHModal
    v-model="isModalShowing"
    :content-class="'w-10/12 lg:w-6/12 p-4 bg-white max-h-[80%] overflow-y-scroll lg:max-h-auto lg:overflow-y-auto'"
    :is-show-close-button="true"
    :fit-parentt="true"
    @on-click-outside="$emit('on-closed')"
    @on-closed="$emit('on-closed')"
    @on-cancel="$emit('on-closed')"
  >
    <div class="">
      <div class="text-lg font-bold">Cookies setting</div>
      <div class="items-center py-3">
        <span>{{ $t("title") }}</span>
        <a
          class="ml-1 text-blue-400 underline"
          :href="pdpaLink"
          target="_blank"
          >{{ $t("privacyPolicy") }}</a
        >
      </div>

      <div class="px-3 mt-6">
        <div class="cookies-type-list">
          <div class="list-header">
            <span class="header-name">Strictly Necessary Cookies</span>
            <input
              type="checkbox"
              class="bg-gray-400 big-checkbox"
              disabled
              checked
            />
          </div>
        </div>

        <div class="cookies-type-list">
          <div class="list-header">
            <span class="header-name">Advertising Cookies</span>
            <input
              v-model="acceptCookies.advertising"
              type="checkbox"
              class="red-checkbox big-checkbox"
            />
          </div>
        </div>

        <div class="cookies-type-list">
          <div class="list-header">
            <span class="header-name">Functionality Cookies</span>
            <input
              v-model="acceptCookies.functionaly"
              type="checkbox"
              class="red-checkbox big-checkbox"
            />
          </div>
        </div>
      </div>

      <div class="flex flex-col mx-2 mt-8 md:flex-row">
        <button
          class="w-full py-2 mb-3 mr-2 font-bold border border-red-dark text-red-dark"
          @click="acceptCookiesConsent"
        >
          Save My Preferences
        </button>
        <button
          class="w-full py-2 mb-3 font-bold text-white border bg-red-dark border-red-dark"
          @click="acceptCookiesConsent('all')"
        >
          Accept All
        </button>
      </div>
    </div>
  </HHModal>
</template>

<script>
import HHModal from "@/components/Shared/HHModal.vue";
import { PORTAL_FOR_MODAL_SELECTOR } from "@/lib/constant";
import {
  acceptAdvertisingCookies,
  acceptFunctionalityCookies,
  isAcceptAdvertisingCookies,
  isAcceptFunctionalityCookies,
  enablePixelScripts,
  toggleGoogleAnalytic,
} from "./pdpa";

const advertisingCookie = isAcceptAdvertisingCookies();
const functionalityCookie = isAcceptFunctionalityCookies();

export default {
  components: {
    HHModal,
  },
  props: {
    isShown: {
      type: Boolean,
      default: false,
    },
    pdpaLink: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      PORTAL_FOR_MODAL_SELECTOR,
      isModalShowing: false,
      acceptCookies: {
        advertising:
          advertisingCookie === undefined || advertisingCookie === "false"
            ? false
            : true,
        functionaly:
          functionalityCookie === undefined || functionalityCookie === "false"
            ? false
            : true,
      },
    };
  },
  watch: {
    isShown(val) {
      this.isModalShowing = val;
    },
  },
  methods: {
    acceptCookiesConsent(param) {
      if (param === "all") {
        this.acceptCookies.advertising = true;
        this.acceptCookies.functionaly = true;
      }
      acceptAdvertisingCookies(this.acceptCookies.advertising);
      acceptFunctionalityCookies(this.acceptCookies.functionaly);
      toggleGoogleAnalytic("UA-66127738-1", this.acceptCookies.advertising);
      if (this.acceptCookies.advertising) {
        enablePixelScripts();
      }
      this.isModalShowing = false;
    },
  },
  i18n: {
    messages: {
      en: {
        title: "You can read more on how we use Cookies in our",
        privacyPolicy: "Privacy Policy",
      },
      th: {
        title:
          "คุณสามารถอ่านรายละเอียดเกี่ยวกับวิธีการใช้คุ้กกี้ของเราเพิ่มเติมได้ที่",
        privacyPolicy: "นโยบายความเป็นส่วนตัว",
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.cookies-type-list {
  @apply py-3 border-t border-gray-400;

  .list-header {
    @apply flex justify-between;
  }
  .header-name {
    @apply font-bold;
  }

  .list-body {
    @apply mt-3;
  }
}
</style>
