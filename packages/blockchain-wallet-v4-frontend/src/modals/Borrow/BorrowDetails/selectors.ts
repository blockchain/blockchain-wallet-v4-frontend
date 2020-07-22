import { ExtractSuccess, SupportedWalletCurrenciesType } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

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
