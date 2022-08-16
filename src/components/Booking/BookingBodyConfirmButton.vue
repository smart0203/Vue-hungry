<template>
  <div
    v-if="step != 2"
    class="flex items-center justify-center w-full pt-3 pb-2 mx-auto mt-3 bg-white border-t border-gray-400"
  >
    <div class="mx-2">
      <div class="relative cart">
        <img
          loading="lazy"
          src="@/assets/icons-cart-red.png"
          width="35px"
          alt=""
        />
        <span class="text-sm counter">5</span>
      </div>
    </div>
    <button
      id="booking-confirm-button"
      class="w-4/5 py-2 text-white border-none rounded-full bg-red-dark"
      @click="confirm"
    >
      {{ $t("confirm") }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    step: {
      type: Number,
    },
  },
  methods: {
    confirm() {
      this.$store.commit("booking/setState", {
        state: "step",
        val: 1,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.confirm-button {
  /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3); */
}

.confirm-button-mobile {
  /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3); */
}

.cart {
  .counter {
    position: absolute;
    left: 50%;
    top: 25%;
    color: white;
  }
}
</style>
