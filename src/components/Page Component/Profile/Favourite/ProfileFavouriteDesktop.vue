<template>
  <div class="profile-content-min-height">
    <div class="relative my-2">
      <p class="text-sm capitalize">{{ $t("favorites") }}</p>
    </div>
    <ProfileFavouriteMain />
  </div>
</template>

<script>
import useLazyImport from "@/composable/useLazyImport";
export default {
  components: {
    ProfileFavouriteMain: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "ProfileMobileChunk" */ "./ProfileFavouriteMain.vue"
        )
      ),
  },
};
</script>
