import uaParser from "ua-parser-js";

export default function parseUserAgent() {
  const parser = new uaParser();
  const { getBrowser } = parser;
  const parserResult = parser.getResult();
  const { name } = getBrowser();
  const { os } = parserResult;

  const browserName = name?.toLowerCase() || "";
  const osName = os.name?.toLocaleLowerCase() || "";

  return {
    browserName,
    osName,
  };
}
