import { selectors } from 'data'
import { equals, lift, path } from 'ramda'

export const getData = (state, accounts) => {
  const sourceCoin = path(['source', 'coin'], accounts) || 'BTC'
  const targetCoin = path(['target', 'coin'], accounts) || 'ETH'
  const btcRatesR = selectors.core.data.bitcoin.getRates(state)
  const ethRatesR = selectors.core.data.ethereum.getRates(state)
  const btcFeeR = selectors.core.data.bitcoin.getFee(state)
  const ethFeeR = selectors.core.data.ethereum.getFee(state)
  const btcEthR = selectors.core.data.shapeShift.getBtcEth(state)
  const ethBtcR = selectors.core.data.shapeShift.getEthBtc(state)

  if (equals('BTC', sourceCoin) && equals('ETH', targetCoin)) {
    return lift((btcFee, btcEth, btcRates, ethRates) => ({ btcFee, btcEth, btcRates, ethRates }))(btcFeeR, btcEthR, btcRatesR, ethRatesR)
  }
  if (equals('ETH', sourceCoin) && equals('BTC', targetCoin)) {
    return lift((ethFee, ethBtc, btcRates, ethRates) => ({ ethFee, ethBtc, btcRates, ethRates }))(ethFeeR, ethBtcR, btcRatesR, ethRatesR)
  }
}
