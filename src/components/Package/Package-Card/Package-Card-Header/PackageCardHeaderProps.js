export default {
  id: {
    type: String,
    required: true,
  },
  name: {
    default: "",
    type: String,
  },
  adult: {
    default: 0,
    type: Number,
  },
  description: {
    default: "",
    type: String,
  },
  price: {
    required: true,
  },
  customPrice: {
    type: String,
    default: "",
  },
  pricingType: {
    required: true,
    type: String,
  },
  pricingList: {
    type: Array,
    required: true,
  },
  originalPrice: {
    type: Object,
    default() {
      return {};
    },
  },
  customLabels: {
    type: Array,
    default() {
      return [];
    },
  },
  date: {
    default: "",
    type: String,
  },
  typeCode: {
    type: String,
    required: true,
  },
  tnc: {
    type: String,
    default() {
      return "";
    },
  },
  showVersion: {
    type: String,
    default: "",
  },
  isAddon: {
    type: Boolean,
    default: false,
  },
  acceptWeTravelTogether: {
    type: Boolean,
    default: false,
  },
  isSelectedPackage: {
    type: Boolean,
    default: false,
  },
  showViewMenuButton: {
    type: Boolean,
    required: true,
  },
  packagePerPackRule: {
    required: true,
  },
  packageCourseRule: {
    required: true,
  },
  viewMenu: {
    type: Boolean,
    default: false,
  },
  packageQuantity: {
    type: Number,
    default: 0,
  },
  isAcceptManyQuantity: {
    type: Boolean,
    required: true,
  },
  isAcceptVoucher: {
    type: Boolean,
    default: false,
  },
  isPackageBodyShow: {
    type: Boolean,
    required: true,
  },
  isButtonShow: {
    type: Boolean,
    default: true,
  },
  bookButtonText: {
    type: Object,
    default: null,
  },
  isPrebook: {
    type: Boolean,
    default: false,
  },
  freeDeliveryRadius: {
    type: Number,
    default: 0,
  },
  allowShowPrice: {
    type: Boolean,
    default: true,
  },
  preferShowVoucherIcon: {
    type: Boolean,
    default: false,
  },
};
