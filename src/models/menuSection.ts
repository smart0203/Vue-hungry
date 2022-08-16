import {
  MenuSectionInterface,
  MenuSectionClassInterface,
} from "@/types/MenuSectionInterface";
import { MenuClassInterface } from "@/types/MenuInterface";
import Menu from "./menu";
import { reactive } from "@vue/composition-api";

class MenuSection implements MenuSectionClassInterface {
  id: number;
  quantityLimit: number;
  totalQuantityLimit: number;
  name: string;
  menus: Array<MenuClassInterface>;
  constructor(menuSectionData: MenuSectionInterface) {
    this.id = typeof menuSectionData.id === "number" ? menuSectionData.id : 0;
    this.quantityLimit =
      typeof menuSectionData.quantityLimit === "number"
        ? menuSectionData.quantityLimit
        : 1;
    this.totalQuantityLimit = this.quantityLimit;
    this.name =
      typeof menuSectionData.name === "string" ? menuSectionData.name : "";
    this.menus = [];
    if (Array.isArray(menuSectionData.menus)) {
      menuSectionData.menus.forEach((menu) => {
        this.menus.push(reactive(new Menu(menu)));
      });
    }
  }

  setTotalQuantityLimit(packageQuantity: number): void {
    if (packageQuantity === 0) {
      this.totalQuantityLimit = this.quantityLimit;
      return;
    }
    if (packageQuantity >= 1) {
      this.totalQuantityLimit = this.quantityLimit * packageQuantity;
    }
  }

  getTotalQuantityLimit(): number {
    return this.totalQuantityLimit;
  }

  isHaveMenu(): true | false {
    return this.menus.length ? true : false;
  }

  getMenu(menuId?: number): Array<MenuClassInterface> {
    if (!this.isHaveMenu()) {
      return [];
    }
    if (menuId) {
      return this.menus.filter((menu) => menu.id === menuId);
    }
    return this.menus;
  }

  getSelectedMenu(): Array<MenuClassInterface> {
    if (this.isHaveMenu() == false) {
      return [];
    }
    return this.menus.filter((menu) => menu.isSelected());
  }

  getTotalSelectedMenu(): number {
    const selectedMenusQuantity = this.getSelectedMenu().map(
      (menu) => menu.quantity
    );
    return selectedMenusQuantity.reduce((a, b) => a + b, 0);
  }

  getRemainingQuantity(): number {
    const totalSelectedMenus = this.getTotalSelectedMenu();
    return this.totalQuantityLimit - totalSelectedMenus;
  }

  isHaveValidQuantity(): true | false {
    if (this.isHaveMenu()) {
      const noRemaining = this.getRemainingQuantity() === 0 ? true : false;
      let invalidSubSections = [];

      this.menus.forEach((menu) => {
        if (menu.isHaveSubSections() && menu.isSelected()) {
          if (menu.isSubSectionsHaveValidQuantity() === false) {
            invalidSubSections.push(menu);
          }
        }
      });
      return noRemaining === true && invalidSubSections.length === 0
        ? true
        : false;
    }
    return true;
  }

  clearMenusQuantity(): void {
    this.getSelectedMenu().forEach((menu) => menu.setQuantity(0));
  }
}

export default MenuSection;
