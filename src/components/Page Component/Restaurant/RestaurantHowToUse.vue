<template>
  <div
    class="w-11/12 pt-3 pb-5 mx-auto mb-10 text-xs leading-normal lg:pt-10 lg:pb-10 lg:text-base"
    v-html="content"
  ></div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
    },
  },
};
</script>

<style></style>
