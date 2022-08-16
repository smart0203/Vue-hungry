<template>
  <div>
    <footer class="p-3 text-white bg-red-dark">
      <div
        class="flex flex-col items-start lg:flex-row lg:mx-auto lg:mt-3 max-width"
      >
        <div class="flex flex-col lg:mb-0 lg:w-5/12 lg:mr-4">
          <div class="flex items-center lg:items-start">
            <img
              class="mr-6 footer-logo"
              src="@/assets/logo-new-lite.png"
              alt="footer-logo"
              width="80"
              loading="lazy"
              height="80"
            />
            <div class="lg:w-4/5">
              <h2 class="mb-1 text-sm font-black lg:text-base">Download App</h2>
              <p class="mr-2 text-2xs lg:my-1 lg:text-sm near-text-white">
                {{ $t("webTitle") }} <br />{{ $t("endWebTitle") }}
              </p>
              <!-- play store, app store button -->
              <div class="flex items-center mt-2 text-sm lg:text-base">
                <a
                  target="_blank"
                  class="flex w-full"
                  href="https://apps.apple.com/th/app/hungry-hub-dining-offer-app/id879303325"
                  rel="noopener noreferrer"
                >
                  <img
                    class="mr-2 store-icon"
                    src="@/assets/icon-app-store-white.png"
                    alt="app-store-icon"
                    width="25"
                    height="25"
                    loading="lazy"
                  />
                  <span class="flex-auto">App Store</span>
                </a>
                <a
                  target="_blank"
                  class="flex w-full"
                  href="https://play.google.com/store/apps/details?id=com.hb.hungryhub"
                  rel="noopener noreferrer"
                >
                  <img
                    class="mx-2 store-icon"
                    src="@/assets/icon-play-store-white.png"
                    alt="google-play-icon"
                    width="25"
                    loading="lazy"
                    height="25"
                  />
                  <span class="flex-auto">Play Store</span>
                </a>
              </div>
            </div>
          </div>
          <div v-if="isDesktop" class="mt-4 text-sm text-left">
            Copyright © {{ currentYear }} Hungry Hub by AppServation Co., Ltd.
            All right reserved.
          </div>
        </div>
        <div v-if="isMobile" class="flex w-full text-sm lg:w-4/12 lg:text-base">
          <div class="w-full">
            <div class="my-3 font-black">{{ $t("followUs") }}</div>
            <div class="flex">
              <a
                class="flex"
                target="_blank"
                href="https://timeline.line.me/user/_dc9afbiMcAAagiMIJwN-3gG1jmEVX2FLbXq3qYs"
                rel="noopener noreferrer"
              >
                <img
                  class="inline-block mr-3 social-icon"
                  src="@/assets/icon-line.png"
                  alt="icon line"
                  width="30"
                  height="30"
                  loading="lazy"
                />
              </a>
              <a
                class="flex"
                href="https://www.facebook.com/hungryhub"
                rel="noopener noreferrer"
                target="_blank"
              >
                <img
                  class="inline-block mr-3 social-icon"
                  src="@/assets/icon-facebook.png"
                  alt="icon facebook"
                  width="30"
                  height="30"
                  loading="lazy"
                />
              </a>
              <a
                class="flex"
                href="https://www.instagram.com/hungryhub"
                rel="noopener noreferrer"
                target="_blank"
              >
                <img
                  class="inline-block mr-3 social-icon"
                  src="@/assets/icon-ig.png"
                  alt="icon ig"
                  width="30"
                  loading="lazy"
                  height="30"
                />
              </a>
              <a
                class="flex"
                href="https://twitter.com/hungryhub"
                rel="noopener noreferrer"
                target="_blank"
              >
                <img
                  class="inline-block mr-3 social-icon"
                  src="@/assets/icon-twitter.png"
                  alt="icon twitter"
                  width="30"
                  loading="lazy"
                  height="30"
                />
              </a>
            </div>
          </div>
        </div>
        <div class="flex flex-col lg:ml-16 lg:w-6/12">
          <div class="flex">
            <!-- follow us -->
            <div v-if="isDesktop" class="flex flex-wrap">
              <div class="w-full mt-3 mb-3 font-black">
                {{ $t("followUs") }}
              </div>
              <a
                target="_blank"
                href="https://www.facebook.com/hungryhub"
                rel="noopener noreferrer"
              >
                <img
                  class="inline-block mr-3 social-icon"
                  src="@/assets/icon-facebook.png"
                  alt="icon facebook"
                  width="30"
                  height="30"
                  loading="lazy"
                />
              </a>
              <a
                target="_blank"
                href="https://twitter.com/hungryhub"
                rel="noopener noreferrer"
              >
                <img
                  class="inline-block mr-3 social-icon"
                  src="@/assets/icon-twitter.png"
                  alt="icon twitter"
                  width="30"
                  loading="lazy"
                  height="30"
                />
              </a>
              <a
                target="_blank"
                href="https://www.instagram.com/hungryhub"
                rel="noopener noreferrer"
              >
                <img
                  class="inline-block mr-3 social-icon"
                  src="@/assets/icon-ig.png"
                  alt="icon ig"
                  width="30"
                  loading="lazy"
                  height="30"
                />
              </a>
              <a
                target="_blank"
                href="https://lin.ee/3AZEbKQ"
                rel="noopener noreferrer"
              >
                <img
                  class="inline-block mr-3 social-icon"
                  src="@/assets/icon-line.png"
                  alt="icon line"
                  width="30"
                  height="30"
                  loading="lazy"
                />
              </a>
            </div>
            <!-- subscribe email -->
            <!-- <div v-if="false" class="w-full lg:relative">
              <div class="lg:absolute lg:bottom-0">
                <div
                  class="flex w-full py-1 my-2 bg-white rounded-full shadow lg:my-0 lg:ml-8"
                >
                  <input
                    type="text"
                    class="w-full px-3 text-sm bg-white rounded-full text-red-dark"
                    placeholder="Email Address"
                  />
                  <button
                    class="px-2 mr-4 text-sm font-black uppercase border-none text-red-dark"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div> -->
          </div>
          <!-- footer link-->
          <div>
            <div class="flex flex-wrap mt-2 lg:mt-4">
              <router-link
                :to="{ path: '/restaurants/top' }"
                class="w-1/3 py-1 pr-1 text-xs lg:text-sm lg:w-1/4 hover:underline"
              >
                {{ $t("topRestaurant") }}
              </router-link>
              <a
                href="https://hungryhub.zendesk.com/hc/en-us/sections/360001180074"
                target="_blank"
                class="w-1/3 py-1 pr-1 text-xs lg:text-sm lg:w-1/4 hover:underline"
                rel="noopener noreferrer"
              >
                {{ $t("hungryPoint") }}
              </a>
              <a
                href="https://hungryhub.zendesk.com/hc/en-us/sections/360001198573-การจอง-How-to-book"
                target="_blank"
                class="w-1/3 py-1 pr-1 text-xs lg:text-sm lg:w-1/4 hover:underline"
                rel="noopener noreferrer"
              >
                {{ $t("howToBook") }}
              </a>
              <a
                href="https://hungryhub.zendesk.com/hc/en-us/sections/360001198453-ทั-วไป-General"
                target="_blank"
                class="w-1/3 py-1 pr-1 text-xs lg:text-sm lg:w-1/4 hover:underline"
                rel="noopener noreferrer"
              >
                {{ $t("faq") }}
              </a>
              <a
                href="https://blog.hungryhub.com/"
                target="_blank"
                class="w-1/3 py-1 pr-1 text-xs lg:text-sm lg:w-1/4 hover:underline"
                rel="noopener noreferrer"
              >
                {{ $t("blog") }}
              </a>
              <a
                href="https://blog.hungryhub.com/hungry-hub-team-2/"
                target="_blank"
                class="w-1/3 py-1 pr-1 text-xs lg:text-sm lg:w-1/4 hover:underline"
                rel="noopener noreferrer"
              >
                {{ $t("meetTheTeam") }}
              </a>
              <a
                href="https://hungryhub.zendesk.com/hc/en-us/articles/360009040074"
                target="_blank"
                class="w-1/3 py-1 pr-1 text-xs lg:text-sm lg:w-1/4 hover:underline"
                rel="noopener noreferrer"
              >
                {{ $t("privacy") }}
              </a>
              <a
                href="https://hungryhub.zendesk.com/hc/en-us/articles/360005673074"
                target="_blank"
                class="w-1/3 py-1 pr-1 text-xs lg:text-sm lg:w-1/4 hover:underline"
                rel="noopener noreferrer"
              >
                {{ $t("contactUs") }}
              </a>
            </div>
          </div>
        </div>
        <div v-if="isMobile" class="w-full mt-4 text-center text-2xs">
          Copyright © {{ currentYear }} Hungry Hub by AppServation Co., Ltd. All
          right reserved.
        </div>
      </div>
    </footer>
    <component :is="pdpaComponent"></component>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
