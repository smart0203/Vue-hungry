import Pack from "./pack";
import { PackInterface, PackClassInterface } from "@/types/PackInterface";
import PackRuleType from "@/types/PackRuleType";
import { MenuSectionClassInterface } from "@/types/MenuSectionInterface";
// @ts-ignore
import { packagePrice, packagePricingRule } from "@/helper/PackageHelper";
// @ts-ignore
import { i18n } from "@/lib/i18n/i18n";

class DineInPackages extends Pack implements PackClassInterface {
  constructor(data: PackInterface) {
    super(data);
  }

  increasePackageQuantity(quantity?: number) {
    if (this.maxPackageQuantity - this.quantity === 0) {
      return i18n.t("packageSelectLimit", {
        packageName: this.name,
        quantity: this.quantity,
      });
    }
    if (typeof quantity === "number") {
      this.quantity = quantity;
      return;
    }
    this.quantity = this.quantity + 1;
  }

  decreasePackageQuantity(quantity?: number) {
    if (typeof quantity === "number") {
      this.quantity = quantity;
      return;
    }
    this.quantity = this.quantity - 1;
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

  isQuantityValid(): true | false {
    return true;
  }

  getSelectedPricingRule(adult?: number): PackRuleType {
    return packagePricingRule({ adult: adult || 0 }, this.rules);
  }

  isHaveSection(): false {
    return false;
  }

  getSections(): Array<MenuSectionClassInterface> {
    return [];
  }

  getSectionsWithSelectedMenus(): Array<MenuSectionClassInterface> {
    return [];
  }

  isSectionHaveValidQuantity(): true {
    return true;
  }

  isHaveMenu(): false {
    return false;
  }

  maxSelectedMenuQuantity(): number {
    return 0;
  }

  currentSelectedMenuQuantity(): number {
    return 0;
  }
}

export default DineInPackages;
