<template>
  <div
    class="flex flex-col items-center w-11/12 mx-auto md:flex-row lg:py-16 lg:w-3/4"
  >
    <!-- left -->
    <div class="w-full mt-6 md:mt-0 md:w-2/6">
      <!-- restaurant name -->
      <div class="mb-4 text-lg font-black text-center lg:mb-4 lg:text-xl">
        {{ restaurantName }}
      </div>
      <div class="flex justify-between my-2 font-extrabold lg:my-4">
        <div class="text-base lg:text-xl">
          <span class="text-red-dark">{{ idTitle }} :</span>
          <span class="ml-1">{{ originalId }}</span>
        </div>
        <div class="text-base lg:text-xl">{{ $money(chargeAmount) }}</div>
      </div>
      <div
        v-if="!qrCodeURL"
        class="flex items-center justify-center w-full capitalize bg-gray-300"
        style="min-height: 300px"
      >
        <div class="mr-2 loader small"></div>
        {{ $t("loading") }}
      </div>
      <div v-else>
        <img :src="qrCodeURL" loading="lazy" alt="QR Payment" />
      </div>

      <div class="mb-2 text-sm text-center lg:mt-4 lg:text-base text-red-dark">
        *{{ $t("qrExpiredWithin") }}
      </div>
      <div class="p-2 text-center">
        <countdown
          :time="QRCodeCountDown"
          :transform="countDownTransform"
          emit-events
          @end="timerEnded"
        >
          <template slot-scope="props">
            <span
              class="px-2 py-2 text-xl font-extrabold rounded-full text-red-dark lg:text-2xl"
              style="background: #fcdede"
              >{{ `${props.minutes}:${props.seconds}` }}</span
            >
          </template>
        </countdown>
      </div>
      <button
        v-if="isDesktop"
        id="reload-qr-button"
        class="block px-4 py-1 mx-auto my-2 text-sm text-white uppercase rounded-full bg-red-dark lg:py-2 lg:px-4 lg:my-4 hover:bg-red-light lg:text-base"
        @click="reloadQr"
      >
        {{ $t("reloadQr") }}
      </button>

      <div v-if="isMobile" class="w-5/6 mx-auto">
        <!-- helper text -->
        <ol class="mt-2 ml-4 text-sm list-decimal">
          <li class="mb-1">{{ $t("instruction1") }}</li>
          <li class="mb-1">{{ $t("instruction2") }}</li>
          <li class="mb-1">{{ $t("instruction3") }}</li>
        </ol>

        <div class="mx-4 my-4 text-sm font-semibold">
          <span class="text-red-dark">*</span>
          {{ $t("highLoadWarning") }}
        </div>
        <!-- cancel button & reload qr button -->
        <div class="flex items-center justify-center">
          <button
            id="reload-qr-button"
            class="block px-4 py-2 my-2 mr-4 text-sm font-black uppercase border rounded-full text-red-dark border-red-dark"
            @click="reloadQr"
          >
            {{ $t("reloadQr") }}
          </button>
          <button
            id="cancel-qr-button"
            class="block px-4 py-2 my-2 text-sm font-black uppercase capitalize border rounded-full text-red-dark border-red-dark"
            @click="back"
          >
            {{ $t("cancel") }}
          </button>
        </div>
      </div>
    </div>
    <!-- right column -->
    <div v-if="isDesktop" class="w-full p-2 shadow-xl md:w-4/6 lg:shadow-none">
      <div class="lg:w-3/4 lg:mx-auto">
        <!-- Summary Charged title -->
        <div class="flex items-center mb-4">
          <span
            class="flex items-center justify-center w-8 h-8 text-lg text-white rounded-full bg-red-dark lg:h-10 lg:w-10 lg:text-2xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="inline icon-check-circle-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
              />
            </svg>
          </span>
          <span class="ml-2 text-lg font-extrabold capitalize lg:text-2xl">
            {{ $t("chargeSummary") }}
          </span>
        </div>

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
                  <span
                    class="font-black"
                    :class="pack.adult.customNetPrice ? ' text-red-dark' : ''"
                    >{{
                      pack.adult.customNetPrice ||
                      `(${$money(pack.adult.priceRule.price)})`
                    }}</span
                  >
                  <span class="ml-1 font-black">{{
                    `X${
                      pack.adult.isAcceptManyQuantity
                        ? pack.adult.quantity
                        : adult
                    }`
                  }}</span>
                </template>
              </div>
              <div class="text-base font-black text-red-dark">
                {{
                  $money(
                    pack.isAlaCarte ? pack.adult.price : pack.adult.totalPrice
                  )
                }}
              </div>
            </div>
            <!-- kids price -->
            <div v-if="pack.kids" class="flex items-center kids-package-price">
              <div class="flex-auto text-gray-700">
                <span>
                  {{ pack.kids.name }}
                  <span class="font-bold"
                    >({{
                      pack.kids.useKidsPrice
                        ? pack.kids.highestPrice
                        : pack.kids.priceRule.price
                    }})</span
                  >
                </span>
                <template v-if="!pack.isAlaCarte">
                  <span class="font-black"
                    >{{
                      `X${
                        pack.kids.isAcceptManyQuantity
                          ? pack.kids.quantity
                          : kids
                      }`
                    }}
                    {{ $tc("kids", kids) }}</span
                  >
                </template>
              </div>
              <div class="text-base font-black text-red-dark">
                {{
                  $money(
                    pack.isAlaCarte ? pack.kids.price : pack.kids.totalPrice
                  )
                }}
              </div>
            </div>
          </div>
        </div>
        <!-- delivery fee -->
        <div v-if="chargeObject.originalDeliveryFee" class="flex mb-3">
          <div class="flex-auto">
            {{ $t("deliveryFee") }}
          </div>
          <div class="font-black text-red-dark">
            {{ $money(chargeObject.originalDeliveryFee) }}
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
                {{
                  isDineIn ? $t("totalPrepaidAmound") : $t("totalOrderValue")
                }}
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
        <!-- helper text -->
        <div>
          <ol class="mt-6 ml-4 text-sm list-decimal lg:text-base">
            <li class="mb-2">{{ $t("instruction1") }}</li>
            <li class="mb-2">{{ $t("instruction2") }}</li>
            <li class="mb-2">{{ $t("instruction3") }}</li>
          </ol>

          <div class="mx-4 mt-4 font-semibold">
            <span class="text-red-dark">*</span>
            {{ $t("highLoadWarning") }}
          </div>
        </div>
        <!-- cancel button -->
        <div class="mt-6">
          <button
            id="cancel-qr-button"
            class="px-6 py-2 font-black uppercase border rounded-full text-red-dark border-red-dark hover:bg-red-dark hover:text-white"
            @click="back"
          >
            {{ $t("cancel") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { state, computeds } from "@/components/Landing/landing";
import { packagePrice, packagePricingRule } from "@/helper/PackageHelper";
import isObject from "lodash-es/isObject";
import { cancelReservation } from "@/services/user";
import { saveToUserStorage } from "@/helper/userStorage";
import useLazyImport from "@/composable/useLazyImport";
import { getMaxPriceKids } from "@/helper/getMaxPriceKids";

export default {
  name: "QRPaymentLandingPage",
  components: {
    countdown: () => useLazyImport(() => import("@chenfengyuan/vue-countdown")),
  },
  setup() {
    return {
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
    accessToken() {
      return this.$store.getters["user/getAccessToken"];
    },
    expiredAt() {
      return this.$dayjs(this.qrPayment.qrCodeForPaymentExpiredAt).utc();
    },
    QRCodeCountDown() {
      const now = this.$dayjs().utc();
      const different = this.expiredAt.diff(now, "seconds");
      return different > 0 ? different * 1000 : 0;
    },
    idTitle() {
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
          if (packages.useKidsPrice) {
            const filterPrice = packages.kidsPriceV2.filter(
              (item) => item.priceValue !== "Free"
            );

            kids = {
              priceRule: priceRule,
              totalPrice: parseInt(getMaxPriceKids(filterPrice)) * this.kids,
              highestPrice: getMaxPriceKids(filterPrice),
              ...packages,
            };
          } else {
            kids = {
              priceRule: priceRule,
              totalPrice: parseInt(priceRule.price) * this.kids,
              ...packages,
            };
          }
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
    reloadQr() {
      const realImage = this.qrCodeURL;
      this.qrCodeURL = "";
      this.$nextTick(() => {
        const imageUrl = realImage.split("?")[0];
        this.qrCodeURL = imageUrl + `?${Date.now()}`;
      });
    },
    timerEnded() {
      this.back();
    },
    countDownTransform(props) {
      Object.entries(props).forEach(([key, value]) => {
        // Adds leading zero
        const digits = value < 10 ? `0${value}` : value;
        props[key] = `${digits}`;
      });

      return props;
    },
    async back() {
      if (typeof this.accessToken === "string" && this.accessToken.length) {
        await cancelReservation(this.originalId, this.accessToken);
      }
      saveToUserStorage("is_cancel_qr_payment", "true");
      this.$router.back();
    },
    onMounted() {
      try {
        this.qrCodeURL =
          this.qrPayment.qrCodeForPayment.includes("http") === false &&
          this.qrPayment.qrCodeForPayment.includes("data:image/png;base64") ===
            false
            ? `${this.$store.state.baseUrl}${this.qrPayment.qrCodeForPayment}`
            : this.qrPayment.qrCodeForPayment;
      } catch (err) {
        this.$rollbar.error(err);
      }
    },
  },
};
</script>
<i18n>
{
  "en": {
    "qrExpiredWithin": "QR Code will be expired within",
    "instruction1": "Turn on your Banking application and select “scan QR code” function.",
    "instruction2": "Check the payment amount and scan QR on the left to pay.",
    "instruction3": "Payment successful!.",
    "reloadQr": "Reload QR code",
    "chargeSummary": "Charge summary",
    "orderId": "Order ID",
    "reservationId": "Reservation ID",
    "remainingAmount": "*Remaining amount will need to be paid at restaurant.",
    "totalChargeAmount": "Total Charge Amount",
    "totalPrepaidAmound": "Total Prepaid Amount",
    "totalOrderValue": "Total Order Value",
    "totalPayAtRestaurant": "Total Pay At Restaurant",
    "pendingCharge": "We Will Charge Your Payment Once The Restaurant Confirm Your Seat",
    "chargedSummary": "Charged Summary",
    "viewMenu": "View Menu",
    "deliveryFee": "Delivery Fee",
    "closeDetail": "Close Details"
  },
  "th": {
    "qrExpiredWithin": "โค้ด QR จะหมดอายุภายใน",
    "instruction1": "เปิดแอปพลิเคชั่นธนาคารของคุณและเลือก “แสกน QR Code”",
    "instruction2": "ตรวจสอบยอดเงินและแสกนโค้ดเพื่อชำระ",
    "instruction3": "การจ่ายเงินเสร็จสิ้น",
    "reloadQr": "เปลี่ยน QR Code",
    "chargeSummary": "สรุปยอดเงิน",
    "orderId": "รหัสยืนยัน",
    "reservationId": "รหัสยืนยัน",
    "remainingAmount": "*ชำระเงินที่หน้าร้าน.",
    "totalPrepaidAmound": "จำนวนเงินที่ชำระล่วงหน้า",
    "totalChargeAmount": "ราคาสุทธิ",
    "totalOrderValue": "ยอดรวมทั้งสิ้น",
    "totalPayAtRestaurant": "ยอดรวมที่ต้องจ่ายที่ร้านอาหาร",
    "pendingCharge": "เมื่อร้านอาหารยืนยันที่นั่งแล้ว ทางร้านจะขอเก็บค่ามัดจำ",
    "chargedSummary": "สรุปยอดเงิน",
    "viewMenu": "ดูเมนู",
    "deliveryFee": "ค่าจัดส่ง",
    "closeDetail": "ปิด"
  }
}
</i18n>
