import { numberFormatThousand } from "../stringHelper";

it("should return number with thousand format", () => {
  expect(numberFormatThousand(999)).toBe("999");
  expect(numberFormatThousand(999000)).toBe("999,000");
  expect(numberFormatThousand("999")).toBe("999");
  expect(numberFormatThousand("999aaaaa000")).toBe("999,000");
  expect(numberFormatThousand("999 Baht")).toBe("999");
  expect(numberFormatThousand("999.000")).toBe("999");
  expect(numberFormatThousand("999.000,00")).toBe("999");
  expect(numberFormatThousand("999,000,00")).toBe("99,900,000");
  expect(numberFormatThousand("999+000")).toBe("999,000");
  expect(numberFormatThousand(+999)).toBe("999");
});

it("should return string 0 if boolean is passed", () => {
  expect(numberFormatThousand(true)).toBe("0");
  expect(numberFormatThousand(false)).toBe("0");
});

it("should return string 0 if Array is passed", () => {
  expect(numberFormatThousand([])).toBe("0");
});

it("should return string 0 if Object is passed", () => {
  expect(numberFormatThousand({})).toBe("0");
});
