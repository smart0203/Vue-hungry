<template>
  <div :class="{ 'mx-auto': centerStars }" class="flex" style="width: 70px">
    <svg
      v-for="i in rating"
      :key="i"
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      fill="currentColor"
      :class="[starsFontSize, additionalIconClass]"
      class="flex-shrink-0 inline icon-star-fill"
      viewBox="0 0 16 16"
    >
      <path
        d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "RatingStars",
  props: {
    rating: {
      type: Number,
      default: 0,
      required: true,
    },
    marginStars: {
      type: Number,
      default: null,
    },
    centerStars: {
      type: Boolean,
      default: false,
    },
    starsFontSize: {
      type: String,
      default: "fs-15",
    },
    additionalIconClass: {
      type: String,
      default: "",
    },
  },
};
</script>
<style scoped>
.icon-star {
  font-size: 0.93rem;
}
.icon-star:before,
.icon-star-empty::before {
  margin: 0;
}
</style>
