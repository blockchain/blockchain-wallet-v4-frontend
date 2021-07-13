import { includes, lift, toLower } from 'ramda'

import { Exchange, Remote } from 'blockchain-wallet-v4/src'

import * as selectors from '../../selectors'

const selectRates = (coin, state) => {
  const erc20List = selectors.core.walletOptions
    .getErc20CoinList(state)
    .getOrFail()
  try {
    return includes(coin, erc20List)
      ? selectors.core.data.eth.getErc20Rates(state, toLower(coin))
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
        fromCoin: coin,
        value: 1,
        fromUnit: coin,
        toCurrency: currency,
        rates
      })
    }
  }

  return lift(transform)(ratesR, currencyR)
}
