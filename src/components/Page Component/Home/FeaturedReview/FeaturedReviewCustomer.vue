<template>
  <div>
    <CustomerReview
      v-slot="{
        avatarImage,
        restaurantName,
        restaurantLink,
        formatedDate,
        rating,
        reviewerName,
        review,
        thumbPhotos,
        showImageGalleryHandler,
        showAvatarGalleryHandler,
      }"
      v-bind="passedProps"
    >
      <div class="flex justify-around">
        <div
          class="flex flex-col flex-shrink-0 ml-4 mr-2 text-left break-all lg:ml-16 lg:mr-0 left-section"
        >
          <div class="mx-auto">
            <div v-if="isLoading" class="w-full h-12 bg-gray-300"></div>
            <HhImage
              v-else
              class="cursor-pointer br4 user-avatar"
              :img="avatarImage"
              alt="user avatar"
              :mobile-width="65"
              :mobile-height="65"
              :desktop-width="65"
              :desktop-height="65"
              @click.native="showAvatarGalleryHandler"
            />
            <div
              class="mt-1 text-xs break-all lg:text-xs"
              :class="
                isLoading
                  ? 'bg-gray-300 w-3/4 mx-auto h-4  text-transparent'
                  : 'text-gray-800'
              "
            >
              {{ reviewerName }}
            </div>
            <div
              class="text-2xs lg:text-xs"
              :class="
                isLoading
                  ? ' bg-gray-300 text-transparent  mt-1'
                  : 'text-gray-600'
              "
            >
              {{ formatedDate }}
            </div>
            <!-- review rating if any -->
            <div
              v-if="rating > 0 && !isLoading"
              class="leading-none review-rating"
            >
              <svg
                v-for="i in rating"
                :key="i"
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="currentColor"
                class="inline icon-star-fill text-red-dark"
                viewBox="0 0 16 16"
              >
                <path
                  d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div class="w-9/12 ml-4 overflow-hidden lg:ml-10 lg:w-4/5 lg:pr-4">
          <!-- restaurantName -->
          <a
            :href="restaurantLink"
            target="_blank"
            class="block mb-1 text-sm lg:font-black lg:text-lg hover:underline"
            :class="isLoading ? 'bg-gray-300  w-40 h-3 text-transparent' : ''"
          >
            {{ restaurantName }}
          </a>
          <!-- review content -->
          <div v-if="isLoading" class="w-full h-8 bg-gray-300"></div>
          <HHTextTruncate
            v-else
            class="text-xs"
            style="color: #848484"
            :text="review"
            :max-length="300"
          />

          <div
            v-if="thumbPhotos.length"
            class="mt-4 overflow-auto whitespace-nowrap lg:mr-0 lg:mt-2"
          >
            <div
              v-for="(photo, index) in splitThumbPhotos(thumbPhotos)"
              :key="index"
              class="relative inline-block mr-1 lg:mr-4 review-image"
            >
              <div v-if="isLoading" class="w-full h-12 bg-gray-300"></div>
              <HhImage
                v-else
                class="cursor-pointer"
                :img="photo"
                alt="reviews image"
                :mobile-width="60"
                :mobile-height="60"
                :desktop-width="60"
                :desktop-height="60"
                @click.native="showImageGalleryHandler(index)"
              />
              <div
                v-if="
                  !isLoading &&
                  thumbPhotos.length > thumbPhotosLimit &&
                  index == thumbPhotosLimit - 1
                "
                class="absolute top-0 right-0 flex flex-col items-center justify-center w-full h-full mx-auto text-white cursor-pointer show-more"
                @click="showImageGalleryHandler(index)"
              >
                <span class="text-xs"
                  >+
                  {{
                    $t("photosCount", {
                      count: morePhotosText(thumbPhotos.length),
                    })
                  }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerReview>
  </div>
</template>

<script>
import CustomerReview from "@/components/Shared/Renderless/Review/CustomerReview";
export default {
  components: {
    CustomerReview,
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    customerReview: {
      type: Object,
      required: true,
    },
  },
  computed: {
    passedProps() {
      return {
        reviewerName: this.customerReview.name,
        lang: this.$store.state.lang,
        id: this.customerReview.id,
        avatar: this.customerReview.avatar,
        date: this.customerReview.date,
        photos: this.customerReview.photos,
        rating: this.customerReview.rating,
        review: this.customerReview.review,
        restaurantName: this.customerReview.restaurantName,
        restaurantId: this.customerReview.restaurantId,
        restaurantLink: this.customerReview.restaurantLink,
      };
    },
    thumbPhotosLimit() {
      return this.isDesktop ? 4 : 3;
    },
  },
  methods: {
    morePhotosText(photosLength) {
      return photosLength - this.thumbPhotosLimit;
    },
    splitThumbPhotos(photos) {
      if (photos.length > this.thumbPhotosLimit) {
        return photos.slice(0, this.thumbPhotosLimit);
      }
      return photos;
    },
  },
};
</script>
