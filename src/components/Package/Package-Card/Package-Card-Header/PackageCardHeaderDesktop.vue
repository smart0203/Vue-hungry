<template functional>
  <div class="flex package-header">
    <div class="w-full">
      <div
        class="flex justify-between px-2 py-3"
        :class="!props.isPackageBodyShow ? 'border-b border-gray-400' : ''"
      >
        <!-- column -->
        <div
          class="flex flex-col justify-between w-6/12 pr-4 lg:w-4/12 lg:pr-0"
        >
          <div class="flex items-center">
            <div class="text-sm font-black text-gray-900 lg:text-sm">
              <span>{{ props.name }}</span>
              <span
                v-if="props.customPrice"
                class="ml-1 text-sm text-red-dark"
                >{{ props.customPrice }}</span
              >
              <!-- custom labels icon -->
              <slot name="custom-labels"></slot>
            </div>
          </div>

          <!-- column -->
          <div class="flex items-center py-2">
            <div v-if="props.packagePerPackRule" class="flex items-center mr-2">
              <span>
                <img
                  src="@/assets/icon-people-single-red.png"
                  alt="icon people"
                  width="20"
                  loading="lazy"
                  height="20"
                />
              </span>
              <span class="ml-1 text-xs text-red-dark">{{
                `${props.textLabel.perPackRule} ${props.textLabel.people}`
              }}</span>
            </div>

            <div v-if="props.packageCourseRule" class="flex items-center mr-2">
              <span>
                <img
                  src="@/assets/icon-course-red.png"
                  alt="icon course"
                  width="20"
                  loading="lazy"
                  height="20"
                />
              </span>
              <span class="ml-1 text-xs text-red-dark">{{
                `${props.packageCourseRule} ${props.textLabel.course}`
              }}</span>
            </div>

            <div
              v-if="props.freeDeliveryRadius"
              class="flex items-center mr-2 text-xs"
            >
              <span>
                <img
                  src="@/assets/icon-delivery-man-red.png"
                  alt="icon delivery man"
                  width="20"
                  loading="lazy"
                  height="20"
                />
              </span>
              <span class="ml-1 text-xs text-red-dark">
                {{ props.freeDeliveryRadius }} KM Free!</span
              >
            </div>

            <div
              v-if="!props.preferShowVoucherIcon && props.isAcceptVoucher"
              class="flex items-center mr-2 text-xs"
            >
              <span>
                <HhImage
                  :img="'@/assets/ic_use_voucher.png'"
                  :fallback="'@/assets/ic_use_voucher.png'"
                  is-local-image
                  style="width: 20px"
                />
              </span>
              <span class="ml-1 text-xs text-red-dark">
                {{ props.textLabel.acceptsVoucher }}</span
              >
            </div>
          </div>

          <div class="flex flex-col mb-2 lg:items-center lg:flex-row">
            <div v-if="props.showViewMenuButton" class="my-2 lg:my-0">
              <span
                class="p-1 mt-2 text-xs border rounded-full cursor-pointer fw5 border-red-dark text-red-dark lg:text-xs"
                @click="props.clickHandler.viewMenuHandler"
              >
                <svg
                  v-if="props.viewMenu"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="inline icon-chevron-up"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
                  />
                </svg>

                <svg
                  v-if="!props.viewMenu"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="inline icon-chevron-down"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                  />
                </svg>
                <span class="pr-1">{{ props.textLabel.viewMenu }}</span>
              </span>
            </div>
          </div>
        </div>
        <!-- column -->
        <div class="flex flex-col justify-start description-column">
          <div
            class="pr-3 text-xs text-gray-700 lg:text-xs lh-title description-column-inner"
          >
            <HHTextTruncate :text="props.description" :max-length="145" />
          </div>
        </div>

        <div class="flex flex-col lg:flex-row">
          <!-- column -->
          <div
            v-if="props.allowShowPrice"
            class="relative text-base price-column"
          >
            <slot name="pricing-list"></slot>
            <div
              v-if="
                !props.isMultiplePrice ||
                (props.isMultiplePrice && !props.isPackageBodyShow)
              "
              class="mt-1 text-xs leading-3 text-center text-gray-700 lg:whitespace-nowrap lg:text-2xs lg:text-left"
              v-html="
                `${
                  props.isPrebook
                    ? props.textLabel.preBook
                    : props.textLabel.validUntil
                }`
              "
            ></div>
            <div
              v-if="props.isMultiplePrice && props.isPackageBodyShow"
              class="absolute right-0 w-full mt-2"
            >
              <slot name="pricing-list"></slot>
              <div class="text-sm text-gray-700 whitespace-nowrap lg:text-2xs">
                {{ `${props.textLabel.validUntil}` }}
              </div>
            </div>
          </div>
          <!-- column -->
          <div class="flex flex-col items-center button-column">
            <div class="button-column-inner">
              <!-- addon label -->
              <div :class="props.isAddon ? 'opacity-100' : 'opacity-0'">
                <slot name="addon-label"></slot>
              </div>
              <template v-if="props.isButtonShow">
                <!-- order button -->
                <button
                  v-if="props.isSelectedPackage == false"
                  class="w-full py-1 font-black leading-normal text-white capitalize border-none rounded-lg cursor-pointer package-header-shadow lg:text-sm select-package-button"
                  :class="[
                    props.isHahPackage ? 'order-button' : 'book-button',
                    `select-package-${props.textLabel.parsedName}`,
                    props.textLabel.parsedBookButtonText.disabled
                      ? 'bg-gray'
                      : 'bg-red-dark hover:bg-red-light active:bg-red-light',
                  ]"
                  :disabled="
                    props.textLabel.parsedBookButtonText.disabled ? true : false
                  "
                  @click="props.clickHandler.packageSelectedHandler"
                >
                  {{ props.textLabel.parsedBookButtonText.value }}
                </button>
                <!-- increase,decrease button -->
                <div
                  v-if="props.isSelectedPackage && props.isAcceptManyQuantity"
                  class="flex items-center justify-center w-full mx-auto font-black leading-normal text-white border-none rounded package-header-shadow"
                >
                  <span
                    class="w-1/3 py-1 text-center cursor-pointer hover:bg-red-light active:bg-red-light bg-red-dark decrease-quantity-button"
                    @click="props.clickHandler.packageDecreasedHandler"
                    >-</span
                  >
                  <span class="w-1/3 py-1 text-center bg-red-dark">{{
                    props.packageQuantity
                  }}</span>
                  <span
                    class="w-1/3 py-1 text-center cursor-pointer hover:bg-red-light active:bg-red-light bg-red-dark add-quantity-button"
                    @click="props.clickHandler.packageIncreasedHandler"
                    >+</span
                  >
                </div>
                <!-- selected -->
                <div
                  v-if="
                    props.isSelectedPackage &&
                    props.isAcceptManyQuantity == false
                  "
                  class="w-full py-1 font-black leading-normal text-center capitalize border rounded-lg cursor-default package-header-shadow border-red-dark text-red-dark lg:text-sm"
                >
                  {{ props.textLabel.selected }}
                </div>
              </template>
            </div>
            <span
              v-if="props.textLabel.parsedBookButtonText.message !== null"
              class="text-red-dark font-bold text-xs text-center mt-2"
              >{{ props.textLabel.parsedBookButtonText.message }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import props from "./PackageCardHeaderProps";
export default {
  name: "PackageCardHeaderDesktop",
  props: {
    ...props,
    clickHandler: {
      type: Object,
      required: true,
    },
    textLabel: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.package-header {
  .price-column {
    width: 120px;
  }

  .description-column {
    width: 325px;
  }

  .button-column {
    width: 120px;
  }

  .button-column-inner {
    width: 90px;
  }
}

.bg-gray {
  background-color: rgb(156 163 175);
}
</style>
