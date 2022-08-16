import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import { convertToNumber } from "@/helper/stringHelper";
import { MenuClassInterface, MenuInterface } from "@/types/MenuInterface";
import { SubSectionClassInterface } from "@/types/SubSectionInterface";
import SubSection from "./subSection";
class Menu implements MenuClassInterface {
  id: number;
  active: boolean;
  name: string;
  price: number;
  currency: string;
  priority: number;
  description: string;
  image: {
    thumb: string;
    original: string;
    originalSize: string;
  };
  customLabel: {
    name: string;
    iconUrl: string;
  };
  subSections: Array<SubSectionClassInterface>;
  subSectionGroups: {
    id: string;
    name: string;
    subSections: Array<SubSectionClassInterface>;
  }[];
  quantity: number;
  constructor(menuData: MenuInterface) {
    this.id = typeof menuData.id === "number" ? menuData.id : 0;
    this.name = typeof menuData.name === "string" ? menuData.name : "";
    this.price =
      typeof menuData.price === "string" || typeof menuData.price === "number"
        ? convertToNumber(menuData.price)
        : 0;
    this.currency =
      typeof menuData.currency === "string" ? menuData.currency : "";
    this.priority =
      typeof menuData.priority === "number" ? menuData.priority : 0;
    this.description =
      typeof menuData.description === "string" ? menuData.description : "";
    this.image = {
      thumb: menuData.image?.thumb || "",
      original: menuData.image?.original || "",
      originalSize: menuData.image?.originalSize || "",
    };
    this.customLabel = {
      name: menuData.customLabel?.name || "",
      iconUrl: menuData.customLabel?.iconUrl || "",
    };
    this.subSections = [];
    this.subSectionGroups = [];
    this.active = typeof menuData.active === "boolean" ? menuData.active : true;
    if (Array.isArray(menuData.subSections)) {
      menuData.subSections.forEach((subSection) => {
        this.subSections.push(new SubSection(subSection));
      });
      this.pushSubSectionGroups();
    }
    this.quantity = 0;
  }

  increaseQuantity(quantity?: number): void {
    if (typeof quantity === "number" && quantity >= 0) {
      this.quantity = this.quantity + quantity;
    } else {
      this.quantity = this.quantity + 1;
    }
    if (this.isHaveSubSections()) {
      this.subSections.forEach((subSection) => {
        subSection.setTotalQuantityLimit(this.quantity);
      });

      this.pushSubSectionGroups();
    }
  }

  decreaseQuantity(quantity = 1): void {
    if (this.quantity < 0) {
      return;
    }
    if (typeof quantity === "number" && quantity >= 0) {
      const newQuantity = this.quantity - quantity;
      this.quantity = newQuantity >= 0 ? newQuantity : 0;
    } else {
      this.quantity = this.quantity - 1;
    }
    if (this.quantity === 0) {
      this.onZeroQuantity();
    } else if (this.isHaveSubSections()) {
      this.subSections.forEach((subSection) => {
        subSection.setTotalQuantityLimit(this.quantity);
      });

      this.popsubSectionGroups();
    }
  }

  setQuantity(quantity: number): void {
    if (typeof quantity === "number") {
      this.quantity = quantity;
      if (this.quantity === 0) {
        this.onZeroQuantity();
      } else {
        this.subSections.forEach((subSection) => {
          subSection.setTotalQuantityLimit(this.quantity);
        });
      }
    }
  }

  isSelected(): true | false {
    return this.quantity > 0;
  }

  isHavePrice(): true | false {
    return this.price > 0 ? true : false;
  }

  isHaveImage(): true | false {
    if (isEmpty(this.image)) {
      return false;
    }
    return this.image.original && this.image.original.length ? true : false;
  }

  isHaveCustomLabel(): true | false {
    if (isEmpty(this.customLabel)) {
      return false;
    }
    return this.customLabel.iconUrl &&
      this.customLabel.iconUrl.length &&
      this.customLabel.name &&
      this.customLabel.name.length
      ? true
      : false;
  }

  getCustomLabel(): {
    name: string;
    iconUrl: string;
  } {
    return this.customLabel;
  }

  getImage(): string {
    if (this.isHaveImage()) {
      return this.image.original;
    }
    return "";
  }

  isShowImage(): true | false {
    if (this.isHaveImage()) {
      const img = this.getImage();
      return img.includes("default-menu") ? false : true;
    }
    return false;
  }

  isHaveSubSections(): true | false {
    return this.subSections.length > 0 ? true : false;
  }

  getSubSections(subSectionId?: number): Array<SubSectionClassInterface> {
    if (this.isHaveSubSections() === false) {
      return [];
    }
    if (typeof subSectionId === "number") {
      return this.subSections.filter(
        (subSection) => subSection.id === subSectionId
      );
    }
    return this.subSections;
  }

  isSubSectionsHaveValidQuantity(subSectionId?: number): true | false {
    if (!this.isHaveSubSections()) {
      return true;
    }
    if (typeof subSectionId === "number") {
      const selectedSubSection = this.subSections.filter(
        (subSection) => subSection.id === subSectionId
      );
      if (selectedSubSection.length) {
        return selectedSubSection[0].isHaveValidQuantity() === true
          ? true
          : false;
      }
    }
    const invalidSubSections = this.subSections.filter(
      (subSection) => subSection.isHaveValidQuantity() === false
    );
    return invalidSubSections.length === 0 ? true : false;
  }

  // return allowed max quantity of sub menu in all sub sections of menu
  maxSelectedSubMenuQuantity(): number {
    let maxSelectedSubMenuQuantity = 0;
    if (!this.isHaveSubSections) {
      return maxSelectedSubMenuQuantity;
    }
    this.getSubSections().forEach((subSection) => {
      maxSelectedSubMenuQuantity += subSection.totalQuantityLimit;
    });
    return maxSelectedSubMenuQuantity;
  }

  // return total selected sub menu in all sections of menu
  currentSelectedMenuQuantity(): number {
    let currentSelected = 0;
    if (!this.isHaveSubSections) {
      return currentSelected;
    }
    this.getSubSections().forEach((subSection) => {
      const subSectionSelectedSubMenuQuantity =
        subSection.getTotalSelectedSubMenus();
      currentSelected += subSectionSelectedSubMenuQuantity;
    });
    return currentSelected;
  }

  pushSubSectionGroups() {
    const clonedSubSection = cloneDeep(this.subSections);
    clonedSubSection.forEach((subSection) => {
      subSection.subMenus.forEach((subMenu) => {
        subMenu.setQuantity(0);
      });
    });

    const subSectionGroup = {
      id: `Portion-${this.subSectionGroups.length + 1}`,
      name: `Portion-${this.subSectionGroups.length + 1}`,
      subSections: clonedSubSection,
    };
    this.subSectionGroups.push(subSectionGroup);
  }

  popsubSectionGroups() {
    this.subSectionGroups.pop();
  }

  private onZeroQuantity(): void {
    this.subSections.forEach((subSection) => {
      subSection.setTotalQuantityLimit(0);
      subSection.clearSubMenusQuantity();
    });
    this.subSectionGroups = [];
  }
}

export default Menu;
