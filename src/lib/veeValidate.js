import { ValidationProvider, ValidationObserver, extend } from "vee-validate";
import {
  required,
  alpha_spaces,
  integer,
  email,
  min_value,
  min,
  length,
  confirmed,
} from "vee-validate/dist/rules";
import { isLeadingZero } from "@/helper/phoneNumber";
import { i18n } from "@/lib/i18n/i18n.js";

extend("alpha_spaces", alpha_spaces);
extend("min", {
  ...min,
  message: `{_field_} field is cannot less than {length}`,
});
extend("min_value", {
  ...min_value,
  message: `{_field_} field is cannot less than {min}`,
});
extend("length", {
  ...length,
  message: `{_field_} field is cannot less than {length} character`,
});
extend("integer", integer);
extend("email", email);
extend("required", required);
extend("confirmed", confirmed);

extend("validCardExp", (val) => {
  if (!val.includes("M") && !val.includes("Y")) {
    return true;
  }
  return "Please select card exp";
});

extend("leadingZeroPhone", (val) => {
  if (isLeadingZero(val)) {
    return true;
  }
  return i18n.t("leadingZeroPhone");
});

const observer = ValidationObserver;
const provider = ValidationProvider;
export { observer, provider };
