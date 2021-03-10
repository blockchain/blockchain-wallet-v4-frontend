import { curry, lift } from 'ramda'

import { CoinType, ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { RootState } from 'data/rootReducer'

export const getPaymentsAccountExchange = curry(
  (currency: CoinType, state: RootState) => {
    return state.components.send.exchangePaymentsAccount[currency].map(
      x => x.address
    )
  }
)

export const getPaymentsTradingAccountAddress = curry(
  (currency: CoinType, state: RootState) => {
    return state.components.send.tradingPaymentsAccount[currency].map(
      x => x.address
    )
  }
)

export const getWithdrawLockCheck = (state: RootState) =>
  state.components.send.withdrawLockCheck

export const getWithdrawLockCheckRule = (state: RootState) => {
  const lockCheckR = getWithdrawLockCheck(state)

  return lift((lockCheck: ExtractSuccess<typeof lockCheckR>) => lockCheck.rule)(
    lockCheckR
  )
}
