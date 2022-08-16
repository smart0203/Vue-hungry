import sortBy from "lodash-es/sortBy";
import isEmpty from "lodash-es/isEmpty";
import {
  PACKAGE_PREFERENCE_DELIVERY_PICK_UP,
  PACKAGE_PREFERENCE_XPERIENCE,
  PACKAGE_PREFERENCE_DINE_IN,
  PACKAGE_CODE_HAH,
  PACKAGE_CODE_XP,
} from "@/lib/constant";
import { i18n } from "@/lib/i18n/i18n.js";

const packageOrder = function (type) {
  if (type === "ayce") {
    return 1;
  } else if (type === "bfp") {
    return 2;
  } else if (type === "pp") {
    return 3;
  } else if (type === "xp") {
    return 4;
  } else if (type === "hs") {
    return 5;
  } else if (type === "hah") {
    return 6;
  } else if (type === "sm") {
    return 7;
  }
};

const packageTypeFullName = function packageType(type) {
  if (type === "ayce") {
    return "All You Can Eat";
  } else if (type === "hah") {
    return "Hungry@Home";
  } else if (type === "pp") {
    return "Party Pack";
  } else if (type === "bfp") {
    return "Buffet Plus";
  } else if (type === "sm") {
    return "Set Menu";
  } else if (type === "hs") {
    return "Hungry Lunch";
  } else if (type === "xp") {
    return "Xperience";
  }
  return "";
};

const packageTypeOrder = function packageTypeOrder(arrayOfPackageType) {
  return arrayOfPackageType.sort((a, b) => {
    return packageOrder(a) - packageOrder(b);
  });
};

const sortPackageByType = function packageOrder(arrayOfPackage, packageType) {
  const sorted = sortBy(arrayOfPackage, [
    function (packages) {
      return packageOrder(packages[packageType]);
    },
  ]);
  return sorted;
};

function packagePricingRule({ adult = 0 }, rules) {
  // selecting pricing rule only depend on adult size
  // force adult to be at least 1
  const pax = adult > 0 ? adult : 1;
  if (rules && rules.length) {
    if (rules.length === 1) {
      return rules[0];
    }
    const selectedRules = rules.filter((rule) => {
      const minSeat = rule.minSeat || 0;
      const maxSeat = rule.maxSeat || Infinity;
      return minSeat <= pax && pax <= eval(maxSeat);
    });
    if (selectedRules.length) {
      return selectedRules[0];
    }
    // throw new Error(`No package rules based on adult found, pax ${pax}`);
  }
  throw new Error("No package rules found");
}

function packagePrice({ adult = 0, kids = 0 }, rules, quantity = 0) {
  try {
    const selectedRule = packagePricingRule({ adult }, rules);
    const price = selectedRule.price.replace(",", "");
    // hungry at home have maxSeat null & minSeat null
    if (selectedRule.maxSeat === null && selectedRule.minSeat === null) {
      const computedPrice = quantity
        ? parseFloat(price) * quantity
        : parseFloat(price);
      return {
        adult: computedPrice,
        kids: 0,
      };
    }

    // if perPack have value (for party pack)
    else if (selectedRule.perPack) {
      const computedPrice = quantity
        ? parseFloat(price) * quantity
        : parseFloat(price);
      return {
        adult: computedPrice,
        kids: 0,
      };
    }
    // else (for ayce, bfp, and other)
    const adultPrice = parseFloat(price) * adult;
    const kidsPrice = selectedRule.kidsPriceRate
      ? parseFloat(price) * kids * (selectedRule.kidsPriceRate / 100)
      : parseFloat(price) * kids;

    return { adult: adultPrice, kids: kidsPrice };
  } catch (err) {
    throw new Error(err);
  }
}

function packagePricingType(type, lang) {
  if (type === "per_person") {
    return lang === "en" ? "NET/person" : "ราคาสุทธิ/ท่าน";
  } else {
    return lang === "en" ? "NET/set" : "ราคาสุทธิ/เซ็ต";
  }
}

