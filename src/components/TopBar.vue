<template>
  <div v-if="isDesktop" class="w-full max-auto bg-gray">
    <ul class="flex items-center max-width justify-end px-3">
      <li class="">
        <a
          href="https://business.hungryhub.com/"
          class="text-sm px-2 lg:px-4 flex items-center text-black"
        >
          {{ $t("forBusiness") }}
        </a>
      </li>
      <li class="">
        <router-link
          :to="{ name: ROUTE_VOUCHER_PAGE }"
          class="text-sm px-2 lg:px-4 flex items-center text-black"
        >
          {{ $t("giftCard") }}
        </router-link>
      </li>
      <li class="">
        <a
          href="https://blog.hungryhub.com/"
          class="text-sm px-2 lg:px-4 flex items-center text-black"
        >
          {{ $t("blog") }}
        </a>
      </li>
      <li class="">
        <div class="relative">
          <div
            class="relative flex items-center px-2 text-sm border-none cursor-pointer lg:px-4 flex items-center"
            @click="toggleDropdown('download')"
          >
            <div class="mr-2 text-black">
              {{ $t("downloadApp") }}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              fill="currentColor"
              class="inline-block icon-chevron-down transition-all"
              :class="isDownloadDropdownShow ? 'rotate-180' : ''"
              viewBox="0 0 16 16"
              stroke="currentColor"
            >
              <path
                fill-rule="evenodd"
                stroke-width="2"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </div>
          <div
            v-if="isDownloadDropdownShow"
            class="absolute shadow-md z-50 left-0"
          >
            <div
              class="px-4 text-xs rounded"
              style="width: 170px; background: #fff"
            >
              <a
                href="https://play.google.com/store/apps/details?id=com.hb.hungryhub"
                class="block mb-2"
              >
                <HhImage
                  :img="'@/assets/google-play-logo.png'"
                  :fallback="'@/assets/google-play-logo.png'"
                  is-local-image
                  class="mt-2"
                />
              </a>
              <a
                href="https://apps.apple.com/th/app/hungry-hub-dining-offer-app/id879303325"
                class="block"
              >
                <HhImage
                  :img="'@/assets/app-store-logo.png'"
                  :fallback="'@/assets/app-store-logo.png'"
                  is-local-image
                  class="mt-2"
                />
              </a>
            </div>
          </div>
        </div>
      </li>
      <li class="">
        <a
          href="https://hungryhub.zendesk.com/hc/en-us"
          class="text-sm px-2 lg:px-4 flex items-center text-black"
        >
          {{ $t("help") }}
        </a>
      </li>
      <li class="">
        <div class="relative">
          <button
            class="relative flex items-center px-2 text-sm border-none cursor-pointer lg:px-4"
            @click="toggleDropdown('lang')"
          >
            <div
              class="mr-2 uppercase flex items-center justify-center text-black"
            >
              <HhImage
                :img="showFlagLanguange"
                :fallback="showFlagLanguange"
                is-local-image
                class="mr-2"
                style="width: 30px"
              />
              {{ lang }}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              fill="currentColor"
              class="inline-block icon-chevron-down transition-all"
              :class="isLangDropdownShow ? 'rotate-180' : ''"
              viewBox="0 0 16 16"
              stroke="currentColor"
            >
              <path
                fill-rule="evenodd"
                stroke-width="2"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </button>
          <div v-if="isLangDropdownShow" class="absolute shadow-md z-50 left-0">
            <div
              class="px-2 text-xs rounded"
              style="width: 90px; background: #fff"
            >
              <div
                class="flex items-center justify-center pt-3 pb-2 uppercase cursor-pointer"
                @click="changeLang"
              >
                <HhImage
                  :img="listDropdownLang.icon"
                  :fallback="listDropdownLang.icon"
                  is-local-image
                  class="mr-2"
                  style="width: 20px"
                />
                {{ listDropdownLang.title }}
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
import { mapState, mapGetters } from "vuex";
import { ROUTE_VOUCHER_PAGE } from "@/lib/constant";
import queryString from "query-string";

