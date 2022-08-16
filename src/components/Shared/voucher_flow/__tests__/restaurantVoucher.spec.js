import { mount } from "@vue/test-utils";
import RestaurantVoucher from "../RestaurantVoucher.vue";

test("is component mounted correctly", () => {
  const wrapper = mount(RestaurantVoucher, {
    propsData: {
      name: "Voucher name",
      description: "Voucher description is exist",
      price: "5000",
      isShowCheckBox: false,
    },
  });
  const name = wrapper.find(".restaurant-voucher-name").text();
  const desc = wrapper.find(".restaurant-voucher-description").text();
  const price = wrapper.find(".restaurant-voucher-price").text();
  const checkbox = wrapper.find(".restaurant-voucher-checkbox").exists();
  console.log(wrapper.html());
  expect(wrapper.exists()).toBe(true);
  expect(name).toBe("Voucher name");
  expect(desc).toBe("Voucher description is exist");
  expect(price).toBe("5000");
  expect(checkbox).toBe(false);
});
test("should emit event when isSelected change", async () => {
  const wrapper = mount(RestaurantVoucher, {
    propsData: {
      name: "Voucher name",
      description: "Voucher description is exist",
      price: "5000",
      isSelected: false,
      isShowCheckBox: true,
    },
  });

  await wrapper.setProps({ isSelected: true });
  expect(wrapper.props("isSelected")).toBe(true);
  expect(wrapper.emitted("on-select-change")).toBeTruthy();
});
