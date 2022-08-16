<template>
  <div>
    <VoucherFlow
      :title="voucherFlowTitle"
      :pre-select-custom-vouchers="selectedCustomVouchers"
      :is-show-restaurant-package="showRestaurantPackage"
      @on-back-clicked="backHandler"
    />
  </div>
</template>

<script>
import {
  ROUTE_VOUCHER_PAGE,
  ROUTE_RESTAURANT_PAGE,
  HUNGRY_HUB_VOUCHER,
} from "@/lib/constant";
import useQueryString from "@/composable/useQueryString";
import { computed, onMounted, ref } from "@vue/composition-api";
import useLazyImport from "@/composable/useLazyImport";
let self;
export default {
  name: "BuyVoucherPage",
  components: {
    VoucherFlow: () =>
      useLazyImport(() =>
        import(
          "@/components/Page Component/Restaurant/RestaurantVoucherFlow.vue"
        )
      ),
  },
  props: {
    restaurantName: {
      type: String,
      default: HUNGRY_HUB_VOUCHER,
    },
  },
  setup(props) {
    const { removeQueryString, parsedQueryString } = useQueryString();
    const selectedCustomVouchers = ref([]);

    const { selectedAmount } = parsedQueryString;

    const showRestaurantPackage = computed(() => {
      return props.restaurantName !== HUNGRY_HUB_VOUCHER;
    });

    if (selectedAmount) {
      selectedCustomVouchers.value = [selectedAmount];
    }

    onMounted(() => {
      removeQueryString("selectedAmount");
    });

    function backHandler() {
      if (props.restaurantName === HUNGRY_HUB_VOUCHER) {
        self.$router.push({ name: ROUTE_VOUCHER_PAGE });
      } else {
        self.$router.push({
          name: ROUTE_RESTAURANT_PAGE,
          params: { restaurantName: props.restaurantName },
        });
      }
    }

    return {
      showRestaurantPackage,
      backHandler,
      selectedCustomVouchers,
    };
  },
  computed: {
    voucherFlowTitle() {
      return (
        this.$store.state?.restaurant?.restaurantName || "Hungry Hub Gift Card"
      );
    },
  },
  created() {
    self = this;
  },
  metaInfo() {
    return {
      title: "Buy Hungry Hub Gift Card",
    };
  },
};
</script>
