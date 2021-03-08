import { lift } from 'ramda'

import { ExtractSuccess, SupportedWalletCurrenciesType } from 'core/types'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

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
