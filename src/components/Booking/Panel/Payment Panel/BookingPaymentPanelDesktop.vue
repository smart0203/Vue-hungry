<template>
  <div>
    <BookingLastStep force-mobile-version />
  </div>
</template>

<script>
import paymentPanelMixin from "./paymentPanelMixin";
export default {
  mixins: [paymentPanelMixin],
};
</script>
<style scoped>
.selected-packages-shadow {
  box-shadow: -1px 2px 25px rgba(0, 0, 0, 0.16);
}
</style>
<i18n>
{
  "en": {
    "chargeSummary": "Charged Summary",
    "totalChargeAmount": "Total Charge Amount",
    "useVoucher": "Use Voucher",
    "deliveryFee": "Delivery Fee"
  },
  "th": {
    "chargeSummary": "สรุุปยอดเงิน",
    "totalChargeAmount": "ราคาสุทธิ",
    "useVoucher": "ใช้คูปอง",
    "deliveryFee": "ค่าจัดส่ง"
  }
}
</i18n>
