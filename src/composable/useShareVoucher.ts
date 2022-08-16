import isEmpty from "lodash-es/isEmpty";
import useNavigatorShare, { isSupport } from "./useNavigatorShare";
import useReport from "./useReport";
import store from "@/store";

export default function useShareVoucher() {
  const shareTitle =
    "Check out your gift!! enjoy special experience (Hungry Hub gift card)";

  function getShareUrl(voucher: any) {
    if (isEmpty(voucher)) {
      useReport({
        level: "error",
        message: "Failed share voucher, missing voucher object",
      });
      return "";
    }
    // @ts-ignore
    const baseUrl = store.state.webConfig?.config?.webV2Host;
    return `${baseUrl}/vouchers/${voucher.encryptedId}?token=${voucher.token}`;
  }

  function shareVoucher(voucher: any) {
    if (isEmpty(voucher)) {
      useReport({
        level: "error",
        message: "Failed share voucher, missing voucher object",
      });
      return;
    }
    const voucherShareLandingPage = getShareUrl(voucher);
    if (isSupport) {
      const shareMessage = `${shareTitle} ${voucherShareLandingPage}`;
      useNavigatorShare({
        title: shareTitle,
        message: shareMessage,
        url: voucherShareLandingPage,
        erroMessage: "failed share voucher",
      });
      return;
    }
    window.open(voucherShareLandingPage, "_blank");
    return;
  }

  return { shareTitle, shareVoucher, getShareUrl };
}
