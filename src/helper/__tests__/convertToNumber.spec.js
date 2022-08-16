import { convertToNumber } from "../stringHelper";

it("should return number", () => {
  expect(convertToNumber(999)).toBe(999);
  expect(convertToNumber("999")).toBe(999);
  expect(convertToNumber("999aaaaa")).toBe(999);
  expect(convertToNumber("99bbb9")).toBe(999);
  expect(convertToNumber("aaaa999")).toBe(999);
  expect(convertToNumber("999 Baht")).toBe(999);
  expect(convertToNumber("999.000")).toBe(999);
  expect(convertToNumber("999.000,00")).toBe(999);
  expect(convertToNumber("999,000,00")).toBe(99900000);
  expect(convertToNumber("999+000")).toBe(999000);
  expect(convertToNumber(+999)).toBe(+999);
});

it("should return 0 if boolean is passed", () => {
  expect(convertToNumber(true)).toBe(0);
  expect(convertToNumber(false)).toBe(0);
});

it("should return 0 if Array is passed", () => {
  expect(convertToNumber([])).toBe(0);
});

it("should return 0 if Object is passed", () => {
  expect(convertToNumber({})).toBe(0);
});
