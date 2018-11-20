import React from 'react'
import BigNumber from 'bignumber.js'
import { prop } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'
import {
  MaximumAmountMessage,
  InsufficientFundsMessage,
  InvalidAmountMessage,
  MinimumFeeMessage,
  MaximumFeeMessage
} from './validationMessages'

export const insufficientFunds = (value, allValues, props) => {
  return props.effectiveBalance > 0 ? undefined : <InsufficientFundsMessage />
}

export const invalidAmount = (value, allValues, props) => {
  const valueEth = prop('coin', value)
  const valueWei = Exchange.convertEtherToEther({
    value: valueEth,
    fromUnit: 'ETH',
    toUnit: 'WEI'
  }).value
  return valueWei > 0 ? undefined : <InvalidAmountMessage />
}

export const maximumAmount = (value, allValues, props) => {
  try {
    const valueEth = prop('coin', value)
    const effectiveBalanceWei = prop('effectiveBalance', props)
    const effectiveBalanceEth = Exchange.convertEtherToEther({
      value: effectiveBalanceWei,
      fromUnit: 'WEI',
      toUnit: 'ETH'
    }).value
    return new BigNumber(valueEth).lessThanOrEqualTo(
      new BigNumber(effectiveBalanceEth || 0)
    ) ? (
      undefined
    ) : (
      <MaximumAmountMessage />
    )
  } catch (e) {}
}

export const minimumFee = (value, allValues, props) =>
  value && parseInt(value) >= props.minFee ? undefined : <MinimumFeeMessage />

export const maximumFee = (value, allValues, props) =>
  value && parseInt(value) <= props.maxFee ? undefined : <MaximumFeeMessage />

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
