import rollbar from "@/lib/rollbar";
import { initFirebase, firebaseInstance } from "@/lib/firebaseCore";
import { ref } from "@vue/composition-api";
import { getDatabase } from "firebase/database";

type DatabaseType = ReturnType<typeof getDatabase>;
const firebaseDatabase = ref<DatabaseType | null>(null);

async function initFirebaseDatabase() {
  try {
    initFirebase();
    if (firebaseDatabase.value === null && firebaseInstance.value) {
      firebaseDatabase.value = getDatabase(firebaseInstance.value);
    }
    return true;
  } catch (err: any) {
    rollbar.error("Failed init firebase database", err);
    return false;
  }
}

export { initFirebaseDatabase, firebaseInstance, firebaseDatabase };
