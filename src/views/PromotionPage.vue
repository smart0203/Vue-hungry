<template>
  <div class="promotion-page">
    <div
      class="flex items-start justify-center min-h-screen capitalize max-width lg:mt-10"
    >
      <div v-if="isLoading" class="flex items-center mt-32">
        <div class="mr-2 loader"></div>
        {{ $t("pleaseWait") }}
      </div>
      <div
        v-else
        class="flex flex-col flex-wrap justify-center my-10 lg:flex-row"
      >
        <a
          v-for="promo in promos"
          :key="promo.id"
          :href="promo.targetUrl"
          target="_blank"
          rel="noopener"
          class="block px-2 mb-4 lg:w-1/3 promo-item"
        >
          <div v-if="isLoading" class="h-full mr-2 bg-gray-300"></div>
          <HhImage
            v-else
            class="object-cover"
            :img="parseImg(promo)"
            alt="promotion item"
            :desktop-width="360"
            height="100%"
            width="100%"
            mobile-width="full-screen"
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { getBanners } from "@/services/common";
import qs from "qs";
import humps from "humps";

function changeLocale(url, lang) {
  if (typeof url === "string") {
    const splitedUrl = url.split("?");
    if (splitedUrl.length > 1) {
      const baseUrl = splitedUrl[0];
      const queryString = splitedUrl[1];
      const queryStringObj = humps.camelizeKeys(
        qs.parse(queryString, {
          ignoreQueryPrefix: true,
        })
      );
      if (queryStringObj.locale) {
        queryStringObj.locale = lang;
      }
      const stringifyQueryStringObj = qs.stringify(queryStringObj);
      return `${baseUrl}?${stringifyQueryStringObj}`;
    }
    return false;
  }
  return false;
}

export default {
  data() {
    return {
      promos: [],
      isLoading: true,
    };
  },
  computed: {
    lang() {
      return this.$store.state.lang;
    },
  },
  mounted() {
    this.initDummyPromos();
    this.getPromos();
  },
  methods: {
    initDummyPromos() {
      for (let index = 0; index < 10; index++) {
        this.promos.push({
          id: index,
          val: "",
        });
      }
    },
    parseImg(promo) {
      if (Array.isArray(promo.mobileVersions) && promo.mobileVersions.length) {
        return promo.mobileVersions[0].url;
      }
      return "";
    },
    async getPromos() {
      this.isLoading = true;
      try {
        const response = await getBanners();
        if (response.isSuccess) {
          const promotionOnly = response.data.filter((promotion) => {
            if (promotion.locations && promotion.locations.length) {
              const isLocationPromotion = promotion.locations.filter(
                (location) => location.includes("promotions")
              );
              return isLocationPromotion.length > 0 ? true : false;
            }
            return false;
          });
          this.promos = promotionOnly.map((promo) => {
            const urlWithNewLang = changeLocale(promo.targetUrl, this.lang);
            promo.targetUrl =
              urlWithNewLang === false ? promo.targetUrl : urlWithNewLang;
            return promo;
          });
          this.isLoading = false;
        } else {
          this.$alert.error("failed get promotion list");
        }
      } catch (err) {
        this.$rollbar.error(err);
      }
    },
  },
};
</script>
