import { SubSectionClassInterface } from "@/types/SubSectionInterface";
import {
  SubMenuInterface,
  SubMenuClassInterface,
} from "@/types/SubMenuInterface";
import SubMenu from "./subMenu";

export default class SubSection implements SubSectionClassInterface {
  name: string;
  id: number;
  quantityLimit: number;
  totalQuantityLimit: number;
  subMenus: Array<SubMenuClassInterface>;
  constructor(subSectionData: {
    name: string;
    id: number;
    quantityLimit: number;
    subMenus: Array<SubMenuInterface>;
  }) {
    this.name =
      typeof subSectionData.name === "string" ? subSectionData.name : "";
    this.id = typeof subSectionData.id === "number" ? subSectionData.id : 0;
    // hardcode quantity limit of sub section to be 1 (requested by backend)
    this.quantityLimit =
      typeof subSectionData.quantityLimit === "number" ? 1 : 1;
    this.totalQuantityLimit = this.quantityLimit;
    this.subMenus = [];
    if (Array.isArray(subSectionData.subMenus)) {
      subSectionData.subMenus.forEach((subMenu) => {
        this.subMenus.push(new SubMenu(subMenu));
      });
    }
  }

  setTotalQuantityLimit(packageQuantity: number) {
    if (typeof packageQuantity === "number") {
      if (packageQuantity <= 0) {
        this.totalQuantityLimit = this.quantityLimit;
      } else {
        this.totalQuantityLimit = this.quantityLimit * packageQuantity;
      }
    }
  }

  isHaveSubMenus(): true | false {
    return this.subMenus.length > 0 ? true : false;
  }

  getSubMenus(subMenuId?: number): Array<SubMenuClassInterface> {
    if (!this.isHaveSubMenus()) {
      return [];
    }
    if (typeof subMenuId === "number") {
      return this.subMenus.filter((subMenu) => subMenu.id === subMenuId);
    }
    return this.subMenus;
  }

  getSelectedSubMenus(): Array<SubMenuClassInterface> {
    if (this.isHaveSubMenus() == false) {
      return [];
    }
    return this.subMenus.filter((subMenu) => subMenu.isSelected());
  }

  getTotalSelectedSubMenus(): number {
    const selectedSubMenus = this.getSelectedSubMenus();
    if (selectedSubMenus.length === 0) {
      return 0;
    }
    const selectedSubMenusQuantity = selectedSubMenus.map(
      (subMenu) => subMenu.quantity
    );
    return selectedSubMenusQuantity.reduce((a, b) => a + b, 0);
  }

  getRemainingQuantity(): number {
    const totalSelectedSubMenus = this.getTotalSelectedSubMenus();
    const remainingQuantity = this.totalQuantityLimit - totalSelectedSubMenus;
    return remainingQuantity;
  }

  isHaveValidQuantity(): true | false {
    return this.getRemainingQuantity() === 0 ? true : false;
  }

  clearSubMenusQuantity(): void {
    this.getSelectedSubMenus().forEach((subMenu) => subMenu.setQuantity(0));
  }
}
