import { lift, toLower } from 'ramda'

import { Exchange, Remote } from 'blockchain-wallet-v4/src'

import * as selectors from '../../selectors'

const selectRates = (coin, state) => {
  const { coinfig } = window.coins[coin]
  try {
    return coinfig.type.erc20Address
      ? selectors.core.data.eth.getErc20Rates(state, coin)
      : selectors.core.data[toLower(coin)].getRates(state)
  } catch (e) {
    return Remote.Failure('Unsupported Coin Code: Rates selector missing')
  }
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
