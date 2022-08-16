import { SubMenuClassInterface } from "@/types/SubMenuInterface";

export default class SubMenu implements SubMenuClassInterface {
  id: number;
  name: string;
  quantity: number;
  constructor(subMenuData: { id: number; name: string }) {
    this.id = typeof subMenuData.id === "number" ? subMenuData.id : 0;
    this.name = typeof subMenuData.name === "string" ? subMenuData.name : "";
    this.quantity = 0;
  }

  isSelected() {
    return this.quantity > 0 ? true : false;
  }

  increaseQuantity(quantity?: number): void {
    if (typeof quantity === "number") {
      this.quantity = this.quantity + quantity;
      return;
    }
    this.quantity = this.quantity + 1;
    return;
  }

  decreaseQuantity(quantity?: number): void {
    if (this.quantity <= 0) {
      return;
    }
    if (typeof quantity === "number") {
      let newQuantity = 0;
      newQuantity = this.quantity - quantity;
      this.quantity = newQuantity > 0 ? newQuantity : 0;
      return;
    }
    this.quantity = this.quantity - 1;
  }

  setQuantity(quantity: number): void {
    if (typeof quantity === "number") {
      this.quantity = quantity > 0 ? quantity : 0;
    }
  }
}
