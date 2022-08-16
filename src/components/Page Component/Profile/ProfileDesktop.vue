<template>
  <div>
    <div class="pt-8 pb-4 max-width">
      <div class="lg:ml-20 lg:mr-16">
        <div class="flex mx-4">
          <!-- left column -->
          <div class="text-center">
            <div class="relative">
              <hh-image
                class="user-image lg:mx-auto"
                :img="avatarOriginal"
              ></hh-image>
              <hh-image
                v-if="currentPrivilegeLevel.iconBadge"
                class="absolute"
                :img="currentPrivilegeLevel.iconBadge.url"
                :alt="currentPrivilegeLevel.name"
                width="30"
                style="bottom: 0px; right: 20px"
              ></hh-image>
            </div>
            <button
              class="px-4 my-2 text-xs capitalize border rounded-full edit-profile-button border-red-dark text-red-dark lg:mx-auto"
              @click="toggleModal(true, MODAL_EDIT_ACCOUNT)"
            >
              {{ $t("editProfile") }}
            </button>

            <div
              v-if="isDesktop"
              class="flex flex-col mt-6 text-sm whitespace-no-wrap shadow"
              style="width: 120px"
            >
              <router-link
                :to="{ name: ROUTE_PROFILE_HOME }"
                class="py-1 capitalize reservation-button hover:underline"
                :class="
                  activePage === '/profile/' || activePage === '/profile'
                    ? ' bg-red-dark text-white'
                    : ' text-red-dark'
                "
              >
                {{ $tc("reservation") }}
              </router-link>
              <router-link
                :to="{ name: 'ProfileFavourite' }"
                class="py-1 capitalize favourite-button hover:underline"
                :class="
                  activePage === '/profile/favourite'
                    ? ' bg-red-dark text-white'
                    : ' text-red-dark'
                "
              >
                {{ $t("favorites") }}
              </router-link>
              <router-link
                :to="{ name: 'ProfileHistory' }"
                class="py-1 capitalize booking-history-button hover:underline"
                :class="
                  activePage === '/profile/history'
                    ? ' bg-red-dark text-white'
                    : ' text-red-dark'
                "
              >
                {{ $t("bookingHistory") }}
              </router-link>
              <router-link
                :to="{ name: ROUTE_PROFILE_VOUCHER }"
                class="py-1 capitalize booking-history-button hover:underline"
                :class="
                  activePage === '/profile/voucher'
                    ? ' bg-red-dark text-white'
                    : ' text-red-dark'
                "
              >
                {{ $t("myVoucher") }}
              </router-link>
              <router-link
                :to="{ name: 'ProfileMemberPrivilege' }"
                class="py-1 capitalize member-priviliges-button hover:underline"
                :class="
                  activePage === '/profile/privilege'
                    ? ' bg-red-dark text-white'
                    : ' text-red-dark'
                "
              >
                {{ $t("memberPriviliges") }}
              </router-link>
              <router-link
                :to="{ name: 'ProfilePoint' }"
                class="py-1 capitalize redeem-point-button hover:underline"
                :class="
                  activePage === '/profile/point'
                    ? ' bg-red-dark text-white'
                    : ' text-red-dark'
                "
              >
                {{ $t("redeemPoint") }}
              </router-link>
              <!-- <button
                v-if="false"
                class="my-1 payment-detail-button hover:underline"
                :class="
                  activePage === 'payment'
                    ? ' bg-red-dark text-white'
                    : ' text-red-dark'
                "
                @click="goTo('payment')"
              >
                Payment Detail
              </button> -->
            </div>
          </div>

          <!-- right column -->
          <div class="mx-4 lg:ml-12 lg:w-full lg:text-sm">
            <div class="">
              <div class="relative">
                <!-- profile attribute -->
                <section>
                  <p class="text-sm font-black lg:text-base lg:mb-4">
                    Hello, {{ name }}! <br v-if="isMobile" />
                    Are you feeling
                    <span class="text-red-dark">hungry</span> today?
                  </p>

                  <ul class="text-sm">
                    <li class="lg:mb-2">
                      <div class="flex items-center">
                        <div class="flex items-center lg:w-48">
                          <div class="pr-2">
                            <img
                              width="18"
                              height="18"
                              loading="lazy"
                              src="@/assets/icon-user-red.png"
                              alt="icon-people"
                              class="flex-shrink-0"
                            />
                          </div>
                          <span
                            class="w-auto pl-2 pr-4 capitalize lg:pl-4 lg:w-40 lg:pr-0 text-red-dark"
                            >{{ $t("name") }}</span
                          >
                        </div>
                        <span class="flex-grow">{{ name }}</span>
                      </div>
                    </li>
                    <li class="lg:mb-2">
                      <div class="flex items-center">
                        <div class="flex items-center lg:w-48">
                          <div class="pr-2">
                            <img
                              width="18"
                              height="18"
                              loading="lazy"
                              src="@/assets/icon-email-red.png"
                              alt="icon-people"
                              class="flex-shrink-0"
                            />
                          </div>
                          <span
                            class="pl-2 pr-4 capitalize lg:pl-4 lg:w-40 lg:pr-0 text-red-dark"
                            >{{ $t("email") }}</span
                          >
                        </div>
                        <span>{{ email }}</span>
                      </div>
                    </li>
                    <li class="lg:mb-2">
                      <div class="flex items-center">
                        <div class="flex items-center lg:w-48">
                          <div class="pr-2">
                            <img
                              width="18"
                              loading="lazy"
                              height="18"
                              src="@/assets/icon-phone-red.png"
                              alt="icon-people"
                              class="flex-shrink-0"
                            />
                          </div>
                          <span
                            class="pl-2 pr-4 capitalize lg:pl-4 lg:w-40 lg:pr-0 text-red-dark"
                            >{{ $t("phone") }}</span
                          >
                        </div>
                        <span>{{ phoneCode + phone }}</span>
                      </div>
                    </li>
                    <li>
                      <div class="flex items-center">
                        <span
                          class="pr-4 capitalize lg:w-48 lg:pr-0 text-red-dark"
                          >{{ $t("referralCode") }}</span
                        >
                        <div class="flex items-center">
                          <span>{{ referralCode }}</span>
                          <div
                            class="ml-1"
                            @click="toggleModal(true, MODAL_SHARE_REF, 350)"
                          >
                            <img
                              class="flex-shrink-0 cursor-pointer"
                              src="@/assets/icon-share-black.png"
                              width="12"
                              loading="lazy"
                              height="12"
                            />
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <span class="text-gray-500">
                        {{ $t("earnHungryPointForEvery") }}
                      </span>
                    </li>
                  </ul>
                </section>

                <!-- profile point -->
                <section
                  v-if="showPrivilegeLevel"
                  class="absolute top-0 right-0"
                  style="width: 35%"
                >
                  <div
                    class="flex items-center justify-between px-4 py-2 rounded-lg"
                    :style="`background: url('${getHeaderBgColor()}'); color: ${
                      currentPrivilegeLevel.profileTextColor
                    }`"
                  >
                    <div class="text-xl font-black">
                      {{ currentPrivilegeLevel.name }}
                    </div>
                    <div>
                      <div class="text-xs capitalize">
                        {{ $t("myHungryPoint") }}
                      </div>
                      <div
                        class="flex flex-col items-end justify-end text-lg font-black"
                      >
                        {{ points }}
                        <button
                          v-if="points"
                          class="flex items-center justify-center flex-grow-0 px-2 mt-1 text-xs capitalize bg-transparent border rounded-full hover:underline"
                          :style="`border-color: ${currentPrivilegeLevel.profileTextColor}`"
                          :disabled="isInitialLoading"
                          @click="showPointHistoryModal"
                        >
                          <span
                            v-if="isInitialLoading"
                            class="mr-2 loader small white"
                          ></span>
                          {{ $t("pointHistory") }}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    v-if="loyaltyLevelExpiryDate && !isOnMaxPrivilegeLevel"
                    class="mt-2 text-xs text-gray-600"
                  >
                    {{
                      $t("maintainPrivilegeWarning", {
                        date: loyaltyLevelExpiryDate,
                      })
                    }}
                  </div>

                  <MemberPrivilegeProgress />
                </section>
              </div>

              <section v-if="isDesktop" style="margin-top: 55px">
                <router-view></router-view>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ProfileModal
      :key="activeModal"
      :width="modalWidth"
      :title="modalTitle"
      :is-show="isModalShow"
      @on-closed="onModalClosed"
    >
      <ProfileModalEdit
        v-if="activeModal === MODAL_EDIT_ACCOUNT"
        @on-change-password="showChangePasswordModal"
        @on-profile-edit="onModalClosed"
        @on-delete-account="toggleModal(true, MODAL_DELETE_ACCOUNT)"
      />

      <ProfileModalEditPassword
        v-else-if="activeModal === MODAL_EDIT_PASSWORD"
        class="block w-10/12 min-h-screen mx-auto my-8 lg:min-h-full"
        @on-update-password="$router.push({ name: 'profile-home' })"
      />
      <ProfileModalShareReferral
        v-else-if="activeModal === MODAL_SHARE_REF"
        @on-referral-code-shared="onModalClosed"
      />
      <ProfilePointHistory v-else-if="activeModal === MODAL_POINT_HISTORY" />
      <ProfileModalDeleteAccount
        v-else-if="activeModal === MODAL_DELETE_ACCOUNT"
        @on-cancel="onModalClosed"
      />
    </ProfileModal>
  </div>
</template>

<script>
import { state as profileState } from "@/components/Page Component/Profile/profile";
import { mapState } from "vuex";
import {
  state as pointHistoryState,
  methods as pointHistoryMethods,
} from "@/composable/pointHistory";
import { ROUTE_PROFILE_VOUCHER, ROUTE_PROFILE_HOME } from "@/lib/constant";
import useLazyImport from "@/composable/useLazyImport";
import {
  privilegeLevel,
  nextPrivilegeLevel,
  nextPrivilegeLevelMinimumReservation,
  nextPrivilegeLevelMinimumSpend,
  currentPrivilegeLevel,
  isOnMaxPrivilegeLevel,
  getHeaderBgColor,
} from "@/composable/useUserPrivileges";
import isEmpty from "lodash-es/isEmpty";
export default {
  components: {
    ProfileModal: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "ProfileDesktopChunk" */ "@/components/Page Component/Profile/Modal/ProfileModal.vue"
        )
      ),
    ProfileModalEdit: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "ProfileDesktopChunk" */ "@/components/Page Component/Profile/Modal/ProfileModalEdit.vue"
        )
      ),
    ProfileModalEditPassword: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "ProfileDesktopChunk" */ "@/components/Page Component/Profile/Edit/ProfileEditPassword.vue"
        )
      ),
    ProfileModalShareReferral: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "ProfileDesktopChunk" */ "@/components/Page Component/Profile/Modal/ProfileModalShareReferral.vue"
        )
      ),
    ProfilePointHistory: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "ProfileDesktopChunk" */ "@/components/Page Component/Profile/Modal/ProfileModalPointHistory.vue"
        )
      ),
    MemberPrivilegeProgress: () =>
      import(
        /* webpackChunkName: "ProfileDesktopChunk" */ "@/components/Page Component/Profile/MemberPrivilege/MemberPrivilegeProgress.vue"
      ),
    ProfileModalDeleteAccount: () =>
      import(
        /* webpackChunkName: "ProfileDesktopChunk" */ "@/components/Page Component/Profile/Modal/ProfileModalDeleteAccount.vue"
      ),
  },
  setup() {
    const MODAL_POINT_HISTORY = "point-history";
    const MODAL_SHARE_REF = "share-referral";
    const MODAL_DELETE_ACCOUNT = "delete-account";
    const MODAL_EDIT_ACCOUNT = "edit-account";
    const MODAL_EDIT_PASSWORD = "edit-password";
    const { getPointHistoryList } = pointHistoryMethods;
    const { isInitialLoading } = pointHistoryState;
    return {
      MODAL_POINT_HISTORY,
      MODAL_SHARE_REF,
      MODAL_DELETE_ACCOUNT,
      MODAL_EDIT_ACCOUNT,
      MODAL_EDIT_PASSWORD,
      isModalShow: false,
      modalWidth: 0,
      activeModal: "",
      ROUTE_PROFILE_VOUCHER,
      ROUTE_PROFILE_HOME,
      getPointHistoryList,
      isInitialLoading,
      privilegeLevel,
      nextPrivilegeLevel,
      nextPrivilegeLevelMinimumReservation,
      nextPrivilegeLevelMinimumSpend,
      currentPrivilegeLevel,
      isOnMaxPrivilegeLevel,
      getHeaderBgColor,
      ...profileState,
    };
  },
  computed: {
    ...mapState("user", [
      "points",
      "totalSpend",
      "totalReservation",
      "loyaltyLevelExpiryDate",
    ]),
    modalTitle() {
      if (this.activeModal === this.MODAL_EDIT_ACCOUNT) {
        return this.$t("editProfile");
      } else if (this.activeModal === this.MODAL_EDIT_PASSWORD) {
        return this.$t("changePassword");
      } else if (this.activeModal === this.MODAL_POINT_HISTORY) {
        return this.$t("pointHistory");
      }
      return "";
    },
    activePage() {
      return this.$route.path;
    },
    showPrivilegeLevel() {
      return !isEmpty(this.currentPrivilegeLevel);
    },
  },
  methods: {
    toggleModal(isShow = false, modalName = "", modalWidth = 0) {
      this.modalWidth = modalWidth;
      this.activeModal = modalName;
      if (isShow === true) {
        this.isModalShow = false;
      }
      this.$nextTick(() => {
        this.isModalShow = isShow;
      });
    },
    onModalClosed() {
      this.toggleModal(false, "");
    },
    showChangePasswordModal() {
      this.toggleModal(true, this.MODAL_EDIT_PASSWORD);
    },
    async showPointHistoryModal() {
      await this.getPointHistoryList();
      this.toggleModal(true, this.MODAL_POINT_HISTORY);
    },
  },
};
</script>

<style lang="scss" scoped>
.user-image {
  width: 95px;
  height: 95px;

  @apply border rounded-full;
}

.tab-button {
  @apply w-1/3 py-1;
}
</style>
