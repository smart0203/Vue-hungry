<template>
  <div>
    <iframe
      v-if="mapEmbed"
      class="w-full map"
      :src="mapEmbed"
      :class="mapType"
      frameborder="0"
      scrolling="no"
      marginheight="0"
      marginwidth="0"
      :style="isDelivery ? 'height: 380px' : ''"
    >
      <a href="https://www.maps.ie/coordinates.html">gps coordinates</a>
    </iframe>
    <div v-if="lalamoveMapLink" class="flex items-center justify-center">
      <button
        class="px-4 py-1 my-2 text-sm border rounded-full border-red-dark text-red-dark hover:underline"
        @click="openMapInNewTab"
      >
        View Larger Map
      </button>
    </div>
  </div>
</template>

<script>
import { state, computeds } from "./landing";

export default {
  setup() {
    const { isDineIn, isDelivery, map, reservationRealtimeDB } = state;
    const { deliveryStatus } = computeds;
    return {
      isDineIn,
      isDelivery,
      map,
      reservationRealtimeDB,
      deliveryStatus,
    };
  },
  computed: {
    lalamoveMapLink() {
      if (this.deliveryStatus === "Driver::PICKED_UP") {
        return this.reservationRealtimeDB.driver_tracking_link;
      }
      return null;
    },
    googleMapLink() {
      const mapLink = this.map;
      let latLng = "";
      if (mapLink.includes("&query=")) {
        latLng = mapLink.split("&query=")[1].split(",");
      } else if (mapLink.includes("?q=")) {
        latLng = mapLink.split("?q=")[1].split(",");
      }
      return `https://www.google.com/maps/embed/v1/place?q=${latLng[0]},${latLng[1]}&key=AIzaSyA4v4bdhjqwpTswYUXfMkmLno97XZXYaBA`;
    },
    mapEmbed() {
      if (this.isDineIn) {
        return this.googleMapLink;
      } else if (this.isDelivery) {
        return this.lalamoveMapLink;
      }
      return "";
    },
    mapType() {
      return this.isDineIn ? "restaurant-map" : "lalamove-map";
    },
  },
  methods: {
    openMapInNewTab() {
      window.open(this.lalamoveMapLink, "_blank");
    },
  },
};
</script>

<style scoped>
.restaurant-map {
  height: 120px;
}

.lalamove-map {
  height: 270px;
}

@screen lg {
  .restaurant-map {
    height: 100px;
  }

  .lalamove-map {
    height: 270px;
  }
}
</style>
