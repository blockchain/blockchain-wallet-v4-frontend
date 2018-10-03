import React from 'react'
import { path, prop } from 'ramda'
import { Exchange, utils } from 'blockchain-wallet-v4/src'
import {
  AddressMatchesPriv,
  MaximumAmountMessage,
  MaximumFeeMessage,
  MinimumAmountMessage,
  MinimumFeeMessage,
  MinimumOneSatoshiMessage,
  InsufficientFundsMessage,
  InvalidAmountMessage
} from './validationMessages'

const DUST = 546

export const insufficientFunds = (value, allValues, props) => {
  return props.effectiveBalance > 0 && DUST <= props.effectiveBalance ? (
    undefined
  ) : (
    <InsufficientFundsMessage />
  )
}

export const invalidAmount = (value, allValues, props) => {
  const valueBtc = prop('coin', value)
  const valueSatoshi = Exchange.convertBitcoinToBitcoin({
    value: valueBtc,
    fromUnit: 'BTC',
    toUnit: 'SAT'
  }).value
  return valueSatoshi > 0 ? undefined : <InvalidAmountMessage />
}

export const minimumAmount = (value, allValues, props) => {
  const valueBtc = prop('coin', value)
  const valueSatoshi = Exchange.convertBitcoinToBitcoin({
    value: valueBtc,
    fromUnit: 'BTC',
    toUnit: 'SAT'
  }).value
  return parseInt(valueSatoshi) >= DUST ? undefined : <MinimumAmountMessage />
}

export const maximumAmount = (value, allValues, props) => {
  const valueBtc = prop('coin', value)
  const valueSatoshi = Exchange.convertBitcoinToBitcoin({
    value: valueBtc,
    fromUnit: 'BTC',
    toUnit: 'SAT'
  }).value
  return valueSatoshi <= props.effectiveBalance ? (
    undefined
  ) : (
    <MaximumAmountMessage />
  )
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

export const isAddressDerivedFromPriv = (value, allValues, props) => {
  const format = utils.bitcoin.detectPrivateKeyFormat(value)
  const address = path(['from', 'address'], allValues)
  const key = utils.bitcoin.privateKeyStringToKey(value, format, props.network)
  return key.getAddress() === address ? undefined : <AddressMatchesPriv />
}
