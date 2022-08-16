export default async function retryableGetElement(selector: string) {
  if (typeof selector === "string") {
    while (document.querySelector(selector) === null) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    return document.querySelector(selector);
  }
  throw new Error("Invalid selector, use string only");
}
