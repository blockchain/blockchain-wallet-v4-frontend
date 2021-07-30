import { lift, toLower } from 'ramda'

import { Exchange } from 'blockchain-wallet-v4/src'

import * as selectors from '../../selectors'

const selectRates = (coin, state) => {
  const { coinfig } = window.coins[coin]

  if (coinfig.type.erc20Address) {
    return selectors.core.data.eth.getErc20Rates(state, coin)
  }
  if (selectors.core.data.coins.getCoins().includes(coin)) {
    return selectors.core.data.coins.getRates(coin, state)
  }
  return selectors.core.data[toLower(coin)].getRates(state)
}

export const getData = (coin, state) => {
  const ratesR = selectRates(coin, state)
  const currencyR = selectors.core.settings.getCurrency(state)

  const transform = (rates, currency) => {
    return {
      coin: `1 ${coin}`,
      fiat: Exchange.displayCoinToFiat({
        rates,
        toCurrency: currency,
        value: 1
      })
    }
  }

  return lift(transform)(ratesR, currencyR)
}

export default getData
