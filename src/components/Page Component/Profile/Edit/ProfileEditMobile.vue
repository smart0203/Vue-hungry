<template>
  <div class="flex flex-col min-h-screen mx-4 mt-8">
    <div class="relative my-2">
      <router-link to="/profile" class="absolute top-0 left-0 text-black">
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
      <p class="font-black text-center capitalize">{{ $t("editProfile") }}</p>
    </div>
    <ProfileEditMain
      class="flex-1 my-10"
      @on-change-password="$router.push({ name: 'profile-password' })"
      @on-delete-account="isModalShow = true"
    />

    <HHPopup
      activator=""
      name="delete-account"
      :is-show="isModalShow"
      :is-tooltip-desktop="false"
      :modal-width="'85%'"
      :modal-height="250"
      @on-closed="isModalShow = false"
    >
      <ProfileModalDeleteAccount @on-cancel="isModalShow = false" />
    </HHPopup>
  </div>
</template>

<script>
import useLazyImport from "@/composable/useLazyImport";
export default {
  components: {
    ProfileEditMain: () => useLazyImport(() => import("./ProfileEditMain")),
    HHPopup: () => useLazyImport(() => import("@/components/Shared/HHPopup")),
    ProfileModalDeleteAccount: () =>
      useLazyImport(() =>
        useLazyImport(() =>
          import(
            "@/components/Page Component/Profile/Modal/ProfileModalDeleteAccount.vue"
          )
        )
      ),
  },
  data() {
    return {
      isModalShow: false,
    };
  },
};
</script>
