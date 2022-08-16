<template>
  <div>
    <div v-if="isLoading" class="w-full p-4 lg:p-0 lg:mt-6">
      <div
        v-for="n in dummyPackageCardCount"
        :key="`card-loading-${n}`"
        class="p-1 mb-4 shadow"
      >
        <div class="flex justify-between">
          <div class="w-1/2 h-3 bg-gray-300 lg:h-4"></div>
          <div class="w-10 h-3 bg-gray-300 lg:h-4"></div>
        </div>

        <div class="w-full h-8 mt-4 bg-gray-300 lg:h-12"></div>

        <div class="flex justify-between mt-4">
          <div class="w-1/4 h-4 bg-gray-300 rounded-full lg:w-1/5"></div>
          <div class="w-1/4 h-4 bg-gray-300 rounded-full lg:w-1/5"></div>
        </div>
      </div>
    </div>

    <div v-else>
      <!-- list package type -->
      <div class="flex flex-row items-center mt-4 mb-2 lg:mb-3">
        <h2
          class="w-auto my-1 ml-2 mr-4 text-xl capitalize md:ml-0 whitespace-nowrap lg:text-xl lg:mr-4 lg:ml-0"
        >
          {{ $t("packages") }}
        </h2>
        <ul
          class="flex my-2 overflow-scroll list pa0 lg:overflow-visible"
          @click="openPackageTypeModal"
        >
          <li
            v-for="type in parsedAvailablePackageTypes"
            :key="type.shortName"
            class="flex items-center flex-1 mr-2 lg:mr-4"
          >
            <span class="package-category" :class="type.shortName"></span>
            <span class="text-xs font-black whitespace-nowrap lg:text-xs">{{
              type.fullName
            }}</span>
          </li>
        </ul>
      </div>
      <div
        v-for="packageType in getAvailablePackageType"
        :key="'list-' + packageType.shortName"
      >
        <div
          v-if="isDesktop"
          class="flex flex-col items-center my-2 lg:flex-row lg:my-8"
        >
          <h4 class="text-lg text-left lg:text-sm ma0 package-section-name">
            {{ packageType.fullName }}
          </h4>
          <div class="w-full mt-2 text-sm lg:text-sm lg:mt-0">
            {{ packageType.tagLine }}
          </div>
        </div>

        <div class="mt-4 section-wrapper lg:mt-6">
          <PackageCardList
            :class="
              packageType.shortName === 'hah'
                ? 'delivery-package'
                : 'dine-in-package'
            "
            :type="packageType.shortName"
          >
            <div
              v-for="packageData in packageType.packages"
              :key="packageData.id"
            >
              <RestaurantPackageCard :packages="packageData" />
            </div>
          </PackageCardList>
        </div>
      </div>

      <div class="mt-4 lg:mt-6">
        <div v-for="packages in alaCartePackages" :key="packages.id">
          <RestaurantPackageCard :packages="packages" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { packageTypeFullName, packageTagLine } from "@/helper/PackageHelper";
import { PACKAGE_CODE_HAH } from "@/lib/constant";
import useLazyImport from "@/composable/useLazyImport";
let PackageTypeModal = "";

export default {
  components: {
    PackageCardList: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "RestaurantPageChunk" */ "@/components/Package/PackageCardList.vue"
        )
      ),
    RestaurantPackageCard: () =>
      useLazyImport(() =>
        import(
          /* webpackChunkName: "RestaurantPageChunk" */ "./RestaurantPackagesCard.vue"
        )
      ),
  },
  computed: {
    ...mapState("webConfig", ["config"]),
    ...mapState("bookingPackage", ["packages"]),
    ...mapGetters("bookingPackage", ["getPackageByType"]),
    ...mapState("restaurant", ["availablePackageTypes"]),
    ...mapGetters("inventorySummary", [
      "getInventorySummaries",
      "getSortPackages",
    ]),
    isLoading() {
      return this.$store.state.restaurantPackages.isLoading;
    },
    dummyPackageCardCount() {
      return this.isDesktop ? 3 : 2;
    },
    parsedAvailablePackageTypes() {
      const lang = this.$store.state.lang;
      return this.availablePackageTypes.map((type) => {
        return {
          shortName: type,
          fullName: packageTypeFullName(type),
          tagLine: packageTagLine(type, lang),
        };
      });
    },
    alaCartePackages() {
      return this.packages.filter(
        (packages) =>
          packages.isAlaCarte && packages.typeCode === PACKAGE_CODE_HAH
      );
    },
    getAvailablePackageType() {
      return this.parsedAvailablePackageTypes.map((type) => {
        let objSortPackage = {};
        let packageListByType = this.getPackageByType([type.shortName]).filter(
          (packages) => !packages.isAlaCarte
        );

        this.$store.dispatch(
          "inventorySummary/comparePackagesWithInvSummaries",
          {
            packages: packageListByType,
            limitedSeats: this.config.limitedSeatsShowing,
          }
        );
        if (this.getSortPackages.length) {
          packageListByType = this.getSortPackages;
        }

        objSortPackage = {
          ...type,
          packages: packageListByType,
        };

        return objSortPackage;
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.loadPackageTypeModal();
    });
  },
  methods: {
    loadPackageTypeModal() {
      if (PackageTypeModal || this.isDesktop) {
        return;
      }
      import(
        /* webpackChunkName: "RestaurantPageChunk" */ "./RestaurantPackageTypeModal"
      )
        .then((component) => {
          PackageTypeModal = component.default;
        })
        .catch(() => {});
    },
    openPackageTypeModal() {
      this.$modal.show(
        PackageTypeModal,
        {
          packageTypes: this.parsedAvailablePackageTypes,
        },
        { name: "PackageTypeModal", height: "auto", width: "90%" }
      );
    },
  },
};
</script>

<style>
.package-section-name {
  width: 100%;
}

@screen lg {
  .package-section-name {
    width: 500px;
  }
}

.section-wrapper {
  box-shadow: 0 3px 8px 5px #eee;
}
</style>
