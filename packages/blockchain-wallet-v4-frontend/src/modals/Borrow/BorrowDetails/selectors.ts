import { lift } from 'ramda'

import {
  ExtractSuccess,
  SupportedWalletCurrenciesType
} from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const loanTransactionsR = selectors.components.borrow.getLoanTransactions(
    state
  )
  const ratesR = selectors.components.borrow.getRates(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)

  const transform = (
    loanTransactions: ExtractSuccess<typeof loanTransactionsR>,
    rates: ExtractSuccess<typeof ratesR>,
    supportedCoins: SupportedWalletCurrenciesType
  ) => ({
    loanTransactions,
    rates,
    supportedCoins
  })

  return lift(transform)(loanTransactionsR, ratesR, supportedCoinsR)
}
