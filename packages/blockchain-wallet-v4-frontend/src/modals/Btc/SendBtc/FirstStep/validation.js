import React from 'react'
import { path, prop } from 'ramda'

import { Exchange, utils } from 'blockchain-wallet-v4/src'

import {
  AddressMatchesPriv,
  InsufficientFundsMessage,
  InvalidAmountMessage,
  MaximumAmountMessage,
  MaximumFeeMessage,
  MinimumAmountMessage,
  MinimumFeeMessage,
  MinimumOneSatoshiMessage
} from './validationMessages'

const DUST = 546

const getEffectiveBalance = props => {
  return Number(props.effectiveBalance)
}

export const insufficientFunds = (value, allValues, props) => {
  const effectiveBalance = getEffectiveBalance(props)
  return effectiveBalance > 0 && DUST <= effectiveBalance ? (
    undefined
  ) : (
    <InsufficientFundsMessage />
  )
}

export const invalidAmount = (value, allValues, props) => {
  const valueBtc = prop('coin', value)
  const valueSatoshi = Exchange.convertBtcToBtc({
    value: valueBtc,
    fromUnit: 'BTC',
    toUnit: 'SAT'
  }).value
  return valueSatoshi > 0 ? undefined : <InvalidAmountMessage />
}

export const minimumAmount = (value, allValues, props) => {
  const valueBtc = prop('coin', value)
  const valueSatoshi = Exchange.convertBtcToBtc({
    value: valueBtc,
    fromUnit: 'BTC',
    toUnit: 'SAT'
  }).value
  return parseInt(valueSatoshi) >= DUST ? undefined : <MinimumAmountMessage />
}

export const maximumAmount = (value, allValues, props) => {
  const effectiveBalance = getEffectiveBalance(props)
  const valueBtc = prop('coin', value)
  const valueSatoshi = Exchange.convertBtcToBtc({
    value: valueBtc,
    fromUnit: 'BTC',
    toUnit: 'SAT'
  }).value
  return valueSatoshi <= effectiveBalance ? undefined : <MaximumAmountMessage />
}

export const minimumFeePerByte = (value, allValues, props) =>
  value && parseInt(value) >= props.minFeePerByte ? (
    undefined
  ) : (
    <MinimumFeeMessage />
  )

export const minimumOneSatoshi = (value, allValues, props) =>
  value >= 1 ? undefined : <MinimumOneSatoshiMessage />

export const maximumFeePerByte = (value, allValues, props) =>
  value && parseInt(value) <= props.maxFeePerByte ? (
    undefined
  ) : (
    <MaximumFeeMessage />
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

export const isAddressDerivedFromPriv = (value, allValues, props) => {
  const format = utils.btc.detectPrivateKeyFormat(value)
  const address = path(['from', 'address'], allValues)
  const key = utils.btc.privateKeyStringToKey(value, format, props.network)
  return key.getAddress() === address ? undefined : <AddressMatchesPriv />
}
