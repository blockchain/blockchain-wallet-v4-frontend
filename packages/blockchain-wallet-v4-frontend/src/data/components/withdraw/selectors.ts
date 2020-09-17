import { lift } from 'ramda'

import { ExtractSuccess } from 'core/types'
import { RootState } from 'data/rootReducer'

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
