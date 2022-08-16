<script>
import visaLogo from "@/assets/credit-card-visa.svg";
import masterCardLogo from "@/assets/credit-card-master-card.svg";
import jcbLogo from "@/assets/credit-card-jcb.svg";
import creditCardType from "credit-card-type";
export default {
  data() {
    return {
      cards: [
        { id: 1, number: "4111-1111-1111-1111", type: "", isSelected: false },
        { id: 2, number: "4111-1111-1111-1111", type: "", isSelected: false },
      ],
    };
  },
  mounted() {
    this.checkCreditCardType();
  },
  methods: {
    checkCreditCardType() {
      this.cards.forEach((card) => {
        const posibleCreditCardType = creditCardType(card.number);
        if (posibleCreditCardType.length > 0) {
          const firstIndex = posibleCreditCardType[0];
          // we only check these 3 brand logo (based on omise supported cc)
          if (firstIndex.type === "visa") {
            card.type = visaLogo;
          } else if (firstIndex.type === "mastercard") {
            card.type = masterCardLogo;
          } else if (firstIndex.type === "jcb") {
            card.type = jcbLogo;
          } else {
            card.type = "";
          }
        } else {
          card.type = "";
        }
      });
    },
    selectCard(card) {
      this.cards.forEach((card) => {
        card.isSelected = false;
      });
      card.isSelected = true;
    },
  },
  render() {
    return this.$scopedSlots.default({
      cards: this.cards,
      selectCard: this.selectCard,
    });
  },
};
</script>
