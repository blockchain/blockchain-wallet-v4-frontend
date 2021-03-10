import React from 'react'
import { BigNumber } from 'bignumber.js'
import { mapObjIndexed, path, prop } from 'ramda'
import * as StellarSdk from 'stellar-sdk'

import { Exchange, utils } from 'blockchain-wallet-v4/src'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'

import {
  InsufficientFundsMessage,
  InvalidAmountMessage,
  WrongIdMemoFormat,
  WrongTextMemoFormat
} from './validationMessages'

const currencySymbolMap = mapObjIndexed(
  (value, code) => value.units[code].symbol,
  Currencies
)

export const ACCOUNT_CREATION_ERROR = 'Not enough funds to create new account'
export const NO_FUNDS_ERROR = 'Wallet amount at base reserve'
export const RESERVE_ERROR = 'Remaining amount below base reserve'

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

export const accountCreationAmount = (errors, allValues, props) => {
  const valueXlm = path(['amount', 'coin'], allValues)
  const reserveStroop = prop('reserve', props)
  if (!valueXlm || !reserveStroop) return errors
  const reserveXlm = Exchange.convertXlmToXlm({
    value: reserveStroop,
    fromUnit: 'STROOP',
    toUnit: 'XLM'
  }).value
  const destinationAccountExists = prop('destinationAccountExists', props)

  if (
    !destinationAccountExists &&
    new BigNumber(valueXlm).isLessThan(reserveXlm)
  )
    errors._error = { message: ACCOUNT_CREATION_ERROR, reserveXlm }

  return errors
}

export const balanceReserveAmount = (errors, allValues, props) => {
  const valueXlm = path(['amount', 'coin'], allValues)
  const valueStroop = Exchange.convertXlmToXlm({
    value: valueXlm,
    fromUnit: 'XLM',
    toUnit: 'STROOP'
  }).value
  const effectiveBalance = prop('effectiveBalance', props)
  const reserve = prop('reserve', props)
  const fee = prop('fee', props)
  const reserveXlm = Exchange.convertXlmToXlm({
    value: reserve,
    fromUnit: 'STROOP',
    toUnit: 'XLM'
  }).value
  const effectiveBalanceXlm = Exchange.convertXlmToXlm({
    value: new BigNumber.sum(effectiveBalance, fee),
    fromUnit: 'STROOP',
    toUnit: 'XLM'
  }).value
  const currency = prop('currency', props)
  const rates = prop('rates', props)
  const effectiveBalanceFiat = Exchange.convertXlmToFiat({
    value: effectiveBalanceXlm,
    fromUnit: 'XLM',
    toCurrency: currency,
    rates: prop('rates', props)
  }).value
  if (effectiveBalance < 0)
    errors._error = {
      currency,
      message: NO_FUNDS_ERROR,
      reserveXlm,
      effectiveBalanceXlm,
      effectiveBalanceFiat,
      currencySymbol: currencySymbolMap[currency],
      fee,
      rates
    }
  else if (utils.xlm.overflowsEffectiveBalance(valueStroop, effectiveBalance))
    errors._error = {
      currency,
      message: RESERVE_ERROR,
      reserveXlm,
      effectiveBalanceXlm,
      effectiveBalanceFiat,
      currencySymbol: currencySymbolMap[currency],
      fee,
      rates
    }
  return errors
}

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

export const validateMemo = (value, allValues) => {
  const memoType = prop('memoType', allValues)
  if (!value) return
  try {
    StellarSdk.Memo[memoType](value)
  } catch (e) {
    return 'error'
  }
}

export const validateMemoType = (value, allValues) => {
  const memo = prop('memo', allValues)
  if (!memo) return
  try {
    StellarSdk.Memo[value](memo)
  } catch (e) {
    if (value === 'text') return <WrongTextMemoFormat />
    if (value === 'id') return <WrongIdMemoFormat />
  }
}
