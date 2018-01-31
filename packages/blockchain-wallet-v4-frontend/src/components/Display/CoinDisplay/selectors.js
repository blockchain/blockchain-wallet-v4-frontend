
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import { lift } from 'ramda'

export const getData = (state, coin, amount) => {
  const settings = selectors.core.settings.getSettings(state)
  const convert = (s, c, a) => c === 'BTC'
    ? Exchange.displayBitcoinToBitcoin({ value: a, fromUnit: 'SAT', toUnit: s.btc_currency })
    : displayEtherFixed({ value: a, fromUnit: 'WEI', toUnit: 'ETH' })
  return lift(convert)(settings, Remote.of(coin), Remote.of(amount))
}

const displayEtherFixed = (data) => {
  const etherAmount = Exchange.convertEtherToEther(data)
  return Exchange.displayEtherToEther({ value: Number(etherAmount.value).toFixed(8), fromUnit: 'ETH', toUnit: 'ETH' })
}
