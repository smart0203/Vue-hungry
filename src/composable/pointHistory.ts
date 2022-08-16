import { ref, computed } from "@vue/composition-api";
import { getPointHistory } from "@/services/point";

import store from "@/store/index";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const accessToken = computed(() => store.state.user.accessToken);

type PointHistory = {
  createdAt: string;
  expiryDate: string;
  title: "Points Earned" | "Spend Points";
  description: string;
  point: number;
  id: string;
  type: "points";
};

const isError = ref(false);
const isLoading = ref(false);
const isInitialLoading = ref(false);
const pointHistory = ref<PointHistory[]>([]);
const totalPoint = ref(0);
const anyNextPage = ref(false);

function toggleIsLoading(loading = false, loadMore = false) {
  if (loadMore) {
    isLoading.value = loading;
    return;
  }
  isInitialLoading.value = loading;
}

async function getPointHistoryList(
  paramPageNumber = 1,
  paramPageSize = 10,
  isLoadMore = false
) {
  toggleIsLoading(true, isLoadMore);
  const { isSuccess, meta, data } = await getPointHistory(
    accessToken.value,
    paramPageNumber,
    paramPageSize
  );

  if (isSuccess) {
    isError.value = false;
    if (Array.isArray(data) && data.length) {
      data.forEach((point) => {
        const isExist = pointHistory.value.filter(
          (currentPointHistory) => currentPointHistory.id === point.id
        );
        if (isExist.length === 0) {
          pointHistory.value.push(point);
        }
      });
    }
    if (meta) {
      totalPoint.value = meta.totalPoints || 0;
      anyNextPage.value = meta.links?.next?.length > 0 || false;
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
  pointHistory,
  anyNextPage,
  totalPoint,
};

const methods = {
  getPointHistoryList,
};
export { state, methods };
