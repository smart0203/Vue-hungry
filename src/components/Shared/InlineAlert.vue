<template>
  <div
    class="block px-3 py-2 text-sm text-white rounded shadow-xs"
    :class="borderColor"
  >
    {{ message }}
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
      validator(val) {
        return ["success", "warning", "info", "error"].indexOf(val) !== -1;
      },
    },
    message: {
      type: String,
      required: true,
    },
  },
  computed: {
    borderColor() {
      if (this.type) {
        if (this.type === "success") {
          return "bg-green-300";
        } else if (this.type === "info") {
          return "bg-blue-300";
        } else if (this.type === "warning") {
          return "bg-yellow-500";
        } else if (this.type === "error") {
          return "bg-red-dark";
        }
      }
      return "bg-red-dark";
    },
  },
};
</script>
