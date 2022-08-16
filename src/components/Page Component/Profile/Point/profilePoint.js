import { ref, computed, watch } from "@vue/composition-api";
import store from "@/store/index";
let pointUseForRedeem = ref(0);
const userPoint = computed(() => {
  return store.state.user.points;
});

const voucherToRedeem = ref([
  {
    id: "voucher-1",
    point: 200,
    canApply: true,
  },
  {
    id: "voucher-2",
    point: 500,
    canApply: true,
  },
  {
    id: "voucher-3",
    point: 1000,
    canApply: true,
  },
]);

function toggleRedeemVoucher() {
  voucherToRedeem.value.forEach((voucher) => {
    if (voucher.point > userPoint.value) {
      voucher.canApply = false;
      return;
    }
    voucher.canApply = true;
  });
}

function redeemVoucherWithPoint(point) {
  pointUseForRedeem.value = point;
}

watch(
  () => userPoint.value,
  () => {
    toggleRedeemVoucher();
  }
);

const state = {
  voucherToRedeem,
  pointUseForRedeem,
  userPoint,
};

const methods = {
  toggleRedeemVoucher,
  redeemVoucherWithPoint,
};

export { state, methods };
