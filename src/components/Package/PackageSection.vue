<template functional>
  <div class="package-section">
    <!-- menu section -->
    <div
      v-for="section in props.menuSections"
      :key="section.id"
      class="my-4 section lg:my-0"
    >
      <!-- section header -->
      <div class="relative section-header">
        <div class="hidden red-line lg:block"></div>
        <div
          class="flex flex-wrap items-center justify-center px-2 text-base font-black text-center section-name"
        >
          <span class="mr-1 bg-white lg:flex-shrink-0 text-red-dark">{{
            section.name
          }}</span>
          <div v-if="props.isAlaCarte == false" class="flex lg:flex-shrink-0">
            <span
              v-if="props.isSelectedPackage"
              class="mr-1 font-black text-red-dark tr"
              >{{ section.getTotalSelectedMenu() }}/{{
                section.quantityLimit * props.quantity
              }}</span
            >
            <span class="text-red-dark"
              >({{
                props.textLabel.selectPortionsLabel(
                  section.quantityLimit,
                  props.quantity
                )
              }}
              )</span
            >
          </div>
        </div>
      </div>
      <!-- section body -->
      <div class="px-2 pt-2 mx-auto lg:px-0 lg:py-6 section-body lg:w-full">
        <div class="flex flex-wrap pb-2 lg:px-2">
          <!-- menu -->
          <div
            v-for="menu in section.menus"
            :key="menu.id"
            class="w-full pr-2 mb-3 lg:w-1/3 lg:mb-4 menu lg:pr-4"
          >
            <button
              class="block w-full h-full cursor-pointer menu-item hh-soft-shadow"
              :class="[
                menu.quantity && menu.quantity > 0
                  ? ' border-red-dark border-2'
                  : '',
                !menu.active ? 'inactive' : null,
              ]"
              @click="menu.active ? props.menuClickCallback(menu, section) : ''"
            >
              <!-- menu name side by side with image -->
              <div class="flex h-full">
                <div v-if="menu.isShowImage()" class="flex-shrink-0 menu-image">
                  <!-- menu image -->
                  <HhImage
                    class="block mx-auto bg-gray-300 rounded-sm menu-image"
                    :img="menu.getImage()"
                    fallback="@/assets/default-menu-image.png"
                    alt="menu image"
                    :width="isDesktop ? 100 : 110"
                    :height="isDesktop ? 100 : 110"
                    :desktop-width="100"
                    :desktop-height="100"
                    :mobile-width="110"
                    :mobile-height="110"
                  />
                </div>
                <div
                  class="flex flex-col justify-between w-full p-3 lg:order-first"
                >
                  <!-- menu name & quantity -->
                  <div class="flex">
                    <!-- menu quantity -->
                    <span
                      v-if="menu.quantity"
                      class="mr-1 text-sm font-bold text-red-dark"
                      >{{ `x${menu.quantity}` }}</span
                    >
                    <!-- menu name -->
                    <span
                      class="mr-2 text-sm font-bold text-left lg:text-sm menu-name"
                    >
                      {{ menu.name }}
                    </span>
                  </div>

                  <!-- menu not available label -->
                  <div
                    v-if="menu.active === false"
                    class="text-xs text-left text-blue-500 capitalize"
                  >
                    {{ props.textLabel.notAvailable }}
                  </div>

                  <!-- menu description -->
                  <div
                    v-if="props.showDescription"
                    class="mt-2 text-xs font-light text-left"
                  >
                    {{ menu.description }}
                  </div>

                  <!-- menu price & menu custom label -->
                  <div class="flex">
                    <span
                      v-if="menu.price && props.isShowMenuPrice"
                      class="mt-1 mr-1 text-sm font-bold text-left lg:text-xs"
                    >
                      {{ props.textLabel.priceFormatter(menu.price) }}
                    </span>
                    <!-- custome label badge -->
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
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- top selected menu icon -->
    <div v-if="props.allCustomLabels.length" class="mb-2 text-center">
      <div
        class="flex items-center justify-center mx-auto mb-2 text-xs text-red-dark"
      >
        <div
          v-for="(customLabel, index) in props.allCustomLabels"
          :key="index"
          class="flex items-center mr-4"
        >
          <HhImage
            :img="customLabel.iconUrl"
            :alt="customLabel.name"
            :desktop-width="20"
            :desktop-height="20"
            :mobile-width="20"
            :mobile-height="20"
            style="width: 12px; height: 12px"
          />
          <span class="ml-2 text-sm">{{ customLabel.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isAlaCarte: {
      type: Boolean,
      default: false,
    },
    quantity: {
      type: Number,
      required: true,
    },
    menuSections: {
      type: Array,
      default: () => {
        return [];
      },
    },
    allCustomLabels: {
      type: Array,
      default: () => {
        return [];
      },
    },
    isSelectedPackage: {
      type: Boolean,
      default: false,
    },
    menuClickCallback: {
      type: Function,
      required: true,
    },
    textLabel: {
      type: Object,
      required: true,
    },
    isShowMenuPrice: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss">
.package-section {
  .menu-item {
    &:hover {
      box-shadow: 0 4px 20px #848484;
    }

    &.inactive {
      filter: opacity(33%);

      &:hover {
        box-shadow: none;
        cursor: not-allowed;
      }
    }
  }

  .menu-name {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .menu-quantity {
    width: 25px;
    height: 25px;
  }

  .quantity-button:hover {
    opacity: 0.5;
  }

  .section-header {
    .red-line {
      width: 100%;
      height: 2px;
      background-color: #df252a;
    }

    @screen lg {
      .section-name {
        position: absolute;
        left: 50%;
        top: -12px;
        background: white;
        transform: translateX(-50%);
      }
    }
  }

  .menu-image {
    height: 110px;

    @screen lg {
      height: 100px;
    }
  }
}
</style>
