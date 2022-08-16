<template>
  <div>
    <slot
      :link="link"
      :title="title"
      :avatarImage="avatarImage"
      :restaurantName="restaurantName"
      :restaurantLink="restaurantLink"
      :reviewerName="reviewerName"
      :formatedDate="formatedDate"
      :rating="rating"
      :review="review"
      :excerpt="excerpt"
      :thumbPhotos="thumbPhotos"
      :showImageGalleryHandler="showImageGallery"
      :showAvatarGalleryHandler="showAvatarGallery"
      :reviewLinkClickedHandler="goToLink"
    >
    </slot>
    <div :id="`gallery-${id}`"></div>
    <div :id="`gallery-${id}-avatar`"></div>
  </div>
</template>

<script>
import ReviewMixin from "./ReviewMixin";
export default {
  mixins: [ReviewMixin],
  props: {
    // required props to this component
    excerpt: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  methods: {
    goToLink() {
      this.$track("BLOGGER_REVIEW_TAPPED", {
        bloggerReviewId: this.id,
        restaurantId: this.restaurantId,
      });
      window.open(this.link, "_blank");
    },
  },
};
</script>
