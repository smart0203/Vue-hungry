import { ref } from "@vue/composition-api";
import { getRedirectLoginResult } from "@/lib/firebaseAuth";
import { signUp, checkHasPhoneNumber, updateProfile } from "@/services/user";
import useReport from "./useReport";
import { loginWithFacebook, loginWithGoogle } from "@/lib/firebaseAuth";
import store from "@/store";

const name = ref("");
const email = ref("");
const token = ref("");
const uid = ref("");
const callingCode = ref("");
const phone = ref("");
const birthDay = ref("");
const provider = ref("firebase");
const needInputEmail = ref(false);
const needInputPhone = ref(false);
const subscribeMarketingEmail = ref(false);

const defaultErrorMessage = "Oops, something went wrong, sign up failed";

async function processRedirectLoginResult() {
  try {
    const result = await getRedirectLoginResult();
    if (!result) {
      return {
        isSuccess: undefined,
        message: "",
      };
    }
    if (result.isSuccess) {
      const { name, email, token, id, provider } = result;
      return await processUserProfile({ name, email, token, id, provider });
    }

    return {
      isSuccess: false,
      message: result.message,
    };
  } catch (err) {
    useReport({
      level: "error",
      message: defaultErrorMessage,
      errorException: err,
    });
    return {
      isSuccess: false,
      message: defaultErrorMessage,
    };
  }
}

async function loginWithVendor(
  vendor: "facebook" | "google",
  usingPopUp: boolean
) {
  try {
    const login = () => {
      if (vendor === "facebook") {
        return loginWithFacebook(usingPopUp);
      }
      return loginWithGoogle(usingPopUp);
    };
    const { isSuccess, email, token, id, provider, name, message } =
      await login();
    if (isSuccess) {
      return await processUserProfile({ email, token, id, provider, name });
    }

    return {
      isSuccess: false,
      message: message,
    };
  } catch (err) {
    useReport({
      level: "error",
      message: defaultErrorMessage,
      errorException: err,
    });
    return {
      isSuccess: false,
      message: defaultErrorMessage,
    };
  }
}

async function signupSocialMedia() {
  // @ts-ignore
  const guestBookingIds = store.state.user.guestBookingIds;
  const payload = {
    name: name.value,
    email: email.value,
    accessToken: token.value,
    uid: uid.value,
    phone: phone.value,
    callingCode: callingCode.value,
    provider: provider.value,
    subscribeMarketingEmail: subscribeMarketingEmail.value,
    birthday: birthDay.value,
    guestBookingIds: guestBookingIds,
  };
  const signupResult = await signUp(payload);

  if (!signupResult.isSuccess) {
    return {
      isSuccess: false,
      message: signupResult.error.message || defaultErrorMessage,
    };
  }
  if (
    typeof signupResult.data.data.phone !== "number" ||
    typeof signupResult.data.data.phone !== "string"
  ) {
    const updateProfilePayload = [];
    for (const property in payload) {
      if (
        [
          "birthday",
          "guestBookingIds",
          "subscribeMarketingEmail",
          "callingCode",
          "phone",
        ].includes(property)
      ) {
        updateProfilePayload.push({
          key: property,
          // @ts-ignore
          val: payload[property],
        });
      }
    }

    const updateProfileResult = await updateProfile(
      signupResult.data.data.accessToken,
      updateProfilePayload
    );
    if (updateProfileResult.isSuccess) {
      store.dispatch("user/setProfile", updateProfileResult.data);
      return {
        isSuccess: true,
        message: updateProfileResult.message,
      };
    }
    return {
      isSuccess: false,
      message: updateProfileResult.message || defaultErrorMessage,
    };
  }
  store.dispatch("user/setProfile", signupResult.data.data);
  return {
    isSuccess: true,
    message: signupResult.message || "",
  };
}

async function processUserProfile(param: {
  name: string;
  email: string;
  token: string;
  id: string;
  provider: string;
}) {
  name.value = param.name;
  email.value = param.email;
  token.value = param.token;
  uid.value = param.id;
  provider.value = param.provider;
  if (!email.value) {
    needInputEmail.value = true;
    return {
      isSuccess: undefined,
      message: "",
    };
  }
  const phoneResult = await checkHasPhoneNumber(uid.value, provider.value);

  if (!phoneResult.isSuccess) {
    return {
      isSuccess: false,
      message: phoneResult.message,
    };
  }

  if (phoneResult.isSuccess && phoneResult.hasNumber === false) {
    needInputPhone.value = true;
    return {
      isSuccess: undefined,
      message: "",
    };
  }

  return await signupSocialMedia();
}

function resetState() {
  name.value = "";
  email.value = "";
  token.value = "";
  uid.value = "";
  callingCode.value = "";
  phone.value = "";
  birthDay.value = "";
  provider.value = "";
  needInputEmail.value = false;
  needInputPhone.value = false;
  subscribeMarketingEmail.value = false;
}

export {
  name,
  email,
  token,
  uid,
  callingCode,
  phone,
  provider,
  birthDay,
  needInputEmail,
  needInputPhone,
  subscribeMarketingEmail,
  processRedirectLoginResult,
  loginWithVendor,
  signupSocialMedia,
  resetState,
};
