import SubSection from "../subSection";

it("should have valid quantity limit", () => {
  const data = {
    name: "",
    id: 0,
    quantityLimit: 0,
    subMenus: [],
  };
  const subSection = new SubSection(data);
  expect(subSection.quantityLimit).toBe(1);
});

it("should have valid totalQuantityLimit", () => {
  const data = {
    name: "",
    id: 0,
    quantityLimit: 1,
    subMenus: [],
  };
  const subSection = new SubSection(data);
  subSection.setTotalQuantityLimit(1);
  expect(subSection.totalQuantityLimit).toBe(1);

  subSection.setTotalQuantityLimit(3);
  expect(subSection.totalQuantityLimit).toBe(3);

  subSection.setTotalQuantityLimit(0);
  expect(subSection.totalQuantityLimit).toBe(1);

  subSection.setTotalQuantityLimit(-10);
  expect(subSection.totalQuantityLimit).toBe(1);

  data.quantityLimit = 5;
  const subSection2 = new SubSection(data);
  subSection2.setTotalQuantityLimit(2);
  expect(subSection2.totalQuantityLimit).toBe(2);

  subSection2.setTotalQuantityLimit(-1);
  expect(subSection2.totalQuantityLimit).toBe(1);
});

describe("isHaveSubMenus", () => {
  it("should return true if sub menus data is passed", () => {
    const data = {
      name: "",
      id: 0,
      quantityLimit: 0,
      subMenus: [{ id: 0, name: "" }],
    };
    const subSection = new SubSection(data);
    expect(subSection.isHaveSubMenus()).toBe(true);
  });

  it("should return false if no sub menus data is passed", () => {
    const data = {
      name: "",
      id: 0,
      quantityLimit: 0,
      subMenus: [],
    };
    const subSection = new SubSection(data);
    expect(subSection.isHaveSubMenus()).toBe(false);
  });
});

describe("getSubMenus", () => {
  it("should return empty array if sub menus with requested id not found", () => {
    const data = {
      name: "",
      id: 0,
      quantityLimit: 0,
      subMenus: [{ id: 0, name: "" }],
    };
    const subSection = new SubSection(data);
    expect(subSection.getSubMenus(23)).toStrictEqual([]);
  });

  it("should return all sub menus if no parameter is passed", () => {
    const data = {
      name: "",
      id: 0,
      quantityLimit: 0,
      subMenus: [
        { id: 0, name: "sub menu 1" },
        { id: 1, name: "sub menu 2" },
      ],
    };
    const subSection = new SubSection(data);
    expect(subSection.getSubMenus()).toMatchObject([
      { id: 0, name: "sub menu 1", quantity: 0 },
      { id: 1, name: "sub menu 2", quantity: 0 },
    ]);
  });

  it("should return correct sub menus with requested id", () => {
    const data = {
      name: "",
      id: 0,
      quantityLimit: 0,
      subMenus: [
        { id: 0, name: "sub menu 1" },
        { id: 1, name: "sub menu 2" },
      ],
    };
    const subSection = new SubSection(data);
    expect(subSection.getSubMenus(0)).toMatchObject([
      { id: 0, name: "sub menu 1", quantity: 0 },
    ]);
  });
});

describe("getSelectedSubMenus", () => {
  it("should return correct selected sub menus", () => {
    const data = {
      name: "",
      id: 0,
      quantityLimit: 0,
      subMenus: [
        { id: 0, name: "sub menu 1" },
        { id: 1, name: "sub menu 2" },
        { id: 2, name: "sub menu 3" },
      ],
    };
    const subSection = new SubSection(data);
    subSection.subMenus[0].increaseQuantity();
    subSection.subMenus[1].increaseQuantity();
    expect(subSection.getSelectedSubMenus()).toMatchObject([
      { id: 0, name: "sub menu 1", quantity: 1 },
      { id: 1, name: "sub menu 2", quantity: 1 },
    ]);
  });

  it("should return empty array because sub section don't have sub menus", () => {
    const data = {
      name: "",
      id: 0,
      quantityLimit: 0,
      subMenus: [],
    };
    const subSection = new SubSection(data);
    expect(subSection.getSelectedSubMenus()).toMatchObject([]);
  });
});

