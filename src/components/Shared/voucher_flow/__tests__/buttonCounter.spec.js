import { mount } from "@vue/test-utils";
import ButtonCounter from "../ButtonCounter.vue";

let buttonIncrease;
let buttonDecrease;
let val;
let wrapper;

beforeAll(() => {
  wrapper = mount(ButtonCounter, {
    propsData: {
      quantity: 1,
    },
  });
  buttonIncrease = wrapper.find(".button-counter-increase");
  buttonDecrease = wrapper.find(".button-counter-decrease");
  val = wrapper.find(".button-counter-val");
});
test("is component mounted correctly", () => {
  expect(buttonIncrease.isVisible()).toBe(true);
  expect(buttonDecrease.isVisible()).toBe(true);
  expect(val.text()).toBe("1");
});
test("should component emit event correctly", () => {
  buttonIncrease.trigger("click");
  expect(wrapper.emitted("on-increase")).toBeTruthy();
  buttonDecrease.trigger("click");
  expect(wrapper.emitted("on-decrease")).toBeTruthy();
});
