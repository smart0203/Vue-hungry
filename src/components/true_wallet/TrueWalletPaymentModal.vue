<template>
  <portal :to="PORTAL_FOR_MODAL_SELECTOR">
    <modal
      name="true-wallet-payment-modal"
      :width="isDesktop ? '40%' : '100%'"
      height="auto"
      :click-to-close="true"
      adaptive
      scrollable
      @closed="onClosed"
    >
      <div :style="contentHeight">
        <div class="">
          <img
            class="mt-1 ml-1 cursor-pointer"
            src="@/assets/icon-close-black.png"
            width="15"
            height="15"
            alt="close icon"
            loading="lazy"
            @click="$modal.hide('true-wallet-payment-modal')"
          />
        </div>
        <iframe
          id="true-wallet-payment-iframe"
          class="w-full"
          :src="url"
          frameborder="0"
          style="height: 800px; min-width: 1px"
        >
        </iframe>
      </div>
    </modal>
  </portal>
</template>

<script>
import { mapGetters } from "vuex";
import { PORTAL_FOR_MODAL_SELECTOR } from "@/lib/constant";
import {
  initReservationRealtimeDB,
  deleteReservationRealtimeDBListener,
} from "@/composable/watchReservationStatus";

export default {
  props: {
    url: {
      type: String,
      required: true,
    },
    reservationId: {
      type: [String, Number],
      required: true,
    },
  },
  setup() {
    return {
      PORTAL_FOR_MODAL_SELECTOR,
    };
  },
  computed: {
    ...mapGetters("user", ["isUserSignedIn"]),
    contentHeight() {
      const height = this.isDesktop
        ? window.innerHeight * 0.8
        : window.innerHeight;
      return `height: ${height}px`;
    },
  },
  watch: {
    reservationId(newVal) {
      if (newVal && this.url && this.url.length) {
        deleteReservationRealtimeDBListener();
        initReservationRealtimeDB(newVal);
      }
    },
  },
  methods: {
    onClosed() {
      this.$emit("on-closed");
    },
  },
};
</script>
