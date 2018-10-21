import React from 'react'
import { BigNumber } from 'bignumber.js'
import { path, prop } from 'ramda'
import { Exchange, utils } from 'blockchain-wallet-v4/src'
import {
  MaximumAmountMessage,
  InsufficientFundsMessage,
  InvalidAmountMessage,
  ReserveMessage
} from './validationMessages'

export const ACCOUNT_CREATION_ERROR = 'Not enough funds to create new account'

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
    errors.amount = { message: ACCOUNT_CREATION_ERROR, amount: reserveXlm }

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
  if (utils.xlm.overflowsEffectiveBalance(valueStroop, effectiveBalance))
    return <ReserveMessage />
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
