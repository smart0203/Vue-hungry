import { computed, ref } from "@vue/composition-api";
import isEmpty from "lodash-es/isEmpty";
import cloneDeep from "lodash-es/cloneDeep";
// @ts-ignore
import store from "@/store/index";
// @ts-ignore
import rollbar from "@/lib/rollbar";
// @ts-ignore
import { isMobile } from "@/helper/screenSizeHelper";

const isAlaCarte = ref(false);
const packages = ref({});
const packageQuantity = ref(0);
const menu = ref({});
const originalMenu = ref({});
const sectionName = ref("");
const sectionId = ref({});
const sectionRemainingQuantity = ref(0);
const sectionQuantityLimit = ref(0);
const sectionSelectedQuantity = ref(0);
const noRemainingQuantity = ref(false);

const subSectionGroups = computed(() => {
  return menu.value.subSectionGroups;
});

const originalMenuQuantity = computed(() => {
  return originalMenu.value.quantity;
});

const isHaveSubSections = computed(() => {
  return menu.value.subSections && menu.value.subSections.length ? true : false;
});

function initializeSelectMenuFlow(data = {}) {
  const {
    packages: paramPackage,
    packageQuantity: paramPackageQuantity,
    isAlaCarte: isAlaCartePackage,
    menu: paramMenu,
    sectionId: paramSectionId,
    sectionName: paramSectionName,
  } = data;
  function calculateSectionRemainingQuantity() {
    if (isAlaCarte.value) {
      sectionRemainingQuantity.value = 999999999999999;
    } else {
      const section = packages.value.menuSections.filter(
        (section) => section.id === sectionId.value
      )[0];
      sectionRemainingQuantity.value = section.getRemainingQuantity() || 0;
    }
  }

  function calculateSectionQuantityLimit() {
    if (isAlaCarte.value) {
      sectionQuantityLimit.value = 99999999999999;
    } else {
      const section = packages.value.menuSections.filter(
        (section) => section.id === sectionId.value
      )[0];
      sectionQuantityLimit.value = section.totalQuantityLimit || 0;
    }
  }

  function calculateSectionSelectedQuantity() {
    const currentQuantity = originalMenuQuantity.value || 0;
    sectionSelectedQuantity.value =
      sectionQuantityLimit.value -
      sectionRemainingQuantity.value -
      currentQuantity;
  }

  function isNoRemainingQuantity() {
    noRemainingQuantity.value =
      packageQuantity.value && sectionRemainingQuantity.value === 0
        ? true
        : false;
  }
  try {
    if (
      !paramPackage ||
      isEmpty(paramMenu) ||
      !paramSectionId ||
      !paramSectionName
    ) {
      rollbar.error(
        "Oops, someting went wrong, failed initialize select menu function",
        { paramMenu, paramSectionId, paramPackage, paramPackageQuantity }
      );
      return;
    }

    isAlaCarte.value = isAlaCartePackage;
    packages.value = paramPackage;
    packageQuantity.value = paramPackageQuantity;
    originalMenu.value = paramMenu;
    menu.value = cloneDeep(paramMenu);
    sectionId.value = paramSectionId;
    sectionName.value = paramSectionName;
    // set default menu quantity to be 1 if its 0
    menu.value.quantity = !menu.value.quantity ? 1 : menu.value.quantity;
    if (subSectionGroups.value && subSectionGroups.value.length === 0) {
      menu.value.pushSubSectionGroups();
    }

    // throw error if required data not valid
    if (!packages.value || !sectionId.value || !menu.value.id) {
      throw new Error(
        "Failed initialize select menu function, Missing section id or package id or menu id"
      );
    }
    calculateSectionRemainingQuantity();
    calculateSectionQuantityLimit();
    calculateSectionSelectedQuantity();
    isNoRemainingQuantity();
  } catch (err) {
    rollbar.error(
      "Oops, someting went wrong, failed initialize select menu function",
      err,
      { paramMenu, paramSectionId, paramPackage, paramPackageQuantity }
    );
  }
}

function clearSelectMenuFlow() {
  isAlaCarte.value = false;
  packages.value = {};
  packageQuantity.value = 0;
  menu.value = {};
  sectionId.value = 0;
  sectionName.value = "";
  sectionRemainingQuantity.value = 0;
}

function startBookingFlow() {
  const isMobileScreen = isMobile || false;
  store.dispatch("bookingPackage/selectPackage", packages.value.id);
  store.dispatch("booking/decideBookingMethod");
  store.dispatch("booking/decidePackagePreference");
  store.dispatch("booking/initBookingFlow", isMobileScreen);
}

function applyNewMenuQuantity() {
  // set quantity to real menu object
  originalMenu.value.setQuantity(menu.value.quantity);
  // apply subsection quantity logic
  if (isHaveSubSections.value) {
    let selectedSubMenus = [];
    subSectionGroups.value.forEach((subSectionGroup) => {
      subSectionGroup.subSections.forEach((subSection) => {
        subSection.subMenus.forEach((subMenu) => {
          if (subMenu.quantity) {
            const alreadySelectedIndex = selectedSubMenus
              .map((selectedSubMenu) => selectedSubMenu.subMenuid)
              .indexOf(subMenu.id);
            if (alreadySelectedIndex !== -1) {
              selectedSubMenus[alreadySelectedIndex].quantity += 1;
            } else {
              selectedSubMenus.push({
                subMenuid: subMenu.id,
                quantity: 1,
              });
            }
          }
        });
      });
    });

    originalMenu.value.subSections.forEach((subSection) => {
      subSection.subMenus.forEach((subMenu) => {
        const alreadySelectedIndex = selectedSubMenus
          .map((selectedSubMenu) => selectedSubMenu.subMenuid)
          .indexOf(subMenu.id);
        if (alreadySelectedIndex !== -1) {
          const totalSubMenuQuantity =
            selectedSubMenus[alreadySelectedIndex].quantity;
          subMenu.setQuantity(totalSubMenuQuantity);
        } else {
          subMenu.setQuantity(0);
        }
      });
    });

    if (originalMenu.value.quantity > 0) {
      originalMenu.value.subSectionGroups = subSectionGroups.value;
    }
  }

  if (isAlaCarte.value && packages.value.id) {
    // if this is ala carte package and no menu has selected then remove this package
    const sectionWithSelectedMenu =
      packages.value.getSectionsWithSelectedMenus();
    if (sectionWithSelectedMenu && sectionWithSelectedMenu.length === 0) {
      store.commit("bookingPackage/removeSelectedPackage", packages.value.id);
      if (
        store.getters["bookingPackage/anySelectedPackages"] === false &&
        !isMobile
      ) {
        store.commit("booking/setState", {
          state: "packagePreference",
          val: "",
        });
      }
    }
  }
}

function apply() {
  if (packages.value.quantity === 0) {
    startBookingFlow();
  }
  applyNewMenuQuantity();
}

function increaseMenuQuantity() {
  menu.value.increaseQuantity();
}

function decreaseMenuQuantity() {
  if (menu.value.quantity === 0) {
    return;
  }
  menu.value.decreaseQuantity();
}

export {
  initializeSelectMenuFlow,
  menu,
  originalMenuQuantity,
  subSectionGroups,
  increaseMenuQuantity,
  decreaseMenuQuantity,
  apply,
  packages,
  packageQuantity,
  noRemainingQuantity,
  sectionRemainingQuantity,
  clearSelectMenuFlow,
  sectionQuantityLimit,
  sectionSelectedQuantity,
  sectionId,
  sectionName,
  isAlaCarte,
  isHaveSubSections,
};
