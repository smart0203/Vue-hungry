<template>
  <div class="pending-payment-card-shadow">
    <div class="flex justify-between p-3 text-sm">
      <div>
        <div
          class="mb-3 font-black"
          :class="isLoading ? ' bg-gray-400 text-gray-400' : null"
        >
          {{ restaurantName }}
        </div>
        <div :class="isLoading ? ' bg-gray-400 text-gray-400' : null">
          {{ bookingDate }} {{ bookingTime ? `at ${bookingTime}` : "" }}
          {{ bookingPax ? `for ${bookingPax} people` : "" }}
        </div>
      </div>

      <div class="flex flex-col justify-between">
        <button
          class="block w-full px-2 mb-3 text-xs font-black leading-5 capitalize border rounded-full"
          :class="
            isLoading
              ? ' bg-gray-400 text-gray-400 border-gray-400'
              : 'bg-red-dark border-red-dark text-white'
          "
          @click="$emit('on-pay-clicked')"
        >
          {{ "Pay" }}
        </button>

        <button
          class="block w-full px-2 text-xs font-black leading-5 capitalize border rounded-full"
          :class="
            isLoading
              ? ' bg-gray-400 text-gray-400 border-gray-400'
              : 'bg-red-dark border-red-dark text-white'
          "
          @click="$emit('on-cancel-clicked')"
        >
          {{ "Cancel" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PendingPayment",
  props: {
    restaurantName: {
      type: String,
      required: true,
    },
    bookingTime: {
      type: String,
      required: true,
    },
    bookingDate: {
      type: String,
      required: true,
    },
    bookingPax: {
      type: Number,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style scoped>
.pending-payment-card-shadow {
  box-shadow: -1px 3px 6px rgba(0, 0, 0, 0.160784);
  border-radius: 6px;
}
</style>
