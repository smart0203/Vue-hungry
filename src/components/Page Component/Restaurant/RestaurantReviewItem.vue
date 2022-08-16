<template>
  <div>
    <div class="flex justify-around">
      <div
        class="flex flex-col ml-4 mr-2 text-left break-all lg:ml-16 lg:mr-0 review-user"
      >
        <div class="mx-auto">
          <HhImage
            class="cursor-pointer br4 user-avatar"
            :img="avatarImage"
            alt="user avatar"
            :mobile-width="65"
            :mobile-height="65"
            :desktop-width="65"
            :desktop-height="65"
            @click.native="showAvatarGallery"
          />
          <div class="my-1 text-sm text-gray-800 break-all lg:text-xs">
            {{ name }}
          </div>
          <div class="text-xs text-gray-600">{{ date }}</div>
        </div>
      </div>
      <div class="w-9/12 mx-4 overflow-hidden lg:w-4/5 lg:pr-4">
        <!-- review title -->
        <a
          v-if="link && title"
          :href="link"
          target="_blank"
          class="mb-2 text-red-dark hover:underline"
          @click.prevent="$emit('on-link-click')"
          >{{ title }}
        </a>
        <p v-else-if="title" class="mb-2 text-red-dark">{{ title }}</p>
        <!-- restaurantName if any -->
        <p v-if="restaurantName" class="mb-1 text-sm">{{ restaurantName }}</p>
        <!-- review rating if any -->
        <div v-if="rating > 0">
          <svg
            v-for="i in rating"
            :key="i"
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            fill="currentColor"
            class="flex-shrink-0 inline icon-star-fill text-red-dark"
            viewBox="0 0 16 16"
          >
            <path
              d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
            />
          </svg>
        </div>
        <!-- review content -->
        <p
          v-if="reviewsType === 'bloggers'"
          class="mr-3 text-xs ma0 lh-title"
          :class="reviewsType === 'customers' ? 'mb-4' : 'mb-1'"
          style="color: #848484"
          v-html="review"
        ></p>
        <HHTextTruncate
          v-else
          class="text-xs"
          style="color: #848484"
          :text="review"
          :max-length="500"
        />

        <!-- Readmore button for blogger reviews -->
        <a
          v-if="reviewsType === 'bloggers'"
          :href="link"
          target="_blank"
          class="mb-4 text-xs font-black capitalize text-red-dark hover:underline"
          @click.prevent="$emit('on-link-click')"
          >{{ $t("readMore") }}
        </a>
        <div
          v-if="thumbPhotos.length"
          class="mr-5 overflow-auto whitespace-nowrap lg:mr-0 lg:mt-2"
        >
          <div
            v-for="(photo, index) in thumbPhotos"
            :key="index"
            class="relative inline-block mr-4 review-image"
          >
            <HhImage
              class="cursor-pointer"
              :img="photo"
              alt="reviews image"
              :mobile-width="60"
              :mobile-height="60"
              :desktop-width="60"
              :desktop-height="60"
              @click.native="showImageGallery(index)"
            />
            <div
              v-if="
                photos.length > thumbPhotosLimit &&
                index == thumbPhotosLimit - 1
              "
              class="absolute top-0 right-0 flex flex-col items-center justify-center w-full h-full mx-auto text-white cursor-pointer show-more"
              @click="showImageGallery(index)"
            >
              <span class="text-xs"
                >+ {{ $t("photosCount", { count: thumbPhotosMoreText }) }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :id="`gallery-${id}`"></div>
    <div :id="`gallery-${id}-avatar`"></div>
  </div>
</template>

<script>
import popUpGallery from "@/components/Shared/PopupGallery";
export default {
  props: {
    avatar: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    photos: {
      type: Array,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: "",
    },
    restaurantName: {
      type: String,
      default: "",
    },
    reviewsType: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    linkClickedCallback: {
      type: Function,
      default: () => {
        return;
      },
    },
  },
  setup() {
    const { showGallery: showReviewAvatarGallery } = popUpGallery();
    const { showGallery: showReviewImageGallery } = popUpGallery();
    return {
      showReviewAvatarGallery,
      showReviewImageGallery,
    };
  },
  computed: {
    thumbPhotosLimit() {
      return this.isDesktop ? 4 : 3;
    },
    thumbPhotos() {
      if (this.photos.length > this.thumbPhotosLimit) {
        return this.photos.slice(0, this.thumbPhotosLimit).map((photo) => {
          return this.$url(photo.original, "asset");
        });
      }
      return this.photos.map((photo) => {
        return this.$url(photo.original, "asset");
      });
    },
    thumbPhotosMoreText() {
      return this.photos.length - this.thumbPhotosLimit;
    },
    avatarImage() {
      return this.$url(this.avatar, "asset");
    },
  },
  methods: {
    showAvatarGallery() {
      const avatar = [
        {
          asset: this.avatarImage,
        },
      ];
      this.showReviewAvatarGallery(`#gallery-${this.id}-avatar`, avatar, 0);
    },
    showImageGallery(index) {
      try {
        const temp = this.photos.map((photo) => {
          return {
            asset: this.$url(photo.original, "asset"),
          };
        });
        this.showReviewImageGallery(`#gallery-${this.id}`, temp, index);
      } catch (err) {
        this.$alert.error(
          "Gallery component can't be loaded, please refresh your browser"
        );
        this.$rollbar.error(err);
      }
    },
  },
};
</script>

<style scoped>
.user-avatar {
  width: 65px;
  height: 65px;
  border-radius: 18px;
}
.review-user {
  width: 70px;
}
@screen md {
  .user-avatar {
    width: 70px;
    height: 70px;
  }
}
.review-image {
  width: 60px;
  height: 60px;
}
.show-more {
  background: rgba(0, 0, 0, 0.639);
}
[class^="icon-"]::before,
[class*=" icon-"]::before {
  margin: 0;
}
</style>
