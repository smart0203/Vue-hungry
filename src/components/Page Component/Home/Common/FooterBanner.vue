<template>
  <div class="flex flex-col lg:flex-row">
    <div class="relative w-full lg:w-1/2">
      <HhImage
        class="w-full"
        :img="corporateBookingImg"
        height="350"
        width="auto"
        alt="corporate-banner-image"
        disable-retina
      />
      <div class="button-wrap">
        <a
          href="https://goo.gl/forms/X16yCaP8nLFA2JOX2"
          rel="noopener noreferrer"
          target="_blank"
          class="text-xs button lg:text-lg"
          style=""
          >{{ $t("learnMore") }}
        </a>
      </div>
    </div>
    <div class="relative w-full lg:w-1/2">
      <HhImage
        class="w-full"
        :img="restaurantBookingImg"
        height="350"
        width="auto"
        alt="restaurant-campaign-banner-image"
        disable-retina
      />
      <div class="button-wrap">
        <a
          href="http://blog.hungryhub.com/dinein-reservation-partners/"
          rel="noopener noreferrer"
          target="_blank"
          class="text-xs button lg:text-lg"
          style=""
          >{{ $t("joinUsNow") }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["lang"]),
    corporateBookingImg() {
      let lang = "th";
      if (this.lang === "en") {
        lang = "en";
      } else {
        lang = "th";
      }
      return `@/assets/Banner-for-corporate-${lang}.jpg`;
    },
    restaurantBookingImg() {
      let lang = "th";
      if (this.lang === "en") {
        lang = "en";
      }
      return `@/assets/Banner-for-restaurant-${lang}.jpg`;
    },
  },
};
</script>
<style lang="scss" scoped>
.button-wrap {
  @apply absolute w-full;
  bottom: 10px;
  @screen lg {
    bottom: 20px;
  }
}
.button {
  @apply block mx-auto font-black text-center text-white bg-red-dark;
  width: 195px;
  height: 25px;
  line-height: 25px;
  box-shadow: -1px 3px 6px rgba(0, 0, 0, 0.16);
  border-radius: 23.5px;
  @screen lg {
    width: 350px;
    height: 50px;
    line-height: 50px;
  }
}
</style>
<i18n>
{
  "en": {
    "learnMore": "Learn More",
    "joinUsNow": "Join Us Now"
  },
  "th": {
    "learnMore": "เรียนรู้เพิ่มเติม ",
    "joinUsNow": "เข้าร่วมกับเราตอนนี้"

  }
}
</i18n>
