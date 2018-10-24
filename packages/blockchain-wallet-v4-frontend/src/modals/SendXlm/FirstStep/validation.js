import React from 'react'
import { BigNumber } from 'bignumber.js'
import { path, prop } from 'ramda'

import { Exchange, utils } from 'blockchain-wallet-v4/src'
import {
  MaximumAmountMessage,
  InsufficientFundsMessage,
  InvalidAmountMessage
} from './validationMessages'
import { currencySymbolMap } from 'services/CoinifyService'

export const ACCOUNT_CREATION_ERROR = 'Not enough funds to create new account'
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

  if (!destinationAccountExists && new BigNumber(valueXlm).lessThan(reserveXlm))
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
    value: new BigNumber(effectiveBalance).add(fee),
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
  if (
    !utils.xlm.overflowsFullBalance(valueStroop, effectiveBalance, reserve) &&
    utils.xlm.overflowsEffectiveBalance(valueStroop, effectiveBalance)
  )
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

export const maximumAmount = (value, allValues, props) => {
  const valueXlm = prop('coin', value)
  const valueStroop = Exchange.convertXlmToXlm({
    value: valueXlm,
    fromUnit: 'XLM',
    toUnit: 'STROOP'
  }).value
  const effectiveBalance = prop('effectiveBalance', props)
  const reserve = prop('reserve', props)
  if (utils.xlm.overflowsFullBalance(valueStroop, effectiveBalance, reserve))
    return <MaximumAmountMessage />
  return undefined
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
