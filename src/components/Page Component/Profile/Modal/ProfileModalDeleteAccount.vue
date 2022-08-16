<template>
  <div class="my-6">
    <div v-if="step === 0" class="text-center">
      <p class="font-black">{{ $t("areYouSureToDelete") }}</p>
      <p class="text-sm">{{ $t("pendingBookingWillDelete") }}</p>
      <div
        class="flex items-center justify-center w-11/12 mx-auto mt-6 lg:w-6/12"
      >
        <button
          id="no-delete-button"
          class="w-1/2 py-1 mr-2 rounded-full text-red-dark button"
          type="button"
          @click="$emit('on-cancel')"
        >
          No
        </button>
        <button
          id="yes-delete-button"
          class="w-1/2 py-1 text-white rounded-full bg-red-dark button"
          type="button"
          @click="continueConfirmDelete"
        >
          Yes
        </button>
      </div>
    </div>

    <div v-else class="mx-4 lg:mx-6">
      <p class="pb-4 text-lg font-black border-b">
        {{ $t("tellUsWhyLeaving") }}
      </p>
      <ul>
        <li v-for="reason in deleteReason" :key="reason">
          <input
            v-model="chooseReason"
            class="form-radio text-red-dark"
            type="radio"
            name="delete-reason"
            :value="reason"
          />
          <span>{{ reason }}</span>
        </li>
        <li class="flex items-start justify-center">
          <input
            v-model="chooseReason"
            class="mt-1 form-radio text-red-dark"
            type="radio"
            name="delete-reason"
            value="other"
          />
          <div class="w-full">
            <span class="block">Others</span>
            <div
              class="flex items-center justify-center mt-2 border border-gray-400 rounded"
            >
              <input
                v-model="otherReason"
                type="text"
                name="other-delete-reason"
                class="w-full px-1 py-1"
                @focus="chooseReason = 'other'"
              />
              <span class="mx-1 text-gray-500">{{ reasonInputTextLeft }}</span>
            </div>
          </div>
        </li>
      </ul>

      <div class="flex items-center justify-center mt-6 lg:mt-8">
        <button
          class="w-auto px-3 py-1 mr-4 rounded lg:px-6 button text-red-dark lg:py-2 border-red-dark"
          type="button"
          @click="$emit('on-cancel')"
        >
          Cancel
        </button>
        <button
          class="w-auto px-4 py-1 text-white rounded disabled:border-gray-400 button bg-red-dark lg:w-1/2 lg:py-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          type="button"
          :disabled="disableSubmit"
          @click="doDeleteAccount"
        >
          Delete Account
        </button>
      </div>
    </div>
  </div>
</template>

<script>
const MAX_INPUT_REASON = 120;
import { deleteAccount } from "@/services/user";
import { ROUTE_HOME_PAGE } from "@/lib/constant";
import { getDeleteReason } from "@/services/user";
export default {
  name: "ProfileModalDeleteAccount",
  data() {
    return {
      step: 0,
      chooseReason: "",
      otherReason: "",
      isLoading: false,
      deleteReason: [],
    };
  },
  computed: {
    disableSubmit() {
      return this.selectedDeleteReason.length === 0 || this.isLoading === true;
    },
    selectedDeleteReason() {
      if (this.chooseReason === "other") {
        return this.otherReason;
      }
      return this.chooseReason;
    },
    reasonInputTextLeft() {
      return `${
        MAX_INPUT_REASON - this.otherReason.length
      }/${MAX_INPUT_REASON}`;
    },
  },
  mounted() {
    this.getDeletionReason();
  },
  methods: {
    continueConfirmDelete() {
      this.step = 1;
    },
    async getDeletionReason() {
      this.isLoading = true;
      const { isSuccess, message, data } = await getDeleteReason();
      this.isLoading = false;
      if (!isSuccess && message) {
        this.$alert.error(message);
        return;
      }
      this.deleteReason = data;
    },
    async doDeleteAccount() {
      this.isLoading = true;
      const accessToken = this.$store.getters["user/getAccessToken"];
      const { isSuccess, message } = await deleteAccount(
        accessToken,
        this.selectedDeleteReason
      );
      if (isSuccess) {
        this.isLoading = false;
        this.$store.dispatch("user/doSignOut");
        this.$router.push({ name: ROUTE_HOME_PAGE });
        return;
      }
      if (message) {
        this.$alert.error(message);
        this.isLoading = false;
      }
    },
  },
  i18n: {
    messages: {
      en: {
        areYouSureToDelete: "Are you sure to delete your account?",
        pendingBookingWillDelete:
          "If you have any pending bookings, It will be canceled.",
        tellUsWhyLeaving: "Tell us why you're leaving is better",
      },
      th: {
        areYouSureToDelete: "ยืนยันที่จะลบบัญชีของคุณ?",
        pendingBookingWillDelete:
          "หากคุณมีการจองที่กำลังจะเกิดขึ้น การจองทั้งหมดจะถูกยกเลิก",
        tellUsWhyLeaving:
          "บอกเราหน่อยว่าติดปัญหาตรงไหน เราจะนำข้อมูลไปพัฒนาให้ดียิ่งขึ้น",
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.button {
  @apply border font-bold;
}

ul li {
  @apply my-6;
  input {
    @apply mr-2;
  }
}
</style>
