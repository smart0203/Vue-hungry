import isString from "lodash-es/isString";

function isLeadingZero(phone) {
  if (phone && isString(phone)) {
    return phone.charAt(0) === "0";
  }
  throw new Error("Invalid phone");
}

function removeLeadingZero(phone) {
  if (phone && isString(phone)) {
    if (phone.charAt(0) === "0") {
      return phone.substring(1, phone.length);
    }
    return phone;
  }
  throw new Error("Invalid phone");
}

export { isLeadingZero, removeLeadingZero };
