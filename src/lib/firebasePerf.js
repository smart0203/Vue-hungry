import { initFirebase, firebaseInstance } from "@/lib/firebaseCore";
import { ref } from "@vue/composition-api";
import { getPerformance } from "firebase/performance";
import rollbar from "@/lib/rollbar";

let firebasePerf = ref("");

async function initFirebasePerf() {
  try {
    initFirebase();
    firebasePerf.value = getPerformance(firebaseInstance.value);
    return true;
  } catch (err) {
    rollbar.error("Failed init firebase performance monitoring", err);
    return false;
  }
}

export { initFirebasePerf, firebasePerf };
