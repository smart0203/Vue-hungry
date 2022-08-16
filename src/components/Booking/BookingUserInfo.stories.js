import BookingUserInfo from "./BookingUserInfo.vue";

export default { title: "User Info" };
export const asAComponent = () => ({
  components: { BookingUserInfo },
  template: "<BookingUserInfo/>",
});
