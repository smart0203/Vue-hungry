<template>
  <div>
    <div
      class="flex items-center justify-center py-2 text-sm bg-white"
      style="color: #79c3ff"
    >
      <img src="@/assets/icon-clock-blue.png"  loading="lazy" alt="icon clock" />
      <countdown
        :key="timerId"
        :time="countDown"
        :transform="countDownTransform"
        emit-events
        class="mx-3 lg:mx-2"
        @end="onEnd"
      >
        <template slot-scope="props">
          <span class="ml-1 text-xl font-bold lg:text-lg">{{
            `${props.minutes}:${props.seconds}`
          }}</span>
        </template>
      </countdown>
      <button
        :disabled="isLoading"
        style="background-color: #79c3ff"
        class="flex items-center px-3 py-2 text-base font-bold leading-7 text-white rounded-lg hover:opacity-75 lg:text-sm"
        @click="$emit('on-extend-click')"
      >
        <div v-if="isLoading" class="loader small white"></div>
        {{ $t("needMoreTime") }}
      </button>
    </div>
  </div>
</template>

<script>
import useLazyImport from "@/composable/useLazyImport";
import { nanoid } from "nanoid";

export default {
  name: "BookingTimeOutWarninig",
  components: {
    countdown: () => useLazyImport(() => import("@chenfengyuan/vue-countdown")),
  },
  props: {
    expiryDate: {
      type: String,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      timerId: nanoid(4),
    };
  },
  computed: {
    countDown() {
      const now = this.$dayjs().utc();
      const different = this.$dayjs(this.expiryDate).diff(now, "seconds");
      return different > 0 ? different * 1000 : 0;
    },
  },
  watch: {
    isLoading(val) {
      if (val === false) {
        this.rerenderTimer();
      }
    },
  },
  methods: {
    rerenderTimer() {
      this.timerId = nanoid(4);
    },
    countDownTransform(props) {
      Object.entries(props).forEach(([key, value]) => {
        const digits = value < 10 ? `0${value}` : value;
        props[key] = `${digits}`;
      });

      return props;
    },
    onEnd() {
      this.$emit("on-time-out");
    },
  },
  i18n: {
    messages: {
      en: {
        needMoreTime: "I need more time",
      },
      th: {
        needMoreTime: "คลิกเพื่อต่อเวลา",
      },
    },
  },
};
</script>
