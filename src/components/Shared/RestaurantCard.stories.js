import RestaurantCard from "./RestaurantCard.vue";

export default { title: "Restaurant card" };
export const asAComponent = () => ({
  components: { RestaurantCard },
  template: "<RestaurantCard/>",
});
