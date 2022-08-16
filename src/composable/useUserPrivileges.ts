import { ref, computed } from "@vue/composition-api";
import { getLoyaltyLevel } from "@/services/user";
import * as alert from "@/lib/alert";
import rollbar from "@/lib/rollbar";
import { nanoid } from "nanoid";
import { UserPrivilege } from "@/types/UserPrivilege";
import store from "@/store/index";
import { isDesktop } from "@/helper/screenSizeHelper";
import imageMutator from "@/services/imageMutator";
import { rebuildUrl } from "@/helper/urlHelper";

// @ts-ignore
const userStore = computed(() => {
  // @ts-ignore
  return store.state.user;
});
const isLoading = ref(false);
const privilegeLevel = ref<UserPrivilege[]>([]);
const currentPrivilegeLevel = computed(() => {
  const filterIndex = privilegeLevel.value.findIndex((level) => {
    // @ts-ignore
    return level.id == userStore.value.loyaltyLevelId;
  });
  return filterIndex !== -1
    ? privilegeLevel.value[filterIndex]
    : ({} as UserPrivilege);
});
const nextPrivilegeLevel = computed(() => {
  const nextLevel = currentPrivilegeLevel.value.rank + 1;
  return privilegeLevel.value[nextLevel] || ({} as UserPrivilege);
});
const prevPrivilegeLevel = computed(() => {
  const prevLevel = currentPrivilegeLevel.value.rank - 1;
  return privilegeLevel.value[prevLevel] || ({} as UserPrivilege);
});
const nextPrivilegeLevelMinimumReservation = computed(() => {
  if (!nextPrivilegeLevel.value.id) {
    return null;
  }
  return isRegainingPrivilegeLevel.value
    ? nextPrivilegeLevel.value.regain.totalReservations
    : nextPrivilegeLevel.value.qualification.totalReservations;
});
// @ts-ignore
const nextPrivilegeLevelMinimumSpend = computed(() => {
  if (!nextPrivilegeLevel.value.id) {
    return null;
  }
  return isRegainingPrivilegeLevel.value
    ? nextPrivilegeLevel.value.regain.totalSpend
    : nextPrivilegeLevel.value.qualification.totalSpend;
});
const isOnMaxPrivilegeLevel = computed(() => {
  if (!privilegeLevel.value.length) {
    return false;
  }
  return (
    currentPrivilegeLevel.value.id ===
    privilegeLevel.value[privilegeLevel.value.length - 1].id
  );
});
// @ts-ignore
const isRegainingPrivilegeLevel = computed(() => {
  return userStore.value.topLoyaltyLevelId > userStore.value.loyaltyLevelId;
});

function generateDummyPrivilegeLevel(count = 3) {
  const dummys = [];
  for (let index = 0; index < count; index++) {
    const benefits = [];
    for (let index2 = 0; index2 < count; index2++) {
      benefits.push({
        id: nanoid(3),
        desc: "",
        iconUrl: "",
      });
    }
    dummys.push({
      id: nanoid(3),
      name: "",
      benefits,
    });
  }
  return dummys;
}

async function getPrivilegeLevel() {
  try {
    isLoading.value = true;
    const result = await getLoyaltyLevel();
    if (result.isSuccess) {
      const resultData = result.data as UserPrivilege[];
      resultData.forEach((privilegeLevel) => {
        if (Array.isArray(privilegeLevel.benefit)) {
          privilegeLevel.benefit = privilegeLevel.benefit.filter((benefit) => {
            return benefit.desc && benefit.active;
          });
        }
      });
      privilegeLevel.value = resultData;
      isLoading.value = false;
      return;
    }
    isLoading.value = true;
    alert.error(result.message);
  } catch (err: any) {
    rollbar.error(err);
    isLoading.value = true;
  }
}

function getHeaderBgColor() {
  if (!currentPrivilegeLevel.value.id) {
    return "";
  }
  const bgImage = isDesktop
    ? currentPrivilegeLevel.value.profileHeaderWeb.url
    : currentPrivilegeLevel.value.profileHeaderMobile.url;
  return imageMutator({
    image: rebuildUrl(bgImage),
    desktopHeight: 0,
    desktopWidth: 0,
    mobileHeight: 0,
    mobileWidth: 0,
  });
}

export {
  isLoading,
  getPrivilegeLevel,
  privilegeLevel,
  isRegainingPrivilegeLevel,
  isOnMaxPrivilegeLevel,
  currentPrivilegeLevel,
  prevPrivilegeLevel,
  nextPrivilegeLevel,
  nextPrivilegeLevelMinimumReservation,
  nextPrivilegeLevelMinimumSpend,
  generateDummyPrivilegeLevel,
  getHeaderBgColor,
};
