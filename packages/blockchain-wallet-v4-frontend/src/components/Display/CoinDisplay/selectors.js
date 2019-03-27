import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { lift } from 'ramda'

export const getData = (coin, amount) => {
  const convert = (c, a) => {
    switch (c) {
      case 'PAX':
        return displayPaxFixed({ value: a, fromUnit: 'WEI', toUnit: 'PAX' })
      case 'ETH':
        return displayEthFixed({ value: a, fromUnit: 'WEI', toUnit: 'ETH' })
      case 'BCH':
        return Exchange.displayBchToBch({
          value: a,
          fromUnit: 'SAT',
          toUnit: 'BCH'
        })
      case 'BTC':
        return Exchange.displayBtcToBtc({
          value: a,
          fromUnit: 'SAT',
          toUnit: 'BTC'
        })
      case 'BSV':
        return Exchange.displayBsvToBsv({
          value: a,
          fromUnit: 'SAT',
          toUnit: 'BSV'
        })
      case 'XLM':
        return Exchange.displayXlmToXlm({
          value: a,
          fromUnit: 'STROOP',
          toUnit: 'XLM'
        })
    }
  }
  return lift(convert)(Remote.of(coin), Remote.of(amount))
}

const displayEthFixed = data => {
  const ethAmount = Exchange.convertEtherToEther(data)
  return Exchange.displayEtherToEther({
    value: Number(ethAmount.value).toFixed(8),
    fromUnit: 'ETH',
    toUnit: 'ETH'
  })
}

const displayPaxFixed = data => {
  const paxAmount = Exchange.convertPaxToPax(data)
  return Exchange.displayPaxToPax({
    value: Number(paxAmount.value).toFixed(8),
    fromUnit: 'PAX',
    toUnit: 'PAX'
  })
}
