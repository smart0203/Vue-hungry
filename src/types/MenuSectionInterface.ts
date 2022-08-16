import { MenuInterface, MenuClassInterface } from "./MenuInterface";

export interface MenuSectionInterface {
  readonly id: number;
  readonly quantityLimit: number;
  readonly name: string;
  readonly menus: Array<MenuInterface>;
}
export interface MenuSectionClassInterface extends MenuSectionInterface {
  totalQuantityLimit: number;
  readonly menus: Array<MenuClassInterface>;
  setTotalQuantityLimit(packageQuantity: number): void;
  getTotalQuantityLimit(): number;
  isHaveMenu(): true | false;
  getMenu(menuId: number): Array<MenuClassInterface> | MenuClassInterface;
  getSelectedMenu(): Array<MenuClassInterface>;
  getTotalSelectedMenu(): number;
  getRemainingQuantity(): number;
  isHaveValidQuantity(): true | false;
  clearMenusQuantity(): void;
}
