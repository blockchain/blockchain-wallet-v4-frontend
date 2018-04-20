import { isEmpty } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'

export const maximumAmount = (value, allValues, props) => {
  const valueSatoshi = Exchange.convertBchToBch({ value, fromUnit: 'BCH', toUnit: 'SAT' }).value
  const effectiveBalanceBch = Exchange.convertBchToBch({ value: props.effectiveBalance, fromUnit: 'SAT', toUnit: 'BCH' }).value
  return valueSatoshi <= props.effectiveBalance ? undefined : `Use total available minus fee: ${effectiveBalanceBch} BCH.`
}

export const emptyAmount = (value, allValues, props) => !isEmpty(props.coins) ? undefined : 'Invalid amount. Account is empty.'
