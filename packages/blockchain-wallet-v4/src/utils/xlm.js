import { BigNumber } from 'bignumber.js'

export const calculateEffectiveBalance = (
  balance,
  baseReserve,
  entries,
  baseFee,
  operations = 1
) =>
  new BigNumber(balance)
    .minus(new BigNumber(entries).plus(2).mul(baseReserve))
    .minus(new BigNumber(baseFee).mul(operations))
    .toString()
