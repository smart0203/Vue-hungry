import { ref, reactive, computed } from "@vue/composition-api";
import $money from "@/lib/money";
import { RestaurantVoucher, CustomVoucher } from "@/types/RestaurantVoucher";
import rollbar from "@/lib/rollbar";

const detailVoucherModal = reactive({
  isShow: false,
  data: {
    name: "",
    price: "",
    desc: "",
    tnc: "",
    termCondition: "",
  },
});
function toggleDetailModal(voucher: RestaurantVoucher | CustomVoucher) {
  if (!voucher) {
    rollbar.error("No voucher supplied", { voucher });
    return;
  }
  detailVoucherModal.data.name = voucher.name;
  detailVoucherModal.data.price = voucher.amount ? $money(voucher.amount) : "";
  detailVoucherModal.data.desc = voucher.desc;
  detailVoucherModal.data.tnc = voucher.tnc;
  detailVoucherModal.isShow = !detailVoucherModal.isShow;
}
// --- remove voucher modal ---
const isShowRemoveVoucherModal = ref(false);
const toggleRemoveVoucherModal = function () {
  isShowRemoveVoucherModal.value = !isShowRemoveVoucherModal.value;
};
let onCloseRemoveVoucherModal = ref<() => any>(function () {
  // override this function based on need
  throw new Error("on close method is not implemented");
});
let onConfirmRemoveVoucherModal = ref<() => any>(function () {
  // override this function based on need
  throw new Error("on confirm method is not implemented");
});

export {
  onCloseRemoveVoucherModal,
  onConfirmRemoveVoucherModal,
  toggleDetailModal,
  toggleRemoveVoucherModal,
  isShowRemoveVoucherModal,
  detailVoucherModal,
};
