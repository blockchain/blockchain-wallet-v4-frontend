import { lift } from 'ramda'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import * as selectors from '../../selectors'

const selectRates = (coin, state) => {
  switch (coin) {
    case 'BCH': return selectors.core.data.bch.getRates(state)
    case 'BTC': return selectors.core.data.bitcoin.getRates(state)
    case 'ETH': return selectors.core.data.ethereum.getRates(state)
    default: return Remote.Failure(`Could not find rates for coin ${coin}.`)
  }
}

const convertCoinToFiat = (coin, rates, currency) => {
  switch (coin) {
    case 'BCH': return Exchange.displayBchToFiat({ value: 1, fromUnit: 'BCH', toCurrency: currency, rates })
    case 'BTC': return Exchange.displayBitcoinToFiat({ value: 1, fromUnit: 'BTC', toCurrency: currency, rates })
    case 'ETH': return Exchange.displayEtherToFiat({ value: 1, fromUnit: 'ETH', toCurrency: currency, rates })
    default: return Remote.Failure(`Could not convert coin ${coin} to fiat.`)
  }
}

export const getData = (coin, state) => {
  const ratesR = selectRates(coin, state)
  const currencyR = selectors.core.settings.getCurrency(state)

  const transform = (rates, currency) => ({
    coin: `1 ${coin}`,
    fiat: convertCoinToFiat(coin, rates, currency)
  })

  return lift(transform)(ratesR, currencyR)
}