function splitPackagesByType(arrayOfPackage) {
  let packages = {};
  let ayce = [];
  let pp = [];
  let bfp = [];
  let hah = [];
  let sm = [];
  let hs = [];
  let xp = [];
  arrayOfPackage.forEach((pack) => {
    if (pack.typeCode === "ayce") {
      ayce.push(pack);
    } else if (pack.typeCode === "pp") {
      pp.push(pack);
    } else if (pack.typeCode === "bfp") {
      bfp.push(pack);
    } else if (pack.typeCode === "hah") {
      hah.push(pack);
    } else if (pack.typeCode === "sm") {
      sm.push(pack);
    } else if (pack.typeCode === "hs") {
      hs.push(pack);
    } else if (pack.typeCode === "xp") {
      xp.push(pack);
    }
  });
  if (ayce.length) {
    packages.ayce = ayce;
  }
  if (pp.length) {
    packages.pp = pp;
  }
  if (bfp.length) {
    packages.bfp = bfp;
  }
  if (hah.length) {
    packages.hah = hah;
  }
  if (sm.length) {
    packages.sm = sm;
  }
  if (hs.length) {
    packages.hs = hs;
  }
  if (xp.length) {
    packages.xp = xp;
  }
  return packages;
}

function packageTagLine(type, lang) {
  if (type === "ayce") {
    return lang === "en"
      ? "Exclusive Unlimited Dining Promotion A-La-Carte Style"
      : "โปรโมชั่นพิเศษที่ให้คุณลิ้มลองอาหารสไตล์ A-La-Carte ได้ไม่อั้น";
  } else if (type === "hah") {
    return lang === "en"
      ? "Safe & Value Set Available for Self Pick-up / Delivery"
      : "สะอาดปลอดภัย อร่อยจัดเต็มที่บ้าน มีบริการจัดส่ง หรือมารับด้วยตนเอง";
  } else if (type === "pp") {
    return lang === "en"
      ? "Value set for your next celebration! You can mix and match multiple packs"
      : "เมนูคุ้มค่าสำหรับการเลี้ยงฉลองครั้งต่อไป! สามารถเลือกแพ็กหลายๆแบบได้";
  } else if (type === "bfp") {
    return lang === "en"
      ? "Unlimited dining with exclusive perks"
      : "ทานไม่อั้นพร้อมรับสิทธิพิเศษ";
  } else if (type === "sm") {
    return lang === "en" ? "Exclusive Set Menu" : "Exclusive Set Menu";
  } else if (type === "hs") {
    return lang === "en"
      ? "All-Inclusive Affordable Lunch Set at NET Price!"
      : "มื้ออาหารกลางวันแบบครบชุดในราคาสุทธิ!";
  } else if (type === "xp") {
    return lang === "en"
      ? "Great deals on dining experiences bundled with your favorite activities!"
      : "รวมแพ็กเกจดีลสุดคุ้ม ทั้งอาหาร รวมกิจกรรมสนุกๆ อีกมากมาย";
  }
}

function isDineInPackage(type) {
  return type !== PACKAGE_CODE_HAH;
}

