<template functional>
  <div class="package-type-section">
    <div
      class="mt-2 text-sm font-black text-center capitalize lg:text-xl lg:mt-4"
      :class="
        props.isLoading
          ? 'bg-gray-300  h-3 lg:h-6 w-5/12 lg:w-1/12 lg:mx-auto mr-auto text-gray-300'
          : ''
      "
    >
      {{ !props.isLoading ? props.textLabel.packageTypeSectionTitle : "" }}
    </div>
    <div
      class="mb-2 text-xs text-center capitalize lg:text-lg lg:mb-6 lg:block"
      :class="
        props.isLoading
          ? 'bg-gray-300  h-3 lg:h-6 w-7/12 lg:w-4/12 lg:mx-auto mr-auto text-gray-300 mt-2'
          : null
      "
    >
      {{ !props.isLoading ? props.textLabel.packageTypeSectionSubTitle : "" }}
    </div>
    <div class="relative mt-4">
      <div class="">
        <div class="flex mb-8 overflow-x-scroll">
          <div
            v-for="(type, index) in props.packageType"
            :key="type.id"
            class="flex-grow w-1/3 mr-4"
            :class="props.isLoading ? 'is-loading' : null"
          >
            <a
              :href="props.buildLink(type.packageTypeCode)"
              class="brand-item"
              @click.prevent="props.goToLink(index, type)"
            >
              <div class="rounded-full circle">
                <div class="block">
                  <hh-image
                    v-if="!props.isLoading && type.coverImg"
                    :is-lazy="false"
                    :img="type.coverImg"
                    :desktop-width="400"
                    :desktop-height="400"
                    :mobile-height="400"
                    :mobile-width="400"
                    :width="200"
                    :height="200"
                  />
                </div>
              </div>
              <div
                class="flex flex-col items-center justify-center text-xs lg:text-sm"
              >
                <div
                  class="label"
                  :class="
                    props.isLoading
                      ? ' bg-gray-300 text-gray-300  w-20 h-4 mb-2'
                      : null
                  "
                >
                  {{ type.title }}
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    packageType: {
      type: Array,
      required: true,
    },
    buildLink: {
      type: Function,
      required: true,
    },
    goToLink: {
      type: Function,
      required: true,
    },
    textLabel: {
      type: Object,
      required: true,
    },
  },
};
</script>
