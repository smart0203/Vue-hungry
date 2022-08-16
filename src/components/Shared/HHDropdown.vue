<template>
  <div class="relative">
    <slot name="activator" :toggle="toggleDropdown"></slot>
    <div
      v-if="isOpen"
      class="fixed inset-0 z-10 w-full h-full"
      @click="toggleDropdown"
    ></div>
    <div v-if="isOpen" :class="dropdownContentClass">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    position: {
      type: String,
      default: "left",
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    dropdownContentClass() {
      let baseClass = ["absolute", "shadow", "z-20"];
      if (this.position === "right") {
        baseClass.push("right-0");
      } else {
        baseClass.push("left-0");
      }
      return baseClass;
    },
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>
