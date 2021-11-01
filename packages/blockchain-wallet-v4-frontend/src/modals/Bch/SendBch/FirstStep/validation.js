import React from 'react'
import { isEmpty, prop } from 'ramda'

import { Exchange } from '@core'
import Currencies from '@core/exchange/currencies'
import { formatFiat } from '@core/exchange/utils'

import { OverYourLimitMessage } from '../../../components'
import {
  InsufficientFundsMessage,
  InvalidAmountMessage,
  MaximumAmountMessage
} from './validationMessages'

const getEffectiveBalance = (props) => {
  return Number(props.effectiveBalance)
}

export const insufficientFunds = (value, allValues, props) => {
  return getEffectiveBalance(props) > 0 ? undefined : <InsufficientFundsMessage />
}

export const invalidAmount = (value, allValues, props) => {
  const valueBch = prop('coin', value)
  const valueSatoshi = Exchange.convertCoinToCoin({
    baseToStandard: false,
    coin: 'BCH',
    value: valueBch
  })
  return valueSatoshi > 0 ? undefined : <InvalidAmountMessage />
}

export const maximumAmount = (value, allValues, props) => {
  const valueBch = prop('coin', value)
  const valueSatoshi = Exchange.convertCoinToCoin({
    baseToStandard: false,
    coin: 'BCH',
    value: valueBch
  })
  return valueSatoshi <= getEffectiveBalance(props) ? undefined : <MaximumAmountMessage />
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

export const isSendLimitOver = (value, allValues, props) => {
  const { from, sendLimits } = props
  const fiatValue = prop('fiat', value)
  const isFromCustodial = from && from.type === 'CUSTODIAL'

  if (!isFromCustodial || isEmpty(sendLimits) || isEmpty(sendLimits?.globalLimit?.available)) {
    return undefined
  }

  const { currency, value: availableAmount } = sendLimits?.globalLimit?.available

  return fiatValue > Number(availableAmount) ? (
    <OverYourLimitMessage
      amount={formatFiat(availableAmount)}
      currency={Currencies[currency].units[currency].symbol}
    />
  ) : undefined
}
