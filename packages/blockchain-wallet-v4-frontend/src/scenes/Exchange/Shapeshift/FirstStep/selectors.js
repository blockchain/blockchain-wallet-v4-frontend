import { selectors } from 'data'
import { equals, lift, path } from 'ramda'
import { formValueSelector } from 'redux-form'

export const getData = state => {
  const accounts = formValueSelector('exchange')(state, 'accounts')
  const sourceCoin = path(['source', 'coin'], accounts)
  const targetCoin = path(['target', 'coin'], accounts)
  const btcRatesR = selectors.core.data.bitcoin.getRates(state)
  const ethRatesR = selectors.core.data.ethereum.getRates(state)
  const btcEthR = selectors.core.data.shapeShift.getBtcEth(state)
  const ethBtcR = selectors.core.data.shapeShift.getEthBtc(state)

  if (equals('BTC', sourceCoin) && equals('ETH', targetCoin)) return lift((btcEth, btcRates, ethRates) => ({ btcEth, btcRates, ethRates }))(btcEthR, btcRatesR, ethRatesR)
  if (equals('ETH', sourceCoin) && equals('BTC', targetCoin)) return lift((ethBtc, btcRates, ethRates) => ({ ethBtc, btcRates, ethRates }))(ethBtcR, btcRatesR, ethRatesR)
}
