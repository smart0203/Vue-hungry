import Rollbar from "@/lib/rollbar";
const isProd = process.env.NODE_ENV === "production";

type ReportParameter = {
  message: string;
  level: "critical" | "error" | "warning" | "debug" | "info";
  errorException?: any;
  object?: Record<string, unknown>;
};

const useReport = (paramater: ReportParameter) => {
  if (isProd) {
    const logLevel = paramater.level || "debug";
    Rollbar.configure({ logLevel });
    Rollbar.log(paramater.message, paramater.object, paramater.errorException);
    return;
  }
  console.log(paramater);
};

export default useReport;
