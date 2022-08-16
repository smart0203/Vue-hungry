<template>
  <div class="mx-4 lg:mx-0">
    <div v-if="isMobile" class="relative mt-6 mb-8">
      <img
        :src="mobileNavIcon"
        width="14"
        height="14"
        loading="lazy"
        alt="navigation icon"
        class="absolute left-0 text-black"
        style="top: 4px"
        @click="onMobileNavClicked"
      />
      <p
        class="font-black text-center capitalize"
        :style="
          isEnterSelectAllMode ? 'text-align: left;margin-left: 30px' : null
        "
      >
        {{ `${$t("myVoucher")} ${selectedVoucherLabel || ""}` }}
      </p>
      <button
        v-if="!isInitialLoading && showedVouchers.length"
        class="absolute top-0 right-0 font-bold capitalize text-red-dark"
        @click="mobileSelectAllHandler"
      >
        {{ selectVoucherLabel }}
      </button>
    </div>
    <div
      class="flex flex-col justify-between lg:pt-6 profile-content-min-height"
    >
      <div class="min-h-screen lg:min-h-full">
        <!-- title bar for desktop -->
        <div v-if="isDesktop" class="flex">
          <div class="flex-auto capitalize lg:text-base">
            {{ $t("myVoucher") }}
            <span v-if="selectedVoucherLabel">{{ selectedVoucherLabel }}</span>
          </div>
          <button
            v-if="!isInitialLoading && showedVouchers.length"
            class="font-bold capitalize text-red-dark lg:text-base"
            @click="
              isAllVouchersSelected ? removeAllVoucher() : selectAllVoucher()
            "
          >
            {{ selectVoucherLabel }}
          </button>
        </div>
        <div class="flex flex-wrap mt-4">
          <template v-if="showedVouchers.length">
            <div
              v-for="(voucher, index) in showedVouchers"
              :key="`Voucher-${voucher.id}-${index}-${voucher.amount}`"
              class="w-full lg:w-1/3"
            >
              <VoucherCard
                :name="voucher.name"
                :valid-until="voucher.expiryDate"
                :remaining-amount="voucher.deductibleBalance"
                :price="voucher.amountV2.amount || voucher.amount"
                :code="voucher.voucherCode"
                :is-loading="voucher.isLoading"
                :is-show-copy-button="voucher.isShowCopyButton"
                :is-show-share-button="voucher.isShowShareButton"
                :is-show-check-box="voucher.isShowCheckBox"
                :is-reverse-checkbox="isMobile"
                class="mb-4 lg:mr-6 lg:mb-4"
                :is-selected="voucher.isSelected"
                @on-shared="shareVoucher(voucher)"
                @on-copied="onCopyButtonClicked(voucher.id)"
                @on-selected-change="
                  (isSelected) => (voucher.isSelected = isSelected)
                "
              >
              </VoucherCard>
            </div>
          </template>

          <div v-else class="w-full mt-6">
            <img
              src="@/assets/icon-voucher-white.png"
              alt="no voucher"
              loading="lazy"
              class="mx-auto mb-4"
            />
            <div class="text-center text-gray-600">
              {{ $t("youDontHaveVoucher") }}
            </div>
          </div>
        </div>

        <button
          v-if="anyNextPage && showedVouchers.length"
          :disabled="isLoading"
          class="flex items-center px-2 py-1 mx-auto my-4 text-xs capitalize border rounded-full text-red-dark border-red-dark disabled:opacity-50"
          @click="loadMoreVoucher"
        >
          <div v-if="isLoading" class="mr-1 loader small"></div>
          {{ isLoading ? $t("pleaseWait") : $t("showMore") }}
        </button>
      </div>

      <div
        v-if="
          !isInitialLoading &&
          ((isDesktop && selectedVouchers.length) ||
            (isMobile && isEnterSelectAllMode))
        "
        class="sticky bottom-0 w-full py-2 bg-white lg:border-t-2"
      >
        <div
          class="flex items-center justify-center mb-2 lg:w-8/12 lg:mx-auto lg:mb-0"
        >
          <button
            class="w-full mr-4 action-button"
            @click="onShareButtonClicked(null)"
          >
            {{ $t("share") }}
          </button>
          <button
            v-if="isSupportCopyClipboard"
            class="w-full action-button"
            @click="onCopyButtonClicked(null)"
          >
            {{ $t("copy") }}
          </button>
        </div>
      </div>

      <ClipboardCopyModal
        :is-show="isShowModal"
        :text="textModal"
        @on-closed="isShowModal = false"
      />
      <ShareSosmedModal
        :is-show="socialMediaModal.isShow"
        :share-url="socialMediaModal.shareUrl"
        @on-closed="
          () => {
            socialMediaModal.isShow = false;
          }
        "
      >
        <p class="text-center">Share on social media</p>
      </ShareSosmedModal>
    </div>
  </div>
