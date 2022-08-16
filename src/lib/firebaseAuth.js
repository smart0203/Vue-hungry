import rollbar from "@/lib/rollbar";
import { initFirebase, firebaseInstance } from "./firebaseCore";
import isEmpty from "lodash-es/isEmpty";
import { i18n } from "@/lib/i18n/i18n.js";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

async function parse(loginResult) {
  let user = {};
  let token = "";
  let id = "";
  let provider = "";
  let name = "";
  let email = "";
  let isSuccess = true;
  try {
    if (isEmpty(loginResult)) {
      return {
        email,
        token,
        id,
        provider,
        name,
      };
    }

    user = loginResult.user;
    const providerData = user.providerData[0];
    const vendoir = providerData.providerId;

    if (!vendoir.includes("facebook") && !vendoir.includes("google")) {
      return {
        isSuccess,
        email,
        token,
        id,
        provider,
        name,
      };
    }
    if (vendoir.includes("facebook")) {
      const credentialResult =
        FacebookAuthProvider.credentialFromResult(loginResult);
      user.fallbackEmail = tryParseUserEmail(user);
      token = credentialResult.accessToken;
      id = providerData.uid;
      provider = "facebook";
      name = user.displayName;
      email = user.email || user.fallbackEmail;
      return {
        isSuccess,
        email,
        token,
        id,
        provider,
        name,
      };
    }
    if (vendoir.includes("google")) {
      user = loginResult.user;
      user.fallbackEmail = tryParseUserEmail(user);
      token = await user.getIdToken(true);
      id = user.uid;
      provider = "firebase";
      name = user.displayName;
      email = user.email || user.fallbackEmail;

      if (typeof token === "string" && token.length === 0) {
        rollbar.error(" Invalid token from google provider", {
          loginResult: loginResult.user,
          token: token,
        });
      }
      return {
        isSuccess,
        email,
        token,
        id,
        provider,
        name,
      };
    }
  } catch (err) {
    isSuccess = false;
    rollbar.error("Failed parse firebase login result", err, {
      loginResult,
      isSuccess,
      email,
      token,
      id,
      provider,
      name,
    });
    return {
      isSuccess,
      email,
      token,
      id,
      provider,
      name,
    };
  }
}

async function loginWithFacebook(usingPopup = true) {
  try {
    initFirebase();
    const facebookProvider = new FacebookAuthProvider();
    const auth = getAuth(firebaseInstance.value);
    facebookProvider.addScope("public_profile");
    facebookProvider.addScope("email");
    // login with pop up
    if (usingPopup) {
      try {
        let loginResult = await signInWithPopup(auth, facebookProvider);
        const { token, name, provider, email, id, isSuccess } = await parse(
          loginResult
        );
        if (isSuccess) {
          return {
            isSuccess: true,
            message: "",
            id: id,
            name: name,
            token: token,
            email: email,
            provider: provider,
          };
        }
        return {
          isSuccess: false,
          message: defaultErrorMessage("facebook"),
        };
      } catch (err) {
        const errorMessage = errorMessageParser(err);
        if (typeof errorMessage === "string") {
          return {
            isSuccess: false,
            message: errorMessage,
            data: null,
          };
        }
        rollbar.error(defaultErrorMessage("facebook"), err);
        return {
          isSuccess: false,
          message: defaultErrorMessage("facebook"),
        };
      }
    }
    // login with redirect
    else {
      signInWithRedirect(auth, facebookProvider);
      return {};
    }
  } catch (err) {
    rollbar.error(defaultErrorMessage("facebook"), err);
    return {
      isSuccess: false,
      data: null,
      message: defaultErrorMessage("facebook"),
    };
  }
}

async function loginWithGoogle(usingPopup = true) {
  try {
    initFirebase();
    const googleProvider = new GoogleAuthProvider();
    const auth = getAuth(firebaseInstance.value);
    googleProvider.addScope("profile");
    googleProvider.addScope("email");
    // log in with pop up
    if (usingPopup) {
      try {
        let loginResult = await signInWithPopup(auth, googleProvider);
        const { token, name, provider, email, id, isSuccess } = await parse(
          loginResult
        );
        if (isSuccess) {
          return {
            isSuccess: true,
            message: "",
            id: id,
            name: name,
            token: token,
            email: email,
            provider: provider,
          };
        }
        return {
          isSuccess: false,
          message: defaultErrorMessage("google"),
        };
      } catch (err) {
        const errorMessage = errorMessageParser(err);
        if (typeof errorMessage === "string") {
          return {
            isSuccess: false,
            message: errorMessage,
            data: null,
          };
        }
        rollbar.error(defaultErrorMessage("google"), err);
        return {
          isSuccess: false,
          message: defaultErrorMessage("google"),
        };
      }
    }
    // login with redirect
    else {
      signInWithRedirect(auth, googleProvider);
      return {};
    }
  } catch (err) {
    rollbar.error(defaultErrorMessage("google"), err);
    return {
      isSuccess: false,
      data: null,
      message: defaultErrorMessage("google"),
    };
  }
}

async function getRedirectLoginResult() {
  try {
    initFirebase();
    const auth = getAuth(firebaseInstance.value);
    const redirectResult = await getRedirectResult(auth);
    if (isEmpty(redirectResult)) {
      return {
        isSuccess: false,
        data: null,
        message: "",
      };
    }

    const { token, name, provider, email, id, isSuccess } = await parse(
      redirectResult
    );
    if (isSuccess) {
      return {
        isSuccess: true,
        message: "",
        id: id,
        name: name,
        token: token,
        email: email,
        provider: provider,
      };
    }
    return {
      isSuccess: false,
      data: null,
      message: "",
    };
  } catch (err) {
    if (!isEmpty(err)) {
      const errorMessage = errorMessageParser(err);
      if (typeof errorMessage === "string") {
        return {
          isSuccess: false,
          message: errorMessage,
          data: null,
        };
      }
      rollbar.error("failed get firebase redirect login result", err);
      return {
        isSuccess: false,
        data: null,
        message: "",
      };
    }
  }
}

function errorMessageParser(err) {
  if (
    err.code === "auth/credential-already-in-use" ||
    err.code === "email-already-in-use" ||
    err.code === "auth/account-exists-with-different-credential"
  ) {
    return i18n.t("firebaseEmailAlreadyRegisterd");
  }
  if (
    err.code === "auth/popup-closed-by-user" ||
    err.code === "auth/user-cancelled" ||
    err.code === "auth/popup-blocked"
  ) {
    return "";
  }
  if (err.code === "auth/network-request-failed") {
    return "Network failure, Please try again";
  }
  if (err.code === "auth/too-many-requests") {
    return "Too many request";
  }
  if (err.code === "auth/web-storage-unsupported") {
    return "";
  }
  return null;
}

function defaultErrorMessage(provider) {
  if (provider) {
    return `Oops, someting went wrong, failed login with ${provider} provider`;
  }
  return `Oops, someting went wrong, failed login with social media provider`;
}

function tryParseUserEmail(user) {
  if (!isEmpty(user)) {
    if (Array.isArray(user.providerData)) {
      return user.providerData[0].email;
    }
    return "";
  }
  return "";
}

export { loginWithFacebook, loginWithGoogle, getRedirectLoginResult };
