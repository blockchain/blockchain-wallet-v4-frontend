import { lift } from 'ramda'

import { ExtractSuccess, FiatType } from '@core/types'
import { selectors } from 'data'

export const getData = (state) => {
  const ratesR = selectors.components.interest.getRates(state)
  const txPages = selectors.components.interest.getEarnTransactions(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  const transform = (rates: ExtractSuccess<typeof ratesR>, walletCurrency: FiatType) => ({
    rates,
    txPages,
    walletCurrency
  })
  return lift(transform)(ratesR, walletCurrencyR)
}

export default getData
