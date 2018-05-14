import React from 'react'
import { prop } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'
import { InvalidAmountMessage, MaximumAmountMessage, InsufficientFundsMessage } from './validationMessages'

export const insufficientFunds = (value, allValues, props) => {
  return props.effectiveBalance > 0 ? undefined : <InsufficientFundsMessage />
}

export const invalidAmount = (value, allValues, props) => {
  const valueBch = prop('coin', value)
  const valueSatoshi = Exchange.convertBchToBch({ value: valueBch, fromUnit: 'BCH', toUnit: 'SAT' }).value
  return valueSatoshi > 0 ? undefined : <InvalidAmountMessage />
}

export const maximumAmount = (value, allValues, props) => {
  const valueBch = prop('coin', value)
  const valueSatoshi = Exchange.convertBchToBch({ value: valueBch, fromUnit: 'BCH', toUnit: 'SAT' }).value
  return valueSatoshi <= props.effectiveBalance ? undefined : <MaximumAmountMessage />
}

export const shouldValidate = ({ values, nextProps, props, initialRender, structure }) => {
  if (initialRender) { return true }
  return initialRender || !structure.deepEqual(values, nextProps.values) || props.effectiveBalance !== nextProps.effectiveBalance
}
