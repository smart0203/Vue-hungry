import Pack from "./pack";
import { PackInterface, PackClassInterface } from "@/types/PackInterface";
import PackRuleType from "@/types/PackRuleType";
import { MenuSectionClassInterface } from "@/types/MenuSectionInterface";
import { reactive } from "@vue/composition-api";
import MenuSection from "./menuSection";
import rollbar from "@/lib/rollbar";

class AlaCartePackages extends Pack implements PackClassInterface {
  constructor(data: PackInterface) {
    super(data);
    this.isAlaCarte = true;
    let sections: Array<MenuSectionClassInterface> = [];
    data.menuSections.forEach((section) => {
      sections.push(reactive(new MenuSection(section)));
    });
    this.menuSections = sections;
  }

  getSelectedPricingRule(): PackRuleType {
    const rules = this.rules;
    // warn if hah package have rule more than 1
    if (rules.length > 1) {
      rollbar.warn(
        `${this.name} is ala carte package, and usually have 1 rule`
      );
    }
    const selectedRule = rules[0];
    return selectedRule;
  }

  getPackagePrice(): { adult: number; kids: number } {
    const selectedRule = this.getSelectedPricingRule();
    const price = selectedRule.price.replace(",", "");
    return {
      adult: parseFloat(price),
      kids: 0,
    };
  }

  isHaveSection(): true {
    return true;
  }

  isHaveMenu(): true {
    return true;
  }

  isQuantityValid(): true {
    return true;
  }

  increasePackageQuantity(): void {
    this.quantity = 1;
  }

  decreasePackageQuantity(): void {
    this.quantity = 0;
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
    // alacarte package don't care about section quantity valid or not
    return true;
  }

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

  maxSelectedMenuQuantity(): number {
    return this.currentSelectedMenuQuantity();
  }
}

export default AlaCartePackages;
