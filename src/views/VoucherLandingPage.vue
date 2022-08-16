<template>
  <div class="min-h-screen landing-page lg:min-h-full">
    <div v-if="isLoading" class="w-full px-5 mx-auto lg:h-auto lg:w-9/12">
      <div
        class="flex items-center justify-center mt-24 loading-wrapper lg:mt-0"
      >
        <div id="landing-loader" class="loader"></div>
        <div class="ml-4 text-xl font-bold capitalize">
          {{ $t("pleaseWait") }}
        </div>
      </div>
    </div>

    <div v-else class="flex flex-wrap wrapper">
      <div
        class="w-full"
        :class="true ? 'mr-auto lg:w-7/12' : 'mx-auto lg:w-7/12'"
      >
        <div class="">
          <LandingHeader
            :title="landingTitle"
            :sub-title="landingSubTitle"
            :desc="landingDesc"
          />
          <div class="flex flex-col mx-auto lg:w-11/12 lg:flex-row lg:mt-4">
            <HhImage
              v-if="isDesktop"
              :img="''"
              :fallback="DEFAULT_AVATAR"
              alt="user avatar"
              class="mx-auto mt-4 mb-3 rounded-full lg:mt-0 lg:mb-0 user-avatar lg:mr-10"
            />
            <div class="w-full px-4 lg:px-0">
              <table
                class="w-full text-sm table-fixed lg:text-base lg:table-auto"
              >
                <tr>
                  <td style="width: 25px">
                    <img
                      src="@/assets/icon-user-red.png"
                      style="width: 25px"
                      alt=""
                       loading="lazy"
                    />
                  </td>
                  <td class="w-4/12 p-2 capitalize text-red-dark">
                    {{ $t("name") }}
                  </td>
                  <td>{{ name }}</td>
                </tr>

                <tr>
                  <td style="width: 25px">
                    <img
                      src="@/assets/icon-email-red.png"
                      style="width: 25px"
                      alt=""
                       loading="lazy"
                    />
                  </td>
                  <td class="w-4/12 p-2 capitalize text-red-dark">
                    {{ $t("email") }}
                  </td>
                  <td>{{ email }}</td>
                </tr>

                <tr>
                  <td style="width: 25px">
                    <img
                      src="@/assets/icon-phone-red.png"
                      style="width: 25px"
                      alt=""
                       loading="lazy"
                    />
                  </td>
                  <td class="w-4/12 p-2 capitalize text-red-dark">
                    {{ $t("phone") }}
                  </td>
                  <td>{{ phone }}</td>
                </tr>

                <tr>
                  <td style="width: 25px" class="pt-2 align-top">
                    <img
                      src="@/assets/icon-menu-red.png"
                      style="width: 25px"
                      alt=""
                       loading="lazy"
                    />
                  </td>
                  <td class="w-4/12 p-2 capitalize align-top text-red-dark">
                    {{ $t("voucherDetail") }}
                  </td>
                  <td class="pt-2">
                    <ul>
                      <li
                        v-for="(voucher, index) in vouchersSummary"
                        :key="`voucher-${index}-${voucher.amount}`"
                      >
                        {{ `${voucher.name} (x${voucher.quantity})` }}
                      </li>
                    </ul>
                  </td>
                </tr>
              </table>

              <LandingVoucherChargedSummary
                v-if="isMobile"
                class="border-t border-b"
                :vouchers="vouchersSummary"
                :total="totalCharge"
              />
            </div>
          </div>
        </div>
        <hr v-if="isDesktop" class="mt-4 mb-8" />
        <div class="flex justify-between px-4 lg:px-0">
          <span class="font-bold capitalize lg:text-2xl lg:px-0">{{
            $t("myVoucher")
          }}</span>
          <router-link
            v-if="isUserSignedIn"
            :to="{ name: ROUTE_PROFILE_VOUCHER }"
            class="font-bold capitalize text-red-dark"
          >
            {{ $t("showMore") }}
          </router-link>
        </div>
        <p class="px-4 text-xs leading-6 lg:text-base lg:px-0">
          {{ $t("allVoucherWillSentToEmail") }}.
        </p>
        <p
          class="px-4 my-2 text-sm text-red-dark lg:px-0"
          v-html="$t('voucherRequestTax')"
        ></p>
        <div class="flex flex-wrap items-center px-4 mt-4 lg:px-0">
          <div
            v-for="(voucher, index) in vouchersDetail"
            :key="`voucher-${voucher.id}-${index}`"
            class="w-full mb-5 lg:w-1/2"
          >
            <VoucherCard
              :name="voucher.name"
              :price="voucher.amount"
              :valid-until="voucher.expiryDate"
              :code="voucher.voucherCode"
              class="mb-4 lg:mr-4"
              :is-show-copy-button="isSupportCopyClipboard"
              @on-copied="copyVoucherCode(voucher.voucherCode)"
              @on-shared="shareVoucherCode(voucher)"
            />
          </div>

          <div v-if="howToUseVoucher" class="mb-5">
            <HhImage
              :mobile-width="180"
              :desktop-width="270"
              :img="howToUseVoucher.header.url"
              alt="how to use voucher"
              class="mb-3"
              :style="isDesktop ? 'width: 270px' : 'width: 180px'"
            />
            <div
              class="how-to-use-voucher-content"
              v-html="howToUseVoucher.content"
            ></div>
          </div>
        </div>
      </div>
      <div v-if="isDesktop" class="lg:w-4/12">
        <LandingVoucherChargedSummary
          :vouchers="vouchersSummary"
          :total="totalCharge"
        />
      </div>
    </div>
    <ClipboardCopyModalVue
      :is-show="isShowCopyModal"
      @on-closed="isShowCopyModal = false"
    />
    <ShareSosmedModal
      :is-show="isShowShareModal"
      :share-url="shareUrl"
      @on-closed="isShowShareModal = false"
    >
      <p class="mb-5 font-black text-center lg:text-lg">Voucher</p>
      <p class="mb-5 text-center">Share with social media</p>
    </ShareSosmedModal>
  </div>