let pdpaTimeOutInstance;

export default {
  data() {
    return {
      pdpaComponent: "",
    };
  },
  computed: {
    ...mapGetters(["baseUrlWithLang"]),
    lang() {
      return this.$root.$i18n.locale;
    },
    currentYear() {
      return this.$dayjs().format("YYYY");
    },
  },
  created() {
    this.loadPdpaComponent();
  },
  beforeDestroy() {
    clearTimeout(pdpaTimeOutInstance);
  },
  methods: {
    loadPdpaComponent() {
      try {
        const timeOut = 3000;
        pdpaTimeOutInstance = setTimeout(async () => {
          const moduleResult = await this.$useLazyImport(() =>
            import(
              /* webpackChunkName: "PDPAChunk" */ "@/components/Common/PDPA/PDPA.vue"
            )
          );
          this.pdpaComponent = moduleResult.default;
        }, timeOut);
      } catch (err) {
        this.$rollbar.error(err);
      }
    },
  },
};
</script>

<style scoped>
.footer-logo {
  width: 80px;
  height: 80px;
}

.store-icon {
  width: 20px;
  height: 20px;
}

.social-icon {
  width: 30px;
  height: 30px;
}

@screen lg {
  .footer-logo {
    width: 80px;
    height: 80px;
  }

  .store-icon {
    width: 25px;
    height: 25px;
  }

  .social-icon {
    width: 30px;
    height: 30px;
  }
}

