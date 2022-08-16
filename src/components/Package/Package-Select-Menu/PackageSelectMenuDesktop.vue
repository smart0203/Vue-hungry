<template>
  <div>
    <portal to="restaurant-side-menu">
      <div class="mb-4">
        <HhImage
          v-if="isShowMenuImage && toggleRestaurantSideMenu"
          class="block mx-auto bg-gray-300 rounded-sm menu-image"
          :img="menuImage"
          fallback="@/assets/default-menu-image.png"
          alt="menu image"
          height="340"
          width="340"
          :desktop-width="330"
          :desktop-height="330"
          :mobile-width="83"
          :mobile-height="83"
          @click.native="toggleModal"
        />

        <div
          class="flex justify-between px-2 py-4 font-black border-b border-gray-300"
        >
          <div>
            <div class="flex">
              <span class="w-full">{{ menuName }}</span>
              <div class="flex-shrink-0 ml-2">
                <div
                  v-if="
                    menu.customLabel &&
                    menu.customLabel.iconUrl &&
                    menu.customLabel.name
                  "
                  class="flex items-center p-1 rounded-full bg-red-pink"
                >
                  <div class="flex-shrink-0">
                    <HhImage
                      :="menu.customLabel.iconUrl"
                      alt="menu custom label"
                      class="menu-custom-label"
                      :desktop-width="15"
                      :desktop-height="15"
                      :mobile-width="15"
                      :mobile-height="15"
                      disable-retina
                      width="15"
                      height="15"
                    />
                  </div>
                  <span
                    class="ml-1 capitalize leading-2 text-2xs text-red-dark"
                    >{{ menu.customLabel.name }}</span
                  >
                </div>
              </div>
            </div>
            <p class="text-sm font-light">{{ menuDescription }}</p>
          </div>
          <span v-if="menuPrice && isAllowShowPrice" class="ml-2">{{
            $money(menuPrice)
          }}</span>
        </div>

        <!-- sub section -->
        <div
          v-if="isHaveSubSections"
          class="px-3 py-2 overflow-y-scroll"
          style="max-height: calc(100vh - 550px)"
        >
          <div
            v-for="(subSectionGroup, portion) in subSectionGroups"
            :key="`${subSectionGroup.id}-${portion}`"
            class=""
          >
            <div
              v-for="(
                subSection, subSectionOrder
              ) in subSectionGroup.subSections"
              :key="`${subSection.id}-${subSectionOrder}-${portion}`"
            >
              <button
                @click="toggleAccordion(`${subSection.id}-${subSectionOrder}`)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  fill="currentColor"
                  stroke="currentColor"
                  class="inline mr-1 transition-all duration-300 ease-in-out transform icon-chevron-right"
                  :class="
                    isAccordionClose(`${subSection.id}-${subSectionOrder}`)
                      ? ' rotate-0 '
                      : ' rotate-90'
                  "
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    stroke-width="2"
                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                  />
                </svg>
                <span class="font-bold">{{ subSection.name }} </span>
                <span v-if="menu.quantity > 1" class="text-red-dark">
                  {{
                    $t("portion", {
                      order: `(${formatOrdinalNumber(portion + 1)})`,
                    })
                  }}
                </span>
              </button>
              <div
                style="transition: max-height 0.3s ease-out"
                class="ml-3 overflow-hidden"
                :style="
                  isAccordionClose(`${subSection.id}-${subSectionOrder}`)
                    ? 'max-height: 0px;'
                    : 'max-height: 1000px;'
                "
              >
                <div
                  v-for="subMenu in subSection.subMenus"
                  :key="`${subSection.id}-${subMenu.id}-${subSectionOrder}`"
                  class="flex my-2"
                >
                  <div class="mt-2 pretty p-default p-round">
                    <input
                      v-model="subSection.selected"
                      type="radio"
                      :name="`${subSection.id}-${subMenu.id}-${subSectionOrder}-portion-${portion}`"
                      :value="subMenu.id"
                      @change="selectSubMenu(portion, subSectionOrder)"
                    />
                    <div class="state p-danger-o">
                      <label>{{ subMenu.name }}</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- sub section -->
        <div
          v-if="isHaveSubSections"
          class="px-3 py-2 overflow-y-scroll"
          style="max-height: calc(100vh - 550px)"
        >
          <div
            v-for="(subSectionGroup, subSectionGroupOrder) in subSectionGroups"
            :key="`${subSectionGroup.groupId}-${subSectionGroupOrder}`"
            class=""
          >
            <div
              v-for="(
                subSection, subSectionOrder
              ) in subSectionGroup.subSections"
              :key="`${subSection.id}-${subSectionOrder}-${subSectionGroupOrder}`"
            >
              <button
                @click="toggleAccordion(`${subSection.id}-${subSectionOrder}`)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  fill="currentColor"
                  stroke="currentColor"
                  class="inline mr-1 transition-all duration-300 ease-in-out transform icon-chevron-right"
                  :class="
                    isAccordionOpen(`${subSection.id}-${subSectionOrder}`)
                      ? ' rotate-90'
                      : ' rotate-0'
                  "
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    stroke-width="2"
                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                  />
                </svg>
                <span class="font-bold">{{ subSection.name }} </span>
                <span v-if="menu.quantity > 1" class="text-red-dark">{{
                  `(${formatOrdinalNumber(subSectionOrder + 1)}) portion`
                }}</span>
              </button>
              <div
                style="transition: max-height 0.3s ease-out"
                class="ml-3 overflow-hidden"
                :style="
                  isAccordionOpen(`${subSection.id}-${subSectionOrder}`)
                    ? 'max-height: 1000px; '
                    : 'max-height: 0px'
                "
              >
                <div
                  v-for="subMenu in subSection.subMenus"
                  :key="`${subSection.id}-${subMenu.id}-${subSectionOrder}`"
                  class="flex my-2"
                >
                  <div class="mt-2 pretty p-default p-round">
                    <input
                      v-model="subSection.selected"
                      type="radio"
                      :name="`${subSection.id}-${subMenu.id}-${subSectionOrder}-portion-${subSectionOrder}`"
                      :value="subMenu.id"
                      @change="
                        selectSubMenu(subSectionGroupOrder, subSectionOrder)
                      "
                    />
                    <div class="state p-danger-o">
                      <label>{{ subMenu.name }}</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- <div v-if="false" class="px-2 pt-3 pb-6 font-black">
          <span class="block mb-4"
            >{{ $t("specialInstruction") }}
            <small class="font-thin text-gray-500">(optional)</small></span
          >

          <textarea
            rows="4"
            class="w-full p-2 text-sm bg-gray-200 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-red-dark"
          ></textarea>
        </div> -->

        <div class="flex px-2 pt-2">
          <div class="flex items-center justify-between">
            <button
              :data-name="`${menuName}-decrease-button`"
              style="width: 24px; height: 24px"
              class="flex items-center justify-center w-full ml-2 text-xl font-bold text-white border-none rounded-full cursor-pointer decrease-menu-quantity-button"
              :disabled="disableDecreaseQuantityButton"
              :class="
                disableDecreaseQuantityButton ? ' bg-gray-300' : ' bg-red-dark'
              "
              @click="decreaseMenuQuantity"
            >
              -
            </button>
            <span class="mx-6">{{
              menu.quantity === undefined ? 1 : menu.quantity
            }}</span>
            <button
              :data-name="`${menuName}-increase-button`"
              style="width: 24px; height: 24px"
              class="flex items-center justify-center w-full mr-2 text-xl font-bold text-white border-none rounded-full cursor-pointer increase-menu-quantity-button"
              :class="
                disableIncreaseQuantityButton ? ' bg-gray-300' : ' bg-red-dark'
              "
              :disabled="disableIncreaseQuantityButton"
              @click="increaseMenuQuantity"
            >
              +
            </button>
          </div>

          <div class="w-full ml-2">
            <button
              :data-name="`${menuName}-apply-button`"
              class="flex-grow flex-shrink-0 w-full py-3 leading-5 text-white capitalize rounded-md"
              :class="disabledApplyQuantity ? ' bg-gray-300' : ' bg-red-dark'"
              :disabled="disabledApplyQuantity"
              @click="onApplyClicked"
            >
              {{ buttonText }}
            </button>
          </div>
        </div>

        <!-- max quota warning -->
        <div
          v-if="noRemainingQuantity && packageQuantity"
          class="text-xs text-center text-red-dark"
        >
          {{ `*${$t("reachMaximumOrder")}*` }}
        </div>
      </div>
    </portal>
    <component
      :is="modalComponent"
      :section-name="sectionName"
      :menu="menu"
      :is-allow-show-price="isAllowShowPrice"
    />
  </div>
</template>

<script>
import { isOpen as toggleRestaurantSideMenu } from "@/components/Page Component/Restaurant/Restaurant-Side-Menu/restaurantSideMenu";
import packageSelectMenuMixin from "./packageSelectMenuMixin";
export default {
  name: "PackageSelectMenuDesktop",
  mixins: [packageSelectMenuMixin],
  setup() {
    return {
      toggleRestaurantSideMenu,
    };
  },
  created() {
    this.loadModalComponent();
  },
  methods: {
    onApplyClicked() {
      this.apply();
      this.toggleRestaurantSideMenu = false;
    },
  },
};
</script>
