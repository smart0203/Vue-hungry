<template>
  <div class="mx-2">
    <table class="w-full text-sm table-fixed lg:text-base lg:table-auto">
      <tr v-if="!isDineIn">
        <td style="width: 25px"></td>
        <td class="w-4/12 px-2 py-4 whitespace-nowrap">
          <div>{{ $t("needAnyHelp") }}</div>
        </td>
        <td class="text-right">
          <button
            class="px-4 py-2 text-sm text-white border rounded-full bg-red-dark"
            @click="showHelpModal = true"
          >
            {{ $t("callAsistance") }}
          </button>
        </td>
      </tr>
      <tr>
        <td style="width: 25px">
          <img src="@/assets/icon-user-red.png"  loading="lazy" style="width: 25px" alt="" />
        </td>
        <td class="w-4/12 p-2 capitalize text-red-dark">
          {{ $t("name") }}
        </td>
        <td>{{ name }}</td>
      </tr>
      <tr>
        <td style="width: 25px">
          <img src="@/assets/icon-email-red.png"  loading="lazy" style="width: 25px" alt="" />
        </td>
        <td class="w-4/12 p-2 capitalize text-red-dark">{{ $t("email") }}</td>
        <td>{{ email }}</td>
      </tr>
      <tr>
        <td style="width: 25px">
          <img src="@/assets/icon-phone-red.png"  loading="lazy" style="width: 25px" alt="" />
        </td>
        <td class="w-4/12 p-2 capitalize text-red-dark">{{ $t("phone") }}</td>
        <td>{{ phone }}</td>
      </tr>
      <tr>
        <td style="width: 25px">
          <img src="@/assets/icon-date-red.png"  loading="lazy" style="width: 25px" alt="" />
        </td>
        <td class="w-4/12 p-2 text-red-dark">
          <div class="capitalize">{{ $t("dateAndTime") }}</div>
        </td>
        <td>
          <div>{{ dateTime }}</div>
        </td>
      </tr>
      <tr v-if="isDineIn">
        <td style="width: 25px">
          <img
            src="@/assets/icon-people-group-red.png"
            style="width: 25px"
            alt=""
             loading="lazy"
          />
        </td>
        <td class="w-4/12 p-2 capitalize text-red-dark">
          <div>{{ $t("numberOfPeople") }}</div>
        </td>
        <td>
          <div>{{ adultKids }}</div>
        </td>
      </tr>
      <tr>
        <td style="width: 25px">
          <img src="@/assets/icon-fork-red.png"  loading="lazy" style="width: 25px" alt="" />
        </td>
        <td class="w-4/12 p-2 capitalize text-red-dark">
          {{ $tc("restaurant") }}
        </td>
        <td>{{ restaurantName }}</td>
      </tr>
      <tr v-if="isDineIn === false">
        <td style="width: 25px">
          <img src="@/assets/icon-shop-red.png"  loading="lazy" style="width: 25px" alt="" />
        </td>
        <td class="w-4/12 p-2 capitalize text-red-dark">{{ $t("method") }}</td>
        <td class="capitalize">{{ methodName }}</td>
      </tr>
      <tr>
        <td style="width: 25px" class="pt-2 align-top">
          <img src="@/assets/icon-menu-red.png"  loading="lazy" style="width: 25px" alt="" />
        </td>
        <td class="w-4/12 p-2 capitalize align-top text-red-dark">
          {{ isPackageCharged ? $t("packageType") : $t("packages") }}
        </td>
        <td
          class="pt-2"
          v-html="isPackageCharged ? packageType : packagesList"
        ></td>
      </tr>
      <tr>
        <td class="pt-2 align-top" style="width: 25px">
          <img src="@/assets/icon-message-red.png"  loading="lazy" style="width: 25px" alt="" />
        </td>
        <td class="w-4/12 p-2 capitalize align-top text-red-dark">
          {{ $t("specialRequest") }}
        </td>
        <td>{{ specialRequest }}</td>
      </tr>

      <tr v-if="diningOccasion">
        <td>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            class="icon-star text-red-dark"
            viewBox="0 0 16 16"
          >
            <path
              d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"
            />
          </svg>
        </td>
        <td class="p-2 capitalize text-red-dark">
          {{ $t("occasion") }}
        </td>
        <td>
          {{ diningOccasion }}
        </td>
      </tr>

      <tr v-if="isDelivery">
        <td class="pt-2 align-top">
          <img
            src="@/assets/icon-location-red.png"
            style="width: 25px"
            alt=""
             loading="lazy"
          />
        </td>
        <td class="p-2 capitalize align-top text-red-dark">
          {{ $t("deliveryAddress") }}
        </td>
        <td>
          {{ deliveryAddress }}
        </td>
      </tr>
      <tr v-if="isDelivery">
        <td>
          <img src="@/assets/icon-note-red.png"  loading="lazy" style="width: 25px" alt="" />
        </td>
        <td class="p-2 capitalize text-red-dark">{{ $t("noteToDriver") }}</td>
        <td>
          {{ driverNote }}
        </td>
      </tr>
      <tr
        v-if="
          isPendinArrival &&
          isLateDelivery === false &&
          isDelivery &&
          deliveryEstimationLabel
        "
      >
        <td>
          <img src="@/assets/icon-time-red.png"  loading="lazy" style="width: 25px" alt="" />
        </td>
        <td
          class="p-2 capitalize text-red-dark"
          v-html="$t('deliveryTime')"
        ></td>
        <td class="capital-first-letter">
          {{ $t("estimated") }}
          <span class="text-red-dark">{{ deliveryEstimationLabel }} </span>
        </td>
      </tr>
      <tr></tr>
      <tr></tr>
      <tr></tr>
      <tr></tr>
      <tr></tr>
      <tr></tr>
      <template v-for="(guest, index) in guests">
        <tr :key="index + guest.name" class="pt-4">
          <td style="width: 25px">
            <img
              src="@/assets/icon-user-red.png"
              style="width: 25px"
              alt="user icon"
               loading="lazy"
            />
          </td>
          <td class="w-4/12 p-2 capitalize text-red-dark">{{ $t("name") }}</td>
          <td>{{ guest.name }}</td>
        </tr>
        <tr :key="index">
          <td style="width: 25px">
            <img
              src="@/assets/icon-phone-red.png"
              style="width: 25px"
               loading="lazy"
              alt="phone icon"
            />
          </td>
          <td class="w-4/12 p-2 capitalize text-red-dark">{{ $t("phone") }}</td>
          <td>{{ guest.phone }}</td>
        </tr>
      </template>
    </table>
    <LandingHelpModal
      :is-show="showHelpModal"
      :restaurant-phone="restaurantPhone"
      :hungryhub-phone="hungryhubPhone"
      :driver-phone="deliveryDriverPhone"
      @on-closed="showHelpModal = false"
    />
  </div>
