import { selectors } from 'data'
import { lift, path } from 'ramda'
import { formValueSelector } from 'redux-form'
import { getPairFromCoin } from 'services/ShapeshiftService'
import { Remote } from 'blockchain-wallet-v4/src'

export const getData = state => {
  const accounts = formValueSelector('exchange')(state, 'accounts')
  const sourceCoin = path(['source', 'coin'], accounts) || 'BTC'
  const targetCoin = path(['target', 'coin'], accounts) || 'ETH'
  const btcRatesR = selectors.core.data.bitcoin.getRates(state)
  const ethRatesR = selectors.core.data.ethereum.getRates(state)
  const bchRatesR = selectors.core.data.bch.getRates(state)
  const pairR = selectors.core.data.shapeShift.getPair(getPairFromCoin(sourceCoin, targetCoin), state)

  switch (sourceCoin) {
    case 'BCH':
      switch (targetCoin) {
        case 'BTC': return lift((bchBtc, bchRates, btcRates) => ({ bchBtc, bchRates, btcRates }))(pairR, btcRatesR, ethRatesR)
        case 'ETH': return lift((bchEth, bchRates, ethRates) => ({ bchEth, bchRates, ethRates }))(pairR, btcRatesR, ethRatesR)
        default: return Remote.Failure(`Could not find pair [${sourceCoin}_${targetCoin}].`)
      }
    case 'BTC':
      switch (targetCoin) {
        case 'BCH': return lift((btcBch, btcRates, bchRates) => ({ btcBch, btcRates, bchRates }))(pairR, btcRatesR, bchRatesR)
        case 'ETH': return lift((btcEth, btcRates, ethRates) => ({ btcEth, btcRates, ethRates }))(pairR, btcRatesR, ethRatesR)
        default: return Remote.Failure(`Could not find pair [${sourceCoin}_${targetCoin}].`)
      }
    case 'ETH':
      switch (targetCoin) {
        case 'BCH': return lift((ethBch, ethRates, bchRates) => ({ ethBch, ethRates, bchRates }))(pairR, ethRatesR, bchRatesR)
        case 'BTC': return lift((ethBtc, ethRates, btcRates) => ({ ethBtc, ethRates, btcRates }))(pairR, ethRatesR, btcRatesR)
        default: return Remote.Failure(`Could not find pair [${sourceCoin}_${targetCoin}].`)
      }
    default: return Remote.Failure(`Could not find pair [${sourceCoin}_${targetCoin}].`)
  }
}
