<template>
  <div class="flex flex-col items-center justify-center profile-empty-state">
    <slot name="title">
      <p class="text-base font-black capital-first-letter">
        {{ title }}
      </p>
    </slot>
    <slot name="sub-title">
      <p class="mt-4 text-center capital-first-letter">
        {{ $t("startSearching") }}
      </p>
    </slot>
    <slot name="button-action">
      <router-link
        :to="{ name: 'HomePage' }"
        class="px-2 mt-4 font-black bg-white border rounded-full lg:leading-relaxed lg:px-3 border-red-dark text-red-dark hover:underline lg:bg-red-dark lg:text-white lg:text-base"
      >
        {{ $t("findARestaurant") }}
      </router-link>
    </slot>
    <slot name="icon">
      <img src="@/assets/mr-hungry-blue.png"  loading="lazy" alt="mr hungry" />
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
  },
};
</script>
<style lang="scss" scoped>
.profile-empty-state {
  min-height: 100px;

  @screen lg {
    min-height: 250px;
  }
}
</style>
