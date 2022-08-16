import { methods as pointHistoryMethods } from "@/composable/pointHistory";
import useVoucherList from "@/composable/getVoucherList";

import {
  state as redeemState,
  methods as redeemMethods,
} from "@/composable/redeemVoucher";
import {
  state as profilePointState,
  methods as profilePointMethods,
} from "../Point/profilePoint";
import { mapState } from "vuex";
import useLazyImport from "@/composable/useLazyImport";

export default {
  components: {
    VoucherCard: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "ProfileMobileChunk" */ "@/components/Shared/VoucherCard.vue"
        )
      ),
    ProfileModalConfirmRedeem: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "ProfileMobileChunk" */ "@/components/Page Component/Profile/Modal/ProfileModalConfirmRedeem.vue"
        )
      ),
  },
  setup() {
    const { state: voucherListState, methods: voucherListMethods } =
      useVoucherList();
    const { getPointHistoryList } = pointHistoryMethods;
    const { isError: redeemisError, message: redeemMessage } = redeemState;
    const { voucherToRedeem } = profilePointState;
    const { toggleRedeemVoucher, redeemVoucherWithPoint } = profilePointMethods;
    const {
      pageNumber: voucherListPageNumber,
      pageSize: voucherListPageSize,
      anyNextPage: voucherListAnyNextPage,
      isLoading: voucherListIsLoading,
      isInitialLoading: voucherListIsInitialLoading,
      voucherList,
    } = voucherListState;
    const dummyVoucherList = [];
    return {
      redeemisError,
      redeemMessage,
      voucherToRedeem,
      toggleRedeemVoucher,
      redeemVoucherWithPoint,
      // voucher list state
      dummyVoucherList,
      voucherList,
      voucherListPageNumber,
      voucherListPageSize,
      voucherListIsInitialLoading,
      voucherListIsLoading,
      voucherListAnyNextPage,
      getPointHistoryList,
      ...voucherListMethods,
      ...redeemMethods,
    };
  },
  data() {
    return {
      showConfirmRedeemModal: false,
    };
  },
  computed: {
    ...mapState("user", ["points"]),
    showedVoucherList() {
      return this.voucherListIsInitialLoading
        ? this.dummyVoucherList
        : this.voucherList;
    },
  },
  mounted() {
    this.initDummyVoucher();
    this.getPointHistoryList();
    this.toggleRedeemVoucher();
    this.initGetVoucherList();
  },
  beforeDestroy() {
    this.voucherList = [];
    this.voucherListPageNumber = 1;
  },
  methods: {
    willRedeem(point) {
      this.redeemVoucherWithPoint(point);
      this.showConfirmRedeemModal = true;
    },
    loadMoreGetVoucher() {
      this.voucherListPageNumber += 1;
      this.getVoucherList("active", true);
    },
    initGetVoucherList() {
      this.voucherListPageSize = 5;
      this.getVoucherList("active", false);
    },
    voucherRedeemedCallback() {
      this.showConfirmRedeemModal = false;
      this.$store.dispatch("user/getProfile");
      this.voucherListPageNumber = 1;
      this.voucherList = [];
      this.getVoucherList("active", false);
    },
    async getVoucher(redeemObject) {
      redeemObject.isLoading = true;
      await this.redeemVoucher(redeemObject.point, this.points);
      if (this.redeemisError) {
        this.$alert.error(this.redeemMessage);
      } else {
        this.$alert.success(this.redeemMessage);
        this.$emit("on-voucher-redeemed");
      }
      redeemObject.isLoading = false;
    },
    initDummyVoucher() {
      const count = 5;
      for (let index = 0; index < count; index++) {
        const voucherObj = {
          name: "",
          amount: "",
          expiryDate: "",
          voucherCode: "",
          voucherCategory: "",
        };
        voucherObj.voucherCode = index.toString();
        this.dummyVoucherList.push(voucherObj);
      }
    },
  },
};
