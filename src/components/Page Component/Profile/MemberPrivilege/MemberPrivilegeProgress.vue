<template>
  <div>
    <template v-if="isOnMaxPrivilegeLevel">
      <div class="flex items-center mt-3 text-sm">
        <img
          src="@/assets/icon-ribbon-red.png"
          class="mr-2"
           loading="lazy"
          width="12"
          alt="icon ribbon"
        />
        <span>{{ $t("youReachMaxLevel") }}</span>
      </div>
      <div class="h-5 mt-2 border border-gray-400 rounded-full">
        <div
          class="h-full rounded-full"
          :style="`width: ${
            100 -
            (countDownLoyaltyLevelExpiryDate.expiryInMonth -
              countDownLoyaltyLevelExpiryDate.dayBeforeExpiry)
          }%; background-color: ${prevPrivilegeLevel.backgroundColor}`"
        ></div>
      </div>
      <div class="flex items-start text-xs">
        <img
          src="@/assets/icon-attention.png"
          width="16"
           loading="lazy"
          alt="icon attention"
          class="mt-2 mr-2"
        />
        <div class="mt-1 mr-2 lg:mr-6">
          {{
            $t("bookBeforeDateForMaintain", { date: loyaltyLevelExpiryDate })
          }}
        </div>
        <div
          class="p-1 mt-2 rounded-full whitespace-nowrap"
          :style="`background-color: ${currentPrivilegeLevel.backgroundColor}; color: ${currentPrivilegeLevel.textColor}`"
        >
          {{
            `${countDownLoyaltyLevelExpiryDate.dayBeforeExpiry}/${countDownLoyaltyLevelExpiryDate.expiryInMonth} Days`
          }}
        </div>
      </div>
    </template>
    <template v-else>
      <div class="h-5 mt-2 border border-gray-400 rounded-full">
        <div
          class="h-full rounded-full"
          :style="`width: ${currentReservationProgressBar}%; background-color: ${nextPrivilegeLevel.backgroundColor}`"
        ></div>
      </div>
      <div class="flex items-center justify-between text-xs capitalize">
        <div>
          <div>{{ $t("total") }}</div>
          <div>
            {{ usedTotalReservations }}
            {{ $tc("reservation", usedTotalReservations) }}
          </div>
        </div>
        <div class="text-base text-gray-500">OR</div>
        <div class="text-right capitalize">
          <div>{{ $t("unlock") }} {{ nextPrivilegeLevel.name }}</div>
          <div>
            {{ nextPrivilegeLevelMinimumReservation }}
            {{ $tc("reservation", nextPrivilegeLevelMinimumReservation) }}
          </div>
        </div>
      </div>

      <!-- total spend  -->
      <template
        v-if="
          !isRegainingPrivilegeLevel && nextPrivilegeLevelMinimumSpend !== 0
        "
      >
        <div class="h-5 mt-2 border border-gray-400 rounded-full">
          <div
            class="h-full rounded-full bg-red-dark"
            :style="`width: ${currentSpendProgressBar}%;background-color: ${nextPrivilegeLevel.backgroundColor}`"
          ></div>
        </div>
        <div class="flex justify-between text-xs capitalize">
          <div>
            <div>{{ $t("total") }}</div>
            <div>
              {{ usedTotalSpend }}
            </div>
          </div>
          <div class="text-right capitalize">
            <div>{{ $t("unlock") }} {{ nextPrivilegeLevel.name }}</div>
            <div>{{ $money(nextPrivilegeLevelMinimumSpend) }}</div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
<script>
import {
  currentPrivilegeLevel,
  prevPrivilegeLevel,
  nextPrivilegeLevel,
  nextPrivilegeLevelMinimumSpend,
  nextPrivilegeLevelMinimumReservation,
  isOnMaxPrivilegeLevel,
  isRegainingPrivilegeLevel,
} from "@/composable/useUserPrivileges";
export default {
  name: "MemberPrivilegeProgress",
  setup() {
    return {
      currentPrivilegeLevel,
      prevPrivilegeLevel,
      nextPrivilegeLevel,
      nextPrivilegeLevelMinimumSpend,
      nextPrivilegeLevelMinimumReservation,
      isOnMaxPrivilegeLevel,
      isRegainingPrivilegeLevel,
    };
  },
  computed: {
    loyaltylevelExpiryDateDayjs() {
      return this.$dayjs(
        this.$store.state.user.loyaltyLevelExpiryDate,
        "DD/MM/YYYY"
      );
    },
    loyaltyLevelExpiryDate() {
      return this.loyaltylevelExpiryDateDayjs.format("DD MMM YYYY");
    },
    countDownLoyaltyLevelExpiryDate() {
      // disable use logic to calculate loyalty expiry in month
      // const startLoyaltyLevelDate = this.$store.state.user.startDateLevel;
      // const expiryInMonth = this.loyaltylevelExpiryDateDayjs.diff(
      //   this.$dayjs(startLoyaltyLevelDate, "DD/MM/YYYY"),
      //   "day"
      // );
      const dayBeforeExpiry = this.loyaltylevelExpiryDateDayjs.diff(
        this.$dayjs(),
        "day"
      );
      return { dayBeforeExpiry, expiryInMonth: 120 };
    },
    progressTotalReservations() {
      return this.$store.state.user.progressTotalReservations;
    },
    progressTotalSpend() {
      return this.$store.state.user.progressTotalSpend;
    },
    totalReservation() {
      return this.$store.state.user.totalReservation;
    },
    totalSpend() {
      return this.$store.state.user.totalSpend;
    },
    usedTotalReservations() {
      return this.isRegainingPrivilegeLevel
        ? this.progressTotalReservations
        : this.totalReservation;
    },
    usedTotalSpend() {
      return this.isRegainingPrivilegeLevel
        ? this.$money(this.progressTotalSpend)
        : this.$money(this.totalSpend);
    },
    currentReservationProgressBar() {
      if (
        typeof this.nextPrivilegeLevelMinimumReservation === "number" &&
        typeof this.usedTotalReservations === "number"
      ) {
        const percentage =
          (this.usedTotalReservations /
            this.nextPrivilegeLevelMinimumReservation) *
          100;
        return percentage > 100 ? 100 : percentage;
      }
      return 0;
    },
    currentSpendProgressBar() {
      if (
        typeof this.nextPrivilegeLevelMinimumSpend === "number" &&
        typeof this.totalSpend === "number"
      ) {
        const percentage =
          (this.totalSpend / this.nextPrivilegeLevelMinimumSpend) * 100;
        return percentage > 100 ? 100 : percentage;
      }
      return 0;
    },
  },
  i18n: {
    messages: {
      en: {
        bookBeforeDateForMaintain:
          "Order or book before {date} to keep your level and Hungry Points",
        youReachMaxLevel: "You reached the highest level!",
      },
      th: {
        bookBeforeDateForMaintain:
          "โปรดทำการจองภายในวันที่ {date} เพื่อรักษาสิทธิพิเศษของคุณไว้!",
        youReachMaxLevel: "คุณถึงระดับสูงสุดแล้ว!",
      },
    },
  },
};
</script>