</template>

<script>
import useVoucherList from "@/composable/getVoucherList";
import { onMounted, computed, ref, reactive } from "@vue/composition-api";
import { useClipboard } from "@vueuse/core";
import useShareVoucher from "@/composable/useShareVoucher";
import useNavigatorShare, {
  isSupport as isSupportNavigatorShare,
} from "@/composable/useNavigatorShare";
import { isDesktop } from "@/helper/screenSizeHelper";
import { ROUTE_PROFILE_HOME } from "@/lib/constant";
import iconArrowLeft from "@/assets/icon-arrow-left-red.png";
import iconClose from "@/assets/icon-close-red.png";
import useLazyImport from "@/composable/useLazyImport";
let vueRootInstance = null;

export default {
  name: "ProfileVoucher",
  components: {
    VoucherCard: () =>
      useLazyImport(() =>
        import("@/components/Shared/voucher_flow/VoucherCard.vue")
      ),
    ClipboardCopyModal: () =>
      useLazyImport(() => import("@/components/Common/ClipboardCopyModal.vue")),
    ShareSosmedModal: () =>
      useLazyImport(() => import("@/components/Common/ShareSosmedModal.vue")),
  },
  setup() {
    const { state: voucherListState, methods: voucherListMethods } =
      useVoucherList();
    const {
      voucherList,
      isInitialLoading,
      isError,
      anyNextPage,
      isLoading,
      pageNumber,
    } = voucherListState;
    const { getVoucherList } = voucherListMethods;
    const { copy, isSupported: isSupportCopyClipboard } = useClipboard();
    const { shareTitle, shareVoucher, getShareUrl } = useShareVoucher();

    const dummyVoucher = [];
    const isShowModal = ref(false);
    const socialMediaModal = reactive({
      isShow: ref(false),
      shareUrl: ref(""),
    });
    const textModal = ref("");
    const isEnterSelectAllMode = ref(false);
    const remapVouchersList = ref([]);

    const mobileNavIcon = computed(() => {
      return isEnterSelectAllMode.value ? iconClose : iconArrowLeft;
    });

    const showedVouchers = computed(() => {
      return isInitialLoading.value ? dummyVoucher : remapVouchersList.value;
    });

    const selectedVouchers = computed(() => {
      return showedVouchers.value.filter((voucher) => voucher.isSelected);
    });

    const isAllVouchersSelected = computed(() => {
      return remapVouchersList.value.length === selectedVouchers.value.length;
    });

    const selectedVoucherLabel = computed(() => {
      if (selectedVouchers.value.length && remapVouchersList.value.length) {
        return `(${selectedVouchers.value.length}/${remapVouchersList.value.length})`;
      }
      return null;
    });

    const selectVoucherLabel = computed(() => {
      if (selectedVouchers.value.length === remapVouchersList.value.length) {
        return vueRootInstance.$t("unSelectAll");
      }
      if (isDesktop || isEnterSelectAllMode.value) {
        return vueRootInstance.$t("selectAll");
      }
      return vueRootInstance.$t("select");
    });

    const isShowVoucherCheckbox = computed(() => {
      if (isDesktop) {
        return true;
      } else {
        return isEnterSelectAllMode.value ? true : false;
      }
    });

    const isShowCopyShareButton = computed(() => {
      if (isDesktop) {
        return false;
      } else {
        return isEnterSelectAllMode.value ? false : true;
      }
    });

    function generateDummyVoucher() {
      for (let index = 0; index < 3; index++) {
        dummyVoucher.push({
          id: index,
          name: "",
          expiryDate: "",
          amount: 0,
          amountV2: {},
          voucherCode: "",
          isLoading: true,
          isShowCheckBox: false,
          isShowCopyButton: false,
          isShowShareButton: false,
        });
      }
    }

    function doRemapVoucher() {
      remapVouchersList.value = [];
      voucherList.value.forEach((voucher) => {
        remapVouchersList.value.push(
          reactive({
            ...voucher,
            isSelected: ref(false),
            isShowCheckBox: isShowVoucherCheckbox,
            isShowShareButton: isShowCopyShareButton,
            isShowCopyButton: isShowCopyShareButton,
          })
        );
      });
    }

    function selectAllVoucher() {
      remapVouchersList.value.forEach((voucher) => {
        voucher.isSelected = true;
      });
    }

    function removeAllVoucher() {
      remapVouchersList.value.forEach((voucher) => {
        voucher.isSelected = false;
      });
    }

    function onShareButtonClicked(voucher) {
      if (voucher) {
        shareVoucher(voucher);
        return;
      }
      const vouchersCode = selectedVouchers.value.map(
        (voucher) => voucher.voucherCode
      );
      const vouchersCodeString = vouchersCode.toString();
      if (vueRootInstance.isDesktop) {
        if (selectedVouchers.value.length > 1) {
          copy(vouchersCodeString);

          textModal.value = vueRootInstance.$t("copiedVouchers", {
            count: vouchersCode.length,
          });
          isShowModal.value = true;
          setTimeout(() => {
            isShowModal.value = false;
          }, 1500);
          return;
        }

        const selectSingleVoucher = selectedVouchers.value.length
          ? selectedVouchers.value[0]
          : false;
        if (selectSingleVoucher) {
          socialMediaModal.isShow = true;
          socialMediaModal.shareUrl = getShareUrl(selectSingleVoucher);
        }
        return;
      }
      if (isSupportNavigatorShare) {
        useNavigatorShare({
          title: shareTitle,
          message: vouchersCodeString,
        });
        return;
      }
      if (isSupportCopyClipboard) {
        copy(vouchersCodeString);
      }
    }

    function onCopyButtonClicked(voucherId) {
      if (isSupportCopyClipboard) {
        const filteredVouchers = voucherId
          ? remapVouchersList.value.filter(
              (voucher) => voucher.id === voucherId
            )
          : selectedVouchers.value;
        const vouchersCode = filteredVouchers.map(
          (voucher) => voucher.voucherCode
        );
        const vouchersCodeString = vouchersCode.toString();
        copy(vouchersCodeString);

        textModal.value = vueRootInstance.$t("copiedVouchers", {
          count: filteredVouchers.length,
        });
        isShowModal.value = true;
        setTimeout(() => {
          isShowModal.value = false;
        }, 1500);
        return;
      }
    }

    function onMobileNavClicked() {
      if (isEnterSelectAllMode.value) {
        isEnterSelectAllMode.value = !isEnterSelectAllMode.value;
        remapVouchersList.value.forEach(
          (voucher) => (voucher.isSelected = false)
        );
        return;
      }
      vueRootInstance.$router.push({ name: ROUTE_PROFILE_HOME });
    }

    function mobileSelectAllHandler() {
      if (isEnterSelectAllMode.value) {
        if (selectedVouchers.value.length === remapVouchersList.value.length) {
          removeAllVoucher();
          return;
        }
        selectAllVoucher();
      } else {
        isEnterSelectAllMode.value = true;
      }
    }

    async function loadMoreVoucher() {
      pageNumber.value += 1;
      await getVoucherList("active", true);
      if (isError.value === false) {
        doRemapVoucher();
      }
    }

    generateDummyVoucher();

    onMounted(async () => {
      await getVoucherList("active", false);
      if (isError.value === false) {
        doRemapVoucher();
      }
    });

    return {
      isLoading,
      anyNextPage,
      isShowModal,
      socialMediaModal,
      isError,
      isSupportNavigatorShare,
      isSupportCopyClipboard,
      isEnterSelectAllMode,
      getVoucherList,
      isAllVouchersSelected,
      dummyVoucher,
      showedVouchers,
      selectedVouchers,
      remapVouchersList,
      isInitialLoading,
      selectedVoucherLabel,
      selectVoucherLabel,
      selectAllVoucher,
      removeAllVoucher,
      onCopyButtonClicked,
      onShareButtonClicked,
      textModal,
      mobileNavIcon,
      onMobileNavClicked,
      mobileSelectAllHandler,
      loadMoreVoucher,
      shareTitle,
      shareVoucher,
    };
  },
  created() {
    vueRootInstance = this;
  },
  i18n: {
    messages: {
      en: {
        selectAll: "Select All",
        unSelectAll: "Unselect All",
      },
      th: {
        selectAll: "เลือกทั้งหมด",
        unSelectAll: "ยกเลิกทั้งหมด",
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.action-button {
  @apply bg-red-dark text-white rounded-full text-base py-2 shadow-lg capitalize;
}
</style>
