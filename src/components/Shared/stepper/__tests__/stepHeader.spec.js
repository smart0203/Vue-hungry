import { mount } from "@vue/test-utils";
import StepperHeader from "../StepperHeader.vue";

describe("should component mounted correctly", () => {
  test("step has correct color", async () => {
    let icon1ClickHandler = jest.fn();
    let icon2ClickHandler = jest.fn();
    const steps = [
      {
        name: "voucher",
        icon: "",
        iconActive: "",
        isActive: true,
        isPassed: false,
        onIconClick: icon1ClickHandler,
      },
      {
        name: "payment",
        icon: "",
        iconActive: "",
        isActive: false,
        isPassed: false,
        onIconClick: icon2ClickHandler,
      },
    ];

    const wrapper = mount(StepperHeader, {
      propsData: {
        steps: steps,
      },
    });

    console.log(wrapper.html());
    const names = wrapper.findAll('[data-testid="stepper-header-item-name"]');
    const iconButton = wrapper.findAll(
      '[data-testid="stepper-header-item-icon-wrapper"]'
    );
    const leftLine = wrapper.findAll(
      '[data-testid="stepper-header-item-icon-wrapper"]'
    );

    const iconButtonStep1 = iconButton[0];
    const iconButtonStep2 = iconButton[1];

    const icons = wrapper.findAll('[data-testid="stepper-header-item-icon"]');
    const iconStep1 = icons[0];
    const iconStep2 = icons[1];

    const iconsActive = wrapper.findAll(
      '[data-testid="stepper-header-item-icon-active"]'
    );
    const iconActiveStep1 = iconsActive.at(0).attributes();
    const iconActiveStep2 = iconsActive.at(1).attributes();

    console.log("stepper-header-item-icon-active", iconActiveStep2.style);
    expect(iconActiveStep2.style).toInclude("z-index: -1");

    // console.log('icon active attr', iconActiveStep2.attributes())
    // await iconButton.trigger('click')
    // expect(icon1ClickHandler).toHaveBeenCalled();
    // const desc = wrapper.find(".restaurant-voucher-description").text()
    // const price = wrapper.find(".restaurant-voucher-price").text()
    // const checkbox = wrapper.find(".restaurant-voucher-checkbox").exists()
    // expect(wrapper.exists()).toBe(true)
    // expect(name).toBe("Voucher name")
    // expect(desc).toBe("Voucher description is exist")
    // expect(price).toBe("5000")
    // expect(checkbox).toBe(false)
  });
});
// test('should emit event when isSelected change', async () => {
//   const wrapper = mount(RestaurantVoucher, {
//     propsData: {
//       name: 'Voucher name',
//       description: "Voucher description is exist",
//       price: "5000",
//       isSelected: false,
//       isShowCheckBox: true
//     }
//   })

//   await wrapper.setProps({ isSelected: true })
//   expect(wrapper.props('isSelected')).toBe(true)
//   expect(wrapper.emitted('on-select-change')).toBeTruthy()

// })
