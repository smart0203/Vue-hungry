<template>
  <div class="mt-4">
    <h4 class="mx-4 mb-4 text-base font-black text-center">
      {{ `${order}.${$t("recordGuestTitle")}` }}
    </h4>
    <div class="mx-auto">
      <div v-for="(guest, index) in recordGuest" :key="index" class="mb-4">
        <div class="flex mb-4">
          <p class="text-sm">{{ `${$t("guest")} ${index + 1}` }}</p>
          <div
            v-if="index === 0"
            class="flex items-center justify-start ml-2 text-sm"
          >
            <div class="pretty p-svg p-round">
              <input v-model="isCopyData" type="checkbox" />
              <div class="state p-success">
                <!-- svg path -->
                <svg class="svg svg-icon" viewBox="0 0 20 20">
                  <path
                    d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
                    style="stroke: white; fill: white"
                  ></path>
                </svg>
                <label> {{ $t("sameAsBookingInfo") }}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="">
          <div class="flex">
            <ValidationProvider v-slot="{ errors }" rules="required" slim>
              <div class="w-full mb-3">
                <div class="flex items-center pb-2 border-b border-gray-700">
                  <img
                    class="mr-2 icon icon-left"
                    src="@/assets/icon-user-red.png"
                    alt="icon user"
                    width="18px"
                     loading="lazy"
                    height="18px"
                  />
                  <input
                    :id="`firstName${index}`"
                    v-model="guest.firstName"
                    :name="`${$t('guest')} ${index + 1} ${$t('firstName')}`"
                    class="flex w-full text-sm border-none input"
                    style="border-top: 0; border-right: 0; border-left: 0"
                    :placeholder="$t('firstName')"
                    :readonly="index === 0 && isCopyData"
                    type="text"
                  />
                </div>
                <div class="mt-1 text-xs text-red-dark">
                  {{ errors[0] }}
                </div>
              </div>
            </ValidationProvider>
            <div class="w-16"></div>
            <div class="w-full mb-3">
              <div class="flex items-center pb-2 border-b border-gray-700">
                <input
                  :id="`lastName${index}`"
                  v-model="guest.lastName"
                  :name="`${$t('guest')} ${index + 1} ${$t('lastName')}`"
                  class="flex w-full text-sm border-none input"
                  style="border-top: 0; border-right: 0; border-left: 0"
                  :placeholder="$t('lastName')"
                  :readonly="index === 0 && isCopyData"
                  type="text"
                />
              </div>
            </div>
          </div>
          <ValidationProvider
            v-slot="{ errors }"
            rules="required|leadingZeroPhone"
            slim
          >
            <div class="w-full mb-3">
              <div class="flex items-center pb-2 border-b border-gray-700">
                <img
                  class="mr-2 icon icon-left"
                  src="@/assets/icon-phone-red.png"
                  alt="icon user"
                   loading="lazy"
                  width="18px"
                  height="18px"
                />
                <input
                  :id="`guestPhone${index}`"
                  v-model.trim="guest.phone"
                  :class="`guest-${index + 1}-phone-code`"
                  :name="`${$t('guest')} ${index + 1} ${$t('phone')}`"
                  class="flex flex-auto w-full text-sm border-none input"
                  style="border-top: 0; border-right: 0; border-left: 0"
                  :placeholder="$t('phone')"
                  :readonly="index === 0 && isCopyData"
                  type="text"
                />
              </div>
              <div class="mt-1 text-xs text-red-dark">
                {{ errors[0] }}
              </div>
            </div>
          </ValidationProvider>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { provider } from "@/lib/veeValidate";
