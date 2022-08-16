<template>
  <div
    class="sticky w-full mx-auto bg-white shadow navbar-wrapper"
    :class="!openendModals ? ' z-48' : null"
    style="top: 0"
  >
    <OfflineBanner />
    <NewVersionBanner />
    <div class="flex items-center max-width hh-black lg:px-2">
      <span class="relative py-3 pl-2 pr-3 menu-dropdown-wrapper">
        <div v-if="isMobile" @click.prevent="openMenu">
          <HhImage
            :img="iconDropdown"
            :fallback="iconDropdown"
            is-local-image
            class="cursor-pointer"
            style="width: 20px; height: 20px"
          />
        </div>
        <div v-if="openDropdown" class="fixed bg-modal_dropdown">
          <div class="absolute hidden menu-dropdown-content">
            <ul class="px-4 text-sm whitespace-nowrap">
              <li class="py-2 border-b border-gray-400">
                <div class="relative">
                  <button
                    class="relative flex items-center py-3 text-sm border-none cursor-pointer lg:px-4"
                    @click="toggleDropdown"
                  >
                    <span class="mr-2">{{ $t("language") }}</span>
                    <div
                      class="flex items-center justify-center mr-2 uppercase"
                    >
                      <HhImage
                        :img="showFlagLanguange"
                        :fallback="showFlagLanguange"
                        is-local-image
                        style="width: 30px"
                      />
                      {{ lang }}
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      fill="currentColor"
                      class="inline-block transition-all icon-chevron-down"
                      :class="showDropdownLang ? 'rotate-180' : ''"
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
                  <div
                    v-if="showDropdownLang"
                    class="absolute right-0 z-50 shadow-md"
                  >
                    <div
                      class="px-2 text-xs rounded"
                      style="width: 90px; background: #fff"
                    >
                      <div
                        class="flex items-center justify-center pt-3 pb-2 uppercase cursor-pointer"
                        @click="changeLang(langNotSelect)"
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
              <li class="py-2 hover:font-black">
                <a
                  href="http://blog.hungryhub.com/hungryhub-for-business-eng/"
                  rel="noopener noreferrer"
                  >{{ $t("forBusiness") }}
                </a>
              </li>
              <li class="py-2 hover:font-black">
                <a href="https://blog.hungryhub.com" rel="noopener noreferrer">
                  {{ $t("blog") }}
                </a>
              </li>
              <li class="pt-2 pb-3 border-b border-gray-400 hover:font-black">
                <router-link :to="{ name: ROUTE_VOUCHER_PAGE }">
                  {{ $t("giftCard") }}
                </router-link>
              </li>
              <li class="py-2 hover:font-black">
                <a href="https://hungryhub.zendesk.com/hc/en-us">
                  {{ $t("help") }}
                </a>
              </li>
              <li class="py-2">
                {{ $t("downloadApp") }}
                <a
                  href="https://play.google.com/store/apps/details?id=com.hb.hungryhub"
                  rel="noopener noreferrer"
                >
                  <HhImage
                    :img="'@/assets/google-play-logo.png'"
                    :fallback="'@/assets/google-play-logo.png'"
                    is-local-image
                    style="width: 130px"
                    class="mt-4"
                  />
                </a>
                <a
                  href="https://apps.apple.com/th/app/hungry-hub-dining-offer-app/id879303325"
                  rel="noopener noreferrer"
                >
                  <HhImage
                    :img="'@/assets/app-store-logo.png'"
                    :fallback="'@/assets/app-store-logo.png'"
                    is-local-image
                    style="width: 130px"
                    class="mt-2"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </span>
      <router-link :to="{ name: ROUTE_HOME_PAGE }">
        <img
          class="logo"
          :src="logo"
          loading="lazy"
          alt="hungryhub logo"
          width="90"
          height="50"
        />
      </router-link>
      <!-- login / username section -->
      <div v-if="isMobile">
        <template v-if="isLoading">
          <div
            class="p-0 mx-2 my-0 overflow-hidden ph-item"
            style="width: 120px; height: 20px"
          >
            <div class="p-0 ph-col-12">
              <div class="ph-picture"></div>
            </div>
          </div>
        </template>
        <template v-else>
          <HHDropdown v-if="isUserSignedIn" id="username-dropdown">
            <template #activator="{ toggle }">
              <div
                class="relative px-2 py-3 text-sm bg-white border-none cursor-pointer lg:px-4"
                @click="toggle"
              >
                <HHTextTruncate
                  :text="name"
                  :max-length="10"
                  :can-read-more="false"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  fill="currentColor"
                  class="inline-block icon-chevron-down text-red-dark"
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
            </template>
            <template #content>
              <div
                class="px-4 text-xs rounded"
                style="width: 100px; background: #ebeaea"
              >
                <router-link
                  class="block pt-3 pb-2"
                  :to="{ name: ROUTE_PROFILE_HOME }"
                >
                  Profile
                </router-link>
                <button
                  class="block w-full pt-2 pb-3 text-left"
                  @click="doSignOut"
                >
                  Sign Out
                </button>
              </div>
            </template>
          </HHDropdown>
          <template v-else>
            <span class="px-4 py-3 text-sm">
              <button
                id="navbar-signin-register-button"
                class="px-2 bg-white border rounded-full cursor-pointer border-red-dark"
                @click="$emit('on-signin-clicked')"
              >
                {{ $t("signIn") }}
              </button>
            </span>
          </template>
        </template>
      </div>
      <div class="flex-auto"></div>
      <!-- desktop navigation -->
      <template v-if="isDesktop">
        <div v-if="!isSearchPage" class="flex-1 h-8">
          <RestaurantSearchSuggestion @on-result-clicked="resetSearchState">
            <template #default="{ handler }">
              <form
                class="flex searchbox-desktop"
                :class="[
                  isSearchBoxOpen ? 'searchbox-open' : '',
                  isShowFavButton ? 'with-fav-button' : '',
                ]"
                @submit.prevent="submitSearchForm"
              >
                <router-link
                  class="flex-shrink-0"
                  :class="!isShowFavButton ? ' hidden' : '  inline-block'"
                  :to="{ name: 'ProfileFavourite' }"
                >
                  <img
                    src="@/assets/icon-heart-red.png"
                    alt="icon favourite"
                    style="width: 28px"
                    loading="lazy"
                  />
                </router-link>

                <div class="flex w-full">
                  <input
                    v-model="query"
                    type="search"
                    :placeholder="$t('searchRestaurantPlaceHolder')"
                    name="search"
                    class="pb-2 truncate searchbox-input"
                    style="border-radius: 0; border-bottom: 1px solid #ababab"
                    required
                    @input="handler.inputHandler"
                    @focus="handler.focusHandler"
                  />
                  <input type="submit" class="rounded-full searchbox-submit" />
                  <img
                    class="inline searchbox-icon"
                    src="@/assets/icon-search-red-circle.png"
                    width="18"
                    height="18"
                    loading="lazy"
                    alt="search icon"
                    @click="isSearchBoxOpen = !isSearchBoxOpen"
                  />
                </div>
              </form>
            </template>
          </RestaurantSearchSuggestion>
        </div>
        <div v-if="isShowSelectCity" class="ml-2">
          <div v-if="!isConfigLoading" class="custom-dropdown">
            <select
              v-model="selectedCityId"
              class="border rounded-full border-red-dark"
            >
              <template v-for="cities in filteredCities">
                <option :key="cities.id" :value="cities.id" class="capitalize">
                  {{ cities.name }}
                </option>
              </template>
            </select>
          </div>
        </div>
        <div class="username-section">
          <template v-if="isLoading">
            <div
              class="p-0 mx-2 my-0 overflow-hidden ph-item"
              style="width: 120px; height: 20px"
            >
              <div class="p-0 ph-col-12">
                <div class="ph-picture"></div>
              </div>
            </div>
          </template>
          <template v-else>
            <router-link
              v-if="isUserSignedIn"
              :to="{ name: ROUTE_PROFILE_HOME }"
              class="px-4 py-2 bg-white border-none cursor-pointer"
            >
              {{ name }}
            </router-link>
            <template v-else>
              <span class="px-4 py-3">
                <button
                  id="navbar-login-button"
                  class="px-2 bg-white border rounded-full cursor-pointer border-red-dark"
                  @click="$emit('on-signin-clicked')"
                >
                  {{ $t("signInRegister") }}
                </button>
              </span>
            </template>
          </template>
        </div>
        <span v-if="isUserSignedIn" class="relative ml-5 mr-4">
          <a class="cursor-pointer text-red-dark" @click.prevent="doSignOut">{{
            $t("signOut")
          }}</a>
        </span>
      </template>
      <!-- mobile navigation -->
      <template v-else>
        <!-- search bar -->
        <div v-if="!isSearchPage" class="flex items-center justify-center">
          <router-link
            class="flex-shrink-0"
            :class="!isShowFavButton ? ' hidden' : '  inline-block'"
            :to="{ name: 'ProfileFavourite' }"
          >
            <img
              src="@/assets/icon-heart-red.png"
              alt="icon favourite"
              style="width: 25px"
              loading="lazy"
            />
          </router-link>
          <img
            src="@/assets/icon-search-red-circle.png"
            width="25"
            loading="lazy"
            height="25"
            alt="search icon"
            class="inline ml-2"
            @click="isSearchBoxOpen = !isSearchBoxOpen"
          />
        </div>
        <div
          v-if="!isConfigLoading && isShowSelectCity"
          class="text-sm custom-dropdown"
        >
          <select
            v-model="selectedCityId"
            class="border rounded-full border-red-dark"
          >
            <template v-for="cities in filteredCities">
              <option :key="cities.id" :value="cities.id" class="capitalize">
                {{ cities.name }}
              </option>
            </template>
          </select>
        </div>
      </template>
    </div>

    <!-- mobile full screen search -->
    <div
      v-if="isSearchBoxOpen && isMobile"
      class="absolute top-0 left-0 w-full h-full bg-white"
    >
      <RestaurantSearchSuggestion class="py-2">
        <template #default="{ handler }">
          <div class="relative flex justify-center">
            <div class="flex items-center flex-shrink-0 mx-2">
              <img
                src="@/assets/icon-close-red.png"
                width="12"
                loading="lazy"
                height="12"
                alt=""
                @click="isSearchBoxOpen = !isSearchBoxOpen"
              />
            </div>
            <form class="flex w-full" @submit.prevent="submitSearchForm">
              <input
                v-model="query"
                type="search"
                :placeholder="$t('searchRestaurantPlaceHolder')"
                name="search"
                class="truncate searchbox-input"
                required
                @input="handler.inputHandler"
              />
              <input type="submit" class="rounded-full searchbox-submit" />
              <img
                class="inline searchbox-icon"
                src="@/assets/icon-search-red-circle.png"
                width="18"
                height="18"
                loading="lazy"
                alt="search icon"
                @click="handler.submitHandler"
              />
            </form>
          </div>
        </template>
      </RestaurantSearchSuggestion>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
