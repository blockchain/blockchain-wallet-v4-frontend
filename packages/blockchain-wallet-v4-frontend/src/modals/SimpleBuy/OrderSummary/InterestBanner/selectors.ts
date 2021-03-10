import { lift } from 'ramda'

import {
  ExtractSuccess,
  SupportedWalletCurrenciesType
} from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const interestRateR = selectors.components.interest.getInterestRate(state)
  const afterTransactionR = selectors.components.interest.getAfterTransaction(
    state
  )

  return lift(
    (
      supportedCoins: SupportedWalletCurrenciesType,
      interestRate: ExtractSuccess<typeof interestRateR>,
      afterTransaction: ExtractSuccess<typeof afterTransactionR>
    ) => ({
      supportedCoins,
      interestRate,
      afterTransaction
    })
  )(supportedCoinsR, interestRateR, afterTransactionR)
}
