<template>
  <div class="flex">
    <div class="flex-shrink-0 package-card-list" :class="type"></div>
    <div class="flex-col w-full">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.package-card-list {
  width: 10px;
  height: auto;
  border-radius: 10px;

  &.ayce {
    background-color: var(--package-ayce);
  }

  &.hah {
    background-color: var(--package-hah);
  }

  &.pp {
    background-color: var(--package-pp);
  }

  &.bfp {
    background-color: var(--package-bfp);
  }

  &.hs {
    background-color: var(--package-hs);
  }

  &.sm {
    background-color: var(--package-sm);
  }

  &.xp {
    background-color: var(--package-xp);
  }
}
</style>