describe("getTotalSelectedSubMenus", () => {
  it("should return 0 because sub section don't have sub menus", () => {
    const data = {
      name: "",
      id: 0,
      quantityLimit: 0,
      subMenus: [],
    };
    const subSection = new SubSection(data);
    expect(subSection.getTotalSelectedSubMenus()).toBe(0);
  });

  it("should return correct total selected sub menus quantity", () => {
    const data = {
      name: "",
      id: 0,
      quantityLimit: 0,
      subMenus: [
        { id: 0, name: "sub menu 1" },
        { id: 1, name: "sub menu 2" },
        { id: 2, name: "sub menu 3" },
      ],
    };
    const subSection = new SubSection(data);
    subSection.subMenus[0].setQuantity(2);
    subSection.subMenus[1].setQuantity(1);
    expect(subSection.getTotalSelectedSubMenus()).toBe(3);

    subSection.subMenus[0].setQuantity(0);
    subSection.subMenus[1].setQuantity(0);
    expect(subSection.getTotalSelectedSubMenus()).toBe(0);
  });
});

describe("getRemainingQuantity", () => {
  it("should return correct remaining quantity", () => {
    const data = {
      name: "",
      id: 0,
      quantityLimit: 10,
      subMenus: [
        { id: 0, name: "sub menu 1" },
        { id: 1, name: "sub menu 2" },
        { id: 2, name: "sub menu 3" },
      ],
    };
    const subSection = new SubSection(data);
    subSection.subMenus[0].setQuantity(2);
    subSection.subMenus[1].setQuantity(1);
    expect(subSection.getRemainingQuantity()).toBe(-2);

    subSection.subMenus[0].setQuantity(11);
    subSection.subMenus[1].setQuantity(20);
    expect(subSection.getRemainingQuantity()).toBe(-30);

    data.quantityLimit = 1;
    const subSection2 = new SubSection(data);
    subSection2.subMenus[0].setQuantity(0);
    subSection2.subMenus[1].setQuantity(0);
    subSection2.subMenus[2].setQuantity(0);
    expect(subSection2.getRemainingQuantity()).toBe(1);
  });
});

describe("isHaveValidQuantity", () => {
  it("should return correct value", () => {
    const data = {
      name: "",
      id: 0,
      quantityLimit: 10,
      subMenus: [
        { id: 0, name: "sub menu 1" },
        { id: 1, name: "sub menu 2" },
        { id: 2, name: "sub menu 3" },
      ],
    };
    const subSection = new SubSection(data);
    subSection.subMenus[0].setQuantity(2);
    subSection.subMenus[1].setQuantity(1);
    expect(subSection.isHaveValidQuantity()).toBe(false);

    subSection.subMenus[0].setQuantity(11);
    subSection.subMenus[1].setQuantity(20);
    expect(subSection.isHaveValidQuantity()).toBe(false);

    data.quantityLimit = 1;
    const subSection2 = new SubSection(data);
    subSection2.subMenus[0].setQuantity(1);
    expect(subSection2.isHaveValidQuantity()).toBe(true);
  });
});

describe("clearSubMenusQuantity", () => {
  it("should all sub menus have 0 quantity", () => {
    const data = {
      name: "",
      id: 0,
      quantityLimit: 10,
      subMenus: [
        { id: 0, name: "sub menu 1" },
        { id: 1, name: "sub menu 2" },
        { id: 2, name: "sub menu 3" },
      ],
    };
    const subSection = new SubSection(data);
    subSection.subMenus[0].setQuantity(2);
    subSection.subMenus[1].setQuantity(1);
    subSection.clearSubMenusQuantity();
    expect(subSection.getSubMenus()).toMatchObject([
      { id: 0, name: "sub menu 1", quantity: 0 },
      { id: 1, name: "sub menu 2", quantity: 0 },
      { id: 2, name: "sub menu 3", quantity: 0 },
    ]);

    subSection.subMenus[0].setQuantity(0);
    subSection.subMenus[1].setQuantity(0);
    expect(subSection.getSubMenus()).toMatchObject([
      { id: 0, name: "sub menu 1", quantity: 0 },
      { id: 1, name: "sub menu 2", quantity: 0 },
      { id: 2, name: "sub menu 3", quantity: 0 },
    ]);
  });
});
