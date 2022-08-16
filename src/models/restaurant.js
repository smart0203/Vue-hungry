import { i18n } from "@/lib/i18n/i18n.js";
import { computed, ref } from "@vue/composition-api";
import { relativeTime } from "@/helper/dateTimeHelper";
import rollbar from "@/lib/rollbar";
import { generateBranchLink } from "@/helper/restaurantHelper";
import { storageGetLanguage } from "@/lib/localStorage";
import {
  groupLandingList,
  belongToGroupLanding,
} from "@/composable/groupLanding";
import isArray from "lodash-es/isArray";
import router from "@/router/router";
import { routerPushGuard } from "@/router/routerGuard";
const lang = storageGetLanguage();
import store from "@/store/index";
import moneyFormat from "@/lib/money";

const earlyReviewPoint = computed(() => {
  return store.getters["webConfig/earlyReviewPoint"];
});

let numbro;

class baseRestaurant {
  constructor(data) {
    this.logo = data.logo;
    this.type = data.type;
    this.id = data.id;
    this.name = data.name;
    this.lat = data.lat;
    this.lng = data.lng;
    this.description = data.description;
    this.reviewsCount = data.reviewsCount;
    this.reviewsScore =
      data.reviewsScore % 1 === 0
        ? `${data.reviewsScore}.0`
        : data.reviewsScore.toString();
    this.branchId = data.branchId;
    this.primaryLocation = {
      id: data.primaryLocation.id,
      name: data.primaryLocation.name,
    };
    this.primaryCuisine = {
      id: data.primaryCuisine.id,
      name: data.primaryCuisine.name,
    };
    this.imageCoverUrl = {
      thumb: data.imageCoverUrl.original,
      original: data.imageCoverUrl.original,
    };
    this.lastBookingWasMade = data.lastBookingWasMade;
    this.lastBookingWasMadeCTA = "";
    this.totalCovers = data.totalCovers;
    this.availablePackageTypes = data.availablePackageTypes;
    this.price = {
      amount: data.price.amount,
      currency: data.price.currency,
      symbol: data.price.symbol,
      format: data.price.format,
    };
    this.expiryDate = data.expiryDate;
    this.pricingType = data.pricingType;
    this.slug = data.slug;
    this.tags = data.tags;

    this.anyDeliveryPackage = null;
    this.anyDineInPackage = null;
    this.anyXperiencePackage = null;
    this.openingHoursShort = data.openingHoursShort;
    this.acceptVoucher = data.acceptVoucher;
    this.isAds = data.isAds || false;
    this.groupLandingLink = ref();
    this.isHaveBranch = (() => {
      return this.branchId ? true : false;
    })();
    this.isBelongToGroupLanding = computed(() => {
      if (
        !groupLandingList.value ||
        (groupLandingList.value && isArray(groupLandingList.value) === false) ||
        !this.branchId
      ) {
        return false;
      }
      const checkIsBelong = belongToGroupLanding(this.branchId);
      if (checkIsBelong && checkIsBelong.length) {
        this.groupLandingLink.value = `/${checkIsBelong[0].slug}?locale=${lang}`;
        return true;
      }
      return false;
    });
    this.branchLink = (() => {
      const branchLink = generateBranchLink({
        branchId: this.branchId,
        slug: this.slug,
      });
      if (!this.isHaveBranch) {
        return null;
      }
      return branchLink;
    })();
    this.isNewRestaurant = (() => {
      return this.reviewsCount < 5 ? true : false;
    })();
    this.isStaycation = (() => {
      return this.primaryCuisine.id == "461" ? true : false;
    })();
    this.isFavourited = false;
    this.link = computed(() => {
      if (this.type === "restaurants") {
        return `/restaurants/${this.slug}?locale=${lang}`;
      } else if (this.type === "featured_restaurants") {
        if (this.isBelongToGroupLanding.value) {
          return this.groupLandingLink.value;
        }
        if (this.isHaveBranch) {
          return this.branchLink;
        }
        if (this.slug) {
          return `/restaurants/${this.slug}?locale=${lang}`;
        }
        return "";
      }
      return "";
    });
    this.validate();
    this.setLastBookingText();
    this.checkDineInDeliveryPackage();
    this.goToLink = () => {
      if (this.link.value.includes("/search")) {
        const newRoute = router.resolve({
          path: `/restaurants/search`,
          query: { branch_id: this.branchId, locale: lang },
        });
        routerPushGuard(newRoute);
      } else if (this.link.value.includes("/restaurants")) {
        const newRoute = router.resolve({
          path: `/restaurants/${this.slug}`,
          query: { locale: lang },
        });
        routerPushGuard(newRoute);
      } else {
        window.location = this.link.value;
      }
    };
    return this;
  }

