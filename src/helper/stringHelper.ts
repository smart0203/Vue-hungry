const stripHtmlTag = (text: string): string => {
  if (text) {
    return text.replace(/(<([^>]+)>)/gi, "").replace(/\s*/, "");
  }
  return "";
};

// to remove another number value
// example: 5,555Baht --> 5555
const convertToNumber = (param: string | number): number => {
  if (typeof param === "number") {
    return param;
  } else if (typeof param === "string" && param.length > 0) {
    // to remove character after ','
    const split = param.split(".");
    // to remove character if it is not a number
    const removeNonNumber = split[0].match(/\d+/g);
    const finalNumber =
      removeNonNumber !== null ? parseInt(removeNonNumber.join("")) : 0;
    return finalNumber;
  }
  return 0;
};

const removePunctuation = (text: string): string => {
  const punctuation = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
  if (text && text.length) {
    try {
      return text.replace(punctuation, "");
    } catch (err) {
      return text;
    }
  }
  return "";
};

const numberFormatThousand = (param: number): string => {
  if (typeof param === "number") {
    return param.toLocaleString("en-US");
  }
  return convertToNumber(param).toLocaleString("en-US");
};

const isValidJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export {
  stripHtmlTag,
  convertToNumber,
  removePunctuation,
  numberFormatThousand,
  isValidJsonString,
};
