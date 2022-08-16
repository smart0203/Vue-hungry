//Date.toLocaleDateString.js
(function (global) {
  "use strict";

  var dateFormatOverride = function (locale) {
    var formatUS =
      this.getMonth() + 1 + "/" + this.getDate() + "/" + this.getFullYear();
    var formatTH =
      this.getDate() +
      "/" +
      this.getMonth() +
      1 +
      "/" +
      this.getFullYear() +
      543;

    var formattedDate = {
      "en-US": formatUS,
      "th-TH": formatTH,
    };

    return formattedDate[locale] || formattedDate["en-US"];
  };

  function toLocaleDateStringSupportsLocales() {
    try {
      new Date().toLocaleDateString("i");
      const testDate = new Date(2021, 0, 17, 20, 16, 51);
      const str = testDate.toLocaleString("th-TH");
      if (str.indexOf("256") == 5) {
        throw RangeError("toLocaleDateString is not supported");
      }
    } catch (e) {
      return e.name === "RangeError";
    }
    return false;
  }

  if (!toLocaleDateStringSupportsLocales()) {
    Date.prototype.toLocaleDateString = dateFormatOverride;
  }

  global.toLocaleDateStringSupportsLocales =
    toLocaleDateStringSupportsLocales();
  global.testDate = () => {
    const testDate = new Date(2021, 0, 17, 20, 16, 51);
    return {
      th: testDate.toLocaleString("th-TH"),
      en: testDate.toLocaleString("en-US"),
    };
  };
})(window);
