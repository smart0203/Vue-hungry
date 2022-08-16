<template>
  <portal :to="PORTAL_FOR_MODAL_SELECTOR">
    <modal
      name="location-picker-modal"
      :width="modalWidth"
      height="auto"
      scrollable
      adaptive
      @opened="modalOpened"
    >
      <div class="relative m-2">
        <!-- close button for mobile -->
        <button
          v-if="isMobile"
          class="absolute text-xl bg-white border-none text-red-dark pa0 cursor"
          style="top: 0; right: 0; z-index: 9999"
          @click="closeModal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="inline icon-x-circle-fill"
            viewBox="0 0 16 16"
          >
            <path
              d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"
            />
          </svg>
        </button>
        <template v-if="isDesktop">
          <!-- search bar -->
          <div class="input-location-wrap">
            <span class="mx-2 my-2">Enter Location</span>
            <div class="flex mx-2 my-2">
              <button
                class="px-2 py-1 mr-2 text-xs border border-gray-300 shadow lg:text-sm"
                :class="
                  searcAddressMode == 'text'
                    ? ' bg-red-dark text-white'
                    : ' text-black'
                "
                @click="searcAddressMode = 'text'"
              >
                Address
              </button>
              <button
                class="px-2 py-1 text-xs border border-gray-300 shadow lg:text-sm"
                :class="
                  searcAddressMode == 'coordinate'
                    ? ' bg-red-dark text-white'
                    : ' text-black'
                "
                @click="searcAddressMode = 'coordinate'"
              >
                Latitude, Longitude
              </button>
            </div>
            <div v-if="searcAddressMode == 'text'">
              <google-places-autocomplete
                @resultChanged="applySuggestion"
                @resultCleared="() => (place = null)"
              >
                <div
                  slot="input"
                  slot-scope="{ context, events, actions }"
                  class="flex flex-col p-1"
                  style="border-botom: 1px solid silver"
                >
                  <div class="flex">
                    <div class="relative flex items-center flex-auto">
                      <input
                        id="locationInput"
                        v-model="context.input"
                        type="search"
                        class="flex-auto p-2 text-sm border border-gray-500 input-with-right-icon lg:text-base"
                        :placeholder="$t('searchBuilding')"
                        autocomplete="off"
                        @focus="events.inputHasReceivedFocus"
                        @input="events.inputHasChanged"
                        @blur="events.inputHasLostFocus"
                        @keydown.enter.prevent="actions.selectItemFromList"
                        @keydown.down.prevent="actions.shiftResultsSelection"
                        @keydown.up.prevent="actions.unshiftResultsSelection"
                      />
                      <span
                        class="icon-inside-right"
                        @click="context.input = ''"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="cursor-pointer icon-x-circle-fill red"
                          viewBox="0 0 16 16"
                        >
                          <path
                            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  slot="item"
                  slot-scope="{ place }"
                  class="block pb-2 cursor-pointer search-suggestion"
                  >{{ place.description }}</span
                >
                <span
                  slot="activeItem"
                  slot-scope="{ place }"
                  class="block pb-2 cursor-pointer search-suggestion"
                  >{{ place.description }}</span
                >
                >
              </google-places-autocomplete>
              <div class="px-1">
                <input
                  v-if="showAdditionalAddress"
                  v-model.trim="selectedLocation.noteForDriver"
                  type="text"
                  class="block w-full p-2 my-2 border border-gray-500"
                  :placeholder="$t('houseNumber')"
                />
              </div>
            </div>

            <div v-if="searcAddressMode == 'coordinate'">
              <div class="relative flex items-center flex-auto p-1">
                <input
                  id="inputLat"
                  v-model="inputCoordinate.lat"
                  type="number"
                  class="flex-auto p-2 text-sm border border-gray-500 input-with-right-icon lg:text-base"
                  :placeholder="'Latitude'"
                  autocomplete="off"
                />
                <span
                  class="icon-inside-right"
                  @click="inputCoordinate.lat = ''"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="cursor-pointer icon-x-circle-fill red"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"
                    />
                  </svg>
                </span>
              </div>
              <div class="relative flex items-center flex-auto p-1">
                <input
                  id="inputLng"
                  v-model="inputCoordinate.lng"
                  type="number"
                  class="flex-auto p-2 text-sm border border-gray-500 input-with-right-icon lg:text-base"
                  :placeholder="'Longitude'"
                  autocomplete="off"
                />
                <span
                  class="icon-inside-right"
                  @click="inputCoordinate.lng = ''"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="cursor-pointer icon-x-circle-fill red"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
          <!-- confirm bar -->
          <div
            v-if="selectedLocation.detail"
            class="p-2 text-sm text-left confirm-bar lg:text-base"
          >
            <p class="mt-1 text-base text-red-dark">
              {{ $t("selectedLocation") }}
            </p>
            <div class="flex flex-col rounded">
              <!-- place name -->
              <div class="flex-auto mb-2 mr-2 font-bold">
                {{ selectedLocation.placeName }}
              </div>
              <!-- detail address -->
              <div class="flex-auto mr-2">{{ selectedLocation.detail }}</div>
              <div class="mt-4 text-right">
                <button
                  class="px-3 py-2 text-white border rounded cursor-pointer border-red-dark bg-red-dark"
                  @click="saveLocation"
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
          <div :id="mapId" class="mt-1" :style="{ height: modalHeight }"></div>
        </template>
        <!-- Mobile viewport -->
        <template v-else>
          <div class="relative p-2 pt-3">
            <p class="font-bold">{{ title }}</p>
            <div class="mt-2 mb-4 text-left">
              <button
                class="px-2 py-2 text-sm border border-gray-500 rounded-sm lg:text-base"
                :class="
                  searchMode == 'text'
                    ? 'bg-red-dark text-white border-red-dark'
                    : 'bg-white text-gray-700 b--text-gray-500'
                "
                @click="searchMode = 'text'"
              >
                <span>{{ $t("searchByText") }}</span>
              </button>
              <button
                class="px-2 py-2 mr-1 text-sm border rounded-sm lg:text-base"
                :class="
                  searchMode == 'map'
                    ? 'bg-red-dark text-white border-red-dark'
                    : 'bg-white text-gray-700 b--text-gray-500'
                "
                @click="searchMode = 'map'"
              >
                <span>{{ $t("selectOnMap") }}</span>
              </button>
            </div>
            <div v-if="searchMode == 'text'">
              <google-places-autocomplete
                @resultChanged="applySuggestion"
                @resultCleared="() => (place = null)"
              >
                <div
                  slot="input"
                  slot-scope="{ context, events, actions }"
                  class="flex flex-col lg:flex-row"
                  style="border-botom: 1px solid silver"
                >
                  <div class="relative flex items-center flex-auto lg:mx-auto">
                    <input
                      id="locationInput"
                      v-model="context.input"
                      type="search"
                      class="flex-auto p-2 text-sm border border-gray-500 input-with-right-icon lg:text-base"
                      :placeholder="$t('searchBuilding')"
                      autocomplete="off"
                      @focus="events.inputHasReceivedFocus"
                      @input="events.inputHasChanged"
                      @keydown.enter.prevent="actions.selectItemFromList"
                      @keydown.down.prevent="actions.shiftResultsSelection"
                      @keydown.up.prevent="actions.unshiftResultsSelection"
                    />
                    <span class="icon-inside-right" @click="context.input = ''">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="inline cursor-pointer icon-x-circle-fill"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"
                        />
                      </svg>
                    </span>
                  </div>
                </div>

                <span
                  slot="item"
                  slot-scope="{ place }"
                  class="block pb-2 cursor-pointer search-suggestion"
                  >{{ place.description }}</span
                >
                <span
                  slot="activeItem"
                  slot-scope="{ place }"
                  class="block pb-2 cursor-pointer search-suggestion"
                  >{{ place.description }}</span
                >
                >
              </google-places-autocomplete>
              <input
                v-if="showAdditionalAddress"
                v-model.trim="selectedLocation.noteForDriver"
                type="text"
                class="block w-full p-2 my-2 text-sm bg-gray-100 lg:text-base"
                :placeholder="$t('houseNumber')"
              />
              <!-- selected location -->
              <div
                v-if="selectedLocation.detail"
                class="text-sm text-left lg:text-base"
              >
                <p class="text-sm lg:text-base text-red-dark">
                  {{ $t("selectedLocation") }}
                </p>
                <div class="mt-2 text-sm font-bold lg:text-base">
                  {{ selectedLocation.placeName }}
                </div>
                <div class="flex flex-col mt-2">
                  <div class="flex-auto mr-2 text-sm lg:text-base">
                    {{ selectedLocation.detail }}
                  </div>
                </div>
              </div>
              <button
                class="w-full px-2 py-2 mt-4 text-sm text-white border rounded-sm border-red-dark lg:text-base bg-red-dark"
                @click="saveLocation"
              >
                Ok
              </button>
            </div>
            <div v-else-if="searchMode == 'map'">
              <div
                :id="mapId"
                class="mt-1"
                :style="{ height: modalHeight }"
              ></div>
              <!-- selected location -->
              <div
                v-if="selectedLocation.detail"
                class="text-sm text-left lg:text-base"
              >
                <p class="text-base text-red-dark">
                  {{ $t("currentSelectedLocation") }}
                </p>
                <div class="mt-2 font-bold">
                  {{ selectedLocation.placeName }}
                </div>
                <div class="mt-2">{{ selectedLocation.detail }}</div>
                <input
                  v-if="showAdditionalAddress"
                  v-model.trim="selectedLocation.noteForDriver"
                  type="text"
                  class="block w-full p-2 my-2 bg-gray-100"
                  :placeholder="$t('houseNumber')"
                />
              </div>
              <button
                class="w-full px-2 py-2 mt-2 text-sm text-white border rounded-sm border-red-dark lg:text-base bg-red-dark"
                @click="saveLocation"
              >
                Ok
              </button>
            </div>
          </div>
        </template>
      </div>
    </modal>
  </portal>
