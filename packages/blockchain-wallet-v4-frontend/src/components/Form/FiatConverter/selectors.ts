import { lift } from 'ramda'

import { CoinType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

export const getData = (state, ownProps) => {
  const { coin }: { coin: CoinType } = ownProps
  const currencyR = selectors.core.settings.getCurrency(state)
  const ratesR = selectors.core.data.coins.getRates(coin, state)

  const transform = (currency, rates) => ({
    coinTicker: coin,
    currency,
    rates,
    unit: coin
  })
  // @ts-ignore
  return lift(transform)(currencyR, ratesR)
}

export default getData
