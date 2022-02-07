import React from 'react'
import { BigNumber } from 'bignumber.js'
import { isEmpty, mapObjIndexed, path, prop } from 'ramda'
import * as StellarSdk from 'stellar-sdk'

import { Exchange, utils } from '@core'
import Currencies from '@core/exchange/currencies'
import { formatFiat } from '@core/exchange/utils'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { getEffectiveLimit, getEffectivePeriod } from 'services/custodial'

import { OverYourLimitMessage } from '../../../components'
import {
  InsufficientFundsMessage,
  InvalidAmountMessage,
  WrongIdMemoFormat,
  WrongTextMemoFormat
} from './validationMessages'

const currencySymbolMap = mapObjIndexed((value, code) => value.units[code].symbol, Currencies)

export const ACCOUNT_CREATION_ERROR = 'Not enough funds to create new account'
export const NO_FUNDS_ERROR = 'Wallet amount at base reserve'
export const RESERVE_ERROR = 'Remaining amount below base reserve'

export const insufficientFunds = (value, allValues, props) => {
  return props.effectiveBalance > 0 ? undefined : <InsufficientFundsMessage />
}

export const invalidAmount = (value) => {
  const valueXlm = prop('coin', value)
  const valueStroop = Exchange.convertCoinToCoin({
    baseToStandard: false,
    coin: 'XLM',
    value: valueXlm
  })
  return valueStroop > 0 ? undefined : <InvalidAmountMessage />
}

export const accountCreationAmount = (errors, allValues, props) => {
  const valueXlm = path(['amount', 'coin'], allValues)
  const reserveStroop = prop('reserve', props)
  if (!valueXlm || !reserveStroop) return errors
  const reserveXlm = Exchange.convertCoinToCoin({
    coin: 'XLM',
    value: reserveStroop
  })
  const destinationAccountExists = prop('destinationAccountExists', props)

  if (!destinationAccountExists && new BigNumber(valueXlm).isLessThan(reserveXlm))
    errors._error = { message: ACCOUNT_CREATION_ERROR, reserveXlm }

  return errors
}

export const balanceReserveAmount = (errors, allValues, props) => {
  const valueXlm = path(['amount', 'coin'], allValues)
  const valueStroop = Exchange.convertCoinToCoin({
    baseToStandard: false,
    coin: 'XLM',
    value: valueXlm
  })
  const effectiveBalance = prop('effectiveBalance', props)
  const reserve = prop('reserve', props)
  const fee = prop('fee', props)
  const reserveXlm = Exchange.convertCoinToCoin({
    coin: 'XLM',
    value: reserve
  })
  const effectiveBalanceXlm = Exchange.convertCoinToCoin({
    coin: 'XLM',
    value: new BigNumber.sum(effectiveBalance, fee)
  })
  const currency = prop('currency', props)
  const rates = prop('rates', props)
  const effectiveBalanceFiat = Exchange.convertCoinToFiat({
    coin: 'XLM',
    currency,
    effectiveBalanceXlm,
    isStandard: true,
    rates
  })
  if (effectiveBalance < 0)
    errors._error = {
      currency,
      currencySymbol: currencySymbolMap[currency],
      effectiveBalanceFiat,
      effectiveBalanceXlm,
      fee,
      message: NO_FUNDS_ERROR,
      rates,
      reserveXlm
    }
  else if (utils.xlm.overflowsEffectiveBalance(valueStroop, effectiveBalance))
    errors._error = {
      currency,
      currencySymbol: currencySymbolMap[currency],
      effectiveBalanceFiat,
      effectiveBalanceXlm,
      fee,
      message: RESERVE_ERROR,
      rates,
      reserveXlm
    }
  return errors
}

export const shouldError = ({ initialRender, nextProps, props, structure, values }) => {
  if (initialRender) {
    return true
  }
  return (
    initialRender ||
    !structure.deepEqual(values, nextProps.values) ||
    props.effectiveBalance !== nextProps.effectiveBalance
  )
}

export const shouldWarn = ({ initialRender, nextProps, props, structure, values }) => {
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

export const isSendLimitOver = (value, allValues, props) => {
  const { from, sendLimits } = props
  const fiatValue = prop('fiat', value)
  const isFromCustodial = from && from.type === 'CUSTODIAL'

  if (!isFromCustodial || isEmpty(sendLimits) || !sendLimits?.current?.available?.currency) {
    return undefined
  }

  const { currency, value: availableAmount } = sendLimits?.current?.available
  const availableAmountInBase = convertBaseToStandard('FIAT', availableAmount)

  const effectiveLimit = getEffectiveLimit(sendLimits)
  const effectivePeriod = getEffectivePeriod(sendLimits)

  return fiatValue > Number(availableAmountInBase) ? (
    <OverYourLimitMessage
      amount={formatFiat(availableAmountInBase)}
      currency={Currencies[currency].units[currency].symbol}
      limit={formatFiat(convertBaseToStandard('FIAT', effectiveLimit.limit.value), 0)}
      period={effectivePeriod}
    />
  ) : undefined
}
