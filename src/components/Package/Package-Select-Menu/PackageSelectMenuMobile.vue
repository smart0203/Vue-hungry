<template>
  <div>
    <portal to="bottom-sheet">
      <div>
        <div v-if="isShowMenuImage && toggleBottomSheet" class="menu-image">
          <HhImage
            class="block w-full h-full bg-gray-300 rounded-sm"
            :img="menuImage"
            fallback="@/assets/default-menu-image.png"
            alt="menu image"
            height="218"
            width="350"
            :mobile-width="'full-screen'"
            :mobile-height="218"
            @click.native="onMenuImageClicked"
          />
        </div>
        <div class="mx-4 my-4">
          <div class="flex flex-col justify-between">
            <div class="flex w-full">
              <span class="flex-grow mr-2 text-lg font-black">{{
                menuName
              }}</span>
              <span
                v-if="menuPrice && isAllowShowPrice"
                class="text-lg font-black text-right"
                >{{ $money(menuPrice) }}</span
              >
            </div>
            <div class="flex mt-1 mb-2">
              <span
                v-if="!isHaveSubSections"
                class="flex-grow mr-2 text-xs font-light"
              >
                {{ menuDescription }}
              </span>

              <div class="flex-shrink-0">
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
                      :img="menu.customLabel.iconUrl"
                      alt="menu custom label"
                      class="menu-custom-label"
                      :desktop-width="10"
                      :desktop-height="10"
                      :mobile-width="10"
                      :mobile-height="10"
                      disable-retina
                      width="10"
                      height="10"
                    />
                  </div>
                  <span
                    class="ml-1 capitalize leading-2 text-2xs text-red-dark"
                    >{{ menu.customLabel.name }}</span
                  >
                </div>
              </div>
            </div>
            <div class="flex flex-col mt-1 mb-2">
              <!-- sub section -->
              <div
                v-if="isHaveSubSections"
                class="px-3 py-2 overflow-y-scroll"
                style="max-height: calc(100vh * 0.3)"
              >
                <div
                  v-for="(
                    subSectionGroup, subSectionGroupOrder
                  ) in subSectionGroups"
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
                      @click="
                        toggleAccordion(`${subSection.id}-${subSectionOrder}`)
                      "
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
                              selectSubMenu(
                                subSectionGroupOrder,
                                subSectionOrder
                              )
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
            </div>
            <div v-if="isHaveSubSections" class="flex flex-col mt-1 mb-2">
              <span class="flex-grow mr-2 text-xs font-light">
                {{ menuDescription }}
              </span>

              <!-- sub section -->
              <div
                class="px-3 py-2 overflow-y-scroll"
                style="max-height: calc(100vh * 0.3)"
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
                      @click="
                        toggleAccordion(`${subSection.id}-${subSectionOrder}`)
                      "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        fill="currentColor"
                        stroke="currentColor"
                        class="inline mr-1 transition-all duration-300 ease-in-out transform icon-chevron-right"
                        :class="
                          isAccordionClose(
                            `${subSection.id}-${subSectionOrder}`
                          )
                            ? ' rotate-0'
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
                          ? 'max-height: 0px'
                          : 'max-height: 1000px; '
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
            </div>
          </div>

          <!-- <div v-if="false" class="mt-2 mb-6">
            <button
              v-if="!isShowInputInstruction"
              class="flex items-center text-sm text-red-dark"
              :class="`${menuName}-add-special-instruction-button`"
              @click="isShowInputInstruction = true"
            >
              <div class="mr-4">
                <img
                  src="@/assets/icon-plus-red.png"
                  width="13"
                  height="13"
                  loading="lazy"
                  alt="icon plus"
                />
              </div>
              {{ $t("addSpecialInstruction") }}
            </button>

            <div v-else class="py-3 font-black">
              <span class="block mb-4"
                >{{ $t("specialInstruction") }}
                <small class="font-thin text-gray-500">(optional)</small></span
              >

              <textarea
                rows="4"
                class="w-full p-2 text-sm bg-gray-200 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-red-dark"
              ></textarea>
            </div>
          </div> -->

          <div class="flex px-2 mb-6">
            <div class="flex items-center justify-between w-full mr-6">
              <button
                :data-name="`${menuName}-decrease-button`"
                style="width: 24px; height: 24px"
                class="flex items-center justify-center w-full ml-2 text-xl font-bold text-white border-none rounded-full cursor-pointer decrease-menu-quantity-button"
                :disabled="disableDecreaseQuantityButton"
                :class="
                  disableDecreaseQuantityButton
                    ? ' bg-gray-300'
                    : ' bg-red-dark'
                "
                @click="decreaseMenuQuantity"
              >
                -
              </button>
              <span>{{ menu.quantity === undefined ? 1 : menu.quantity }}</span>
              <button
                :data-name="`${menuName}-increase-button`"
                style="width: 24px; height: 24px"
                class="flex items-center justify-center w-full mr-2 text-xl font-bold text-white border-none rounded-full cursor-pointer increase-menu-quantity-button"
                :class="
                  disableIncreaseQuantityButton
                    ? ' bg-gray-300'
                    : ' bg-red-dark'
                "
                :disabled="disableIncreaseQuantityButton"
                @click="increaseMenuQuantity"
              >
                +
              </button>
            </div>

            <button
              :data-name="`${menuName}-apply-button`"
              class="flex-grow flex-shrink-0 w-7/12 py-3 leading-5 text-white capitalize rounded-md"
              :class="disabledApplyQuantity ? ' bg-gray-300' : ' bg-red-dark'"
              :disabled="disabledApplyQuantity"
              @click="onApplyClicked"
            >
              {{ buttonText }}
            </button>
          </div>
          <!-- max quota warning -->
          <div
            v-if="noRemainingQuantity && packageQuantity"
            class="mt-2 text-xs text-center text-red-dark"
          >
            {{ `*${$t("reachMaximumOrder")}*` }}
          </div>
        </div>
      </div>
    </portal>

    <component
      :is="modalComponent"
      :section-name="sectionName"
      :menu="menu"
      :is-allow-show-price="isAllowShowPrice"
      @on-closed="onModalClosed"
    />
  </div>
</template>

<script>
import packageSelectMenuMixin from "./packageSelectMenuMixin";
import { isOpen as toggleBottomSheet } from "@/components/Common/BottomSheet/bottomSheet";
export default {
  name: "PackageSelectMenuMobile",
  mixins: [packageSelectMenuMixin],
  setup() {
    return {
      toggleBottomSheet,
    };
  },
  data() {
    return {
      saveState: false,
      isShowInputInstruction: false,
    };
  },
  created() {
    this.loadModalComponent();
  },
  methods: {
    onApplyClicked() {
      this.apply();
      this.toggleBottomSheet = false;
    },
    onMenuImageClicked() {
      this.saveState = true;
      this.toggleBottomSheet = false;
      this.toggleModal();
    },
    onModalClosed() {
      this.saveState = false;
    },
  },
};
</script>

<style scoped>
.menu-image {
  height: 218px;
}
</style>
