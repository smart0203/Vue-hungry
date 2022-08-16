<template>
  <QRPayment
    :id="id"
    :restaurant-name="restaurantName"
    :title="title"
    :charge-amount="chargeAmount"
    :qr-codeurl="qrCodeURL"
    :qr-count-down="QRCodeCountDown"
    @on-timer-ended="back"
    @on-cancel="back"
  >
    <!-- selected package list -->
    <div
      v-for="pack in parsedSelectedPackages"
      :key="pack.id"
      class="flex mb-2"
    >
      <div class="flex flex-col flex-auto">
        <!-- adult price -->
        <div class="flex items-center adult-package-price">
          <div class="flex-auto text-gray-700">
            <span> {{ pack.adult.name }} </span>
            <template v-if="!pack.isAlaCarte">
              <span class="font-black">{{
                `X${
                  pack.adult.isAcceptManyQuantity ? pack.adult.quantity : adult
                }`
              }}</span>
              <span class="ml-1 font-black">{{
                `(${$money(pack.adult.priceRule.price)})`
              }}</span>
            </template>
          </div>
          <div class="text-base font-black text-red-dark">
            {{
              $money(pack.isAlaCarte ? pack.adult.price : pack.adult.totalPrice)
            }}
          </div>
        </div>
        <!-- kids price -->
        <div v-if="pack.kids" class="flex items-center kids-package-price">
          <div class="flex-auto text-gray-700">
            <span>
              {{ pack.kids.name }} ({{ pack.kids.priceRule.kidsPriceRate }}%)
            </span>
            <template v-if="!pack.isAlaCarte">
              <span class="font-black"
                >{{
                  `X${
                    pack.kids.isAcceptManyQuantity ? pack.kids.quantity : kids
                  }`
                }}
                {{ $tc("kids", kids) }}</span
              >
            </template>
          </div>
          <div class="text-base font-black text-red-dark">
            {{
              $money(pack.isAlaCarte ? pack.kids.price : pack.kids.totalPrice)
            }}
          </div>
        </div>
      </div>
    </div>
    <!-- delivery fee -->
    <div v-if="chargeObject.deliveryFee" class="flex mb-3">
      <div class="flex-auto">
        {{ $t("deliveryFee") }}
      </div>
      <div class="font-black text-red-dark">
        {{ $money(chargeObject.deliveryFee) }}
      </div>
    </div>
    <!-- applied voucher (if any) -->
    <div v-if="voucherApplied.length" class="flex flex-col mb-2">
      <div
        v-for="voucher in voucherApplied"
        :key="voucher.voucherCode"
        class="flex w-full mb-2"
      >
        <div class="flex-auto text-gray-700">
          <div>{{ `Voucher - ${voucher.voucherCode}` }}</div>
          <div>{{ voucher.name }}</div>
        </div>
        <div class="text-base font-black text-red-dark">
          {{ `-${$money(voucher.amount)}` }}
        </div>
      </div>
    </div>
    <!-- total prepaid -->
    <template v-if="isObject(chargeObject)">
      <div v-if="totalCharge" class="flex mb-3">
        <div class="flex-auto font-black capitalize">
          <span v-if="hasPrepayment">
            {{ isDineIn ? $t("totalPrepaidAmound") : $t("totalOrderValue") }}
          </span>
          <span v-else>
            {{ $t("totalPayAtRestaurant") }}
          </span>
          <span
            v-if="
              chargeObject.chargeAmountType === 'relative' &&
              chargeObject.chargePercent < 100
            "
          >
            {{ `(${chargeObject.chargePercent}%)` }}</span
          >
        </div>
        <div class="font-black text-red-dark">
          {{ $money(totalCharge) }}
        </div>
      </div>
      <div v-if="isDineIn && totalPayAtRestaurant" class="flex mb-3">
        <div class="flex-auto font-black capitalize">
          <span>
            {{ $t("totalPayAtRestaurant") }}
          </span>
        </div>
        <div class="font-black text-red-dark">
          {{ $money(totalPayAtRestaurant) }}
        </div>
      </div>
    </template>
  </QRPayment>
</template>

<script>
import { methods as realtimeQRMethods } from "@/composable/realtimeQRPaymentChecking";
import { state, computeds } from "@/components/Landing/landing";
import { packagePrice, packagePricingRule } from "@/helper/PackageHelper";
import isObject from "lodash-es/isObject";
import useLazyImport from "@/composable/useLazyImport";
export default {
  components: {
    QRPayment: () =>
      useLazyImport(() => import("@/components/qr_payment/QRPayment.vue")),
  },
  setup() {
    const {
      saveReservationId,
      saveReservationLandingURL,
      startReservationTimeOutChecker,
      startWatchQRPaymentStatus,
      saveReservationExpiredAt,
    } = realtimeQRMethods;
    return {
      saveReservationId,
      saveReservationLandingURL,
      startReservationTimeOutChecker,
      startWatchQRPaymentStatus,
      saveReservationExpiredAt,
      ...state,
      ...computeds,
    };
  },
  data() {
    return {
      qrCodeURL: "",
    };
  },
  computed: {
    expiredAt() {
      return this.$dayjs(this.qrPayment.qrCodeForPaymentExpiredAt).utc();
    },
    QRCodeCountDown() {
      const now = this.$dayjs().utc();
      const different = this.expiredAt.diff(now, "seconds");
      return different > 0 ? different * 1000 : 0;
    },
    id() {
      return this.originalId;
    },
    title() {
      if (this.isDineIn) {
        return this.$t("reservationId");
      }
      return this.$t("orderId");
    },
    parsedSelectedPackages() {
      return this.packages.map((packages) => {
        let kids = null;
        const totalPrice = packagePrice(
          { adult: this.adult, kids: this.kids },
          packages.rules,
          packages.quantity
        );
        const priceRule = packagePricingRule(
          { adult: this.adult, kids: this.kids },
          packages.rules
        );
        const adult = {
          priceRule: priceRule,
          totalPrice: totalPrice.adult,
          ...packages,
        };
        if (this.kids && !packages.isAcceptManyQuantity) {
          kids = {
            priceRule: priceRule,
            totalPrice: totalPrice.kids,
            ...packages,
          };
        }
        return {
          isAlaCarte: packages.isAlaCarte,
          adult,
          kids,
        };
      });
    },
  },
  mounted() {
    this.onMounted();
  },
  methods: {
    isObject,
    back() {
      this.$router.back();
    },
    async onMounted() {
      try {
        this.qrCodeURL =
          this.$store.state.baseUrl + this.qrPayment.qrCodeForPayment;
        this.saveReservationId(this.originalId);
        this.saveReservationLandingURL(window.location.href);
        this.saveReservationExpiredAt(this.expiredAt.toISOString());
        await this.startWatchQRPaymentStatus();
      } catch (err) {
        this.$rollbar.error(err);
      }
    },
  },
};
</script>
