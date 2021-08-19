import { Exchange } from 'blockchain-wallet-v4/src'

export const getData = (coin, amount, hideCoinTicker) => {
  const { coinfig } = window.coins[coin]

  return hideCoinTicker
    ? Exchange.convertCoinToCoin({ coin, isFiat: coinfig.type.isFiat, value: amount })
    : Exchange.displayCoinToCoin({ coin, isFiat: coinfig.type.isFiat, value: amount })
}

export default getData
