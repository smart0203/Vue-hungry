<template>
  <div class="min-h-screen mx-4 mt-8">
    <div class="relative my-2">
      <router-link to="/profile/edit" class="absolute top-0 left-0 text-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          fill="currentColor"
          class="inline icon-chevron-left text-red-dark"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
            stroke-width="2"
          />
        </svg>
      </router-link>
      <p class="font-black text-center capitalize">
        {{ $t("changePassword") }}
      </p>
    </div>
    <ProfileEditPassword
      @on-update-password="$router.push({ name: 'profile-home' })"
    />
  </div>
</template>

<script>
import useLazyImport from "@/composable/useLazyImport";
export default {
  name: "ProfileEditPasswordPage",
  components: {
    ProfileEditPassword: () =>
      useLazyImport(() =>
        import("@/components/Page Component/Profile/Edit/ProfileEditPassword")
      ),
  },
};
</script>
