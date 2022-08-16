let numbro = null;
import orderBy from "lodash-es/orderBy";
import isEmpty from "lodash-es/isEmpty";
import { isValid as isValidCorporateEvent } from "@/composable/corporateEvent";
import {
  packages,
  isAlaCarte,
  packageQuantity,
  originalMenuQuantity,
  decreaseMenuQuantity,
  increaseMenuQuantity,
  subSectionGroups,
  apply,
  noRemainingQuantity,
  sectionId,
  sectionName,
  sectionRemainingQuantity,
  sectionQuantityLimit,
  sectionSelectedQuantity,
  menu,
  clearSelectMenuFlow,
  isHaveSubSections,
} from "./packageSelectMenu.js";
export default {
  setup() {
    return {
      packages,
      isAlaCarte,
      packageQuantity,
      originalMenuQuantity,
      subSectionGroups,
      decreaseMenuQuantity,
      increaseMenuQuantity,
      apply,
      noRemainingQuantity,
      sectionId,
      sectionName,
      sectionRemainingQuantity,
      sectionQuantityLimit,
      sectionSelectedQuantity,
      menu,
      isHaveSubSections,
    };
  },
  data() {
    return {
      modalComponent: "",
      openedAccordionId: [],
    };
  },
  computed: {
    isAllowShowPrice() {
      return isValidCorporateEvent.value === false && this.menu.price > 0;
    },
    isShowMenuImage() {
      if (isEmpty(this.menu)) {
        return false;
      }
      return this.menu.isShowImage();
    },
    menuImage() {
      if (this.menu.image) {
        return this.menu.image.original || this.menu.image.originalSize;
      }
      return "";
    },
    menuName() {
      return this.menu.name;
    },
    menuDescription() {
      return this.menu.description;
    },
    menuPrice() {
      return this.menu.price;
    },
    selectedMenusInSection() {
      if (this.sectionId) {
        const selectedSection = this.packages.getSections(this.sectionId)[0];
        return selectedSection.getSelectedMenu();
      }
      return [];
    },
    buttonText() {
      let subMenuText = "";
      if (this.isHaveSubSections) {
        subMenuText = `(${this.currentTotalSubMenuQuantity}/${this.maxAllowedSubMenuQuantity})`;
      }
      if (this.packageQuantity && this.originalMenuQuantity) {
        if (this.menu.quantity === 0) {
          return this.$t("remove");
        }
        return `${this.$t("update")} ${subMenuText}`;
      }
      return `${this.$t("add")} ${subMenuText}`;
    },
    maxAllowedSubMenuQuantity() {
      if (isEmpty(this.menu)) {
        return null;
      }
      if (!this.isHaveSubSections) {
        return null;
      }
      return this.menu.maxSelectedSubMenuQuantity();
    },
    currentTotalSubMenuQuantity() {
      if (!this.isHaveSubSections) {
        return null;
      }
      let total = 0;
      this.subSectionGroups.forEach((subSectionGroup) => {
        subSectionGroup.subSections.forEach((subSection) => {
          total = total + subSection.getTotalSelectedSubMenus();
        });
      });
      return total;
    },
    disableDecreaseQuantityButton() {
      return (
        this.menu.quantity === 0 ||
        (!this.originalMenuQuantity && !this.menu.quantity) ||
        (!this.originalMenuQuantity && this.menu.quantity === 1)
      );
    },
    showIncreaseDecreaseButton() {
      return this.packageQuantity && this.originalMenuQuantity;
    },
    disableIncreaseQuantityButton() {
      if (this.isAlaCarte) {
        return false;
      }
      // disable if package quantity is undefined or 0
      if (!this.packageQuantity) {
        return true;
      }

      if (this.noRemainingQuantity) {
        if (!this.originalMenuQuantity) {
          return true;
        }
        if (this.menu.quantity >= this.originalMenuQuantity) {
          return true;
        }
      }

      if (!this.noRemainingQuantity) {
        if (
          !this.originalMenuQuantity &&
          this.menu.quantity >= this.sectionRemainingQuantity
        ) {
          return true;
        }
        if (this.originalMenuQuantity) {
          if (this.selectedMenusInSection.length === 1) {
            return this.menu.quantity >= this.sectionQuantityLimit;
          }
          return (
            this.menu.quantity >=
            this.sectionQuantityLimit - this.sectionSelectedQuantity
          );
        }
      }
      return false;
    },
    disabledApplyQuantity() {
      // disable apply button logic for menu that have sub sections
      if (this.isHaveSubSections) {
        // do not disable button if user want to remove this menu
        if (this.menu.quantity === 0) {
          return false;
        }
        // disable button if user not yet select all sub menu
        if (
          this.currentTotalSubMenuQuantity !== this.maxAllowedSubMenuQuantity
        ) {
          return true;
        }
        return false;
      }
      // disable apply button logic for ordinary menu
      if (!this.originalMenuQuantity && !this.noRemainingQuantity) {
        return false;
      }
      if (this.disableIncreaseQuantityButton && this.noRemainingQuantity) {
        return true;
      }
      return (
        this.disableIncreaseQuantityButton && this.disableDecreaseQuantityButton
      );
    },
  },
  created() {
    this.loadNumbro();
  },
  methods: {
    orderBy,
    async loadNumbro() {
      if (numbro) {
        return;
      }
      try {
        const module = await import("numbro");
        numbro = module.default;
      } catch (err) {
        this.$rollbar.error("Failed load numbro package", err);
      }
    },
    async loadModalComponent() {
      if (this.modalComponent) {
        return;
      }
      try {
        const { component, isSuccess, errorMessage } =
          await this.$loadComponentAsync(
            "Package/Package-Select-Menu/PackageSelectMenuImageModal.vue"
          );
        if (!isSuccess.value) {
          this.$rollbar.error(errorMessage.value);
          return;
        }
        this.modalComponent = component.value;
      } catch (err) {
        this.$rollbar.error("Failed load add package menu component", err);
      }
    },
    toggleModal() {
      this.$vfm.show("package-select-menu-image-modal");
    },
    clearState() {
      clearSelectMenuFlow();
    },
    isAccordionClose(paramAccordionId) {
      if (typeof paramAccordionId === "string") {
        const isExist = this.openedAccordionId.filter(
          (accordionId) => accordionId === paramAccordionId
        );
        return isExist.length ? true : false;
      }
    },
    toggleAccordion(paramAccordionId) {
      if (typeof paramAccordionId === "string") {
        const findIndex = this.openedAccordionId.indexOf(paramAccordionId);
        if (findIndex === 0) {
          this.openedAccordionId.shift();
        } else if (findIndex >= 1) {
          this.openedAccordionId.splice(findIndex, 1);
        } else {
          this.openedAccordionId.push(paramAccordionId);
        }
      }
    },
    selectSubMenu(portion, subSectionsOrder) {
      const subSection =
        this.subSectionGroups[portion].subSections[subSectionsOrder];
      const selectedSubMenuId = subSection.selected;
      subSection.subMenus.forEach((subMenu) => {
        if (subMenu.id === selectedSubMenuId) {
          subMenu.increaseQuantity();
        } else {
          subMenu.decreaseQuantity();
        }
      });
    },
    formatOrdinalNumber(number) {
      const lang = this.$store.state.lang;
      if (typeof number === "number" && numbro && lang === "en") {
        return numbro(number).format({ output: "ordinal" });
      }
      return number;
    },
  },
  i18n: {
    messages: {
      en: {
        addSpecialInstruction: "Add special instructions",
        specialInstruction: "Special Instructions",
        reachMaximumOrder: "You’ve reached the maximum order",
      },
      th: {
        addSpecialInstruction: "เพิ่มคำขอพิเศษ",
        specialInstruction: "คำขอพิเศษ",
        reachMaximumOrder: "คุณได้เลือกรายการอาหารครบแล้วสำหรับหมวดนี้",
      },
    },
  },
};
