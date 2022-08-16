import { ref, watch } from "@vue/composition-api";
import { useStorage } from "@vueuse/core";
import { isAllowLocalStorage } from "@/helper/storagePermissionHelper";
import isEmpty from "lodash-es/isEmpty";

const confirmPhoneKey = "hungryhub_is_confirm_phone";
let storage = isAllowLocalStorage() ? useStorage(confirmPhoneKey, "") : ref("");
let isPhoneConfirmed = ref(false);
let isUserSignedIn = false;
let userId = null;
let userPhone = null;
let userAddress = null;

const getLocalData = () => {
  try {
    if (storage && storage.value) {
      const localData = JSON.parse(storage.value);
      return localData || {};
    }
    return {};
  } catch (err) {
    return {};
  }
};

const saveConfirmPhone = (userId, phone, address) => {
  storage.value = JSON.stringify({
    userId,
    phone,
    address,
  });
};

const removeConfirmPhone = () => {
  if (isAllowLocalStorage()) {
    localStorage.removeItem(confirmPhoneKey);
  }
};

watch(storage, () => {
  checkIsConfirmed();
});

const setCompareData = (isSignIn, id, phone, address) => {
  isUserSignedIn = isSignIn;
  userId = id;
  userPhone = phone;
  userAddress = address;
};

const checkIsConfirmed = () => {
  try {
    let localData = getLocalData();
    if (isEmpty(localData)) {
      isPhoneConfirmed.value = false;
      return false;
    }
    if (
      !localData.address ||
      localData.address !== userAddress ||
      localData.phone !== userPhone
    ) {
      isPhoneConfirmed.value = false;
      return false;
    }
    if (isUserSignedIn && localData.userId !== userId) {
      isPhoneConfirmed.value = false;
      return false;
    }
    isPhoneConfirmed.value = true;
    return true;
  } catch (err) {
    isPhoneConfirmed.value = false;
    return false;
  }
};

export {
  setCompareData,
  isPhoneConfirmed,
  checkIsConfirmed,
  removeConfirmPhone,
  saveConfirmPhone,
};