import { mapState } from "vuex";
import { mapFields } from "vuex-map-fields";
import intlTelInputLib from "@/lib/intlTelInput";
import { isLeadingZero } from "@/helper/phoneNumber";
let timeOutInstance;
export default {
  components: {
    ValidationProvider: provider,
  },
  props: {
    order: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isCopyData: true,
    };
  },
  computed: {
    ...mapState("booking", ["adult"]),
    ...mapState("user", ["name", "phone", "phoneCode", "phoneCodeCountry"]),
    ...mapFields("booking", ["recordGuest"]),
  },
  watch: {
    isCopyData: {
      handler(val) {
        if (val === true) {
          this.setDefault();
        } else {
          this.clearDefault();
        }
      },
    },
    name: {
      handler() {
        if (this.isCopyData) {
          this.setDefault();
        }
      },
    },
    phone: {
      handler() {
        if (this.isCopyData) {
          this.setDefault();
        }
      },
    },
    phoneCode: {
      handler() {
        if (this.isCopyData) {
          this.setDefault();
        }
      },
    },
  },
  created() {
    this.setupRecordGuest();
  },
  mounted() {
    this.setDefault();
    this.$nextTick(() => {
      timeOutInstance = setTimeout(() => {
        this.setupInputTelephone();
      }, 1000);
    });
  },
  beforeDestroy() {
    clearTimeout(timeOutInstance);
  },
  methods: {
    setupRecordGuest() {
      if (this.recordGuest.length <= this.adult) {
        const length = this.adult - this.recordGuest.length;
        for (let i = 0; i < length; i++) {
          let item = {
            firstName: "",
            lastName: "",
            phoneCode: "+66",
            phoneCodeEl: "",
            phoneCodeAdvInput: "",
            phone: "",
          };
          if (i === 0 && this.recordGuest.length === 0) {
            const name = this.name.split(" ");
            this.$set(item, "firstName", name[0]);
            if (name.length > 1) {
              const lastName = [...name];
              lastName.shift();
              this.$set(item, "lastName", lastName.join(" "));
            }
            this.$set(item, "phoneCode", this.phoneCode);
            this.$set(item, "phone", this.phone);
          }
          this.recordGuest.push(item);
        }
      }
      // delete record guest index if exceed current adult count
      else {
        let arr = [];
        for (let i = 0; i < this.adult; i++) {
          arr.push(this.recordGuest[i]);
        }
        this.recordGuest = arr;
      }
    },
    setDefault() {
      if (this.recordGuest.length > 0) {
        const name = this.name.split(" ");
        const firstGuest = this.recordGuest[0];
        const phone =
          this.phone && !isLeadingZero(this.phone)
            ? `0${this.phone}`
            : this.phone;
        this.$set(firstGuest, "firstName", name[0]);
        // set last name (if possible)
        if (name.length > 1) {
          const lastName = [...name];
          lastName.shift();
          this.$set(firstGuest, "lastName", lastName.join(" "));
        }
        this.$set(firstGuest, "phoneCode", this.phoneCode);
        this.$set(firstGuest, "phone", phone);
        if (
          firstGuest.phoneCodeAdvInput &&
          typeof firstGuest.phoneCodeAdvInput.setCountry == "function"
        ) {
          const defaultCountry = this.phoneCodeCountry || "th";
          firstGuest.phoneCodeAdvInput.setCountry(defaultCountry);
        }
      }
    },
    clearDefault() {
      this.$set(this.recordGuest[0], "firstName", "");
      this.$set(this.recordGuest[0], "lastName", "");
      this.$set(
        this.recordGuest[0],
        "phoneCode",
        `+${
          this.recordGuest[0].phoneCodeAdvInput.getSelectedCountryData()
            .dialCode
        }`
      );
      this.$set(this.recordGuest[0], "phone", "");
    },
    async setupInputTelephone() {
      try {
        const inputTel = await intlTelInputLib();
        for (let i = 0; i < this.recordGuest.length; i++) {
          const inputPhoneCode = `guest-${i + 1}-phone-code`;
          const recordGuest = this.recordGuest[i];
          recordGuest.phoneCodeEl =
            document.getElementsByClassName(inputPhoneCode)[0];
          if (recordGuest.phoneCodeEl) {
            recordGuest.phoneCodeAdvInput = inputTel(recordGuest.phoneCodeEl, {
              autoPlaceholder: false,
              initialCountry: this.phoneCodeCountry,
              separateDialCode: false,
            });
            recordGuest.phoneCodeEl.addEventListener("countrychange", () => {
              recordGuest.phoneCode = `+${
                recordGuest.phoneCodeAdvInput.getSelectedCountryData().dialCode
              }`;
            });
          }
        }
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
    "recordGuestTitle": "Please fill the details of people who dine-in for COVID-19 trace",
    "sameAsBookingInfo": "Same as booking info",
    "guest": "Guest",
    "name": "Name",
    "firstName": "First name",
    "lastName": "Last name",
    "phone": "Phone"
  },
  "th": {
      "recordGuestTitle": "โปรดกรอกข้อมูลของผู้ที่เข้าร่วมรับประทานอาหาร เพื่อการเฝ้าระวังโควิด-19",
      "sameAsBookingInfo": "เหมือนข้อมูลผู้จอง",
      "guest": "แขกคนที่",
      "name": "ชื่อ",
      "firstName": "ชื่อ",
      "lastName": "นามสกุล",
      "phone": "เบอร์โทร"
  }
}
</i18n>
