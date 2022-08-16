import Pack from "./pack";
import { PackClassInterface, PackInterface } from "@/types/PackInterface";
import PackRuleType from "@/types/PackRuleType";
import { MenuSectionClassInterface } from "@/types/MenuSectionInterface";
import MenuSection from "./menuSection";
import { reactive } from "@vue/composition-api";
import rollbar from "@/lib/rollbar";
// @ts-ignore
import { packagePrice } from "@/helper/PackageHelper";

class HahPackages extends Pack implements PackClassInterface {
  constructor(data: PackInterface) {
    super(data);
    let sections: Array<MenuSectionClassInterface> = [];
    data.menuSections.forEach((section) => {
      sections.push(reactive(new MenuSection(section)));
    });
    this.menuSections = sections;
  }

  increasePackageQuantity(quantity?: number) {
    if (typeof quantity === "number") {
      this.quantity = quantity;
    } else {
      this.quantity = this.quantity + 1;
    }
    this.menuSections.forEach((section) => {
      section.setTotalQuantityLimit(this.quantity);
      if (section.isHaveMenu()) {
        const totalQuantityLimit = section.getTotalQuantityLimit();
        // if section only have one menu, then select it automatically
        if (section.menus.length === 1) {
          section.menus[0].setQuantity(totalQuantityLimit);
        }
      }
    });
  }

  decreasePackageQuantity(quantity?: number): void {
    if (this.quantity <= 0) {
      return;
    }
    if (typeof quantity === "number") {
      this.quantity = quantity;
    } else {
      this.quantity = this.quantity - 1;
    }
    this.menuSections.forEach((section) => {
      section.setTotalQuantityLimit(this.quantity);
      section.menus.forEach((menu) => {
        menu.setQuantity(0);
      });
    });
  }

  getSelectedPricingRule(): PackRuleType {
    const rules = this.rules;
    // warn if hah package have rule more than 1
    if (rules.length > 1) {
      rollbar.warn(
        `${this.name} is hungry at home package, and usually have 1 rule`
      );
    }
    const selectedRule = rules[0];
    return selectedRule;
  }

  getPackagePrice(
    adultPax?: number,
    kidsPax?: number
  ): { adult: number; kids: number } {
    const { adult, kids } = packagePrice(
      { adult: adultPax, kids: kidsPax },
      this.rules,
      this.quantity
    );
    return {
      adult,
      kids,
    };
  }

  // section
  isHaveSection(): true | false {
    if (!this.menuSections) {
      return false;
    }
    return this.menuSections.length > 0 ? true : false;
  }

  getSections(sectionId?: number): Array<MenuSectionClassInterface> {
    if (!this.isHaveSection()) {
      return [];
    }
    if (sectionId) {
      return this.menuSections.filter((section) => section.id === sectionId);
    }
    return this.menuSections;
  }

  getSectionsWithSelectedMenus(): Array<MenuSectionClassInterface> {
    if (!this.isHaveSection()) {
      return [];
    }
    const sectionWithSelectedMenu = this.menuSections.filter((section) => {
      const selectedMenuInSection = section.getSelectedMenu();
      return selectedMenuInSection.length ? true : false;
    });
    return sectionWithSelectedMenu;
  }

  isSectionHaveValidQuantity(sectionId?: number): true | false {
    if (!this.isHaveSection()) {
      return true;
    }
    if (sectionId) {
      const selectedSection = this.menuSections.filter(
        (section) => section.id === sectionId
      );
      if (selectedSection.length) {
        return selectedSection[0].isHaveValidQuantity() === true ? true : false;
      }
    }
    const invalidSection = this.menuSections.filter(
      (section) => section.isHaveValidQuantity() === false
    );
    return invalidSection.length === 0 ? true : false;
  }

  isHaveMenu(): true | false {
    if (!this.isHaveSection()) {
      return false;
    }
    const sections = this.menuSections;
    if (sections.length == 0) {
      return false;
    }
    const sectionWithMenu = sections.filter((section) => section.isHaveMenu());
    return sectionWithMenu.length > 0 ? true : false;
  }

  isQuantityValid(): true | false {
    // hungry at home always have valid quantity
    return true;
  }

  // return max quantity of menu allowed in all section of package
  maxSelectedMenuQuantity(): number {
    let maxSelectedMenuQuantity = 0;
    if (!this.isHaveSection) {
      return maxSelectedMenuQuantity;
    }
    this.getSections().forEach((section) => {
      maxSelectedMenuQuantity += section.totalQuantityLimit;
    });
    return maxSelectedMenuQuantity;
  }

  // return total selected menu in all sections of package
  currentSelectedMenuQuantity(): number {
    let currentSelected = 0;
    if (!this.isHaveSection) {
      return currentSelected;
    }
    this.getSections().forEach((section) => {
      const sectionSelectedMenuQuantity = section.getTotalSelectedMenu();
      currentSelected += sectionSelectedMenuQuantity;
    });
    return currentSelected;
  }
}

export default HahPackages;
