<template>
  <div
    v-observe-visibility="{
      callback: visibilityChanged,
      once: true,
      throttle: 500,
    }"
  >
    <TagGroupView :is-loading="isLoading" :tag-groups="tagGroups" />
  </div>
</template>

<script>
import useLazyImport from "@/composable/useLazyImport";
import { screen } from "@/helper/screenSizeHelper";
import { getRestaurantTagGroupList } from "@/services/restaurant";
import { mapState } from "vuex";

let TagGroupView = "";
if (screen === "desktop" || screen === "large-desktop") {
  TagGroupView = () =>
    useLazyImport(() =>
      import(
        /* webpackChunkName: "TagGroupDesktopChunk" */ "./RestaurantTagGroupDesktop"
      )
    );
} else {
  TagGroupView = () =>
    useLazyImport(() =>
      import(
        /* webpackChunkName: "TagGroupMobileChunk" */ "./RestaurantTagGroupMobile"
      )
    );
}
export default {
  components: {
    TagGroupView,
  },
  data() {
    return {
      isLoading: true,
      isVisible: false,
      dummyTagGroups: [],
      realTagGroups: [],
    };
  },
  computed: {
    ...mapState(["baseUrl"]),
    tagGroups() {
      if (this.realTagGroups && this.realTagGroups.length) {
        return this.realTagGroups;
      }
      return this.dummyTagGroups;
    },
  },
  mounted() {
    this.initDummyRestaurantTagGroup();
    this.getRestaurantTagGroupList();
  },
  methods: {
    visibilityChanged(visibility) {
      if (visibility === true) {
        this.isVisible = true;
      }
    },
    async getRestaurantTagGroupList() {
      try {
        const result = await getRestaurantTagGroupList({});
        if (result.isSuccess) {
          const tagGroups = result.data.map((tagGroup) => {
            return {
              ...tagGroup,
              link: tagGroup.link,
            };
          });
          this.realTagGroups = Object.freeze(tagGroups);
          this.isLoading = false;
        } else {
          this.$alert.error(result.message);
        }
      } catch (err) {
        if (err.message) {
          this.$alert.error(err.message);
        }
      }
    },
    initDummyRestaurantTagGroup() {
      for (let index = 0; index < 9; index++) {
        const dummy = {
          link: "",
          id: Math.random().toString(36),
          restaurantIds: 99,
          photoUrl: "",
        };
        this.dummyTagGroups.push(Object.freeze(dummy));
      }
    },
  },
};
</script>
<style lang="scss">
.tag-group-item {
  width: 100%;
  height: 100px;

  .main-image {
    width: 100%;
    height: 100px;
    border-radius: 8px;
    background: #e4e4e4;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  }
}

@screen lg {
  .tag-group-item {
    width: 25%;
    height: 165px;

    .main-image {
      width: 270px;
      height: 165px;
      border-radius: 8px;
      background: #e4e4e4;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
      object-fit: cover;
    }
  }
}
</style>
