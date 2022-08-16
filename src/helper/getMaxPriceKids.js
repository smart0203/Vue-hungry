function getMaxPriceKids(arr) {
  if (!Array.isArray(arr)) {
    return 0;
  }
  let maxValue = arr[0];
  for (const a of arr) {
    if (a.priceValue > maxValue.priceValue) {
      maxValue = a;
    }
  }
  return maxValue.priceValue;
};

export { getMaxPriceKids };