export default {
  name: "TopBar",
  setup() {
    let isDownloadDropdownShow = ref(false);
    let isLangDropdownShow = ref(false);

    return {
      isDownloadDropdownShow,
      isLangDropdownShow,
      ROUTE_VOUCHER_PAGE,
    };
  },
  computed: {
    ...mapState(["lang", "baseUrl"]),
    ...mapGetters("user", ["isUserSignedIn"]),
    showFlagLanguange() {
      let flagIcon = "";
      if (this.lang === "th") {
        flagIcon = "@/assets/flag-th.png";
      } else if (this.lang === "en") {
        flagIcon = "@/assets/flag-en.png";
      }
      return flagIcon;
    },
    listDropdownLang() {
      let lang = {};
      if (this.lang === "th") {
        lang = {
          icon: "@/assets/flag-en.png",
          title: "EN",
        };
      } else if (this.lang === "en") {
        lang = {
          icon: "@/assets/flag-th.png",
          title: "TH",
        };
      }
      return lang;
    },
  },
  mounted() {
    this.defaultLang();
  },
  methods: {
    toggleDropdown(value) {
      if (value === "download") {
        this.isDownloadDropdownShow = !this.isDownloadDropdownShow;
      } else if (value === "lang") {
        this.isLangDropdownShow = !this.isLangDropdownShow;
      }
    },
    changeLang() {
      if (this.lang !== this.langNotSelect) {
        const allowChangeLang = this.$store.dispatch(
          "changeLang",
          this.langNotSelect
        );
        if (allowChangeLang) {
          if (this.isUserSignedIn) {
            this.$store.dispatch("user/updateProfile", {
              lang: this.langNotSelect,
            });
          }
          this.$i18nInstance.locale = this.langNotSelect;
          this.$dayjs.locale(this.langNotSelect);
          this.$veeValidateLocalize(this.langNotSelect);
          const parsedQuery = queryString.parse(window.location.search);
          parsedQuery.locale = this.langNotSelect;
          const queryStringify = queryString.stringify(parsedQuery);
          window.location.search = queryStringify;
          this.defaultLang();
          this.isLangDropdownShow = false;
        }
      }
    },
    defaultLang() {
      if (this.lang === "en") {
        this.langNotSelect = "th";
      } else if (this.lang === "th") {
        this.langNotSelect = "en";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.bg-gray {
  background-color: rgb(234, 234, 234);
}
</style>

<i18n>
{
  "en": {
    "seeAllRestaurant": "See All Restaurants",
    "allDineInRestaurant": "All Dine In Restaurants",
    "allDeliveryRestaurant": "All Delivery Restaurants",
    "support": "Support",
    "groupDining": "Group Dining",
    "downloadApp": "Download App",
    "promotion": "Promotions",
    "giftCard": "Gift Card",
    "forBusiness": "For Business",
    "forRestaurants": "For Restaurants",
    "signIn": "Sign In",
    "register": "Register",
    "signOut": "Sign out",
    "signInRegister": "Sign In / Register",
    "blog": "Blog",
    "help" : "Help",
    "language" : "Language"
  },
  "th": {
    "seeAllRestaurant": "ดูร้านอาหารทั้งหมด",
    "allDineInRestaurant": "รวมร้านอาหารทั้งหมด",
    "allDeliveryRestaurant": "รวมร้านที่ส่งเดลิเวอรี่",
    "support": "ช่วยเหลือ",
    "groupDining": "จองโต๊ะกลุ่มใหญ่",
    "downloadApp": "ดาวน์โหลดแอปฯ",
    "promotion": "โปรโมชั่น",
    "giftCard": "กิ๊ฟการ์ด",
    "forBusiness": "สำหรับธุรกิจ",
    "forRestaurants": "ร้านอาหารสนใจเข้าร่วม",
    "signIn": "เข้าสู่ระบบ",
    "register": "ลงทะเบียน",
    "signOut": "ออกจากระบบ",
    "signInRegister": "เข้าสู่ระบบ / ลงทะเบียน",
    "blog": "บล็อก",
    "help": "ช่วยเหลือ",
    "language" : "ภาษา"
  }
}
</i18n>
