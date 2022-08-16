import { API_MAJOR_VERSION, API_BASE_URL } from "@/lib/constant";
import humps from "humps";

export default async function ({ method = "get", url, headers }) {
  if (!url) {
    throw new Error("invalid url");
  }
  const apiBaseUrl = `${process.env.VUE_APP_API_DOMAIN}${API_BASE_URL}/${API_MAJOR_VERSION}`;
  const finalUrl = !url.includes("http") ? apiBaseUrl + url : url;
  try {
    const result = await fetch(finalUrl, {
      method: method,
      headers,
    });
    if (result.ok === true) {
      const data = await result.json();
      return JSON.stringify(humps.camelizeKeys(data));
    }
    if (result.status === 503) {
      throw new Error("service unavailable");
    }
    throw new Error("Unhandled Error", { cause: result });
  } catch (err) {
    if (
      err.message === "service unavailable" ||
      err.message === "Failed to fetch"
    ) {
      throw new Error(err.message);
    }
    throw new Error(err);
  }
}