function selectPackageGuard({
  pack = null,
  selectedPackages = [],
  anySelectedDateAndTime = false,
  currentPackagePreference = "",
}) {
  let response = {
    isSuccess: undefined,
    errorType: {
      invalidData: false,
      notAvailable: false,
      cannotCombine: false,
    },
    meta: {
      resetBookingFlow: false,
      resetPackage: false,
      newPackagePreference: "",
    },
  };

  if (
    isEmpty(pack) ||
    Array.isArray(selectedPackages) === false ||
    typeof currentPackagePreference !== "string"
  ) {
    response.isSuccess = false;
    response.errorType.invalidData = true;
    return response;
  }

  const anyselectedPackagess = selectedPackages.length > 0 ? true : false;
  const resetBookingFlowWarning =
    "Are you sure want to select this package ? its will reset your booking back to the first step.";

  let packagePrefenceByPackageType;
  if (pack.typeCode === PACKAGE_CODE_HAH) {
    packagePrefenceByPackageType = PACKAGE_PREFERENCE_DELIVERY_PICK_UP;
  } else if (pack.typeCode === PACKAGE_CODE_XP) {
    packagePrefenceByPackageType = PACKAGE_PREFERENCE_XPERIENCE;
  } else {
    packagePrefenceByPackageType = PACKAGE_PREFERENCE_DINE_IN;
  }
  if (pack.isBookable === false) {
    response.errorType.notAvailable = true;
    response.isSuccess = false;
    return response;
  } else {
    // stored package preference different from selected package's preference
    if (currentPackagePreference.length) {
      if (
        currentPackagePreference.includes(packagePrefenceByPackageType) ===
        false
      ) {
        if (window.confirm(resetBookingFlowWarning) === false) {
          response.isSuccess = false;
          return response;
        }
        // H@H package allow add package quantity immediately
        if (
          packagePrefenceByPackageType.includes(
            PACKAGE_PREFERENCE_DELIVERY_PICK_UP
          )
        ) {
          response.isSuccess = true;
          response.meta.resetBookingFlow = true;
          response.meta.newPackagePreference = packagePrefenceByPackageType;
          return response;
        }
        // Xperience package allow add package & start booking flow immediately
        else if (
          packagePrefenceByPackageType.includes(PACKAGE_PREFERENCE_XPERIENCE)
        ) {
          response.isSuccess = true;
          response.meta.resetPackage = true;
          response.meta.newPackagePreference = packagePrefenceByPackageType;
          return response;
        }
        // dine in package disallow add package and start new booking flow
        response.meta.newPackagePreference = packagePrefenceByPackageType;
        response.isSuccess = false;
        response.meta.resetBookingFlow = true;
        response.meta.resetPackage = true;
        return response;
      }
      // stored package preference same with selected package's preference
      if (anyselectedPackagess) {
        const packType = pack.typeCode;
        const selectedPackagesType = selectedPackages.map(
          (pack) => pack.typeCode
        );
        if (selectedPackagesType.includes(packType)) {
          // package accept many quanttiy
          if (pack.isAcceptManyQuantity) {
            const selectedPackagesContainNotAllowMix = selectedPackages.filter(
              (pack) => {
                return !pack.isAllowMix;
              }
            );
            if (selectedPackagesContainNotAllowMix.length || !pack.isAllowMix) {
              response.isSuccess = false;
              response.errorType.cannotCombine = true;
              return response;
            }
            response.isSuccess = true;
            return response;
          }
          // package that accept single quantity
          response.isSuccess = true;
          return response;
        }
        // package type is different with current selected package
        // dine in package allow select it
        if (packType !== PACKAGE_CODE_HAH) {
          response.isSuccess = true;
          return response;
        }
        // show alert to confirm reset booking flow if user want to select HAH (because need to fill menu section)
        if (window.confirm(resetBookingFlowWarning) === false) {
          response.isSuccess = false;
          return response;
        }
        response.isSuccess = false;
        response.meta.newPackagePreference = packagePrefenceByPackageType;
        response.meta.resetBookingFlow = true;
        response.meta.resetPackage = true;
        return response;
      }
      // no selected packages
      response.isSuccess = true;
      response.meta.newPackagePreference = packagePrefenceByPackageType;
      return response;
    }
    // no current package preference
    // already select date & time
    if (anySelectedDateAndTime) {
      response.isSuccess = true;
    }
    // no yet selecte date & time
    if (pack.typeCode === PACKAGE_CODE_HAH) {
      response.isSuccess = true;
      response.meta.resetBookingFlow = true;
    } else {
      response.isSuccess = false;
      response.meta.resetBookingFlow = true;
    }
    response.meta.newPackagePreference = packagePrefenceByPackageType;
    return response;
  }
}

const packageBookButton = function ({
  inventorySummaries,
  packageId,
  packageType,
  limitedSeatsShowing,
}) {
  const textByPackageType =
    packageType === PACKAGE_CODE_XP
      ? i18n.t("bookXpPackage")
      : !isDineInPackage(packageType)
      ? i18n.t("addOrder")
      : i18n.t("book");
  let bookButton = {
    value: textByPackageType,
    disabled: false,
    message: null,
  };
  if (Array.isArray(inventorySummaries)) {
    const summary = inventorySummaries.find(
      (invSummary) => invSummary.restaurantPackageId === packageId
    );
    if (summary) {
      if (summary.totalSeatLeftPackage > limitedSeatsShowing) {
        bookButton = {
          value: textByPackageType,
          disabled: false,
          message: null,
        };
      }

      if (summary.totalSeatLeftPackage < limitedSeatsShowing) {
        bookButton = {
          value: i18n.t("seatLeft", {
            count: summary.totalSeatLeftPackage,
          }),
          disabled: false,
          message: i18n.t("beforeGone"),
        };
      }

      if (summary.totalSeatLeftPackage === 1) {
        bookButton = {
          value: i18n.t("lastOne"),
          disabled: false,
          message: i18n.t("hurryUp"),
        };
      }

      if (summary.totalSeatLeftPackage === 0) {
        bookButton = {
          value: i18n.t("soldOut"),
          disabled: true,
          message: null,
        };
      }
    }
  }
  return bookButton;
};

export {
  sortPackageByType,
  packageTypeOrder,
  packageTypeFullName,
  packageTagLine,
  packagePricingType,
  packagePrice,
  splitPackagesByType,
  packagePricingRule,
  isDineInPackage,
  selectPackageGuard,
  packageBookButton,
};
