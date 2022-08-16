import PackRuleType from "./PackRuleType";
import { MenuSectionClassInterface } from "./MenuSectionInterface";
import {
  PackDeliveryMethodDelivery,
  PackDeliveryMethodPickup,
  PackDeliveryMethodDeliveryAndPickup,
} from "./DeliveryMethodType";
import { PaymentCC, PaymentQR, PaymentCCAndQR } from "./PaymentType";
export interface PackInterface {
  readonly id: string;
  readonly menuLink: string;
  readonly slug: string;
  readonly rank: number;
  readonly rankInRestaurantScope: number;
  readonly isAlaCarte: true | false;
  readonly startDate: string;
  readonly endDate: string;
  readonly requireCc: true | false;
  readonly chargeType: string;
  readonly paymentType: PaymentCCAndQR | PaymentQR | PaymentCC | string;
  readonly paymentTypes: string[];
  readonly skipTimeSelection: true | false;
  readonly availableMethods:
    | PackDeliveryMethodDelivery
    | PackDeliveryMethodDeliveryAndPickup
    | PackDeliveryMethodPickup
    | string;
  readonly noOfCourses: number;
  readonly defaultStartTime: string;
  readonly maxPackageQuantity: number;
  readonly chargePolicy: string;
  readonly chargePolicyLink: string;
  readonly menuQuantityLimit: number;
  readonly originalPrice: {
    price: any;
    currency: string;
    format: string;
  };
  readonly isAddOn: true | false;
  readonly earnPoint: true | false;
  readonly customLabel: {
    readonly name: string;
    readonly iconUrl: string;
  };
  readonly customLabels: {
    readonly name: string;
    readonly iconUrl: string;
  }[];
  readonly menus: {
    type: string;
    data: Array<{ isLoaded: boolean; link: string }>;
  };
  menuSections: Array<MenuSectionClassInterface>;
  readonly forDineIn: true | false;
  readonly hasCustomDeliveryFee: true | false;
  readonly takeAwayProperty: object;
  readonly acceptedCards: Array<string>;
  readonly menuType: string;
  readonly name: string;
  readonly description: string;
  readonly lastBookingWasMade: string;
  readonly typeCode: string;
  readonly typeName: string;
  readonly ayceRules: PackRuleType | null;
  readonly bfpRules: PackRuleType | null;
  readonly ppRules: PackRuleType | null;
  readonly rules: Array<PackRuleType>;
  readonly packageInfo: {
    minPax: null | number;
    maxPax: null | number;
    timeLimit: string;
    tncLink: null | string;
    perPack: null | number;
    kidsPriceRate: null | number;
  };
  readonly imageCoverUrl: {
    thumb: string;
    large: string;
  };
  readonly restaurantCuisine: string;
  readonly restaurantLocation: string;
  readonly restaurantName: string;
  readonly openingHours: Array<[]>;
  readonly isAcceptManyQuantity: true | false;
  readonly pricingTypeSym: string;
  readonly pricingType: string;
  readonly timeSlots: object;
  readonly pricingMode: string;
  readonly isAcceptVoucher: true | false;
  readonly largestTable: number;
  readonly customSeats: Array<number>;
  readonly isPrebook: true | false;
  readonly hideMenuPrice: true | false;
  readonly isAllowMix: true | false;
  readonly acceptWeTravelTogether: boolean;
  readonly restaurantPackageVoucherDetail: string;
  readonly restaurantPackageVoucherTnc: string;
  readonly customNetPrice: string;
  readonly kidsPriceV2: { pricePolicy: string, priceValue: string}[];
  readonly useKidsPrice: boolean;
}
export interface PackClassInterface extends PackInterface {
  isBookable: true | false;
  determineIsPreBook(packagesStartDate: string): true | false;
  isUsingMenuSection(): true | false | void;
  isHaveSection(): true | false | void;
  isHaveMenu(): true | false | void;
  isQuantityValid(): true | false;
  getPackagePrice(
    adultPax?: number,
    kidsPax?: number
  ): { adult: number; kids: number };
  getSections(): Array<MenuSectionClassInterface>;
  getSectionsWithSelectedMenus(): Array<MenuSectionClassInterface>;
  isSectionHaveValidQuantity(): true | false | void;
  getSelectedPricingRule(adult?: number): PackRuleType;
  getLowestPricingRule(): PackRuleType;
  increasePackageQuantity(): void;
  decreasePackageQuantity(): void;
  maxSelectedMenuQuantity(): number;
  currentSelectedMenuQuantity(): number;
}
