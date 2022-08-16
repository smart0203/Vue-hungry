export interface SubMenuInterface {
  name: string;
  id: number;
}
export interface SubMenuClassInterface extends SubMenuInterface {
  quantity: number;
  isSelected(): true | false;
  increaseQuantity(quantity?: number): void;
  decreaseQuantity(quantity?: number): void;
  setQuantity(quantity: number): void;
}
