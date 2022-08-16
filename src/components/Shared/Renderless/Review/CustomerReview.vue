<template>
  <div>
    <slot
      :avatarImage="avatarImage"
      :restaurantName="restaurantName"
      :restaurantLink="restaurantLink"
      :formatedDate="formatedDate"
      :rating="rating"
      :review="review"
      :thumbPhotos="thumbPhotos"
      :showImageGalleryHandler="showImageGallery"
      :showAvatarGalleryHandler="showAvatarGallery"
      :reviewerName="reviewerName"
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
};
</script>
