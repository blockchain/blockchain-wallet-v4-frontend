import { lift } from 'ramda'

import {
  ExtractSuccess,
  FiatType,
  SupportedWalletCurrenciesType
} from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

const getData = (state: RootState) => {
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const interestRateR = selectors.components.interest.getInterestRate(state)
  const afterTransactionR = selectors.components.interest.getAfterTransaction(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  return lift(
    (
      supportedCoins: SupportedWalletCurrenciesType,
      interestRate: ExtractSuccess<typeof interestRateR>,
      afterTransaction: ExtractSuccess<typeof afterTransactionR>,
      walletCurrency: FiatType
    ) => ({
      afterTransaction,
      interestRate,
      supportedCoins,
      walletCurrency
    })
  )(supportedCoinsR, interestRateR, afterTransactionR, walletCurrencyR)
}

export default getData