</template>

<script>
import { packagePricingType } from "@/helper/PackageHelper";
import { state, computeds } from "./landing";
import LandingHelpModal from "./LandingHelpModal";

export default {
  components: {
    LandingHelpModal,
  },
  setup() {
    const {
      deliveryEstimation,
      deliveryEstimationLabel,
      isLateDelivery,
      isPendinArrival,
      deliveryDriverPhone,
    } = computeds;
    return {
      isLateDelivery,
      deliveryEstimation,
      deliveryEstimationLabel,
      isPendinArrival,
      deliveryDriverPhone,
      ...state,
    };
  },
  data() {
    return {
      showHelpModal: false,
    };
  },
  computed: {
    hungryhubPhone() {
      return this.$store.state.webConfig.config.supportPhone;
    },
    adultKids() {
      const adult = `${this.adult} ${this.$tc("adult", this.adult)} `;
      const kids = this.kids
        ? `${this.kids} ${this.$tc("kids", this.kids)}`
        : "";
      return adult + kids;
    },

    packagesList() {
      if (this.isPackageCharged && this.packages.length === 0) {
        this.$rollbar.error("cannot find the package that has been purchased", {
          bookingId: this.originalId,
        });
        return [];
      }
      let packagesString = "";
      this.packages.forEach((packages) => {
        packagesString += `${packages.name} ${this.$money(
          packages.price
        )} ${packagePricingType(this.packageType)}`;
      });
      return `
      ${packagesString}
      `;
    },
    methodName() {
      if (this.isDelivery) {
        return this.$t("delivery");
      } else if (this.isPickUp) {
        return this.$t("selfPickUp");
      }
      return this.$t("dineIn");
    },
  },
};
</script>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 10px 5px;
}
</style>
<i18n>
{
  "en": {
    "dateAndTime": "date & time",
    "callAsistance": "Call for assistance",
    "needAnyHelp": "Need any help ?"
  },
  "th": {
    "dateAndTime": "วันที่และเวลา",
    "callAsistance": "โทรขอความช่วยเหลือ",
    "needAnyHelp": "ต้องการความช่วยเหลือหรือไม่"
  }
}
</i18n>
