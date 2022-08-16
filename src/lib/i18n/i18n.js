import Vue from "vue";
import VueI18n from "vue-i18n";
import th from "./th.js";
import en from "./en.js";
Vue.use(VueI18n);

const loadedLanguages = ["th"];
const i18n = new VueI18n({
  locale: "th",
  fallbackLocale: "th",
  silentTranslationWarn: true,
  messages: {
    th: th,
    en: en,
  },
});

async function loadENLocale() {
  if (loadedLanguages.includes("en") === false) {
    try {
      const en = await import(/* webpackChunkName: "ENLangChunk" */ "./en.js");
      i18n.setLocaleMessage("en", en.default);
      loadedLanguages.push("en");
      return {
        isSuccess: true,
      };
    } catch (err) {
      return {
        isSuccess: false,
        error: err,
      };
    }
  }
  return {
    isSuccess: true,
  };
}

export { i18n, loadENLocale };
