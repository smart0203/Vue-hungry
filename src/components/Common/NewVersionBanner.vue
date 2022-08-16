<template>
  <div
    v-if="isShow"
    class="flex justify-center w-full py-1 text-center text-white bg-red-dark"
  >
    {{ $t("newVersionAvailable") }}.
    <button class="ml-2 underline" @click="refresh">
      {{ $t("clickHereToRefresh") }}
    </button>
  </div>
</template>

<script>
import { initFirebaseDatabase, firebaseDatabase } from "@/lib/firebaseDatabase";
import { ref as firebaseRef, onValue } from "firebase/database";
import { ref } from "@vue/composition-api";
export default {
  name: "NewVersionBanner",
  setup() {
    return {
      newVersion: ref(0),
      currentVersion: ref(0),
      isShow: ref(false),
    };
  },
  mounted() {
    this.checkNewVersion();
  },
  methods: {
    async checkNewVersion() {
      const isInitSuccess = await initFirebaseDatabase();
      if (isInitSuccess) {
        const firebaseDb = firebaseRef(
          firebaseDatabase.value,
          "/versionchecker/web/version"
        );
        onValue(firebaseDb, (snapshot) => {
          const app = document.getElementById("app");
          this.currentVersion = app.getAttribute("app-version");
          this.newVersion = snapshot.val();
          this.compareVersion();
        });
      }
    },
    compareVersion() {
      const newVersionNumber =
        typeof this.newVersion === "string"
          ? parseInt(this.newVersion.replace(/\./g, ""))
          : this.newVersion;
      const currentVersionNumber =
        typeof this.currentVersion === "string"
          ? parseInt(this.currentVersion.replace(/\./g, ""))
          : this.currentVersion;
      if (newVersionNumber > currentVersionNumber) {
        this.isShow = true;
        return;
      }
      this.isShow = false;
    },
    refresh() {
      window.location.reload();
    },
  },
};
</script>
<i18n>
{
  "en": {
    "newVersionAvailable": "New version available!",
    "clickHereToRefresh": "Click here to refresh"
  },
  "th": {
    "newVersionAvailable": "เวอร์ชั่นใหม่มาแล้ว!",
    "clickHereToRefresh": "กดเพื่อรีเฟรชได้เลย"
  }
}
</i18n>