</template>

<script>
import { getAddress, getPlaceDetail } from "@/lib/googleMapPlaceParser";
import askUseCurrentLocation from "@/helper/userLocationHelper";
import { nanoid } from "nanoid";
import { PORTAL_FOR_MODAL_SELECTOR } from "@/lib/constant";

import MarkIcon from "@/assets/icon-mark.svg";
import debounce from "lodash-es/debounce";
import isEmpty from "lodash-es/isEmpty";
import useLazyImport from "@/composable/useLazyImport";
const DEFAULT_COORDINATE = {
  lat: 13.742332,
  lng: 100.512171,
};
export default {
  components: {
    "google-places-autocomplete": () =>
      useLazyImport(() => import("./GooglePlaceAutoComplete")),
  },
  props: {
    location: {
      type: Object,
      default: () => {
        return {
          detail: "",
          lat: "",
          lng: "",
          name: "default",
          placeName: "",
        };
      },
      validator: (location) => {
        if (
          location.detail !== undefined &&
          location.lat !== undefined &&
          location.lng !== undefined
        ) {
          return true;
        }
        return false;
      },
    },
    showAdditionalAddress: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default() {
        return this.$t("deliveryAddress");
      },
    },
  },
  data() {
    return {
      PORTAL_FOR_MODAL_SELECTOR,
      searchMode: "text",
      searcAddressMode: "text",
      inputCoordinate: {
        lat: "",
        lng: "",
      },
      mapInstance: "",
      place: null,
      selectedLocation: {
        placeName: null,
        detail: null,
        lat: null,
        lng: null,
        noteForDriver: null,
      },
      marker: null,
      bound: "",
      mapCenter: null,
    };
  },
  computed: {
    mapId() {
      return `map-canvas-${nanoid(3)}`;
    },
    modalWidth() {
      if (this.isDesktop) {
        return "45%";
      }
      return "100%";
    },
    modalHeight() {
      if (this.isDesktop) {
        return "600px";
      }
      return "400px";
    },
    anySelectedLocation() {
      return this.location.detail && this.location.detail.length > 0;
    },
  },
  watch: {
    searchMode(newVal) {
      if (newVal == "map") {
        setTimeout(() => {
          this.initMap();
        }, 200);
      }
    },
    "location.lat"() {
      this.parseSelectedLocation();
    },
    "inputCoordinate.lat"() {
      this.debounceOnSearchByCoordinateChange();
    },
    "inputCoordinate.lng"() {
      this.debounceOnSearchByCoordinateChange();
    },
  },
  created() {
    this.debounceOnSearchByCoordinateChange = debounce(() => {
      this.applySuggestion(this.inputCoordinate);
    }, 1000);
  },
  methods: {
    closeModal() {
      this.$modal.hide("location-picker-modal");
    },
    modalOpened() {
      this.initMap();
      this.$emit("on-modal-opened");
    },
    saveLocation() {
      if (this.selectedLocation.detail) {
        this.$modal.hide("location-picker-modal");
        this.$emit("on-location-pick", this.selectedLocation);
      }
    },
    parseSelectedLocation() {
      // check previous selected location
      if (this.anySelectedLocation) {
        this.setSelectedLocation(this.location);
        this.setCenter({
          lat: this.selectedLocation.lat,
          lng: this.selectedLocation.lng,
        });
        this.focusToArea({
          lat: this.selectedLocation.lat,
          lng: this.selectedLocation.lng,
        });
      }
    },
    initMap() {
      // init map
      if (this.isDesktop || (this.isMobile && this.searchMode == "map")) {
        const map = document.getElementById(this.mapId);
        const mapOptions = {
          zoom: 9,
          center: new window.google.maps.LatLng(
            DEFAULT_COORDINATE.lat,
            DEFAULT_COORDINATE.lng
          ),
          mapTypeId: window.google.maps.MapTypeId.TERRAIN,
          mapTypeControl: false,
        };
        this.mapInstance = new window.google.maps.Map(map, mapOptions);
        // add ask user location button
        this.addAskCurrentLocationButton();
        // add tile loaded listener
        window.google.maps.event.addListener(
          this.mapInstance,
          "tilesloaded",
          () => {
            // remove tile loaded event because onyl used in init
            window.google.maps.event.clearListeners(
              this.mapInstance,
              "tilesloaded"
            );
            // set marker position to attach center of map
            this.addMarkerToCenterOfMap();
            this.addDragEndEvent();
            this.addMapClickListener();
            // check if user already have selected location
            if (this.anySelectedLocation) {
              this.parseSelectedLocation();
            }
            // else add marker to default coordinate
            else {
              this.setCenter({
                lat: DEFAULT_COORDINATE.lat,
                lng: DEFAULT_COORDINATE.lng,
              });
              this.focusToArea({
                lat: DEFAULT_COORDINATE.lat,
                lng: DEFAULT_COORDINATE.lng,
              });
            }
          }
        );
      }
    },
    addMarkerToCenterOfMap() {
      this.marker = new window.google.maps.Marker({
        map: this.mapInstance,
      });
      this.marker.bindTo("position", this.mapInstance, "center");
    },
    addDragEndEvent() {
      window.google.maps.event.addListener(this.mapInstance, "dragend", () => {
        this.getCenterLocationData();
      });
    },
    addAskCurrentLocationButton() {
      const centerControlDiv = document.createElement("div");
      new this.askLocationButton(
        centerControlDiv,
        this.mapInstance,
        this.askUserLocation
      );

      centerControlDiv.index = 1;
      this.mapInstance.controls[
        window.google.maps.ControlPosition.RIGHT_BOTTOM
      ].push(centerControlDiv);
    },
    askUserLocation() {
      askUseCurrentLocation()
        .then((geolocation) => {
          if (geolocation) {
            getAddress(geolocation)
              .then((selectedLocation) => {
                this.setCenter(selectedLocation);
              })
              .catch((error) => {
                this.$alert.warning(error.message);
              });
          }
        })
        .catch((error) => {
          this.$alert.info(error.message);
        });
    },
    askLocationButton(controlDiv, map, callback) {
      // Set CSS for the control border.
      var controlUI = document.createElement("div");
      controlUI.style.backgroundColor = "#fff";
      controlUI.style.border = "2px solid #fff";
      controlUI.style.borderRadius = "3px";
      controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
      controlUI.style.cursor = "cursor-pointer";
      controlUI.style.textAlign = " mx-auto ";
      controlUI.style.marginRight = "10px";
      controlUI.title = "Click to get your current position";
      controlDiv.appendChild(controlUI);

      // add img
      controlUI.innerHTML = '<img src="' + MarkIcon + '" loading="lazy"> ';
      // Setup the click event listeners: simply set the map to Chicago.
      controlUI.addEventListener("click", () => {
        callback();
      });
    },
    addMapClickListener() {
      if (!isEmpty(window.google)) {
        window.google.maps.event.addListener(
          this.mapInstance,
          "click",
          (event) => {
            this.setCenter({
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
            });
            this.getCenterLocationData();
          }
        );
      }
    },
    focusToArea({ lat = null, lng = null }) {
      if (typeof this.mapInstance.setZoom === "function" && lat && lng) {
        this.mapInstance.setZoom(17);
        const coordinate = new window.google.maps.LatLng(lat, lng);
        this.mapInstance.panTo(coordinate);
      }
    },
    getLocationData({ placeId, lat, lng }) {
      // if event have place ID get place detail
      if (placeId) {
        getPlaceDetail(placeId)
          .then((selectedLocation) => {
            this.setSelectedLocation(selectedLocation);
          })
          .catch((err) => {
            this.$alert.warning(err.message);
          });
      }
      // else get address detail based on lat, lng
      else {
        const geoLocation = {
          lat: lat,
          lng: lng,
        };
        getAddress(geoLocation)
          .then((selectedLocation) => {
            this.setSelectedLocation(selectedLocation);
          })
          .catch((err) => {
            this.$alert.warning(err.message);
          });
      }
    },
    setSelectedLocation(locationData) {
      const { placeName, detail, lat, lng, noteForDriver } = locationData;
      this.selectedLocation.placeName = placeName;
      this.selectedLocation.detail = detail;
      this.selectedLocation.lat = lat;
      this.selectedLocation.lng = lng;
      if (noteForDriver !== undefined) {
        this.selectedLocation.noteForDriver = noteForDriver;
      }
    },
    applySuggestion(locationData) {
      if (locationData && locationData.lat && locationData.lng) {
        this.setCenter({
          lat: locationData.lat,
          lng: locationData.lng,
          placeId: locationData.placeId,
        });
        this.setSelectedLocation(locationData);
      }
    },
    setCenter({ lat, lng }) {
      if (lat && lng && this.mapInstance) {
        const coordinate = new window.google.maps.LatLng(lat, lng);
        this.mapInstance.setCenter(coordinate);
        this.mapCenter = {
          lat: lat,
          lng: lng,
        };
      }
    },
    getCenterLocationData() {
      const currentCenter = this.mapInstance.getCenter();
      const currentLat = currentCenter.lat();
      const currentLng = currentCenter.lng();
      this.getLocationData({
        lat: currentLat,
        lng: currentLng,
      });
    },
  },
};
</script>
<style scoped>
.input-location-wrap {
  position: absolute;
  top: 10px;
  left: 10px;
  background: white;
  width: 60%;
  z-index: 4;
}

