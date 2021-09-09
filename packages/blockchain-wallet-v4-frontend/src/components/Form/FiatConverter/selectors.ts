import { lift } from 'ramda'

import { CoinType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

export const getData = (state, ownProps) => {
  const { coin }: { coin: CoinType } = ownProps
  const { coinfig } = window.coins[coin]
  const currencyR = selectors.core.settings.getCurrency(state)
  const ratesR = selectors.core.data.coins.getRates(coin, state)
  const rates = ratesR.getOrElse({ price: 1 })

  const transform = (currency) => ({
    coinTicker: coinfig.displaySymbol,
    currency,
    rates,
    unit: coin
  })
  // @ts-ignore
  return lift(transform)(currencyR)
}

export default getData
