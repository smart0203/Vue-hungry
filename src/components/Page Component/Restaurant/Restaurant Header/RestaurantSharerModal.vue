<template>
  <modal
    name="restaurant-sharer-modal"
    height="auto"
    :width="modalWidth"
    @opened="modalOpened"
  >
    <div class="relative mx-4">
      <!-- close button -->
      <div
        class="absolute text-red-dark"
        :style="modalPosition"
        @click="$modal.hide('restaurant-sharer-modal')"
      >
        <img
          src="@/assets/icon-close-black.png"
          width="15"
          height="15"
          alt="close icon"
           loading="lazy"
        />
      </div>
      <div class="w-11/12 py-16 mx-auto lg:py-5">
        <div class="flex items-center justify-center pb-4 font-black">
          <div class="ml-2 text-lg">
            {{ restaurantName }}
          </div>
        </div>
        <div class="text-lg text-center text-gray-800">
          {{ $t("shareRestaurant") }}
        </div>

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
              alt="fb icon"
               loading="lazy"
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
              alt="line icon"
               loading="lazy"
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
            :value="restaurantUrl"
          />
          <div class="flex items-center justify-center">
            <span
              id="copy-text-button"
              class="p-2 text-sm cursor-pointer hover:text-gray-700 hover:underline"
              @click="copyText"
              >Copy Link</span
            >
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import module from "@/lib/tooltip";
export default {
  props: {
    restaurantUrl: {
      required: true,
    },
    restaurantName: {
      required: true,
    },
  },
  computed: {
    shareUrl() {
      const currentURL = window.location.href
      const spliCurrentURL = currentURL.split("?")
      return spliCurrentURL[0];
    },
    modalWidth() {
      return this.isDesktop ? "400px" : "90%";
    },
    modalPosition() {
      if (this.isDesktop) {
        return "top:-2px;left: -35px;";
      }
      return "top:5px;right: -10px;";
    },
  },
  methods: {
    modalOpened() {
      const el = document.querySelector("#copy-text-button");
      const config = {
        trigger: "click",
      };
      module.tooltip(el, "Link coppied to clipboard", "yellow", config);
    },
    copyText() {
      const copyText = document.getElementById("restaurant-url-input-share");
      copyText.select();
      copyText.setSelectionRange(0, 99999); /*For mobile devices*/
      document.execCommand("copy");
    },
  },
};
</script>
<i18n>
{
  "en": {
    "shareRestaurant": "Share with social media"

  },
  "th": {
    "shareRestaurant": "Share with social media"

  }
}
</i18n>
