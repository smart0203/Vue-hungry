import { localize } from "vee-validate";

localize({
  en: {
    names: {
      Name: "Name",
      Phone: "Phone",
      Email: "Email",
    },
    messages: {
      required: "{_field_} field is required",
      email: "{_value_} is not valid email address",
    },
  },
  th: {
    names: {
      Name: "",
      Phone: "",
      Email: "",
    },
    messages: {
      required: "{_field_} ต้องระบุ",
      email: "{_value_} ไม่ใช่ที่อยู่อีเมลที่ถูกต้อง",
    },
  },
});

export default localize;
