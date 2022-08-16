<template>
  <div class="py-2 bg-white rounded lg:py-4 hh-soft-shadow">
    <div class="flex items-center mx-4 lg:pb-4 text-red-dark">
      <div>
        <img src="@/assets/icon-mask-red.png"  loading="lazy" width="32" alt="icon mask" />
      </div>
      <div class="ml-4 font-black">{{ $t("covidSafetyMeasure") }}</div>
    </div>
    <ul class="flex mx-4 list-none lg:flex-col">
      <li
        class="flex flex-col items-center flex-1 mb-2 text-sm lg:justify-between lg:flex-row"
      >
        <span class="flex h-full">{{ $t("socialDistancing") }}</span>
        <div class="flex items-center justify-center mt-1 lg:m-0">
          <span class="font-bold">{{ socialDistancing }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            fill="currentColor"
            class="inline ml-1 icon-star-fill text-red-dark"
            viewBox="0 0 16 16"
          >
            <path
              d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
            />
          </svg>
        </div>
      </li>
      <li
        class="flex flex-col items-center flex-1 mb-2 text-sm lg:justify-between lg:flex-row"
      >
        <span class="flex h-full">{{ $t("overallCleanliness") }}</span>
        <div class="flex items-center justify-center mt-1 lg:m-0">
          <span class="font-bold">{{ overallCleanliness }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            fill="currentColor"
            class="inline ml-1 icon-star-fill text-red-dark"
            viewBox="0 0 16 16"
          >
            <path
              d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
            />
          </svg>
        </div>
      </li>
      <li
        class="flex flex-col items-center justify-between flex-1 mb-2 text-sm lg:flex-row"
      >
        <span class="text-center lg:text-left">{{
          $t("staffProtection")
        }}</span>
        <div class="flex items-center justify-center mt-1 lg:m-0">
          <span class="font-bold">{{ staffProtection }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            fill="currentColor"
            class="inline ml-1 icon-star-fill text-red-dark"
            viewBox="0 0 16 16"
          >
            <path
              d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
            />
          </svg>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    socialDistancing: {
      required: true,
    },
    overallCleanliness: {
      required: true,
    },
    staffProtection: {
      required: true,
    },
  },
};
</script>

<i18n>
{
  "en": {
    "covidSafetyMeasure": "Covid-19 Safety Measure",
    "socialDistancing": "Social Distancing",
    "overallCleanliness": "Overall Cleanliness",
    "staffProtection": "Staff Protection"
  },
  "th": {
    "covidSafetyMeasure": "มาตรการความปลอดภัย Covid-19",
    "socialDistancing": "การเว้นระยะห่าง",
    "overallCleanliness": "ความสะอาดโดยรวม",
    "staffProtection": "พนักงานมีการป้องกันที่ถูกต้อง"
  }
}
</i18n>
