// @ts-ignore
import dayjs from "@/lib/dayjs";
import { PackClassInterface, PackInterface } from "@/types/PackInterface";
import PackRuleType from "@/types/PackRuleType";
import { MenuSectionClassInterface } from "@/types/MenuSectionInterface";

abstract class pack implements PackClassInterface {
  isBookable: true | false;
  quantity: number;
  id: string;
  menuLink: string;
  menus: {
    type: string;
    data: Array<{ isLoaded: boolean; link: string }>;
  };
  slug: string;
  rank: number;
  rankInRestaurantScope: number;
  isAlaCarte: boolean;
  startDate: string;
  endDate: string;
  requireCc: boolean;
  chargeType: string;
  paymentType: string;
  paymentTypes: string[];
  skipTimeSelection: true | false;
  availableMethods: string;
  noOfCourses: number;
  defaultStartTime: string;
  maxPackageQuantity: number;
  chargePolicy: string;
  chargePolicyLink: string;
  menuQuantityLimit: number;
  originalPrice: {
    price: any;
    currency: string;
    format: string;
  };
  customNetPrice: string;
  isAddOn: boolean;
  earnPoint: boolean;
  customLabel: { name: string; iconUrl: string };
  customLabels: { name: string; iconUrl: string }[];
  menuSections: Array<MenuSectionClassInterface>;
  forDineIn: boolean;
  hasCustomDeliveryFee: boolean;
  takeAwayProperty: {};
  acceptedCards: Array<string>;
  menuType: string;
  name: string;
  description: string;
  lastBookingWasMade: string;
  typeCode: string;
  typeName: string;
  ayceRules: null | PackRuleType;
  bfpRules: null | PackRuleType;
  ppRules: null | PackRuleType;
  rules: Array<PackRuleType>;
  packageInfo: {
    minPax: null | number;
    maxPax: null | number;
    timeLimit: string;
    tncLink: null | string;
    perPack: null | number;
    kidsPriceRate: null | number;
  };
  imageCoverUrl: {
    thumb: string;
    large: string;
  };
  restaurantCuisine: string;
  restaurantLocation: string;
  restaurantName: string;
  openingHours: Array<[]>;
  isAcceptManyQuantity: boolean;
  pricingTypeSym: string;
  pricingType: string;
  timeSlots: {};
  pricingMode: string;
  isAcceptVoucher: boolean;
  largestTable: number;
  customSeats: Array<number>;
  isPrebook: boolean;
  hideMenuPrice: boolean;
  isAllowMix: boolean;
  acceptWeTravelTogether: boolean;
  restaurantPackageVoucherDetail: string;
  restaurantPackageVoucherTnc: string;
  kidsPriceV2: {pricePolicy: string, priceValue: string}[];
  useKidsPrice: boolean;
  constructor(data: PackInterface) {
    this.isBookable = true;
    this.quantity = 0;
    this.id = data.id;
    this.hideMenuPrice =
      typeof data.hideMenuPrice === "boolean" ? data.hideMenuPrice : false;
    this.menuLink = typeof data.menuLink === "string" ? data.menuLink : "";
    this.menus = {
      type: data.menus?.type,
      data: data.menus?.data,
    };
    this.slug = typeof data.slug === "string" ? data.slug : "";
    this.rank = typeof data.rank === "number" ? data.rank : 0;
    this.rankInRestaurantScope =
      typeof data.rankInRestaurantScope === "number"
        ? data.rankInRestaurantScope
        : 0;
    this.isAlaCarte = false;
    this.startDate = typeof data.startDate === "string" ? data.startDate : "";
    this.endDate = typeof data.endDate === "string" ? data.endDate : "";
    this.requireCc =
      typeof data.requireCc === "boolean" ? data.requireCc : false;
    this.chargeType =
      typeof data.chargeType === "string" ? data.chargeType : "";
    this.paymentType =
      typeof data.paymentType === "string" ? data.paymentType : "";
    this.paymentTypes = Array.isArray(data.paymentTypes)
      ? data.paymentTypes
      : [];
    this.skipTimeSelection =
      typeof data.skipTimeSelection === "boolean"
        ? data.skipTimeSelection
        : false;
    this.availableMethods =
      typeof data.availableMethods === "string" ? data.availableMethods : "";
    this.noOfCourses =
      typeof data.noOfCourses === "number" ? data.noOfCourses : 0;
    this.defaultStartTime =
      typeof data.defaultStartTime === "string" ? data.defaultStartTime : "";
    this.maxPackageQuantity =
      typeof data.maxPackageQuantity === "number"
        ? data.maxPackageQuantity
        : 1000000;
    this.chargePolicy =
      typeof data.chargePolicy === "string" ? data.chargePolicy : "";
    this.chargePolicyLink =
      typeof data.chargePolicyLink === "string" ? data.chargePolicyLink : "";
    this.menuQuantityLimit =
      typeof data.menuQuantityLimit === "number" ? data.menuQuantityLimit : 0;
    this.originalPrice = {
      price: data.originalPrice?.price || "",
      currency: data.originalPrice?.currency || "",
      format: data.originalPrice?.format || "",
    };
    this.customNetPrice =
      typeof data.customNetPrice === "string" ? data.customNetPrice : "";
    this.isAddOn = typeof data.isAddOn === "boolean" ? data.isAddOn : false;
    this.earnPoint =
      typeof data.earnPoint === "boolean" ? data.earnPoint : false;
    this.customLabel = {
      name: data.customLabel?.name || "",
      iconUrl: data.customLabel?.iconUrl || "",
    };
    this.customLabels = Array.isArray(data.customLabels)
      ? data.customLabels
      : [];
    this.menuSections = Array.isArray(data.menuSections)
      ? data.menuSections
      : [];
    this.forDineIn =
      typeof data.forDineIn === "boolean" ? data.forDineIn : false;
    this.hasCustomDeliveryFee =
      typeof data.hasCustomDeliveryFee === "boolean"
        ? data.hasCustomDeliveryFee
        : false;
    this.takeAwayProperty = {};
    this.acceptedCards = Array.isArray(data.acceptedCards)
      ? data.acceptedCards
      : [];
    this.menuType = typeof data.menuType === "string" ? data.menuType : "";
    this.name = typeof data.name === "string" ? data.name : "";
    this.description =
      typeof data.description === "string" ? data.description : "";
    this.lastBookingWasMade =
      typeof data.lastBookingWasMade === "string"
        ? data.lastBookingWasMade
        : "";
    this.typeCode = typeof data.typeCode === "string" ? data.typeCode : "";
    this.typeName = typeof data.typeName === "string" ? data.typeName : "";
    this.ayceRules = data.ayceRules;
    this.bfpRules = data.bfpRules;
    this.ppRules = data.ppRules;
    this.rules = Array.isArray(data.rules) ? data.rules : [];
    this.packageInfo = {
      minPax: data.packageInfo?.minPax,
      maxPax: data.packageInfo?.maxPax,
      timeLimit: data.packageInfo?.timeLimit,
      tncLink: data.packageInfo?.tncLink,
      perPack: data.packageInfo?.perPack,
      kidsPriceRate: data.packageInfo?.kidsPriceRate,
    };
    this.imageCoverUrl = {
      thumb: data.imageCoverUrl?.thumb,
      large: data.imageCoverUrl?.large,
    };
    this.restaurantCuisine =
      typeof data.restaurantCuisine === "string" ? data.restaurantCuisine : "";
    this.restaurantLocation =
      typeof data.restaurantLocation === "string"
        ? data.restaurantLocation
        : "";
    this.restaurantName =
      typeof data.restaurantName === "string" ? data.restaurantName : "";
    this.openingHours = Array.isArray(data.openingHours)
      ? data.openingHours
      : [];
    this.isAcceptManyQuantity =
      typeof data.isAcceptManyQuantity === "boolean"
        ? data.isAcceptManyQuantity
        : false;
    this.pricingTypeSym =
      typeof data.pricingTypeSym === "string" ? data.pricingTypeSym : "";
    this.pricingType =
      typeof data.pricingType === "string" ? data.pricingType : "";
    this.timeSlots = data.timeSlots;
    this.pricingMode =
      typeof data.pricingMode === "string" ? data.pricingMode : "";
    this.isAcceptVoucher =
      typeof data.isAcceptVoucher === "boolean" ? data.isAcceptVoucher : false;
    this.largestTable =
      typeof data.largestTable === "number" ? data.largestTable : 0;
    this.customSeats = Array.isArray(data.customSeats) ? data.customSeats : [];
    this.isPrebook = this.determineIsPreBook(this.startDate);
    this.isAllowMix =
      typeof data.isAllowMix === "boolean" ? data.isAllowMix : true;
    this.acceptWeTravelTogether =
      typeof data.acceptWeTravelTogether === "boolean"
        ? data.acceptWeTravelTogether
        : false;
    this.restaurantPackageVoucherDetail =
      typeof data.restaurantPackageVoucherDetail === "string"
        ? data.restaurantPackageVoucherDetail
        : "";
    this.restaurantPackageVoucherTnc =
      typeof data.restaurantPackageVoucherTnc === "string"
        ? data.restaurantPackageVoucherTnc
        : "";
    this.kidsPriceV2 = Array.isArray(data.kidsPriceV2) ? data.kidsPriceV2 : [];
    this.useKidsPrice =
      typeof data.acceptWeTravelTogether === "boolean"
        ? data.useKidsPrice
        : false;
  }

