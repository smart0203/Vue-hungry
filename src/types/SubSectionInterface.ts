import { SubMenuInterface, SubMenuClassInterface } from "./SubMenuInterface";

export interface SubSectionInterface {
  readonly name: string;
  readonly id: number;
  readonly quantityLimit: number;
  readonly subMenus: Array<SubMenuInterface>;
}
export interface SubSectionClassInterface extends SubSectionInterface {
  readonly subMenus: Array<SubMenuClassInterface>;
  totalQuantityLimit: number;
  setTotalQuantityLimit(packageQuantity: number): void;
  isHaveValidQuantity(): true | false;
  getRemainingQuantity(): number;
  getTotalSelectedSubMenus(): number;
  getSelectedSubMenus(): Array<SubMenuClassInterface>;
  getSubMenus(subMenuId?: number): Array<SubMenuClassInterface>;
  isHaveSubMenus(): true | false;
  clearSubMenusQuantity(): void;
}