.confirm-bar {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: white;
  width: 60%;
  z-index: 4;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.search-suggestion {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.search-suggestion:hover {
  background: rgba(192, 192, 192, 0.3);
}

.input-with-icon-wrap {
  position: relative;
}

.icon-inside-left {
  position: absolute;
  padding: 0 10px;
  font-size: 18px;
}

.icon-inside-right {
  position: absolute;
  right: 0;
  padding: 0 10px;
  font-size: 18px;
}

.input-with-left-icon {
  padding-left: 40px;
}

.input-with-right-icon {
  padding-right: 40px;
}
</style>
<i18n>
{
  "en": {
    "searchBuilding": "Search Building",
    "selectedLocation": "Selected location",
    "currentSelectedLocation": "Current selected location",
    "houseNumber": "House Number",
    "deliveryAddress": "Delivery Address",
    "searchByText": "Search by text",
    "selectOnMap": "Select on map"
  },
  "th": {
    "searchBuilding": "ค้นหาอาคาร",
    "selectedLocation": "สถานที่ที่เลือก",
    "currentSelectedLocation": "ตำแหน่งที่เลือกในปัจจุบัน",
    "houseNumber": "บ้านเลขที่",
    "deliveryAddress": "ที่อยู่สำหรับการจัดส่ง",
    "searchByText": "ค้นหาโดยข้อความ",
    "selectOnMap": "เลือกบนแผนที่"
  }
}
</i18n>
