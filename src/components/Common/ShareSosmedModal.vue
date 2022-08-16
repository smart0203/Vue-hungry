<template>
  <HHModal
    v-model="isModalShow"
    :content-class="'w-6/12 lg:w-2/12 p-4 bg-white'"
    :is-show-close-button="false"
    @on-click-outside="$emit('on-closed')"
  >
    <div class="py-2">
      <slot></slot>

      <div class="flex items-center justify-center mt-4">
        <a
          :href="`https://www.facebook.com/sharer.php?u=${shareUrl}`"
          rel="noopener noreferrer"
          class="mx-2 text-center"
          target="_blank"
        >
          <img
            class="inline-block mr-1 cursor-pointer"
            src="@/assets/icon-fb-color.png"
            style="width: 40px"
             loading="lazy"
            alt="fb icon"
            title="Share on Facebook"
          />
        </a>
        <a
          :href="`https://social-plugins.line.me/lineit/share?url=&text=${shareUrl}`"
          rel="noopener noreferrer"
          target="_blank"
          class="mx-2 text-center"
        >
          <img
            class="inline-block cursor-pointer"
            src="@/assets/icon-line-color.png"
            style="width: 40px"
             loading="lazy"
            alt="line icon"
            title="Share on Line"
          />
        </a>
      </div>

      <div class="my-4 text-lg text-center text-gray-800">OR</div>
      <div class="text-sm">
        <input
          id="restaurant-url-input-share"
          class="w-full p-4 font-bold text-black border border-gray-400"
          type="text"
          readonly
          :value="shareUrl"
        />
        <div class="flex items-center justify-center">
          <span
            id="copy-text-button"
            class="p-2 text-sm cursor-pointer hover:text-gray-700 hover:underline"
            @click="copyUrl"
            >Copy Link</span
          >
        </div>
      </div>
    </div>
  </HHModal>
</template>

<script>
import HHModal from "@/components/Shared/HHModal.vue";
import { useClipboard } from "@vueuse/core";
export default {
  name: "ShareSosmedModal",
  components: {
    HHModal,
  },
  props: {
    isShow: {
      type: Boolean,
      required: true,
    },
    shareUrl: {
      type: String,
      default: "",
    },
  },
  setup() {
    const { copy, isSupported } = useClipboard();

    function copyUrl() {
      if (isSupported) {
        copy(this.shareUrl);
        this.isModalShow = false;
        this.$alert.success("Copied to clipboard");
        this.$emit("on-closed");
        return;
      }
    }

    return {
      copyUrl,
    };
  },
  data() {
    return {
      isModalShow: false,
    };
  },
  watch: {
    isShow(val) {
      this.isModalShow = val;
    },
  },
};
</script>
