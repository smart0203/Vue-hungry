<template>
  <HHModal
    v-model="isModalShow"
    :content-class="'w-11/12 lg:w-4/12 p-4 bg-white'"
    @on-cancel="$emit('on-closed')"
    @on-click-outside="$emit('on-closed')"
  >
    <div class="w-11/12 mb-4">
      <div class="font-bold lg:text-xl">
        {{ name }}
      </div>
      <div v-if="price" class="font-bold text-red-dark lg:text-xl">
        {{ price }}
      </div>
    </div>

    <div class="flex w-full">
      <button
        class="w-1/2 text-xs capitalize tab lg:text-sm"
        :class="isTabDetailActive ? 'tab-active' : ''"
        @click="activeTab = 'detail'"
      >
        {{ $t("detail") }}
      </button>
      <button
        class="w-1/2 text-xs capitalize tab lg:text-sm"
        :class="!isTabDetailActive ? 'tab-active' : ''"
        @click="activeTab = 'termCondition'"
      >
        {{ $t("termAndCondition") }}
      </button>
    </div>

    <div class="px-4 mt-4 content">
      <div
        v-if="isTabDetailActive"
        class="text-xs text-gray-600 lg:text-sm"
        v-html="description"
      ></div>

      <div
        v-else-if="!isTabDetailActive"
        class="text-xs text-gray-600 lg:text-sm"
        v-html="tnc"
      ></div>
    </div>
  </HHModal>
</template>

<script>
import HHModal from "@/components/Shared/HHModal.vue";
export default {
  components: {
    HHModal,
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: "",
    },
    price: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    tnc: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isModalShow: false,
      activeTab: "detail",
    };
  },
  computed: {
    isTabDetailActive() {
      return this.activeTab === "detail";
    },
  },
  watch: {
    isShow(val) {
      this.isModalShow = val;
    },
  },
};
</script>

<style lang="scss">
.tab {
  @apply text-gray-400 border-b pb-2;
}
.tab-active {
  @apply font-bold  text-black border-red-dark;
}
.content {
  @apply overflow-y-scroll;
  max-height: 300px;
  @screen lg {
    max-height: 400px;
  }
  ol {
    list-style: decimal !important;
  }
  ul {
    list-style: disc !important;
  }
}
</style>
