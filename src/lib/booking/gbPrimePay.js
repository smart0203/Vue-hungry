import axios from "axios";
import humps from "humps";
import { storageGetLanguage } from "@/lib/localStorage";

const currentLang = storageGetLanguage();
const appMode = process.env.VUE_APP_MODE;

let baseUrl = "https://api.globalprimepay.com";
if (appMode === "production") {
  baseUrl = "https://api.gbprimepay.com";
}

const parseErrorCode = function (code, lang) {
  // get from https://doc.gbprimepay.com/full-payment-non-3d
  if (code === "01") {
    return "Refer to Card Issuer";
  } else if (code === "03") {
    if (lang === "en") {
      return "Invalid Merchant ID, Please contact our support team";
    }
    return "ไม่อนุญาตให้รับบัตรประเภทนี้, ให้ติดต่อสอบถาม GBPrimePay";
  } else if (code === "05") {
    if (lang === "en") {
      return "Invalid card information, Please insert valid card information, for example, expiry date, CVV number needs to be 3 digits, card holder name.";
    }
    return "โปรดติดต่อธนาคารผู้ออกบัตร, ให้ผู้ถือบัตรติดต่อธนาการผู้ออกบัตร หมายเหตุ: บางธนาคารหากบัตรวันหมดอายุผิด หรือเงินไม่พอ หรือบัตรมีปัญหา ก็จะส่ง Code 05 มา หรือ ใส่ค่า CVV2 ไม่ถูกต้อง (CVV2 คือ เลข 3 หลักสุดท้ายที่อยู่หลังบัตรเครดิตตรงแถบลายเซ็นต์) ";
  } else if (code === "12") {
    if (lang === "en") {
      return "Invalid Transaction, Please contact our support team";
    }
    return "รายการผิดพลาดเนื่องจากระบบ GBPrimePay ไม่พร้อมให้บริการ, เป็นรายการที่ไม่ถูกต้อง ให้ติดต่อ GBPrimePay เพื่อตรวจสอบปัญหา เช่น Format message การส่งค่าผิด/หรือ Invalid CVV สำหรับ Mastercard";
  } else if (code === "13") {
    if (lang === "en") {
      return "Invalid Amount, Amount of price must be more than 0.1";
    }
    return "จำนวนเงินไม่ถูกต้อง, จำนวนเงินที่จ่ายมาไม่ถูกต้อง เช่น ใส่จำนวนเงิน มามากหรือน้อยผิดปกติ ให้ตรวจสอบจำนวนเงินอีกครั้ง";
  } else if (code === "14") {
    if (lang === "en") {
      return "Invalid Card Number, Please check your card number";
    }
    return "หมายเลขบัตรเครดิตไม่ถูกต้อง, หมายเลขบัตรเครดิตไม่ถูกต้อง";
  } else if (code === "17") {
    if (lang === "en") {
      return "Payment Cancelled, Your payment cancelled";
    }
    return "ลูกค้ายกเลิกการทำรายการ, เมื่อทำรายการมาถึงหน้าจอที่ใส่ข้อมูลรายละเอียดบัตรเพื่อชำระเงินแล้ว ลูกค้าได้กดปุ่ม Cancel เพื่อยกเลิกการทำรายการ แจ้งลูกค้าให้ทำรายการใหม่อีกคร้ัง";
  } else if (code === "19") {
    return "	Re-enter Transaction";
  } else if (code === "30") {
    return "Format Error";
  } else if (code === "41") {
    return "Lost Card -Pick Up";
  } else if (code === "43") {
    return "Stolen Card -Pick Up";
  } else if (code === "50") {
    return "Invalid Payment Condition";
  } else if (code === "51") {
    return "Insufficient Funds";
  } else if (code === "54") {
    return "Expired Card";
  } else if (code === "55") {
    return "Wrong Pin";
  } else if (code === "58") {
    return "Transaction not Permitted to Terminal";
  } else if (code === "91") {
    return "	Issuer or Switch is Inoperative";
  } else if (code === "94") {
    return "Duplicate Transmission";
  } else if (code === "96") {
    return "System Malfunction";
  } else if (code === "xx") {
    return "Transaction Timeout";
  }
  return "Unknown Error";
};

const createToken = async function (
  { number, expirationMonth, expirationYear, securityCode, name },
  gbPrimePayAuthKey
) {
  try {
    if (!number) {
      throw new Error("Invalid card number");
    }
    if (!expirationMonth) {
      throw new Error("Invalid card exp month");
    }
    if (!expirationYear) {
      throw new Error("Invalid card exp year");
    }
    if (!securityCode) {
      throw new Error("Invalid card security code");
    }
    if (!name) {
      throw new Error("Invalid card name");
    }
    const gbPrimePayAuthKeyAddSemiColon = `${gbPrimePayAuthKey}:`;
    const payload = humps.camelizeKeys({
      rememberCard: true,
      card: {
        number: number,
        expirationMonth: expirationMonth,
        expirationYear: expirationYear,
        securityCode: securityCode,
        name: name,
      },
    });
    const resp = await axios({
      url: `${baseUrl}/v1/tokens`,
      method: "POST",
      data: payload,
      headers: {
        Authorization: `Basic ${btoa(gbPrimePayAuthKeyAddSemiColon)}`,
      },
    });
    const resultCode = resp.data.resultCode;
    if (resultCode === "00") {
      return {
        isSuccess: true,
        card: resp.data.card,
        rememberCard: resp.data.rememberCard,
      };
    } else {
      return {
        isSuccess: false,
        message: parseErrorCode(resultCode, currentLang),
        data: {
          payload: {
            number,
            expirationMonth,
            expirationYear,
            name,
          },
          response: resultCode,
        },
      };
    }
  } catch (err) {
    return {
      isSuccess: false,
      message: err.message,
      data: {
        payload: {
          number,
          expirationMonth,
          expirationYear,
          name,
        },
        response: err,
      },
    };
  }
};

export default createToken;
