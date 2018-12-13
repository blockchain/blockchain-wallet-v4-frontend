import { BigNumber } from 'bignumber.js'

export const setMinDecimals = (amount, decimals) => {
  const bigNumberAmount = new BigNumber(amount || 0)
  if (bigNumberAmount.decimalPlaces() > decimals) return amount
  return bigNumberAmount.toFixed(decimals)
}
