const convertCentsToDollars = (cents: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(cents / 100);
};

const convertDollarsToCents = (dollars: number) => {
  return dollars * 100;
}

export { convertCentsToDollars, convertDollarsToCents };