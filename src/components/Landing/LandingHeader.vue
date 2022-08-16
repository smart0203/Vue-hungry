<template>
  <div>
    <h4
      class="mt-4 mb-3 text-lg font-black text-center capitalize lg:mt-4 lg:text-2xl"
    >
      {{ title }}
    </h4>

    <h5 class="mx-2 text-center lg:text-xl lg:mx-0">
      <span class="font-black" v-html="subTitle"></span>
      <p class="mt-4 mb-3 text-center lg:mt-4 lg:text-lg" v-html="desc"></p>
    </h5>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      default: "",
    },
    desc: {
      type: String,
      default: "",
    },
  },
};
</script>
