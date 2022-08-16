<template>
  <div class="px-4 my-8 mt-8 lg:min-h-full lg:my-8 lg:mx-4">
    <div class="mb-4 font-black text-center">{{ $t("referFriend") }}</div>
    <div class="mb-4 text-center">
      {{ $t("earnHungryPoint", { point: referrerRewardPoint }) }}
    </div>
    <div class="mb-4 text-center">
      {{ $t("giftYourFriend", { point: referrerRewardPoint }) }}
    </div>
    <button
      class="block px-4 py-2 mx-auto mt-2 mb-2 text-xs font-black text-white border rounded-full bg-red-dark lg:text-sm"
      @click="shareReferral"
    >
      {{ $t("shareCode") }}
    </button>
    <div v-if="isDesktop" class="flex items-center justify-center mt-2">
      <img
        src="@/assets/icon-fb-color.png"
        class="mr-2 cursor-pointer"
        alt="icon-fb"
        width="24"
         loading="lazy"
        height="24"
        @click="shareToMedia('fb')"
      />
      <img
        src="@/assets/icon-line-color.png"
        alt="icon-line"
        width="24"
        height="24"
         loading="lazy"
        class="cursor-pointer"
        @click="shareToMedia('line')"
      />
    </div>
  </div>
</template>

<script>
import {
  IOS_STORE_LINK,
  ANDROID_STORE_LINK,
  PRODUCTION_URL,
} from "@/lib/constant";
import { useClipboard } from "@vueuse/core";
import { mapGetters, mapState } from "vuex";
import parseUserAgent from "@/helper/userAgentParser";
import useNavigatorShare from "@/composable/useNavigatorShare";

const { osName } = parseUserAgent();

export default {
  setup() {
    const { text, copy, copied, isSupported } = useClipboard();
    return {
      text,
      copy,
      copied,
      isSupported,
    };
  },
  data() {
    return {
      shareMessage: "",
      osName,
    };
  },
  computed: {
    ...mapState("user", ["referralCode", "email"]),
    ...mapGetters("webConfig", ["referrerRewardPoint"]),
    isApplePlatform() {
      return this.osName === "ios" || this.osName === "mac os";
    },
  },
  methods: {
    setShareMessage() {
      const desktopMessage = `Hey, check out awesome deal at Hungry Hub and use this code ${this.referralCode} for discount. `;
      const mobileMessage = `Hey, check out this awesome app (Hungry Hub) and use this code ${this.referralCode} for discount. Download here: `;
      let storeLink = ANDROID_STORE_LINK;
      if (this.isApplePlatform) {
        storeLink = IOS_STORE_LINK;
      }
      this.shareMessage = this.isDesktop
        ? desktopMessage
        : `${mobileMessage}${storeLink}`;
    },
    shareReferral() {
      if (this.isDesktop) {
        this.shareReferralDesktop();
        return;
      }
      this.shareReferralMobile();
    },
    shareReferralMobile() {
      if (this.isApplePlatform) {
        this.shareToClipboard();
        return;
      }
      this.shareToWebAPI();
    },
    shareReferralDesktop() {
      this.shareToClipboard();
    },
    shareToWebAPI() {
      this.setShareMessage();
      useNavigatorShare({
        title: "Hungryhub",
        message: this.shareMessage,
      });
    },
    shareToClipboard() {
      this.setShareMessage();
      const defaultErrorMessage =
        "Oops, something went wrong, failed copy referral code";
      try {
        if (this.isSupported) {
          this.copy(this.shareMessage);
          this.$alert.success("Referral code copied to clipboard");
          this.$emit("on-referral-code-shared");
        } else {
          this.$alert.error(defaultErrorMessage);
          this.$rollbar.error(defaultErrorMessage, {
            referralCode: this.referralCode,
            email: this.email,
          });
        }
      } catch (err) {
        this.$alert.error(defaultErrorMessage);
        this.$rollbar.error(err);
      }
    },
    shareToMedia(type) {
      this.setShareMessage();
      let link;
      if (type === "line") {
        link = `https://line.me/R/msg/text/?${encodeURIComponent(
          this.shareMessage
        )}`;
      } else if (type === "fb") {
        link = `https://www.facebook.com/sharer.php?u=${PRODUCTION_URL}&quote=${this.shareMessage}`;
      }
      window.open(link, "_blank");
      this.$emit("on-referral-code-shared");
    },
  },
};
</script>
<i18n>
{
  "en": {
    "referFriend": "Refer a Friend",
    "shareCode": "Share Code",
    "earnHungryPoint": "1. Earn {point} Hungry Points when your friend makes their first booking",
    "giftYourFriend": "2. Gift your friend a ฿{point} voucher to use their first booking"
  },
  "th": {
    "referFriend": "แนะนำเพื่อน",
    "shareCode": "แชร์โค้ด",
    "earnHungryPoint": "1. คุณจะได้รับ {point} Hungry Points เมื่อเพื่อนของคุณทำการจองและไปทานครั้งแรก",
    "giftYourFriend": "2. เพื่อนของคุณจะได้รับวอชเชอร์มูลค่า {point} บาท เพื่อใช้ในการจองครั้งแรก"
  }
}
</i18n>