a,
a:visited,
a:active {
  color: #f2f2f2;
}
</style>
<i18n>
{
  "en": {
    "webTitle": "Thailand’s No.1 Buffet App, offers you an exclusive All You Can Eat concept at normal ala carte restaurants. ",
    "endWebTitle": "Free Booking! Free Cancellation!",
    "followUs": "Follow Us",
    "bookARestaurant": "Book a Restaurant",
    "newRestaurant": "New Restaurants",
    "topRestaurant": "Top Restaurants",
    "groupDinning": "Group Dining",
    "blogReview": "Blogger Reviews",
    "support": "Support",
    "howToBook": "How to book",
    "faq": "FAQs",
    "askAQuestion": "Ask a Question",
    "shareFeedback": "Share Feedback",
    "aboutHungryhub": "About Hungry Hub",
    "blog": "Blog",
    "ourStroy": "Our Story",
    "privacy": "Privacy & Policy",
    "meetTheTeam": "Meet the Team",
    "hungryPoint": "Hungry Points",
    "contactUs": "Contact us"
  },
  "th": {
    "webTitle": "แหล่งรวมบุฟเฟ่ต์อันดับ 1 ในประเทศไทย อิ่มอร่อยกับร้านอาลาคาร์ทชั้นนำแบบบุฟเฟ่ต์ในงบที่คุมได้ จ่ายราคาเน็ท ",
    "endWebTitle": "จองและยกเลิกฟรี!",
    "followUs": "ติดตามเรา",
    "bookARestaurant": "จองร้านอาหาร",
    "newRestaurant": "ร้านอาหารใหม่",
    "topRestaurant": "ร้านอาหารยอดนิยม",
    "groupDinning": "จองโต๊ะกลุ่มใหญ่",
    "blogReview": "รีวิวจาก Bloggers",
    "support": "ช่วยเหลือ",
    "howToBook": "วิธีการจองโต๊ะ",
    "faq": "คำถามที่พบบ่อย",
    "askAQuestion": "ถามคำถาม",
    "shareFeedback": "ข้อเสนอแนะ",
    "aboutHungryhub": "เกี่ยวกับ Hungry Hub",
    "blog": "บล็อก",
    "ourStroy": "เรื่องราวของพวกเรา",
    "privacy": "ข้อมูลส่วนบุคคลและข้อกำหนดต่าง ๆ",
    "meetTheTeam": "เกี่ยวกับทีมงาน",
    "hungryPoint": "เกี่ยวกับ Hungry Points",
    "contactUs": "ติดต่อเรา"
  }
}
</i18n>
