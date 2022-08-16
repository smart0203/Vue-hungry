<template>
  <div class="min-h-screen mx-4 member-privilege">
    <div class="relative mt-6 mb-8">
      <router-link
        v-if="!isDesktop"
        to="/profile"
        class="absolute top-0 left-0 text-black"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          fill="currentColor"
          class="inline icon-chevron-left text-red-dark"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
            stroke-width="2"
          />
        </svg>
      </router-link>
      <p class="font-black text-center capitalize lg:font-normal lg:text-left">
        {{ $t("memberPriviliges") }}
      </p>
    </div>
    <!-- <div
      v-if="false"
      class="flex items-center justify-center"
      style="margin: 100px"
    >
      <div class="mr-2 loader"></div>
      <div class="capitalize lg:text-lg">{{ $t("pleaseWait") }}</div>
    </div> -->
    <div class="relative mt-4">
      <template v-if="isMobile">
        <p class="text-sm">{{ "Your Progress" }}</p>
        <p class="text-sm text-right capitalize">{{ $t("currentLevel") }}</p>
        <div class="mt-1 text-right">
          <span
            class="px-2 py-1 text-lg font-black rounded-full"
            :style="`color: ${currentPrivilegeLevel.textColor}; background-color: ${currentPrivilegeLevel.backgroundColor}`"
            >{{ currentPrivilegeLevel.name }}</span
          >
        </div>
        <div
          v-if="loyaltyLevelExpiryDate"
          class="w-10/12 mt-2 ml-auto text-xs text-right text-gray-600"
        >
          {{
            $t("maintainPrivilegeWarning", {
              date: loyaltyLevelExpiryDate,
            })
          }}
        </div>
        <MemberPrivilegeProgress class="my-4" />
        <p v-if="isMobile" class="text-sm capitalize">
          {{ $t("memberPriviliges") }}
        </p>
      </template>
      <div
        ref="member-privilege-slider"
        class="flex mt-4 mb-8 swiper member-privilege-slider"
      >
        <div class="flex swiper-wrapper">
          <div
            v-for="privilege in privilegeLevel"
            :key="privilege.id"
            class="flex flex-col items-center swiper-slide tier"
          >
            <MemberPrivilegeLevel
              class="flex-shrink-0 inline-block"
              :privilege="privilege"
            />
          </div>
        </div>
      </div>
      <div v-if="isDesktop" ref="slider-next" class="swiper-button-next">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="currentColor"
          class="inline icon-chevron-right text-red-dark"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </div>
      <div v-if="isDesktop" ref="slider-prev" class="swiper-button-prev">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
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
    </div>
  </div>
</template>

<script>
import "swiper/swiper-bundle.css";
import { ref } from "@vue/composition-api";
import { Swiper, Navigation, Pagination } from "swiper";
Swiper.use([Navigation, Pagination]);
import {
  privilegeLevel,
  currentPrivilegeLevel,
} from "@/composable/useUserPrivileges";
import MemberPrivilegeLevel from "./MemberPrivilegeLevel.vue";
import MemberPrivilegeProgress from "./MemberPrivilegeProgress.vue";

export default {
  name: "MemberPrivilege",
  components: {
    MemberPrivilegeLevel,
    MemberPrivilegeProgress,
  },
  setup() {
    let sliderInstance = ref("");
    return {
      sliderInstance,
      privilegeLevel,
      currentPrivilegeLevel,
    };
  },
  computed: {
    loyaltyLevelExpiryDate() {
      return this.$store.state.user.loyaltyLevelExpiryDate;
    },
  },
  watch: {
    privilegeLevel: {
      handler() {
        this.$nextTick(() => {
          this.initSlider();
        });
      },
      immediate: true,
    },
  },
  methods: {
    initSlider() {
      const el = this.$refs["member-privilege-slider"];
      let sliderConfig = {
        slidesPerView: "auto",
        grabCursor: true,
        navigation: {
          nextEl: this.$refs["slider-next"],
          prevEl: this.$refs["slider-prev"],
        },
      };

      try {
        this.sliderInstance = new Swiper(el, sliderConfig);
        if (this.isMobile) {
          const index = this.currentPrivilegeLevel.rank;
          setTimeout(() => {
            this.sliderInstance.slideTo(index);
          }, 1000);
        }
      } catch (err) {
        this.$alert.error(err);
        this.$rollbar.error(err);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.tier {
  width: 85%;
  @screen lg {
    width: 27%;
  }
  @apply mr-4;
}
.member-privilege {
  .restaurant-card-slide {
    width: 50%;

    @apply mr-2;

    @screen lg {
      width: 20%;
      margin: 0;
    }
  }

  .swiper-button-next {
    top: 40%;
    right: -40px;
  }

  .swiper-button-next::after {
    content: none;
  }

  .swiper-button-prev {
    top: 40%;
    left: -40px;
  }

  .swiper-button-prev::after {
    content: none;
  }
}
</style>
