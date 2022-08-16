import { ref, reactive, computed } from "@vue/composition-api";
import store from "@/store/index";

const loading = reactive({
  pastReservation: false,
  upCommingReservation: false,
  modal: false,
});

const pageNumber = reactive({
  pastReservation: 1,
  upCommingReservation: 1,
});

const pageSize = reactive({
  pastReservation: 10,
  upCommingReservation: 10,
});

let activeTab = ref("reservation");
let pastReservation = ref([]);
let upComingReservation = ref([]);
let hungryPoints = computed(() => {
  return store.state.user.points;
});
let accessToken = computed(() => {
  return store.state.user.accessToken;
});
let name = computed(() => {
  return store.state.user.name;
});
let email = computed(() => {
  return store.state.user.email;
});
let phoneCode = computed(() => {
  return store.state.user.phoneCode;
});

let phone = computed(() => {
  return store.state.user.phone;
});
let avatarOriginal = computed(() => {
  return store.state.user.avatarOriginal;
});
let referralCode = computed(() => {
  return store.state.user.referralCode;
});

function setActiveTab(val) {
  activeTab.value = val;
}

const state = {
  upComingReservation,
  pastReservation,
  accessToken,
  name,
  email,
  phone,
  phoneCode,
  avatarOriginal,
  referralCode,
  hungryPoints,
  loading,
  pageNumber,
  pageSize,
  activeTab,
};
const methods = {
  setActiveTab,
};

export { state, methods };
