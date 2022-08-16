<template>
  <div v-if="message" class="w-full py-1 text-center text-white bg-red-dark">
    {{ message }}
  </div>
</template>

<script>
import {
  isAllowLocalStorage,
  isAllowCookie,
} from "@/helper/storagePermissionHelper";
import isOnline from "@/helper/isOnlineHelper";
export default {
  setup() {
    return {
      isOnline,
    };
  },
  computed: {
    message() {
      if (this.isOnline == false) {
        return this.$t("noInternet");
      } else if (isAllowLocalStorage() === false || isAllowCookie() === false) {
        return this.$t("allowCookie");
      }
      return "";
    },
  },
};
</script>
<i18n>
{
  "en": {
    "allowCookie": "To perform better and correctly please allow to accept cookies in your browser settings",
    "noInternet": "Please check your internet connection"
  },
  "th": {
    "allowCookie": "โปรดอนุญาตให้ใช้คุกกี้เพื่อพัฒนาและปรับปรุง ให้ระบบทำงานได้ถูกต้องและดียิ่งขึ้น",
    "noInternet": "โปรดเช็คการเชื่อมต่ออินเทอร์เน็ตของคุณ"
  }
}
</i18n>
