import React from 'react'
import BigNumber from 'bignumber.js'
import { isEmpty, prop } from 'ramda'

import { Exchange } from '@core'
import Currencies from '@core/exchange/currencies'
import { formatFiat } from '@core/exchange/utils'
import { convertBaseToStandard } from 'data/components/exchange/services'

import { OverYourLimitMessage } from '../../../components'
import {
  InsufficientFundsMessage,
  InvalidAmountMessage,
  MaximumAmountMessage,
  MaximumFeeMessage,
  MinimumFeeMessage
} from './validationMessages'

// eslint-disable-next-line
export const insufficientFunds = (value, allValues, props) => {
  return props.effectiveBalance > 0 ? undefined : <InsufficientFundsMessage />
}

// eslint-disable-next-line
export const invalidAmount = (value, allValues, props) => {
  const valueEth = prop('coin', value)
  const valueWei = Exchange.convertCoinToCoin({
    baseToStandard: false,
    coin: 'ETH',
    value: valueEth
  })
  return valueWei > 0 ? undefined : <InvalidAmountMessage />
}

export const maximumAmount = (value, allValues, props) => {
  try {
    const coinValue = prop('coin', value)
    const coin = prop('coin', props)
    const effectiveBalanceWei = prop('effectiveBalance', props)
    const effectiveBalance = Exchange.convertCoinToCoin({
      coin,
      value: effectiveBalanceWei
    })
    return new BigNumber(coinValue).isLessThanOrEqualTo(
      new BigNumber(effectiveBalance || 0)
    ) ? undefined : (
      <MaximumAmountMessage coin={props.coin} />
    )
  } catch (e) {
    // do nothing
  }
}

export const minimumFee = (value, allValues, props) =>
  value && parseInt(value) >= props.minFee ? undefined : <MinimumFeeMessage coin={props.coin} />

export const maximumFee = (value, allValues, props) =>
  value && parseInt(value) <= props.maxFee ? undefined : <MaximumFeeMessage coin={props.coin} />

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

export const isSendLimitOver = (value, allValues, props) => {
  const { from, sendLimits } = props
  const fiatValue = prop('fiat', value)
  const isFromCustodial = from && from.type === 'CUSTODIAL'

  if (!isFromCustodial || isEmpty(sendLimits) || !sendLimits?.current?.available?.currency) {
    return undefined
  }

  const { currency, value: availableAmount } = sendLimits?.current?.available
  const availableAmountInBase = convertBaseToStandard('FIAT', availableAmount)

  return fiatValue > Number(availableAmountInBase) ? (
    <OverYourLimitMessage
      amount={formatFiat(availableAmountInBase)}
      currency={Currencies[currency].units[currency].symbol}
    />
  ) : undefined
}
