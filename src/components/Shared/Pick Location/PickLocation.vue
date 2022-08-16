<template>
  <div>
    <slot :openPickLocationModal="openModal"></slot>
    <PickLocationModal
      :location="location"
      :title="title"
      :show-additional-address="showAdditionalAddress"
      @on-location-pick="locationPicked"
      @on-modal-opened="locationModalOpened"
    />
  </div>
</template>
<script>
import { getAddress } from "@/lib/googleMapPlaceParser";
import askUseCurrentLocation from "@/helper/userLocationHelper";
import useLazyImport from "@/composable/useLazyImport";
export default {
  components: {
    PickLocationModal: () =>
      useLazyImport(() => import("./PickLocationModal.vue")),
  },
  props: {
    location: {
      type: Object,
      required: true,
    },
    showAdditionalAddress: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
  updated() {
    this.$nextTick(() => {
      this.$emit("on-finish-render");
    });
  },
  methods: {
    openModal() {
      this.$modal.show("location-picker-modal");
      if (!this.location.detail && this.location.detail.length === 0) {
        this.askUserLocation();
      }
    },
    askUserLocation() {
      askUseCurrentLocation()
        .then((geolocation) => {
          // user accept browser access his location
          if (geolocation.lat && geolocation.lng) {
            getAddress(geolocation)
              .then((selectedLocation) => {
                this.$emit("on-location-pick", {
                  placeName: selectedLocation.placeName,
                  lat: selectedLocation.lat,
                  lng: selectedLocation.lng,
                  detail: selectedLocation.detail,
                  isBrowserLocation: true,
                });
                // show modal
                this.$modal.show("location-picker-modal");
              })
              .catch((error) => {
                this.$alert.warning(error.message);
              });
          }
          // user deny browser access his location
          else {
            // show modal
            this.$modal.show("location-picker-modal");
          }
        })
        .catch((error) => {
          // show modal
          this.$modal.show("location-picker-modal");
          this.$alert.info(error.message);
        });
    },
    locationPicked(location) {
      this.$emit("on-location-pick", location);
    },
    locationModalOpened() {
      this.$emit("on-modal-opened");
    },
  },
};
</script>
