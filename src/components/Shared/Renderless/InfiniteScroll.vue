<template>
  <div>
    <slot> </slot>
    <div
      v-observe-visibility="{
        callback: visibleCallback,
        throttle: throttle || 300,
      }"
    >
      <slot name="activator"> </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visibleCallback: {
      required: true,
      type: Function,
    },
    throttle: {
      type: Number,
    },
  },
};
</script>
