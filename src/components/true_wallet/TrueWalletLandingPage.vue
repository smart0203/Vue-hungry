<template>
  <div class="text-center max-width">
    <div class="flex">
      <div>
        <img src="@/assets/success-true-wallet.png" alt="" />
      </div>
      <div v-if="isDesktop">
        <img src="@/assets/success-true-wallet.png"  loading="lazy" alt="" />
      </div>
    </div>
    <div class="relative font-black content">
      <h1 class="text-5xl font-black text-red-dark">Congrats!</h1>
      <h2 class="my-8 text-xl font-black">Your payment confirmed</h2>
      <img class="mx-auto mb-8"  loading="lazy" src="@/assets/icon-check-red-big.png" alt="" />
      <div class="mb-2">
        Booking ID : <span class="text-red-dark">{{ bookingId }}</span>
      </div>
      <div>
        Total : <span class="text-red-dark">{{ $money(amount) }}</span>
      </div>
      <button
        v-if="isDesktop"
        class="w-2/12 py-2 mt-10 mb-5 font-black capitalize border rounded-full text-red-dark border-red-dark"
        @click="onCloseClicked"
      >
        {{ $t("close") }}
      </button>
    </div>
    <button
      v-if="isMobile"
      class="w-9/12 py-2 mt-10 mb-5 font-black capitalize border rounded-full text-red-dark border-red-dark"
      @click="onCloseClicked"
    >
      {{ $t("close") }}
    </button>
  </div>
</template>

<script>
export default {
  name: "TrueWalletLandingPage",
  props: {
    amount: {
      required: true,
    },
    bookingId: {
      type: String,
      required: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  top: -100px;

  @screen lg {
    top: -170px;
  }
}
</style>
