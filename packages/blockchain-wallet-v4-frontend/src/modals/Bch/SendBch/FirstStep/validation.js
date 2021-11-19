import React from 'react'
import { isEmpty, prop } from 'ramda'

import { Exchange } from '@core'
import Currencies from '@core/exchange/currencies'
import { formatFiat } from '@core/exchange/utils'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { getEffectiveLimit, getEffectivePeriod } from 'services/custodial'

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
