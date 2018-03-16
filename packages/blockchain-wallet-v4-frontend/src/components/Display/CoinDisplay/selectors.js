
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { lift } from 'ramda'

export const getData = (state, coin, amount) => {
  const convert = (c, a) => {
    console.log('convert', c, a)
    switch (c) {
      case 'ETH': return displayEtherFixed({ value: a, fromUnit: 'WEI', toUnit: 'ETH' })
      case 'BCH': return Exchange.displayBchToBch({ value: a, fromUnit: 'SAT', toUnit: 'BCH' })
      case 'BTC': return Exchange.displayBitcoinToBitcoin({ value: a, fromUnit: 'SAT', toUnit: 'BTC' })
    }
  }
  return lift(convert)(Remote.of(coin), Remote.of(amount))
}

const displayEtherFixed = (data) => {
  const etherAmount = Exchange.convertEtherToEther(data)
  return Exchange.displayEtherToEther({ value: Number(etherAmount.value).toFixed(8), fromUnit: 'ETH', toUnit: 'ETH' })
}
