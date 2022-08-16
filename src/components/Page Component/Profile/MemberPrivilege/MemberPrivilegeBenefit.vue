<template>
  <div class="flex items-center px-3 py-4 border-b lg:px-2 lg:py-4">
    <div class="flex-shrink-0">
      <HhImage :img="icon" width="15" height="15" />
    </div>
    <div class="pl-3">{{ desc }}</div>
  </div>
</template>

<script>
export default {
  name: "MemberPrivilegeBenefit",
  props: {
    icon: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
  },
};
</script>