  validate() {
    if (this.type !== "restaurants" && this.type !== "featured_restaurants") {
      rollbar.error(
        "Invalid restaurant type, must 'restaurants' or 'featured_restaurants' ",
        { restaurantName: this.name, restaurantId: this.id }
      );
    }
    // more validation coming soon
  }

  async setLastBookingText() {
    if (!numbro) {
      const module = await import("numbro");
      numbro = module.default;
    }
    const lastBookingMadeDate = new Date(this.lastBookingWasMade).getTime();
    const dayBeforeYesterday = new Date().getTime() - 60 * 60 * 1000 * 24 * 3;
    let lastBookingInfo = "";
    if (dayBeforeYesterday <= lastBookingMadeDate) {
      const reslativeTime = relativeTime(lastBookingMadeDate);
      lastBookingInfo = `${i18n.t("lastReservationCTA")} ${reslativeTime}`;
    } else if (this.reviewsCount < 5) {
      lastBookingInfo = i18n.t("newRestaurantCTA", {
        point: `${moneyFormat(earlyReviewPoint.value)}+`,
      });
    } else {
      const number = numbro(this.totalCovers).format({
        spaceSeparated: false,
        average: true,
      });
      lastBookingInfo = `${i18n.t("totalRestaurantBookingCTA", {
        count: number,
      })}`;
    }
    this.lastBookingWasMadeCTA = lastBookingInfo;
    return this;
  }

  checkDineInDeliveryPackage() {
    try {
      let anyDineIn = false;
      let anyDelivery = false;
      let anyXperiencePackage = false;
      this.availablePackageTypes.forEach((type) => {
        if (type === "hah") {
          anyDelivery = true;
        } else if (type === "xp") {
          anyXperiencePackage = true;
        } else {
          anyDineIn = true;
        }
      });
      this.anyDeliveryPackage = anyDelivery;
      this.anyDineInPackage = anyDineIn;
      this.anyXperiencePackage = anyXperiencePackage;
    } catch (err) {
      throw new Error(err);
    }
  }
}
class catalogRestaurant extends baseRestaurant {
  constructor(data) {
    super(data);
    this.customText = data.customText;
    this.totalLocations = data.totalLocations;
    this.deliveryProperty = {
      isShow: false,
      isLoading: false,
    };
  }
}

class detailRestaurant extends baseRestaurant {
  constructor(data) {
    super(data);
    this.tags = data.tags;
    this.isReservationSystemOnly = data.isReservationSystemOnly;
    this.isRecordGuest = data.isRecordGuest;
    this.isAcceptKids = data.isAcceptKids;
    this.isAcceptVoucher = data.isAcceptVoucher;
    this.isAllowBooking = data.isAllowBooking;
    this.selfPickupMessage = data.selfPickupMessage;
    this.customSeats = data.customSeats;
    this.customSectionTitle = data.customSectionTitle;
    this.customSectionContent = data.customSectionContent;
    this.largestTable = data.largestTable;
    this.smallestTable = data.smallestTable; // equal min_party_size in API
    this.mapLocation = data.mapLocation;
    this.isEnableBigGroup = data.isEnableBigGroup;
    this.canonicalLink = data.canonicalLink;
    this.reservationDurationInHours; // ?
    this.openingHours = data.openingHours;
    this.hashtags = [...data.hashtags];
    this.videos = [...data.videos];
    this.locations = [...data.locations];
    this.cuisines = [...data.cuisines];
    this.address = data.address;
    this.parking = data.parking;
    this.openingHours = data.openingHours;
    this.daysInAdvance = data.daysInAdvance;
    this.ambience = data.ambience;
    this.jsonld = data.jsonld;
    this.seo = data.seo;
    this.gbPrimepayPublicKey = data.gbPrimepayPublicKey;
    this.hasDeliveryPricingTier = data.hasDeliveryPricingTier;
    this.pictures = [];
    this.packages = [];
    this.packagesExpired = [];
  }

  addPicture(pictures) {
    if (pictures.length) {
      this.pictures = [...pictures];
    }
  }

  addPackages(packages) {
    if (packages.length) {
      this.packages = [...packages];
    }
  }

  addExpiredPackages(packages) {
    if (packages.length) {
      this.packagesExpired = packages;
    }
  }
}

class restaurant {
  constructor(data) {
    if (data.isCatalog) {
      return new catalogRestaurant(data);
    } else {
      return new detailRestaurant(data);
    }
  }
}

export default restaurant;