import { mapState, mapGetters } from "vuex";
import {
  selectedCityId,
  availableCities,
  isLoading as isConfigLoading,
} from "@/composable/selectCity";
import queryString from "query-string";
import RestaurantSearchSuggestion from "@/components/Shared/RestaurantSearchSuggestion";
import OfflineBanner from "@/components/Common/OfflineBanner";
import NewVersionBanner from "@/components/Common/NewVersionBanner.vue";
import HHDropdown from "@/components/Shared/HHDropdown";
import {
  ROUTE_HOME_PAGE,
  ROUTE_RESTAURANT_PAGE,
  ROUTE_PROFILE_HOME,
  ROUTE_VOUCHER_PAGE,
  ROUTE_SEARCH_PAGE,
} from "@/lib/constant";
import { state as favState } from "@/composable/favouriteRestaurant";
export default {
  name: "NavBar",
  components: {
    RestaurantSearchSuggestion,
    OfflineBanner,
    HHDropdown,
    NewVersionBanner,
  },
  setup() {
    const { favouriteRestaurantIds } = favState;
    let openDropdown = ref(false);
    let showDropdownLang = ref(false);

    return {
      selectedCityId,
      availableCities,
      isConfigLoading,
      favouriteRestaurantIds,
      ROUTE_VOUCHER_PAGE,
      ROUTE_PROFILE_HOME,
      ROUTE_HOME_PAGE,
      ROUTE_SEARCH_PAGE,
      openDropdown,
      showDropdownLang,
    };
  },
  data() {
    return {
      query: "",
      isSearchBoxOpen: false,
    };
  },
  computed: {
    ...mapState(["lang", "baseUrl"]),
    ...mapState("user", ["name", "isLoading"]),
    ...mapGetters(["baseUrlWithLang"]),
    ...mapGetters("user", ["isUserSignedIn"]),
    isShowFavButton() {
      return (
        this.favouriteRestaurantIds &&
        this.favouriteRestaurantIds.length >= 3 &&
        this.$route.path.includes("/profile") === false
      );
    },
    isSearchPage() {
      return this.$route.name === ROUTE_SEARCH_PAGE;
    },
    isShowSelectCity() {
      return this.$route.name === ROUTE_HOME_PAGE;
    },
    logo() {
      return this.isDesktop || this.isTablet
        ? require("@/assets/logo-new-full.png")
        : require("@/assets/logo-new-full-alternate.png");
    },
    openendModals() {
      return this.$vfm.openedModals.length;
    },
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
    iconDropdown() {
      if (this.openDropdown) {
        return "@assets/icon-close-soft.png";
      }

      return "@/assets/hamburger.png";
    },
    filteredCities() {
      return this.availableCities.filter((cities) => cities.id.length > 0);
    },
  },
  mounted() {
    this.defaultLang();
  },
  methods: {
    resetSearchState() {
      this.query = "";
      this.isSearchBoxOpen = false;
    },
    selectCity(event, callback) {
      this.selectedCityId = event.target.value;
      callback();
    },
    submitSearchForm() {
      if (this.query.length > 0) {
        window.location = `/restaurants/search?name_like=${this.query}&locale=${this.lang}`;
      }
    },
    async changeLang(lang) {
      if (this.lang !== lang) {
        const allowChangeLang = await this.$store.dispatch("changeLang", lang);
        if (allowChangeLang) {
          if (this.isUserSignedIn) {
            await this.$store.dispatch("user/updateProfile", { lang: lang });
          }
          this.$i18nInstance.locale = lang;
          this.$dayjs.locale(lang);
          this.$veeValidateLocalize(lang);
          const parsedQuery = queryString.parse(window.location.search);
          parsedQuery.locale = lang;
          const queryStringify = queryString.stringify(parsedQuery);
          window.location.search = queryStringify;
        }
      }
    },
    doSignOut() {
      this.$store.dispatch("user/doSignOut");
      this.$alert.success("Signed Out Successfully");
      window.location.href = this.$router.resolve({
        name: ROUTE_RESTAURANT_PAGE,
      }).href;
    },
    openMenu() {
      this.openDropdown = !this.openDropdown;
      const el = document.body;
      if (this.openDropdown) {
        el.classList.add("fixed");
      } else {
        el.classList.remove("fixed");
      }
    },
    toggleDropdown() {
      this.showDropdownLang = !this.showDropdownLang;
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
<style lang="scss">
// custom tippy theme
.tippy-box[data-theme~="navbar-tooltip"] {
  background-color: #ebeaea;
  @apply text-sm text-red-dark;
}
.menu-dropdown-content {
  background: #ebeaea;
  // @apply absolute hidden;
  @apply block;
  @screen lg {
    top: 42px;
    left: -60px;
  }
  top: 0px;
  left: 0px;
}

.bg-modal_dropdown {
  top: 42px;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
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
