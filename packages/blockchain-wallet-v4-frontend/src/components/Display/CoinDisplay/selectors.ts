import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { lift } from 'ramda'

export const getData = (coin, amount, hideCoinTicker) => {
  const convert = (coin, value) =>
    hideCoinTicker
      ? Exchange.convertCoinToCoin({ value, coin, baseToStandard: true }).value
      : Exchange.displayCoinToCoin(value, coin)
  return lift(convert)(Remote.of(coin), Remote.of(amount))
}
