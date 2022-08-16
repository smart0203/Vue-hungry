import Rollbar, { Configuration } from "rollbar";
import version from "@/helper/getAppVersion";
let rollbarInstance = {};
let rollbarConfig: Configuration = {};

const env = process.env;
const isProd = env.NODE_ENV === "production";

if (isProd) {
  const ignoredList = [
    "การเชื่อมต่อกับเครือข่ายหายไป",
    "ถูกยกเลิก",
    "The Internet connection appears to be offline",
    "The request timed out",
    "Cancelled",
    "cancelled",
    "Request aborted",
    "キャンセルしました",
    "Network Error",
    "TypeError: The operation couldn’t be completed. Software caused connection abort", // https://rollbar.com/HungryHub/hh-web/items/1557/occurrences/151000255818/
    "ถูกยกเลิก", // https://rollbar.com/HungryHub/hh-web/items/722/occurrences/149935996504/,
    "คำขอหมดเวลา", // https://github.com/hungryhub-team/hh-web-new-ui/issues/544
    "TypeError: NetworkError when attempting to fetch resource.",
    "undefined is not an object (evaluating 'performance.now')",
    "(unknown): Script error.",
    "TypeError: WebKit",
    "Possible side-effect in debug-evaluate", // https://rollbar.com/HungryHub/hh-web/items/238/
    "Cannot read property 'macro' of undefined", // https://rollbar.com/HungryHub/hh-web/items/241/
    "unknown", // https://rollbar.com/HungryHub/hh-web/items/35/,
    "Can't find variable: _AutofillCallbackHandler", // https://rollbar.com/HungryHub/hh-web/items/292/occurrences/149478498522/
    "Can't find variable: _pcmBridgeCallbackHandler", // https://rollbar.com/HungryHub/hh-web/items/1989/occurrences/149478498523/
    "Cannot read property 'getReadModeRender' of undefined", // https://rollbar.com/HungryHub/hh-web/items/76/
    "Cannot read property 'getReadModeConfig' of undefined", // https://rollbar.com/HungryHub/hh-web/items/77/
    "Cannot read property 'getReadModeExtract' of undefined", // https://rollbar.com/HungryHub/hh-web/items/75/
    "The network connection was lost.", // https://rollbar.com/HungryHub/hh-web/items/703/occurrences/172805525464/
    "Failed import required firebase package", // https://rollbar.com/HungryHub/hh-web/items/3006/?item_page=0&item_count=50&#traceback
    "undefined is not an object (evaluating 't[i[o]]')", // https://rollbar.com/HungryHub/hh-web/items/6316/occurrences/226301066489/
    "Failed to execute 'transaction' on 'IDBDatabase': The database connection is closing.", // https://rollbar.com/HungryHub/hh-web/items/7317/occurrences/228427852247/
  ];
  // add custom ignored message when in production
  ignoredList.push("google_tag_manager is not defined");
  ignoredList.push(
    "Uncaught ReferenceError: google_tag_manager is not defined"
  );

  rollbarConfig = {
    accessToken: env.VUE_APP_ROLLBAR_TOKEN as string,
    captureUncaught: true,
    autoInstrument: true,
    captureUnhandledRejections: true,
    enabled: env.VUE_APP_ROLLBAR_IS_ENABLED === "true" ? true : false,
    environment: env.NODE_ENV,
    ignoredMessages: ignoredList,
    scrubFields: [
      "accessToken",
      "gbPrimepayCard.expirationMonth",
      "gbPrimepayCard.expirationYear",
      "gbPrimepayCard.name",
      "gbPrimepayCard.number",
      "gbPrimepayCard.securityCode",
    ],
    payload: {
      environment: env.NODE_ENV,
      client: {
        javascript: {
          source_map_enabled: true,
          code_version: version,
        },
      },
    },
    checkIgnore(isUncaught, args, payload: any) {
      const ignoredQueryString = ["propellerads"];
      ignoredQueryString.forEach((item) => {
        if (payload.request.query_string.includes(item)) {
          return true;
        }
        return false;
      });

      // mute error raise by appflyer banner opened in FB browser
      // https://rollbar.com/HungryHub/hh-web/items/1525/occurrences/148822260195/
      const payloadBodyTrace = payload.body.trace;
      if (
        payloadBodyTrace &&
        payloadBodyTrace.exception.class === "SecurityError" &&
        payloadBodyTrace.exception.message.includes(
          'Blocked a frame with origin "https://web.hungryhub.com" from accessing a cross-origin frame'
        ) &&
        payload.client.javascript.browser.includes("FB")
      ) {
        return true;
      }

      // mute error raise by prerender
      if (
        payload.client.javascript.browser.includes("Prerender") &&
        payloadBodyTrace &&
        payloadBodyTrace.exception
      ) {
        // failed load chunk
        // https://rollbar.com/HungryHub/hh-web/items/4783/?item_page=0&item_count=50&#instances
        if (payloadBodyTrace.exception.class === "ChunkLoadError") {
          return true;
        }
        // https://rollbar.com/HungryHub/hh-web/items/35/occurrences/172015480633/
        if (
          payloadBodyTrace.exception.class === "TypeError" &&
          payloadBodyTrace.exception.message === "Failed to fetch"
        ) {
          return true;
        }
        // https://rollbar.com/HungryHub/hh-web/items/35/occurrences/172015480633/
        if (
          payloadBodyTrace.exception.message.includes(
            "[unhandledrejection] error getting `reason` from event"
          )
        ) {
          return true;
        }
      }
      // mute error caused by browser extension
      if (
        payloadBodyTrace &&
        payloadBodyTrace.frames &&
        payloadBodyTrace.frames.length
      ) {
        const ignoredFileName = "moz-extension";
        const anyIgnoredFile = payloadBodyTrace.frames.filter((frame: any) => {
          return frame.filename.includes(ignoredFileName) ? true : false;
        });
        return anyIgnoredFile.length > 0 ? true : false;
      }
      return false;
    },
  };
}

rollbarInstance = new Rollbar(rollbarConfig);

if (!isProd) {
  Object.defineProperty(rollbarInstance, "error", {
    value: function (message: string, cause: any) {
      console.error("error happened");
      console.log(message);
      console.log(cause);
    },
    writable: false,
  });
}

export default rollbarInstance as Rollbar;
