import lazyImport from "@/helper/lazyImport";
import useReport from "./useReport";
import version from "@/helper/getAppVersion";

type componentImportFunction = () => Promise<string>;

export default async function useLazyImport(
  componentImport: componentImportFunction
) {
  try {
    return await lazyImport(componentImport);
  } catch (err) {
    useReport({
      message: "Failed when import file/component lazily",
      level: "error",
      errorException: err,
      object: {
        appVersion: version,
      },
    });
    alert("Please refresh to seed updated content");
  }
}
