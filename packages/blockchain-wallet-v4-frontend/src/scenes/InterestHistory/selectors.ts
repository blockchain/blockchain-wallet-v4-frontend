import { lift } from 'ramda'

import { ExtractSuccess, FiatType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

export const getData = (state) => {
  const ratesR = selectors.components.interest.getRates(state)
  const txPages = selectors.components.interest.getInterestTransactions(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  const transform = (rates: ExtractSuccess<typeof ratesR>, walletCurrency: FiatType) => ({
    rates,
    txPages,
    walletCurrency
  })
  return lift(transform)(ratesR, walletCurrencyR)
}

export default getData
