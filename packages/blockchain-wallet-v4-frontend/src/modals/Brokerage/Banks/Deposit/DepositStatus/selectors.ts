import { lift } from 'ramda'

import {
  FiatType,
  SupportedWalletCurrenciesType
} from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const walletCurrencyR = selectors.core.settings.getCurrency(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const supportedCoins = supportedCoinsR.getOrElse(
    {} as SupportedWalletCurrenciesType
  )

  return lift((walletCurrency: FiatType) => ({
    walletCurrency,
    supportedCoins,
    // TODO find a way to grab this
    amount: 0,
    completeDate: 'TODO'
  }))(walletCurrencyR)
}
