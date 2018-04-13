import { path } from 'ramda'
import { getPairFromCoinCamel } from 'services/ShapeshiftService'
import BigNumber from 'bignumber.js'

export const calculateMinimum = props => {
  const pair = getPairFromCoinCamel(props.sourceCoin, props.targetCoin)
  return path([pair, 'minimum'], props)
}

export const calculateMaximum = props => {
  const pair = getPairFromCoinCamel(props.sourceCoin, props.targetCoin)
  const maximum = path([pair, 'limit'], props)
  return new BigNumber(maximum).greaterThan(new BigNumber(props.effectiveBalance)) ? props.effectiveBalance : maximum
}

export const isBalanceBelowMin = props => props.effectiveBalance && new BigNumber(calculateMinimum(props)).greaterThan(new BigNumber(props.effectiveBalance))
