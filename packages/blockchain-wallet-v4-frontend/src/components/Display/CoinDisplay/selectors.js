import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { lift } from 'ramda'

export const getData = (coin, amount) => {
  const convert = (coin, value) =>
    Exchange.convertCoinToCoin({ value, coin, baseToStandard: true }).value
  return lift(convert)(Remote.of(coin), Remote.of(amount))
}
