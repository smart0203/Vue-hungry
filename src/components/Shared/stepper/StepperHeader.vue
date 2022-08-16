<template>
  <div class="flex">
    <StepperHeaderItem v-for="step in steps" :key="step.name" :step="step" />
  </div>
</template>

<script>
import StepperHeaderItem from "./StepperHeaderItem.vue";
export default {
  name: "StepperHeader",
  components: {
    StepperHeaderItem,
  },
  props: {
    steps: {
      type: Array,
      required: true,
      validator(value) {
        return value.length > 0 ? true : false;
      },
    },
  },
};
</script>
