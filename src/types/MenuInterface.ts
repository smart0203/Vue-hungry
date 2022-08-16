import {
  SubSectionClassInterface,
  SubSectionInterface,
} from "./SubSectionInterface";
export interface MenuInterface {
  readonly id: number;
  readonly name: string;
  readonly active: boolean;
  price: number;
  readonly currency: string;
  readonly priority: number;
  readonly description: string;
  readonly image: {
    readonly thumb: string;
    readonly original: string;
    readonly originalSize: string;
  };
  readonly customLabel: {
    readonly name: string;
    readonly iconUrl: string;
  };
  subSections: Array<SubSectionInterface>;
}
export interface MenuClassInterface extends MenuInterface {
  quantity: number;
  subSections: Array<SubSectionClassInterface>;
  increaseQuantity(quantity?: number): void;
  decreaseQuantity(quantity?: number): void;
  setQuantity(quantity: number): void;
  isSelected(): true | false;
  isHavePrice(): true | false;
  isHaveImage(): true | false;
  isHaveCustomLabel(): true | false;
  getCustomLabel(): {
    name: string;
    iconUrl: string;
  };
  getImage(): string;
  isShowImage(): true | false;
  isHaveSubSections(): true | false;
  getSubSections(): Array<SubSectionClassInterface>;
  isSubSectionsHaveValidQuantity(): true | false;
  currentSelectedMenuQuantity(): number;
  maxSelectedSubMenuQuantity(): number;
  pushSubSectionGroups(): void;
  popsubSectionGroups(): void;
}
