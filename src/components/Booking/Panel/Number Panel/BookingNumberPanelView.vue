<template>
  <div class="flex flex-col flex-grow">
    <div class="flex-grow w-11/12 mx-auto">
      <h4 class="my-6 text-lg font-black text-center lg:my-3">
        {{ $t("numberOfAdult") }}
      </h4>
      <div class="flex flex-wrap">
        <div
          v-for="(n, index) in adults"
          :key="index"
          class="w-1/5 mb-6 lg:mb-3"
        >
          <button
            :id="`adult-selection-${n}`"
            class="block mx-auto text-lg border-none rounded-full cursor-pointer hover:bg-red-dark hover:text-white"
            :class="
              selectedAdult === n
                ? 'bg-red-dark text-white'
                : 'bg-white text-black'
            "
            style="height: 30px; width: 30px"
            @click="$emit('on-select-adult', n)"
          >
            {{ n }}
          </button>
        </div>
      </div>
      <div class="flex justify-between mx-2 mt-2">
        <button
          v-if="isShowBigGroupButton"
          id="go-to-big-group-panel-button"
          class="p-2 text-sm font-black uppercase bg-white border rounded-full cursor-pointer border-red-dark text-red-dark hover:bg-red-dark hover:text-white"
          @click="$emit('on-big-group-clicked')"
        >
          {{ $t("moreThan", { count: bigGroupSize }) }}
        </button>
        <button
          v-if="isShowKidsButton"
          id="add-kids-button"
          class="p-2 text-sm font-black bg-white border-none rounded-full cursor-pointer text-red-dark hover-bg-light-gray"
          @click="$emit('on-show-kids-toggled')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="inline mr-1 icon-plus"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
            />
          </svg>
          {{ $t("haveKids") }}
        </button>
      </div>
      <div
        v-if="isShowKids"
        class="flex items-center mx-2 mt-4 border-b border-gray-500 lg:mt-3"
      >
        <img
          src="@/assets/icon-user-red.png"
          width="20"
          height="20"
          loading="lazy"
          alt="user icon"
        />
        <div class="w-full pl-2 capitalize">
          {{ kids }} {{ $tc("kids", kids) }}
        </div>
        <div class="flex text-base font-black lg:text-xl">
          <span
            class="block px-2 cursor-pointer hover:bg-gray-300 lg:mr0"
            @click="$emit('on-kids-increased')"
            >+</span
          >
          <span
            class="block px-2 cursor-pointer hover:bg-gray-300"
            @click="$emit('on-kids-decreased')"
          >
            -</span
          >
        </div>
      </div>
    </div>
    <!-- book button -->
    <div
      class="sticky bottom-0 flex items-center justify-center py-2 mt-24 bg-white border-t"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        fill="currentColor"
        class="mx-4 cursor-pointer icon-chevron-left text-red-dark hover:text-red-light"
        viewBox="0 0 16 16"
        @click="$emit('on-back-clicked')"
      >
        <path
          fill-rule="evenodd"
          d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
        />
      </svg>
      <button
        id="confirm-adult-button"
        class="w-3/4 py-2 text-base font-black text-white uppercase rounded-full"
        :class="
          disabledButton
            ? 'bg-gray-light cursor-not-allowed'
            : 'bg-red-dark hover:bg-red-light cursor-pointer'
        "
        :disabled="disabledButton"
        @click="$emit('on-confirm-clicked')"
      >
        {{ $t("next") }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    adults: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
    kids: {
      type: Number,
      required: true,
      default() {
        return 1;
      },
    },
    selectedAdult: {
      type: Number,
      required: true,
    },
    isShowKids: {
      type: Boolean,
      default: false,
    },
    bigGroupSize: {
      type: Number,
      required: true,
    },
    isShowBigGroupButton: {
      type: Boolean,
      default: true,
    },
    disabledButton: {
      type: Boolean,
      default: true,
    },
    isShowKidsButton: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
<i18n>
{
  "en": {
    "numberOfAdult": "Select Number Of Adults",
    "moreThan": "MORE THAN {count}",
    "haveKids": "HAVE KIDS"
  },
  "th": {
    "numberOfAdult": "ระบุจำนวนคน",
    "moreThan": "มากกว่า {count} คน",
    "haveKids": "เพิ่มเด็ก"
  }
}
</i18n>
