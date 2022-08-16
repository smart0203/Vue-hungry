<template>
  <div class="inline root">
    <span v-if="allowHtml" class="inline" v-html="showedText"></span>
    <span v-else class="inline">{{ showedText }}</span>
    <span v-if="hiddenText">
      <template v-if="showReadMoreButton">
        <button
          v-if="!isShowHiddenText"
          class="ml-1 capitalize read-more text-red-light"
          @click="toggleHiddenText('show')"
        >
          {{ $t("readMore") }}
        </button>
        <span
          v-if="allowHtml"
          :class="hiddenTextClass"
          v-html="hiddenText"
        ></span>
        <span v-else :class="hiddenTextClass">{{ hiddenText }}</span>
        <button
          v-if="isShowHiddenText"
          class="ml-1 capitalize read-less text-red-light"
          @click="toggleHiddenText('hide')"
        >
          {{ $t("showLess") }}
        </button>
      </template>
      <template v-else>
        <span>{{ hiddenText }}</span>
      </template>
    </span>
  </div>
</template>

<script>
import { stripHtmlTag } from "@/helper/stringHelper";
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
    maxLength: {
      type: Number,
      required: true,
    },
    canReadMore: {
      type: Boolean,
      default: true,
    },
    allowHtml: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showedText: "",
      hiddenText: "",
      showReadMoreButton: false,
      isShowHiddenText: false,
    };
  },
  computed: {
    hiddenTextClass() {
      if (this.isShowHiddenText) {
        return "inline";
      }
      return "hidden";
    },
    valueToWatch() {
      if (this.text) {
        return `${this.text} | ${this.text.length} | ${this.maxLength}`;
      }
      return "";
    },
  },
  watch: {
    valueToWatch: {
      handler: "cutText",
      immediate: true,
    },
  },
  methods: {
    cutText() {
      this.clearCurrentData();
      if (this.text && this.text.length > this.maxLength) {
        let parsedText = !this.allowHtml ? stripHtmlTag(this.text) : this.text;
        this.showedText = parsedText.slice(0, this.maxLength);
        if (this.canReadMore) {
          this.hiddenText = parsedText.slice(this.maxLength);
          this.showReadMoreButton = true;
        } else {
          this.hiddenText = "...";
          this.showReadMoreButton = false;
        }
      } else {
        this.showReadMoreButton = false;
        this.showedText = this.text;
      }
    },
    clearCurrentData() {
      this.hiddenText = "";
      this.showedText = "";
    },
    toggleHiddenText(val) {
      if (val === "show") {
        this.isShowHiddenText = true;
      } else if (val === "hide") {
        this.isShowHiddenText = false;
      }
    },
  },
};
</script>
