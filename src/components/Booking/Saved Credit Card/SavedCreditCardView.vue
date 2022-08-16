<template>
  <div>
    <div class="mx-2">
      <div
        v-for="card in cards"
        :key="card.id"
        class="flex items-center px-2 mb-3 leading-normal border rounded-full cursor-pointer border-red-dark"
        @click="selectCard(card)"
      >
        <img
          v-if="card.type"
          :src="card.type"
           loading="lazy"
          style="width: 55px"
          class="lg:mx-3"
          alt="card type"
        />
        <div class="w-full text-sm">{{ card.number }}</div>
        <svg
          v-if="card.isSelected"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="icon-check-circle-fill text-red-dark"
          viewBox="0 0 16 16"
        >
          <path
            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
          />
        </svg>
      </div>
      <div class="flex items-center font-black text-red-dark">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="inline icon-plus"
          viewBox="0 0 16 16"
        >
          <path
            d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
          />
        </svg>
        <span>New Credit / Debit Card</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cards: {
      type: Array,
      required: true,
    },
    selectCard: {
      type: Function,
      required: true,
    },
  },
};
</script>

<style></style>
