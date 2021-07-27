import { lift, toLower } from 'ramda'

import { CoinType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

export const getData = (state, ownProps) => {
  const { coin }: { coin: CoinType } = ownProps
  const currencyR = selectors.core.settings.getCurrency(state)
  const { coinfig } = window.coins[coin]
  let ratesR

  if (coinfig.type.erc20Address) {
    ratesR = selectors.core.data.eth.getErc20Rates(state, coin)
  } else if (selectors.core.data.coins.getCoins().includes(coin)) {
    ratesR = selectors.core.data.coins.getRates(coin, state)
  } else {
    ratesR = selectors.core.data[toLower(coin)].getRates(state)
  }

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
