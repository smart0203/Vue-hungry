import popUpGallery from "@/components/Shared/PopupGallery";

export default {
  props: {
    lang: {
      type: String,
      default() {
        return "th";
      },
    },
    avatar: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    reviewerName: {
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
    restaurantName: {
      type: String,
      default() {
        return "";
      },
    },
    restaurantId: {
      type: Number,
      default() {
        return 0;
      },
    },
    restaurantLink: {
      type: String,
      default() {
        return "";
      },
    },
    rating: {
      type: Number,
      default: 0,
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
    formatedDate() {
      return this.$dayjs(this.date).locale(this.lang).format("D MMM YYYY");
    },
    thumbPhotos() {
      return this.photos.map((photo) => {
        return this.$url(photo.original, "asset");
      });
    },
    avatarImage() {
      return this.$url(this.avatar, "asset");
    },
  },
  methods: {
    showImageGallery(index) {
      try {
        const temp = this.photos.map((photo) => {
          return {
            asset: this.$url(photo.original, "asset"),
          };
        });
        this.showReviewImageGallery(`#gallery-${this.id}`, temp, index);
      } catch (err) {
        this.$rollbar.error(err);
      }
    },
    showAvatarGallery() {
      const avatar = [
        {
          asset: this.avatarImage,
        },
      ];
      this.showReviewAvatarGallery(`#gallery-${this.id}-avatar`, avatar, 0);
    },
  },
};
