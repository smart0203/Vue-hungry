import { ref, computed } from "@vue/composition-api";

const config = ref({});

const cdnUrl = computed(() => {
  return config.value.cdnUrl;
});

export { config, cdnUrl };
