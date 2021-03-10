import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { RootState } from 'data/rootReducer'

// TODO - MOVE TO BE 1000 before release
export const MIN_AMOUNT = '5.00'

export const getAmount = (state: RootState) => state.components.withdraw.amount

export const getBeneficiary = (state: RootState) =>
  state.components.withdraw.beneficiary

export const getFiatCurrency = (state: RootState) =>
  state.components.withdraw.fiatCurrency

export const getStep = (state: RootState) => state.components.withdraw.step

export const getWithdrawal = (state: RootState) =>
  state.components.withdraw.withdrawal

export const getFeesAndMinAmount = (state: RootState) =>
  state.components.withdraw.feesAndMinAmount

export const getFeeForCurrency = (state: RootState, currency: string) => {
  const feesR = getFeesAndMinAmount(state)

  return lift(
    (fees: ExtractSuccess<typeof feesR>) =>
      fees.fees.filter(fee => fee.symbol === currency)[0] || {
        symbol: currency,
        value: '0.00'
      }
  )(feesR)
}
export const getMinAmountForCurrency = (state: RootState, currency: string) => {
  const feesR = getFeesAndMinAmount(state)

  return lift(
    (fees: ExtractSuccess<typeof feesR>) =>
      fees.minAmounts.filter(fee => fee.symbol === currency)[0] || {
        symbol: currency,
        value: MIN_AMOUNT
      }
  )(feesR)
}

export const getLocks = (state: RootState) =>
  state.components.withdraw.withdrawLocks

export const getWithdrawalLocks = (state: RootState) => {
  const locksR = getLocks(state)

  return lift(
    (locksResponse: ExtractSuccess<typeof locksR>) => locksResponse.locks
  )(locksR)
}
