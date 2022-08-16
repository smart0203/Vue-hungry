import { ref, computed } from "@vue/composition-api";
import { getVouchers } from "@/services/voucher";
import { Voucher } from "@/types/Voucher";

import store from "@/store/index";

export default function useVoucherList() {
  // @ts-ignore
  const accessToken = computed(() => store.state.user.accessToken);
  let pageNumber = ref(1);
  let pageSize = ref(10);
  let isError = ref(false);
  let isInitialLoading = ref(true);
  let isLoading = ref(false);
  let voucherList = ref<Voucher[]>([]);
  let totalVoucher = ref(0);
  let anyNextPage = ref(false);

  function toggleIsLoading(loading = false, loadMore = false) {
    if (loadMore) {
      isLoading.value = loading;
      return;
    }
    isInitialLoading.value = loading;
  }

  async function getVoucherList(sectionType = "active", isLoadMore = false) {
    toggleIsLoading(true, isLoadMore);
    const result = await getVouchers(
      accessToken.value,
      sectionType,
      pageNumber.value,
      pageSize.value
    );

    if (result.isSuccess) {
      isError.value = false;
      if (isLoadMore) {
        result.data.forEach((voucher) => {
          voucherList.value.push(voucher);
        });
      } else {
        voucherList.value = result.data;
      }
      if (result.meta) {
        totalVoucher.value = result.meta.total || 0;
        anyNextPage.value =
          typeof result.meta.links?.next === "string"
            ? result.meta.links?.next.length > 0
            : false;
      }
      toggleIsLoading(false, isLoadMore);
      return;
    }
    isError.value = true;
  }

  const state = {
    isInitialLoading,
    isLoading,
    isError,
    voucherList,
    anyNextPage,
    totalVoucher,
    pageSize,
    pageNumber,
  };

  const methods = {
    getVoucherList,
  };

  return {
    state,
    methods,
  };
}
