import { lift } from 'ramda'

import { CoinType } from '@core/types'
import { selectors } from 'data'

export const getData = (state, ownProps) => {
  const { coin }: { coin: CoinType } = ownProps
  const { coinfig } = window.coins[coin]
  const currencyR = selectors.core.settings.getCurrency(state)
  const ratesR = selectors.core.data.coins.getRates(coin, state)

  const transform = (currency, rates) => ({
    coinTicker: coinfig.displaySymbol,
    currency,
    rates,
    unit: coin
  })

  return lift(transform)(currencyR, ratesR)
}

export default getData
