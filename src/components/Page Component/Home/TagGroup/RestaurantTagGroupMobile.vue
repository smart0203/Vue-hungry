<template>
  <div class="flex">
    <template v-if="isLoading">
      <div class="ph-item">
        <div class="ph-col-12">
          <div class="ph-row">
            <div class="ph-col-2"></div>
            <div class="ph-col-10 empty"></div>
          </div>
        </div>
        <div class="flex flex-row">
          <div class="w-1/3">
            <div class="ph-item">
              <div class="ph-col-12">
                <div class="ph-picture"></div>
                <div class="ph-row">
                  <div class="ph-col-6 big"></div>
                  <div class="ph-col-4 empty big"></div>
                  <div class="ph-col-2 big"></div>
                </div>
                <div class="ph-row">
                  <div class="ph-col-2"></div>
                  <div class="ph-col-2 empty"></div>
                  <div class="ph-col-2"></div>
                  <div class="ph-col-2 empty"></div>
                  <div class="ph-col-2"></div>
                  <div class="ph-col-2"></div>
                </div>
                <div class="ph-row">
                  <div class="ph-col-2"></div>
                  <div class="ph-col-2 empty"></div>
                  <div class="ph-col-2"></div>
                  <div class="ph-col-2 empty"></div>
                  <div class="ph-col-2"></div>
                  <div class="ph-col-2"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="w-1/3">
            <div class="ph-item">
              <div class="ph-col-12">
                <div class="ph-picture"></div>
                <div class="ph-row">
                  <div class="ph-col-6 big"></div>
                  <div class="ph-col-4 empty big"></div>
                  <div class="ph-col-2 big"></div>
                </div>
                <div class="ph-row">
                  <div class="ph-col-2"></div>
                  <div class="ph-col-2 empty"></div>
                  <div class="ph-col-2"></div>
                  <div class="ph-col-2 empty"></div>
                  <div class="ph-col-2"></div>
                  <div class="ph-col-2"></div>
                </div>
                <div class="ph-row">
                  <div class="ph-col-2"></div>
                  <div class="ph-col-2 empty"></div>
                  <div class="ph-col-2"></div>
                  <div class="ph-col-2 empty"></div>
                  <div class="ph-col-2"></div>
                  <div class="ph-col-2"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="w-1/3">
            <div class="ph-item">
              <div class="ph-col-12">
                <div class="ph-picture"></div>
                <div class="ph-row">
                  <div class="ph-col-6 big"></div>
                  <div class="ph-col-4 empty big"></div>
                  <div class="ph-col-2 big"></div>
                </div>
                <div class="ph-row">
                  <div class="ph-col-2"></div>
                  <div class="ph-col-2 empty"></div>
                  <div class="ph-col-2"></div>
                  <div class="ph-col-2 empty"></div>
                  <div class="ph-col-2"></div>
                  <div class="ph-col-2"></div>
                </div>
                <div class="ph-row">
                  <div class="ph-col-2"></div>
                  <div class="ph-col-2 empty"></div>
                  <div class="ph-col-2"></div>
                  <div class="ph-col-2 empty"></div>
                  <div class="ph-col-2"></div>
                  <div class="ph-col-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div v-else class="w-full">
      <div ref="tag-group-slider" class="w-full swiper">
        <div class="pb-8 mb-8 swiper-wrapper" style="margin-bottom: 25px">
          <a
            v-for="tag in tagGroups"
            :key="tag.id"
            class="relative tag-group-item swiper-slide"
            :href="tag.link"
          >
            <HhImage
              v-if="!isLoading"
              class="main-image"
              mobile-width="half-screen"
              :alt="tag.name || 'restaurant-tag-group-image'"
              :desktop-width="270"
              width="270"
              height="100"
              :img="$url(tag.photoUrl, 'asset')"
            />
            <div v-else class="w-1/2 h-40 bg-gray-300"></div>

            <div class="flex items-center mt-2 text-xs">
              <div class="mr-2">
                <img
                  src="@/assets/icon-home-black.png"
                  alt="icon home"
                  width="10"
                  height="10"
                  loading="lazy"
                />
              </div>
              {{
                `${tag.restaurantIds.length} ${$tc(
                  "restaurant",
                  $formatThousand(tag.restaurantIds.length)
                )}`
              }}
            </div>
          </a>
        </div>
        <!-- pagination -->
        <div class="mt-4 swiper-pagination"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper, Navigation, Pagination, Virtual } from "swiper";
Swiper.use([Navigation, Pagination, Virtual]);

export default {
  props: {
    tagGroups: {
      type: Array,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
  },
  updated() {
    this.$nextTick(() => {
      if (this.isLoading === false) {
        this.initSlider();
      }
    });
  },
  methods: {
    async initSlider() {
      const el = this.$refs["tag-group-slider"];
      try {
        new Swiper(el, {
          lazy: true,
          spaceBetween: 15,
          slidesPerView: 2,
          pagination: {
            el: ".swiper-pagination",
            clickable: true,
          },
        });
      } catch (err) {
        this.$alert.error(err);
        this.$rollbar.error(err);
      }
    },
  },
};
</script>
