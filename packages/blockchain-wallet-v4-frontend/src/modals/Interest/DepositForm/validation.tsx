import BigNumber from 'bignumber.js'

export const minDepositAmount = minValue => value => {
  if (!value) return true

  return new BigNumber(value).isLessThan(minValue) ? 'BELOW_MIN' : false
}
export const maxDepositAmount = maxValue => value => {
  if (!value) return true

  return new BigNumber(maxValue).isLessThan(value) ? 'ABOVE_MAX' : false
}
