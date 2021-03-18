import { lift } from 'ramda'

import {
  ExtractSuccess,
  FiatType,
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
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  return lift(
    (
      supportedCoins: SupportedWalletCurrenciesType,
      interestRate: ExtractSuccess<typeof interestRateR>,
      afterTransaction: ExtractSuccess<typeof afterTransactionR>,
      walletCurrency: FiatType
    ) => ({
      supportedCoins,
      interestRate,
      afterTransaction,
      walletCurrency
    })
  )(supportedCoinsR, interestRateR, afterTransactionR, walletCurrencyR)
}
