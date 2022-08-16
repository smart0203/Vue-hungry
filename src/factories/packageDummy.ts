import { nanoid } from "nanoid";
import DineInPack from "@/models/dineInPack";
import HahPack from "@/models/hahPack";
import AlaCartePack from "@/models/alaCartePack";
import { PAYMENT_CREDIT_CARD } from "@/lib/constant";

function packageDummy(type: "dine_in" | "hah" | "ala_carte") {
  const pack = {
    id: nanoid(3),
    menuLink: "",
    slug: "",
    rank: 0,
    rankInRestaurantScope: 0,
    isAlaCarte: false,
    startDate: "",
    endDate: "",
    requireCc: false,
    chargeType: "",
    paymentType: "",
    paymentTypes: [PAYMENT_CREDIT_CARD],
    skipTimeSelection: false,
    availableMethods: "",
    noOfCourses: 2,
    defaultStartTime: "",
    maxPackageQuantity: 1,
    chargePolicy: "",
    chargePolicyLink: "",
    menuQuantityLimit: 0,
    originalPrice: {
      price: 500,
      currency: "",
      format: "",
    },
    isAddOn: false,
    earnPoint: false,
    customLabel: {
      name: "",
      iconUrl: "",
    },
    menus: {
      type: "",
      data: [{ isLoaded: false, link: "" }],
    },
    menuSections: [],
    forDineIn: true,
    hasCustomDeliveryFee: false,
    takeAwayProperty: {},
    acceptedCards: [""],
    menuType: "",
    name: "",
    description: "",
    lastBookingWasMade: "",
    typeCode: "",
    typeName: "",
    ayceRules: null,
    bfpRules: null,
    ppRules: null,
    rules: [],
    packageInfo: {
      minPax: null,
      maxPax: null,
      timeLimit: "",
      tncLink: null,
      perPack: null,
      kidsPriceRate: null,
    },
    imageCoverUrl: {
      thumb: "",
      large: "",
    },
    restaurantCuisine: "",
    restaurantLocation: "",
    restaurantName: "",
    openingHours: [],
    isAcceptManyQuantity: false,
    pricingTypeSym: "",
    pricingType: "",
    timeSlots: {},
    pricingMode: "",
    isAcceptVoucher: false,
    largestTable: 10,
    customSeats: [1, 2],
    isPrebook: false,
    hideMenuPrice: false,
    isAllowMix: false,
    customLabels: [],
    acceptWeTravelTogether: false,
    restaurantPackageVoucherDetail: "",
    restaurantPackageVoucherTnc: "",
    customNetPrice: "",
    kidsPriceV2: [],
    useKidsPrice: false,
  };
  if (type === "dine_in") {
    return new DineInPack(pack);
  }
  if (type === "ala_carte") {
    return new AlaCartePack(pack);
  }
  if (type === "hah") {
    return new HahPack(pack);
  }
}

export default packageDummy;