  determineIsPreBook(packagesStartDate: string) {
    if (!packagesStartDate) {
      throw new Error(
        "failed determineIsPreBook, packages startDate is null or wrong formated"
      );
    }
    const startDate = dayjs(packagesStartDate, "YYYY-MM-DD");
    if (startDate.isValid()) {
      return startDate.isAfter(dayjs()) ? true : false;
    }
    throw new Error(
      "failed determineIsPreBook, packages startDate is null or wrong formated"
    );
  }

  isUsingMenuSection(): true | false {
    return this.menuType.includes("hh_menu");
  }

  abstract isHaveSection(): true | false;

  abstract isHaveMenu(): true | false;

  abstract isQuantityValid(): true | false;

  abstract getPackagePrice(): { adult: number; kids: number };

  // section
  abstract getSections(): Array<MenuSectionClassInterface>;

  abstract getSectionsWithSelectedMenus(): Array<MenuSectionClassInterface>;

  abstract isSectionHaveValidQuantity(): true | false;

  abstract getSelectedPricingRule(adult?: number): PackRuleType;

  getLowestPricingRule() {
    if (this.rules.length > 1) {
      const sorted = this.rules.sort((a, b) => {
        if (typeof a.minSeat == "number" && typeof b.minSeat == "number") {
          return a.minSeat > b.minSeat ? 1 : -1;
        }
        return 1;
      });
      return sorted[0];
    }
    return this.rules[0];
  }

  abstract increasePackageQuantity(): void;

  abstract decreasePackageQuantity(): void;

  abstract maxSelectedMenuQuantity(): number;

  abstract currentSelectedMenuQuantity(): number;
}

export default pack;
