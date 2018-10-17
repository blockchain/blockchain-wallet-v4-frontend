import React from 'react'
import BigNumber from 'bignumber.js'
import { prop } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'
import {
  MaximumAmountMessage,
  InsufficientFundsMessage,
  InvalidAmountMessage
} from './validationMessages'

export const insufficientFunds = (value, allValues, props) => {
  return props.effectiveBalance > 0 ? undefined : <InsufficientFundsMessage />
}

export const invalidAmount = (value, allValues, props) => {
  const valueXlm = prop('coin', value)
  const valueStroop = Exchange.convertXlmToXlm({
    value: valueXlm,
    fromUnit: 'XLM',
    toUnit: 'STROOP'
  }).value
  return valueStroop > 0 ? undefined : <InvalidAmountMessage />
}

export const maximumAmount = (value, allValues, props) => {
  const valueXlm = prop('coin', value)
  const effectiveBalanceStroop = prop('effectiveBalance', props)
  const effectiveBalanceXlm = Exchange.convertXlmToXlm({
    value: effectiveBalanceStroop,
    fromUnit: 'STROOP',
    toUnit: 'XLM'
  }).value
  return new BigNumber(valueXlm).lessThanOrEqualTo(
    new BigNumber(effectiveBalanceXlm || 0)
  ) ? (
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

export const shouldWarn = ({
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
