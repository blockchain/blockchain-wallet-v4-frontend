import { equals, path, prop } from 'ramda'
import BigNumber from 'bignumber.js'

export const isAboveShapeshiftMinimum = (value, allValues, props) => {
  console.log('isAboveShapeshitMimimum', value, allValues, props)
  const sourceCoin = prop('sourceCoin', props)
  const targetCoin = prop('targetCoin', props)
  const source = prop('source', value)
  const btcEthMinimum = path(['btcEth', 'minimum'], props)
  const ethBtcMinimum = path(['ethBtc', 'minimum'], props)
  if (equals('BTC', sourceCoin) && equals('ETH', targetCoin)) {
    if (new BigNumber(source).lessThan(new BigNumber(btcEthMinimum))) return `Value is below the minimum limit (${btcEthMinimum})`
  }
  if (equals('ETH', sourceCoin) && equals('BTC', targetCoin)) {
    if (new BigNumber(source).lessThan(new BigNumber(ethBtcMinimum))) return `Value is below the minimum limit (${ethBtcMinimum})`
  }
  return undefined
}

export const isBelowShapeshiftMaximum = (value, allValues, props) => {
  console.log('isBelowShapeshiftMaximum', value, allValues, props)
  const sourceCoin = prop('sourceCoin', props)
  const targetCoin = prop('targetCoin', props)
  const source = prop('source', value)
  const btcEthMaximum = path(['btcEth', 'maxLimit'], props)
  const ethBtcMaximum = path(['ethBtc', 'maxLimit'], props)
  if (equals('BTC', sourceCoin) && equals('ETH', targetCoin)) {
    if (new BigNumber(source).greaterThan(new BigNumber(btcEthMaximum))) return `Value is above the maximum limit (${btcEthMaximum})`
  }
  if (equals('ETH', sourceCoin) && equals('BTC', targetCoin)) {
    if (new BigNumber(source).greaterThan(new BigNumber(ethBtcMaximum))) return `Value is above the maximum limit (${ethBtcMaximum})`
  }
  return undefined
}

export const isWithinEffectiveBalance = (value, allValues, props) => {

}
