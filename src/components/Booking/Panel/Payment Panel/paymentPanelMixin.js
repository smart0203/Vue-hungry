import useLazyImport from "@/composable/useLazyImport";
export default {
  components: {
    BookingLastStep: () =>
      useLazyImport(() => import("@/components/Booking/BookingLastStep")),
  },
};
