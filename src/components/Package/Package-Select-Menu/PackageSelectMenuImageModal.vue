<template>
  <vue-final-modal
    v-model="isShow"
    name="package-select-menu-image-modal"
    classes="flex justify-center items-center"
    content-class="flex flex-col p-4"
    @closed="$emit('on-closed')"
  >
    <div
      class="relative w-auto mx-auto bg-white border rounded"
      @click="isShow = false"
    >
      <!-- close button -->
      <div
        class="absolute cursor-pointer text-red-dark"
        style="top: 5px; right: 8px"
        @click="isShow = false"
      >
        <img
          style="width: 15px; height: 15px"
          class="inline-block"
          src="@/assets/icon-close-red.png"
           loading="lazy"
          alt="close modal"
        />
      </div>
      <div class="px-4 py-6">
        <div class="my-3 font-black text-center">{{ sectionName }}</div>
        <div class="text-center">
          <div class="relative inline-block menu-image-wrapper">
            <HhImage
              v-if="
                menu.image && (menu.image.original || menu.image.originalSize)
              "
              class="inline-block bg-gray-300 rounded-lg menu-image"
              :img="menu.image.original || menu.image.originalSize"
              fallback="@/assets/default-menu-image.png"
              alt="menu image"
              width="300"
              height="300"
              :desktop-width="500"
              :desktop-height="0"
              mobile-width="full-screen"
              :mobile-height="0"
            />
            <!-- custome label badge -->
            <div
              v-if="menu.customLabel && menu.customLabel.iconUrl"
              class="absolute"
              style="top: -5px; right: -5px"
            >
              <HhImage
                :img="menu.customLabel.iconUrl"
                style="width: 25px"
                alt="menu custom label"
              />
            </div>
          </div>
        </div>
        <div
          class="my-3 leading-normal text-center text-gray-700 lg:my-3 menu-name"
        >
          {{ menu.name }}
        </div>
        <div
          v-if="isAllowShowPrice"
          class="my-3 font-bold text-center lg:my-1 text-red-dark"
        >
          {{ $money(menu.price) }}
        </div>
        <div class="text-sm leading-normal text-center text-gray-700">
          {{ menu.description }}
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script>
import humps from "humps";
import qs from "qs";
export default {
  props: {
    sectionName: {
      type: String,
      required: true,
    },
    menu: {
      type: Object,
      required: true,
    },
    isAllowShowPrice: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isShow: false,
    };
  },
  watch: {
    isShow(newVal) {
      if (newVal) {
        this.registerPopStateHandler();
        this.addMarkToURL();
        return;
      }
      this.removeMarkFromURL();
      this.removePopStateHandler();
    },
  },
  methods: {
    registerPopStateHandler() {
      window.onpopstate = () => {
        this.removeMarkFromURL();
        this.isShow = false;
      };
    },
    removePopStateHandler() {
      window.onpopstate = () => {};
    },
    addMarkToURL() {
      const parsedQueryString = qs.parse(window.location.search, {
        ignoreQueryPrefix: true,
      });
      parsedQueryString.modalOpened = true;
      const stringify = qs.stringify(humps.decamelizeKeys(parsedQueryString));

      window.history.pushState(null, null, `?${stringify}`);
    },

    removeMarkFromURL() {
      const parsedQueryString = qs.parse(window.location.search, {
        ignoreQueryPrefix: true,
      });
      parsedQueryString.modalOpened = null;
      const stringify = qs.stringify(humps.decamelizeKeys(parsedQueryString), {
        skipNulls: true,
      });

      window.history.replaceState(null, null, `?${stringify}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-image-wrapper {
  @screen lg {
    width: 600px;
  }
}

.menu-image {
  width: 100%;
  height: auto;
  border-radius: 14px;
}

.menu-quantity {
  width: 25px;
  height: 25px;
}
</style>
