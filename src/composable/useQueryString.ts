import qs from "qs";
import humps from "humps";
import { useUrlSearchParams } from "@vueuse/core";

const queryString = useUrlSearchParams("history");

export default function useQueryString() {
  let parsedQueryString: any = humps.camelizeKeys(queryString);

  function getQueryString() {
    return parsedQueryString;
  }

  function addQueryString(key: string, val: string | number | boolean) {
    parsedQueryString[key] = val;
  }

  function removeQueryString(key: string) {
    const parsedKey = humps.camelize(key);
    if (parsedKey in parsedQueryString) {
      delete parsedQueryString[parsedKey];
    }
  }

  function getStringifyQueryString() {
    const stringify = qs.stringify(humps.decamelizeKeys(parsedQueryString));
    return stringify;
  }

  return {
    parsedQueryString,
    getQueryString,
    addQueryString,
    getStringifyQueryString,
    removeQueryString,
  };
}
