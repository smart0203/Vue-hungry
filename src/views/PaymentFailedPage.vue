<template>
  <div class="flex items-center justify-center h-screen">
    <div class="text-center">
      <img
        class="mx-auto mb-4"
        src="@/assets/icon-cancel-red-extra-big.png"
        alt="icon cancel"
         loading="lazy"
      />
      <div class="text-xl font-bold">Payment Failed!</div>
      <div>You have canceled your payment procedure</div>

      <button class="mt-8 text-blue-500" @click="backToHomePage">
        Back to homepage
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "PaymentFailedPage",
  methods: {
    backToHomePage() {
      window.location.href = process.env.VUE_APP_API_DOMAIN;
    },
  },
};
</script>
