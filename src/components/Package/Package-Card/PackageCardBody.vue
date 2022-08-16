<template>
  <div class="border-b border-gray-400 package-card-body">
    <div class="flex w-full">
      <div class="w-full">
        <slot></slot>
        <div
          v-if="!isAlaCarte"
          class="flex items-center justify-center mx-auto mt-2 mb-4"
        >
          <button
            id="close-package-detail-button"
            class="py-1 pl-2 pr-3 text-sm font-black bg-white border rounded-lg cursor-pointer border-red-dark text-red-dark lg:text-sm"
            @click="$emit('on-close-menu-clicked')"
          >
            <svg
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
            {{ $t("closeDetail") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    typeCode: {
      type: String,
      required: true,
    },
    isAlaCarte: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<i18n>
{
  "en": {
    "closeDetail": "Close Details"
  },
  "th": {
    "closeDetail": "ปิด"
  }
}
</i18n>
