export const getValidSwapAmount = (amount: number | undefined) =>
  amount && !Number.isNaN(amount) && parseFloat(`${amount}`) !== 0 ? amount : 0
