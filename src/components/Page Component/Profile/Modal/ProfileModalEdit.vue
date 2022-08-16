<template>
  <div class="mt-8 mb-8">
    <ProfileEditMain
      @on-profile-edit="$emit('on-profile-edit')"
      @on-change-password="$emit('on-change-password')"
      @on-delete-account="$emit('on-delete-account')"
    />
  </div>
</template>

<script>
export default {
  components: {
    ProfileEditMain: () =>
      import("@/components/Page Component/Profile/Edit/ProfileEditMain.vue"),
  },
};
</script>
