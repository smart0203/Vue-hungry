<template>
  <div>
    <ProfileMobile v-if="isMobile" />
    <ProfileDesktop v-else />
  </div>
</template>

<script>
import { state } from "@/components/Page Component/Profile/profile";
import useLazyImport from "@/composable/useLazyImport";
import {
  privilegeLevel,
  getPrivilegeLevel,
} from "@/composable/useUserPrivileges";

export default {
  name: "ProfilePage",
  components: {
    ProfileMobile: () =>
      useLazyImport(() =>
        import("@/components/Page Component/Profile/ProfileMobile")
      ),
    ProfileDesktop: () =>
      useLazyImport(() =>
        import("@/components/Page Component/Profile/ProfileDesktop")
      ),
  },
  setup() {
    const { name } = state;
    return {
      name,
      privilegeLevel,
    };
  },
  mounted() {
    getPrivilegeLevel();
  },
  metaInfo() {
    return {
      title: `My Profile - ${this.name}`,
    };
  },
};
</script>

<style lang="scss">
.profile-content-min-height {
  min-height: 500px;
}
</style>
