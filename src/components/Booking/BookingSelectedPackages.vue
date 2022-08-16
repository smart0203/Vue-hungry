<template>
  <div>
    <template v-if="getSelectedPackageType === 'hah'">
      <div class="">
        <div v-for="packages in getSelectedPackage" :key="packages.id">
          <!-- package name -->
          <div
            class="flex justify-between px-4 pt-2 pb-3 text-base font-black text-left border-b border-gray-400"
          >
            <div>
              {{ `${packages.name}` }}
              <span v-if="!packages.isAlaCarte" class="text-black"
                >x{{ packages.quantity }}
              </span>
            </div>
            <span
              v-if="!isValidCorporateEvent && !packages.isAlaCarte"
              class="text-red-dark"
              >{{ totalPrice(packages) }}
            </span>
          </div>
          <div v-if="showSelectedPackageSection" class="flex flex-col">
            <div
              v-for="section in getSections(packages.isAlaCarte, packages.id)"
              :key="section.id"
              class="flex flex-col w-full mb-1 overflow-hidden"
            >
              <!-- section name -->
              <button
                class="flex py-1 pb-1 text-xs text-left border-b border-gray-400 text-red-dark hover:underline"
                @click="toggleAccordion(section)"
              >
                <div class="flex-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="16"
                    fill="currentColor"
                    class="inline mr-1 transition-all duration-300 ease-in-out transform icon-chevron-down text-red-dark"
                    :class="section.isExpanded ? ' rotate-180' : ' rotate-0'"
                    viewBox="0 0 16 16"
                    stroke="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      stroke-width="1.5"
                      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                  <span class="font-black">{{ section.name }} </span>
                  <span
                    v-if="!packages.isAlaCarte"
                    class="font-black text-red-dark tr"
                    >{{ section.getTotalSelectedMenu() }}/{{
                      section.totalQuantityLimit
                    }}
                  </span>
                  <span v-if="!packages.isAlaCarte" class="ml-1"
                    >({{
                      $tc("selectPortions", section.totalQuantityLimit, {
                        count: section.totalQuantityLimit,
                      })
                    }})
                  </span>
                </div>
              </button>

              <!-- list of selected menu -->
              <div
                v-if="showSelectedPackageMenu"
                style="transition: max-height 0.3s ease-out"
                class="overflow-hidden"
                :style="
                  !section.isExpanded
                    ? 'max-height: 1000px; '
                    : 'max-height: 0px'
                "
              >
                <div
                  v-for="menu in section.getSelectedMenu()"
                  :key="menu.id"
                  class="flex px-4 pb-1 text-xs font-bold border-b border-gray-400 lg:text-xs"
                >
                  <div class="mr-1 font-bold text-right">
                    {{ `x${menu.quantity}` }}
                  </div>
                  <div class="flex-auto">
                    <div class="font-bold">
                      {{ menu.name }}
                    </div>
                    <!-- list of selected sub menu -->
                    <div v-if="menu.isHaveSubSections()" class="mt-1">
                      <div
                        v-for="(
                          subSectionGroup, portion
                        ) in menu.subSectionGroups"
                        :key="`${menu.name}-Portion-${portion}`"
                        :class="`${menu.name}-Portion-${portion} mb-2`"
                      >
                        <div class="font-bold">Portion {{ portion + 1 }}</div>
                        <div
                          v-for="subSection in subSectionGroup.subSections"
                          :key="`${menu.name}-${subSection.id}-Portion-${portion}`"
                          :class="`${menu.name}-${subSection.id}-Portion-${portion} mb-1`"
                        >
                          <div class="flex">
                            <span> {{ subSection.name }}</span>
                            <span class="mr-1"> : </span>
                            <span
                              v-for="subMenu in subSection.getSelectedSubMenus()"
                              :key="`${menu.name}-${subSection.id}-${subMenu.name}-Portion-${portion}`"
                            >
                              {{ `${subMenu.name} x${subMenu.quantity}` }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="menu.price && !isValidCorporateEvent">
                    {{
                      packages.isAlaCarte
                        ? $money(menu.price * menu.quantity)
                        : $money(menu.price)
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <PackageCardList
        class="selected-packages-shadow"
        :type="getSelectedPackageType"
      >
        <div v-for="packages in getSelectedPackage" :key="packages.id">
          <BookingPackageCard
            :adult="adult"
            :show-version="version"
            :packages="packages"
            :is-button-show="isButtonShow"
            :prefer-show-voucher-icon="preferShowVoucherIcon"
          />
        </div>
      </PackageCardList>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { isValid as isValidCorporateEvent } from "@/composable/corporateEvent";
import useLazyImport from "@/composable/useLazyImport";
export default {
  components: {
    PackageCardList: () =>
      useLazyImport(() => import("@/components/Package/PackageCardList")),
    BookingPackageCard: () =>
      useLazyImport(() => import("@/components/Booking/BookingPackageCard")),
  },
  props: {
    showSelectedPackageSection: {
      type: Boolean,
      default: true,
    },
    showSelectedPackageMenu: {
      type: Boolean,
      default: true,
    },
    preferShowVoucherIcon: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    return {
      isValidCorporateEvent,
    };
  },
  computed: {
    ...mapState("booking", ["adult"]),
    ...mapState("bookingPackage", ["packages"]),
    ...mapGetters("bookingPackage", [
      "getSelectedPackage",
      "getSelectedPackageType",
      "isSelectedPackagesAcceptMultipleQuantity",
      "getSelectedMenuSectionsInPackage",
    ]),
    version() {
      return "mobile";
    },
    isButtonShow() {
      return this.isSelectedPackagesAcceptMultipleQuantity;
    },
  },
  methods: {
    getSections(isAlacarte, packageId) {
      const pack = this.packages.filter((pack) => pack.id === packageId);
      let section = [];
      if (pack.length) {
        if (isAlacarte) {
          section = pack[0].getSectionsWithSelectedMenus();
        } else {
          section = pack[0].getSections();
        }
      }
      return section;
    },
    totalPrice(packages) {
      const isAlaCarte = packages.isAlaCarte;
      if (isAlaCarte) {
        let total = 0;
        const sections = this.getSelectedMenuSectionsInPackage(packages.id);
        sections.forEach((section) => {
          section.menus.forEach((menuId) => {
            const menu = this.$store.state.bookingPackage.menus[menuId];
            if (menu.quantity) {
              total += menu.price * menu.quantity;
            }
          });
        });
        return this.$money(total);
      }
      const price = packages.rules[0].price;
      const replaceComma = price.replace(",", "");
      const computedPrice = parseFloat(replaceComma) * packages.quantity;
      return this.$money(computedPrice);
    },
    toggleAccordion(section) {
      if (!section.isExpanded) {
        this.$set(section, "isExpanded", true);
        return;
      }
      section.isExpanded = !section.isExpanded;
    },
  },
};
</script>
