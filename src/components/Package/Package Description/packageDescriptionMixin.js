export default {
  props: {
    openingHours: {
      type: Array,
      required: true,
    },
    timeLimit: {
      type: String,
      required: true,
    },
    minPax: {
      type: String,
      required: true,
    },
    maxPax: {
      type: String,
      required: true,
    },
    maxPaxPerPack: {
      type: String,
      required: true,
    },
    tnc: {
      type: String,
      required: true,
    },
    showCollect: {
      type: Boolean,
      default: false,
    },
    showRedeem: {
      type: Boolean,
      default: false,
    },
    showCustomDelivery: {
      type: Boolean,
      default: false,
    },
    showBookableDate: {
      type: Boolean,
      default: true,
    },
    showPaxRule: {
      type: Boolean,
      default: true,
    },
    pricingList: {
      type: Array,
      required: true,
    },
    pricingType: {
      type: String,
      required: true,
    },
    adult: {
      type: Number,
      default: 0,
    },
    kidsPriceV2: {
      type: Array,
      required: true,
    },
    useKidsPrice: {
      type: Boolean,
      default: false,
    },
  },
  i18n: {
    messages: {
      en: {
        bookDayAndTime: "Bookable day and time",
        packagaeDetail: "Package Details",
        kidsPrice: "Kids Price",
        timeLimit: "Time Limit",
        min: "Min PAX",
        max: "Max PAX",
        maxPerPack: "Max PAX Per Pack",
      },
      th: {
        bookDayAndTime: "รอบเวลาที่เปิดจอง",
        packagaeDetail: "รายละเอียดแพ็กเกจ",
        kidsPrice: "ราคาเด็ก",
        timeLimit: "จำกัดเวลา",
        min: "จำนวนคนขั้นต่ำ",
        max: "จำนวนคนสูงสุด",
        maxPerPack: "จำนวนคนสูงสุดต่อแพ็ก",
      },
    },
  },
};
