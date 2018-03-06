import { equals, prop } from 'ramda'
import BigNumber from 'bignumber.js'

export const calculateMinimum = props => {
  const { sourceCoin, targetCoin, btcEth, ethBtc } = props
  if (equals('BTC', sourceCoin) && equals('ETH', targetCoin)) return prop('minimum', btcEth)
  if (equals('ETH', sourceCoin) && equals('BTC', targetCoin)) return prop('minimum', ethBtc)
}

export const calculateMaximum = props => {
  const { sourceCoin, targetCoin, effectiveBalance, btcEth, ethBtc } = props
  const btcEthMaximum = prop('limit', btcEth)
  const ethBtcMaximum = prop('limit', ethBtc)
  if (equals('BTC', sourceCoin) && equals('ETH', targetCoin)) return new BigNumber(btcEthMaximum).greaterThan(new BigNumber(effectiveBalance)) ? effectiveBalance : btcEthMaximum
  if (equals('ETH', sourceCoin) && equals('BTC', targetCoin)) return new BigNumber(ethBtcMaximum).greaterThan(new BigNumber(effectiveBalance)) ? effectiveBalance : ethBtcMaximum
}
