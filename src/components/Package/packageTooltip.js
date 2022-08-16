import startCase from "lodash-es/startCase";
import { i18n } from "@/lib/i18n/i18n";
import rollbar from "@/lib/rollbar";
import { screen } from "@/helper/screenSizeHelper";

let tippyConfig;
let tippyInstance;

function initTooltip() {
  if (typeof tippyInstance === "function") {
    return;
  }
  import("@/lib/tooltip")
    .then((importedModule) => {
      try {
        const module = importedModule.default;
        tippyInstance = module.tooltip;
        tippyConfig = {
          maxWidth: screen == "phone" ? 150 : 350,
        };
        return true;
      } catch (err) {
        rollbar.error(err);
        return false;
      }
    })
    .catch((err) => {
      rollbar.error(err);
    });
}

async function initCollectRedeemTooltip() {
  try {
    if (typeof tippyInstance !== "function") {
      await initTooltip();
    }
    const collectEl = document.querySelectorAll(".collect-icon");
    const redeemEl = document.querySelectorAll(".redeem-icon");
    const collectMessage = startCase(i18n.t("collectMessage"));
    const redeemMessage = startCase(i18n.t("redeemMessage"));
    if (collectEl && collectEl.length) {
      return showTooltip(collectEl, collectMessage, tippyConfig);
    }
    if (redeemEl && redeemEl.length) {
      return showTooltip(redeemEl, redeemMessage, tippyConfig);
    }
  } catch (err) {
    rollbar.error(err);
  }
}

async function initCustomDeliveryTooltip() {
  try {
    if (typeof tippyInstance !== "function") {
      await initTooltip();
    }
    const customDeliveryEl = document.querySelectorAll(".custom-delivery-icon");

    const customDeliveryMessage = startCase(i18n.t("usingCustomDeliveryFee"));

    if (customDeliveryEl && customDeliveryEl.length) {
      return showTooltip(customDeliveryEl, customDeliveryMessage, tippyConfig);
    }
  } catch (err) {
    rollbar.error(err);
  }
}

async function initAddonToolip(el) {
  if (typeof tippyInstance !== "function") {
    await initTooltip();
  }
  const message = startCase(i18n.t("addonPackageAlert"));
  if (el && typeof tippyInstance === "function") {
    return tippyInstance(el, message, "yellow");
  }
}

async function showTooltip(element, message, config) {
  if (typeof tippyInstance !== "function") {
    await initTooltip();
  }
  if (typeof tippyInstance === "function") {
    return tippyInstance(element, message, "white", config);
  }
}

export {
  initTooltip,
  initCollectRedeemTooltip,
  initCustomDeliveryTooltip,
  showTooltip,
  initAddonToolip,
};
