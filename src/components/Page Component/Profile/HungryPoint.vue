<template>
  <div v-if="isMobile">
    <div class="flex">
      <div class="">
        <div class="">{{ "Your Hungry Point" }}</div>
        <div class="text-gray-500 text-2xs">Spend 100 baht = 1 point</div>
      </div>
      <div class="ml-2 text-red-dark">
        <div class="font-black">
          {{ point }}
        </div>
        <div class="text-gray-500 text-2xs">1 point = 1 baht</div>
      </div>
    </div>
    <div class="flex justify-between">
      <div class="flex flex-col">
        <img src="@/assets/member-tier-1.png"  loading="lazy" alt="" />
        <span>Member</span>
      </div>
      <div class="flex flex-col">
        <img src="@/assets/member-tier-2.png" alt="" loading="lazy" />
        <span>Member</span>
      </div>
      <div class="flex flex-col">
        <img src="@/assets/member-tier-3.png"  loading="lazy" alt="" />
        <span>Member</span>
      </div>
      <div class="flex flex-col">
        <img src="@/assets/member-tier-4.png"  loading="lazy" alt="" />
        <span>Member</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    point: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style></style>
