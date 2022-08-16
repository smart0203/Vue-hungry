import qs from "qs";

function composeURL(url: string) {
  if (!url || !url.length) {
    return false;
  }
  let finalUrl;
  let finalQueryString;
  const defaultQueryString = {
    client_type: "web",
  };
  const split = url.split("?");
  const urlApiEndPoint = split[0];
  if (split && split.length > 1) {
    const urlQueryString = qs.parse(split[1]);
    finalQueryString = { ...urlQueryString, ...defaultQueryString };
  } else {
    finalQueryString = defaultQueryString;
  }
  const stringifyFinalQueryString = qs.stringify(finalQueryString, {
    encode: false,
  });
  finalUrl = `${urlApiEndPoint}?${stringifyFinalQueryString}`;
  return finalUrl;
}

export default composeURL;
