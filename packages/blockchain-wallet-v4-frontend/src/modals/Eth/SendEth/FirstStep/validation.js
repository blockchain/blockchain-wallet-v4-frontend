import React from 'react'
import BigNumber from 'bignumber.js'
import { prop } from 'ramda'

import { Exchange } from 'blockchain-wallet-v4/src'

import {
  InsufficientFundsMessage,
  InvalidAmountMessage,
  MaximumAmountMessage,
  MaximumFeeMessage,
  MinimumFeeMessage
} from './validationMessages'

export const insufficientFunds = (value, allValues, props) => {
  return props.effectiveBalance > 0 ? undefined : <InsufficientFundsMessage />
}

export const invalidAmount = (value, allValues, props) => {
  const valueEth = prop('coin', value)
  const valueWei = Exchange.convertCoinToCoin({
    value: valueEth,
    baseToStandard: false,
    coin: 'ETH'
  })
  return valueWei > 0 ? undefined : <InvalidAmountMessage />
}

export const maximumAmount = (value, allValues, props) => {
  try {
    const coinValue = prop('coin', value)
    const coin = prop('coin', props)
    const effectiveBalanceWei = prop('effectiveBalance', props)
    const effectiveBalance = Exchange.convertCoinToCoin({
      value: effectiveBalanceWei,
      coin
    })
    return new BigNumber(coinValue).isLessThanOrEqualTo(
      new BigNumber(effectiveBalance || 0)
    ) ? (
      undefined
    ) : (
      <MaximumAmountMessage coin={props.coin} />
    )
  } catch (e) {}
}

export const minimumFee = (value, allValues, props) =>
  value && parseInt(value) >= props.minFee ? (
    undefined
  ) : (
    <MinimumFeeMessage coin={props.coin} />
  )

export const maximumFee = (value, allValues, props) =>
  value && parseInt(value) <= props.maxFee ? (
    undefined
  ) : (
    <MaximumFeeMessage coin={props.coin} />
  )

export const shouldError = ({
  initialRender,
  nextProps,
  props,
  structure,
  values
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
  initialRender,
  nextProps,
  props,
  structure,
  values
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
