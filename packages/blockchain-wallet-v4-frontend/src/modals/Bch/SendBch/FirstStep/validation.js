import { Exchange } from 'blockchain-wallet-v4/src'
import {
  InsufficientFundsMessage,
  InvalidAmountMessage,
  MaximumAmountMessage
} from './validationMessages'
import { prop } from 'ramda'
import React from 'react'

const getEffectiveBalance = props => {
  return Number(props.effectiveBalance)
}

export const insufficientFunds = (value, allValues, props) => {
  return getEffectiveBalance(props) > 0 ? (
    undefined
  ) : (
    <InsufficientFundsMessage />
  )
}

export const invalidAmount = (value, allValues, props) => {
  const valueBch = prop('coin', value)
  const valueSatoshi = Exchange.convertBchToBch({
    value: valueBch,
    fromUnit: 'BCH',
    toUnit: 'SAT'
  }).value
  return valueSatoshi > 0 ? undefined : <InvalidAmountMessage />
}

export const maximumAmount = (value, allValues, props) => {
  const valueBch = prop('coin', value)
  const valueSatoshi = Exchange.convertBchToBch({
    value: valueBch,
    fromUnit: 'BCH',
    toUnit: 'SAT'
  }).value
  return valueSatoshi <= getEffectiveBalance(props) ? (
    undefined
  ) : (
    <MaximumAmountMessage />
  )
}

export const shouldError = ({
  values,
  nextProps,
  props,
  initialRender,
  structure
}) => {
  if (initialRender) {
    return true
  }
  return (
    initialRender ||
    !structure.deepEqual(values, nextProps.values) ||
    props.effectiveBalance !== nextProps.effectiveBalance
  )
}
