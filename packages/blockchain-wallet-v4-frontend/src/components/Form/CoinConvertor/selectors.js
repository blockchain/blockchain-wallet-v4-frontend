import { Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import { lift } from 'ramda'

export const getData = (state, sourceCoin, targetCoin) => {
  const btcUnit = selectors.core.settings.getBtcUnit(state)
  const ethUnit = Remote.of('ETH')
  const currency = selectors.core.settings.getCurrency(state)
  const bitcoinRates = selectors.core.data.bitcoin.getRates(state)
  const ethereumRates = selectors.core.data.ethereum.getRates(state)
  const btcEth = selectors.core.data.shapeShift.getBtcEth(state)
  const ethBtc = selectors.core.data.shapeShift.getEthBtc(state)

  return lift((btcUnit, ethUnit, currency, bitcoinRates, ethereumRates, btcEth, ethBtc) =>
    ({ btcUnit, ethUnit, currency, bitcoinRates, ethereumRates, btcEth, ethBtc }))(btcUnit, ethUnit, currency, bitcoinRates, ethereumRates, btcEth, ethBtc)
}
