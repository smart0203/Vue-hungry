import { reactive, ref } from "@vue/composition-api";

export function createVoucherStepGroup() {
  const iconActive = ref("");
  const iconNonActive = ref("");
  const isActive = ref("");

  function goToNextStep() {}

  return {
    iconActive,
    iconNonActive,
    isActive,
    goToNextStep,
  };
}

export function createVoucherStep() {
  const component = ref("");

  function confirmHandler() {}

  return {
    component,
  };
}
