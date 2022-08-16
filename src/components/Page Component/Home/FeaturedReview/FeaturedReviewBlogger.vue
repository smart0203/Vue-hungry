<template>
  <div>
    <BloggerReview v-bind="passedProps">
      <template
        #default="{
          link,
          title,
          avatarImage,
          reviewerName,
          restaurantName,
          restaurantLink,
          excerpt,
          thumbPhotos,
          formatedDate,
          showImageGalleryHandler,
          reviewLinkClickedHandler,
          showAvatarGalleryHandler,
        }"
      >
        <div>
          <div class="flex justify-around">
            <div
              class="flex flex-col flex-shrink-0 ml-2 mr-4 text-left review-user"
            >
              <div class="">
                <!-- avatar -->
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
                <!-- date -->
                <div
                  class="mt-2 text-2xs lg:text-xs"
                  :class="
                    isLoading
                      ? ' bg-gray-300 text-transparent  mt-1'
                      : 'text-gray-600'
                  "
                >
                  {{ formatedDate }}
                </div>
              </div>
            </div>
            <div class="w-9/12 overflow-hidden lg:ml-2 lg:w-4/5 lg:pr-4">
              <div
                class="text-sm"
                :class="
                  isLoading ? ' w-full bg-gray-300  h-4 text-transparent' : null
                "
              >
                {{ reviewerName }}
              </div>
              <!-- restaurantName -->
              <a
                :href="restaurantLink"
                target="_blank"
                class="block my-1 text-sm font-black lg:text-base hover:underline"
                :class="
                  isLoading
                    ? ' w-8/12 bg-gray-300  h-2 mb-2 text-transparent'
                    : 'text-red-dark'
                "
              >
                {{ restaurantName }}
              </a>
              <!-- blogger's photos -->
              <div
                v-if="thumbPhotos.length"
                class="overflow-auto whitespace-nowrap lg:mr-0"
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

              <!-- review title -->
              <a
                :href="link"
                target="_blank"
                rel="noopener noreferrer"
                class="mb-2 font-black hover:underline"
                :class="
                  isLoading
                    ? ' w-full h-12 bg-gray-300  text-transparent'
                    : null
                "
                @click.prevent="reviewLinkClickedHandler"
                >{{ title }}</a
              >
              <!-- review content -->
              <p
                class="mr-3 text-xs ma0 lh-title"
                :class="
                  isLoading
                    ? ' w-full h-12 bg-gray-300  text-transparent'
                    : 'custom-gray'
                "
                v-html="excerpt"
              ></p>
              <!-- Readmore button for blogger reviews -->
              <a
                v-if="!isLoading && excerpt && link"
                :href="link"
                target="_blank"
                rel="noopener noreferrer"
                class="mb-4 text-xs font-black capitalize text-red-dark hover:underline"
                @click.prevent="reviewLinkClickedHandler"
                >{{ $t("readMore") }}
              </a>
            </div>
          </div>
        </div>
      </template>
    </BloggerReview>
  </div>
</template>

<script>
import BloggerReview from "@/components/Shared/Renderless/Review/BloggerReview.vue";
export default {
  components: {
    BloggerReview,
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    bloggerReview: {
      type: Object,
      required: true,
    },
  },
  computed: {
    passedProps() {
      return {
        lang: this.$store.state.lang,
        id: this.bloggerReview.id,
        link: this.bloggerReview.link,
        avatar: this.bloggerReview.avatar,
        date: this.bloggerReview.date,
        reviewerName: this.bloggerReview.name,
        photos: this.bloggerReview.photos,
        rating: this.bloggerReview.rating,
        excerpt: this.bloggerReview.excerpt,
        review: this.bloggerReview.review,
        title: this.bloggerReview.title,
        restaurantId: this.bloggerReview.restaurantId,
        restaurantName: this.bloggerReview.restaurantName,
        restaurantLink: this.bloggerReview.restaurantLink,
      };
    },
    thumbPhotosLimit() {
      return 3;
    },
  },
  methods: {
    splitThumbPhotos(photos) {
      if (photos.length > this.thumbPhotosLimit) {
        return photos.slice(0, this.thumbPhotosLimit);
      }
      return photos;
    },
    morePhotosText(photosLength) {
      return photosLength - this.thumbPhotosLimit;
    },
  },
};
</script>
