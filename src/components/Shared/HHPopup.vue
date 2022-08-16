<template>
  <div class="inline">
    <div :class="contentElWrapper" class="hidden">
      <div
        v-if="showCloseButton"
        :class="closeButtonEl"
        class="text-black cursor-pointer"
      >
        <img
          src="@/assets/icon-close-black.png"
          width="15"
          height="15"
           loading="lazy"
          alt="close icon"
        />
      </div>
      <div :class="contentEl"></div>
      <slot></slot>
    </div>

    <portal :to="PORTAL_FOR_MODAL_SELECTOR">
      <div>
        <modal
          :name="modalName"
          :width="parsedModalWidth"
          height="auto"
          :click-to-close="closeOnBgClick"
          @closed="onClosed"
          @opened="onOpened"
        >
          <div :class="contentElWrapper">
            <div
              v-if="showCloseButton"
              :class="closeButtonEl"
              class="text-black"
            >
              <img
                class="mt-1 ml-1 cursor-pointer"
                src="@/assets/icon-close-black.png"
                width="15"
                 loading="lazy"
                height="15"
                alt="close icon"
                @click="closeModal"
              />
            </div>
            <div :class="contentEl"></div>
            <slot></slot>
          </div>
        </modal>
      </div>
    </portal>
  </div>
</template>

<script>
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import { nanoid } from "nanoid";
import { PORTAL_FOR_MODAL_SELECTOR } from "@/lib/constant";
const closeEventName = "on-closed";
const openedEventName = "on-opened";
export default {
  props: {
    activator: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    isTooltipDesktop: {
      type: Boolean,
      default: true,
    },
    isModalMobile: {
      type: Boolean,
      default: true,
    },
    isShow: {
      type: Boolean,
      default: false,
    },
    tooltipConfig: {
      type: Object,
    },
    modalWidth: {},
    showCloseButton: {
      type: Boolean,
      default: true,
    },
    closeOnBgClick: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      PORTAL_FOR_MODAL_SELECTOR,
      tooltip: [],
      tooltipContent: "",
      randomID: nanoid(10),
      activatorEl: "",
    };
  },
  computed: {
    modalName() {
      return `${this.name}-${this.randomID}-modal`;
    },
    parsedModalWidth() {
      if (this.modalWidth) {
        return this.modalWidth;
      }
      return !this.isTooltipDesktop ? "50%" : "80%";
    },
    contentElWrapper() {
      return `${this.name}-${this.randomID}-content-wrapper`;
    },
    contentEl() {
      return `${this.name}-${this.randomID}-content`;
    },
    closeButtonEl() {
      return `${this.name}-${this.randomID}-close-button`;
    },
  },
  watch: {
    isShow(newVal) {
      if (newVal === true) {
        this.show();
        return;
      }
      this.hide();
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initialize();
      if (this.isDesktop && this.isTooltipDesktop) {
        this.initTooltip();
      } else {
        if (!this.isModalMobile) {
          this.initTooltip();
          return;
        }
      }
    });
  },
  methods: {
    show() {
      if (this.isDesktop) {
        if (this.isTooltipDesktop) {
          this.showTooltip();
          return;
        }
        this.showModal();
      } else {
        if (!this.isModalMobile) {
          this.showTooltip();
          return;
        }
        this.showModal();
      }
    },
    hide() {
      if (this.isDesktop) {
        if (this.isTooltipDesktop) {
          this.closeTooltip();
          return;
        }
        this.closeModal();
      } else {
        if (!this.isModalMobile) {
          this.closeTooltip();
          return;
        }
        this.closeModal();
      }
    },
    showModal() {
      this.$modal.show(this.modalName);
    },
    closeModal() {
      this.$modal.hide(this.modalName);
      this.onClosed();
    },
    showTooltip() {
      if (this.tooltip && this.tooltip.length) {
        this.tooltip.forEach((tooltip) => {
          tooltip.show();
        });
      }
    },
    closeTooltip() {
      if (this.tooltip && this.tooltip.length) {
        this.tooltip.forEach((tooltip) => {
          tooltip.hide();
        });
        this.onClosed();
      }
    },
    initialize() {
      if (this.activator) {
        this.activatorEl = document.querySelectorAll(this.activator);
        if (this.activatorEl && this.activatorEl.length) {
          this.activatorEl.forEach((activator) => {
            activator.addEventListener("click", () => {
              this.show();
            });
          });
        }
      }
      const contentEl = document.querySelectorAll(`.${this.contentElWrapper}`);
      if (contentEl && contentEl.length) {
        this.tooltipContent = contentEl[0].innerHTML;
      }
    },
    initTooltip() {
      if (this.tooltip && this.tooltip.length === 0) {
        const defaultConfig = {
          zIndex: "40",
          theme: "white",
          content: this.tooltipContent,
          allowHTML: true,
          placement: "bottom-start",
          arrow: true,
          interactive: true,
          ignoreAttributes: true,
          trigger: "click mouseenter focus",
          onShown: () => {
            const close = document.querySelectorAll(`.${this.closeButtonEl}`);
            close.forEach((closeButton) => {
              closeButton.addEventListener("click", () => {
                this.closeTooltip();
              });
            });
          },
        };
        const mergedConfig = { ...defaultConfig, ...this.tooltipConfig };
        this.tooltip = tippy(this.activatorEl, mergedConfig);
      }
    },
    onClosed() {
      this.$emit(closeEventName);
    },
    onOpened() {
      this.$emit(openedEventName);
    },
  },
};
</script>
