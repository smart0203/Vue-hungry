jest.unmock("lodash-es");
import Menu from "../menu";
import { SubSectionInterface } from "../../types/SubSectionInterface";

let defaultAttr = {
  active: true,
  quantity: 0,
  id: 0,
  name: "",
  price: 0,
  currency: "",
  priority: 0,
  description: "",

  image: {
    thumb: "",
    original: "",
    originalSize: "",
  },
  customLabel: {
    name: "",
    iconUrl: "",
  },
  subSections: [] as Array<SubSectionInterface>,
};

describe("increaseQuantity", () => {
  describe("should have correct quantity", () => {
    it("should have 10 quantity by passing 10 ", () => {
      const menu = new Menu(defaultAttr);
      menu.increaseQuantity(10);
      expect(menu.quantity).toBe(10);
    });

    it("should increase quantity by 1 when not passing parameter", () => {
      const menu = new Menu(defaultAttr);
      menu.increaseQuantity();
      expect(menu.quantity).toBe(1);
    });

    it("should increase quantity by 1 when passing negative number ", () => {
      const menu = new Menu(defaultAttr);
      menu.increaseQuantity(-999);
      expect(menu.quantity).toBe(1);
    });

    it("should not increase quantity when passing 0 ", () => {
      const menu = new Menu(defaultAttr);
      menu.increaseQuantity(0);
      expect(menu.quantity).toBe(0);
    });

    it("should increase quantity as much as parameter", () => {
      const menu = new Menu(defaultAttr);
      menu.increaseQuantity(9);
      expect(menu.quantity).toBe(9);
    });
  });

  it("subSections should have correct totalQuantityLimit", () => {
    const attributes = { ...defaultAttr };
    attributes.subSections = [
      { id: 0, name: "sub section 1", quantityLimit: 1, subMenus: [] },
      { id: 1, name: "sub section 2", quantityLimit: 1, subMenus: [] },
    ];
    const menu = new Menu(attributes);
    menu.increaseQuantity(2);
    expect(menu.getSubSections()).toMatchObject([
      {
        id: 0,
        name: "sub section 1",
        quantityLimit: 1,
        totalQuantityLimit: 2,
        subMenus: [],
      },
      {
        id: 1,
        name: "sub section 2",
        quantityLimit: 1,
        totalQuantityLimit: 2,
        subMenus: [],
      },
    ]);
  });
});

describe("decreaseQuantity", () => {
  describe("should have correct quantity", () => {
    it("should have quantity not less than 0", () => {
      const menu = new Menu(defaultAttr);
      menu.decreaseQuantity();
      menu.decreaseQuantity();
      menu.decreaseQuantity();
      expect(menu.quantity).toBe(0);
    });

    it("should reduce quantity by 1 when not passing parameter ", () => {
      const menu = new Menu(defaultAttr);
      menu.quantity = 5;
      menu.decreaseQuantity();
      expect(menu.quantity).toBe(4);
    });

    it("should not reduce quantity when passing 0 as parameter ", () => {
      const menu = new Menu(defaultAttr);
      menu.quantity = 5;
      menu.decreaseQuantity(0);
      expect(menu.quantity).toBe(5);
    });

    it("should reduce quantity as much as paramater", () => {
      const menu = new Menu(defaultAttr);
      menu.quantity = 5;
      menu.decreaseQuantity(2);
      expect(menu.quantity).toBe(3);
    });

    it("should reduce quantity by when passing negative number as paramater", () => {
      const menu = new Menu(defaultAttr);
      menu.quantity = 5;
      menu.decreaseQuantity(-2);
      expect(menu.quantity).toBe(4);
    });
  });

  describe("subSection should have correct totalQuantityLimit", () => {
    it("should reduce totalQuantityLimit by 1 when call decreaseQuantity without pass parameter", () => {
      const attributes = { ...defaultAttr };
      attributes.subSections = [
        { id: 0, name: "sub section 1", quantityLimit: 1, subMenus: [] },
        { id: 1, name: "sub section 2", quantityLimit: 1, subMenus: [] },
      ];
      const menu = new Menu(attributes);
      menu.setQuantity(4);
      menu.decreaseQuantity();
      expect(menu.getSubSections()).toMatchObject([
        {
          id: 0,
          name: "sub section 1",
          quantityLimit: 1,
          totalQuantityLimit: 3,
          subMenus: [],
        },
        {
          id: 1,
          name: "sub section 2",
          quantityLimit: 1,
          totalQuantityLimit: 3,
          subMenus: [],
        },
      ]);
    });

    it("should reduce totalQuantityLimit by as much as paramater when call decreaseQuantity with parameter", () => {
      const attributes = { ...defaultAttr };
      attributes.subSections = [
        { id: 0, name: "sub section 1", quantityLimit: 1, subMenus: [] },
        { id: 1, name: "sub section 2", quantityLimit: 1, subMenus: [] },
      ];
      const menu = new Menu(attributes);
      menu.setQuantity(4);
      menu.decreaseQuantity(2);
      expect(menu.getSubSections()).toMatchObject([
        {
          id: 0,
          name: "sub section 1",
          quantityLimit: 1,
          totalQuantityLimit: 2,
          subMenus: [],
        },
        {
          id: 1,
          name: "sub section 2",
          quantityLimit: 1,
          totalQuantityLimit: 2,
          subMenus: [],
        },
      ]);
    });
  });
});

