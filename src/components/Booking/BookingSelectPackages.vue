<template>
  <div>
    <div v-if="!isEmpty(availablePackages)">
      <div v-for="(packages, type) in availablePackages" :key="'list-' + type">
        <div
          v-if="showPackageSectionTitle"
          class="flex flex-col mx-2 mt-6 mb-2"
        >
          <h4 class="text-sm ma0 package-section-name">
            {{ packageTypeFullName(type) }}
          </h4>
          <div class="w-full mt-2 text-xs">
            {{ packageTagLine(type, lang) }}
          </div>
        </div>
        <div class="mt-4 section-wrapper lg:mt-6">
          <PackageCardList :type="type">
            <BookingPackageCard
              v-for="pack in getNonAlaCarte(packages)"
              :key="pack.name"
              :show-version="'mobile'"
              :packages="pack"
              :adult="adult"
              :auto-show-package-body="isDineInPackage(pack.typeCode) === false"
              @on-package-selected="
                $emit('on-package-selected', pack.isAcceptManyQuantity)
              "
            />
          </PackageCardList>
        </div>
      </div>

      <div class="mt-4 lg:mt-6">
        <div v-for="packages in getAlaCarte()" :key="packages.id">
          <BookingPackageCard :show-version="'mobile'" :packages="packages" />
        </div>
      </div>
    </div>
    <div v-else class="flex items-center justify-center w-full h-20 text-sm">
      {{ $t("noAvailablePackage") }}
    </div>
  </div>
</template>

<script>
import { packageTypeFullName, packageTagLine } from "@/helper/PackageHelper";
import isEmpty from "lodash-es/isEmpty";
import { isDineInPackage } from "@/helper/PackageHelper";
import useLazyImport from "@/composable/useLazyImport";

export default {
  components: {
    PackageCardList: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "PackageCardListChunk" */ "@/components/Package/PackageCardList"
        )
      ),
    BookingPackageCard: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "BookingPackageCardChunk" */ "@/components/Booking/BookingPackageCard"
        )
      ),
  },
  props: {
    showPackageSectionTitle: {
      type: Boolean,
      default: true,
    },
    availablePackages: {
      type: Object,
      required: true,
    },
  },
  created() {
    this.lang = this.$store.state.lang;
    this.adult = this.$store.state.booking.adult;
  },
  methods: {
    isEmpty,
    packageTypeFullName,
    packageTagLine,
    isDineInPackage,
    getNonAlaCarte(packages) {
      return packages.filter((pack) => !pack.isAlaCarte);
    },
    getAlaCarte() {
      const hahPackages = this.availablePackages.hah;
      if (hahPackages && hahPackages.length) {
        return hahPackages.filter(
          (pack) => pack.isAlaCarte && isDineInPackage(pack.typeCode) === false
        );
      }
    },
  },
};
</script>
<style scoped>
.section-wrapper {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  margin: 24px 0;
}
</style>
<i18n>
{
  "en": {
    "noAvailablePackage": "Sorry, no available packages for selected period"
  },
  "th": {
    "noAvailablePackage": "ขออภัย ไม่มีแพ็คเกจสำหรับช่วงเวลาที่เลือก"
  }
}
</i18n>
