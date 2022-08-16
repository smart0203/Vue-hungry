import { i18n } from "@/lib/i18n/i18n.js";
import { relativeTime } from "@/helper/dateTimeHelper";
import { storageGetLanguage } from "@/lib/localStorage";
const lang = storageGetLanguage();
import { computed } from "@vue/composition-api";

let numbro;
import store from "@/store/index";
import moneyFormat from "@/lib/money";

const earlyReviewPoint = computed(() => {
  return store.getters["webConfig/earlyReviewPoint"];
});
const lastReservationText = async (lastBooking, totalReviews, totalCovers) => {
  const module = await import("numbro");
  numbro = module.default;
  const lastBookingMadeDate = new Date(lastBooking).getTime();
  const dayBeforeYesterday = new Date().getTime() - 60 * 60 * 1000 * 24 * 3;
  let lastBookingInfo = "";
  if (dayBeforeYesterday <= lastBookingMadeDate) {
    const reslativeTime = relativeTime(lastBookingMadeDate);
    lastBookingInfo = `${i18n.t("lastReservationCTA")} ${reslativeTime}`;
  } else if (totalReviews < 5) {
    lastBookingInfo = i18n.t("newRestaurantCTA", {
      point: `${moneyFormat(earlyReviewPoint.value)}+`,
    });
  } else {
    const number = numbro(totalCovers).format({
      spaceSeparated: false,
      average: true,
    });
    lastBookingInfo = `${i18n.t("totalRestaurantBookingCTA", {
      count: number,
    })}`;
  }
  return lastBookingInfo;
};

const generateBranchLink = function generateBranchLink({ branchId, slug }) {
  if (branchId) {
    return `/restaurants/search?branch_id=${branchId}&locale=${lang}`;
  } else if (slug) {
    return `/restaurants/${slug}?locale=${lang}`;
  }
};

const getYoutubeId = function getYoutubeId(videosArray) {
  let youtubeId = "";
  if (Array.isArray(videosArray)) {
    const youtubeVideos = videosArray.filter((video) => {
      return video.includes("youtube") && video.includes("embed");
    });
    youtubeVideos.forEach((youtubeVid) => {
      const isContainQueryString = youtubeVid.indexOf("?");
      const removedQueryString =
        isContainQueryString !== -1
          ? youtubeVid.slice(0, isContainQueryString)
          : youtubeVid;
      if (youtubeId.length === 0) {
        const splitEmbed = removedQueryString.split("embed/");
        if (splitEmbed.length) {
          youtubeId = splitEmbed[1];
        }
      }
    });
  }
  return youtubeId;
};

export { lastReservationText, generateBranchLink, getYoutubeId };
