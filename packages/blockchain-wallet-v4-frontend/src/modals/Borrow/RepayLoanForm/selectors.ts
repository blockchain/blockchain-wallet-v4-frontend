import { lift } from 'ramda'

import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const limits = selectors.components.borrow.getLimits(state)
  const loanTransactionsR = selectors.components.borrow.getLoanTransactions(state)
  const paymentR = selectors.components.borrow.getPayment(state)
  const ratesR = selectors.components.borrow.getRates(state)

  const transform = (loanTransactions, payment, rates) => ({
    limits,
    loanTransactions,
    payment,
    rates
  })

  return lift(transform)(loanTransactionsR, paymentR, ratesR)
}

export default getData
