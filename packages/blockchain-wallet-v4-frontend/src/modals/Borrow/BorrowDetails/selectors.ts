import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

const getData = (state: RootState) => {
  const loanTransactionsR = selectors.components.borrow.getLoanTransactions(state)
  const ratesR = selectors.components.borrow.getRates(state)

  const transform = (
    loanTransactions: ExtractSuccess<typeof loanTransactionsR>,
    rates: ExtractSuccess<typeof ratesR>
  ) => ({
    loanTransactions,
    rates
  })

  return lift(transform)(loanTransactionsR, ratesR)
}

export default getData
