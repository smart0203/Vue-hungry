<template>
  <div>
    <slot> </slot>
  </div>
</template>

<script>
export default {
  props: {
    logo: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    cuisine: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "",
    },
    reviewScore: {
      type: Number,
      required: true,
    },
    reviewCount: {
      type: Number,
      required: true,
    },
    totalLocations: {
      type: Number,
      default: 0,
    },
    anyDineInPackage: {
      type: Boolean,
      required: true,
    },
    anyDeliveryPackage: {
      type: Boolean,
      required: true,
    },
    packagePrice: {
      required: true,
    },
    packagePricing: {
      type: String,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isLazyLoadMainImage: {
      type: Boolean,
      default: true,
    },
    isStaycation: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
