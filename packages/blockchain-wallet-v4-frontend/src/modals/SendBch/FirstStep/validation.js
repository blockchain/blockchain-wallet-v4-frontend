import React from 'react'
import { prop } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'
import { MaximumAmountMessage, EmptyAccount } from './validationMessages'

export const maximumAmount = (value, allValues, props) => {
  const valueBch = prop('coin', value)
  const valueSatoshi = Exchange.convertBchToBch({ value: valueBch, fromUnit: 'BCH', toUnit: 'SAT' }).value
  return valueSatoshi <= props.effectiveBalance ? undefined : <MaximumAmountMessage />
}

export const emptyAccount = (value, allValues, props) => props.effectiveBalance > 0 ? undefined : <EmptyAccount />

export const shouldValidate = ({ values, nextProps, props, initialRender, structure }) => {
  if (initialRender) { return true }
  return initialRender || !structure.deepEqual(values, nextProps.values) || props.effectiveBalance !== nextProps.effectiveBalance
}
