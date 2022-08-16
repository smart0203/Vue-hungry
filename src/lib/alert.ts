import "vue-toastification/dist/index.css";
import { createToastInterface } from "vue-toastification";

const pluginOptions = {
  timeout: 4000,
  toastClassName: "hh-toast",
};
// Create the interface
const toast = createToastInterface(pluginOptions);

export const success = function (text: any) {
  toast.clear();
  const parsedText = typeof text === "string" ? text : "";
  if (parsedText.length) {
    toast.success(text);
  }
};

export const error = function (text: any) {
  toast.clear();
  const parsedText = typeof text === "string" ? text : "";
  if (parsedText.length) {
    toast.error(text);
  }
};

export const info = function (text: any) {
  toast.clear();
  const parsedText = typeof text === "string" ? text : "";

  if (parsedText.length) {
    toast.info(text);
  }
};

export const warning = function (text: any) {
  toast.clear();
  const parsedText = typeof text === "string" ? text : "";
  if (parsedText.length) {
    toast.warning(text);
  }
};
