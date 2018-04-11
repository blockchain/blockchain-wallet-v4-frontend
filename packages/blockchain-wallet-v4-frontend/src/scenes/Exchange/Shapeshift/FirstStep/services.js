import { isEmpty, isNil, path, prop } from 'ramda'
import BigNumber from 'bignumber.js'
import { getPairFromCoinCamel } from 'services/ShapeshiftService'

export const isRequired = (value) => !isEmpty(prop('source', value)) ? undefined : 'Invalid amount'

export const isAboveZero = (value) => value.source !== '' && new BigNumber(value.source).greaterThan('0') ? undefined : 'Invalid amount'

export const isAboveShapeshiftMinimum = (value, allValues, props) => {
  const sourceCoin = prop('sourceCoin', props)
  const targetCoin = prop('targetCoin', props)
  const source = prop('source', value)
  const pair = getPairFromCoinCamel(sourceCoin, targetCoin)
  const minimum = path([pair, 'minimum'], props)
  if (!source || !minimum) return 'Invalid minimum'
  return new BigNumber(source).greaterThanOrEqualTo(new BigNumber(minimum)) ? undefined : `Value is below the minimum limit (${minimum})`
}

export const isBelowShapeshiftMaximum = (value, allValues, props) => {
  const sourceCoin = prop('sourceCoin', props)
  const targetCoin = prop('targetCoin', props)
  const source = prop('source', value)
  const pair = getPairFromCoinCamel(sourceCoin, targetCoin)
  const maximum = path([pair, 'limit'], props)
  if (!source || !maximum) return 'Invalid maximum'
  return new BigNumber(source).lessThanOrEqualTo(new BigNumber(maximum)) ? undefined : `Value is above the maximum limit (${maximum})`
}

export const isBelowEffectiveBalance = (value, allValues, props) => {
  const source = prop('source', value)
  const effectiveBalance = prop('effectiveBalance', props)
  if (!source || !effectiveBalance) return 'Invalid effective balance'
  return new BigNumber(source).lessThanOrEqualTo(new BigNumber(effectiveBalance)) ? undefined : `Value is above your account effective balance (${effectiveBalance})`
}

export const shouldValidate = ({ values, nextProps, props, initialRender, structure }) => {
  return !nextProps.pristine &&
         (!isNil(nextProps.values) || !structure.deepEqual(props.values, nextProps.values))
}
