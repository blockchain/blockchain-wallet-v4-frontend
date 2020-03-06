import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const limits = selectors.components.borrow.getLimits(state)
  const loanTransactionsR = selectors.components.borrow.getLoanTransactions(
    state
  )
  const paymentR = selectors.components.borrow.getPayment(state)
  const ratesR = selectors.components.borrow.getRates(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)

  const transform = (loanTransactions, payment, rates, supportedCoins) => ({
    loanTransactions,
    payment,
    rates,
    limits,
    supportedCoins
  })

  return lift(transform)(loanTransactionsR, paymentR, ratesR, supportedCoinsR)
}
