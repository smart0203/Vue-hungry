<template>
  <SavedCreditCardProvider v-slot="{ cards, selectCard }">
    <SavedCreditCardView :cards="cards" :select-card="selectCard" />
  </SavedCreditCardProvider>
</template>

<script>
import SavedCreditCardProvider from "./SavedCreditCardProvider";
import SavedCreditCardView from "./SavedCreditCardView";
export default {
  components: {
    SavedCreditCardProvider,
    SavedCreditCardView,
  },
};
</script>

<style></style>
