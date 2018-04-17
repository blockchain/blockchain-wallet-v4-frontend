import { isEmpty } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'

const DUST = 546

const DUST_BTC = '0.00000546'

export const minimumAmount = (value, allValues, props) => {
  const valueSatoshi = Exchange.convertBitcoinToBitcoin({ value, fromUnit: 'BTC', toUnit: 'SAT' }).value
  return parseInt(valueSatoshi) >= DUST ? undefined : `The minimum amount required to send is ${DUST_BTC}.`
}

export const maximumAmount = (value, allValues, props) => {
  const valueSatoshi = Exchange.convertBitcoinToBitcoin({ value, fromUnit: 'BTC', toUnit: 'SAT' }).value
  const effectiveBalanceBtc = Exchange.convertBitcoinToBitcoin({ value: props.effectiveBalance, fromUnit: 'SAT', toUnit: 'BTC' }).value
  return valueSatoshi <= props.effectiveBalance ? undefined : `Use total available minus fee: ${effectiveBalanceBtc} BTC.`
}

export const emptyAmount = (value, allValues, props) => !isEmpty(props.coins) ? undefined : 'Invalid amount. Account is empty.'
