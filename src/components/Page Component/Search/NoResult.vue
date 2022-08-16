<template>
  <div class="flex flex-col">
    <div
      class="flex flex-col items-center justify-center flex-auto my-40 text-red-dark"
    >
      <HhImage
        class="no-result-icon"
        img="@/assets/icon-attention-red.png"
        alt="no result icon"
        is-local-image
      />
      <p class="my-2 text-xl font-black">{{ $t("noResultFound") }}</p>
      <p class="text-sm font-black">
        {{ $t("weCantFindResult") }}
      </p>
    </div>
  </div>
</template>

<script>
export default {};
</script>
<style lang="scss" scoped>
.no-result-icon {
  width: 88px;

  @screen lg {
    width: 100px;
  }
}
</style>