</template>

<script>
import {
  getVoucherTransaction,
  resetState,
  id,
  isLoading,
  name,
  email,
  phone,
  vouchersDetail,
  vouchersSummary,
  totalCharge,
} from "@/components/Landing/landingVoucher";
import {
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  computed,
} from "@vue/composition-api";
import {
  DEFAULT_AVATAR,
  ROUTE_PROFILE_VOUCHER,
  HUNGRY_HUB_VOUCHER,
  ROUTE_RESTAURANT_PAGE,
  ROUTE_VOUCHER_PAGE,
} from "@/lib/constant";
import { useClipboard } from "@vueuse/core";
import { isSupport as isSupportNavigatorShare } from "@/composable/useNavigatorShare";
import { getVoucherIntroduction } from "@/services/common";
import useShareVoucher from "@/composable/useShareVoucher";
import useLazyImport from "@/composable/useLazyImport";
let self;

export default {
  name: "VouchersLandingPage",
  components: {
    LandingHeader: () =>
      useLazyImport(() => import("@/components/Landing/LandingHeader.vue")),
    LandingVoucherChargedSummary: () =>
      useLazyImport(() =>
        import("@/components/Landing/LandingVoucherChargedSummary.vue")
      ),
    VoucherCard: () =>
      useLazyImport(() =>
        import("@/components/Shared/voucher_flow/VoucherCard.vue")
      ),
    ClipboardCopyModalVue: () =>
      useLazyImport(() => import("@/components/Common/ClipboardCopyModal.vue")),
    ShareSosmedModal: () =>
      useLazyImport(() => import("@/components/Common/ShareSosmedModal.vue")),
  },
  props: {
    encryptedId: {
      type: String,
      required: true,
    },
    restaurantName: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { copy, isSupported: isSupportCopyClipboard } = useClipboard();
    const { shareVoucher, getShareUrl } = useShareVoucher();

    const shareUrl = ref("");
    const encryptedId = props.encryptedId;
    const isShowCopyModal = ref(false);
    const isShowShareModal = ref(false);
    const voucherHelperText = ref([]);

    const howToUseVoucher = computed(() => {
      if (Array.isArray(voucherHelperText.value)) {
        return voucherHelperText.value[2] || null;
      }
      return null;
    });

    onMounted(() => {
      registerPopStateCallback();
      getVoucherTransaction(encryptedId);
      getVoucherSupportText();
    });

    onBeforeUnmount(() => {
      resetState();
      removePopStateCallback();
    });

    watch(isShowCopyModal, (val) => {
      if (val === true) {
        setTimeout(() => {
          isShowCopyModal.value = false;
        }, 1500);
      }
    });

    function shareVoucherCode(voucher) {
      if (isSupportNavigatorShare && self.isMobile) {
        shareVoucher(voucher);
        return;
      }
      shareUrl.value = getShareUrl(voucher);
      isShowShareModal.value = true;
    }

    function copyVoucherCode(voucherCode) {
      copy(voucherCode);
      isShowCopyModal.value = true;
    }

    async function getVoucherSupportText() {
      const { isSuccess, data } = await getVoucherIntroduction();
      if (isSuccess) {
        voucherHelperText.value = Array.isArray(data.data) ? data.data : [];
        return;
      }
    }

    function registerPopStateCallback() {
      window.onpopstate = () => {
        if (props.restaurantName === HUNGRY_HUB_VOUCHER) {
          self.$router.push({ name: ROUTE_VOUCHER_PAGE });
        } else {
          self.$router.push({
            name: ROUTE_RESTAURANT_PAGE,
            params: { restaurantName: props.restaurantName },
          });
        }
      };
    }

    function removePopStateCallback() {
      window.onpopstate = {};
    }

    return {
      ROUTE_PROFILE_VOUCHER,
      DEFAULT_AVATAR,
      id,
      isLoading,
      name,
      email,
      phone,
      vouchersDetail,
      vouchersSummary,
      totalCharge,
      isShowCopyModal,
      isShowShareModal,
      isSupportCopyClipboard,
      shareVoucherCode,
      copyVoucherCode,
      howToUseVoucher,
      shareUrl,
    };
  },
  computed: {
    landingTitle() {
      return "Completed!";
    },
    landingSubTitle() {
      const id = this.id;
      return `<span class="capitalize">Transaction ID: </span><span class="text-red-dark">${id}</span>`;
    },
    landingDesc() {
      return "";
    },
    avatarThumb() {
      return "";
    },
    isUserSignedIn() {
      return this.$store.getters["user/isUserSignedIn"];
    },
  },
  created() {
    self = this;
  },
  i18n: {
    messages: {
      en: {
        allVoucherWillSentToEmail:
          "All vouchers will be sent to the email address",
      },
      th: {
        allVoucherWillSentToEmail: "Voucher ทั้งหมดจะถูกส่งไปที่อีเมลของคุณ",
      },
    },
  },
};
</script>

<style lang="scss">
.landing-page {
  @screen lg {
    max-width: 1280px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 25px;
    margin-bottom: 25px;
  }

  .user-avatar {
    width: 60px;
    height: 60px;
    @screen lg {
      .user-avatar {
        width: 100px;
        height: 100px;
      }
    }
  }

  .wrapper {
    min-height: 80vh;
  }

  #landing-loader {
    width: 30px;
    height: 30px;
    border-radius: 30px;
    @screen lg {
      #landing-loader {
        width: 40px;
        height: 40px;
        border-radius: 40px;
      }
    }
  }

  .loading-wrapper {
    @screen lg {
      min-height: 600px;
    }
  }

  .how-to-use-voucher-content {
    @apply ml-5 text-gray-900 text-sm mb-6;
    @screen lg {
      @apply text-base;
    }
  }

  .how-to-use-voucher-content ul {
    list-style: disc;
  }

  .how-to-use-voucher-content ol {
    list-style: decimal;
  }
}
</style>
