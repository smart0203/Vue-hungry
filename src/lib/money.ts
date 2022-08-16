import accounting from "accounting";
const moneyFormat = function (string: string | number) {
  const number =
    typeof string === "string" ? string.replace(/[^\d.-]/g, "") : string;
  const option = {
    symbol: "฿",
    decimal: ".",
    thousand: ",",
    precision: 0,
    format: "%v%s",
  };
  return accounting.formatMoney(number, option);
};
export default moneyFormat;