describe("on menu quantity become 0", () => {
  it("should reduce all sub menu quantity become 0", () => {
    const attributes = { ...defaultAttr };
    attributes.subSections = [
      {
        id: 0,
        name: "sub section 1",
        quantityLimit: 1,
        subMenus: [
          { id: 0, name: "sub menu 1" },
          { id: 1, name: "sub menu 2" },
        ],
      },
      {
        id: 1,
        name: "sub section 1",
        quantityLimit: 1,
        subMenus: [{ id: 0, name: "sub menu 1" }],
      },
    ];
    const menu = new Menu(attributes);
    menu.increaseQuantity();
    menu.subSections[0].subMenus[0].increaseQuantity(1);
    menu.subSections[1].subMenus[0].increaseQuantity(2);
    menu.decreaseQuantity();
    expect(menu.getSubSections()).toMatchObject([
      {
        id: 0,
        name: "sub section 1",
        quantityLimit: 1,
        totalQuantityLimit: 1,
        subMenus: [
          { id: 0, name: "sub menu 1", quantity: 0 },
          { id: 1, name: "sub menu 2", quantity: 0 },
        ],
      },
      {
        id: 1,
        name: "sub section 1",
        quantityLimit: 1,
        subMenus: [{ id: 0, name: "sub menu 1", quantity: 0 }],
      },
    ]);
  });
});

describe("getSubSections", () => {
  it("should return empty array if don't have sub section", () => {
    const menu = new Menu(defaultAttr);
    expect(menu.getSubSections()).toMatchObject([]);
  });

  it("should return all sub sections if no paramater", () => {
    const attributes = { ...defaultAttr };
    attributes.subSections = [
      { id: 0, name: "sub section 1", quantityLimit: 1, subMenus: [] },
      { id: 1, name: "sub section 2", quantityLimit: 1, subMenus: [] },
    ];
    const menu = new Menu(attributes);
    expect(menu.getSubSections()).toMatchObject([
      {
        id: 0,
        name: "sub section 1",
        quantityLimit: 1,
        totalQuantityLimit: 1,
        subMenus: [],
      },
      {
        id: 1,
        name: "sub section 2",
        quantityLimit: 1,
        totalQuantityLimit: 1,
        subMenus: [],
      },
    ]);
  });

  it("should return correct sub section with requested id", () => {
    const attributes = { ...defaultAttr };
    attributes.subSections = [
      { id: 0, name: "sub section 1", quantityLimit: 1, subMenus: [] },
      { id: 1, name: "sub section 2", quantityLimit: 1, subMenus: [] },
    ];
    const menu = new Menu(attributes);
    expect(menu.getSubSections(0)).toMatchObject([
      {
        id: 0,
        name: "sub section 1",
        quantityLimit: 1,
        totalQuantityLimit: 1,
        subMenus: [],
      },
    ]);
  });
});

describe("isSubSectionsHaveValidQuantity", () => {
  it("should return true if don't have sub sections", () => {
    const menu = new Menu(defaultAttr);
    expect(menu.isSubSectionsHaveValidQuantity()).toBe(true);
  });

  it("should return boolean of sub section quantity validity with", () => {
    const attributes = { ...defaultAttr };
    attributes.subSections = [
      {
        id: 0,
        name: "sub section",
        quantityLimit: 1,
        subMenus: [
          { id: 0, name: "sub menu 1" },
          { id: 1, name: "sub menu 2" },
        ],
      },
    ];
    const menu = new Menu(attributes);
    menu.setQuantity(1);
    menu.subSections[0].subMenus[0].increaseQuantity();
    menu.subSections[0].subMenus[1].increaseQuantity();

    expect(menu.isSubSectionsHaveValidQuantity(0)).toBeBoolean();
  });
});

describe("maxSelectedSubMenuQuantity", () => {
  it("should return 0 if don't have sub sections", () => {
    const menu = new Menu(defaultAttr);
    expect(menu.maxSelectedSubMenuQuantity()).toBe(0);
  });

  it("should return correct value", () => {
    const attributes = { ...defaultAttr };
    attributes.subSections = [
      { id: 0, name: "sub section 1", quantityLimit: 1, subMenus: [] },
      { id: 1, name: "sub section 2", quantityLimit: 1, subMenus: [] },
      { id: 2, name: "sub section 3", quantityLimit: 1, subMenus: [] },
    ];
    const menu = new Menu(attributes);
    expect(menu.maxSelectedSubMenuQuantity()).toBe(3);
  });
});

describe("currentSelectedMenuQuantity", () => {
  it("should return 0 if don't have sub sections", () => {
    const menu = new Menu(defaultAttr);
    expect(menu.maxSelectedSubMenuQuantity()).toBe(0);
  });

  it("should return correct value", () => {
    const attributes = { ...defaultAttr };
    attributes.subSections = [
      {
        id: 0,
        name: "sub section 1",
        quantityLimit: 1,
        subMenus: [
          { id: 0, name: "sub menu 1" },
          { id: 1, name: "sub menu 2" },
          { id: 2, name: "sub menu 3" },
          { id: 3, name: "sub menu 4" },
        ],
      },
    ];
    const menu = new Menu(attributes);
    menu.subSections[0].subMenus[0].increaseQuantity();
    menu.subSections[0].subMenus[0].increaseQuantity();
    menu.subSections[0].subMenus[1].increaseQuantity();
    menu.subSections[0].subMenus[2].increaseQuantity();
    menu.subSections[0].subMenus[3].increaseQuantity();

    expect(menu.currentSelectedMenuQuantity()).toBe(5);
  });
});
