<template>
  <div>
    <!-- box menu selection section -->
    <div v-if="isSelectedPackage" class="flex items-center mb-2 ml-2">
      <button
        v-for="(box, key) in boxMenu"
        :key="key"
        class="flex items-center px-2 mr-2 text-sm leading-6 text-white rounded-full"
        :class="labelClass(box)"
      >
        <div @click="packages.changeActiveBox(box.id)">
          {{ makeLabel(box, key + 1) }}
        </div>

        <div @click="packages.removeBoxMenu(box.id)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            class="icon-close-svg"
            viewBox="0 0 16 16"
            stroke="currentColor"
          >
            >
            <path
              stroke-width="2"
              d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </div>
      </button>

      <!-- add another set -->
      <button
        v-if="packages.anyInvalidBoxMenu.value === false"
        class="flex items-center px-2 mr-2 text-sm leading-6 capitalize border rounded-full text-red-dark border-red-dark"
        @click="packages.increasePackageQuantity()"
      >
        <div>
          {{ $t("addAnotherSet") }}
        </div>
        <img
          src="@/assets/icon-plus-red.png"
          class="flex-shrink-0 ml-2"
          width="13"
          height="13"
          loading="lazy"
          alt="add icon"
        />
      </button>
    </div>
    <!-- menu section -->
    <div
      v-for="section in activeBox.menuSections"
      :key="section.id"
      class="section"
    >
      <!-- section header -->
      <div class="relative section-header">
        <div class="red-line"></div>
        <div
          class="flex flex-col items-center px-2 text-base font-black text-center lg:flex-row section-name"
          :class="isSelectedPackage ? 'text-red-dark' : 'text-black'"
        >
          <span class="lg:mr-1">{{ section.name }}</span>
          <small
            >({{
              $tc(
                "selectPortions",
                isSelectedPackage
                  ? section.totalQuantityLimit.value
                  : section.quantityLimit,
                {
                  count: isSelectedPackage
                    ? section.totalQuantityLimit.value
                    : section.quantityLimit,
                }
              )
            }}
            )</small
          >
        </div>
      </div>
      <!-- section body -->
      <div class="w-11/12 pt-10 mx-auto section-body lg:w-10/12">
        <div class="flex flex-wrap px-2 pb-2">
          <!-- menu -->
          <div
            v-for="menu in section.menus"
            :key="menu.id"
            class="w-1/3 mb-8 text-gray-700 lg:mb-4 menu lg:mr-3"
          >
            <div class="mr-2 cursor-pointer menu-item">
              <div class="relative menu-image">
                <HhImage
                  class="block mx-auto menu-image"
                  :img="menu.image.originalSize"
                  fallback="@/assets/default-menu-image.png"
                  alt="menu image"
                  :desktop-width="83"
                  :mobile-width="83"
                  @click.native="imageClickCallback(menu, section)"
                />
                <!-- custome label badge -->
                <div
                  v-if="menu.customLabel.iconUrl"
                  class="absolute"
                  style="top: -5px; right: 0"
                >
                  <HhImage
                    :img="menu.customLabel.iconUrl"
                    style="width: 20px; height: 20px"
                    alt="menu custom label"
                    class="menu-custom-label"
                    disable-retina
                  />
                </div>
              </div>
              <div class="mt-1 text-sm text-center lg:text-xs menu-name">
                <HHTextTruncate
                  :text="menu.name"
                  :max-length="40"
                  :can-read-more="false"
                />
              </div>
              <div
                v-if="parseFloat(menu.price) > 0"
                class="mt-1 text-sm text-center lg:text-xs"
              >
                {{ $money(menu.price) }}
              </div>
              <div class="flex items-center">
                <button
                  v-if="menu.quantity.value"
                  class="w-full text-xl bg-white border-none text-red-dark font-boldcursor-pointer decrease-menu-quantity-button"
                  @click="menu.decreaseMenuQuantity"
                >
                  <img
                    class="inline"
                    src="@/assets/icon-minus-red.png"
                    width="13"
                    height="13"
                    loading="lazy"
                    alt="icon minus"
                  />
                </button>
                <span
                  v-if="menu.quantity.value"
                  class="flex items-center justify-center flex-shrink-0 mx-auto text-white rounded-full bg-red-dark menu-quantity"
                  >{{ menu.quantity.value }}</span
                >
                <button
                  v-if="isSelectedPackage"
                  class="w-full text-xl bg-white border-none text-red-dark font-boldcursor-pointer increase-menu-quantity-button"
                  @click="menu.increaseMenuQuantity"
                >
                  <img
                    class="inline"
                    src="@/assets/icon-plus-red.png"
                    width="13"
                    loading="lazy"
                    height="13"
                    alt="icon plus"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- top selected menu icon -->
    <div v-if="allCustomLabels.length" class="mb-2 text-center">
      <div
        class="flex items-center justify-center mx-auto mb-2 text-xs text-red-dark"
      >
        <div
          v-for="(customLabel, index) in allCustomLabels"
          :key="index"
          class="flex items-center mr-4"
        >
          <img
            :src="customLabel.iconUrl"
            loading="lazy"
            :alt="customLabel.name"
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
  name: "PackageSectionMenuBox",
  props: {
    imageClickCallback: {
      type: Function,
      required: true,
    },
    allCustomLabels: {
      type: Array,
      required: false,
    },
    packages: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    activeBox() {
      return this.boxMenu.filter(
        (box) => box.id === this.packages.activeBox.value
      )[0];
    },
    boxMenu() {
      return this.packages.boxMenu.value;
    },
    isSelectedPackage() {
      return this.packages.quantity.value > 0;
    },
  },
  mounted() {
    this.getNumbro();
  },
  methods: {
    async getNumbro() {
      if (!window.numbro) {
        const module = await import("numbro");
        window.numbro = module.default;
      }
    },
    makeLabel(box, position = 1) {
      const ordinalPosition = () => {
        if (window.numbro) {
          return window.numbro(position).format({
            output: "ordinal",
          });
        }
        return position;
      };
      return `${ordinalPosition()} Set ${box.totalSelectedMenu.value}/${
        box.totalQuantityLimit.value
      }`;
    },
    labelClass(box) {
      if (box.isValid.value) {
        if (this.packages.activeBox.value === box.id) {
          return ["border", " border-green", "text-white", "bg-green"];
        } else {
          return ["border", " border-green", "text-green"];
        }
      } else {
        if (this.packages.activeBox.value === box.id) {
          return ["border", " border-red-dark", "text-white", "bg-red-dark"];
        } else {
          return ["border", " border-red-dark", "text-red-dark"];
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.menu-name {
  height: 35px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.menu-quantity {
  width: 25px;
  height: 25px;
}

.section-header {
  .red-line {
    width: 100%;
    height: 2px;
    background-color: #df252a;
  }

  .section-name {
    position: absolute;
    left: 50%;
    top: -18px;
    background: white;
    transform: translateX(-50%);
  }
}

.menu-image {
  height: 83px;
  border-radius: 14px;
}

@screen lg {
  .menu {
    width: 15%;
  }
}
</style>
