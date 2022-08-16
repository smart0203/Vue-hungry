import subMenu from "../subMenu";

describe("isSelected", () => {
  it("should return isSelected = false if quantity = 0", () => {
    const data = {
      name: "",
      id: 0,
    };
    const instance = new subMenu(data);
    expect(instance.isSelected()).toBe(false);
    instance.quantity = 0;
    expect(instance.isSelected()).toBe(false);
  });

  it("should return isSelected = true if quantity > 0", () => {
    const data = {
      name: "",
      id: 0,
    };
    const instance = new subMenu(data);
    instance.increaseQuantity();
    expect(instance.isSelected()).toBe(true);
    instance.increaseQuantity();
    instance.increaseQuantity();
    instance.increaseQuantity();
    expect(instance.isSelected()).toBe(true);
  });
});

it("should have correct quantity after call decreaseQuantity ", () => {
  const data = {
    name: "",
    id: 0,
  };
  const instance = new subMenu(data);
  instance.quantity = 0;
  instance.decreaseQuantity(10);
  expect(instance.quantity).toBe(0);

  instance.quantity = 1;
  instance.decreaseQuantity();
  expect(instance.quantity).toBe(0);
});

it("should have correct quantity after call increaseQuantity ", () => {
  const data = {
    name: "",
    id: 0,
  };
  const instance = new subMenu(data);
  instance.increaseQuantity();
  expect(instance.quantity).toBe(1);

  instance.quantity = 0;
  instance.increaseQuantity();
  instance.increaseQuantity();
  expect(instance.quantity).toBe(2);
});

it("should have correct quantity after call setQuantity ", () => {
  const data = {
    name: "",
    id: 0,
  };
  const instance = new subMenu(data);
  instance.setQuantity(1);
  expect(instance.quantity).toBe(1);

  instance.setQuantity(100);
  expect(instance.quantity).toBe(100);

  instance.setQuantity(-100);
  expect(instance.quantity).toBe(0);
});
