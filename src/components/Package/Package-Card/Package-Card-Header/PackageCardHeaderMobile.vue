<template functional>
  <div class="flex package-header">
    <div
      class="w-full px-4 py-3"
      :class="!props.isPackageBodyShow ? 'border-b border-gray-400' : ''"
    >
      <div class="relative flex">
        <!-- column -->
        <div class="flex flex-col w-full mr-2">
          <div class="">
            <span class="text-sm font-black text-gray-900">
              {{ props.name }}
            </span>
            <span
              v-if="props.customPrice"
              class="ml-1 text-sm font-black text-red-dark"
              >{{ props.customPrice }}</span
            >
            <!-- custom labels icon -->
            <slot name="custom-labels"></slot>
          </div>
          <div v-if="!props.viewMenu" class="flex items-center my-1 flex-wrap">
            <div
              v-if="props.packagePerPackRule"
              class="flex items-center mr-2 h-8"
            >
              <span class="flex-shrink-0">
                <img
                  src="@/assets/icon-people-single-red.png"
                  alt="icon people"
                  width="20"
                  height="20"
                  loading="lazy"
                />
              </span>
              <span class="ml-1 text-xs text-red-dark whitespace-nowrap">{{
                `${props.textLabel.perPackRule} ${props.textLabel.people}`
              }}</span>
            </div>
            <div
              v-if="props.packageCourseRule"
              class="flex items-center mr-2 h-8"
            >
              <span class="flex-shrink-0 ml-2 lg:ml-0">
                <img
                  src="@/assets/icon-course-red.png"
                  alt="icon course"
                  width="20"
                  height="20"
                  loading="lazy"
                />
              </span>
              <span class="ml-1 text-xs text-red-dark whitespace-nowrap">{{
                `${props.packageCourseRule} ${props.textLabel.course}`
              }}</span>
            </div>
            <div
              v-if="props.freeDeliveryRadius"
              class="flex items-center justify-center text-xs h-8"
            >
              <span>
                <img
                  src="@/assets/icon-delivery-man-red.png"
                  alt="icon delivery man"
                  width="20"
                  height="20"
                  loading="lazy"
                />
              </span>
              <span class="ml-1 text-xs text-red-dark">
                {{ props.freeDeliveryRadius }} KM Free!</span
              >
            </div>
            <div
              v-if="!props.preferShowVoucherIcon && props.isAcceptVoucher"
              class="flex items-center mr-2 text-xs h-8"
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
          <div class="flex items-start h-full">
            <div class="mt-2 mr-2 text-xs text-gray-700 lh-title">
              {{ props.description }}
            </div>
            <!-- price -->
            <div
              v-if="props.allowShowPrice"
              class="flex flex-col items-end text-right price-column"
            >
              <slot name="pricing-list"></slot>
              <div
                class="mb-2 text-gray-700 whitespace-nowrap text-2xs"
                v-html="
                  `${
                    props.isPrebook
                      ? props.textLabel.preBook
                      : props.textLabel.validUntil
                  }`
                "
              ></div>
              <!-- addon badge -->
              <slot v-if="props.isAddon" name="addon-label"></slot>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-between mt-2">
        <div
          v-if="props.showViewMenuButton"
          class="flex flex-grow items-center"
        >
          <div class="flex-shrink-0 lg:flex-grow">
            <span
              class="inline-block p-1 text-xs border rounded-full cursor-pointer lg:px-2 border-red-dark text-red-dark"
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
          <span
            v-if="!props.viewMenu"
            class="flex items-center mx-auto ml-2 mr-auto lg:items-start lg:ml-2 lg:mr-2 lg:flex-col"
          >
            <div v-if="props.packagePerPackRule" class="flex">
              <span class="flex-shrink-0">
                <img
                  src="@/assets/icon-people-single-red.png"
                  alt="icon people"
                  width="20"
                  loading="lazy"
                  height="20"
                />
              </span>
              <span class="ml-1 text-xs text-red-dark whitespace-nowrap">{{
                `${props.textLabel.perPackRule} ${props.textLabel.people}`
              }}</span>
            </div>
            <div v-if="props.packageCourseRule" class="flex items-center">
              <span class="flex-shrink-0 ml-2 lg:ml-0">
                <img
                  src="@/assets/icon-course-red.png"
                  alt="icon course"
                  width="20"
                  height="20"
                  loading="lazy"
                />
              </span>
              <span class="ml-1 text-xs text-red-dark whitespace-nowrap">{{
                `${props.packageCourseRule} ${props.textLabel.course}`
              }}</span>
            </div>
            <div
              v-if="props.freeDeliveryRadius"
              class="flex items-center justify-center ml-2 text-xs"
            >
              <span>
                <img
                  src="@/assets/icon-delivery-man-red.png"
                  alt="icon delivery man"
                  width="20"
                  height="20"
                  loading="lazy"
                />
              </span>
              <span class="ml-1 text-xs text-red-dark">
                {{ props.freeDeliveryRadius }}
                !</span
              >
            </div>
          </span>
          <a
            v-if="props.viewMenu && props.tnc"
            target="_blank"
            :href="props.tnc"
            class="inline-block p-1 px-2 ml-2 text-xs capitalize truncate border rounded-full cursor-pointer border-red-dark text-red-dark"
            >{{ props.textLabel.termAndCondition }}
          </a>
        </div>
        <div v-if="props.isButtonShow" class="flex flex-col justify-center">
          <span
            v-if="props.textLabel.parsedBookButtonText.message !== null"
            class="text-red-dark font-bold text-2xs text-center mb-1"
            >{{ props.textLabel.parsedBookButtonText.message }}</span
          >
          <div class="flex flex-col">
            <div class="flex justify-end">
              <!-- order now button -->
              <button
                v-if="props.isSelectedPackage === false"
                class="py-1 text-sm font-black leading-normal text-white capitalize border-none rounded package-header-shadow select-package-button"
                style="width: 90px"
                :class="[
                  props.isHahPackage ? 'order-button' : 'book-button',
                  `select-package-${props.textLabel.parsedName}`,
                  props.textLabel.parsedBookButtonText.disabled
                    ? 'bg-gray'
                    : 'bg-red-dark',
                ]"
                :disabled="
                  props.textLabel.parsedBookButtonText.disabled ? true : false
                "
                @click="props.clickHandler.packageSelectedHandler"
              >
                {{ props.textLabel.parsedBookButtonText.value }}
              </button>
              <!-- add button , minus button -->
              <button
                v-else-if="
                  props.isSelectedPackage && props.isAcceptManyQuantity
                "
                style="width: 90px"
                class="flex items-center justify-center w-10/12 text-white rounded-lg bg-red-dark"
              >
                <span
                  class="flex-auto text-xl font-black text-white rounded-lg bg-red-dark decrease-quantity-button active:bg-red-light"
                  @click="props.clickHandler.packageDecreasedHandler"
                >
                  -
                </span>
                <span>{{ props.packageQuantity }}</span>
                <span
                  class="flex-auto text-xl font-black text-white rounded-lg bg-red-dark increase-quantity-button active:bg-red-light"
                  @click="props.clickHandler.packageIncreasedHandler"
                >
                  +
                </span>
              </button>
              <!-- selected  -->
              <div
                v-else-if="
                  props.isSelectedPackage && props.isAcceptManyQuantity == false
                "
                class="py-1 text-sm font-black leading-normal text-center capitalize bg-white border rounded package-header-shadow text-red-dark border-red-dark"
                style="width: 90px"
              >
                {{ props.textLabel.selected }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import props from "./PackageCardHeaderProps";
export default {
  name: "PackageCardHeaderMobile",
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
.bg-gray {
  background-color: rgb(156 163 175);
}
</style>
