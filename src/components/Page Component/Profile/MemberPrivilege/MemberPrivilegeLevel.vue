<template>
  <div>
    <div class="py-2 text-sm font-black text-center">
      {{ privilege.name }} Tier
    </div>
    <div class="text-xs font-black border lg:text-xs">
      <div v-for="(benefit, index) in privilege.benefit" :key="benefit.id">
        <MemberPrivilegeBenefit
          :icon="benefit.iconUrl || ''"
          :class="setRounded(index, privilege.benefit.length)"
          :desc="benefit.desc"
          :style="benefitStyle"
        />
      </div>
    </div>
  </div>
</template>

<script>
import MemberPrivilegeBenefit from "./MemberPrivilegeBenefit.vue";
export default {
  name: "MemberPrivilegeLevel",
  components: {
    MemberPrivilegeBenefit,
  },
  props: {
    privilege: {
      type: Object,
      required: true,
    },
  },
  computed: {
    benefitStyle() {
      const { backgroundColor, dividerColor, textColor } = this.privilege;
      return `background-color: ${backgroundColor}; border-color: ${dividerColor}; color: ${textColor}`;
    },
  },
  methods: {
    setRounded(index, benefitArrayLength) {
      if (index === 0) {
        return "rounded-t-lg";
      }
      if (index === benefitArrayLength - 1) {
        return "rounded-b-lg";
      }
    },
  },
};
</script>
