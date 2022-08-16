<template>
  <div v-observe-visibility="{ callback: visibilityChanged, once: true }">
    <div
      class="py-3 text-sm font-black text-center capitalize lg:font-black lg:text-center lg:text-xl text-red-dark"
    >
      {{ $t("blog") }}
    </div>
    <div class="relative">
      <div class="mx-4">
        <div ref="blog-post-slider" class="w-full swiper">
          <div
            class="w-full pb-8 my-4 swiper-wrapper"
            :class="isLoading ? 'flex items-center justify-center' : null"
          >
            <div
              v-for="post in blogPosts"
              :key="post.title"
              class="flex swiper-slide blog-post-item"
            >
              <div
                v-if="isLoading"
                class="w-full h-full mr-4 bg-gray-300"
              ></div>
              <a
                v-else
                class="block w-full h-full"
                target="_blank"
                :href="post.link"
                rel="noopener noreferrer"
              >
                <HhImage
                  :img="rebuildUrl(post.cover)"
                  class="main-image"
                  :is-lazy="false"
                  :desktop-width="300"
                  :mobile-width="200"
                  width="200"
                  height="165"
                />
              </a>
            </div>
          </div>
          <!-- pagination -->
          <div class="mt-4 swiper-pagination"></div>
        </div>
      </div>
      <!-- Add Arrows -->
      <template v-if="isDesktop">
        <div ref="slider-next" class="slider-next text-red-dark">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="currentColor"
            class="inline icon-chevron-right"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </div>
        <div ref="slider-prev" class="slider-prev text-red-dark">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="currentColor"
            class="inline icon-chevron-left text-red-dark"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
            />
          </svg>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { Swiper, Navigation, Pagination } from "swiper";
import axios from "@/lib/myAjax";
import { forceHttpsUrl } from "@/helper/urlHelper";
Swiper.use([Navigation, Pagination]);

export default {
  data() {
    return {
      isLoading: true,
      blogPosts: [],
    };
  },
  mounted() {
    this.initDummyData();
  },
  methods: {
    forceHttpsUrl,
    visibilityChanged(visibility) {
      if (visibility === true) {
        this.getBlogPosts();
      }
    },
    async getBlogPosts() {
      try {
        this.isLoading = true;
        const response = await axios({
          method: "get",
          url: `/blog_posts.json`,
        });
        const respData = response.data;
        if (respData) {
          if (respData.data.length > 0 && respData.success === true) {
            this.blogPosts = Object.freeze(respData.data);
            this.initSlider();
          } else {
            this.$alert.error(respData.message);
            this.$rollbar.error(respData.message);
          }
        } else {
          this.$alert.error("Oops, something went wrong, failed get blog post");
          this.$rollbar.error(response);
        }
      } catch (err) {
        if (!err.dontReport) {
          this.$alert.error("Oops, something went wrong, failed get blog post");
          this.$rollbar.error(err);
        }
      } finally {
        this.isLoading = false;
      }
    },
    initDummyData() {
      const count = this.isDesktop ? 4 : 3;
      for (let index = 0; index < count; index++) {
        const dummy = {
          cover: "",
          link: "",
          title: Math.random().toString(36),
        };
        this.blogPosts.push(Object.freeze(dummy));
      }
    },
    async initSlider() {
      try {
        this.$nextTick(() => {
          const el = this.$refs["blog-post-slider"];
          try {
            new Swiper(el, {
              lazy: true,
              spaceBetween: this.isDesktop ? 20 : 10,
              slidesPerView: this.isDesktop ? 4 : 2,
              pagination: {
                el: ".swiper-pagination",
                clickable: true,
              },
              loop: true,
              navigation: {
                nextEl: this.$refs["slider-next"],
                prevEl: this.$refs["slider-prev"],
              },
            });
          } catch (err) {
            this.$alert.error(err);
            this.$rollbar.error(err);
          }
        });
      } catch (err) {
        this.$rollbar.error(err);
      }
    },
    rebuildUrl(url) {
      // replace 'newblog` to 'blog' in url
      if (!url) {
        return "";
      }
      return forceHttpsUrl(
        url.replace("newblog.hungryhub.com", "blog.hungryhub.com")
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.slider-next {
  position: absolute;
  top: 30%;
  right: -50px;
  z-index: 10;
  cursor: pointer;
}

.slider-prev {
  position: absolute;
  top: 30%;
  left: -60px;
  z-index: 10;
  cursor: pointer;
}

.blog-post-item {
  width: 100%;
  height: 100px;

  .main-image {
    width: 100%;
    height: 100px;
    border-radius: 8px;
    background: #e4e4e4;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  }
}

@screen lg {
  .blog-post-item {
    width: 100%;
    height: 195px;

    .main-image {
      width: 100%;
      height: 100%;
      border-radius: 8px;
      background: #e4e4e4;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
    }
  }
}
</style>
