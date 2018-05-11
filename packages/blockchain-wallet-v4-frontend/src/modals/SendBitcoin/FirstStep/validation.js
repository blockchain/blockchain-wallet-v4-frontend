import React from 'react'
import { prop } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'
import { AddressMatchesPriv, MaximumAmountMessage, MaximumFeeMessage, MinimumAmountMessage, MinimumFeeMessage, InsufficientFundsMessage, InvalidAmountMessage } from './validationMessages'

const DUST = 546

export const insufficientFunds = (value, allValues, props) => {
  return props.effectiveBalance > 0 ? undefined : <InsufficientFundsMessage />
}

export const invalidAmount = (value, allValues, props) => {
  const valueBtc = prop('coin', value)
  const valueSatoshi = Exchange.convertBitcoinToBitcoin({ value: valueBtc, fromUnit: 'BTC', toUnit: 'SAT' }).value
  return valueSatoshi > 0 ? undefined : <InvalidAmountMessage />
}

export const minimumAmount = (value, allValues, props) => {
  const valueBtc = prop('coin', value)
  const valueSatoshi = Exchange.convertBitcoinToBitcoin({ value: valueBtc, fromUnit: 'BTC', toUnit: 'SAT' }).value
  return parseInt(valueSatoshi) >= DUST ? undefined : <MinimumAmountMessage />
}

export const maximumAmount = (value, allValues, props) => {
  const valueBtc = prop('coin', value)
  const valueSatoshi = Exchange.convertBitcoinToBitcoin({ value: valueBtc, fromUnit: 'BTC', toUnit: 'SAT' }).value
  return valueSatoshi <= props.effectiveBalance ? undefined : <MaximumAmountMessage />
}

export const minimumFeePerByte = (value, allValues, props) => value >= props.minFeePerByte ? undefined : <MinimumFeeMessage />

export const maximumFeePerByte = (value, allValues, props) => value <= props.maxFeePerByte ? undefined : <MaximumFeeMessage />

export const shouldValidate = ({ values, nextProps, props, initialRender, structure }) => {
  if (initialRender) { return true }
  return initialRender || !structure.deepEqual(values, nextProps.values) || props.effectiveBalance !== nextProps.effectiveBalance
}

export const isAddressDerivedFromPriv = (value, allValue, props) =>
  props.addressMatchesPriv ? undefined : <AddressMatchesPriv />
