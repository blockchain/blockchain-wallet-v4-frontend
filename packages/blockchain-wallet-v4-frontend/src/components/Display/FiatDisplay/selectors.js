import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { model, selectors } from 'data'
import { includes, lift, prop, toLower } from 'ramda'

const { ERC20_COIN_LIST } = model.coins

export const getData = (state, coin, amount) => {
  const currencyR = selectors.core.settings
    .getSettings(state)
    .map(prop('currency'))

  const getCoinRates = coin => {
    switch (true) {
      case coin === 'BCH':
        return selectors.core.data.bch.getRates(state)
      case coin === 'BTC':
        return selectors.core.data.btc.getRates(state)
      case coin === 'BSV':
        return selectors.core.data.bsv.getRates(state)
      case coin === 'ETH':
        return selectors.core.data.eth.getRates(state)
      case coin === 'XLM':
        return selectors.core.data.xlm.getRates(state)
      case includes(coin, ERC20_COIN_LIST):
        return selectors.core.data.eth.getErc20Rates(state, toLower(coin))
      default:
        return Remote.Failure('Unsupported Coin Code')
    }
  }

  const ratesR = getCoinRates(coin)

  const { value } = Exchange.convertCoinToCoin({
    value: amount,
    coin,
    baseToStandard: true
  })

  const convert = (currency, rates) =>
    Exchange.displayCoinToFiat({
      value,
      fromCoin: coin,
      fromUnit: coin,
      toCurrency: currency,
      rates
    })
  return lift(convert)(currencyR, ratesR)
}
